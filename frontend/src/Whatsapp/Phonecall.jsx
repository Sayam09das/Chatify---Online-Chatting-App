import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Phone, X, Volume2, VolumeX } from 'lucide-react';

const Phonecall = ({
  isOpen,
  user = { name: 'Unknown' },
  isIncoming = false,
  callStatus = 'idle', // ringing | connecting | in_call | ended
  callDuration = '00:00',
  isMuted = false,
  isSpeakerOn = false,
  onAccept,
  onDecline,
  onEnd,
  onToggleMute,
  onToggleSpeaker,
}) => {
  const displayName = user?.fullName || user?.name || user?.username || 'Unknown';

  const renderIncoming = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0f1720]"
    >
      <div className="text-center">
        <p className="text-white text-2xl font-semibold mb-2">{displayName}</p>
        <p className="text-green-400 mb-8">Incoming audio call...</p>
        <div className="flex items-center justify-center gap-8">
          <button onClick={onDecline} className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
            <Phone size={26} className="text-white rotate-[135deg]" />
          </button>
          <button onClick={onAccept} className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
            <Phone size={26} className="text-white" />
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
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#0f1720]"
    >
      <button onClick={onEnd} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white">
        <X size={20} />
      </button>

      <div className="text-center mb-10">
        <p className="text-white text-3xl font-semibold">{displayName}</p>
        <p className="text-gray-300 mt-2">{callStatus === 'connecting' ? 'Connecting...' : callDuration}</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMute}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${isMuted ? 'bg-red-500' : 'bg-white/20 text-white'}`}
        >
          {isMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} />}
        </button>
        <button
          onClick={onToggleSpeaker}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${isSpeakerOn ? 'bg-green-500 text-white' : 'bg-white/20 text-white'}`}
        >
          {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
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

export default Phonecall;
