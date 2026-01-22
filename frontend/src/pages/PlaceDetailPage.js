import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Clock, Star, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { allPlaces, moodCategories } from '../data/placesData';
import { motion } from 'framer-motion';

const PlaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const place = allPlaces.find(p => p.id === id);

  if (!place) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-xl font-bold mb-2">
            {language === 'ar' ? 'المكان غير موجود' : 'Lieu non trouvé'}
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="text-primary underline"
          >
            {language === 'ar' ? 'العودة' : 'Retour'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="relative h-[50vh]">
        <img 
          src={place.image} 
          alt={t(place.name)}
          className="w-full h-full object-cover"
        />
        
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="absolute top-6 start-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        {place.wassimTip && (
          <div className="absolute top-6 end-6 bg-accent text-accent-foreground px-4 py-2 rounded-full font-bold shadow-lg rotate-3">
            ⭐ {language === 'ar' ? 'نصيحة وسيم' : 'Conseil Wassim'}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{t(place.name)}</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {place.mood && place.mood.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {place.mood.map((moodId) => {
              const mood = moodCategories.find(m => m.id === moodId);
              return mood ? (
                <span 
                  key={moodId}
                  className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-1"
                >
                  <span>{mood.icon}</span>
                  <span>{t(mood.name)}</span>
                </span>
              ) : null;
            })}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2">
              {language === 'ar' ? 'الوصف' : 'Description'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t(place.description) || t(place.type)}
            </p>
          </div>

          {place.wassimTip && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/20 border-2 border-accent/50 rounded-3xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">
                    {language === 'ar' ? 'نصيحة وسيم' : 'Conseil de Wassim'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(place.wassimTip)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-3">
          {place.address && (
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{t(place.address)}</span>
            </div>
          )}

          {place.phone && (
            <button
              onClick={() => window.location.href = `tel:${place.phone}`}
              data-testid="call-button"
              className="flex items-center gap-3 text-sm w-full"
            >
              <Phone className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-primary font-medium">{place.phone}</span>
            </button>
          )}

          {place.hours && (
            <div className="flex items-start gap-3 text-sm">
              <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{t(place.hours)}</span>
            </div>
          )}

          {place.price && (
            <div className="flex items-start gap-3 text-sm">
              <span className="text-2xl">💰</span>
              <span className="text-muted-foreground">{t(place.price)}</span>
            </div>
          )}

          {place.amenities && (
            <div className="flex items-start gap-3 text-sm">
              <span className="text-2xl">✨</span>
              <span className="text-muted-foreground">{t(place.amenities)}</span>
            </div>
          )}
        </div>

        {place.coordinates && (
          <button
            onClick={() => navigate(`/map?lat=${place.coordinates[0]}&lng=${place.coordinates[1]}&place=${place.id}`)}
            data-testid="view-on-map"
            className="w-full bg-primary text-primary-foreground rounded-2xl p-4 font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            <MapPin className="w-5 h-5" />
            {language === 'ar' ? 'عرض على الخريطة' : 'Voir sur la Carte'}
          </button>
        )}

        {place.winterRecommended && (
          <div className="bg-secondary/20 border-2 border-secondary/50 rounded-2xl p-4 text-center">
            <span className="text-2xl mb-2 block">❄️</span>
            <p className="font-bold">
              {language === 'ar' ? 'موصى به في الشتاء' : 'Recommandé en Hiver'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceDetailPage;
