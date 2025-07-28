import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Users, Shield, Zap, ArrowRight, Star, Globe, Smartphone, Check, Play, ChevronDown, Video, Phone, MoreVertical, Search } from 'lucide-react';

const GetStarted = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: MessageCircle,
      title: "Instant Messages",
      desc: "Send messages instantly with delivery receipts",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Group Chats",
      desc: "Connect up to 256 people in one conversation",
      color: "from-green-400 to-green-500"
    },
    {
      icon: Shield,
      title: "End-to-End Encrypted",
      desc: "Your personal messages are protected by encryption",
      color: "from-green-600 to-green-700"
    },
    {
      icon: Phone,
      title: "Voice & Video Calls",
      desc: "Make crystal clear voice and video calls",
      color: "from-green-500 to-green-600"
    }
  ];

  const testimonials = [
    { name: "Sarah Johnson", role: "Teacher", text: "Perfect for staying connected with my students and colleagues!", avatar: "👩‍🏫", rating: 5 },
    { name: "Mike Chen", role: "Business Owner", text: "Chatify keeps our team communication seamless and secure.", avatar: "👨‍💼", rating: 5 },
    { name: "Emma Davis", role: "Student", text: "Love the group features! Makes project coordination so easy.", avatar: "👩‍🎓", rating: 5 }
  ];

  const stats = [
    { number: "2B+", label: "Users Worldwide", icon: Users },
    { number: "100B+", label: "Messages Daily", icon: MessageCircle },
    { number: "180+", label: "Countries", icon: Globe },
    { number: "99.9%", label: "Uptime", icon: Zap }
  ];

  const chats = [
    { name: "Family Group", message: "Mom: Don't forget dinner tonight! 🍽️", time: "2:30 PM", avatar: "👨‍👩‍👧‍👦", unread: 3 },
    { name: "Work Team", message: "Project deadline moved to Friday", time: "1:45 PM", avatar: "💼", unread: 0 },
    { name: "College Friends", message: "Sarah: Who's up for weekend trip? ✈️", time: "12:15 PM", avatar: "🎓", unread: 7 },
    { name: "Alex", message: "Thanks for the presentation help!", time: "11:30 AM", avatar: "👤", unread: 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* WhatsApp-style Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating WhatsApp Green Particles */}
      <motion.div
        className="fixed pointer-events-none z-0"
        animate={{
          x: mousePosition.x - 100,
          y: mousePosition.y - 100,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
      >
        <div className="w-32 h-32 bg-green-500/10 rounded-full blur-xl" />
      </motion.div>

      {/* Header */}
      <motion.header
        className="relative z-10 bg-green-600 shadow-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <motion.div
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MessageCircle className="w-7 h-7 text-green-600" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-white text-xs font-bold">5</span>
                </motion.div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Chatify</h1>
                <p className="text-green-100 text-sm">Simple. Reliable. Private.</p>
              </div>
            </motion.div>

            <motion.a
              href="/auth/login"
              className="inline-block px-6 py-2 bg-white text-green-600 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.a>

          </div>
        </div>
      </motion.header>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          className="bg-green-600 text-white py-16 md:py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <motion.h2
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Connect with your world
                </motion.h2>

                <motion.p
                  className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Send messages, share moments, and stay connected with friends and family through Chatify's simple, secure messaging.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <motion.a
                    href="/auth/login"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </motion.a>

                  <motion.button
                    className="group flex items-center justify-center space-x-3 px-6 py-4 bg-green-700/50 backdrop-blur-lg rounded-full border border-green-400/30 hover:bg-green-700/70 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Play className="w-6 h-6 ml-1" />
                    </div>
                    <span className="text-lg font-semibold">Watch Demo</span>
                  </motion.button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  className="flex items-center justify-center lg:justify-start space-x-6 text-green-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                      ))}
                    </div>
                    <span className="font-semibold">4.5/5 Rating</span>
                  </div>
                  <div className="h-4 w-px bg-green-400/50"></div>
                  <span className="font-semibold">2B+ Users</span>
                </motion.div>
              </div>

              {/* Right Content - Phone Mockup */}
              <motion.div
                className="flex justify-center lg:justify-end"
                initial={{ x: 100, opacity: 0, rotateY: 30 }}
                animate={{ x: 0, opacity: 1, rotateY: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: 0.5
                }}
              >
                <motion.div
                  className="relative"
                  animate={{
                    y: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl shadow-black/30 w-80 h-[600px]">
                    <div className="bg-white rounded-[2rem] overflow-hidden h-full">
                      {/* WhatsApp Header */}
                      <div className="bg-green-600 px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          >
                            <MessageCircle className="w-5 h-5 text-green-600" />
                          </motion.div>
                          <div>
                            <h3 className="text-white font-bold">Chatify</h3>
                            <p className="text-green-100 text-xs">online</p>
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <Video className="w-5 h-5 text-white" />
                          <Phone className="w-5 h-5 text-white" />
                          <MoreVertical className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Chat List */}
                      <div className="bg-white">
                        {/* Search Bar */}
                        <div className="p-3 bg-gray-50 border-b">
                          <div className="flex items-center space-x-3 bg-white rounded-lg px-3 py-2 shadow-sm">
                            <Search className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500 text-sm">Search or start new chat</span>
                          </div>
                        </div>

                        {/* Chat Items */}
                        <div className="divide-y divide-gray-100">
                          {chats.map((chat, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center space-x-3 p-4 hover:bg-gray-50"
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 1 + index * 0.2 }}
                            >
                              <div className="relative">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                                  {chat.avatar}
                                </div>
                                {chat.unread > 0 && (
                                  <motion.div
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    <span className="text-white text-xs font-bold">{chat.unread}</span>
                                  </motion.div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-semibold text-gray-900 truncate">{chat.name}</h4>
                                  <span className="text-xs text-gray-500 ml-2">{chat.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{chat.message}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="py-20 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <motion.h2
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                Why choose <span className="text-green-600">Chatify</span>?
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 max-w-2xl mx-auto"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Simple, reliable, and private messaging that connects you with the people who matter most
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="group text-center p-8 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      y: -5,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                  >
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="py-20 bg-green-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="text-center group"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <motion.div
                      className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.div
                      className="text-4xl md:text-5xl font-black text-green-600 mb-2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.1 + 0.3,
                        type: "spring",
                        stiffness: 300
                      }}
                    >
                      {stat.number}
                    </motion.div>
                    <p className="text-gray-700 font-medium">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          className="py-20 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <motion.h2
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                What people are saying
              </motion.h2>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                className="text-center bg-green-50 rounded-3xl p-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-6xl mb-6">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-green-600 font-medium">
                  {testimonials[currentTestimonial].role}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                    ? 'bg-green-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          className="py-20 bg-green-600 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-8"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              Ready to get started?
            </motion.h2>

            <motion.p
              className="text-xl text-green-100 mb-12 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join millions of people who use Chatify to stay connected with friends and family.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.a
                href="/auth/login"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Chatify Now
                <ArrowRight className="ml-3 w-6 h-6" />
              </motion.a>

              <div className="flex items-center space-x-4">
                <motion.button
                  className="flex items-center px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Download App
                </motion.button>
                <motion.button
                  className="flex items-center px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Web Version
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center justify-center space-x-8 text-green-100"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2" />
                Free to use
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2" />
                Works on all devices
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2" />
                End-to-end encrypted
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Chatify</span>
          </div>
          <p className="text-gray-400 mb-4">Simple. Reliable. Private.</p>
          <p className="text-sm text-gray-500">© 2024 Chatify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default GetStarted;