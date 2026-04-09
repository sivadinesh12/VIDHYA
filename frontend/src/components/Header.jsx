import React from 'react';
import { GraduationCap, Menu, X, User, CreditCard, HelpCircle, Settings } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="chat-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="header-title">
          <GraduationCap className="header-icon" />
          <h1>Vidhya</h1>
          <span className="ai-subtitle">Education Assistant</span>
        </div>
      </div>
      
      <div className="header-right">
        <div className="profile-section">
          <div className="profile-info">
            <span className="profile-name">Student</span>
            <span className="profile-email">Free Plan</span>
          </div>
          <div className="profile-avatar">
            <User size={20} />
          </div>
          <div className="profile-dropdown">
            <button className="profile-menu-item">
              <CreditCard size={16} />
              Plan
            </button>
            <button className="profile-menu-item">
              <HelpCircle size={16} />
              Help
            </button>
            <button className="profile-menu-item">
              <Settings size={16} />
              Mode
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;