import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Crown, Sparkles, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { searchPlaces, allPlaces } from '../data/placesData';
import { hotelsComplete, tourismAgencies } from '../data/v3EnhancedData';
import PremiumManager from '../utils/premiumManager';
import { motion, AnimatePresence } from 'framer-motion';

const DualBotPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setIsPremium(PremiumManager.isPremiumActive());
    
    // Initial greeting based on premium status
    const greeting = isPremium ? getWassimSuperBotGreeting() : getFreeBot Greeting();
    setMessages([{
      id: 1,
      sender: 'bot',
      text: greeting,
      type: isPremium ? 'super' : 'free'
    }]);
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // FREE BOT - Formal, helpful, factual
  const getFreeBotGreeting = () => {
    return language === 'ar' 
      ? 'مرحباً بك. أنا المساعد الآلي لدليل عنابة. يمكنني مساعدتك في العثور على الأماكن والإجابة على الأسئلة الأساسية. جرب السؤال عن "فنادق" أو "مطاعم".' 
      : language === 'fr' 
      ? 'Bonjour. Je suis l\'assistant automatique du guide d\'Annaba. Je peux vous aider à trouver des lieux et répondre aux questions de base. Essayez de demander "hôtels" ou "restaurants".'
      : 'Hello. I am the automated assistant for the Annaba guide. I can help you find places and answer basic questions. Try asking about "hotels" or "restaurants".';
  };

  // WASSIM SUPER-BOT - Youthful, funny, emoji-heavy
  const getWassimSuperBotGreeting = () => {
    return language === 'ar' 
      ? 'يا هلا! 😎 أنا وسيم السوبر بوت! 🚀 جاهز نساعدك تلقى أحلى الأماكن في عنابة بطريقة مرحة ومع نصايح خاصة مني! 🔥 قولي شنو تحب؟ بيتزا 🍕 ولا شاطئ 🏖️ ولا مغامرة؟ 💪' 
      : language === 'fr' 
      ? 'Salut! 😎 Je suis Wassim Super-Bot! 🚀 Prêt à t\'aider à trouver les meilleurs endroits d\'Annaba de façon fun avec mes conseils persos! 🔥 Dis-moi ce que tu veux? Pizza 🍕 ou plage 🏖️ ou aventure? 💪'
      : 'Hey! 😎 I\'m Wassim Super-Bot! 🚀 Ready to help you find the best spots in Annaba in a fun way with my personal tips! 🔥 Tell me what you want? Pizza 🍕 or beach 🏖️ or adventure? 💪';
  };

  const getFreeBotResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Basic keyword matching
    const keywords = {
      ar: {
        hotel: ['فندق', 'فنادق', 'إقامة', 'نوم'],
        restaurant: ['مطعم', 'مطاعم', 'طعام', 'أكل'],
        beach: ['شاطئ', 'بحر'],
        price: ['سعر', 'أسعار', 'كم'],
        emergency: ['طوارئ', 'مستشفى']
      },
      fr: {
        hotel: ['hôtel', 'hôtels', 'hébergement'],
        restaurant: ['restaurant', 'manger'],
        beach: ['plage', 'mer'],
        price: ['prix', 'coût', 'combien'],
        emergency: ['urgence', 'hôpital']
      },
      en: {
        hotel: ['hotel', 'hotels', 'accommodation'],
        restaurant: ['restaurant', 'food', 'eat'],
        beach: ['beach', 'sea'],
        price: ['price', 'cost', 'how much'],
        emergency: ['emergency', 'hospital']
      }
    };

    const currentKeywords = keywords[language];

    // Hotel query
    if (currentKeywords.hotel.some(k => lowerQuery.includes(k))) {
      const hotelsList = hotelsComplete.slice(0, 3).map(h => `• ${t(h.name)}`).join('\n');
      return {
        text: language === 'ar' 
          ? `لدينا ${hotelsComplete.length} فندق في عنابة. إليك بعض الخيارات:\n\n${hotelsList}\n\nللمزيد، انتقل إلى قسم الاستكشاف.`
          : language === 'fr'
          ? `Nous avons ${hotelsComplete.length} hôtels à Annaba. Voici quelques options:\n\n${hotelsList}\n\nPour plus, allez à la section Explorer.`
          : `We have ${hotelsComplete.length} hotels in Annaba. Here are some options:\n\n${hotelsList}\n\nFor more, go to Explore section.`
      };
    }

    // General search
    const results = searchPlaces(query, language);
    if (results.length > 0) {
      const topResults = results.slice(0, 3);
      return {
        text: language === 'ar' 
          ? `وجدت ${results.length} نتيجة. إليك الأفضل:` 
          : language === 'fr'
          ? `J'ai trouvé ${results.length} résultat(s). Voici les meilleurs:`
          : `Found ${results.length} result(s). Here are the best:`,
        places: topResults
      };
    }

    return {
      text: language === 'ar' 
        ? 'عذراً، لم أجد نتائج دقيقة. جرب البحث عن: فنادق، مطاعم، شواطئ، أو مواقع تاريخية.'
        : language === 'fr'
        ? 'Désolé, je n\'ai pas trouvé de résultats précis. Essayez: hôtels, restaurants, plages, ou sites historiques.'
        : 'Sorry, I didn\'t find precise results. Try: hotels, restaurants, beaches, or historical sites.'
    };
  };

  const getWassimSuperBotResponse = (query) => {
    const lowerQuery = query.toLowerCase();

    // Wassim style - energetic, emoji-heavy, personal
    const keywords = {
      ar: {
        pizza: ['بيتزا', 'pizza'],
        beach: ['شاطئ', 'بحر', 'سباحة'],
        hotel: ['فندق', 'نوم', 'إقامة'],
        winter: ['شتاء', 'بارد', 'سرايدي'],
        fun: ['مرح', 'متعة', 'سهرة']
      },
      fr: {
        pizza: ['pizza'],
        beach: ['plage', 'mer', 'baignade'],
        hotel: ['hôtel', 'dormir'],
        winter: ['hiver', 'froid', 'seraidi'],
        fun: ['fun', 'amusement', 'sortie']
      },
      en: {
        pizza: ['pizza'],
        beach: ['beach', 'sea', 'swim'],
        hotel: ['hotel', 'sleep'],
        winter: ['winter', 'cold', 'seraidi'],
        fun: ['fun', 'entertainment', 'night out']
      }
    };

    const currentKeywords = keywords[language];

    // Pizza query - Wassim style
    if (currentKeywords.pizza.some(k => lowerQuery.includes(k))) {
      return {
        text: language === 'ar' 
          ? 'يا سلام! بيتزا؟ 🍕 أنا شخصياً من عشاق البيتزا! 😍 روح لـ Downtown Pizza - الطعجة روعة! 🔥 أو Mega Pizza عندهم فروع ياسر. تاكو زادة موجود! 🌮 بالعافية خويا! 😎'
          : language === 'fr'
          ? 'Oh la la! Pizza? 🍕 Perso je suis fan de pizza! 😍 Va chez Downtown Pizza - la pâte est incroyable! 🔥 Ou Mega Pizza ils ont plusieurs branches. Tacos aussi dispo! 🌮 Bon appétit frérot! 😎'
          : 'Oh wow! Pizza? 🍕 Personally I\'m a pizza fan! 😍 Go to Downtown Pizza - the dough is amazing! 🔥 Or Mega Pizza they have many branches. Tacos also available! 🌮 Enjoy bro! 😎'
      };
    }

    // Beach query - Wassim style
    if (currentKeywords.beach.some(k => lowerQuery.includes(k))) {
      return {
        text: language === 'ar' 
          ? 'شاطئ؟ يا رب! 🏖️ روح Jnan Bey - المفضل عند الجميع! 🌊 أو Ain Achir مكاني الخاص، نظيف ياسر! ✨ ما تنساش الكريم الواقي والنظارات الشمسية! 😎☀️'
          : language === 'fr'
          ? 'Plage? Génial! 🏖️ Va à Jnan Bey - le préféré de tous! 🌊 Ou Ain Achir mon spot perso, super propre! ✨ N\'oublie pas la crème solaire et les lunettes! 😎☀️'
          : 'Beach? Awesome! 🏖️ Go to Jnan Bey - everyone\'s favorite! 🌊 Or Ain Achir my personal spot, super clean! ✨ Don\'t forget sunscreen and sunglasses! 😎☀️'
      };
    }

    // Winter/Seraidi query
    if (currentKeywords.winter.some(k => lowerQuery.includes(k))) {
      return {
        text: language === 'ar' 
          ? 'سرايدي في الشتاء؟ يا خسارة اللي ما يروحش! ❄️🌲 الهدوء والسحب على الجبال... سحر خالص! 😍 التلفريك يخليك تشوف منظر خرافي! 🚡 شد رواحك وما تفوتهاش! 💯'
          : language === 'fr'
          ? 'Seraidi en hiver? C\'est dommage de rater ça! ❄️🌲 Le calme et les nuages sur les montagnes... pure magie! 😍 Le téléphérique te donne une vue incroyable! 🚡 Fonce et ne rate pas ça! 💯'
          : 'Seraidi in winter? Such a shame to miss it! ❄️🌲 The calm and clouds on mountains... pure magic! 😍 The cable car gives you amazing view! 🚡 Go for it and don\'t miss it! 💯'
      };
    }

    // Default Wassim response
    const results = searchPlaces(query, language);
    if (results.length > 0) {
      return {
        text: language === 'ar' 
          ? `لقيتلك ${results.length} مكان يا معلم! 🎯 شوف هاذو:`
          : language === 'fr'
          ? `J'ai trouvé ${results.length} endroit(s) pour toi chef! 🎯 Regarde ça:`
          : `Found ${results.length} spot(s) for you boss! 🎯 Check these:`,
        places: results.slice(0, 3)
      };
    }

    return {
      text: language === 'ar' 
        ? 'ما فهمتش واش تقصد بالضبط 😅 قولي شوية أوضح؟ مثلاً: بيتزا، شاطئ، فندق، أو سرايدي؟ 🤔'
        : language === 'fr'
        ? 'J\'ai pas bien compris ce que tu veux dire 😅 Dis-moi plus clairement? Genre: pizza, plage, hôtel, ou seraidi? 🤔'
        : 'I didn\'t quite get what you mean 😅 Tell me more clearly? Like: pizza, beach, hotel, or seraidi? 🤔'
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Check if trying to use premium features without premium
    if (!isPremium && input.toLowerCase().includes('wassim')) {
      const lockMessage = {
        id: Date.now(),
        sender: 'bot',
        text: language === 'ar' 
          ? '🔒 بوت وسيم الخارق متاح فقط للأعضاء المميزين! احصل على الباقة الشاملة من المتجر لتجربة كاملة! 🚀'
          : language === 'fr'
          ? '🔒 Wassim Super-Bot disponible uniquement pour membres premium! Obtenez le forfait Ultimate au Shop pour l\'expérience complète! 🚀'
          : '🔒 Wassim Super-Bot available only for premium members! Get the Ultimate bundle from Shop for the full experience! 🚀',
        type: 'locked',
        action: 'shop'
      };
      setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: input }, lockMessage]);
      setInput('');
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = isPremium ? getWassimSuperBotResponse(input) : getFreeBotResponse(input);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        places: response.places,
        type: isPremium ? 'super' : 'free'
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className={`${isPremium ? 'bg-gradient-to-br from-secondary via-primary to-secondary' : 'bg-primary'} text-white p-6 flex items-center gap-3`}>
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            {isPremium ? (
              <>
                <Sparkles className="w-6 h-6" />
                {language === 'ar' ? 'بوت وسيم الخارق 🚀' : language === 'fr' ? 'Wassim Super-Bot 🚀' : 'Wassim Super-Bot 🚀'}
              </>
            ) : (
              <>
                🤖 {language === 'ar' ? 'المساعد الآلي' : language === 'fr' ? 'Assistant Bot' : 'Assistant Bot'}
              </>
            )}
          </h1>
          <p className="text-sm opacity-90">
            {isPremium 
              ? (language === 'ar' ? 'نصايح وسيم الشخصية 😎' : language === 'fr' ? 'Conseils persos de Wassim 😎' : 'Wassim\'s personal tips 😎')
              : (language === 'ar' ? 'مساعد أساسي' : language === 'fr' ? 'Assistant basique' : 'Basic assistant')}
          </p>
        </div>
        {!isPremium && (
          <button
            onClick={() => navigate('/shop')}
            className="bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse"
          >
            <Crown className="w-3.5 h-3.5" />
            {language === 'ar' ? 'ترقية' : language === 'fr' ? 'Upgrade' : 'Upgrade'}
          </button>
        )}
      </div>

      {/* Messages */}
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
                    : message.type === 'super'
                    ? 'bg-gradient-to-br from-secondary/20 to-primary/20 border-2 border-secondary/30 text-foreground rounded-tl-none'
                    : message.type === 'locked'
                    ? 'bg-accent/20 border-2 border-accent/50 text-foreground rounded-tl-none'
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

                {message.action === 'shop' && (
                  <button
                    onClick={() => navigate('/shop')}
                    className="mt-3 w-full bg-primary text-primary-foreground rounded-xl py-2 px-4 font-bold flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    {language === 'ar' ? 'فتح المتجر' : language === 'fr' ? 'Ouvrir Shop' : 'Open Shop'}
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
            <div className={`${isPremium ? 'bg-gradient-to-br from-secondary/20 to-primary/20 border-2 border-secondary/30' : 'bg-muted'} rounded-2xl rounded-tl-none p-4`}>
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

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isPremium 
              ? (language === 'ar' ? 'قولي شنوة تحب... 😎' : language === 'fr' ? 'Dis-moi ce que tu veux... 😎' : 'Tell me what you want... 😎')
              : (language === 'ar' ? 'اكتب سؤالك...' : language === 'fr' ? 'Posez votre question...' : 'Type your question...')}
            data-testid="bot-input"
            className="flex-1 px-4 py-3 bg-muted rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            data-testid="bot-send"
            disabled={!input.trim()}
            className={`w-12 h-12 ${isPremium ? 'bg-gradient-to-br from-secondary to-primary' : 'bg-primary'} text-primary-foreground rounded-full flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
          >
            <Send className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DualBotPage;
