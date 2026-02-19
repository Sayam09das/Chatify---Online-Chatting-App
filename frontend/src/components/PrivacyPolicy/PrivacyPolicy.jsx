import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Lock, Eye, User, ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Introduction",
      content: "At Chatify, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our messaging platform. Please read this privacy policy carefully."
    },
    {
      title: "2. Information We Collect",
      content: "We collect information you provide directly to us, including: account information (name, phone number, profile picture), messages you send and receive, contacts you choose to sync, and device information (device type, operating system, unique device identifiers). We also collect usage data and analytics to improve our service."
    },
    {
      title: "3. How We Use Your Information",
      content: "We use the information we collect to: provide, maintain, and improve our services; send you technical notices, updates, and support messages; respond to your comments and questions; communicate with you about products, services, and events; monitor and analyze trends, usage, and activities; detect, investigate, and prevent fraudulent transactions and other illegal activities."
    },
    {
      title: "4. Information Sharing and Disclosure",
      content: "We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share information with: service providers who assist us in operating our platform; other Chatify users as you choose to communicate with them; law enforcement when required by law or to protect our rights. Your messages are only visible to you and the recipients you choose."
    },
    {
      title: "5. Data Security",
      content: "We implement appropriate technical and organizational security measures to protect your personal information. We use end-to-end encryption for your messages, meaning only you and your intended recipients can read them. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security."
    },
    {
      title: "6. End-to-End Encryption",
      content: "Chatify uses end-to-end encryption to protect your messages. This means your messages are encrypted on your device and can only be decrypted by the recipient's device. We cannot read your messages, and neither can any third party. Encryption keys are stored only on the devices of the communicating parties."
    },
    {
      title: "7. Your Rights and Choices",
      content: "You have the right to: access and download your personal data; correct inaccurate personal data; request deletion of your personal data; object to processing of your personal data; restrict processing of your personal data; data portability. You can manage your account settings to exercise these rights."
    },
    {
      title: "8. Children's Privacy",
      content: "Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately."
    },
    {
      title: "9. Changes to This Policy",
      content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date. You are advised to review this Privacy Policy periodically for any changes."
    },
    {
      title: "10. Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us at privacy@chatify.com or through our app. We will respond to your inquiry within 30 days."
    }
  ];

  const highlights = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      desc: "Your messages are encrypted and can only be read by you and your recipients"
    },
    {
      icon: Eye,
      title: "We Don't Read Your Messages",
      desc: "Your privacy is paramount - we cannot access your private conversations"
    },
    {
      icon: Shield,
      title: "Secure Data Storage",
      desc: "Your data is stored securely with industry-standard protection measures"
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
              <Shield className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-green-100">Last updated: January 2025</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Highlights Section */}
      <motion.section
        className="py-12 bg-green-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
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
              <Lock className="w-5 h-5" />
              <span className="font-medium">Your privacy is our priority</span>
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
              <div className="bg-green-50 rounded-xl p-6 flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Your Trust Matters</h3>
                  <p className="text-gray-600 text-sm">We are committed to protecting your privacy and maintaining the highest standards of data protection. If you have any concerns about how we handle your data, please don't hesitate to contact us.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <motion.a
              href="/terms-of-service"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Terms of Service</h3>
                  <p className="text-sm text-gray-500">Read our terms and conditions</p>
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

export default PrivacyPolicy;
