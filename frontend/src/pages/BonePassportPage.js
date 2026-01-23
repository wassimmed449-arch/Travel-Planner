import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, MapPin, Calendar, Trophy, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { allPlaces } from '../data/placesData';
import { motion, AnimatePresence } from 'framer-motion';

const BonePassportPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [checkedIn, setCheckedIn] = useState([]);
  const [totalStamps, setTotalStamps] = useState(0);
  const [level, setLevel] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  const calculateLevel = useCallback((stamps) => {
    if (stamps < 5) setLevel(1);
    else if (stamps < 10) setLevel(2);
    else if (stamps < 20) setLevel(3);
    else if (stamps < 30) setLevel(4);
    else setLevel(5);
  }, []);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('bone_passport_checkins');
    if (saved) {
      const data = JSON.parse(saved);
      setCheckedIn(data);
      setTotalStamps(data.length);
      calculateLevel(data.length);
    }
  }, [calculateLevel]);

  const getLevelInfo = () => {
    const levels = {
      1: { 
        name: { ar: 'مستكشف جديد', fr: 'Nouvel Explorateur', en: 'New Explorer' }, 
        icon: '🌱', 
        color: 'from-green-500 to-emerald-500',
        next: 5 
      },
      2: { 
        name: { ar: 'سائح نشط', fr: 'Touriste Actif', en: 'Active Tourist' }, 
        icon: '🎒', 
        color: 'from-blue-500 to-cyan-500',
        next: 10 
      },
      3: { 
        name: { ar: 'عارف المدينة', fr: 'Connaisseur', en: 'City Knower' }, 
        icon: '🗺️', 
        color: 'from-purple-500 to-pink-500',
        next: 20 
      },
      4: { 
        name: { ar: 'خبير عنابة', fr: 'Expert Annaba', en: 'Annaba Expert' }, 
        icon: '⭐', 
        color: 'from-orange-500 to-red-500',
        next: 30 
      },
      5: { 
        name: { ar: 'أسطورة بونة', fr: 'Légende de Bône', en: 'Bône Legend' }, 
        icon: '👑', 
        color: 'from-yellow-500 to-amber-500',
        next: null 
      }
    };
    return levels[level];
  };

  const handleCheckIn = (placeId) => {
    // Check if already checked in
    if (checkedIn.some(c => c.placeId === placeId)) {
      alert(t({
        ar: 'لقد سجلت دخولك هنا من قبل! ✅',
        fr: 'Vous avez déjà fait un check-in ici! ✅',
        en: 'You already checked in here! ✅'
      }));
      return;
    }

    const newCheckIn = {
      placeId,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    const updated = [...checkedIn, newCheckIn];
    setCheckedIn(updated);
    setTotalStamps(updated.length);
    localStorage.setItem('bone_passport_checkins', JSON.stringify(updated));

    // Check for level up
    const oldLevel = level;
    calculateLevel(updated.length);
    if (level > oldLevel) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const getCheckedInPlaces = () => {
    return checkedIn.map(c => {
      const place = allPlaces.find(p => p.id === c.placeId);
      return { ...c, place };
    }).filter(c => c.place);
  };

  const getProgress = () => {
    const levelInfo = getLevelInfo();
    if (levelInfo.next === null) return 100;
    return (totalStamps / levelInfo.next) * 100;
  };

  const levelInfo = getLevelInfo();
  const checkedInPlaces = getCheckedInPlaces();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className={`bg-gradient-to-br ${levelInfo.color} text-white p-6 pb-12`}>
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all mb-4"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="text-6xl">{levelInfo.icon}</div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">
              {language === 'ar' ? 'جواز بونة' : language === 'fr' ? 'Passeport Bône' : 'Bône Passport'}
            </h1>
            <p className="text-sm opacity-90">
              {t(levelInfo.name)}
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black">{totalStamps}</div>
            <div className="text-xs opacity-90">
              {language === 'ar' ? 'أختام' : language === 'fr' ? 'Tampons' : 'Stamps'}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {levelInfo.next && (
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span>{language === 'ar' ? 'المستوى الحالي' : language === 'fr' ? 'Niveau actuel' : 'Current Level'}</span>
              <span>{totalStamps} / {levelInfo.next}</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <p className="text-xs mt-2 opacity-90">
              {levelInfo.next - totalStamps} {language === 'ar' ? 'أختام للمستوى التالي' : language === 'fr' ? 'tampons pour niveau suivant' : 'stamps to next level'}
            </p>
          </div>
        )}
      </div>

      <div className="px-6 -mt-8 space-y-6">
        {/* Stats Card */}
        <div className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-lg">
          <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            {language === 'ar' ? 'إحصائياتك' : language === 'fr' ? 'Vos Stats' : 'Your Stats'}
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-2xl">
              <div className="text-3xl font-bold text-primary">{totalStamps}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {language === 'ar' ? 'أماكن' : language === 'fr' ? 'Lieux' : 'Places'}
              </div>
            </div>
            <div className="text-center p-4 bg-secondary/10 rounded-2xl">
              <div className="text-3xl font-bold text-secondary">{level}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {language === 'ar' ? 'المستوى' : language === 'fr' ? 'Niveau' : 'Level'}
              </div>
            </div>
            <div className="text-center p-4 bg-accent/30 rounded-2xl">
              <div className="text-3xl font-bold text-accent-foreground">{Math.round((totalStamps / allPlaces.length) * 100)}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                {language === 'ar' ? 'مكتمل' : language === 'fr' ? 'Complété' : 'Complete'}
              </div>
            </div>
          </div>
        </div>

        {/* How to Collect */}
        <div className="bg-gradient-to-br from-accent/20 to-accent/10 border-2 border-accent/50 rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            {language === 'ar' ? 'كيف تجمع الأختام؟' : language === 'fr' ? 'Comment collecter?' : 'How to Collect?'}
          </h3>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>{language === 'ar' ? 'زر أي مكان في عنابة 📍' : language === 'fr' ? 'Visitez un lieu à Annaba 📍' : 'Visit a place in Annaba 📍'}</li>
            <li>{language === 'ar' ? 'افتح صفحة المكان في التطبيق 📱' : language === 'fr' ? 'Ouvrez la page du lieu dans l\'app 📱' : 'Open place page in app 📱'}</li>
            <li>{language === 'ar' ? 'اضغط "تسجيل دخول" لجمع الختم ✅' : language === 'fr' ? 'Appuyez "Check-in" pour collecter le tampon ✅' : 'Press "Check-in" to collect stamp ✅'}</li>
            <li>{language === 'ar' ? 'اجمع المزيد وارتقي في المستويات! 🚀' : language === 'fr' ? 'Collectez plus et montez de niveau! 🚀' : 'Collect more and level up! 🚀'}</li>
          </ol>
        </div>

        {/* Checked-in Places */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            {language === 'ar' ? 'أماكنك المزارة' : language === 'fr' ? 'Lieux Visités' : 'Visited Places'}
          </h2>

          {checkedInPlaces.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-3xl">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-lg font-bold mb-2">
                {language === 'ar' ? 'لم تزر أي مكان بعد!' : language === 'fr' ? 'Aucun lieu visité encore!' : 'No places visited yet!'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'ar' ? 'ابدأ استكشاف عنابة واجمع أختامك!' : language === 'fr' ? 'Commencez à explorer Annaba et collectez vos tampons!' : 'Start exploring Annaba and collect your stamps!'}
              </p>
              <button
                onClick={() => navigate('/explore')}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold"
              >
                {language === 'ar' ? 'استكشف الآن' : language === 'fr' ? 'Explorer Maintenant' : 'Explore Now'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {checkedInPlaces.sort((a, b) => b.timestamp - a.timestamp).map((item, index) => (
                <motion.div
                  key={item.placeId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/place/${item.placeId}`)}
                  className="flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer"
                  data-testid={`checked-in-${item.placeId}`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl flex-shrink-0">
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold line-clamp-1">{t(item.place.name)}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.date).toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                    </div>
                  </div>
                  <div className="text-3xl">🏆</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Explore Button */}
        <button
          onClick={() => navigate('/explore')}
          data-testid="explore-more-button"
          className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-3xl py-4 font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
        >
          <MapPin className="w-6 h-6" />
          {language === 'ar' ? 'اكتشف أماكن جديدة' : language === 'fr' ? 'Découvrir Nouveaux Lieux' : 'Discover New Places'}
        </button>
      </div>

      {/* Level Up Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white rounded-3xl p-8 shadow-2xl text-center">
              <div className="text-7xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-3xl font-black mb-2">
                {language === 'ar' ? 'مستوى جديد!' : language === 'fr' ? 'Nouveau Niveau!' : 'Level Up!'}
              </h2>
              <p className="text-xl font-bold">
                {t(levelInfo.name)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BonePassportPage;
