import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import FileMessage from './FileMessage';
import watermarkLogo from '../logo/mylogo.png'; // adjust path if needed

const MessageList = ({ messages, isTyping, messagesEndRef, formatTime }) => {
  return (
    <main className="chat-main">
      <div className="messages-container">
        {/* Watermark in background */}
        <img
          src={watermarkLogo}
          alt="Watermark"
          className="chat-watermark"
        />

        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-avatar">
              {message.sender === 'ai' ? <Bot /> : <User />}
            </div>
            <div className="message-content">
              {message.files && message.files.length > 0 ? (
                <FileMessage
                  files={message.files}
                  sender={message.sender}
                  timestamp={message.timestamp}
                  formatTime={formatTime}
                />
              ) : (
                <>
                  <div className="message-bubble">
                    {message.sender === 'ai' ? (
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    ) : (
                      <p>{message.text}</p>
                    )}
                  </div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message ai">
            <div className="message-avatar">
              <Bot />
            </div>
            <div className="message-content">
              <div className="message-bubble typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
};

export default MessageList;
