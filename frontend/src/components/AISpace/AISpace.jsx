import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Bot, Brain, Lightbulb, Zap, ChevronRight, Star, Users, Cpu, ArrowRight } from 'lucide-react';

const AISpace = () => {
  const features = [
    {
      icon: Bot,
      title: "Smart Assistant",
      description: "AI-powered chatbot that helps you with answering questions, writing, and more"
    },
    {
      icon: Brain,
      title: "Context Awareness",
      description: "Understands conversation context to provide relevant responses"
    },
    {
      icon: Sparkles,
      title: "Content Generation",
      description: "Generate creative content, summaries, and translations instantly"
    },
    {
      icon: Zap,
      title: "Instant Responses",
      description: "Get quick answers to your questions without waiting"
    }
  ];

  const useCases = [
    { icon: "✍️", title: "Writing Assistant", desc: "Help with emails, messages, and documents" },
    { icon: "🔍", title: "Research", desc: "Get quick summaries of topics" },
    { icon: "💬", title: "Conversation", desc: "Have natural dialogues on any topic" },
    { icon: "🎨", title: "Creative", desc: "Generate ideas and creative content" },
    { icon: "📝", title: "Summaries", desc: "Quickly summarize long messages" },
    { icon: "🌐", title: "Translation", desc: "Translate messages in real-time" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-br from-green-600 to-green-700 text-white py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">AI Space</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
              Experience the future of communication with our AI-powered features. Smart, fast, and always ready to help.
            </p>
            <motion.a
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg shadow-lg hover:bg-green-50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try AI Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powered by <span className="text-green-600">Advanced AI</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our AI Space brings intelligent features directly to your conversations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Use Cases */}
      <motion.section
        className="py-16 bg-green-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What can AI help with?</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-3">{useCase.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-1">{useCase.title}</h4>
                <p className="text-xs text-gray-500">{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Demo Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-green-600 p-4 text-white">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">AI Assistant</h3>
                  <p className="text-xs text-green-200">Online</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-end">
                <div className="bg-green-600 text-white px-4 py-2 rounded-2xl rounded-br-md max-w-[70%]">
                  <p className="text-sm">Can you help me write a professional email?</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl rounded-bl-md max-w-[70%]">
                  <p className="text-sm">Of course! I'd be happy to help. Could you tell me what the email is about and who it's for?</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Ask AI anything..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700">
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        className="py-16 bg-green-600 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10M+", label: "AI Conversations" },
              { number: "98%", label: "Accuracy Rate" },
              { number: "50+", label: "Languages" },
              { number: "24/7", label: "Availability" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-green-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to try AI Space?</h2>
          <p className="text-gray-600 mb-8">Join millions of users experiencing the future of messaging</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-green-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
              <ChevronRight className="ml-2 w-5 h-5" />
            </motion.a>
            <motion.a
              href="/features"
              className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 rounded-full font-bold text-lg hover:bg-gray-200 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AISpace;

