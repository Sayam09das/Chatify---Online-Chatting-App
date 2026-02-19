import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, HelpCircle, Book, Mail, Phone, ChevronRight, Search, MessageSquare, FileText, Video, Clock, CheckCircle } from 'lucide-react';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const helpTopics = [
    { icon: "📱", title: "Getting Started", desc: "Learn the basics of using Chatify", articles: 12 },
    { icon: "🔐", title: "Account & Security", desc: "Manage your account and privacy settings", articles: 15 },
    { icon: "💬", title: "Messaging", desc: "Send messages, photos, and more", articles: 20 },
    { icon: "📞", title: "Calls & Video", desc: "Voice and video calling features", articles: 10 },
    { icon: "👥", title: "Groups", desc: "Create and manage group chats", articles: 8 },
    { icon: "⚙️", title: "Settings", desc: "Customize your Chatify experience", articles: 14 }
  ];

  const faqs = [
    { q: "How do I reset my password?", a: "Go to Settings > Account > Security > Reset Password. You'll receive an email with reset instructions." },
    { q: "Is Chatify free to use?", a: "Yes! Chatify is completely free for personal use. Premium features are available for businesses." },
    { q: "How does end-to-end encryption work?", a: "Your messages are encrypted on your device and can only be decrypted by the recipient. We cannot read your messages." },
    { q: "Can I use Chatify on multiple devices?", a: "Yes! Your messages sync across all your devices - phone, tablet, and computer." },
    { q: "How do I delete my account?", a: "Go to Settings > Account > Delete Account. Note: This action is irreversible." }
  ];

  const contactOptions = [
    { icon: Mail, title: "Email Support", desc: "support@chatify.com", color: "from-blue-500 to-blue-600" },
    { icon: MessageSquare, title: "Live Chat", desc: "Available 24/7", color: "from-green-500 to-green-600" },
    { icon: Phone, title: "Phone Support", desc: "Mon-Fri 9am-6pm", color: "from-purple-500 to-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <motion.section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How can we help?</h1>
            <p className="text-green-100 mb-8">Search our knowledge base or browse topics below</p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center bg-white rounded-full px-6 py-4 shadow-lg">
                <Search className="w-6 h-6 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 outline-none text-gray-700"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Help Topics */}
      <motion.section className="py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpTopics.map((topic, index) => (
              <motion.div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * index }} whileHover={{ y: -5 }}>
                <div className="text-4xl mb-4">{topic.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h3>
                <p className="text-gray-600 mb-3">{topic.desc}</p>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  {topic.articles} articles <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQs */}
      <motion.section className="py-16 bg-green-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={index} className="bg-white rounded-xl shadow-md overflow-hidden" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * index }}>
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <span className="font-semibold text-gray-900">{faq.q}</span>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-gray-600">
                    {faq.a}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Options */}
      <motion.section className="py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Still need help?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * index }} whileHover={{ y: -5 }}>
                  <div className={`w-14 h-14 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600">{option.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Support Hours */}
      <motion.section className="py-12 bg-green-600 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Clock className="w-8 h-8" />
            <h3 className="text-2xl font-bold">Support Hours</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-green-100">
            <div>Email: 24/7 Response</div>
            <div>Live Chat: 24/7 Available</div>
            <div>Phone: Mon-Fri 9AM-6PM</div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Support;

