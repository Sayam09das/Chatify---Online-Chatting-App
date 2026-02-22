import { create } from 'zustand';

const initialCall = {
  callId: null,
  callType: null,
  callState: 'idle', // idle | ringing | connecting | in_call | ended
  isIncoming: false,
  isOutgoing: false,
  peer: null,
  localStream: null,
  remoteStream: null,
  error: null,
  startedAt: null,
};

export const useCallStore = create((set) => ({
  activeChatId: null,
  unreadByChat: {},
  ...initialCall,

  setActiveChatId: (chatId) => set({ activeChatId: chatId || null }),
  incrementUnread: (chatId) =>
    set((state) => ({
      unreadByChat: {
        ...state.unreadByChat,
        [chatId]: (state.unreadByChat[chatId] || 0) + 1,
      },
    })),
  resetUnread: (chatId) =>
    set((state) => ({
      unreadByChat: {
        ...state.unreadByChat,
        [chatId]: 0,
      },
    })),

  startOutgoingCall: ({ callType, peer }) =>
    set({
      ...initialCall,
      callType,
      callState: 'connecting',
      isOutgoing: true,
      isIncoming: false,
      peer: peer || null,
    }),

  setIncomingCall: ({ callId, callType, peer }) =>
    set({
      ...initialCall,
      callId,
      callType,
      callState: 'ringing',
      isIncoming: true,
      isOutgoing: false,
      peer: peer || null,
    }),

  patchCall: (patch) => set((state) => ({ ...state, ...patch })),

  setLocalStream: (stream) => set({ localStream: stream || null }),
  setRemoteStream: (stream) => set({ remoteStream: stream || null }),

  clearCall: () => set({ ...initialCall }),
}));
