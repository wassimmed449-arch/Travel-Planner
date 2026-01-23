import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, Calendar, ShieldAlert, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { 
      id: 'home', 
      path: '/', 
      icon: Home, 
      label: { ar: 'الرئيسية', fr: 'Accueil', en: 'Home' },
      testId: 'bottom-nav-home'
    },
    { 
      id: 'explore', 
      path: '/explore', 
      icon: Compass, 
      label: { ar: 'اكتشف', fr: 'Explorer', en: 'Explore' },
      testId: 'bottom-nav-explore'
    },
    { 
      id: 'shop', 
      path: '/shop', 
      icon: ShoppingBag, 
      label: { ar: 'المتجر', fr: 'Shop', en: 'Shop' },
      testId: 'bottom-nav-shop',
      badge: '🔥'
    },
    { 
      id: 'plans', 
      path: '/plans', 
      icon: Calendar, 
      label: { ar: 'برامج', fr: 'Plans', en: 'Plans' },
      testId: 'bottom-nav-plans'
    },
    { 
      id: 'sos', 
      path: '/sos', 
      icon: ShieldAlert, 
      label: { ar: 'طوارئ', fr: 'SOS', en: 'SOS' },
      testId: 'bottom-nav-sos'
    }
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 h-20 bg-background/95 backdrop-blur-xl border-t border-border/40 z-50 pb-2"
      data-testid="bottom-navigation"
    >
      <div className="max-w-md mx-auto h-full flex justify-around items-center px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              data-testid={item.testId}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 min-w-[60px] relative ${
                isActive 
                  ? 'text-primary scale-110' 
                  : 'text-muted-foreground hover:text-primary/70'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>
                {t(item.label)}
              </span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 text-xs animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
