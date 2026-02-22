import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '@/config/axios';
import Sidebar from '@/Whatsapp/Sidebar';
import ChatArea from '@/Whatsapp/ChatArea';
import VideoCall from '@/Whatsapp/Viedocall';
import Phonecall from '@/Whatsapp/Phonecall';
import API_URL, { API_ENDPOINTS } from '@/config/api';
import { socket } from '@/lib/socket';
import { useCallStore } from '@/store/useCallStore';

const formatLastSeen = (date) => {
  if (!date) return 'unknown';
  const now = new Date();
  const lastSeen = new Date(date);
  const diffMs = now - lastSeen;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;

  return lastSeen.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: lastSeen.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

const getAvatarUrl = (profileImage) => {
  if (!profileImage) return null;
  return `${API_URL}/${profileImage.replace(/\\/g, '/')}`;
};

const getIceServers = () => {
  const servers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];
  if (import.meta.env.VITE_TURN_URL && import.meta.env.VITE_TURN_USERNAME && import.meta.env.VITE_TURN_CREDENTIAL) {
    servers.push({
      urls: import.meta.env.VITE_TURN_URL,
      username: import.meta.env.VITE_TURN_USERNAME,
      credential: import.meta.env.VITE_TURN_CREDENTIAL,
    });
  }
  return servers;
};

const Conversation = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [notifications, setNotifications] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStatuses, setUserStatuses] = useState({});

  const {
    activeChatId,
    unreadByChat,
    callId,
    callType,
    callState,
    isIncoming,
    isOutgoing,
    peer,
    localStream,
    remoteStream,
    startedAt,
    setActiveChatId,
    incrementUnread,
    resetUnread,
    startOutgoingCall,
    setIncomingCall,
    patchCall,
    setLocalStream,
    setRemoteStream,
    clearCall,
  } = useCallStore();

  const chatsRef = useRef([]);
  const typingTimeoutsRef = useRef(new Map());
  const receivedMessageIdsRef = useRef(new Set());
  const notifiedMessageIdsRef = useRef(new Set());
  const peerConnectionRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const handledAnswerCallIdsRef = useRef(new Set());
  const callTimerRef = useRef(null);
  const [callDurationSec, setCallDurationSec] = useState(0);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    const totalUnread = Object.values(unreadByChat).reduce((sum, n) => sum + (n || 0), 0);
    document.title = totalUnread > 0 ? `(${totalUnread}) Chatify` : 'Chatify';
  }, [unreadByChat]);

  useEffect(() => {
    if (startedAt && callState === 'in_call') {
      setCallDurationSec(Math.floor((Date.now() - startedAt) / 1000));
      callTimerRef.current = setInterval(() => {
        setCallDurationSec(Math.floor((Date.now() - startedAt) / 1000));
      }, 1000);
    } else {
      setCallDurationSec(0);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [startedAt, callState]);

  const callDuration = `${Math.floor(callDurationSec / 60).toString().padStart(2, '0')}:${(callDurationSec % 60)
    .toString()
    .padStart(2, '0')}`;

  const triggerBrowserNotification = (title, body = '') => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    try {
      new Notification(title, { body });
    } catch (err) {
      console.error('Browser notification failed:', err);
    }
  };

  const showNotification = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const cleanupMediaAndPeer = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.onconnectionstatechange = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStream) localStream.getTracks().forEach((t) => t.stop());
    if (remoteStream) remoteStream.getTracks().forEach((t) => t.stop());

    setLocalStream(null);
    setRemoteStream(null);
    pendingCandidatesRef.current = [];
    handledAnswerCallIdsRef.current.clear();
  };

  const ensureLocalStream = async (type) => {
    if (localStream) return localStream;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video:
        type === 'video'
          ? {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30, max: 30 },
              facingMode: 'user',
            }
          : false,
    });
    setLocalStream(stream);
    return stream;
  };

  const setAudioCodecAndBitrate = (pc, sender, track) => {
    if (track.kind !== 'audio') return;
    const transceiver = pc.getTransceivers().find((t) => t.sender === sender);
    const capabilities = window.RTCRtpSender?.getCapabilities?.('audio');
    const opus = capabilities?.codecs?.filter((c) => c.mimeType?.toLowerCase() === 'audio/opus') || [];
    const others = capabilities?.codecs?.filter((c) => c.mimeType?.toLowerCase() !== 'audio/opus') || [];
    if (transceiver?.setCodecPreferences && opus.length) {
      transceiver.setCodecPreferences([...opus, ...others]);
    }

    const params = sender.getParameters?.() || {};
    params.encodings = params.encodings || [{}];
    params.encodings[0].maxBitrate = 64000;
    sender.setParameters?.(params).catch(() => {});
  };

  const setVideoBitrate = (sender, track) => {
    if (track.kind !== 'video') return;
    const params = sender.getParameters?.() || {};
    params.encodings = params.encodings || [{}];
    params.encodings[0].maxBitrate = 1500000;
    params.encodings[0].maxFramerate = 30;
    sender.setParameters?.(params).catch(() => {});
  };

  const createPeerConnection = (activeCallId) => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection({
      iceServers: getIceServers(),
      iceCandidatePoolSize: 10,
    });

    pc.onicecandidate = (event) => {
      if (!event.candidate) return;
      socket.emit('webrtc-ice-candidate', {
        callId: activeCallId,
        candidate: event.candidate,
      });
    };

    pc.ontrack = (event) => {
      const stream = event.streams?.[0];
      if (!stream) return;
      setRemoteStream(stream);
      patchCall({ callState: 'in_call', startedAt: Date.now() });
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === 'failed' || state === 'disconnected' || state === 'closed') {
        cleanupMediaAndPeer();
        clearCall();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const attachLocalTracks = (pc, stream) => {
    const existing = pc.getSenders();
    stream.getTracks().forEach((track) => {
      const already = existing.find((s) => s.track && s.track.kind === track.kind);
      if (already) return;
      const sender = pc.addTrack(track, stream);
      setAudioCodecAndBitrate(pc, sender, track);
      setVideoBitrate(sender, track);
    });
  };

  const safeSetRemoteDescription = async (pc, sessionDescription) => {
    if (!pc || !sessionDescription) return false;
    const nextType = sessionDescription.type;
    const current = pc.currentRemoteDescription;

    if (current?.type === nextType && current?.sdp === sessionDescription.sdp) {
      return false;
    }

    if (nextType === 'answer') {
      if (pc.signalingState !== 'have-local-offer') return false;
    }

    if (nextType === 'offer' && pc.signalingState !== 'stable') {
      try {
        await pc.setLocalDescription({ type: 'rollback' });
      } catch {
        return false;
      }
    }

    await pc.setRemoteDescription(new RTCSessionDescription(sessionDescription));
    return true;
  };

  const applyPendingCandidates = async (pc) => {
    while (pendingCandidatesRef.current.length) {
      const candidate = pendingCandidatesRef.current.shift();
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn('Skipping invalid ICE candidate', err);
      }
    }
  };

  const loadMessagesForChat = async (otherUserId) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.getMessages}/${otherUserId}`);
      const messages = (response.data?.messages || []).map((m) => ({
        ...m,
        time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
      }));
      setChats((prev) =>
        prev.map((c) =>
          c._id === otherUserId
            ? {
                ...c,
                messages,
                lastMessage: messages.length ? messages[messages.length - 1].text : c.lastMessage,
                time: messages.length ? 'now' : c.time,
              }
            : c
        )
      );
    } catch (err) {
      console.error('Failed to load chat messages:', err);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true);
      setError(null);

      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError('Please login again');
        setIsLoading(false);
        return;
      }

      let user;
      try {
        user = JSON.parse(storedUser);
      } catch {
        user = null;
      }

      if (!user?._id) {
        try {
          const response = await axios.get(API_ENDPOINTS.getMe);
          user = response.data.user || response.data;
          localStorage.setItem('user', JSON.stringify(user));
        } catch {
          setError('Failed to authenticate. Please login again.');
          setIsLoading(false);
          return;
        }
      }

      setCurrentUser(user);
      socket.emit('addUser', user._id);

      try {
        const res = await axios.post(API_ENDPOINTS.getUsers, {});
        const others = res.data.filter((u) => u._id !== user._id);
        setAllUsers(res.data);
        const statuses = {};
        others.forEach((u) => {
          statuses[u._id] = {
            isOnline: u.isOnline || false,
            lastSeen: u.lastSeen,
            lastSeenFormatted: u.lastSeenFormatted || formatLastSeen(u.lastSeen),
          };
        });
        setUserStatuses(statuses);

        setChats(
          others
            .sort((a, b) => {
              if (a.isOnline && !b.isOnline) return -1;
              if (!a.isOnline && b.isOnline) return 1;
              return (a.fullName || a.username || '').localeCompare(b.fullName || b.username || '');
            })
            .map((u) => ({
              _id: u._id,
              name: u.fullName || u.username,
              avatar: getAvatarUrl(u.profileImage),
              lastMessage: '',
              unread: 0,
              typing: false,
              online: u.isOnline || false,
              lastSeen: u.lastSeen,
              lastSeenFormatted: u.lastSeenFormatted || formatLastSeen(u.lastSeen),
              time: '',
              messages: [],
            }))
        );
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }

      setIsLoading(false);
    };

    initializeUser();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onReceiveMessage = ({ chatId, message }) => {
      if (!message?._id || receivedMessageIdsRef.current.has(message._id)) return;
      receivedMessageIdsRef.current.add(message._id);

      const formatted = {
        ...message,
        time: new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
      };

      setChats((prev) =>
        prev.map((c) =>
          c._id === chatId
            ? {
                ...c,
                messages: [...c.messages, formatted],
                lastMessage: formatted.text,
                time: 'now',
              }
            : c
        )
      );

      if (activeChatId !== chatId) {
        incrementUnread(chatId);
        const senderName = chatsRef.current.find((c) => c._id === chatId)?.name || 'New message';
        showNotification(`${senderName}: ${formatted.text || 'sent a message'}`, 'success');
        triggerBrowserNotification(senderName, formatted.text || 'New message');
      }
    };

    const onMessageNotification = ({ chatId, messageId, text }) => {
      if (!messageId || notifiedMessageIdsRef.current.has(messageId) || activeChatId === chatId) return;
      notifiedMessageIdsRef.current.add(messageId);
      const senderName = chatsRef.current.find((c) => c._id === chatId)?.name || 'New message';
      showNotification(`${senderName}: ${text || 'sent a message'}`, 'success');
    };

    const onIncomingCall = ({ callId: incomingCallId, caller, type }) => {
      const state = useCallStore.getState();
      if (state.callState !== 'idle' && state.callId && state.callId !== incomingCallId) {
        socket.emit('declineCall', { callId: incomingCallId });
        return;
      }
      setIncomingCall({ callId: incomingCallId, callType: type, peer: caller });
      showNotification(`Incoming ${type} call from ${caller?.name || caller?.fullName || 'Unknown'}`, 'success');
      triggerBrowserNotification('Incoming Call', `${caller?.name || caller?.fullName || 'Unknown'} is calling you`);
      navigator?.vibrate?.([250, 100, 250]);
    };

    const onCallRinging = ({ callId: ringingCallId }) => {
      patchCall({ callId: ringingCallId, callState: 'ringing' });
    };

    const onCallAccepted = async ({ callId: acceptedCallId }) => {
      const state = useCallStore.getState();
      if (state.callId && state.callId !== acceptedCallId) return;
      patchCall({ callId: acceptedCallId, callState: 'connecting', isIncoming: false });

      if (!state.isOutgoing) return;
      try {
        const stream = await ensureLocalStream(state.callType || 'audio');
        const pc = createPeerConnection(acceptedCallId);
        attachLocalTracks(pc, stream);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('webrtc-offer', { callId: acceptedCallId, offer });
      } catch (err) {
        console.error('Offer creation failed:', err);
        socket.emit('endCall', { callId: acceptedCallId });
        cleanupMediaAndPeer();
        clearCall();
      }
    };

    const onCallDeclined = ({ callId: declinedCallId }) => {
      const state = useCallStore.getState();
      if (state.callId && declinedCallId && state.callId !== declinedCallId) return;
      showNotification('Call declined', 'error');
      cleanupMediaAndPeer();
      clearCall();
    };

    const onCallEnded = ({ callId: endedCallId }) => {
      const state = useCallStore.getState();
      if (state.callId && endedCallId && state.callId !== endedCallId) return;
      showNotification('Call ended', 'error');
      cleanupMediaAndPeer();
      clearCall();
    };

    const onCallUnavailable = ({ message }) => {
      showNotification(message || 'Call unavailable', 'error');
      cleanupMediaAndPeer();
      clearCall();
    };

    const onOffer = async ({ callId: incomingCallId, offer }) => {
      const state = useCallStore.getState();
      if (state.callId !== incomingCallId) return;

      try {
        const stream = await ensureLocalStream(state.callType || 'audio');
        const pc = createPeerConnection(incomingCallId);
        attachLocalTracks(pc, stream);
        const applied = await safeSetRemoteDescription(pc, offer);
        if (!applied) return;
        await applyPendingCandidates(pc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('webrtc-answer', { callId: incomingCallId, answer });
        patchCall({ callState: 'in_call', startedAt: Date.now() });
      } catch (err) {
        console.error('Offer handling failed:', err);
      }
    };

    const onAnswer = async ({ callId: answerCallId, answer }) => {
      const state = useCallStore.getState();
      const pc = peerConnectionRef.current;
      if (!pc || state.callId !== answerCallId) return;
      if (handledAnswerCallIdsRef.current.has(answerCallId)) return;
      if (pc.signalingState !== 'have-local-offer') return;

      try {
        const applied = await safeSetRemoteDescription(pc, answer);
        if (!applied) return;
        handledAnswerCallIdsRef.current.add(answerCallId);
        await applyPendingCandidates(pc);
        patchCall({ callState: 'in_call', startedAt: Date.now() });
      } catch (err) {
        console.error('Answer handling failed:', err);
      }
    };

    const onIceCandidate = async ({ callId: candidateCallId, candidate }) => {
      const state = useCallStore.getState();
      const pc = peerConnectionRef.current;
      if (!candidate || state.callId !== candidateCallId) return;
      if (!pc || !pc.remoteDescription) {
        pendingCandidatesRef.current.push(candidate);
        return;
      }
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn('ICE add failed:', err);
      }
    };

    const onUserOnline = ({ userId }) => {
      setUserStatuses((prev) => ({ ...prev, [userId]: { ...prev[userId], isOnline: true } }));
      setChats((prev) => prev.map((c) => (c._id === userId ? { ...c, online: true } : c)));
    };

    const onUserOffline = ({ userId, lastSeen }) => {
      const lastSeenFormatted = formatLastSeen(lastSeen);
      setUserStatuses((prev) => ({ ...prev, [userId]: { ...prev[userId], isOnline: false, lastSeen, lastSeenFormatted } }));
      setChats((prev) =>
        prev.map((c) => (c._id === userId ? { ...c, online: false, lastSeen, lastSeenFormatted } : c))
      );
    };

    const onUserTyping = ({ userName, chatId }) => {
      const timeout = typingTimeoutsRef.current.get(chatId);
      if (timeout) clearTimeout(timeout);
      setChats((prev) => prev.map((c) => (c._id === chatId ? { ...c, typing: true, typingName: userName } : c)));
      setActiveChat((prev) => (prev && prev._id === chatId ? { ...prev, typing: true, typingName: userName } : prev));
      typingTimeoutsRef.current.set(
        chatId,
        setTimeout(() => {
          setChats((prev) => prev.map((c) => (c._id === chatId ? { ...c, typing: false, typingName: null } : c)));
          setActiveChat((prev) => (prev && prev._id === chatId ? { ...prev, typing: false, typingName: null } : prev));
        }, 2500)
      );
    };

    const onUserStopTyping = ({ chatId }) => {
      const timeout = typingTimeoutsRef.current.get(chatId);
      if (timeout) clearTimeout(timeout);
      typingTimeoutsRef.current.delete(chatId);
      setChats((prev) => prev.map((c) => (c._id === chatId ? { ...c, typing: false, typingName: null } : c)));
      setActiveChat((prev) => (prev && prev._id === chatId ? { ...prev, typing: false, typingName: null } : prev));
    };

    socket.off('receiveMessage');
    socket.off('messageNotification');
    socket.off('incomingCall');
    socket.off('callRinging');
    socket.off('callAccepted');
    socket.off('callDeclined');
    socket.off('callEnded');
    socket.off('callUnavailable');
    socket.off('webrtc-offer');
    socket.off('webrtc-answer');
    socket.off('webrtc-ice-candidate');
    socket.off('userOnline');
    socket.off('userOffline');
    socket.off('userTyping');
    socket.off('userStopTyping');

    socket.on('receiveMessage', onReceiveMessage);
    socket.on('messageNotification', onMessageNotification);
    socket.on('incomingCall', onIncomingCall);
    socket.on('callRinging', onCallRinging);
    socket.on('callAccepted', onCallAccepted);
    socket.on('callDeclined', onCallDeclined);
    socket.on('callEnded', onCallEnded);
    socket.on('callUnavailable', onCallUnavailable);
    socket.on('webrtc-offer', onOffer);
    socket.on('webrtc-answer', onAnswer);
    socket.on('webrtc-ice-candidate', onIceCandidate);
    socket.on('userOnline', onUserOnline);
    socket.on('userOffline', onUserOffline);
    socket.on('userTyping', onUserTyping);
    socket.on('userStopTyping', onUserStopTyping);

    return () => {
      socket.off('receiveMessage', onReceiveMessage);
      socket.off('messageNotification', onMessageNotification);
      socket.off('incomingCall', onIncomingCall);
      socket.off('callRinging', onCallRinging);
      socket.off('callAccepted', onCallAccepted);
      socket.off('callDeclined', onCallDeclined);
      socket.off('callEnded', onCallEnded);
      socket.off('callUnavailable', onCallUnavailable);
      socket.off('webrtc-offer', onOffer);
      socket.off('webrtc-answer', onAnswer);
      socket.off('webrtc-ice-candidate', onIceCandidate);
      socket.off('userOnline', onUserOnline);
      socket.off('userOffline', onUserOffline);
      socket.off('userTyping', onUserTyping);
      socket.off('userStopTyping', onUserStopTyping);
    };
  }, [activeChatId, callId, callState, clearCall, incrementUnread, patchCall, resetUnread, setIncomingCall, setLocalStream, setRemoteStream]);

  useEffect(() => {
    return () => {
      cleanupMediaAndPeer();
      clearCall();
    };
  }, [clearCall]);

  const handleStartChat = (user) => {
    if (user._id === currentUser?._id) return;
    const existing = chats.find((c) => c._id === user._id);
    const status = userStatuses[user._id] || { isOnline: false, lastSeenFormatted: formatLastSeen(user.lastSeen) };

    if (existing) {
      setActiveChat(existing);
    } else {
      const newChat = {
        _id: user._id,
        name: user.fullName || user.username,
        avatar: getAvatarUrl(user.profileImage),
        lastMessage: '',
        unread: 0,
        typing: false,
        online: status.isOnline,
        lastSeen: status.lastSeen,
        lastSeenFormatted: status.lastSeenFormatted,
        time: '',
        messages: [],
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChat(newChat);
    }

    setActiveChatId(user._id);
    resetUnread(user._id);
    loadMessagesForChat(user._id);
    if (isMobile) setShowSidebar(false);
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setActiveChatId(chat._id);
    resetUnread(chat._id);
    loadMessagesForChat(chat._id);
    if (isMobile) setShowSidebar(false);
  };

  const handleSendMessage = async (text) => {
    if (!activeChat || !text.trim()) return;
    try {
      const response = await axios.post(API_ENDPOINTS.sendMessage, {
        receiver: activeChat._id,
        text: text.trim(),
      });
      const msg = response.data?.message;
      if (!msg) return;
      const localMessage = {
        ...msg,
        time: new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      };

      setChats((prev) =>
        prev.map((c) =>
          c._id === activeChat._id ? { ...c, messages: [...c.messages, localMessage], lastMessage: localMessage.text, time: 'now' } : c
        )
      );
      setActiveChat((prev) =>
        prev ? { ...prev, messages: [...(prev.messages || []), localMessage], lastMessage: localMessage.text, time: 'now' } : prev
      );
      socket.emit('sendMessage', { chatId: activeChat._id, message: localMessage });
    } catch (err) {
      console.error('send message failed', err);
      showNotification('Failed to send message', 'error');
    }
  };

  const handleTyping = (isTyping) => {
    if (!activeChat || !currentUser?._id) return;
    if (isTyping) {
      socket.emit('typing', {
        chatId: activeChat._id,
        userId: currentUser._id,
        userName: currentUser.fullName || currentUser.username || 'User',
      });
    } else {
      socket.emit('stopTyping', {
        chatId: activeChat._id,
        userId: currentUser._id,
      });
    }
  };

  const handleCall = (type) => {
    if (!activeChat) return showNotification('Select a chat first', 'error');
    if (callState !== 'idle' && callState !== 'ended') return showNotification('Already in a call', 'error');
    startOutgoingCall({ callType: type, peer: activeChat });
    socket.emit('initiateCall', { calleeId: activeChat._id, type, caller: currentUser });
  };

  const handleAcceptCall = async () => {
    if (!callId) return;
    try {
      await ensureLocalStream(callType || 'audio');
      patchCall({ callState: 'connecting', isIncoming: false, isOutgoing: false });
      socket.emit('acceptCall', { callId });
    } catch (err) {
      console.error('accept call media denied', err);
      socket.emit('declineCall', { callId });
      cleanupMediaAndPeer();
      clearCall();
    }
  };

  const handleDeclineCall = () => {
    if (callId) socket.emit('declineCall', { callId });
    cleanupMediaAndPeer();
    clearCall();
  };

  const handleEndCall = () => {
    if (callId) socket.emit('endCall', { callId });
    cleanupMediaAndPeer();
    clearCall();
  };

  const handleToggleMute = () => {
    if (!localStream) return;
    const muted = localStream.getAudioTracks().every((t) => !t.enabled);
    localStream.getAudioTracks().forEach((t) => {
      t.enabled = muted;
    });
  };

  const handleToggleVideo = () => {
    if (!localStream) return;
    const enabled = localStream.getVideoTracks().some((t) => t.enabled);
    localStream.getVideoTracks().forEach((t) => {
      t.enabled = !enabled;
    });
  };

  const handleLogout = async () => {
    try {
      await axios.post(API_ENDPOINTS.logout);
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  const chatsWithUnread = useMemo(
    () => chats.map((c) => ({ ...c, unread: unreadByChat[c._id] || 0 })),
    [chats, unreadByChat]
  );
  const activeMessages = activeChat ? chats.find((c) => c._id === activeChat._id)?.messages || [] : [];
  const isCallOpen = callState !== 'idle' && callState !== 'ended' && !!callType;
  const callPeer = peer || activeChat || { name: 'Unknown' };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: '#0b141a' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#25d366] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8696a0]">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: '#0b141a' }}>
        <div className="text-center max-w-md px-8">
          <h2 className="text-[#e9edef] text-xl font-semibold mb-2">Unable to Load</h2>
          <p className="text-[#8696a0] mb-4">{error}</p>
          <button onClick={() => (window.location.href = '/login')} className="px-6 py-2 bg-[#25d366] text-[#111b21] rounded-full font-semibold">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden relative">
      <AnimatePresence mode="wait">
        {(showSidebar || isMobile) && (
          <motion.div
            key="sidebar"
            initial={isMobile ? { x: '-100%' } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: '-100%' } : false}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-30"
          >
            <Sidebar
              currentUser={currentUser}
              chats={chatsWithUnread}
              allUsers={allUsers}
              activeChat={activeChat}
              onSelectChat={handleSelectChat}
              onStartChat={handleStartChat}
              onLogout={handleLogout}
              isOpen={showSidebar}
              onClose={() => setShowSidebar(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div key="chat" initial={isMobile ? { x: '100%' } : false} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="flex-1 flex flex-col h-full">
        <ChatArea
          chat={activeChat}
          messages={activeMessages}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onBack={() => {
            setShowSidebar(true);
            setActiveChat(null);
            setActiveChatId(null);
          }}
          onCall={() => handleCall('audio')}
          onVideoCall={() => handleCall('video')}
          onEmojiToggle={() => setShowEmojiPicker(!showEmojiPicker)}
          showEmojiPicker={showEmojiPicker}
          onAttachToggle={() => {}}
        />
      </motion.div>

      <VideoCall
        isOpen={isCallOpen && callType === 'video'}
        user={callPeer}
        isIncoming={isIncoming && callState === 'ringing'}
        callStatus={callState}
        callDuration={callDuration}
        localStream={localStream}
        remoteStream={remoteStream}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
        onEnd={handleEndCall}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
      />

      <Phonecall
        isOpen={isCallOpen && callType === 'audio'}
        user={callPeer}
        isIncoming={isIncoming && callState === 'ringing'}
        callStatus={callState}
        callDuration={callDuration}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
        onEnd={handleEndCall}
        onToggleMute={handleToggleMute}
        onToggleSpeaker={() => {}}
      />

      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`px-4 py-3 rounded-lg shadow-xl ${n.type === 'error' ? 'bg-red-500' : 'bg-[#25d366]'} text-white text-sm font-medium`}
            >
              {n.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Conversation;
