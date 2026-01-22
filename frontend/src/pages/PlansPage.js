import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { itineraries } from '../data/placesData';
import { motion } from 'framer-motion';

const PlansPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isWinterMode } = useTheme();

  const plans = [
    { key: 'oneDay', color: 'from-blue-500 to-cyan-500', icon: '🌅' },
    { key: 'twoDays', color: 'from-purple-500 to-pink-500', icon: '🌄' },
    { key: 'threeDays', color: 'from-green-500 to-emerald-500', icon: '🏔️' },
    { key: 'winter', color: 'from-indigo-500 to-blue-500', icon: '❄️', highlight: isWinterMode }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === 'ar' ? 'برامج سياحية' : 'Itinéraires Touristiques'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'خطط رحلتك مع برامج وسيم المجربة' 
              : 'Planifiez votre voyage avec les itinéraires testés de Wassim'}
          </p>
        </div>

        <div className="space-y-4">
          {plans.map((plan, index) => {
            const itinerary = itineraries[plan.key];
            
            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/plan/${plan.key}`)}
                data-testid={`plan-${plan.key}`}
                className={`relative overflow-hidden rounded-3xl cursor-pointer transition-all hover:shadow-xl ${
                  plan.highlight ? 'ring-2 ring-secondary' : ''
                }`}
              >
                <div className={`bg-gradient-to-br ${plan.color} p-6 text-white`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-1">{t(itinerary.name)}</h2>
                      <p className="text-white/90 text-sm">{t(itinerary.duration)}</p>
                    </div>
                    <div className="text-4xl">{plan.icon}</div>
                  </div>

                  <div className="space-y-2">
                    {itinerary.activities.slice(0, 3).map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-white/80">
                        <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {t(activity.time || activity.day)}: {t(activity.activity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {plan.highlight && (
                    <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-sm">
                      {language === 'ar' ? '✨ موصى به في الوضع الشتوي' : '✨ Recommandé en mode hiver'}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-accent/20 border-2 border-accent/50 rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-2">
            {language === 'ar' ? '💡 نصيحة وسيم' : '💡 Conseil de Wassim'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? 'هذه البرامج ليست قواعد صارمة؛ يمكنك التغيير والارتجال حسب مزاجك. الأهم هو الاستمتاع!' 
              : 'Ces programmes ne sont pas des règles strictes ; vous pouvez changer et improviser selon votre humeur. L\'important est de profiter !'}
          </p>
        </div>

        <button 
          onClick={() => navigate('/transport-calculator')}
          data-testid="transport-calculator-button"
          className="w-full bg-primary text-primary-foreground rounded-2xl p-4 flex items-center justify-between hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            <div className="text-start">
              <p className="font-bold">
                {language === 'ar' ? 'حاسبة النقل 🚕' : 'Calculateur Transport 🚕'}
              </p>
              <p className="text-sm opacity-80">
                {language === 'ar' ? 'احسب تكلفة التاكسي' : 'Calculez le coût du taxi'}
              </p>
            </div>
          </div>
          <span className="text-2xl">→</span>
        </button>
      </div>
    </div>
  );
};

export default PlansPage;
