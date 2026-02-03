import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Lock, Crown, Sparkles, ArrowLeft } from 'lucide-react';
import { PremiumManager } from '../utils/premiumManager';

const WassimAIPage = () => {
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `wassim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setIsPremium(PremiumManager.isPremiumActive());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting when premium user opens chat
  useEffect(() => {
    if (isPremium && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'أهلا بيك يا خويا! 🇩🇿 أنا وسيم، مرشدك الشخصي لعنابة. واش تحب تعرف؟ اسألني على أي حاجة - تاريخ، شواطئ، ماكلة، أسرار البلاد... أنا هنا باش نساعدك! 😎',
        timestamp: new Date()
      }]);
    }
  }, [isPremium, messages.length]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${API_URL}/api/wassim-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          session_id: sessionId,
          language: 'ar'
        })
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Ya khoya, 3andna mochkla fel connexion! Jarreb mara okhra. 🙏',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // PAYWALL - Locked Screen for Non-Premium Users
  if (!isPremium) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Blurred Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=1200')`,
            filter: 'blur(8px)',
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Lock Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
          {/* Lock Icon */}
          <div className="mb-6 relative">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/30 animate-pulse">
              <Lock className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2">
            Wassim AI Super Guide
          </h1>
          <div className="flex items-center gap-2 mb-6">
            <Bot className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-bold">🤖💎</span>
            <Crown className="w-5 h-5 text-amber-400" />
          </div>

          {/* Description */}
          <p className="text-white/90 text-lg mb-4 max-w-sm leading-relaxed">
            Unlock the <span className="text-amber-400 font-bold">only guide</span> that knows <span className="text-amber-400 font-bold">everything</span> about Annaba.
          </p>

          {/* Features List */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 max-w-sm">
            <ul className="text-white/90 text-sm space-y-3 text-right" dir="rtl">
              <li className="flex items-center gap-3">
                <span className="text-amber-400">🧠</span>
                <span>يعرف التاريخ حتى أدق التفاصيل</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-400">🗣️</span>
                <span>يتكلم بالدارجة، العربية، الفرنسية، أو الإنجليزية</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-400">🤫</span>
                <span>يعطيك أسرار لا يعرفها إلا أولاد البلاد</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-400">🔍</span>
                <span>يبحث في الويب للمعلومات الحية</span>
              </li>
            </ul>
          </div>

          {/* French Description */}
          <p className="text-white/70 text-xs mb-6 max-w-sm italic">
            Posez n'importe quelle question sur Annaba ! Histoire, bons plans, plages cachées... Wassim sait tout.
          </p>

          {/* Upgrade Button */}
          <button
            onClick={() => navigate('/shop')}
            data-testid="upgrade-premium-btn"
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-full shadow-lg shadow-amber-500/30 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3"
          >
            <Crown className="w-5 h-5" />
            <span>Upgrade to Premium</span>
            <span className="text-amber-200">500 DA</span>
          </button>

          <p className="text-white/50 text-xs mt-4">
            Lifetime Access • Instant Activation
          </p>
        </div>
      </div>
    );
  }

  // PREMIUM - Full Chat Interface
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-4 flex items-center gap-4 shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <Bot className="w-7 h-7 text-amber-600" />
        </div>
        
        <div className="flex-1">
          <h1 className="text-white font-bold text-lg flex items-center gap-2">
            Wassim AI
            <Crown className="w-4 h-4 text-amber-200" />
          </h1>
          <p className="text-amber-100 text-xs">🟢 Online • Wlid Bled</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-amber-600 text-white rounded-br-md'
                  : 'bg-slate-700 text-white rounded-bl-md'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1 text-amber-400 text-xs font-bold">
                  <Bot className="w-3 h-3" />
                  Wassim
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap" dir="auto">
                {msg.content}
              </p>
              <p className="text-xs opacity-50 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                <Bot className="w-3 h-3" />
                Wassim
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-4 pb-20">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب سؤالك هنا... / Écris ta question..."
            className="flex-1 bg-slate-700 text-white rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-400"
            dir="auto"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WassimAIPage;
