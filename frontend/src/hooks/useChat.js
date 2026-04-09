import { useState, useRef, useEffect } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Vidhya, your education assistant. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentChatId, setCurrentChatId] = useState(1);
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      title: 'VIDHYA NEET ASSISTANT',
      lastMessage: "Hello! I'm Vidhya...",
      timestamp: new Date(),
      active: true
    }
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!inputText.trim()) return;

  const userMessage = {
    id: Date.now(),
    text: inputText,
    sender: 'user',
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputText('');
  setIsTyping(true);

  try {
    console.log("✉️ Sending to backend:", inputText);

    const res = await fetch("https://vidhya-rj6h.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ Session support
      body: JSON.stringify({ message: inputText }),
    });

    const data = await res.json();
    console.log("✅ Response from backend:", data);

    const aiText = data.text || data.answer || "⚠️ No AI response found.";

    const aiMessage = {
      id: Date.now() + 1,
      text: aiText,
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);

  } catch (err) {
    console.error("❌ Chat request failed:", err);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        text: '⚠️ Error contacting backend. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  } finally {
    setIsTyping(false);
  }
};



  const handleFileSelect = (files) => {
    const fileMessage = {
      id: Date.now(),
      files,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, fileMessage]);
    setIsTyping(true);

    const fileNames = files.map(f => f.name).join(', ');

    setChatHistory(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? { ...chat, lastMessage: `Shared files: ${fileNames}`, timestamp: new Date() }
          : chat
      )
    );

    // ❗️Update or integrate backend upload here later
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: `📁 You uploaded: ${fileNames}. File analysis will be enabled soon.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleNewChat = () => {
    const newId = Date.now();
    const newChat = {
      id: newId,
      title: 'New Learning Session',
      lastMessage: 'Start your new chat...',
      timestamp: new Date(),
      active: true
    };

    setChatHistory(prev => [
      newChat,
      ...prev.map(chat => ({ ...chat, active: false }))
    ]);

    setCurrentChatId(newId);
    setMessages([
      {
        id: 1,
        text: "Hi, I'm VIDHYA! Ask me anything related to your studies.",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    setSidebarOpen(false);
  };

  const handleChatSelect = (chatId) => {
    setChatHistory(prev =>
      prev.map(chat => ({ ...chat, active: chat.id === chatId }))
    );
    setCurrentChatId(chatId);
    setSidebarOpen(false);
    setMessages([
      {
        id: 1,
        text: "Welcome back to your session! Ask anything to continue.",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (chatId === currentChatId) {
      const remaining = chatHistory.filter(chat => chat.id !== chatId);
      if (remaining.length > 0) handleChatSelect(remaining[0].id);
      else handleNewChat();
    }
  };

  const formatTime = (ts) => ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatChatTime = (ts) => {
    const now = new Date();
    const days = Math.floor((now - ts) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return ts.toLocaleDateString();
  };

  return {
    messages,
    inputText,
    setInputText,
    isTyping,
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    currentChatId,
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
  };
};
