import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Cpu, Globe, Zap, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

const Innovation = () => {
  const innovations = [
    { icon: Cpu, title: "AI Integration", desc: "Advanced AI that learns and adapts to your communication style", status: "Live" },
    { icon: Globe, title: "Global Network", desc: "Infrastructure spanning 180+ countries with low latency", status: "Live" },
    { icon: Zap, title: "Real-time Sync", desc: "Instant message synchronization across all devices", status: "Live" },
    { icon: Sparkles, title: "Smart Replies", desc: "AI-powered suggested responses for faster messaging", status: "Beta" },
    { icon: "🎭", title: "AR Filters", desc: "Augmented reality filters for video calls", status: "Coming Soon" },
    { icon: "🌐", title: "Universal Translate", desc: "Real-time translation in 100+ languages", status: "Coming Soon" }
  ];

  const roadmap = [
    { quarter: "Q1 2025", items: ["Voice AI Assistant", "Enhanced Encryption", "New Admin Tools"] },
    { quarter: "Q2 2025", items: ["AR Video Calls", "Advanced Analytics", "API v2.0"] },
    { quarter: "Q3 2025", items: ["Universal Translate", "Custom Themes", "Business API"] },
    { quarter: "Q4 2025", items: ["VR Chat Beta", "AI Content Moderation", "Partner Integrations"] }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <motion.section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Innovation Lab</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">Pushing the boundaries of what's possible in communication. Join us in shaping the future.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section className="py-12 bg-green-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Patents Filed" },
              { number: "50+", label: "Research Papers" },
              { number: "100+", label: "Engineers" },
              { number: "$50M+", label: "R&D Investment" }
            ].map((stat, index) => (
              <motion.div key={index} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 * index }}>
                <div className="text-4xl font-black text-green-600 mb-2">{stat.number}</div>
                <p className="text-gray-700 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Innovations */}
      <motion.section className="py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest <span className="text-green-600">Innovations</span></h2>
            <p className="text-gray-600">Cutting-edge features in development and production</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {innovations.map((item, index) => (
              <motion.div key={index} className="bg-white rounded-2xl p-6 shadow-lg" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * index }} whileHover={{ y: -5 }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    {typeof item.icon === 'string' ? <span className="text-2xl">{item.icon}</span> : <item.icon className="w-7 h-7 text-green-600" />}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === 'Live' ? 'bg-green-100 text-green-600' :
                    item.status === 'Beta' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>{item.status}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Roadmap */}
      <motion.section className="py-16 bg-green-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Product <span className="text-green-600">Roadmap</span></h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {roadmap.map((quarter, index) => (
              <motion.div key={index} className="bg-white rounded-xl p-6 shadow-md" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 * index }}>
                <h3 className="text-xl font-bold text-green-600 mb-4">{quarter.quarter}</h3>
                <ul className="space-y-2">
                  {quarter.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 text-sm">
                      <ChevronRight className="w-4 h-4 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section className="py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shape the Future</h2>
          <p className="text-gray-600 mb-8">Have an idea? We'd love to hear from you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a href="/contact" className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-green-700 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Share Your Idea <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default Innovation;
