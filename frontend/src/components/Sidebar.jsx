import React from 'react';
import { Plus, Search, BookOpen, Clock, Trash2 } from 'lucide-react';

const Sidebar = ({ 
  sidebarOpen, 
  searchQuery, 
  setSearchQuery, 
  chatHistory, 
  handleNewChat, 
  handleChatSelect, 
  handleDeleteChat, 
  formatChatTime 
}) => {
  const filteredChats = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={handleNewChat}>
          <Plus size={20} />
          New Learning Session
        </button>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search learning sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="chat-history">
        <h3 className="history-title">Recent Sessions</h3>
        <div className="chat-list">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${chat.active ? 'active' : ''}`}
              onClick={() => handleChatSelect(chat.id)}
            >
              <div className="chat-item-content">
                <div className="chat-item-header">
                  <BookOpen size={16} className="chat-icon" />
                  <span className="chat-title">{chat.title}</span>
                  <button
                    className="delete-chat-btn"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="chat-preview">{chat.lastMessage}</p>
                <div className="chat-time">
                  <Clock size={12} />
                  {formatChatTime(chat.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;