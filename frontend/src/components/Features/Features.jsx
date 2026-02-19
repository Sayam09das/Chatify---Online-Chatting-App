import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, Users, Shield, Zap, Video, Phone, 
  Image, FileText, Lock, Bell, Smile, Globe,
  ChevronRight, Star, ArrowRight
} from 'lucide-react';

const Features = () => {
  const mainFeatures = [
    {
      icon: MessageCircle,
      title: "Instant Messaging",
      description: "Send and receive messages instantly with real-time delivery. Your messages reach your contacts in milliseconds.",
      color: "from-green-500 to-green-600",
      details: ["Real-time message delivery", "Read receipts", "Message status indicators", "Emoji and sticker support"]
    },
    {
      icon: Video,
      title: "Video & Voice Calls",
      description: "Make crystal-clear voice and video calls with your friends and family, anywhere in the world.",
      color: "from-blue-500 to-blue-600",
      details: ["HD video quality", "Crystal clear audio", "Group video calls up to 8 people", "Screen sharing"]
    },
    {
      icon: Users,
      title: "Group Chats",
      description: "Create groups with up to 256 members. Perfect for families, teams, and friend circles.",
      color: "from-purple-500 to-purple-600",
      details: ["Up to 256 members", "Group admin controls", "Pinned messages", "Mentions and replies"]
    },
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Your messages are protected with end-to-end encryption. Only you and your recipient can read them.",
      color: "from-green-600 to-green-700",
      details: ["Military-grade encryption", "Privacy-first approach", "No message storage on servers", "Verified encryption keys"]
    },
    {
      icon: Image,
      title: "Media Sharing",
      description: "Share photos, videos, and documents instantly. High-quality compression ensures fast sharing.",
      color: "from-pink-500 to-pink-600",
      details: ["Photo & video sharing", "Document sharing", "Voice messages", "Location sharing"]
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Stay connected with customizable notifications. Never miss an important message.",
      color: "from-orange-500 to-orange-600",
      details: ["Custom notification sounds", "Mute conversations", "Keyword notifications", "Online status alerts"]
    }
  ];

  const additionalFeatures = [
    { icon: Globe, title: "Multi-platform", desc: "Use Chatify on web, iOS, and Android" },
    { icon: Smile, title: "Emoji & Stickers", desc: "Express yourself with 1000+ emojis and stickers" },
    { icon: FileText, title: "Message History", desc: "Access your messages from any device" },
    { icon: Zap, title: "Fast & Light", desc: "Works perfectly even on slow connections" },
    { icon: Lock, title: "Two-Step Verification", desc: "Add an extra layer of security" },
    { icon: Star, title: "Status Updates", desc: "Share photos that disappear in 24 hours" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="bg-green-600 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Powerful Features</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Discover all the amazing features that make Chatify the best way to stay connected with the people who matter most.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Features Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to <span className="text-green-600">connect</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Chatify comes packed with features designed to make your messaging experience seamless and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
                  <div className="p-6">
                    <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-500">
                          <ChevronRight className="w-4 h-4 text-green-500 mr-2" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Additional Features Grid */}
      <motion.section
        className="py-16 bg-green-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              And so much <span className="text-green-600">more</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-shadow"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Security Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-12 items-center p-8 md:p-12">
              <div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Your privacy is our priority
                </h2>
                <p className="text-green-100 text-lg mb-6">
                  With end-to-end encryption, your messages are secure and private. Only you and your recipient can read them.
                </p>
                <ul className="space-y-3">
                  {["Bank-level encryption", "No message tracking", "Self-destructing messages", "Anonymous signup"].map((item, idx) => (
                    <li key={idx} className="flex items-center text-white">
                      <Shield className="w-5 h-5 mr-3 text-green-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="relative">
                  <div className="w-64 h-80 bg-black rounded-3xl p-3 shadow-2xl">
                    <div className="bg-green-600 h-full rounded-2xl p-4">
                      <div className="bg-white/10 rounded-lg p-3 mb-3">
                        <div className="text-white text-sm font-medium">End-to-End Encrypted</div>
                        <div className="text-green-200 text-xs">Messages are secured with encryption</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 mb-3">
                        <div className="text-gray-800 text-sm">Hey! How are you?</div>
                        <div className="text-gray-400 text-xs text-right">12:30 PM</div>
                      </div>
                      <div className="bg-green-500 rounded-lg p-3 ml-8">
                        <div className="text-white text-sm">I'm doing great! Thanks 😊</div>
                        <div className="text-green-100 text-xs text-right">12:31 PM</div>
                      </div>
                      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to experience Chatify?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join millions of users who trust Chatify for their daily communication. Start chatting securely today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-green-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
            <motion.a
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 rounded-full font-bold text-lg hover:bg-gray-200 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Features;

