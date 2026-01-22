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
import BotPage from "@/pages/BotPage";
import MapPage from "@/pages/MapPage";
import TransportCalculatorPage from "@/pages/TransportCalculatorPage";
import PlanDetailPage from "@/pages/PlanDetailPage";
import AboutPage from "@/pages/AboutPage";
import StoriesPage from "@/pages/StoriesPage";

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
              <Route path="bot" element={<BotPage />} />
              <Route path="map" element={<MapPage />} />
              <Route path="transport-calculator" element={<TransportCalculatorPage />} />
              <Route path="plan/:id" element={<PlanDetailPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="stories" element={<StoriesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
