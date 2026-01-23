import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, Mountain, Waves, TreePine, Sun } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { completeTexts } from '../data/v3CompleteData';
import { motion } from 'framer-motion';

const IntroductionPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const introText = completeTexts.introduction[language] || completeTexts.introduction['ar'];

  // Split text into paragraphs
  const paragraphs = introText.split('\n').filter(p => p.trim());

  const highlights = [
    { 
      icon: Waves, 
      label: { ar: 'البحر المتوسط', fr: 'Méditerranée', en: 'Mediterranean' },
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Mountain, 
      label: { ar: 'جبال إدوغ', fr: 'Monts Edough', en: 'Edough Mountains' },
      color: 'from-slate-600 to-slate-500'
    },
    { 
      icon: TreePine, 
      label: { ar: 'غابات سرايدي', fr: 'Forêts Seraidi', en: 'Seraidi Forests' },
      color: 'from-green-600 to-emerald-500'
    },
    { 
      icon: Sun, 
      label: { ar: '4 فصول', fr: '4 saisons', en: '4 seasons' },
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Header */}
      <div 
        className="relative h-[40vh] bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('https://images.pexels.com/photos/35571563/pexels-photo-35571563.jpeg')` 
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
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {language === 'ar' ? 'مقدمة' : language === 'fr' ? 'Introduction' : 'Introduction'}
                </h1>
                <p className="text-sm opacity-80">
                  {language === 'ar' ? 'عنابة في قلب الجزائر' : language === 'fr' ? 'Annaba au cœur de l\'Algérie' : 'Annaba in the Heart of Algeria'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Bismillah */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-2xl font-arabic text-primary">
            بسم الله الرحمن الرحيم
          </p>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-2 gap-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${item.color} text-white rounded-2xl p-4 text-center`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-bold">{t(item.label)}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 rounded-3xl p-6 text-center"
        >
          <p className="text-lg font-bold mb-2">
            {language === 'ar' 
              ? 'مرحباً بك في رحلة اكتشاف عنابة...' 
              : language === 'fr' 
              ? 'Bienvenue dans le voyage de découverte d\'Annaba...'
              : 'Welcome to the journey of discovering Annaba...'}
          </p>
          <p className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? 'خلي نعيشوها مع بعضانا خطوة بخطوة'
              : language === 'fr'
              ? 'Vivons-le ensemble étape par étape'
              : 'Let\'s live it together step by step'}
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border/50 rounded-3xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">
            {language === 'ar' ? 'عنابة في قلب الجزائر' : language === 'fr' ? 'Annaba au cœur de l\'Algérie' : 'Annaba in the Heart of Algeria'}
          </h2>
          
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {paragraphs.slice(3).map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
          </div>
        </motion.article>

        {/* Unique Feature Card */}
        <div className="bg-gradient-to-br from-blue-500 via-green-500 to-white/80 rounded-3xl p-6 text-white">
          <h3 className="font-bold text-xl mb-3">
            {language === 'ar' ? '🏔️ بحر وجبال وثلوج!' : language === 'fr' ? '🏔️ Mer, montagnes et neige!' : '🏔️ Sea, mountains and snow!'}
          </h3>
          <p className="text-sm opacity-95">
            {language === 'ar' 
              ? 'صورة نادرة في الجزائر: بحر وجبال وثلوج في مكان واحد على مدى أربع مواسم'
              : language === 'fr'
              ? 'Une image rare en Algérie: mer, montagnes et neige en un seul endroit à travers quatre saisons'
              : 'A rare image in Algeria: sea, mountains and snow in one place across four seasons'}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/history')}
            data-testid="history-button"
            className="bg-secondary text-secondary-foreground rounded-2xl py-4 font-bold hover:shadow-lg transition-all"
          >
            {language === 'ar' ? 'التاريخ' : language === 'fr' ? 'Histoire' : 'History'}
          </button>
          <button
            onClick={() => navigate('/explore')}
            data-testid="explore-button"
            className="bg-primary text-primary-foreground rounded-2xl py-4 font-bold hover:shadow-lg transition-all"
          >
            {language === 'ar' ? 'استكشف' : language === 'fr' ? 'Explorer' : 'Explore'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage;
