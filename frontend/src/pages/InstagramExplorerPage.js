import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Instagram, ExternalLink, Hash } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

const InstagramExplorerPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const categories = [
    {
      id: 'general',
      title: { ar: 'عنابة عام', fr: 'Annaba Général', en: 'Annaba General' },
      icon: '🌆',
      hashtags: [
        { tag: 'Annaba', label: '#Annaba' },
        { tag: 'عنابة', label: '#عنابة' },
        { tag: 'AnnabaCity', label: '#AnnabaCity' },
        { tag: 'BoneAlgerie', label: '#BoneAlgerie' },
        { tag: 'VisitAnnaba', label: '#VisitAnnaba' },
        { tag: 'AnnabaAlgeria', label: '#AnnabaAlgeria' }
      ]
    },
    {
      id: 'beaches',
      title: { ar: 'الشواطئ', fr: 'Plages', en: 'Beaches' },
      icon: '🏖️',
      hashtags: [
        { tag: 'PlageDjenenElBey', label: '#PlageDjenenElBey' },
        { tag: 'PlageAinAchir', label: '#PlageAinAchir' },
        { tag: 'ChapuiBeach', label: '#ChapuiBeach' },
        { tag: 'AnnabaBeach', label: '#AnnabaBeach' },
        { tag: 'Chetaibi', label: '#Chetaibi' },
        { tag: 'RifRif', label: '#RifRif' }
      ]
    },
    {
      id: 'hotels',
      title: { ar: 'الفنادق', fr: 'Hôtels', en: 'Hotels' },
      icon: '🏨',
      hashtags: [
        { tag: 'SheratonAnnaba', label: '#SheratonAnnaba' },
        { tag: 'SeybouseHotel', label: '#SeybouseHotel' },
        { tag: 'GoldenTulipAnnaba', label: '#GoldenTulipAnnaba' },
        { tag: 'HotelSabri', label: '#HotelSabri' },
        { tag: 'MountazahSeraidi', label: '#MountazahSeraidi' }
      ]
    },
    {
      id: 'food',
      title: { ar: 'الطعام', fr: 'Nourriture', en: 'Food' },
      icon: '🍽️',
      hashtags: [
        { tag: 'AnnabaFood', label: '#AnnabaFood' },
        { tag: 'RestaurantAnnaba', label: '#RestaurantAnnaba' },
        { tag: 'CafeAnnaba', label: '#CafeAnnaba' },
        { tag: 'AlgerianFood', label: '#AlgerianFood' },
        { tag: 'AnnabaEats', label: '#AnnabaEats' }
      ]
    },
    {
      id: 'nature',
      title: { ar: 'الطبيعة', fr: 'Nature', en: 'Nature' },
      icon: '🌲',
      hashtags: [
        { tag: 'Seraidi', label: '#Seraidi' },
        { tag: 'SeraidiAnnaba', label: '#SeraidiAnnaba' },
        { tag: 'EdoughMountain', label: '#EdoughMountain' },
        { tag: 'AnnabaWinter', label: '#AnnabaWinter' },
        { tag: 'AnnabaForest', label: '#AnnabaForest' }
      ]
    },
    {
      id: 'landmarks',
      title: { ar: 'المعالم', fr: 'Monuments', en: 'Landmarks' },
      icon: '⛪',
      hashtags: [
        { tag: 'BasiliqueSaintAugustin', label: '#BasiliqueSaintAugustin' },
        { tag: 'SaintAugustinAnnaba', label: '#SaintAugustinAnnaba' },
        { tag: 'HippoRegius', label: '#HippoRegius' },
        { tag: 'PhareAnnaba', label: '#PhareAnnaba' },
        { tag: 'CoursRevolution', label: '#CoursRevolution' }
      ]
    }
  ];

  const openInstagramHashtag = (hashtag) => {
    window.open(`https://www.instagram.com/explore/tags/${hashtag}/`, '_blank');
  };

  const t = (obj) => obj[language] || obj['en'] || obj['ar'];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] text-white p-6 pb-8">
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all mb-4"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Instagram className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'ar' ? 'استكشف عنابة على انستغرام' : language === 'fr' ? 'Explorez Annaba sur Instagram' : 'Explore Annaba on Instagram'}
            </h1>
            <p className="text-sm opacity-90">
              {language === 'ar' ? 'اكتشف صور حقيقية من الزوار' : language === 'fr' ? 'Découvrez des photos réelles des visiteurs' : 'Discover real photos from visitors'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {categories.map((category, catIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
            data-testid={`category-${category.id}`}
          >
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              {t(category.title)}
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {category.hashtags.map((hashtag, index) => (
                <motion.button
                  key={hashtag.tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: catIndex * 0.1 + index * 0.05 }}
                  onClick={() => openInstagramHashtag(hashtag.tag)}
                  data-testid={`hashtag-${hashtag.tag}`}
                  className="bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 hover:shadow-lg hover:scale-105 transition-all active:scale-95"
                >
                  <Hash className="w-3 h-3" />
                  {hashtag.label.replace('#', '')}
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Info Card */}
        <div className="bg-gradient-to-r from-[#833AB4]/20 to-[#F77737]/20 border-2 border-[#E1306C]/50 rounded-2xl p-4 mt-6">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Instagram className="w-5 h-5 text-[#E1306C]" />
            {language === 'ar' ? 'نصيحة' : language === 'fr' ? 'Conseil' : 'Tip'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? 'انقر على أي هاشتاغ لفتح صفحة انستغرام ومشاهدة صور حقيقية من زوار عنابة. شارك صورك باستخدام هذه الهاشتاغات!' 
              : language === 'fr' 
              ? 'Cliquez sur n\'importe quel hashtag pour ouvrir la page Instagram et voir des photos réelles des visiteurs d\'Annaba. Partagez vos photos avec ces hashtags!' 
              : 'Click any hashtag to open the Instagram page and see real photos from Annaba visitors. Share your photos using these hashtags!'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstagramExplorerPage;
