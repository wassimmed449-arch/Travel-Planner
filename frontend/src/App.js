import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "@/components/Layout";
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

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
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
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
