import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Building2, Briefcase, Anchor } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { tourismAgencies, recreationalClubs } from '../data/v3EnhancedData';
import { motion } from 'framer-motion';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const t = (obj) => {
    if (typeof obj === 'object' && obj !== null) {
      return obj[language] || obj['ar'] || obj['en'] || '';
    }
    return obj || '';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white p-6">
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all mb-4"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="flex items-center gap-3">
          <Building2 className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'ar' ? 'الخدمات والوكالات' : language === 'fr' ? 'Services & Agences' : 'Services & Agencies'}
            </h1>
            <p className="text-sm opacity-90">
              {language === 'ar' ? 'وكالات السياحة والنوادي الترفيهية' : language === 'fr' ? 'Agences de tourisme et clubs récréatifs' : 'Tourism agencies and recreational clubs'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-8">
        {/* Tourism Agencies */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            {language === 'ar' ? 'وكالات السياحة' : language === 'fr' ? 'Agences de Tourisme' : 'Tourism Agencies'}
          </h2>
          
          <div className="space-y-4">
            {tourismAgencies.map((agency, index) => (
              <motion.div
                key={agency.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-4"
                data-testid={`agency-${agency.id}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{t(agency.name)}</h3>
                    {agency.services && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {t(agency.services)}
                      </p>
                    )}
                  </div>
                </div>

                {agency.whyChoose && (
                  <div className="bg-accent/20 rounded-xl p-3 mb-3">
                    <p className="text-sm text-accent-foreground">
                      <span className="font-bold">💡 </span>
                      {t(agency.whyChoose)}
                    </p>
                  </div>
                )}

                {agency.pricing && (
                  <div className="bg-secondary/20 rounded-xl p-3 mb-3">
                    <p className="text-sm">
                      <span className="font-bold">💰 </span>
                      {t(agency.pricing)}
                    </p>
                  </div>
                )}

                {agency.phone && (
                  <a
                    href={`tel:${agency.phone.replace(/\s/g, '').split('/')[0]}`}
                    className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    {agency.phone}
                  </a>
                )}

                {agency.instagram && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    📱 {agency.instagram}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recreational Clubs */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Anchor className="w-6 h-6 text-secondary" />
            {language === 'ar' ? 'النوادي الترفيهية' : language === 'fr' ? 'Clubs Récréatifs' : 'Recreational Clubs'}
          </h2>
          
          <div className="space-y-4">
            {recreationalClubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-4"
                data-testid={`club-${club.id}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    {club.type === 'diving' ? '🤿' : club.type === 'horseback' ? '🐴' : club.type === 'cultural' ? '♟️' : '🎯'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{t(club.name)}</h3>
                    <p className="text-xs text-muted-foreground uppercase mt-1">
                      {club.type}
                    </p>
                  </div>
                </div>

                {club.services && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {t(club.services)}
                  </p>
                )}

                {club.whyChoose && (
                  <div className="bg-accent/20 rounded-xl p-3 mb-3">
                    <p className="text-sm text-accent-foreground">
                      <span className="font-bold">💡 </span>
                      {t(club.whyChoose)}
                    </p>
                  </div>
                )}

                {club.wassimTip && (
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 mb-3">
                    <p className="text-sm">
                      <span className="font-bold">⭐ {language === 'ar' ? 'نصيحة وسيم:' : 'Wassim\'s Tip:'} </span>
                      {t(club.wassimTip)}
                    </p>
                  </div>
                )}

                {club.phone && (
                  <a
                    href={`tel:${club.phone.replace(/\s/g, '').split('/')[0]}`}
                    className="w-full bg-secondary text-secondary-foreground rounded-xl py-3 font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    {language === 'ar' ? 'اتصل الآن' : language === 'fr' ? 'Appeler' : 'Call Now'}
                  </a>
                )}

                {(club.instagram || club.facebook || club.website) && (
                  <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
                    {club.instagram && <span>📱 {club.instagram}</span>}
                    {club.facebook && <span>📘 {club.facebook}</span>}
                    {club.website && <span>🌐 {club.website}</span>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;
