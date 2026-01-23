import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Use lazy initialization for premium status
  const [isPremium] = useState(() => PremiumManager.isPremiumActive());

  // FREE BOT - Formal, helpful, factual
  const getFreeBotGreeting = useCallback(() => {
    return language === 'ar' 
      ? 'مرحباً بك. أنا المساعد الآلي لدليل عنابة. يمكنني مساعدتك في العثور على الأماكن والإجابة على الأسئلة الأساسية. جرب السؤال عن "فنادق" أو "مطاعم".' 
      : language === 'fr' 
      ? 'Bonjour. Je suis l\'assistant automatique du guide d\'Annaba. Je peux vous aider à trouver des lieux et répondre aux questions de base. Essayez de demander "hôtels" ou "restaurants".'
      : 'Hello. I am the automated assistant for the Annaba guide. I can help you find places and answer basic questions. Try asking about "hotels" or "restaurants".';
  }, [language]);

  // WASSIM SUPER-BOT - Youthful, funny, emoji-heavy
  const getWassimSuperBotGreeting = useCallback(() => {
    return language === 'ar' 
      ? 'يا هلا! 😎 أنا وسيم السوبر بوت! 🚀 جاهز نساعدك تلقى أحلى الأماكن في عنابة بطريقة مرحة ومع نصايح خاصة مني! 🔥 قولي شنو تحب؟ بيتزا 🍕 ولا شاطئ 🏖️ ولا مغامرة؟ 💪' 
      : language === 'fr' 
      ? 'Salut! 😎 Je suis Wassim Super-Bot! 🚀 Prêt à t\'aider à trouver les meilleurs endroits d\'Annaba de façon fun avec mes conseils persos! 🔥 Dis-moi ce que tu veux? Pizza 🍕 ou plage 🏖️ ou aventure? 💪'
      : 'Hey! 😎 I\'m Wassim Super-Bot! 🚀 Ready to help you find the best spots in Annaba in a fun way with my personal tips! 🔥 Tell me what you want? Pizza 🍕 or beach 🏖️ or adventure? 💪';
  }, [language]);
  
  // Use lazy initialization for messages with initial greeting
  const [messages, setMessages] = useState(() => {
    const premiumStatus = PremiumManager.isPremiumActive();
    const greeting = premiumStatus ? (language === 'ar' 
      ? 'يا هلا! 😎 أنا وسيم السوبر بوت! 🚀 جاهز نساعدك تلقى أحلى الأماكن في عنابة بطريقة مرحة ومع نصايح خاصة مني! 🔥 قولي شنو تحب؟ بيتزا 🍕 ولا شاطئ 🏖️ ولا مغامرة؟ 💪' 
      : language === 'fr' 
      ? 'Salut! 😎 Je suis Wassim Super-Bot! 🚀 Prêt à t\'aider à trouver les meilleurs endroits d\'Annaba de façon fun avec mes conseils persos! 🔥 Dis-moi ce que tu veux? Pizza 🍕 ou plage 🏖️ ou aventure? 💪'
      : 'Hey! 😎 I\'m Wassim Super-Bot! 🚀 Ready to help you find the best spots in Annaba in a fun way with my personal tips! 🔥 Tell me what you want? Pizza 🍕 or beach 🏖️ or adventure? 💪')
    : (language === 'ar' 
      ? 'مرحباً بك. أنا المساعد الآلي لدليل عنابة. يمكنني مساعدتك في العثور على الأماكن والإجابة على الأسئلة الأساسية. جرب السؤال عن "فنادق" أو "مطاعم".' 
      : language === 'fr' 
      ? 'Bonjour. Je suis l\'assistant automatique du guide d\'Annaba. Je peux vous aider à trouver des lieux et répondre aux questions de base. Essayez de demander "hôtels" ou "restaurants".'
      : 'Hello. I am the automated assistant for the Annaba guide. I can help you find places and answer basic questions. Try asking about "hotels" or "restaurants".');
    
    return [{
      id: 1,
      sender: 'bot',
      text: greeting,
      type: premiumStatus ? 'super' : 'free'
    }];
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

    // === FULL KNOWLEDGE BASE FROM PDF ===
    
    // Keywords for matching
    const keywords = {
      ar: {
        pizza: ['بيتزا', 'pizza', 'طعام', 'أكل'],
        beach: ['شاطئ', 'بحر', 'سباحة', 'جنان', 'عين عشير'],
        hotel: ['فندق', 'نوم', 'إقامة', 'شيراتون', 'سيبوس', 'سابري'],
        winter: ['شتاء', 'بارد', 'سرايدي', 'جبل', 'ثلج', 'تلفريك'],
        fun: ['مرح', 'متعة', 'سهرة', 'مقهى', 'كافيه'],
        history: ['تاريخ', 'هيبون', 'قديم', 'أوغسطين', 'فينيقي'],
        transport: ['تاكسي', 'نقل', 'سعر', 'مطار'],
        hospital: ['مستشفى', 'طوارئ', 'طبيب']
      },
      fr: {
        pizza: ['pizza', 'nourriture', 'manger', 'restaurant'],
        beach: ['plage', 'mer', 'baignade', 'djenen', 'ain achir'],
        hotel: ['hôtel', 'dormir', 'sheraton', 'seybouse', 'sabri'],
        winter: ['hiver', 'froid', 'seraidi', 'montagne', 'neige', 'téléphérique'],
        fun: ['fun', 'amusement', 'sortie', 'café'],
        history: ['histoire', 'hippone', 'ancien', 'augustin', 'phénicien'],
        transport: ['taxi', 'transport', 'prix', 'aéroport'],
        hospital: ['hôpital', 'urgence', 'médecin']
      },
      en: {
        pizza: ['pizza', 'food', 'eat', 'restaurant'],
        beach: ['beach', 'sea', 'swim', 'djenen', 'ain achir'],
        hotel: ['hotel', 'sleep', 'sheraton', 'seybouse', 'sabri'],
        winter: ['winter', 'cold', 'seraidi', 'mountain', 'snow', 'cable car'],
        fun: ['fun', 'entertainment', 'night out', 'cafe'],
        history: ['history', 'hippo', 'ancient', 'augustine', 'phoenician'],
        transport: ['taxi', 'transport', 'price', 'airport'],
        hospital: ['hospital', 'emergency', 'doctor']
      }
    };

    const currentKeywords = keywords[language];

    // === HISTORY RESPONSES (From PDF) ===
    if (currentKeywords.history.some(k => lowerQuery.includes(k))) {
      return {
        text: language === 'ar' 
          ? 'عنابة؟ تاريخ عظيم يا صاحبي! 📜✨ أسست في 1295 ق.م باسم "أوبون"! ثم جاء الفينيقيون وسموها "هيبون"، وبعدين الرومان... 🏛️ وفي القرن 5 هـ انتقلت لموقعها الحالي وسماها العرب "بونة"! 💎 3300+ سنة من الحضارة! روح صفحة التاريخ تشوف التفاصيل! 🔥'
          : language === 'fr'
          ? 'Annaba? Une grande histoire mon ami! 📜✨ Fondée en 1295 av. J.-C. sous le nom d\'Ubbo! Puis les Phéniciens l\'ont appelée Hippone, puis les Romains... 🏛️ Au 5ème siècle AH, elle a déménagé et les Arabes l\'ont appelée Bône! 💎 3300+ ans de civilisation! Va voir la page Histoire pour les détails! 🔥'
          : 'Annaba? Great history my friend! 📜✨ Founded in 1295 BC as "Ubbo"! Then Phoenicians called it Hippo, then Romans... 🏛️ In 5th century AH it moved and Arabs called it Bône! 💎 3300+ years of civilization! Check the History page for details! 🔥'
      };
    }

    // === HOTEL RESPONSES (From PDF with specific details) ===
    if (currentKeywords.hotel.some(k => lowerQuery.includes(k))) {
      if (lowerQuery.includes('شيراتون') || lowerQuery.includes('sheraton')) {
        return {
          text: language === 'ar' 
            ? 'شيراتون عنابة! 🏨⭐⭐⭐⭐⭐ أحسن فندق في المدينة! موقع مركزي قرب الكورنيش، غرف واسعة بإطلالات على الميناء! 🌊 مطعمان ومسبح خارجي! نصيحتي: اطلب غرفة في الطوابق العليا للإطلالة البحرية! 😎🔥'
            : language === 'fr'
            ? 'Sheraton Annaba! 🏨⭐⭐⭐⭐⭐ Meilleur hôtel de la ville! Emplacement central près de la Corniche, chambres spacieuses avec vues sur le port! 🌊 Deux restaurants et piscine extérieure! Mon conseil: demande une chambre aux étages supérieurs pour la vue mer! 😎🔥'
            : 'Sheraton Annaba! 🏨⭐⭐⭐⭐⭐ Best hotel in the city! Central location near Corniche, spacious rooms with port views! 🌊 Two restaurants and outdoor pool! My tip: request a room on upper floors for sea view! 😎🔥'
        };
      }
      if (lowerQuery.includes('سيبوس') || lowerQuery.includes('seybouse')) {
        return {
          text: language === 'ar' 
            ? 'فندق سيبوس إنترناشيونال! 🏨⭐⭐⭐⭐⭐ البرج الأيقوني في قلب عنابة! 14 طابق! 🔥 مطعم بانورامي في الأعلى - أحسن مكان لتصوير المدينة! 📸 مسبح وسبا ومركز لياقة! مناسب لرجال الأعمال والعائلات! 💯'
            : language === 'fr'
            ? 'Hotel Seybouse International! 🏨⭐⭐⭐⭐⭐ La tour iconique au cœur d\'Annaba! 14 étages! 🔥 Restaurant panoramique au sommet - meilleur endroit pour photographier la ville! 📸 Piscine, spa et centre fitness! Idéal pour les hommes d\'affaires et familles! 💯'
            : 'Hotel Seybouse International! 🏨⭐⭐⭐⭐⭐ The iconic tower in the heart of Annaba! 14 floors! 🔥 Panoramic restaurant on top - best place to photograph the city! 📸 Pool, spa and fitness center! Ideal for businessmen and families! 💯'
        };
      }
      // General hotel response
      return {
        text: language === 'ar' 
          ? 'فنادق عنابة؟ عندك خيارات كثيرة يا معلم! 🏨\n\n⭐⭐⭐⭐⭐ شيراتون وسيبوس (فخامة)\n⭐⭐⭐⭐ جولدن توليب سابري (عائلي قرب الشاطئ)\n⭐⭐⭐⭐ المنتزه سرايدي (تحفة معمارية + إطلالة جبلية)\n⭐⭐⭐⭐ هوتيل دوريان (وسط المدينة)\n\nشنو تفضل: بحر ولا جبل ولا وسط المدينة؟ 😎'
          : language === 'fr'
          ? 'Hôtels Annaba? Tu as plein de choix mon pote! 🏨\n\n⭐⭐⭐⭐⭐ Sheraton et Seybouse (luxe)\n⭐⭐⭐⭐ Golden Tulip Sabri (familial près plage)\n⭐⭐⭐⭐ El Mountazah Seraidi (chef-d\'œuvre + vue montagne)\n⭐⭐⭐⭐ Hôtel d\'Orient (centre-ville)\n\nTu préfères quoi: mer, montagne ou centre-ville? 😎'
          : 'Annaba hotels? You have many options boss! 🏨\n\n⭐⭐⭐⭐⭐ Sheraton & Seybouse (luxury)\n⭐⭐⭐⭐ Golden Tulip Sabri (family near beach)\n⭐⭐⭐⭐ El Mountazah Seraidi (masterpiece + mountain view)\n⭐⭐⭐⭐ Hotel d\'Orient (city center)\n\nWhat do you prefer: sea, mountain or city center? 😎'
      };
    }

    // === TRANSPORT RESPONSES ===
    if (currentKeywords.transport.some(k => lowerQuery.includes(k))) {
      return {
        text: language === 'ar' 
          ? 'التنقل في عنابة؟ خليني نوريك! 🚕\n\n📍 المطار ↔ وسط المدينة: 800-1200 دج\n📍 وسط المدينة ↔ سرايدي: 600-900 دج\n📍 وسط المدينة ↔ الشواطئ: 300-500 دج\n🚡 التلفريك لسرايدي: 60-70 دج فقط!\n🚌 الحافلات: 20 دج داخل المدينة\n\n💡 نصيحتي: دايماً اتفق على السعر قبل ما تركب! 😎'
          : language === 'fr'
          ? 'Se déplacer à Annaba? Laisse-moi te montrer! 🚕\n\n📍 Aéroport ↔ Centre: 800-1200 DA\n📍 Centre ↔ Seraidi: 600-900 DA\n📍 Centre ↔ Plages: 300-500 DA\n🚡 Téléphérique pour Seraidi: 60-70 DA seulement!\n🚌 Bus: 20 DA dans la ville\n\n💡 Mon conseil: toujours négocier le prix avant de monter! 😎'
          : 'Getting around Annaba? Let me show you! 🚕\n\n📍 Airport ↔ Center: 800-1200 DA\n📍 Center ↔ Seraidi: 600-900 DA\n📍 Center ↔ Beaches: 300-500 DA\n🚡 Cable car to Seraidi: only 60-70 DA!\n🚌 Bus: 20 DA in city\n\n💡 My tip: always agree on price before getting in! 😎'
      };
    }

    // === HOSPITAL/EMERGENCY RESPONSES ===
    if (currentKeywords.hospital.some(k => lowerQuery.includes(k))) {
      return {
        text: language === 'ar' 
          ? 'طوارئ؟ إن شاء الله خير! 🏥\n\n🚨 الحماية المدنية: 14\n🚔 الشرطة: 1548\n🏥 CHU ابن رشد: 038865151\n🏥 مستشفى دوربان: 038864000\n🏥 عيادة الرازي: 038840505\n\nالله يسلمك! اتصل مباشرة لو عندك حالة طارئة! 🙏'
          : language === 'fr'
          ? 'Urgence? J\'espère que tout va bien! 🏥\n\n🚨 Protection civile: 14\n🚔 Police: 1548\n🏥 CHU Ibn Rochd: 038865151\n🏥 Hôpital Dorban: 038864000\n🏥 Clinique El Razi: 038840505\n\nBonne chance! Appelle directement si c\'est urgent! 🙏'
          : 'Emergency? Hope everything is okay! 🏥\n\n🚨 Civil Protection: 14\n🚔 Police: 1548\n🏥 CHU Ibn Rochd: 038865151\n🏥 Dorban Hospital: 038864000\n🏥 El Razi Clinic: 038840505\n\nStay safe! Call directly if it\'s urgent! 🙏'
      };
    }

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
          ? 'شاطئ؟ يا رب! 🏖️ عندك خيارات كثيرة!\n\n🏆 جنان البي - المفضل عند الجميع! واسع وجميل!\n✨ عين عشير - مكاني الخاص، نظيف ياسر!\n🪨 بلاج اللوح - أحسن شاطئ صخري في الجزائر!\n👨‍👩‍👧 بلفيدير - مناسب للعائلات\n\nما تنساش الكريم الواقي والنظارات الشمسية! 😎☀️'
          : language === 'fr'
          ? 'Plage? Génial! 🏖️ Tu as plein de choix!\n\n🏆 Djenen El Bey - le préféré de tous! Large et beau!\n✨ Ain Achir - mon spot perso, super propre!\n🪨 Plage El Louh - meilleure plage rocheuse d\'Algérie!\n👨‍👩‍👧 Belvédère - idéal pour les familles\n\nN\'oublie pas la crème solaire et les lunettes! 😎☀️'
          : 'Beach? Awesome! 🏖️ You have many options!\n\n🏆 Djenen El Bey - everyone\'s favorite! Wide and beautiful!\n✨ Ain Achir - my personal spot, super clean!\n🪨 Plage El Louh - best rocky beach in Algeria!\n👨‍👩‍👧 Belvédère - ideal for families\n\nDon\'t forget sunscreen and sunglasses! 😎☀️'
      };
    }

    // Winter/Seraidi query
    if (currentKeywords.winter.some(k => lowerQuery.includes(k))) {
      return {
        text: language === 'ar' 
          ? 'سرايدي في الشتاء؟ يا خسارة اللي ما يروحش! ❄️🌲\n\nالهدوء والسحب على الجبال... سحر خالص! 😍\n🚡 التلفريك يخليك تشوف منظر خرافي!\n🏨 فندق المنتزه - تحفة معمارية من الستينات!\n☕ قهوة ساخنة مع الضباب = جنة!\n\nنصيحتي: سرايدي في الشتاء أحسن من الصيف! شد رواحك! 💯'
          : language === 'fr'
          ? 'Seraidi en hiver? C\'est dommage de rater ça! ❄️🌲\n\nLe calme et les nuages sur les montagnes... pure magie! 😍\n🚡 Le téléphérique te donne une vue incroyable!\n🏨 Hôtel El Mountazah - chef-d\'œuvre des années 60!\n☕ Café chaud avec le brouillard = paradis!\n\nMon conseil: Seraidi en hiver > été! Fonce! 💯'
          : 'Seraidi in winter? Such a shame to miss it! ❄️🌲\n\nThe calm and clouds on mountains... pure magic! 😍\n🚡 The cable car gives you amazing view!\n🏨 El Mountazah Hotel - 60s architectural masterpiece!\n☕ Hot coffee with fog = paradise!\n\nMy tip: Seraidi in winter > summer! Go for it! 💯'
      };
    }

    // Default search response
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
        ? 'ما فهمتش واش تقصد بالضبط 😅 قولي شوية أوضح؟ جرب:\n\n🏖️ شاطئ / بحر\n🏨 فندق / إقامة\n🍕 بيتزا / مطعم\n❄️ سرايدي / شتاء\n📜 تاريخ عنابة\n🚕 تاكسي / نقل\n🏥 مستشفى\n\nولا قولي واش تحب نعاونك فيه! 🤔💪'
        : language === 'fr'
        ? 'J\'ai pas bien compris ce que tu veux dire 😅 Dis-moi plus clairement? Essaye:\n\n🏖️ plage / mer\n🏨 hôtel / dormir\n🍕 pizza / restaurant\n❄️ seraidi / hiver\n📜 histoire d\'Annaba\n🚕 taxi / transport\n🏥 hôpital\n\nOu dis-moi comment je peux t\'aider! 🤔💪'
        : 'I didn\'t quite get what you mean 😅 Tell me more clearly? Try:\n\n🏖️ beach / sea\n🏨 hotel / sleep\n🍕 pizza / restaurant\n❄️ seraidi / winter\n📜 Annaba history\n🚕 taxi / transport\n🏥 hospital\n\nOr tell me how I can help! 🤔💪'
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
