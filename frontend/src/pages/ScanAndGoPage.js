import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, QrCode, Instagram, FileText, Map, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { scanAndGoLinks } from '../data/v3CompleteData';
import { motion } from 'framer-motion';

const ScanAndGoPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const t = (obj) => {
    if (typeof obj === 'object' && obj !== null) {
      return obj[language] || obj['ar'] || obj['en'] || '';
    }
    return obj || '';
  };

  const getIcon = (type) => {
    switch (type) {
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'form': return <FileText className="w-5 h-5" />;
      case 'map': return <Map className="w-5 h-5" />;
      default: return <ExternalLink className="w-5 h-5" />;
    }
  };

  const openLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-green-400 pb-24 font-mono">
      {/* Hacker-style Header */}
      <div className="relative bg-black border-b-2 border-green-500/50 p-6">
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="w-10 h-10 bg-green-500/20 border border-green-500/50 rounded flex items-center justify-center hover:bg-green-500/30 transition-all mb-4"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-green-500/20 border border-green-500 rounded flex items-center justify-center animate-pulse">
            <QrCode className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-400">
              {language === 'ar' ? '[ SCAN & GO ]' : '[ SCAN & GO ]'}
            </h1>
            <p className="text-sm text-green-500/70">
              {language === 'ar' ? '// روابط سريعة للتفاعل' : language === 'fr' ? '// Liens rapides interactifs' : '// Quick interactive links'}
            </p>
          </div>
        </div>

        {/* Terminal-style intro */}
        <div className="mt-4 text-xs text-green-500/60">
          <p>&gt; INITIALIZING LINKS...</p>
          <p>&gt; STATUS: READY</p>
          <p>&gt; CLICK TO EXECUTE_</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Intro message */}
        <div className="bg-green-500/10 border border-green-500/30 rounded p-4 mb-6">
          <p className="text-sm text-green-400">
            {language === 'ar' 
              ? '// هذه الروابط تفتح تطبيقات خارجية. شارك تجربتك مع وسيم!' 
              : language === 'fr' 
              ? '// Ces liens ouvrent des applications externes. Partagez votre expérience avec Wassim!' 
              : '// These links open external apps. Share your experience with Wassim!'}
          </p>
        </div>

        {scanAndGoLinks.map((link, index) => (
          <motion.button
            key={link.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => openLink(link.url)}
            data-testid={`link-${link.id}`}
            className="w-full bg-green-500/10 border border-green-500/40 hover:border-green-400 hover:bg-green-500/20 rounded p-4 text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 border border-green-500/50 rounded flex items-center justify-center group-hover:animate-pulse">
                {getIcon(link.type)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-green-400 group-hover:text-green-300">
                  {t(link.title)}
                </p>
                <p className="text-xs text-green-500/60 uppercase">
                  [{link.type}]
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-green-500/50 group-hover:text-green-400" />
            </div>
          </motion.button>
        ))}

        {/* WhatsApp Direct */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: scanAndGoLinks.length * 0.1 }}
          onClick={() => window.open('https://wa.me/213552664037', '_blank')}
          data-testid="whatsapp-direct"
          className="w-full bg-[#25D366]/20 border border-[#25D366]/50 hover:border-[#25D366] hover:bg-[#25D366]/30 rounded p-4 text-left transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#25D366]/30 border border-[#25D366]/50 rounded flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#25D366]">
                {language === 'ar' ? 'تواصل مع وسيم مباشرة' : language === 'fr' ? 'Contactez Wassim directement' : 'Contact Wassim directly'}
              </p>
              <p className="text-xs text-[#25D366]/60 uppercase">
                [WHATSAPP]
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-[#25D366]/50 group-hover:text-[#25D366]" />
          </div>
        </motion.button>

        {/* Footer terminal */}
        <div className="mt-8 text-xs text-green-500/40 text-center">
          <p>// END OF TRANSMISSION</p>
          <p>// DEVELOPED BY WASSIM - WS PROSHOP</p>
        </div>
      </div>
    </div>
  );
};

export default ScanAndGoPage;
