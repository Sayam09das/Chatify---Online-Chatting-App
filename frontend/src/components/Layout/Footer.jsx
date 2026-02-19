import React from 'react';
import { MessageCircle, Mail, Phone, ShieldCheck, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { to: '/features', label: 'Features' },
    { to: '/conversation', label: 'Conversations' },
    { to: '/ai-space', label: 'AI Space' },
    { to: '/creator-studio', label: 'Creator Studio' },
  ];

  const companyLinks = [
    { to: '/about', label: 'About' },
    { to: '/community-hub', label: 'Community' },
    { to: '/innovation', label: 'Innovation Lab' },
    { to: '/contact', label: 'Contact' },
  ];

  const supportLinks = [
    { to: '/support', label: 'Help Center' },
    { to: '/terms-of-service', label: 'Terms of Service' },
    { to: '/privacy-policy', label: 'Privacy Policy' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-950 to-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-600/30">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">Chatify</p>
                <p className="text-sm text-gray-400">Simple. Reliable. Private.</p>
              </div>
            </div>

            <p className="text-gray-400 max-w-md mb-6">
              Modern, secure communication for teams, creators, and communities. Built for fast collaboration with privacy first.
            </p>

            <div className="flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 transition-colors flex items-center justify-center">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 transition-colors flex items-center justify-center">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 transition-colors flex items-center justify-center">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-300 mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-300 mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-300 mb-4">Support</h3>
            <ul className="space-y-3 mb-6">
              {supportLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-500" />
                <a href="mailto:support@chatify.com" className="hover:text-white transition-colors">support@chatify.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-500" />
                <span>+1 (800) 555-0149</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Enterprise-grade security</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {currentYear} Chatify. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Built for global messaging with privacy by design.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
