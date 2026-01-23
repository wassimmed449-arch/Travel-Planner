import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import BrandingFooter from './BrandingFooter';

const Layout = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="max-w-md mx-auto min-h-screen bg-background shadow-2xl relative overflow-hidden">
        <Outlet />
        <div className="pb-20">
          <BrandingFooter />
        </div>
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
