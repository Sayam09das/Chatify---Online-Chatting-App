import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GetStarted from './components/GetStarted/GetStarted';
import Loginpage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage/ForgotPasswordPage';
import TermsOfService from './components/TermsOfService/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import Features from './components/Features/Features';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Conversation from './components/Conversation/Conversation';
import AISpace from './components/AISpace/AISpace';
import CommunityHub from './components/CommunityHub/CommunityHub';
import CreatorStudio from './components/CreatorStudio/CreatorStudio';
import Innovation from './components/Innovation/Innovation';
import Support from './components/Support/Support';
import Layout from './components/Layout/Layout';
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<GetStarted />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/conversation" element={<Conversation />} />
            <Route path="/ai-space" element={<AISpace />} />
            <Route path="/community-hub" element={<CommunityHub />} />
            <Route path="/creator-studio" element={<CreatorStudio />} />
            <Route path="/innovation" element={<Innovation />} />
            <Route path="/support" element={<Support />} />
          </Route>
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
