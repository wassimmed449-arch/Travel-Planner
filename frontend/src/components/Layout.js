import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="max-w-md mx-auto min-h-screen bg-background shadow-2xl relative overflow-hidden pb-24">
        <Outlet />
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
