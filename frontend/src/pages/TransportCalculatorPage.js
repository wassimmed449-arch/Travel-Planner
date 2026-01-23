import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Bus, CableCar, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

const TransportCalculatorPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Static taxi fare estimates
  const taxiFares = [
    {
      id: 'airport-center',
      from: { ar: 'المطار', fr: 'Aéroport', en: 'Airport' },
      to: { ar: 'وسط المدينة', fr: 'Centre-ville', en: 'City Center' },
      price: '800 - 1200',
      duration: '25-35'
    },
    {
      id: 'center-seraidi',
      from: { ar: 'وسط المدينة', fr: 'Centre-ville', en: 'City Center' },
      to: { ar: 'سرايدي', fr: 'Seraidi', en: 'Seraidi' },
      price: '600 - 900',
      duration: '20-30'
    },
    {
      id: 'center-beach',
      from: { ar: 'وسط المدينة', fr: 'Centre-ville', en: 'City Center' },
      to: { ar: 'الشواطئ (عين عشير)', fr: 'Plages (Ain Achir)', en: 'Beaches (Ain Achir)' },
      price: '300 - 500',
      duration: '10-15'
    },
    {
      id: 'center-elbouni',
      from: { ar: 'وسط المدينة', fr: 'Centre-ville', en: 'City Center' },
      to: { ar: 'البوني', fr: 'El Bouni', en: 'El Bouni' },
      price: '200 - 350',
      duration: '10-15'
    },
    {
      id: 'center-sidiAmar',
      from: { ar: 'وسط المدينة', fr: 'Centre-ville', en: 'City Center' },
      to: { ar: 'سيدي عمار', fr: 'Sidi Amar', en: 'Sidi Amar' },
      price: '300 - 450',
      duration: '15-20'
    },
    {
      id: 'center-chetaibi',
      from: { ar: 'وسط المدينة', fr: 'Centre-ville', en: 'City Center' },
      to: { ar: 'شطايبي', fr: 'Chetaibi', en: 'Chetaibi' },
      price: '1500 - 2000',
      duration: '45-60'
    },
    {
      id: 'airport-seraidi',
      from: { ar: 'المطار', fr: 'Aéroport', en: 'Airport' },
      to: { ar: 'سرايدي', fr: 'Seraidi', en: 'Seraidi' },
      price: '1200 - 1600',
      duration: '40-50'
    },
    {
      id: 'beach-seraidi',
      from: { ar: 'الشواطئ', fr: 'Plages', en: 'Beaches' },
      to: { ar: 'سرايدي', fr: 'Seraidi', en: 'Seraidi' },
      price: '700 - 1000',
      duration: '25-35'
    }
  ];

  const t = (obj) => obj[language] || obj['ar'] || obj['en'];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black p-6">
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center hover:bg-black/30 transition-all mb-4"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>
        <div className="flex items-center gap-3">
          <Car className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'ar' ? 'دليل أسعار التاكسي 🚕' : language === 'fr' ? 'Guide des Prix Taxi 🚕' : 'Taxi Fare Guide 🚕'}
            </h1>
            <p className="text-sm opacity-80">
              {language === 'ar' ? 'أسعار تقريبية في عنابة' : language === 'fr' ? 'Prix estimés à Annaba' : 'Estimated prices in Annaba'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Info Banner */}
        <div className="bg-accent/20 border-2 border-accent/50 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            {language === 'ar' 
              ? 'الأسعار تقريبية وقد تختلف حسب الوقت (ليلاً أعلى)، الموسم، وحركة المرور. تفاوض قبل الركوب!' 
              : language === 'fr'
              ? 'Les prix sont approximatifs et peuvent varier selon l\'heure (plus cher la nuit), la saison et le trafic. Négociez avant de monter!'
              : 'Prices are approximate and may vary by time (higher at night), season, and traffic. Negotiate before riding!'}
          </p>
        </div>

        {/* Taxi Fares Table */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Car className="w-6 h-6 text-yellow-500" />
            {language === 'ar' ? 'أسعار التاكسي' : language === 'fr' ? 'Tarifs Taxi' : 'Taxi Fares'}
          </h2>
          
          <div className="space-y-3">
            {taxiFares.map((fare, index) => (
              <motion.div
                key={fare.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border/50 rounded-2xl p-4"
                data-testid={`fare-${fare.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold">{t(fare.from)}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-bold">{t(fare.to)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-yellow-600">
                    {fare.price} <span className="text-sm font-normal text-muted-foreground">DA</span>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ⏱️ {fare.duration} min
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Other Transport Options */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            {language === 'ar' ? 'وسائل نقل أخرى' : language === 'fr' ? 'Autres Transports' : 'Other Transport'}
          </h2>
          
          <div className="space-y-3">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Bus className="w-8 h-8 text-blue-500" />
                <div>
                  <h4 className="font-bold">
                    {language === 'ar' ? 'الحافلات' : language === 'fr' ? 'Bus' : 'Bus'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'محطة لارماكا' : language === 'fr' ? 'Station Larmaka' : 'Larmaka Station'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {language === 'ar' 
                  ? 'داخل المدينة: 20 دج فقط. تغطي معظم المناطق من محطة لارماكا.' 
                  : language === 'fr'
                  ? 'Dans la ville: 20 DA seulement. Couvre la plupart des zones depuis la station Larmaka.'
                  : 'Within city: 20 DA only. Covers most areas from Larmaka station.'}
              </p>
              <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                20 DA
              </span>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <CableCar className="w-8 h-8 text-purple-500" />
                <div>
                  <h4 className="font-bold">
                    {language === 'ar' ? 'التلفريك' : language === 'fr' ? 'Téléphérique' : 'Cable Car'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'وسط المدينة ↔ سرايدي' : language === 'fr' ? 'Centre-ville ↔ Seraidi' : 'City Center ↔ Seraidi'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {language === 'ar' 
                  ? 'رحلة ممتعة مع إطلالات خلابة. المدة: 10 دقائق تقريباً.' 
                  : language === 'fr'
                  ? 'Trajet agréable avec vues magnifiques. Durée: environ 10 minutes.'
                  : 'Enjoyable ride with stunning views. Duration: about 10 minutes.'}
              </p>
              <span className="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                60-70 DA
              </span>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Car className="w-8 h-8 text-green-500" />
                <div>
                  <h4 className="font-bold">
                    {language === 'ar' ? 'استئجار سيارة' : language === 'fr' ? 'Location de Voiture' : 'Car Rental'}
                  </h4>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {language === 'ar' 
                  ? 'للحرية الكاملة في التنقل. متوفر في المطار ووسط المدينة.' 
                  : language === 'fr'
                  ? 'Pour une liberté totale de déplacement. Disponible à l\'aéroport et au centre-ville.'
                  : 'For complete freedom of movement. Available at airport and city center.'}
              </p>
              <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                3,500 - 6,000 DA / {language === 'ar' ? 'يوم' : language === 'fr' ? 'jour' : 'day'}
              </span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4">
          <h3 className="font-bold mb-2">
            {language === 'ar' ? '💡 نصائح وسيم' : language === 'fr' ? '💡 Conseils de Wassim' : '💡 Wassim\'s Tips'}
          </h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>• {language === 'ar' ? 'اتفق على السعر قبل الركوب دائماً' : language === 'fr' ? 'Toujours convenir du prix avant de monter' : 'Always agree on the price before getting in'}</li>
            <li>• {language === 'ar' ? 'الأسعار ترتفع ليلاً وفي المواسم السياحية' : language === 'fr' ? 'Les prix augmentent la nuit et en haute saison' : 'Prices increase at night and during tourist season'}</li>
            <li>• {language === 'ar' ? 'التلفريك أفضل طريقة للوصول لسرايدي مع مناظر رائعة' : language === 'fr' ? 'Le téléphérique est le meilleur moyen d\'atteindre Seraidi avec de superbes vues' : 'Cable car is the best way to reach Seraidi with great views'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransportCalculatorPage;
