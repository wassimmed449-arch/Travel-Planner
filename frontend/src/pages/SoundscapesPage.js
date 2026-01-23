import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Play, Pause, Waves, Mountain, TreePine, Wind, Droplets, Bird } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const SoundscapesPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [activeSound, setActiveSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);

  // Soundscape data with free ambient audio URLs
  const soundscapes = [
    {
      id: 'beach-waves',
      name: { ar: 'أمواج الشاطئ', fr: 'Vagues de plage', en: 'Beach Waves' },
      description: { 
        ar: 'استرخِ مع صوت أمواج البحر المتوسط على شواطئ عنابة', 
        fr: 'Détendez-vous avec le son des vagues méditerranéennes sur les plages d\'Annaba',
        en: 'Relax with the sound of Mediterranean waves on Annaba beaches'
      },
      icon: Waves,
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-500/20',
      location: { ar: 'شواطئ عنابة', fr: 'Plages d\'Annaba', en: 'Annaba Beaches' },
      // Using a placeholder audio URL - in production, use actual ambient sound files
      audioUrl: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3'
    },
    {
      id: 'seraidi-forest',
      name: { ar: 'غابة سرايدي', fr: 'Forêt de Seraidi', en: 'Seraidi Forest' },
      description: { 
        ar: 'أصوات الطبيعة من غابات سرايدي الخضراء', 
        fr: 'Sons de la nature des forêts vertes de Seraidi',
        en: 'Nature sounds from Seraidi\'s green forests'
      },
      icon: TreePine,
      color: 'from-green-600 to-emerald-400',
      bgColor: 'bg-green-500/20',
      location: { ar: 'سرايدي', fr: 'Seraidi', en: 'Seraidi' },
      audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2377/2377-preview.mp3'
    },
    {
      id: 'mountain-wind',
      name: { ar: 'رياح الجبال', fr: 'Vent des montagnes', en: 'Mountain Wind' },
      description: { 
        ar: 'نسيم جبال إدوغ الهادئ', 
        fr: 'La brise tranquille des montagnes d\'Edough',
        en: 'The peaceful breeze of Edough mountains'
      },
      icon: Wind,
      color: 'from-slate-500 to-gray-400',
      bgColor: 'bg-slate-500/20',
      location: { ar: 'جبال إدوغ', fr: 'Montagnes d\'Edough', en: 'Edough Mountains' },
      audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2510/2510-preview.mp3'
    },
    {
      id: 'rain-forest',
      name: { ar: 'مطر الغابة', fr: 'Pluie de forêt', en: 'Forest Rain' },
      description: { 
        ar: 'صوت المطر في غابات عنابة - مثالي للاسترخاء', 
        fr: 'Son de la pluie dans les forêts d\'Annaba - parfait pour la détente',
        en: 'Rain sounds in Annaba forests - perfect for relaxation'
      },
      icon: Droplets,
      color: 'from-indigo-500 to-purple-400',
      bgColor: 'bg-indigo-500/20',
      location: { ar: 'غابات عنابة', fr: 'Forêts d\'Annaba', en: 'Annaba Forests' },
      audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3'
    },
    {
      id: 'birds-morning',
      name: { ar: 'طيور الصباح', fr: 'Oiseaux du matin', en: 'Morning Birds' },
      description: { 
        ar: 'تغريد الطيور في صباح عنابي جميل', 
        fr: 'Chants d\'oiseaux dans une belle matinée d\'Annaba',
        en: 'Bird songs on a beautiful Annaba morning'
      },
      icon: Bird,
      color: 'from-amber-500 to-yellow-400',
      bgColor: 'bg-amber-500/20',
      location: { ar: 'حدائق عنابة', fr: 'Jardins d\'Annaba', en: 'Annaba Gardens' },
      audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2428/2428-preview.mp3'
    },
    {
      id: 'night-waves',
      name: { ar: 'أمواج الليل', fr: 'Vagues nocturnes', en: 'Night Waves' },
      description: { 
        ar: 'صوت البحر في ليل عنابي هادئ', 
        fr: 'Son de la mer dans une nuit calme d\'Annaba',
        en: 'Sea sounds on a calm Annaba night'
      },
      icon: Mountain,
      color: 'from-violet-600 to-purple-500',
      bgColor: 'bg-violet-500/20',
      location: { ar: 'كورنيش عنابة', fr: 'Corniche d\'Annaba', en: 'Annaba Corniche' },
      audioUrl: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3'
    }
  ];

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSoundSelect = (sound) => {
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (activeSound?.id === sound.id && isPlaying) {
      // Toggle off if same sound is playing
      setIsPlaying(false);
      setActiveSound(null);
    } else {
      // Play new sound
      setActiveSound(sound);
      audioRef.current = new Audio(sound.audioUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !activeSound) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary via-primary to-secondary text-white p-6 pb-12">
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all mb-4"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Volume2 className="w-10 h-10" />
          <div>
            <h1 className="text-3xl font-bold">
              {language === 'ar' ? 'أصوات عنابة' : language === 'fr' ? 'Sons d\'Annaba' : 'Annaba Soundscapes'}
            </h1>
            <p className="text-sm opacity-90">
              {language === 'ar' ? 'استرخِ مع أصوات المدينة الطبيعية' : language === 'fr' ? 'Détendez-vous avec les sons naturels de la ville' : 'Relax with the city\'s natural sounds'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 space-y-6">
        {/* Now Playing Card */}
        <AnimatePresence>
          {activeSound && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`bg-gradient-to-r ${activeSound.color} rounded-3xl p-6 shadow-2xl text-white`}
              data-testid="now-playing-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm opacity-80">
                    {language === 'ar' ? 'يعمل الآن' : language === 'fr' ? 'En cours' : 'Now Playing'}
                  </p>
                  <h2 className="text-2xl font-bold">{t(activeSound.name)}</h2>
                  <p className="text-sm opacity-80">{t(activeSound.location)}</p>
                </div>
                <button
                  onClick={togglePlayPause}
                  data-testid="play-pause-button"
                  className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7" />
                  ) : (
                    <Play className="w-7 h-7 ml-1" />
                  )}
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <VolumeX className="w-5 h-5 opacity-70" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  data-testid="volume-slider"
                  className="flex-1 h-2 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
                <Volume2 className="w-5 h-5 opacity-70" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Soundscapes Grid */}
        <div>
          <h3 className="text-xl font-bold mb-4">
            {language === 'ar' ? 'اختر صوتاً' : language === 'fr' ? 'Choisissez un son' : 'Choose a Sound'}
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {soundscapes.map((sound, index) => {
              const Icon = sound.icon;
              const isActive = activeSound?.id === sound.id;
              
              return (
                <motion.button
                  key={sound.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSoundSelect(sound)}
                  data-testid={`soundscape-${sound.id}`}
                  className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all ${
                    isActive 
                      ? `bg-gradient-to-br ${sound.color} text-white shadow-lg scale-[1.02]` 
                      : `${sound.bgColor} border border-border/50 hover:scale-[1.02]`
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-white/20' : 'bg-white/50'
                    }`}>
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{t(sound.name)}</h4>
                      <p className={`text-xs ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {t(sound.location)}
                      </p>
                    </div>
                  </div>
                  
                  {isActive && isPlaying && (
                    <div className="absolute top-3 right-3">
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                        <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                        <div className="w-1 h-5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 border-2 border-secondary/50 rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-2">
            {language === 'ar' ? '🎧 نصيحة وسيم' : language === 'fr' ? '🎧 Conseil de Wassim' : '🎧 Wassim\'s Tip'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? 'أفضل شخصياً صوت "غابة سرايدي" للتركيز أثناء العمل، و"أمواج الليل" قبل النوم. جربها مع سماعات لتجربة أفضل!' 
              : language === 'fr' 
              ? 'Je préfère personnellement le son "Forêt de Seraidi" pour me concentrer au travail, et "Vagues nocturnes" avant de dormir. Essayez-les avec des écouteurs pour une meilleure expérience!' 
              : 'I personally prefer "Seraidi Forest" sound for focus while working, and "Night Waves" before sleep. Try them with headphones for a better experience!'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SoundscapesPage;
