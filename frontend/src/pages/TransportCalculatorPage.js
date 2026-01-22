import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateTaxiFare } from '../utils/helpers';

const TransportCalculatorPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState(null);

  const locations = [
    { id: 'centre', name: { ar: 'وسط المدينة', fr: 'Centre-ville' } },
    { id: 'seraidi', name: { ar: 'سرايدي', fr: 'Seraidi' } },
    { id: 'airport', name: { ar: 'المطار', fr: 'Aéroport' } },
    { id: 'beach', name: { ar: 'الشاطئ', fr: 'Plage' } },
    { id: 'elbouni', name: { ar: 'البوني', fr: 'El Bouni' } },
    { id: 'sidi-amar', name: { ar: 'سيدي عمار', fr: 'Sidi Amar' } },
    { id: 'chetaibi', name: { ar: 'شطايبي', fr: 'Chetaibi' } }
  ];

  const handleCalculate = () => {
    if (!from || !to) return;
    
    const fare = calculateTaxiFare(from, to);
    setResult(fare);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-6 flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>
        <div>
          <h1 className="text-xl font-bold">
            {language === 'ar' ? 'حاسبة النقل 🚕' : 'Calculateur Transport 🚕'}
          </h1>
          <p className="text-sm opacity-80">
            {language === 'ar' ? 'احسب تكلفة التاكسي' : 'Calculez le coût du taxi'}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-accent/20 border-2 border-accent/50 rounded-2xl p-4">
          <p className="text-sm">
            {language === 'ar' 
              ? '💡 الأسعار تقريبية وقد تختلف حسب الوقت والموسم' 
              : '💡 Les prix sont approximatifs et peuvent varier selon le temps et la saison'}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              <MapPin className="inline w-4 h-4 me-1" />
              {language === 'ar' ? 'من' : 'De'}
            </label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              data-testid="from-select"
              className="w-full px-4 py-3 bg-muted rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">
                {language === 'ar' ? 'اختر الموقع' : 'Choisir le lieu'}
              </option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {t(loc.name)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              <MapPin className="inline w-4 h-4 me-1" />
              {language === 'ar' ? 'إلى' : 'À'}
            </label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              data-testid="to-select"
              className="w-full px-4 py-3 bg-muted rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">
                {language === 'ar' ? 'اختر الوجهة' : 'Choisir la destination'}
              </option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {t(loc.name)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCalculate}
            disabled={!from || !to}
            data-testid="calculate-button"
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {language === 'ar' ? 'احسب التكلفة' : 'Calculer le Coût'}
          </button>
        </div>

        {result && (
          <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl p-6 text-center">
            <DollarSign className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">
              {language === 'ar' ? 'التكلفة المتوقعة' : 'Coût Estimé'}
            </h2>
            <p className="text-4xl font-bold mb-1">
              {result.min} - {result.max}
            </p>
            <p className="text-lg opacity-90">
              {language === 'ar' ? 'دينار جزائري' : 'Dinars Algériens'}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-bold text-lg">
            {language === 'ar' ? 'نصائح النقل' : 'Conseils de Transport'}
          </h3>
          
          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <h4 className="font-bold mb-2">
              {language === 'ar' ? '🚍 الحافلات' : '🚍 Bus'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'داخل المدينة: 20 دج فقط. محطة لارماكا تخدم معظم المناطق' 
                : 'Dans la ville: 20 DA seulement. Station Larmaka dessert la plupart des zones'}
            </p>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <h4 className="font-bold mb-2">
              {language === 'ar' ? '🚡 التلفريك' : '🚡 Téléphérique'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'وسط المدينة → سرايدي: 60-70 دج | 10 دقائق' 
                : 'Centre-ville → Seraidi: 60-70 DA | 10 minutes'}
            </p>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <h4 className="font-bold mb-2">
              {language === 'ar' ? '🚗 استئجار سيارة' : '🚗 Location de Voiture'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? '3500-6000 دج في اليوم حسب نوع السيارة' 
                : '3500-6000 DA par jour selon le type de voiture'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportCalculatorPage;
