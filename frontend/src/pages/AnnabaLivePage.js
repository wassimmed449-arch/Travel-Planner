import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Heart, MessageCircle, Share2, MapPin, Clock, Plus, X, Image as ImageIcon, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

// LocalStorage key for posts
const POSTS_STORAGE_KEY = 'annaba_live_posts';

// Mock initial posts (simulating community content)
const initialMockPosts = [
  {
    id: '1',
    user: { name: 'Ahmed B.', avatar: '👨‍💼' },
    location: { ar: 'شاطئ عين عشير', fr: 'Plage Ain Achir', en: 'Ain Achir Beach' },
    image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: { 
      ar: 'غروب رائع اليوم! 🌅', 
      fr: 'Superbe coucher de soleil aujourd\'hui! 🌅', 
      en: 'Amazing sunset today! 🌅' 
    },
    likes: 47,
    comments: 8,
    timestamp: Date.now() - 3600000, // 1 hour ago
    isLiked: false
  },
  {
    id: '2',
    user: { name: 'Fatima Z.', avatar: '👩‍🎨' },
    location: { ar: 'سرايدي', fr: 'Seraidi', en: 'Seraidi' },
    image: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: { 
      ar: 'الضباب في سرايدي سحري! ❄️', 
      fr: 'Le brouillard à Seraidi est magique! ❄️', 
      en: 'The fog in Seraidi is magical! ❄️' 
    },
    likes: 89,
    comments: 15,
    timestamp: Date.now() - 7200000, // 2 hours ago
    isLiked: true
  },
  {
    id: '3',
    user: { name: 'Karim M.', avatar: '🧔' },
    location: { ar: 'ساحة الثورة', fr: 'Cours de la Révolution', en: 'Revolution Square' },
    image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: { 
      ar: 'قهوة الصباح في قلب عنابة ☕', 
      fr: 'Café du matin au cœur d\'Annaba ☕', 
      en: 'Morning coffee in the heart of Annaba ☕' 
    },
    likes: 32,
    comments: 5,
    timestamp: Date.now() - 14400000, // 4 hours ago
    isLiked: false
  },
  {
    id: '4',
    user: { name: 'Sara L.', avatar: '👩‍💻' },
    location: { ar: 'فندق سيبوس', fr: 'Hotel Seybouse', en: 'Seybouse Hotel' },
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: { 
      ar: 'إطلالة من الطابق 14 😍', 
      fr: 'Vue du 14ème étage 😍', 
      en: 'View from the 14th floor 😍' 
    },
    likes: 124,
    comments: 22,
    timestamp: Date.now() - 28800000, // 8 hours ago
    isLiked: true
  }
];

const AnnabaLivePage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ caption: '', location: '', image: null });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Load posts from LocalStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with mock posts
      setPosts(initialMockPosts);
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(initialMockPosts));
    }
  }, []);

  // Save posts to LocalStorage whenever they change
  const savePosts = (newPosts) => {
    setPosts(newPosts);
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(newPosts));
  };

  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    });
    savePosts(updatedPosts);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setNewPost(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    if (!newPost.caption.trim()) return;

    const post = {
      id: Date.now().toString(),
      user: { name: language === 'ar' ? 'زائر' : 'Visitor', avatar: '🎒' },
      location: { ar: newPost.location || 'عنابة', fr: newPost.location || 'Annaba', en: newPost.location || 'Annaba' },
      image: newPost.image || 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=600',
      caption: { ar: newPost.caption, fr: newPost.caption, en: newPost.caption },
      likes: 0,
      comments: 0,
      timestamp: Date.now(),
      isLiked: false
    };

    savePosts([post, ...posts]);
    setNewPost({ caption: '', location: '', image: null });
    setPreviewImage(null);
    setShowNewPostModal(false);
  };

  const formatTimeAgo = useCallback((timestamp) => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    
    if (seconds < 60) return language === 'ar' ? 'الآن' : language === 'fr' ? 'Maintenant' : 'Just now';
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      return language === 'ar' ? `منذ ${mins} دقيقة` : language === 'fr' ? `Il y a ${mins} min` : `${mins}m ago`;
    }
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return language === 'ar' ? `منذ ${hours} ساعة` : language === 'fr' ? `Il y a ${hours}h` : `${hours}h ago`;
    }
    const days = Math.floor(seconds / 86400);
    return language === 'ar' ? `منذ ${days} يوم` : language === 'fr' ? `Il y a ${days}j` : `${days}d ago`;
  }, [language]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              data-testid="back-button"
              className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-all"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <div>
              <h1 className="text-xl font-bold">
                {language === 'ar' ? 'عنابة لايف 📸' : language === 'fr' ? 'Annaba Live 📸' : 'Annaba Live 📸'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'شارك لحظاتك' : language === 'fr' ? 'Partagez vos moments' : 'Share your moments'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowNewPostModal(true)}
            data-testid="new-post-button"
            className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="divide-y divide-border/50">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card"
            data-testid={`post-${post.id}`}
          >
            {/* Post Header */}
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-xl">
                {post.user.avatar}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{post.user.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{t(post.location)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(post.timestamp)}</span>
              </div>
            </div>

            {/* Post Image */}
            <div className="relative aspect-square bg-muted">
              <img 
                src={post.image} 
                alt={t(post.caption)}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <button
                  onClick={() => handleLike(post.id)}
                  data-testid={`like-${post.id}`}
                  className={`flex items-center gap-1 transition-all ${
                    post.isLiked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-all">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-all ml-auto">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Caption */}
              <p className="text-sm">
                <span className="font-bold mr-2">{post.user.name}</span>
                {t(post.caption)}
              </p>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Camera className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold mb-2">
            {language === 'ar' ? 'لا توجد منشورات بعد' : language === 'fr' ? 'Pas encore de publications' : 'No posts yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {language === 'ar' ? 'كن أول من يشارك لحظة!' : language === 'fr' ? 'Soyez le premier à partager un moment!' : 'Be the first to share a moment!'}
          </p>
          <button
            onClick={() => setShowNewPostModal(true)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold"
          >
            {language === 'ar' ? 'إنشاء منشور' : language === 'fr' ? 'Créer un post' : 'Create Post'}
          </button>
        </div>
      )}

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
            onClick={() => setShowNewPostModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
              data-testid="new-post-modal"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {language === 'ar' ? 'منشور جديد' : language === 'fr' ? 'Nouveau post' : 'New Post'}
                </h2>
                <button
                  onClick={() => {
                    setShowNewPostModal(false);
                    setPreviewImage(null);
                    setNewPost({ caption: '', location: '', image: null });
                  }}
                  className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image Upload */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-video bg-muted rounded-2xl overflow-hidden cursor-pointer hover:bg-muted/80 transition-all"
                >
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <p className="text-sm">
                        {language === 'ar' ? 'اضغط لإضافة صورة' : language === 'fr' ? 'Appuyez pour ajouter une photo' : 'Tap to add photo'}
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    data-testid="image-input"
                  />
                </div>

                {/* Location Input */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    {language === 'ar' ? 'الموقع' : language === 'fr' ? 'Lieu' : 'Location'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={newPost.location}
                      onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
                      placeholder={language === 'ar' ? 'أين أنت؟' : language === 'fr' ? 'Où êtes-vous?' : 'Where are you?'}
                      data-testid="location-input"
                      className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Caption Input */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    {language === 'ar' ? 'التعليق' : language === 'fr' ? 'Légende' : 'Caption'}
                  </label>
                  <textarea
                    value={newPost.caption}
                    onChange={(e) => setNewPost(prev => ({ ...prev, caption: e.target.value }))}
                    placeholder={language === 'ar' ? 'شارك تجربتك...' : language === 'fr' ? 'Partagez votre expérience...' : 'Share your experience...'}
                    rows={3}
                    data-testid="caption-input"
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitPost}
                  disabled={!newPost.caption.trim()}
                  data-testid="submit-post-button"
                  className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {language === 'ar' ? 'نشر' : language === 'fr' ? 'Publier' : 'Post'}
                </button>
              </div>

              {/* Info */}
              <p className="text-xs text-muted-foreground text-center mt-4">
                {language === 'ar' 
                  ? '📱 منشوراتك محفوظة محلياً على جهازك' 
                  : language === 'fr' 
                  ? '📱 Vos posts sont sauvegardés localement sur votre appareil' 
                  : '📱 Your posts are saved locally on your device'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnnabaLivePage;
