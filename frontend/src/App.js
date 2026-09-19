import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import MagicLinkActivator from "@/components/MagicLinkActivator";
import PremiumManager from "@/utils/premiumManager";
import HomePage from "@/pages/HomePage";
import ExplorePage from "@/pages/ExplorePage";
import PlansPage from "@/pages/PlansPage";
import SOSPage from "@/pages/SOSPage";
import PlaceDetailPage from "@/pages/PlaceDetailPage";
import MapPage from "@/pages/MapPage";
import TransportCalculatorPage from "@/pages/TransportCalculatorPage";
import PlanDetailPage from "@/pages/PlanDetailPage";
import AboutPage from "@/pages/AboutPage";
import StoriesPage from "@/pages/StoriesPage";

// V3.0 NEW PAGES
import ShopPage from "@/pages/ShopPage";
import DualBotPage from "@/pages/DualBotPage";
import FoodRoulettePage from "@/pages/FoodRoulettePage";
import BonePassportPage from "@/pages/BonePassportPage";
import InstagramExplorerPage from "@/pages/InstagramExplorerPage";
import ScanAndGoPage from "@/pages/ScanAndGoPage";
import ServicesPage from "@/pages/ServicesPage";
import HistoryPage from "@/pages/HistoryPage";
import IntroductionPage from "@/pages/IntroductionPage";
import WassimAIPage from "@/pages/WassimAIPage";

function App() {
  useEffect(() => {
    // Resync the local premium cache with the backend once per app load
    // (Phase 2: the backend is now the source of truth, not the local key
    // list). Page-level isPremiumActive() reads stay synchronous/cached for
    // instant UI - this just keeps that cache honest, e.g. clearing it if a
    // key gets revoked server-side.
    PremiumManager.refreshPremiumStatus();
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
          {/* Scroll to top on route change */}
          <ScrollToTop />
          
          {/* Magic Link Premium Activation */}
          <MagicLinkActivator />
          
          {/* Toast notifications */}
          <Toaster position="top-center" richColors />
          
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="plans" element={<PlansPage />} />
              <Route path="sos" element={<SOSPage />} />
              <Route path="place/:id" element={<PlaceDetailPage />} />
              <Route path="map" element={<MapPage />} />
              <Route path="transport-calculator" element={<TransportCalculatorPage />} />
              <Route path="plan/:id" element={<PlanDetailPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="stories" element={<StoriesPage />} />
              
              {/* V3.0 NEW ROUTES */}
              <Route path="shop" element={<ShopPage />} />
              <Route path="bot" element={<DualBotPage />} />
              <Route path="food-roulette" element={<FoodRoulettePage />} />
              <Route path="passport" element={<BonePassportPage />} />
              <Route path="instagram" element={<InstagramExplorerPage />} />
              <Route path="scan-and-go" element={<ScanAndGoPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="introduction" element={<IntroductionPage />} />
              <Route path="wassim-ai" element={<WassimAIPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
