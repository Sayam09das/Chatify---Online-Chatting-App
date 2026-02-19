import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Video, Camera, Edit, BarChart, DollarSign, Users, Star, ChevronRight, Play, Upload, TrendingUp, Gift } from 'lucide-react';

const CreatorStudio = () => {
  const features = [
    { icon: Video, title: "Video Content", desc: "Create and share video content with your audience" },
    { icon: Camera, title: "Stories", desc: "Share disappearing stories with your followers" },
    { icon: Edit, title: "Custom Profiles", desc: "Design unique profiles that stand out" },
    { icon: BarChart, title: "Analytics", desc: "Track your content performance" },
    { icon: DollarSign, title: "Monetization", desc: "Earn from your content and audience" },
    { icon: Users, title: "Subscribers", desc: "Build a loyal subscriber base" }
  ];

  const tools = [
    { name: "Video Editor", users: "50K+", icon: "🎬" },
    { name: "Thumbnail Maker", users: "35K+", icon: "🖼️" },
    { name: "Analytics Dashboard", users: "45K+", icon: "📊" },
    { name: "Live Streaming", users: "20K+", icon: "📡" }
  ];

  const creators = [
    { name: "Tech Reviewer", followers: "250K", earnings: "$5K/mo", avatar: "👨‍💻" },
    { name: "Lifestyle Guru", followers: "180K", earnings: "$3.2K/mo", avatar: "👩‍🎤" },
    { name: "Gaming Pro", followers: "320K", earnings: "$8K/mo", avatar: "🎮" },
    { name: "Food Blogger", followers: "95K", earnings: "$1.5K/mo", avatar: "👨‍🍳" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <motion.section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Creator Studio</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">Create, share, and monetize your content. Build your audience and turn your passion into income.</p>
            <motion.a href="/register" className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg shadow-lg hover:bg-green-50 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Start Creating <ChevronRight className="ml-2 w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section className="py-12 bg-green-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "100K+", label: "Creators" },
              { number: "50M+", label: "Views" },
              { number: "$2M+", label: "Paid to Creators" },
              { number: "1M+", label: "Subscribers" }
            ].map((stat, index) => (
              <motion.div key={index} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 * index }}>
                <div className="text-4xl font-black text-green-600 mb-2">{stat.number}</div>
                <p className="text-gray-700 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section className="py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Creator <span className="text-green-600">Tools</span></h2>
            <p className="text-gray-600">Everything you need to grow your audience</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} className="bg-white rounded-2xl p-6 shadow-lg" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * index }} whileHover={{ y: -5 }}>
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Tools */}
      <motion.section className="py-16 bg-green-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular <span className="text-green-600">Tools</span></h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <motion.div key={index} className="bg-white rounded-xl p-6 text-center shadow-md" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 * index }} whileHover={{ scale: 1.05 }}>
                <div className="text-4xl mb-3">{tool.icon}</div>
                <h4 className="font-bold text-gray-900 mb-1">{tool.name}</h4>
                <p className="text-sm text-gray-500">{tool.users} creators</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Top Creators */}
      <motion.section className="py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top <span className="text-green-600">Creators</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creators.map((creator, index) => (
              <motion.div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * index }} whileHover={{ y: -5 }}>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">{creator.avatar}</div>
                <h4 className="font-bold text-gray-900 mb-1">{creator.name}</h4>
                <div className="flex items-center justify-center text-gray-500 text-sm mb-2"><Users className="w-4 h-4 mr-1" /> {creator.followers}</div>
                <div className="flex items-center justify-center text-green-600 font-bold"><DollarSign className="w-4 h-4" /> {creator.earnings}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section className="py-20 bg-green-600 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Creator Journey</h2>
          <p className="text-green-100 mb-8">Join thousands of creators building their audience</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a href="/register" className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Become a Creator <ChevronRight className="ml-2 w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default CreatorStudio;

