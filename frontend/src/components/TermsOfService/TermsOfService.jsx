import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Lock, User, ChevronRight } from 'lucide-react';

const TermsOfService = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using Chatify, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service."
    },
    {
      title: "2. Description of Service",
      content: "Chatify is a messaging platform that allows users to send messages, make voice and video calls, and share media with other users. The service is provided 'as is' and we reserve the right to modify or discontinue the service at any time."
    },
    {
      title: "3. User Registration and Account",
      content: "You agree to provide accurate and complete information during registration and to keep your account information updated. You are responsible for maintaining the confidentiality of your password and account. You agree to notify us immediately of any unauthorized use of your account."
    },
    {
      title: "4. User Conduct",
      content: "You agree not to use the service to: upload or transmit viruses, worms, or any malicious code; upload or transmit content that is illegal, harmful, threatening, abusive, or hateful; spam or harass other users; impersonate any person or entity."
    },
    {
      title: "5. Privacy and Data Protection",
      content: "Your privacy is important to us. We collect, store, and process your personal data in accordance with our Privacy Policy. By using Chatify, you consent to the collection and use of your information as described in our Privacy Policy."
    },
    {
      title: "6. Intellectual Property Rights",
      content: "Chatify and its original content, features, and functionality are owned by Chatify and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws."
    },
    {
      title: "7. Termination",
      content: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms of Service. Upon termination, your right to use the Service will immediately cease."
    },
    {
      title: "8. Limitation of Liability",
      content: "In no event shall Chatify, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."
    },
    {
      title: "9. Changes to Terms",
      content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes. Your continued use of the Service after any such changes constitutes acceptance of the new Terms."
    },
    {
      title: "10. Contact Us",
      content: "If you have any questions about these Terms of Service, please contact us at support@chatify.com or through our app."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <motion.section
        className="bg-green-600 text-white py-16"
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
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-green-100">Last updated: January 2025</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Content Section */}
      <motion.section
        className="py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center space-x-2 text-green-600 mb-8">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Please read our terms carefully</span>
            </div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-l-4 border-green-500 pl-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-center">
                By using Chatify, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
              </p>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <motion.a
              href="/privacy-policy"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Privacy Policy</h3>
                  <p className="text-sm text-gray-500">Learn how we protect your data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <motion.a
              href="/login"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Create Account</h3>
                  <p className="text-sm text-gray-500">Join Chatify today</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default TermsOfService;
