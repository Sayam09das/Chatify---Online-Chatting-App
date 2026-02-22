import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, Phone, X } from 'lucide-react';

const VideoCall = ({
  isOpen,
  user = { name: 'Unknown' },
  isIncoming = false,
  callStatus = 'idle', // ringing | connecting | in_call | ended
  callDuration = '00:00',
  localStream = null,
  remoteStream = null,
  isMuted = false,
  isVideoOff = false,
  onAccept,
  onDecline,
  onEnd,
  onToggleMute,
  onToggleVideo,
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      console.log('🎥 Attaching remote stream to video element');
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(e => console.warn('Remote video play failed:', e));
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      console.log('📹 Attaching local stream to video element');
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(e => console.warn('Local video play failed:', e));
    }
  }, [localStream]);

  const displayName = user?.fullName || user?.name || user?.username || 'Unknown';

  const renderIncoming = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85"
    >
      <div className="text-center">
        <p className="text-white text-2xl font-semibold mb-2">{displayName}</p>
        <p className="text-green-400 mb-8">Incoming video call...</p>
        <div className="flex items-center justify-center gap-8">
          <button onClick={onDecline} className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
            <Phone size={26} className="text-white rotate-[135deg]" />
          </button>
          <button onClick={onAccept} className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
            <Video size={26} className="text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderActive = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-black"
    >
      <div className="absolute top-4 left-4 z-10 text-white">
        <p className="text-lg font-medium">{displayName}</p>
        <p className="text-sm text-gray-300">
          {callStatus === 'connecting' ? 'Connecting...' : callDuration}
        </p>
      </div>

      <button onClick={onEnd} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white">
        <X size={20} />
      </button>

      <div className="w-full h-full">
        {remoteStream ? (
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/80 text-xl">
            {callStatus === 'connecting' ? 'Waiting for peer video...' : displayName}
          </div>
        )}
      </div>

      <div className="absolute right-4 bottom-24 w-40 h-56 rounded-lg overflow-hidden border border-white/20 bg-black/40">
        {localStream && !isVideoOff ? (
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover mirror"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/80 text-sm">Camera off</div>
        )}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={onToggleMute}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${isMuted ? 'bg-red-500' : 'bg-white/20 text-white'}`}
        >
          {isMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} />}
        </button>
        <button
          onClick={onToggleVideo}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${isVideoOff ? 'bg-red-500' : 'bg-white/20 text-white'}`}
        >
          {isVideoOff ? <VideoOff size={20} className="text-white" /> : <Video size={20} />}
        </button>
        <button onClick={onEnd} className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center">
          <Phone size={24} className="text-white rotate-[135deg]" />
        </button>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (isIncoming && callStatus === 'ringing' ? renderIncoming() : renderActive())}
    </AnimatePresence>
  );
};

export default VideoCall;
