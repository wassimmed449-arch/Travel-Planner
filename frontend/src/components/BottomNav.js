import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, Calendar, ShieldAlert } from 'lucide-react';
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
      label: { ar: 'الرئيسية', fr: 'Accueil' },
      testId: 'bottom-nav-home'
    },
    { 
      id: 'explore', 
      path: '/explore', 
      icon: Compass, 
      label: { ar: 'اكتشف', fr: 'Explorer' },
      testId: 'bottom-nav-explore'
    },
    { 
      id: 'plans', 
      path: '/plans', 
      icon: Calendar, 
      label: { ar: 'برامج', fr: 'Plans' },
      testId: 'bottom-nav-plans'
    },
    { 
      id: 'sos', 
      path: '/sos', 
      icon: ShieldAlert, 
      label: { ar: 'طوارئ', fr: 'SOS' },
      testId: 'bottom-nav-sos'
    }
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-t border-border/40 z-50 pb-2"
      data-testid="bottom-navigation"
    >
      <div className="max-w-md mx-auto h-full flex justify-around items-center px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              data-testid={item.testId}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 min-w-[60px] ${
                isActive 
                  ? 'text-primary scale-110' 
                  : 'text-muted-foreground hover:text-primary/70'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>
                {t(item.label)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
