import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { allPlaces, moodCategories, searchPlaces, filterByMood } from '../data/placesData';
import { motion } from 'framer-motion';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMood, setSelectedMood] = useState(searchParams.get('mood') || '');

  const categories = [
    { id: 'all', name: { ar: 'الكل', fr: 'Tout' } },
    { id: 'beach', name: { ar: 'شواطئ', fr: 'Plages' } },
    { id: 'restaurant', name: { ar: 'مطاعم', fr: 'Restaurants' } },
    { id: 'cafe', name: { ar: 'مقاهي', fr: 'Cafés' } },
    { id: 'hotel', name: { ar: 'فنادق', fr: 'Hôtels' } },
    { id: 'historical', name: { ar: 'تاريخية', fr: 'Historiques' } },
    { id: 'museum', name: { ar: 'متاحف', fr: 'Musées' } },
    { id: 'nature', name: { ar: 'طبيعة', fr: 'Nature' } },
    { id: 'activity', name: { ar: 'أنشطة', fr: 'Activités' } }
  ];

  const filteredPlaces = useMemo(() => {
    let places = allPlaces;

    if (searchQuery) {
      places = searchPlaces(searchQuery, language);
    }

    if (selectedCategory !== 'all') {
      places = places.filter(p => p.category === selectedCategory);
    }

    if (selectedMood) {
      places = places.filter(p => p.mood?.includes(selectedMood));
    }

    return places;
  }, [searchQuery, selectedCategory, selectedMood, language]);

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 p-6 space-y-4">
        <h1 className="text-3xl font-bold">
          {language === 'ar' ? 'استكشف عنابة' : 'Explorer Annaba'}
        </h1>

        <div className="relative">
          <Search className="absolute top-1/2 start-4 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={language === 'ar' ? 'ابحث عن مكان...' : 'Rechercher un lieu...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="search-input"
            className="w-full ps-12 pe-4 py-3 bg-muted rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              data-testid={`category-${cat.id}`}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {t(cat.name)}
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm">
              {language === 'ar' ? 'تصفية حسب: ' : 'Filtré par: '}
              {t(moodCategories.find(m => m.id === selectedMood)?.name)}
            </span>
            <button 
              onClick={() => setSelectedMood('')}
              data-testid="clear-mood-filter"
              className="text-xs text-primary underline"
            >
              {language === 'ar' ? 'مسح' : 'Effacer'}
            </button>
          </div>
        )}
      </div>

      <div className="px-6 py-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          {filteredPlaces.length} {language === 'ar' ? 'نتيجة' : 'résultat(s)'}
        </p>

        {filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === 'ar' ? 'لم يتم العثور على نتائج' : 'Aucun résultat trouvé'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlaces.map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/place/${place.id}`)}
                data-testid={`place-item-${place.id}`}
                className="flex gap-4 bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="relative w-32 h-32 flex-shrink-0">
                  <img 
                    src={place.image} 
                    alt={t(place.name)}
                    className="w-full h-full object-cover"
                  />
                  {place.wassimTip && (
                    <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐
                    </div>
                  )}
                </div>

                <div className="flex-1 py-4 pe-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{t(place.name)}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {t(place.description) || t(place.type)}
                  </p>
                  
                  {place.mood && (
                    <div className="flex gap-1 flex-wrap">
                      {place.mood.slice(0, 3).map((mood) => {
                        const moodObj = moodCategories.find(m => m.id === mood);
                        return (
                          <span key={mood} className="text-xs px-2 py-1 bg-muted rounded-full">
                            {moodObj?.icon}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
