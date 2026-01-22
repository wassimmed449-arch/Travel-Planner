import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Coffee, Utensils, Camera } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { itineraries } from '../data/placesData';
import { motion } from 'framer-motion';

const PlanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const plan = itineraries[id];

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-xl font-bold mb-2">
            {language === 'ar' ? 'البرنامج غير موجود' : 'Programme non trouvé'}
          </p>
          <button 
            onClick={() => navigate('/plans')}
            className="text-primary underline"
          >
            {language === 'ar' ? 'العودة للبرامج' : 'Retour aux Plans'}
          </button>
        </div>
      </div>
    );
  }

  const getActivityIcon = (activity) => {
    const text = activity.toLowerCase();
    if (text.includes('café') || text.includes('coffee') || text.includes('قهوة')) return <Coffee className="w-5 h-5" />;
    if (text.includes('food') || text.includes('lunch') || text.includes('dinner') || text.includes('غداء') || text.includes('عشاء')) return <Utensils className="w-5 h-5" />;
    if (text.includes('photo') || text.includes('صور')) return <Camera className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[30vh] bg-gradient-to-br from-primary to-primary/80 text-white">
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="absolute top-6 start-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-bold mb-2">{t(plan.name)}</h1>
          <p className="text-lg opacity-90">{t(plan.duration)}</p>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        <div className="bg-accent/20 border-2 border-accent/50 rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-2">
            {language === 'ar' ? '💡 نصيحة وسيم' : '💡 Conseil de Wassim'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? 'هذه البرامج مرنة ويمكن تكييفها حسب رغبتك ووقتك. الهدف هو الاستمتاع بعنابة!' 
              : 'Ces programmes sont flexibles et peuvent être adaptés selon vos envies et votre temps. Le but est de profiter d\'Annaba !'}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            {language === 'ar' ? 'البرنامج المفصل' : 'Programme Détaillé'}
          </h2>

          {plan.activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border/50 rounded-3xl p-5 hover:shadow-md transition-all"
              data-testid={`activity-${index}`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  {getActivityIcon(t(activity.activity))}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-muted rounded-full text-xs font-bold">
                      {t(activity.time || activity.day)}
                    </span>
                  </div>
                  
                  <p className="text-foreground leading-relaxed">
                    {t(activity.activity)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/explore')}
            data-testid="explore-places-button"
            className="bg-secondary text-secondary-foreground rounded-2xl p-4 font-bold hover:shadow-lg transition-all"
          >
            {language === 'ar' ? 'استكشف الأماكن' : 'Explorer les Lieux'}
          </button>

          <button 
            onClick={() => navigate('/transport-calculator')}
            data-testid="transport-button"
            className="bg-primary text-primary-foreground rounded-2xl p-4 font-bold hover:shadow-lg transition-all"
          >
            {language === 'ar' ? 'حاسبة النقل' : 'Transport'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailPage;
