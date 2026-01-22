import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Book } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { wassimProfile, allPlaces } from '../data/placesData';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const favoritePlaces = allPlaces.filter(p => 
    wassimProfile.favorites.beaches.includes(p.id) ||
    wassimProfile.favorites.restaurants.includes(p.id) ||
    wassimProfile.favorites.cafes.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[40vh] bg-gradient-to-br from-accent to-accent/60">
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="absolute top-6 start-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-6xl shadow-xl">
              👤
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-white mb-1">
                {t(wassimProfile.name)}
              </h1>
              <p className="text-white/90">
                {language === 'ar' ? 'مؤلف الدليل' : 'Auteur du Guide'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-3xl p-6"
        >
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Book className="w-6 h-6 text-primary" />
            {language === 'ar' ? 'عن وسيم' : 'À Propos de Wassim'}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t(wassimProfile.bio)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-secondary/20 to-secondary/10 border-2 border-secondary/50 rounded-3xl p-6"
        >
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Heart className="w-6 h-6 text-secondary" />
            {language === 'ar' ? 'مقولة وسيم المفضلة' : 'Citation Préférée de Wassim'}
          </h2>
          <p className="text-foreground leading-relaxed italic">
            "{t(wassimProfile.quote)}"
          </p>
        </motion.div>

        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            {language === 'ar' ? 'أماكن وسيم المفضلة' : 'Lieux Préférés de Wassim'}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {favoritePlaces.slice(0, 6).map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/place/${place.id}`)}
                data-testid={`favorite-${place.id}`}
                className="relative overflow-hidden rounded-3xl cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="relative h-32">
                  <img 
                    src={place.image} 
                    alt={t(place.name)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-white font-bold text-sm line-clamp-1">
                    {t(place.name)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-accent/20 border-2 border-accent/50 rounded-3xl p-6 text-center">
          <h3 className="font-bold text-lg mb-2">
            {language === 'ar' ? '🙏 شكراً لاستخدامك هذا الدليل' : '🙏 Merci d\'Utiliser ce Guide'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? 'آمل أن يكون هذا الدليل إضافة مفيدة وممتعة لرحلتك. استمتع بعنابة!' 
              : 'J\'espère que ce guide sera un ajout utile et agréable à votre voyage. Profitez d\'Annaba !'}
          </p>
          <p className="mt-3 font-bold text-primary">
            - {t(wassimProfile.name)}
          </p>
        </div>

        <button
          onClick={() => navigate('/explore')}
          data-testid="explore-all-button"
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold hover:shadow-lg transition-all"
        >
          {language === 'ar' ? 'استكشف جميع الأماكن' : 'Explorer Tous les Lieux'}
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
