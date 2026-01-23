import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Snowflake, Languages, MapPin, Calendar, Star, Crown, Trophy, Utensils, Volume2, Camera } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { allPlaces, moodCategories, getWinterRecommendations } from '../data/placesData';
import PremiumManager from '../utils/premiumManager';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();
  const { t, language, toggleLanguage, getLanguageFlag } = useLanguage();
  const { isWinterMode, toggleWinterMode } = useTheme();
  const [showMoodFilter, setShowMoodFilter] = useState(false);
  const [isPremium] = useState(PremiumManager.isPremiumActive());

  const featuredPlaces = isWinterMode 
    ? getWinterRecommendations().slice(0, 6)
    : allPlaces.filter(p => p.wassimTip).slice(0, 6);

  const handleMoodFilter = (moodId) => {
    navigate(`/explore?mood=${moodId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative h-[40vh] bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${isWinterMode ? 'https://images.pexels.com/photos/28447700/pexels-photo-28447700.jpeg' : 'https://images.pexels.com/photos/35571563/pexels-photo-35571563.jpeg'}')` 
        }}
      >
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6">
          <button 
            onClick={toggleLanguage}
            data-testid="language-toggle"
            className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-full hover:bg-white/30 transition-all flex items-center gap-2"
          >
            <span className="text-2xl">{getLanguageFlag()}</span>
            <Languages className="w-4 h-4 text-white" />
          </button>
          
          <button 
            onClick={toggleWinterMode}
            data-testid="winter-mode-toggle"
            className={`backdrop-blur-md p-3 rounded-full transition-all ${
              isWinterMode 
                ? 'bg-secondary/80 text-secondary-foreground' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Snowflake className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-2"
          >
            {language === 'ar' ? 'عنابة' : language === 'fr' ? 'Annaba' : 'Annaba'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg opacity-90"
          >
            {language === 'ar' 
              ? 'دليلك الشخصي مع وسيم' 
              : language === 'fr'
              ? 'Votre guide personnel avec Wassim'
              : 'Your personal guide with Wassim'}
          </motion.p>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Premium Banner */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/shop')}
            className="bg-gradient-to-r from-accent via-accent/90 to-accent/70 rounded-3xl p-5 cursor-pointer hover:shadow-xl transition-all relative overflow-hidden"
            data-testid="premium-banner"
          >
            <div className="absolute top-2 right-2 bg-destructive text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              🔥 500 DA
            </div>
            <div className="flex items-center gap-3">
              <Crown className="w-10 h-10 text-primary" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-primary">
                  {language === 'ar' ? 'افتح التجربة الكاملة!' : language === 'fr' ? 'Débloquez l\'expérience!' : 'Unlock Full Experience!'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'بوت وسيم + PDF + عروض حصرية' : language === 'fr' ? 'Wassim Bot + PDF + Offres' : 'Wassim Bot + PDF + Deals'}
                </p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/bot')}
            data-testid="wassim-bot-button"
            className={`${isPremium ? 'bg-gradient-to-br from-secondary to-primary' : 'bg-primary'} text-primary-foreground rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all relative`}
          >
            {isPremium && (
              <div className="absolute top-2 right-2 text-xl animate-pulse">✨</div>
            )}
            <MessageCircle className="w-8 h-8 mb-2 mx-auto" />
            <p className="font-bold text-sm">
              {language === 'ar' ? 'بوت وسيم 🤖' : language === 'fr' ? 'Bot Wassim 🤖' : 'Wassim Bot 🤖'}
            </p>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMoodFilter(!showMoodFilter)}
            data-testid="mood-filter-button"
            className="bg-secondary text-secondary-foreground rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <Star className="w-8 h-8 mb-2 mx-auto" />
            <p className="font-bold text-sm">
              {language === 'ar' ? 'حسب المزاج 🎭' : language === 'fr' ? 'Par Ambiance 🎭' : 'By Mood 🎭'}
            </p>
          </motion.button>
        </div>

        {showMoodFilter && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-2 gap-4"
          >
            {moodCategories.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodFilter(mood.id)}
                data-testid={`mood-${mood.id}`}
                className="bg-card border border-border/50 rounded-2xl p-4 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">{mood.icon}</div>
                <p className="font-medium text-sm">{t(mood.name)}</p>
              </button>
            ))}
          </motion.div>
        )}

        {/* V3.0 NEW FEATURES */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/food-roulette')}
            data-testid="food-roulette-button"
            className="bg-gradient-to-br from-destructive to-orange-600 text-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <Utensils className="w-8 h-8 mb-2 mx-auto" />
            <p className="font-bold text-sm">
              {language === 'ar' ? 'عجلة الطعام 🎰' : language === 'fr' ? 'Roulette Food 🎰' : 'Food Roulette 🎰'}
            </p>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/passport')}
            data-testid="passport-button"
            className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <Trophy className="w-8 h-8 mb-2 mx-auto" />
            <p className="font-bold text-sm">
              {language === 'ar' ? 'جواز بونة 🛂' : language === 'fr' ? 'Passeport Bône 🛂' : 'Bône Passport 🛂'}
            </p>
          </motion.button>
        </div>

        {/* PHASE 2 FEATURES */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/soundscapes')}
            data-testid="soundscapes-button"
            className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <Volume2 className="w-8 h-8 mb-2 mx-auto" />
            <p className="font-bold text-sm">
              {language === 'ar' ? 'أصوات عنابة 🎧' : language === 'fr' ? 'Sons d\'Annaba 🎧' : 'Soundscapes 🎧'}
            </p>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/annaba-live')}
            data-testid="annaba-live-button"
            className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <Camera className="w-8 h-8 mb-2 mx-auto" />
            <p className="font-bold text-sm">
              {language === 'ar' ? 'عنابة لايف 📸' : language === 'fr' ? 'Annaba Live 📸' : 'Annaba Live 📸'}
            </p>
          </motion.button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {isWinterMode 
                ? (language === 'ar' ? 'توصيات الشتاء ❄️' : language === 'fr' ? 'Recommandations Hiver ❄️' : 'Winter Recommendations ❄️')
                : (language === 'ar' ? 'نصائح وسيم ⭐' : language === 'fr' ? 'Conseils Wassim ⭐' : 'Wassim\'s Tips ⭐')}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featuredPlaces.map((place) => (
              <motion.div
                key={place.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/place/${place.id}`)}
                data-testid={`place-card-${place.id}`}
                className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="relative h-32">
                  <img 
                    src={place.image} 
                    alt={t(place.name)}
                    className="w-full h-full object-cover"
                  />
                  {place.wassimTip && (
                    <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-bold shadow-lg rotate-3">
                      ⭐
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm mb-1 line-clamp-1">{t(place.name)}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {t(place.description) || t(place.type)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/plans')}
            data-testid="itineraries-button"
            className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-4 text-start"
          >
            <Calendar className="w-6 h-6 mb-2" />
            <p className="font-bold text-sm">
              {language === 'ar' ? 'برامج سياحية' : language === 'fr' ? 'Itinéraires' : 'Itineraries'}
            </p>
            <p className="text-xs opacity-80">
              {language === 'ar' ? '1، 2، 3 أيام' : language === 'fr' ? '1, 2, 3 jours' : '1, 2, 3 days'}
            </p>
          </button>

          <button 
            onClick={() => navigate('/map')}
            data-testid="map-button"
            className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground rounded-2xl p-4 text-start"
          >
            <MapPin className="w-6 h-6 mb-2" />
            <p className="font-bold text-sm">
              {language === 'ar' ? 'الخريطة' : language === 'fr' ? 'Carte' : 'Map'}
            </p>
            <p className="text-xs opacity-80">
              {language === 'ar' ? 'أماكن قريبة' : language === 'fr' ? 'Lieux proches' : 'Nearby'}
            </p>
          </button>
        </div>

        <div 
          onClick={() => navigate('/about')}
          data-testid="about-wassim"
          className="bg-gradient-to-r from-accent/20 to-accent/10 border-2 border-accent/50 rounded-3xl p-6 cursor-pointer hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {language === 'ar' ? 'من هو وسيم؟' : language === 'fr' ? 'Qui est Wassim ?' : 'Who is Wassim?'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' 
                  ? 'مؤلف هذا الدليل وعاشق عنابة' 
                  : language === 'fr'
                  ? 'Auteur de ce guide et amoureux d\'Annaba'
                  : 'Author of this guide and Annaba lover'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
