// ================================================================================================
// PREMIUM ACCESS SYSTEM - V3.0 ULTIMATE - LIFETIME ACCESS
// Manual BaridiMob Payment + WhatsApp Receipt + Key Validation + Magic Link
// ================================================================================================
// Phase 2: key validation happens on the backend (/api/activate-premium,
// /api/validate-premium), device-bound, backed by MongoDB. This file no
// longer holds the valid-key list at all - see backend/server.py and
// backend/.env.example (VALID_PREMIUM_KEYS, MAGIC_LINK_CODE, backend-only).
// localStorage is now only a client-side CACHE of what the backend already
// confirmed, refreshed via refreshPremiumStatus() - it is not the source of
// truth anymore, and a revoked key's cache gets cleared on next refresh.

const PREMIUM_KEY_PREFIX = 'annaba_premium_v3_';
const PREMIUM_PRICE_DA = 500;
const DEVICE_ID_KEY = `${PREMIUM_KEY_PREFIX}device_id`;

// BaridiMob RIP (bank account number) buyers transfer payment to. This has
// to be publicly visible in the UI for anyone to pay it, so moving it to an
// env var is a source-hygiene improvement, not a confidentiality one.
const PAYMENT_RIP = process.env.REACT_APP_PAYMENT_RIP || '';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

// Stable per-browser identifier used to bind a premium key to "a device".
// Not a hardware fingerprint - it's a random ID persisted in localStorage,
// which is what "device-bound" means for a web app without invasive
// fingerprinting. Clearing site data resets it (same tradeoff as any
// localStorage-based identity).
const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

const ACTIVATION_ERROR_MESSAGES = {
  invalid_key: {
    ar: 'المفتاح غير صحيح. تأكد من إدخاله بشكل صحيح.',
    fr: 'Clé invalide. Vérifiez que vous l\'avez saisie correctement.',
    en: 'Invalid key. Make sure you entered it correctly.'
  },
  revoked: {
    ar: 'هذا المفتاح تم إلغاؤه. تواصل مع وسيم عبر واتساب.',
    fr: 'Cette clé a été révoquée. Contactez Wassim sur WhatsApp.',
    en: 'This key has been revoked. Contact Wassim on WhatsApp.'
  },
  key_already_used: {
    ar: 'هذا المفتاح مستعمل من جهاز آخر بالفعل.',
    fr: 'Cette clé est déjà utilisée sur un autre appareil.',
    en: 'This key is already active on another device.'
  },
  network_error: {
    ar: 'تعذر الاتصال بالخادم. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
    fr: 'Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.',
    en: 'Could not reach the server. Check your connection and try again.'
  },
  server_error: {
    ar: 'حدث خطأ في الخادم. حاول مرة أخرى لاحقاً.',
    fr: 'Erreur du serveur. Réessayez plus tard.',
    en: 'Server error. Please try again later.'
  }
};

const SUCCESS_MESSAGE = {
  ar: 'تم تفعيل الوصول المميز مدى الحياة بنجاح! 🎉',
  fr: 'Accès Premium à vie activé avec succès! 🎉',
  en: 'Lifetime Premium Access activated successfully! 🎉'
};

const persistActivation = (key) => {
  const now = new Date();
  localStorage.setItem(`${PREMIUM_KEY_PREFIX}access`, JSON.stringify({
    activated: now.toISOString(),
    lifetime: true,
    key,
    version: '3.0-LIFETIME'
  }));
};

const clearActivation = () => {
  localStorage.removeItem(`${PREMIUM_KEY_PREFIX}access`);
};

// Calls the backend to validate+bind a key. Never trusts a local key list -
// there isn't one anymore.
const callActivateEndpoint = async (key) => {
  try {
    const response = await fetch(`${API_URL}/api/activate-premium`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, device_id: getDeviceId() }),
    });
    if (!response.ok) {
      return { success: false, error: 'server_error' };
    }
    return await response.json();
  } catch {
    return { success: false, error: 'network_error' };
  }
};

export const PremiumManager = {
  // Constants exposed for UI
  PRICE: 500,
  CURRENCY: 'DA',
  ACCESS_TYPE: 'LIFETIME', // Changed from months to lifetime

  getDeviceId,

  // Fast, synchronous, local-cache read - used for instant UI gating on
  // page mount. This is a cache of the backend's last-known answer, not the
  // source of truth; call refreshPremiumStatus() to resync it.
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

  // Re-checks this device's premium status against the backend and updates
  // the local cache accordingly (clears it if the backend says no, e.g. a
  // revoked key). Call once on app load. On network failure, keeps whatever
  // the local cache already said rather than locking out a legitimate user
  // who's just briefly offline.
  refreshPremiumStatus: async () => {
    try {
      const response = await fetch(`${API_URL}/api/validate-premium`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: getDeviceId() }),
      });
      if (!response.ok) {
        return PremiumManager.isPremiumActive();
      }
      const data = await response.json();
      if (data.isPremium) {
        persistActivation('server-verified');
      } else {
        clearActivation();
      }
      return !!data.isPremium;
    } catch {
      return PremiumManager.isPremiumActive();
    }
  },

  // Activate premium via Magic Link
  activateMagicLink: async (code) => {
    const normalizedCode = code.toUpperCase().trim();
    const result = await callActivateEndpoint(normalizedCode);

    if (!result.success) {
      return { success: false };
    }

    persistActivation('MAGIC_LINK');
    return { success: true, message: SUCCESS_MESSAGE };
  },

  // Activate premium with a key (manual entry)
  activatePremiumKey: async (key) => {
    const normalizedKey = key.toUpperCase().trim().replace(/\s+/g, '');
    const result = await callActivateEndpoint(normalizedKey);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'invalid_key',
        message: ACTIVATION_ERROR_MESSAGES[result.error] || ACTIVATION_ERROR_MESSAGES.invalid_key,
      };
    }

    persistActivation(normalizedKey);
    return { success: true, message: SUCCESS_MESSAGE };
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
    rip: PAYMENT_RIP,
    whatsappNumber: '213552664037',
    whatsappMessageTemplate: {
      ar: 'مرحباً وسيم! لقد قمت بالدفع عبر BaridiMob للحصول على الوصول المميز. إليك إيصال الدفع:',
      fr: 'Bonjour Wassim! J\'ai effectué le paiement via BaridiMob pour l\'accès Premium. Voici mon reçu:',
      en: 'Hello Wassim! I made the payment via BaridiMob for Premium access. Here is my receipt:'
    }
  }),

  // Revoke premium (for testing) - clears the local cache only. To actually
  // revoke a key server-side, set revoked: true on its db.premium_keys doc.
  revokePremium: () => {
    clearActivation();
  }
};

export default PremiumManager;
