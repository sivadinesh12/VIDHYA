import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import FileUpload from './FileUpload';

const MessageInput = ({ 
  inputText, 
  setInputText, 
  handleSendMessage, 
  isTyping, 
  inputRef,
  onFileSelect 
}) => {
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(e);
  };

  const handleFileUpload = (files) => {
    onFileSelect(files);
    setShowFileUpload(false);
  };

  return (
    <>
      <footer className="chat-footer">
        <form onSubmit={handleSubmit} className="message-form">
          <div className="input-container">
            <button
              type="button"
              className="attachment-button"
              onClick={() => setShowFileUpload(true)}
              disabled={isTyping}
              title="Attach files"
            >
              <Paperclip size={20} />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              className="message-input"
              disabled={isTyping}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!inputText.trim() || isTyping}
            >
              <Send />
            </button>
          </div>
        </form>
      </footer>

      {showFileUpload && (
        <FileUpload
          onFileSelect={handleFileUpload}
          onClose={() => setShowFileUpload(false)}
        />
      )}
    </>
  );
};

export default MessageInput;