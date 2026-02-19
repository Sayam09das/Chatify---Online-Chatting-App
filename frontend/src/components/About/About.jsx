import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Shield, Zap, Globe, Award, Heart, Target, Eye, ChevronRight } from 'lucide-react';

const About = () => {
  const stats = [
    { number: "2B+", label: "Users Worldwide", icon: Users },
    { number: "100B+", label: "Messages Daily", icon: MessageCircle },
    { number: "180+", label: "Countries", icon: Globe },
    { number: "99.9%", label: "Uptime", icon: Zap }
  ];

  const values = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "We believe your conversations are private. End-to-end encryption ensures only you and your recipient can read your messages."
    },
    {
      icon: Zap,
      title: "Speed & Reliability",
      description: "Messages delivered instantly, every time. Our infrastructure is built for speed and reliability you can count on."
    },
    {
      icon: Heart,
      title: "User-Centric",
      description: "Every feature we build is designed with you in mind. Your feedback shapes the future of Chatify."
    },
    {
      icon: Globe,
      title: "Global Connection",
      description: "Connecting people across borders and languages. Chatify brings the world closer together."
    }
  ];

  const team = [
    { name: "Alex Chen", role: "CEO & Founder", avatar: "👨‍💻", bio: "Visionary leader with 15+ years in tech" },
    { name: "Sarah Johnson", role: "CTO", avatar: "👩‍💼", bio: "Security expert and encryption specialist" },
    { name: "Mike Rodriguez", role: "Head of Product", avatar: "👨‍💼", bio: "Product strategist with a user-first approach" },
    { name: "Emma Williams", role: "Lead Designer", avatar: "👩‍🎨", bio: "Award-winning UI/UX designer" }
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
              <Eye className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">About Chatify</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              We're on a mission to connect the world through simple, secure, and private messaging.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To empower people around the world to connect and communicate seamlessly, 
                regardless of distance or device. We believe that communication is a fundamental 
                human right, and we're committed to making it accessible, secure, and private for everyone.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To be the world's most trusted communication platform, where billions of people 
                can share moments, stay connected with loved ones, and conduct business securely. 
                We envision a world where privacy is the default, not the exception.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 bg-green-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-black text-green-600 mb-2">{stat.number}</div>
                  <p className="text-gray-700 font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-green-600">Values</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at Chatify
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="py-20 bg-green-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-green-600">Team</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The passionate people behind Chatify
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-lg"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                  {member.avatar}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-green-600 font-medium text-sm mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Awards Section */}
      <motion.section
        className="py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Recognition & Awards</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {["🏆 Best Communication App 2024", "🔒 Most Secure Messaging Platform", "⭐ User Choice Award"].map((award, index) => (
              <div key={index} className="bg-white rounded-xl px-6 py-4 shadow-md flex items-center space-x-2">
                <Award className="w-6 h-6 text-yellow-500" />
                <span className="font-semibold text-gray-700">{award}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-green-600 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Chatify Family</h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Start connecting with friends and family today. It's free, secure, and easy to use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg shadow-lg hover:bg-green-50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
              <ChevronRight className="ml-2 w-5 h-5" />
            </motion.a>
            <motion.a
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-green-700 text-white rounded-full font-bold text-lg hover:bg-green-800 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;

