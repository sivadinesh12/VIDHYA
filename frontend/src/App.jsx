import React from 'react';
import { useChat } from './hooks/useChat';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

function App() {
  const {
    messages,
    inputText,
    setInputText,
    isTyping,
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    chatHistory,
    messagesEndRef,
    inputRef,
    handleSendMessage,
    handleFileSelect,
    handleNewChat,
    handleChatSelect,
    handleDeleteChat,
    formatTime,
    formatChatTime
  } = useChat();

  return (
    <div className="app-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        chatHistory={chatHistory}
        handleNewChat={handleNewChat}
        handleChatSelect={handleChatSelect}
        handleDeleteChat={handleDeleteChat}
        formatChatTime={formatChatTime}
      />

      <div className="main-content">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

        <MessageList
          messages={messages}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
          formatTime={formatTime}
        />

        <MessageInput
          inputText={inputText}
          setInputText={setInputText}
          handleSendMessage={handleSendMessage}
          isTyping={isTyping}
          inputRef={inputRef}
          onFileSelect={handleFileSelect}
        />
      </div>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}

export default App;