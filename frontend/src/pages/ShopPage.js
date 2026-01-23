import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Check, X, CreditCard, MessageCircle, Key, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import PremiumManager from '../utils/premiumManager';
import { wassimAuthor } from '../data/v3EnhancedData';
import { motion, AnimatePresence } from 'framer-motion';

const ShopPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  // Use lazy initialization
  const [isPremium, setIsPremium] = useState(() => PremiumManager.isPremiumActive());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [daysRemaining, setDaysRemaining] = useState(() => PremiumManager.getDaysRemaining());
  const [activationResult, setActivationResult] = useState(null);

  const features = PremiumManager.getFeaturesList();
  const paymentInfo = PremiumManager.getPaymentInfo();

  const handleGetKey = () => {
    setShowPaymentModal(true);
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(t(paymentInfo.whatsappMessageTemplate));
    window.open(`https://wa.me/${paymentInfo.whatsappNumber}?text=${message}`, '_blank');
  };

  const handleActivateKey = () => {
    const result = PremiumManager.activatePremiumKey(keyInput);
    setActivationResult(result);
    
    if (result.success) {
      setTimeout(() => {
        setIsPremium(true);
        setDaysRemaining(PremiumManager.getDaysRemaining());
        setShowKeyModal(false);
        setKeyInput('');
        setActivationResult(null);
      }, 2000);
    }
  };

  const handleDownloadPDF = () => {
    // Open the REAL Google Drive PDF link
    window.open('https://drive.google.com/file/d/1U8hRtWBynaIeir_IbxUAXIB6yz2B1pr1/view?usp=sharing', '_blank');
  };

  const handleVIPSupport = () => {
    // Open WhatsApp VIP support link - VERIFIED EXACT FORMAT
    window.open('https://wa.me/213552664037', '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary via-primary to-secondary text-white p-6 pb-12">
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all mb-4"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-10 h-10" />
          <div>
            <h1 className="text-3xl font-bold">
              {language === 'ar' ? 'المتجر' : language === 'fr' ? 'Boutique' : 'Shop'}
            </h1>
            <p className="text-sm opacity-90">
              {language === 'ar' ? 'افتح التجربة الكاملة' : language === 'fr' ? 'Débloquez l\'expérience complète' : 'Unlock the full experience'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 space-y-6">
        {/* Premium Status Card */}
        {isPremium ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-3xl p-6 shadow-2xl"
            data-testid="premium-active-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {language === 'ar' ? 'عضو مميز نشط! ✨' : language === 'fr' ? 'Membre Premium Actif! ✨' : 'Active Premium Member! ✨'}
                </h2>
                <p className="text-sm opacity-90">
                  {daysRemaining === Infinity 
                    ? (language === 'ar' ? 'وصول مدى الحياة ♾️' : language === 'fr' ? 'Accès à vie ♾️' : 'Lifetime Access ♾️')
                    : `${daysRemaining} ${language === 'ar' ? 'يوم متبقي' : language === 'fr' ? 'jours restants' : 'days remaining'}`
                  }
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadPDF}
              data-testid="download-pdf-button"
              className="w-full bg-white text-secondary rounded-2xl py-3 font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all mb-3"
            >
              📚 {language === 'ar' ? 'تحميل الكتاب PDF' : language === 'fr' ? 'Télécharger le livre PDF' : 'Download PDF Book'}
            </button>

            {/* VIP Support Gold Button */}
            <button
              onClick={handleVIPSupport}
              data-testid="vip-support-button"
              className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-black rounded-2xl py-3 font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all border-2 border-yellow-300"
            >
              ⭐ {language === 'ar' ? 'تواصل مع وسيم (دعم VIP)' : language === 'fr' ? 'Contacter Wassim (Support VIP)' : 'Contact Wassim (VIP Support)'}
            </button>
          </motion.div>
        ) : (
          /* Main Offer Card */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-gradient-to-br from-accent via-accent/90 to-accent/70 rounded-3xl p-6 shadow-2xl overflow-hidden"
            data-testid="premium-offer-card"
          >
            {/* Best Value Badge */}
            <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-4 py-1 rounded-full text-xs font-bold shadow-lg rotate-3 animate-pulse">
              {language === 'ar' ? 'أفضل قيمة! 🔥' : language === 'fr' ? 'Meilleure Valeur! 🔥' : 'Best Value! 🔥'}
            </div>

            <div className="mt-4">
              <h2 className="text-3xl font-bold mb-2 text-primary">
                {language === 'ar' ? '🔥 افتح تجربة عنابة الكاملة!' : language === 'fr' ? '🔥 Débloquez l\'Expérience Annaba Complète!' : '🔥 Unlock the Full Annaba Experience!'}
              </h2>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-primary">{PremiumManager.PRICE}</span>
                <span className="text-2xl font-bold text-primary">{PremiumManager.CURRENCY}</span>
                <span className="text-lg text-muted-foreground font-bold">
                  / {language === 'ar' ? 'مدى الحياة' : language === 'fr' ? 'À VIE' : 'LIFETIME'}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                {language === 'ar' 
                  ? 'احصل على الوصول الكامل لكل ميزات التطبيق + الكتاب PDF + دعم مباشر من وسيم!' 
                  : language === 'fr' 
                  ? 'Obtenez un accès complet à toutes les fonctionnalités + livre PDF + support direct de Wassim!' 
                  : 'Get full access to all app features + PDF book + direct support from Wassim!'}
              </p>

              <button
                onClick={handleGetKey}
                data-testid="get-key-button"
                className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all active:scale-95 mb-4"
              >
                <Crown className="w-6 h-6" />
                {language === 'ar' ? 'احصل على المفتاح الآن' : language === 'fr' ? 'Obtenir la Clé Maintenant' : 'Get The Key Now'}
              </button>

              <button
                onClick={() => setShowKeyModal(true)}
                data-testid="have-key-button"
                className="w-full bg-secondary/20 text-secondary border-2 border-secondary rounded-2xl py-3 font-bold flex items-center justify-center gap-2 hover:bg-secondary/30 transition-all"
              >
                <Key className="w-5 h-5" />
                {language === 'ar' ? 'لديك مفتاح؟ فعّله هنا' : language === 'fr' ? 'Vous avez une clé? Activez ici' : 'Have a Key? Activate Here'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Features List */}
        <div>
          <h3 className="text-2xl font-bold mb-4">
            {language === 'ar' ? 'ما تحصل عليه:' : language === 'fr' ? 'Ce que vous obtenez:' : 'What You Get:'}
          </h3>

          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-4 flex items-start gap-4"
                data-testid={`feature-${feature.id}`}
              >
                <div className="text-4xl flex-shrink-0">{feature.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1">{t(feature.name)}</h4>
                  <p className="text-sm text-muted-foreground">{t(feature.description)}</p>
                </div>
                {isPremium ? (
                  <Check className="w-6 h-6 text-secondary flex-shrink-0" />
                ) : (
                  <Crown className="w-6 h-6 text-accent flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 border-2 border-secondary/50 rounded-3xl p-6">
          <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-secondary" />
            {language === 'ar' ? 'لماذا الباقة الشاملة؟' : language === 'fr' ? 'Pourquoi le Forfait Ultimate?' : 'Why Ultimate Bundle?'}
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <span>{language === 'ar' ? 'وصول كامل لمدة 6 أشهر بسعر منخفض' : language === 'fr' ? 'Accès complet pendant 6 mois à bas prix' : 'Full access for 6 months at low price'}</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <span>{language === 'ar' ? 'بوت وسيم الخارق مع شخصية مرحة' : language === 'fr' ? 'Wassim Super-Bot avec personnalité amusante' : 'Wassim Super-Bot with fun personality'}</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <span>{language === 'ar' ? 'الكتاب الكامل PDF للقراءة أوفلاين' : language === 'fr' ? 'Livre complet PDF pour lecture hors ligne' : 'Complete PDF book for offline reading'}</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <span>{language === 'ar' ? 'دعم مباشر من وسيم شخصياً عبر واتساب' : language === 'fr' ? 'Support direct de Wassim personnellement via WhatsApp' : 'Direct support from Wassim personally via WhatsApp'}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              data-testid="payment-modal"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {language === 'ar' ? 'طريقة الدفع 💳' : language === 'fr' ? 'Méthode de Paiement 💳' : 'Payment Method 💳'}
                </h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
                    <h3 className="font-bold">
                      {language === 'ar' ? 'حوّل عبر BaridiMob' : language === 'fr' ? 'Transférez via BaridiMob' : 'Transfer via BaridiMob'}
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center bg-background rounded-xl p-3">
                      <span className="text-muted-foreground">{language === 'ar' ? 'المبلغ:' : language === 'fr' ? 'Montant:' : 'Amount:'}</span>
                      <span className="font-bold text-lg">{paymentInfo.amount} {paymentInfo.currency}</span>
                    </div>
                    <div className="flex justify-between items-center bg-background rounded-xl p-3">
                      <span className="text-muted-foreground">RIP:</span>
                      <span className="font-mono font-bold">{paymentInfo.rip}</span>
                    </div>
                    <div className="flex justify-between items-center bg-background rounded-xl p-3">
                      <span className="text-muted-foreground">{language === 'ar' ? 'المستفيد:' : language === 'fr' ? 'Bénéficiaire:' : 'Recipient:'}</span>
                      <span className="font-bold text-xs">{paymentInfo.recipient}</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-secondary/10 border-2 border-secondary/30 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold">2</div>
                    <h3 className="font-bold">
                      {language === 'ar' ? 'أرسل الإيصال عبر واتساب' : language === 'fr' ? 'Envoyez le reçu via WhatsApp' : 'Send Receipt via WhatsApp'}
                    </h3>
                  </div>
                  <button
                    onClick={handleWhatsAppContact}
                    data-testid="whatsapp-button"
                    className="w-full bg-[#25D366] text-white rounded-2xl py-3 font-bold flex items-center justify-center gap-2 hover:bg-[#20BA5A] transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {language === 'ar' ? 'فتح واتساب' : language === 'fr' ? 'Ouvrir WhatsApp' : 'Open WhatsApp'}
                  </button>
                </div>

                {/* Step 3 */}
                <div className="bg-accent/10 border-2 border-accent/30 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">3</div>
                    <h3 className="font-bold">
                      {language === 'ar' ? 'استلم مفتاحك' : language === 'fr' ? 'Recevez votre clé' : 'Receive Your Key'}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' 
                      ? 'سيرسل لك وسيم مفتاح التفعيل خلال 24 ساعة عبر واتساب' 
                      : language === 'fr' 
                      ? 'Wassim vous enverra la clé d\'activation dans les 24h via WhatsApp' 
                      : 'Wassim will send you the activation key within 24h via WhatsApp'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key Activation Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => {
              setShowKeyModal(false);
              setKeyInput('');
              setActivationResult(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-3xl p-6 max-w-md w-full"
              data-testid="key-modal"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Key className="w-7 h-7 text-primary" />
                  {language === 'ar' ? 'تفعيل المفتاح' : language === 'fr' ? 'Activer la Clé' : 'Activate Key'}
                </h2>
                <button
                  onClick={() => {
                    setShowKeyModal(false);
                    setKeyInput('');
                    setActivationResult(null);
                  }}
                  className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    {language === 'ar' ? 'أدخل مفتاح التفعيل:' : language === 'fr' ? 'Entrez la clé d\'activation:' : 'Enter Activation Key:'}
                  </label>
                  <input
                    type="text"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
                    placeholder="ANNABA2025ULTIMATE"
                    data-testid="key-input"
                    className="w-full px-4 py-3 bg-muted rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary font-mono text-center text-lg"
                  />
                </div>

                {activationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-4 ${
                      activationResult.success 
                        ? 'bg-secondary/20 border-2 border-secondary/50 text-secondary' 
                        : 'bg-destructive/20 border-2 border-destructive/50 text-destructive'
                    }`}
                  >
                    <p className="font-bold text-center">{t(activationResult.message)}</p>
                  </motion.div>
                )}

                <button
                  onClick={handleActivateKey}
                  disabled={!keyInput.trim() || (activationResult && activationResult.success)}
                  data-testid="activate-button"
                  className="w-full bg-primary text-primary-foreground rounded-2xl py-3 font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {language === 'ar' ? 'تفعيل الآن ✨' : language === 'fr' ? 'Activer Maintenant ✨' : 'Activate Now ✨'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopPage;
