import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getUserStories, saveUserStory, deleteUserStory } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

const StoriesPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  // Use lazy initialization
  const [stories, setStories] = useState(() => getUserStories());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStory, setNewStory] = useState({ title: '', description: '', imageUrl: '' });

  const loadStories = useCallback(() => {
    const loaded = getUserStories();
    setStories(loaded);
  }, []);

  const handleAddStory = () => {
    if (!newStory.title.trim()) return;

    saveUserStory(newStory);
    setNewStory({ title: '', description: '', imageUrl: '' });
    setShowAddForm(false);
    loadStories();
  };

  const handleDelete = (id) => {
    if (window.confirm(language === 'ar' ? 'هل تريد حذف هذه القصة؟' : 'Voulez-vous supprimer cette histoire ?')) {
      deleteUserStory(id);
      loadStories();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {language === 'ar' ? 'قصص عنابة 📸' : 'Histoires d\'Annaba 📸'}
          </h1>
          <p className="text-sm opacity-90">
            {language === 'ar' ? 'مشاركاتك وذكرياتك' : 'Vos partages et souvenirs'}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          data-testid="add-story-button"
          className="w-full bg-secondary text-secondary-foreground rounded-2xl p-4 font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          {language === 'ar' ? 'إضافة قصة جديدة' : 'Ajouter une Nouvelle Histoire'}
        </button>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card border border-border/50 rounded-3xl p-6 space-y-4"
            >
              <input
                type="text"
                placeholder={language === 'ar' ? 'عنوان القصة...' : 'Titre de l\'histoire...'}
                value={newStory.title}
                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                data-testid="story-title-input"
                className="w-full px-4 py-3 bg-muted rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <textarea
                placeholder={language === 'ar' ? 'وصف القصة...' : 'Description...'}
                value={newStory.description}
                onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                data-testid="story-description-input"
                rows={4}
                className="w-full px-4 py-3 bg-muted rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />

              <input
                type="url"
                placeholder={language === 'ar' ? 'رابط الصورة (اختياري)' : 'URL de l\'image (optionnel)'}
                value={newStory.imageUrl}
                onChange={(e) => setNewStory({ ...newStory, imageUrl: e.target.value })}
                data-testid="story-image-input"
                className="w-full px-4 py-3 bg-muted rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleAddStory}
                  data-testid="save-story-button"
                  className="flex-1 bg-primary text-primary-foreground rounded-2xl py-3 font-bold hover:shadow-lg transition-all"
                >
                  {language === 'ar' ? 'حفظ' : 'Enregistrer'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewStory({ title: '', description: '', imageUrl: '' });
                  }}
                  className="px-6 bg-muted rounded-2xl py-3 font-bold hover:shadow-lg transition-all"
                >
                  {language === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {stories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold mb-2">
              {language === 'ar' ? 'لا توجد قصص بعد' : 'Aucune Histoire Encore'}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'شارك ذكرياتك وتجاربك في عنابة!' 
                : 'Partagez vos souvenirs et expériences à Annaba !'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-md transition-all"
                data-testid={`story-${story.id}`}
              >
                {story.imageUrl && (
                  <img 
                    src={story.imageUrl} 
                    alt={story.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold flex-1">{story.title}</h3>
                    <button
                      onClick={() => handleDelete(story.id)}
                      data-testid={`delete-story-${story.id}`}
                      className="w-8 h-8 bg-destructive/10 text-destructive rounded-full flex items-center justify-center hover:bg-destructive/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {story.description && (
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {story.description}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {new Date(story.date).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="bg-accent/20 border-2 border-accent/50 rounded-2xl p-4">
          <p className="text-sm text-center">
            {language === 'ar' 
              ? '💡 قصصك محفوظة محلياً في متصفحك' 
              : '💡 Vos histoires sont enregistrées localement dans votre navigateur'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoriesPage;
