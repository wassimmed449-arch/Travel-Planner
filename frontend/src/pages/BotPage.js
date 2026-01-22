import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { searchPlaces, allPlaces } from '../data/placesData';
import { motion, AnimatePresence } from 'framer-motion';

const BotPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: language === 'ar' 
        ? 'مرحباً! أنا بوت وسيم 🤖 يمكنني مساعدتك في العثور على أماكن في عنابة. جرب أن تسأل عن "بيتزا" أو "شاطئ" أو "فنادق"!' 
        : 'Salut ! Je suis le Bot Wassim 🤖 Je peux vous aider à trouver des lieux à Annaba. Essayez de demander "pizza", "plage" ou "hôtels" !'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    const keywords = {
      ar: {
        beach: ['شاطئ', 'بحر', 'سباحة'],
        restaurant: ['مطعم', 'طعام', 'أكل', 'بيتزا', 'سمك'],
        cafe: ['مقهى', 'قهوة', 'شاي'],
        hotel: ['فندق', 'إقامة', 'نوم'],
        historical: ['تاريخ', 'متحف', 'أثري', 'قديم'],
        winter: ['شتاء', 'بارد', 'ثلج', 'سرايدي'],
        emergency: ['طوارئ', 'مستشفى', 'طبيب', 'شرطة'],
        transport: ['تاكسي', 'نقل', 'مواصلات', 'سيارة']
      },
      fr: {
        beach: ['plage', 'mer', 'baignade', 'nager'],
        restaurant: ['restaurant', 'manger', 'pizza', 'poisson'],
        cafe: ['café', 'thé'],
        hotel: ['hôtel', 'dormir', 'séjour'],
        historical: ['histoire', 'musée', 'ancien'],
        winter: ['hiver', 'froid', 'neige', 'seraidi'],
        emergency: ['urgence', 'hôpital', 'médecin', 'police'],
        transport: ['taxi', 'transport', 'voiture']
      }
    };

    const currentKeywords = keywords[language];
    
    if (currentKeywords.emergency.some(k => lowerQuery.includes(k))) {
      return {
        text: language === 'ar' 
          ? 'في حالة الطوارئ، يمكنك الاتصال بـ:\n🚑 الحماية المدنية: 14\n🚓 الشرطة: 1548\n\nأو انتقل إلى قسم الطوارئ لمزيد من التفاصيل.' 
          : 'En cas d\'urgence, vous pouvez appeler:\n🚑 Protection Civile: 14\n🚓 Police: 1548\n\nOu allez à la section Urgences pour plus de détails.',
        action: 'sos'
      };
    }

    if (currentKeywords.transport.some(k => lowerQuery.includes(k))) {
      return {
        text: language === 'ar' 
          ? 'أسعار التاكسي في عنابة:\n🚕 إلى وسط المدينة: 50-70 دج\n🚕 إلى سرايدي: 70-150 دج\n\nاستخدم حاسبة النقل لتقدير دقيق!' 
          : 'Prix des taxis à Annaba:\n🚕 Vers centre-ville: 50-70 DA\n🚕 Vers Seraidi: 70-150 DA\n\nUtilisez le calculateur de transport pour une estimation précise !',
        action: 'transport'
      };
    }

    const results = searchPlaces(query, language);
    
    if (results.length > 0) {
      const topResults = results.slice(0, 3);
      const resultText = topResults.map(p => `📍 ${t(p.name)}`).join('\n');
      
      return {
        text: language === 'ar' 
          ? `وجدت ${results.length} نتيجة لـ "${query}":\n\n${resultText}\n\nانقر على أي مكان لمزيد من التفاصيل!` 
          : `J'ai trouvé ${results.length} résultat(s) pour "${query}":\n\n${resultText}\n\nCliquez sur un lieu pour plus de détails !`,
        places: topResults
      };
    }

    return {
      text: language === 'ar' 
        ? 'عذراً، لم أجد نتائج لـ "' + query + '". جرب البحث عن: شاطئ، مطعم، مقهى، فندق، أو تاريخية.' 
        : 'Désolé, je n\'ai pas trouvé de résultats pour "' + query + '". Essayez de chercher: plage, restaurant, café, hôtel, ou historique.'
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(input);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        places: response.places,
        action: response.action
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="bg-primary text-primary-foreground p-6 flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">
            {language === 'ar' ? 'بوت وسيم 🤖' : 'Bot Wassim 🤖'}
          </h1>
          <p className="text-sm opacity-80">
            {language === 'ar' ? 'مساعدك الشخصي' : 'Votre assistant personnel'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'bg-muted text-foreground rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line text-sm">{message.text}</p>
                
                {message.places && (
                  <div className="mt-3 space-y-2">
                    {message.places.map((place) => (
                      <button
                        key={place.id}
                        onClick={() => navigate(`/place/${place.id}`)}
                        data-testid={`bot-place-${place.id}`}
                        className="w-full text-start bg-background/50 hover:bg-background/80 rounded-xl p-3 transition-all"
                      >
                        <p className="font-bold text-sm">{t(place.name)}</p>
                        <p className="text-xs opacity-70 line-clamp-1">
                          {t(place.description) || t(place.type)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {message.action === 'sos' && (
                  <button
                    onClick={() => navigate('/sos')}
                    className="mt-3 w-full bg-destructive text-destructive-foreground rounded-xl py-2 px-4 font-bold"
                  >
                    {language === 'ar' ? 'فتح قسم الطوارئ' : 'Ouvrir Section Urgences'}
                  </button>
                )}

                {message.action === 'transport' && (
                  <button
                    onClick={() => navigate('/transport-calculator')}
                    className="mt-3 w-full bg-secondary text-secondary-foreground rounded-xl py-2 px-4 font-bold"
                  >
                    {language === 'ar' ? 'فتح حاسبة النقل' : 'Ouvrir Calculateur'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-muted rounded-2xl rounded-tl-none p-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'ar' ? 'اكتب سؤالك...' : 'Posez votre question...'}
            data-testid="bot-input"
            className="flex-1 px-4 py-3 bg-muted rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            data-testid="bot-send"
            disabled={!input.trim()}
            className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <Send className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotPage;
