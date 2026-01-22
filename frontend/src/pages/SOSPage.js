import React from 'react';
import { Phone, MapPin, Clock, Building2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { emergencyContacts } from '../data/placesData';
import { motion } from 'framer-motion';

const SOSPage = () => {
  const { t, language } = useLanguage();

  const makeCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const groupedContacts = {
    hospital: emergencyContacts.filter(c => c.type === 'hospital'),
    clinic: emergencyContacts.filter(c => c.type === 'clinic'),
    emergency: emergencyContacts.filter(c => c.type === 'police' || c.type === 'emergency')
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-destructive text-destructive-foreground p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl">🚨</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'ar' ? 'طوارئ' : 'Urgences'}
            </h1>
            <p className="text-sm opacity-90">
              {language === 'ar' ? 'أرقام الطوارئ في عنابة' : 'Numéros d\'urgence à Annaba'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🚑</span>
            {language === 'ar' ? 'طوارئ سريعة' : 'Urgences Rapides'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {groupedContacts.emergency.map((contact, index) => (
              <motion.button
                key={contact.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => makeCall(contact.phone)}
                data-testid={`emergency-${contact.id}`}
                className="bg-destructive text-destructive-foreground rounded-2xl p-4 hover:shadow-lg transition-all active:scale-95"
              >
                <Phone className="w-8 h-8 mb-2 mx-auto" />
                <p className="font-bold text-lg mb-1">{contact.phone}</p>
                <p className="text-xs opacity-90">{t(contact.name)}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            {language === 'ar' ? 'مستشفيات' : 'Hôpitaux'}
          </h2>
          <div className="space-y-3">
            {groupedContacts.hospital.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-4 space-y-3"
                data-testid={`hospital-${contact.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{t(contact.name)}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t(contact.description)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {contact.address && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{t(contact.address)}</span>
                    </div>
                  )}
                  {contact.hours && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{t(contact.hours)}</span>
                    </div>
                  )}
                </div>

                {contact.phone && (
                  <button
                    onClick={() => makeCall(contact.phone)}
                    data-testid={`call-${contact.id}`}
                    className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95"
                  >
                    <Phone className="w-5 h-5" />
                    {language === 'ar' ? 'اتصل الآن' : 'Appeler Maintenant'}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            {language === 'ar' ? 'عيادات خاصة' : 'Cliniques Privées'}
          </h2>
          <div className="space-y-3">
            {groupedContacts.clinic.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-4"
                data-testid={`clinic-${contact.id}`}
              >
                <h3 className="font-bold mb-1">{t(contact.name)}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {t(contact.description)}
                </p>
                
                {contact.address && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{t(contact.address)}</span>
                  </div>
                )}

                {contact.phone && (
                  <button
                    onClick={() => makeCall(contact.phone)}
                    data-testid={`call-clinic-${contact.id}`}
                    className="w-full bg-secondary text-secondary-foreground rounded-xl py-2 font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    {contact.phone}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-accent/20 border-2 border-accent/50 rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            {language === 'ar' ? 'تذكير مهم' : 'Rappel Important'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? 'في حالات الطوارئ الخطيرة، اتصل بـ 14 (الحماية المدنية) أو 1548 (الشرطة) فوراً. هذه الأرقام متاحة 24/7.' 
              : 'En cas d\'urgence grave, appelez le 14 (Protection Civile) ou le 1548 (Police) immédiatement. Ces numéros sont disponibles 24h/24 et 7j/7.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SOSPage;
