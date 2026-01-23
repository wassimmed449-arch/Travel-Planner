import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { completeTexts } from '../data/v3CompleteData';
import { motion } from 'framer-motion';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const historyText = completeTexts.history[language] || completeTexts.history['ar'];

  // Split text into paragraphs
  const paragraphs = historyText.split('\n').filter(p => p.trim());

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Header */}
      <div 
        className="relative h-[35vh] bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('https://images.pexels.com/photos/2901212/pexels-photo-2901212.jpeg')` 
        }}
      >
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="absolute top-6 start-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-white rtl:rotate-180" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {language === 'ar' ? 'تاريخ عنابة' : language === 'fr' ? 'Histoire d\'Annaba' : 'History of Annaba'}
              </h1>
              <p className="text-sm opacity-80">
                {language === 'ar' ? 'من هيبون إلى اليوم' : language === 'fr' ? 'De Hippone à aujourd\'hui' : 'From Hippo to today'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Timeline Events */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 bg-primary/10 rounded-2xl p-4"
          >
            <Calendar className="w-6 h-6 text-primary" />
            <div>
              <p className="font-bold text-primary">1295 {language === 'ar' ? 'ق.م' : language === 'fr' ? 'av. J.-C.' : 'BC'}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'تأسيس المدينة باسم "أوبون"' : language === 'fr' ? 'Fondation de la ville sous le nom "Ubbo"' : 'City founded as "Ubbo"'}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 bg-secondary/10 rounded-2xl p-4"
          >
            <Calendar className="w-6 h-6 text-secondary" />
            <div>
              <p className="font-bold text-secondary">
                {language === 'ar' ? 'القرن 3 ق.م' : language === 'fr' ? '3ème siècle av. J.-C.' : '3rd Century BC'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'العصر الفينيقي - مدينة هيبون' : language === 'fr' ? 'Ère phénicienne - Ville d\'Hippone' : 'Phoenician Era - City of Hippo'}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 bg-accent/20 rounded-2xl p-4"
          >
            <MapPin className="w-6 h-6 text-accent-foreground" />
            <div>
              <p className="font-bold">
                {language === 'ar' ? 'القرن 5 هـ' : language === 'fr' ? '5ème siècle AH' : '5th Century AH'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'انتقال المدينة إلى موقعها الحالي' : language === 'fr' ? 'Transfert de la ville à son emplacement actuel' : 'City moved to current location'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 rounded-3xl p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            {language === 'ar' ? 'لمحة تاريخية' : language === 'fr' ? 'Aperçu historique' : 'Historical Overview'}
          </h2>
          
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className={index === 0 ? 'font-medium text-foreground' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        </motion.article>

        {/* Fun Facts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold mb-1">3300+</p>
            <p className="text-xs opacity-90">
              {language === 'ar' ? 'سنة من التاريخ' : language === 'fr' ? 'ans d\'histoire' : 'years of history'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold mb-1">4</p>
            <p className="text-xs opacity-90">
              {language === 'ar' ? 'حضارات متعاقبة' : language === 'fr' ? 'civilisations successives' : 'successive civilizations'}
            </p>
          </div>
        </div>

        {/* Explore More */}
        <button
          onClick={() => navigate('/explore')}
          data-testid="explore-button"
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold hover:shadow-lg transition-all"
        >
          {language === 'ar' ? 'استكشف المواقع التاريخية' : language === 'fr' ? 'Explorer les sites historiques' : 'Explore Historical Sites'}
        </button>
      </div>
    </div>
  );
};

export default HistoryPage;
