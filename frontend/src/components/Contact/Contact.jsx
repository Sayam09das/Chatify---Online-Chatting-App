import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone, MapPin, Send, Clock, Headphones, MessageSquare, ChevronRight } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      value: "support@chatify.com",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 9am to 6pm",
      value: "+1 (555) 123-4567",
      color: "from-green-500 to-green-600"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello at our office",
      value: "123 Tech Street, San Francisco, CA",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to the login page and click 'Forgot Password'. Enter your phone number or email, and we'll send you a reset link."
    },
    {
      question: "Is Chatify free to use?",
      answer: "Yes! Chatify is completely free for personal use. We also offer premium features for businesses."
    },
    {
      question: "How does end-to-end encryption work?",
      answer: "Your messages are encrypted on your device before being sent and can only be decrypted by the recipient's device. We cannot read your messages."
    },
    {
      question: "Can I use Chatify on multiple devices?",
      answer: "Yes! You can use Chatify on your phone, tablet, and computer. Your messages sync across all your devices."
    }
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
              <Headphones className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Our team is here to help!
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Methods */}
      <motion.section
        className="py-16 -mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{method.description}</p>
                  <p className="text-green-600 font-medium">{method.value}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Contact Form & FAQ */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-100 rounded-xl p-6 text-center"
                >
                  <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700">Thank you for reaching out. We'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </motion.button>
                </form>
              )}
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <details className="group">
                      <summary className="flex items-center justify-between p-6 cursor-pointer">
                        <span className="font-semibold text-gray-900">{faq.question}</span>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
                      </summary>
                      <div className="px-6 pb-6 pt-0 text-gray-600">
                        {faq.answer}
                      </div>
                    </details>
                  </motion.div>
                ))}
              </div>

              {/* Support Hours */}
              <div className="mt-8 bg-green-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-gray-900">Support Hours</h3>
                </div>
                <p className="text-gray-600">Our support team is available:</p>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li>• Monday - Friday: 9:00 AM - 6:00 PM (PST)</li>
                  <li>• Saturday: 10:00 AM - 4:00 PM (PST)</li>
                  <li>• Sunday: Closed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Map Section */}
      <motion.section
        className="py-16 bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Headquarters</h2>
            <p className="text-gray-600 mb-4">123 Tech Street, San Francisco, CA 94105</p>
            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
              <p className="text-gray-500">Map placeholder - Add your map integration here</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;

