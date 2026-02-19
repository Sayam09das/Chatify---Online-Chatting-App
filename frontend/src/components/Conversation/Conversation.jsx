import React from 'react';
import { motion } from 'framer-motion';
import { Send, Image, Video, Phone, Paperclip, Smile, MoreVertical, Search, ArrowLeft } from 'lucide-react';
import { Iphone } from '../ui/iphone';

const Conversation = () => {
  const chatList = [
    { name: "Family Group", message: "Mom: Don't forget dinner tonight!", time: "2:30 PM", avatar: "👨‍👩‍👧‍👦", unread: 3, online: true },
    { name: "Work Team", message: "Project deadline moved to Friday", time: "1:45 PM", avatar: "💼", unread: 0, online: true },
    { name: "College Friends", message: "Sarah: Who's up for weekend trip?", time: "12:15 PM", avatar: "🎓", unread: 7, online: false },
    { name: "Alex Johnson", message: "Thanks for the presentation help!", time: "11:30 AM", avatar: "👤", unread: 0, online: true },
    { name: "Emma Davis", message: "See you tomorrow! 👋", time: "Yesterday", avatar: "👩", unread: 1, online: false },
    { name: "Mike Chen", message: "Let's catch up soon", time: "Yesterday", avatar: "👨", unread: 0, online: true }
  ];

  const messages = [
    { id: 1, text: "Hey! How are you doing?", sender: "other", time: "2:30 PM", avatar: "👨‍👩‍👧‍👦" },
    { id: 2, text: "I'm doing great! Just finished work. How about you?", sender: "me", time: "2:31 PM" },
    { id: 3, text: "Pretty good! Are we still on for dinner tonight?", sender: "other", time: "2:32 PM", avatar: "👨‍👩‍👧‍👦" },
    { id: 4, text: "Yes! Definitely. What time?", sender: "me", time: "2:33 PM" },
    { id: 5, text: "How about 7 PM? There's this new Italian place I wanted to try 🍝", sender: "other", time: "2:34 PM", avatar: "👨‍👩‍👧‍👦" },
    { id: 6, text: "Perfect! I'll meet you there. Can't wait! 😊", sender: "me", time: "2:35 PM" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4 md:p-8">
      {/* iPhone Frame using ui/iphone.tsx */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Iphone className="max-w-[400px]">
          {/* Chat App Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 pt-12">
            <div className="flex items-center space-x-3">
              <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">
                  👨‍👩‍👧‍👦
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-purple-600"></div>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Family Group</h3>
                <p className="text-xs text-purple-200">5 members • Online</p>
              </div>
              <div className="flex-1"></div>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <Phone className="w-4 h-4 text-white" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <MoreVertical className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[calc(100%-140px)] overflow-y-auto bg-gradient-to-b from-purple-50 to-indigo-50 p-3">
            <div className="space-y-2">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`flex items-end space-x-1 max-w-[75%] ${message.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                    {message.sender === 'other' && (
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs self-end">
                        {message.avatar}
                      </div>
                    )}
                    <div className={`px-3 py-2 rounded-2xl ${
                      message.sender === 'me' 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-md' 
                        : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                    }`}>
                      <p className="text-xs">{message.text}</p>
                      <span className={`text-[10px] ${message.sender === 'me' ? 'text-purple-200' : 'text-gray-400'} mt-1 block`}>
                        {message.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 rounded-full px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
              <motion.button
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </Iphone>
      </motion.div>

      {/* Chat List Sidebar (Desktop only) */}
      <div className="hidden lg:block ml-8">
        <motion.div 
          className="bg-white rounded-3xl shadow-xl overflow-hidden w-80"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Search */}
          <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600">
            <div className="flex items-center space-x-3 bg-white/20 backdrop-blur rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-white" />
              <input 
                type="text" 
                placeholder="Search or start new chat" 
                className="flex-1 outline-none text-sm bg-transparent text-white placeholder-white"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="overflow-y-auto h-[600px]">
            {chatList.map((chat, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 5 }}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                    {chat.avatar}
                  </div>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900 truncate text-sm">{chat.name}</h4>
                    <span className="text-xs text-gray-500 ml-2">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-600 truncate">{chat.message}</p>
                    {chat.unread > 0 && (
                      <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-2">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Conversation;
