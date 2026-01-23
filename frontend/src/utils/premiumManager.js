// ================================================================================================
// PREMIUM ACCESS SYSTEM - V3.0 ULTIMATE
// Manual BaridiMob Payment + WhatsApp Receipt + Key Validation
// ================================================================================================

const PREMIUM_KEY_PREFIX = 'annaba_premium_v3_';
const PREMIUM_DURATION_MONTHS = 6;
const PREMIUM_PRICE_DA = 500;

// Valid premium keys (in production, server-validated or dynamically generated)
const VALID_PREMIUM_KEYS = [
  'ANNABA2025ULTIMATE',
  'WASSIM500KEY',
  'BONETRAVEL2025',
  'WSPR0SH0P',
  'ANNABA6MONTHS',
  // More keys can be added
];

export const PremiumManager = {
  // Check if user has active premium access
  isPremiumActive: () => {
    const premiumData = localStorage.getItem(`${PREMIUM_KEY_PREFIX}access`);
    if (!premiumData) return false;
    
    try {
      const data = JSON.parse(premiumData);
      const expiryDate = new Date(data.expiryDate);
      const now = new Date();
      
      return now < expiryDate;
    } catch {
      return false;
    }
  },

  // Activate premium with a key
  activatePremiumKey: (key) => {
    const normalizedKey = key.toUpperCase().trim().replace(/\s+/g, '');
    
    if (!VALID_PREMIUM_KEYS.includes(normalizedKey)) {
      return { 
        success: false, 
        error: 'invalid_key',
        message: { 
          ar: 'المفتاح غير صحيح. تأكد من إدخاله بشكل صحيح.',
          fr: 'Clé invalide. Vérifiez que vous l\'avez saisie correctement.',
          en: 'Invalid key. Make sure you entered it correctly.'
        }
      };
    }

    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setMonth(expiryDate.getMonth() + PREMIUM_DURATION_MONTHS);

    const premiumData = {
      activated: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      key: normalizedKey,
      version: '3.0'
    };

    localStorage.setItem(`${PREMIUM_KEY_PREFIX}access`, JSON.stringify(premiumData));
    
    return { 
      success: true, 
      message: {
        ar: 'تم تفعيل الباقة الشاملة بنجاح! 🎉',
        fr: 'Forfait Ultimate activé avec succès! 🎉',
        en: 'Ultimate Bundle activated successfully! 🎉'
      },
      expiryDate: expiryDate 
    };
  },

  // Get premium expiry date
  getExpiryDate: () => {
    const premiumData = localStorage.getItem(`${PREMIUM_KEY_PREFIX}access`);
    if (!premiumData) return null;
    
    try {
      const data = JSON.parse(premiumData);
      return new Date(data.expiryDate);
    } catch {
      return null;
    }
  },

  // Get days remaining
  getDaysRemaining: () => {
    if (!PremiumManager.isPremiumActive()) return 0;
    
    const expiryDate = PremiumManager.getExpiryDate();
    if (!expiryDate) return 0;
    
    const now = new Date();
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  },

  // Get activation date
  getActivationDate: () => {
    const premiumData = localStorage.getItem(`${PREMIUM_KEY_PREFIX}access`);
    if (!premiumData) return null;
    
    try {
      const data = JSON.parse(premiumData);
      return new Date(data.activated);
    } catch {
      return null;
    }
  },

  // Premium features list
  getFeaturesList: () => [
    {
      id: 'smart-map',
      icon: '🗺️',
      premiumOnly: false,
      highlight: true,
      name: { 
        ar: 'الخريطة الذكية التفاعلية', 
        fr: 'Carte Interactive Intelligente', 
        en: 'Smart Interactive Map' 
      },
      description: { 
        ar: 'تنقل سهل مع دبابيس وتوجيهات Google Maps', 
        fr: 'Navigation facile avec pins et directions Google Maps', 
        en: 'Easy navigation with pins and Google Maps directions' 
      }
    },
    {
      id: 'pdf-download',
      icon: '📚',
      premiumOnly: true,
      name: { 
        ar: 'تحميل الكتاب الكامل PDF', 
        fr: 'Télécharger le Livre Complet PDF', 
        en: 'Full PDF Guidebook Download' 
      },
      description: { 
        ar: 'دليل السفر الكامل V3 بصيغة PDF للقراءة أوفلاين', 
        fr: 'Guide de voyage complet V3 en PDF pour lecture hors-ligne', 
        en: 'Complete V3 travel guide in PDF for offline reading' 
      }
    },
    {
      id: 'wassim-super-bot',
      icon: '🤖',
      premiumOnly: true,
      name: { 
        ar: 'بوت وسيم الخارق', 
        fr: 'Wassim Super-Bot', 
        en: 'Wassim Super-Bot (Personal Assistant)' 
      },
      description: { 
        ar: 'مساعد شخصي بأسلوب وسيم الشبابي المرح مع إيموجي ونصائح سرية 😎', 
        fr: 'Assistant personnel dans le style jeune et amusant de Wassim avec emojis et conseils secrets 😎', 
        en: 'Personal assistant in Wassim\'s youthful fun style with emojis and secret tips 😎' 
      }
    },
    {
      id: 'deep-secrets',
      icon: '🔮',
      premiumOnly: true,
      name: { 
        ar: 'أسرار محلية عميقة', 
        fr: 'Secrets Locaux Profonds', 
        en: 'Deep Local Secrets' 
      },
      description: { 
        ar: 'تاريخ المدينة الكامل والأماكن المخفية التي لا يعرفها السياح', 
        fr: 'Histoire complète de la ville et lieux cachés inconnus des touristes', 
        en: 'Full city history and hidden spots tourists don\'t know' 
      }
    },
    {
      id: 'hidden-gems',
      icon: '💎',
      premiumOnly: true,
      name: { 
        ar: 'جواهر مخفية', 
        fr: 'Joyaux cachés', 
        en: 'Hidden Gems' 
      },
      description: { 
        ar: 'أماكن سرية لا يعرفها إلا وسيم وأصدقاؤه', 
        fr: 'Lieux secrets connus seulement de Wassim et ses amis', 
        en: 'Secret places known only to Wassim and his friends' 
      }
    },
    {
      id: 'priority-support',
      icon: '⚡',
      premiumOnly: true,
      name: { 
        ar: 'دعم فوري من وسيم', 
        fr: 'Support immédiat de Wassim', 
        en: 'Immediate Support from Wassim' 
      },
      description: { 
        ar: 'تواصل مباشر عبر واتساب مع وسيم شخصياً', 
        fr: 'Contact direct via WhatsApp avec Wassim personnellement', 
        en: 'Direct contact via WhatsApp with Wassim personally' 
      }
    },
    {
      id: 'offline-maps',
      icon: '🗺️',
      premiumOnly: true,
      name: { 
        ar: 'خرائط مفصلة أوفلاين', 
        fr: 'Cartes détaillées hors ligne', 
        en: 'Detailed Offline Maps' 
      },
      description: { 
        ar: 'خرائط بدون إنترنت مع جميع الأماكن محددة', 
        fr: 'Cartes sans Internet avec tous les lieux marqués', 
        en: 'Offline maps with all places marked' 
      }
    }
  ],

  // Payment info for BaridiMob
  getPaymentInfo: () => ({
    method: 'BaridiMob',
    rip: '00799999002810927704',
    recipient: 'Benfernane Mohamed Ouassim',
    amount: PREMIUM_PRICE_DA,
    currency: 'DZD',
    whatsappNumber: '213552664037',
    whatsappMessageTemplate: {
      ar: `مرحباً وسيم،\n\nلقد قمت بتحويل ${PREMIUM_PRICE_DA} دج للحصول على الباقة الشاملة لتطبيق عنابة.\n\nRIP: 00799999002810927704\n\nمرفق إيصال الدفع.\n\nشكراً! 🙏`,
      fr: `Bonjour Wassim,\n\nJ'ai transféré ${PREMIUM_PRICE_DA} DA pour obtenir le forfait Ultimate de l'app Annaba.\n\nRIP: 00799999002810927704\n\nReçu de paiement joint.\n\nMerci! 🙏`,
      en: `Hello Wassim,\n\nI have transferred ${PREMIUM_PRICE_DA} DA to get the Ultimate bundle for the Annaba app.\n\nRIP: 00799999002810927704\n\nPayment receipt attached.\n\nThank you! 🙏`
    }
  }),

  // Deactivate premium (for testing or user request)
  deactivatePremium: () => {
    localStorage.removeItem(`${PREMIUM_KEY_PREFIX}access`);
    return { success: true };
  },

  // Constants
  PRICE: PREMIUM_PRICE_DA,
  DURATION_MONTHS: PREMIUM_DURATION_MONTHS,
  CURRENCY: 'DZD'
};

// Premium feature checker helper
export const checkPremiumFeature = (featureId) => {
  if (!PremiumManager.isPremiumActive()) {
    return {
      hasAccess: false,
      message: {
        ar: 'هذه الميزة متاحة فقط للأعضاء المميزين',
        fr: 'Cette fonctionnalité est disponible uniquement pour les membres premium',
        en: 'This feature is available only for premium members'
      }
    };
  }
  return { hasAccess: true };
};

export default PremiumManager;
