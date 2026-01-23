import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Utensils } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { restaurants } from '../data/placesData';
import { motion, AnimatePresence } from 'framer-motion';

const FoodRoulettePage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [spinCount, setSpinCount] = useState(0);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedRestaurant(null);

    // Simulate spinning animation
    let counter = 0;
    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * restaurants.length);
      setSelectedRestaurant(restaurants[randomIndex]);
      counter++;

      if (counter > 20) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        setSpinCount(prev => prev + 1);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-destructive via-destructive to-orange-600 text-white p-6">
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all mb-4"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-5xl">🎰</div>
          <div>
            <h1 className="text-3xl font-bold">
              {language === 'ar' ? 'عجلة الطعام' : language === 'fr' ? 'Roulette Food' : 'Food Roulette'}
            </h1>
            <p className="text-sm opacity-90">
              {language === 'ar' ? 'لا تعرف وين تاكل؟ دير الروليت! 🎲' : language === 'fr' ? 'Tu sais pas où manger? Fais la roulette! 🎲' : 'Don\'t know where to eat? Spin the wheel! 🎲'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Instructions */}
        <div className="bg-gradient-to-br from-accent/20 to-accent/10 border-2 border-accent/50 rounded-3xl p-6">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-destructive" />
            {language === 'ar' ? 'كيفاش تلعب؟' : language === 'fr' ? 'Comment jouer?' : 'How to play?'}
          </h2>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>{language === 'ar' ? 'اضغط على زر "دير الروليت!" 🎯' : language === 'fr' ? 'Appuyez sur "Lance!" 🎯' : 'Press "Spin!" button 🎯'}</li>
            <li>{language === 'ar' ? 'شاهد العجلة وهي تدور 🌀' : language === 'fr' ? 'Regardez la roue tourner 🌀' : 'Watch the wheel spin 🌀'}</li>
            <li>{language === 'ar' ? 'اكتشف اختيار عشوائي من أفضل المطاعم! 🍽️' : language === 'fr' ? 'Découvrez un choix aléatoire des meilleurs restos! 🍽️' : 'Discover a random choice from best restaurants! 🍽️'}</li>
            <li>{language === 'ar' ? 'ما عجبكش؟ دير الروليت مرة أخرى! 🔄' : language === 'fr' ? 'Pas convaincu? Relancez! 🔄' : 'Not convinced? Spin again! 🔄'}</li>
          </ol>
        </div>

        {/* Roulette Wheel Display */}
        <div className="relative">
          <motion.div
            animate={{ rotate: isSpinning ? 360 * 5 : 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-full max-w-sm mx-auto aspect-square relative"
          >
            {/* Wheel Background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-destructive shadow-2xl flex items-center justify-center overflow-hidden">
              {/* Segments */}
              <div className="absolute inset-4 rounded-full bg-background/95 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-6xl mb-4">🍽️</div>
                  <AnimatePresence mode="wait">
                    {selectedRestaurant && (
                      <motion.div
                        key={selectedRestaurant.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="space-y-2"
                      >
                        <h3 className="text-xl font-bold line-clamp-2">
                          {t(selectedRestaurant.name)}
                        </h3>
                        {!isSpinning && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {t(selectedRestaurant.type)}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!selectedRestaurant && !isSpinning && (
                    <p className="text-muted-foreground">
                      {language === 'ar' ? 'جاهز للدوران! 🎰' : language === 'fr' ? 'Prêt à tourner! 🎰' : 'Ready to spin! 🎰'}
                    </p>
                  )}
                </div>
              </div>

              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                <div className="w-8 h-8 bg-destructive rounded-full shadow-lg flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-destructive -mb-3"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Spin Count */}
          {spinCount > 0 && (
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? `عدد اللفات: ${spinCount} 🎲` : language === 'fr' ? `Tours: ${spinCount} 🎲` : `Spins: ${spinCount} 🎲`}
              </p>
            </div>
          )}
        </div>

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          data-testid="spin-button"
          className={`w-full bg-gradient-to-r from-destructive to-orange-600 text-white rounded-3xl py-5 font-bold text-xl flex items-center justify-center gap-3 hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isSpinning ? 'animate-pulse' : 'active:scale-95'
          }`}
        >
          <RefreshCw className={`w-7 h-7 ${isSpinning ? 'animate-spin' : ''}`} />
          {isSpinning 
            ? (language === 'ar' ? 'يدور... 🌀' : language === 'fr' ? 'Tourne... 🌀' : 'Spinning... 🌀')
            : (language === 'ar' ? 'دير الروليت! 🎯' : language === 'fr' ? 'Lance! 🎯' : 'Spin! 🎯')}
        </button>

        {/* Selected Restaurant Details */}
        <AnimatePresence>
          {selectedRestaurant && !isSpinning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card border-2 border-border/50 rounded-3xl overflow-hidden shadow-lg"
              data-testid="selected-restaurant"
            >
              <div className="relative h-48">
                <img 
                  src={selectedRestaurant.image} 
                  alt={t(selectedRestaurant.name)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-destructive text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce">
                  🎉 {language === 'ar' ? 'فايز!' : language === 'fr' ? 'Gagnant!' : 'Winner!'}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{t(selectedRestaurant.name)}</h3>
                  <p className="text-muted-foreground">{t(selectedRestaurant.type)}</p>
                </div>

                {selectedRestaurant.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-2xl">📞</span>
                    <span className="font-mono">{selectedRestaurant.phone}</span>
                  </div>
                )}

                {selectedRestaurant.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-2xl">📍</span>
                    <span className="text-muted-foreground">{t(selectedRestaurant.address)}</span>
                  </div>
                )}

                {selectedRestaurant.wassimTip && (
                  <div className="bg-accent/20 border-2 border-accent/50 rounded-2xl p-4">
                    <p className="text-sm font-medium flex items-start gap-2">
                      <span className="text-xl">⭐</span>
                      <span>{t(selectedRestaurant.wassimTip)}</span>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate(`/place/${selectedRestaurant.id}`)}
                    data-testid="view-details-button"
                    className="bg-primary text-primary-foreground rounded-2xl py-3 font-bold hover:shadow-lg transition-all"
                  >
                    {language === 'ar' ? 'التفاصيل' : language === 'fr' ? 'Détails' : 'Details'}
                  </button>
                  <button
                    onClick={handleSpin}
                    data-testid="spin-again-button"
                    className="bg-muted text-foreground rounded-2xl py-3 font-bold hover:shadow-lg transition-all"
                  >
                    {language === 'ar' ? 'دور مرة أخرى' : language === 'fr' ? 'Re-lancer' : 'Spin Again'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fun Message */}
        {spinCount >= 5 && !isSpinning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-secondary/20 border-2 border-secondary/50 rounded-2xl p-4 text-center"
          >
            <p className="font-bold">
              {language === 'ar' 
                ? `${spinCount} لفات؟ يا سلام! 😅 يبدو أنك متردد ياسر! المطاعم كلها روعة، اختر واحد وانطلق! 💪` 
                : language === 'fr' 
                ? `${spinCount} tours? Oh la la! 😅 Tu as l'air très indécis! Tous les restos sont super, choisis-en un et vas-y! 💪`
                : `${spinCount} spins? Wow! 😅 You seem very indecisive! All restaurants are great, pick one and go! 💪`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FoodRoulettePage;
