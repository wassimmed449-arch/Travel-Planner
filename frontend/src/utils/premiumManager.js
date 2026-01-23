// PREMIUM ACCESS SYSTEM - V3.0 Ultimate

const PREMIUM_KEY_PREFIX = 'annaba_premium_';
const PREMIUM_DURATION_MONTHS = 6;
const PREMIUM_PRICE_DA = 500;

// Valid premium keys (in production, this would be server-validated)
const VALID_KEYS = [
  'ANNABA2025',
  'WASSIM500',
  'BONEKEY',
  // Add more keys as needed
];

export const PremiumManager = {
  // Check if user has active premium
  isActivePremium: () => {
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
  activatePremium: (key) => {
    const upperKey = key.toUpperCase().trim();
    
    if (!VALID_KEYS.includes(upperKey)) {
      return { success: false, message: 'invalid_key' };
    }

    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setMonth(expiryDate.getMonth() + PREMIUM_DURATION_MONTHS);

    const premiumData = {
      activated: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      key: upperKey
    };

    localStorage.setItem(`${PREMIUM_KEY_PREFIX}access`, JSON.stringify(premiumData));
    
    return { 
      success: true, 
      message: 'activated',
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
    if (!PremiumManager.isActivePremium()) return 0;
    
    const expiryDate = PremiumManager.getExpiryDate();
    if (!expiryDate) return 0;
    
    const now = new Date();
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  },

  // Premium features list
  getFeatures: () => [
    {
      id: 'wassim-super-bot',
      icon: '🚀',
      name: { ar: 'بوت وسيم الخارق', fr: 'Wassim Super-Bot', en: 'Wassim Super-Bot' },
      description: { ar: 'نصائح شخصية وتخطيط رحلات', fr: 'Conseils personnels et planification', en: 'Personal tips and trip planning' }
    },
    {
      id: 'pdf-download',
      icon: '📚',
      name: { ar: 'تحميل الكتاب PDF', fr: 'Télécharger le livre PDF', en: 'Download PDF Book' },
      description: { ar: 'الدليل الكامل بصيغة PDF', fr: 'Guide complet en PDF', en: 'Complete guide in PDF' }
    },
    {
      id: 'exclusive-deals',
      icon: '🎁',
      name: { ar: 'عروض حصرية', fr: 'Offres exclusives', en: 'Exclusive Deals' },
      description: { ar: 'خصومات في المطاعم والفنادق', fr: 'Réductions restaurants et hôtels', en: 'Restaurant and hotel discounts' }
    },
    {
      id: 'hidden-gems',
      icon: '💎',
      name: { ar: 'جواهر مخفية', fr: 'Joyaux cachés', en: 'Hidden Gems' },
      description: { ar: 'أماكن سرية يعرفها وسيم فقط', fr: 'Lieux secrets connus de Wassim', en: 'Secret places only Wassim knows' }
    },
    {
      id: 'priority-support',
      icon: '⚡',
      name: { ar: 'دعم أولوية', fr: 'Support prioritaire', en: 'Priority Support' },
      description: { ar: 'استجابة فورية من وسيم', fr: 'Réponse immédiate de Wassim', en: 'Immediate response from Wassim' }
    },
    {
      id: 'offline-maps',
      icon: '🗺️',
      name: { ar: 'خرائط أوفلاين', fr: 'Cartes hors ligne', en: 'Offline Maps' },
      description: { ar: 'خرائط تفصيلية بدون إنترنت', fr: 'Cartes détaillées sans Internet', en: 'Detailed maps without Internet' }
    }
  ],

  PRICE: PREMIUM_PRICE_DA,
  DURATION_MONTHS: PREMIUM_DURATION_MONTHS
};

export default PremiumManager;
