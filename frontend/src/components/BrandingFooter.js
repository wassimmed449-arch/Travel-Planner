import React from 'react';
import { Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { wassimAuthor } from '../data/v3EnhancedData';

const BrandingFooter = () => {
  const { language } = useLanguage();

  const openInstagram = () => {
    window.open(wassimAuthor.instagram, '_blank');
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-border/30 py-4 px-6">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
            W
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">
              {language === 'ar' 
                ? 'طُوّر بواسطة وسيم' 
                : language === 'fr' 
                ? 'Développé par Wassim' 
                : 'Developed by Wassim'}
            </p>
            <p className="text-xs text-primary font-bold">{wassimAuthor.brand}</p>
          </div>
        </div>

        <button
          onClick={openInstagram}
          data-testid="footer-instagram"
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-full text-xs font-bold hover:shadow-lg transition-all active:scale-95"
        >
          <Instagram className="w-3.5 h-3.5" />
          <span>@ws_pro_shop</span>
        </button>
      </div>
    </div>
  );
};

export default BrandingFooter;
