import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Heart, Share2, MessageSquare, Globe, Star, ChevronRight, Calendar, UserPlus } from 'lucide-react';

const CommunityHub = () => {
  const groups = [
    { name: "Tech Enthusiasts", members: 12500, description: "Discuss latest tech trends and gadgets", icon: "💻", category: "Technology" },
    { name: "Photography Club", members: 8300, description: "Share and learn photography", icon: "📸", category: "Art" },
    { name: "Fitness Warriors", members: 15200, description: "Stay motivated with fitness goals", icon: "💪", category: "Health" },
    { name: "Book Lovers", members: 6700, description: "Monthly book discussions", icon: "📚", category: "Education" },
    { name: "Music Makers", members: 9400, description: "Collaborate and share music", icon: "🎵", category: "Music" },
    { name: "Foodies United", members: 11000, description: "Recipes and food adventures", icon: "🍕", category: "Lifestyle" }
  ];

  const events = [
    { title: "Weekly AMA Session", date: "Every Friday", participants: 500, icon: "🎤" },
    { title: "Photography Contest", date: "Jan 25, 2025", participants: 1200, icon: "📷" },
    { title: "Tech Talk Live", date: "Jan 30, 2025", participants: 800, icon: "🎙️" },
    { title: "Community Meetup", date: "Feb 5, 2025", participants: 300, icon: "🤝" }
  ];

  const stats = [
    { number: "500K+", label: "Community Members" },
    { number: "10K+", label: "Active Groups" },
    { number: "1M+", label: "Messages Daily" },
    { number: "150+", label: "Countries" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <motion.section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Community Hub</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">Connect with like-minded people, join groups, and participate in events. Your community awaits!</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section className="py-12 bg-green-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} className="text-center" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 * index }}>
                <div className="text-4xl font-black text-green-600 mb-2">{stat.number}</div>
                <p className="text-gray-700 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Groups */}
      <motion.section className="py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular <span className="text-green-600">Groups</span></h2>
            <p className="text-gray-600">Find your tribe and connect with people who share your interests</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, index) => (
              <motion.div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * index }} whileHover={{ y: -5 }}>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl">{group.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">{group.category}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{group.description}</p>
                    <div className="flex items-center mt-2 text-gray-500 text-sm">
                      <Users className="w-4 h-4 mr-1" />
                      {group.members.toLocaleString()} members
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Events */}
      <motion.section className="py-16 bg-green-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming <span className="text-green-600">Events</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event, index) => (
              <motion.div key={index} className="bg-white rounded-xl p-6 shadow-md" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 * index }} whileHover={{ scale: 1.02 }}>
                <div className="text-4xl mb-4">{event.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2">{event.title}</h4>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  {event.date}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  {event.participants} expected
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section className="py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Community</h2>
          <p className="text-gray-600 mb-8">Create your own group and bring people together around shared interests</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a href="/register" className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-green-700 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Create Group <ChevronRight className="ml-2 w-5 h-5" />
            </motion.a>
            <motion.a href="/features" className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 rounded-full font-bold text-lg hover:bg-gray-200 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Learn More
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default CommunityHub;

