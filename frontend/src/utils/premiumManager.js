// ================================================================================================
// PREMIUM ACCESS SYSTEM - V3.0 ULTIMATE - LIFETIME ACCESS
// Manual BaridiMob Payment + WhatsApp Receipt + Key Validation + Magic Link
// ================================================================================================

const PREMIUM_KEY_PREFIX = 'annaba_premium_v3_';
const PREMIUM_PRICE_DA = 500;

// MAGIC LINK CODE - The secret activation code
const MAGIC_LINK_CODE = 'ANNABA-VIP-23-W';

// Valid premium keys (including magic link code for manual entry)
const VALID_PREMIUM_KEYS = [
  'ANNABA2025ULTIMATE',
  'WASSIM500KEY',
  'BONETRAVEL2025',
  'WSPR0SH0P',
  'ANNABA6MONTHS',
  'ANNABA-VIP-23-W', // Magic Link Code (also works manually)
];

export const PremiumManager = {
  // Constants exposed for UI
  PRICE: 500,
  CURRENCY: 'DA',
  ACCESS_TYPE: 'LIFETIME', // Changed from months to lifetime

  // Check if user has active premium access (LIFETIME = no expiry check)
  isPremiumActive: () => {
    const premiumData = localStorage.getItem(`${PREMIUM_KEY_PREFIX}access`);
    if (!premiumData) return false;
    
    try {
      const data = JSON.parse(premiumData);
      
      // Lifetime access - just check if activated
      if (data.lifetime === true) {
        return true;
      }
      
      // Legacy support - check expiry for old activations
      const expiryDate = new Date(data.expiryDate);
      const now = new Date();
      return now < expiryDate;
    } catch {
      return false;
    }
  },

  // Activate premium via Magic Link
  activateMagicLink: (code) => {
    const normalizedCode = code.toUpperCase().trim();
    
    if (normalizedCode !== MAGIC_LINK_CODE) {
      return { success: false };
    }

    const now = new Date();
    const premiumData = {
      activated: now.toISOString(),
      lifetime: true, // LIFETIME ACCESS
      key: 'MAGIC_LINK',
      version: '3.0-LIFETIME'
    };

    localStorage.setItem(`${PREMIUM_KEY_PREFIX}access`, JSON.stringify(premiumData));
    
    return { 
      success: true, 
      message: {
        ar: 'تم تفعيل الوصول المميز مدى الحياة بنجاح! 🎉',
        fr: 'Accès Premium à vie activé avec succès! 🎉',
        en: 'Lifetime Premium Access activated successfully! 🎉'
      }
    };
  },

  // Activate premium with a key (manual entry)
  activatePremiumKey: (key) => {
    const normalizedKey = key.toUpperCase().trim().replace(/\s+/g, '');
    
    // Check if it's the magic link code
    if (normalizedKey === MAGIC_LINK_CODE.replace(/-/g, '') || normalizedKey === MAGIC_LINK_CODE) {
      return PremiumManager.activateMagicLink(MAGIC_LINK_CODE);
    }
    
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
    const premiumData = {
      activated: now.toISOString(),
      lifetime: true, // All keys now give LIFETIME access
      key: normalizedKey,
      version: '3.0-LIFETIME'
    };

    localStorage.setItem(`${PREMIUM_KEY_PREFIX}access`, JSON.stringify(premiumData));
    
    return { 
      success: true, 
      message: {
        ar: 'تم تفعيل الوصول المميز مدى الحياة بنجاح! 🎉',
        fr: 'Accès Premium à vie activé avec succès! 🎉',
        en: 'Lifetime Premium Access activated successfully! 🎉'
      }
    };
  },

  // Get premium status text
  getStatusText: () => {
    const premiumData = localStorage.getItem(`${PREMIUM_KEY_PREFIX}access`);
    if (!premiumData) return null;
    
    try {
      const data = JSON.parse(premiumData);
      if (data.lifetime) {
        return {
          ar: 'وصول مدى الحياة ♾️',
          fr: 'Accès à vie ♾️',
          en: 'Lifetime Access ♾️'
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  // Get days remaining (returns Infinity for lifetime)
  getDaysRemaining: () => {
    const premiumData = localStorage.getItem(`${PREMIUM_KEY_PREFIX}access`);
    if (!premiumData) return 0;
    
    try {
      const data = JSON.parse(premiumData);
      if (data.lifetime) {
        return Infinity; // Lifetime access
      }
      
      // Legacy support
      const expiryDate = new Date(data.expiryDate);
      const now = new Date();
      const diffTime = expiryDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 0;
    }
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
    }
  ],

  // Payment information
  getPaymentInfo: () => ({
    price: PREMIUM_PRICE_DA,
    currency: 'DA',
    accessType: 'LIFETIME',
    recipient: 'Benfernane Mohamed Ouassim',
    rip: '00799999002810927704',
    whatsappNumber: '213552664037',
    whatsappMessageTemplate: {
      ar: 'مرحباً وسيم! لقد قمت بالدفع عبر BaridiMob للحصول على الوصول المميز. إليك إيصال الدفع:',
      fr: 'Bonjour Wassim! J\'ai effectué le paiement via BaridiMob pour l\'accès Premium. Voici mon reçu:',
      en: 'Hello Wassim! I made the payment via BaridiMob for Premium access. Here is my receipt:'
    }
  }),

  // Revoke premium (for testing)
  revokePremium: () => {
    localStorage.removeItem(`${PREMIUM_KEY_PREFIX}access`);
  }
};

export default PremiumManager;
