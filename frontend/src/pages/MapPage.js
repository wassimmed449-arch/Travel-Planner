import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ArrowLeft, Navigation, Hotel, Waves, Users, MapPin, ExternalLink, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { allPlaces, beaches } from '../data/placesData';
import { hotelsComplete, recreationalClubs } from '../data/v3EnhancedData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom colored icons
const createColoredIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background: ${color}; 
      width: 32px; 
      height: 32px; 
      border-radius: 50% 50% 50% 0; 
      transform: rotate(-45deg);
      border: 3px solid white; 
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        transform: rotate(45deg);
        color: white;
        font-size: 14px;
        font-weight: bold;
      "></div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const hotelIcon = createColoredIcon('#6366f1'); // Indigo
const beachIcon = createColoredIcon('#0ea5e9'); // Sky blue
const clubIcon = createColoredIcon('#10b981'); // Emerald
const generalIcon = createColoredIcon('#f59e0b'); // Amber

const MapPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const [userLocation, setUserLocation] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const lat = parseFloat(searchParams.get('lat')) || 36.9;
  const lng = parseFloat(searchParams.get('lng')) || 7.76;
  const placeId = searchParams.get('place');

  // Combine all places with coordinates
  const allMapPlaces = [
    ...allPlaces.filter(p => p.coordinates).map(p => ({ ...p, markerType: 'general' })),
    ...hotelsComplete.filter(h => h.coordinates).map(h => ({ ...h, markerType: 'hotel' })),
    ...recreationalClubs.filter(c => c.coordinates).map(c => ({ ...c, markerType: 'club' }))
  ];

  // Remove duplicates by id
  const uniquePlaces = allMapPlaces.reduce((acc, place) => {
    if (!acc.find(p => p.id === place.id)) {
      acc.push(place);
    }
    return acc;
  }, []);

  // Filter places based on active filter
  const filteredPlaces = activeFilter === 'all' 
    ? uniquePlaces 
    : uniquePlaces.filter(p => {
        if (activeFilter === 'hotels') return p.category === 'hotel' || p.markerType === 'hotel';
        if (activeFilter === 'beaches') return p.category === 'beach';
        if (activeFilter === 'clubs') return p.markerType === 'club' || p.category === 'club';
        return true;
      });

  const highlightedPlace = placeId ? uniquePlaces.find(p => p.id === placeId) : null;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  const centerPosition = highlightedPlace 
    ? [highlightedPlace.coordinates[0], highlightedPlace.coordinates[1]]
    : [lat, lng];

  const getMarkerIcon = (place) => {
    if (place.category === 'hotel' || place.markerType === 'hotel') return hotelIcon;
    if (place.category === 'beach') return beachIcon;
    if (place.markerType === 'club' || place.category === 'club') return clubIcon;
    return generalIcon;
  };

  const openGoogleMapsDirections = (place) => {
    const destination = `${place.coordinates[0]},${place.coordinates[1]}`;
    const url = userLocation 
      ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destination}`
      : `https://www.google.com/maps/dir//${destination}`;
    window.open(url, '_blank');
  };

  const filters = [
    { id: 'all', label: { ar: 'الكل', fr: 'Tout', en: 'All' }, icon: MapPin, color: 'bg-primary' },
    { id: 'hotels', label: { ar: 'فنادق', fr: 'Hôtels', en: 'Hotels' }, icon: Hotel, color: 'bg-indigo-500' },
    { id: 'beaches', label: { ar: 'شواطئ', fr: 'Plages', en: 'Beaches' }, icon: Waves, color: 'bg-sky-500' },
    { id: 'clubs', label: { ar: 'نوادي', fr: 'Clubs', en: 'Clubs' }, icon: Users, color: 'bg-emerald-500' }
  ];

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-4 z-50 relative">
        <div className="flex items-center gap-3 mb-3">
          <button 
            onClick={() => navigate(-1)}
            data-testid="back-button"
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {language === 'ar' ? 'الخريطة الذكية' : language === 'fr' ? 'Carte Intelligente' : 'Smart Map'}
            </h1>
            <p className="text-sm opacity-80">
              {filteredPlaces.length} {language === 'ar' ? 'مكان' : language === 'fr' ? 'lieux' : 'places'}
            </p>
          </div>
          {userLocation && (
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
              <Navigation className="w-3 h-3" />
              GPS
            </div>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                data-testid={`filter-${filter.id}`}
                className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter.id 
                    ? 'bg-white text-primary shadow-lg' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t(filter.label)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={centerPosition}
          zoom={highlightedPlace ? 15 : 12}
          style={{ height: '100%', width: '100%' }}
          data-testid="leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredPlaces.map((place) => (
            <Marker
              key={place.id}
              position={[place.coordinates[0], place.coordinates[1]]}
              icon={getMarkerIcon(place)}
            >
              <Popup>
                <div className="p-2 min-w-[220px]">
                  <div className="flex items-start gap-2 mb-2">
                    {place.image && (
                      <img 
                        src={place.image} 
                        alt={t(place.name)}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">{t(place.name)}</h3>
                      {place.stars && (
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(place.stars)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 capitalize">
                        {place.category || place.markerType}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {t(place.description) || t(place.facilities) || ''}
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openGoogleMapsDirections(place)}
                      data-testid={`directions-${place.id}`}
                      className="flex-1 bg-green-600 text-white rounded-lg py-2 px-3 text-xs font-medium hover:bg-green-700 flex items-center justify-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      {language === 'ar' ? 'اتجاهات' : language === 'fr' ? 'Itinéraire' : 'Directions'}
                    </button>
                    <button
                      onClick={() => navigate(`/place/${place.id}`)}
                      className="flex-1 bg-primary text-white rounded-lg py-2 px-3 text-xs font-medium hover:bg-primary/90 flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {language === 'ar' ? 'التفاصيل' : language === 'fr' ? 'Détails' : 'Details'}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* User Location Marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={L.divIcon({
                className: 'custom-user-marker',
                html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(59,130,246,0.5); animation: pulse 2s infinite;"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })}
            >
              <Popup>
                <div className="text-center p-2">
                  <Navigation className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-sm font-bold">
                    {language === 'ar' ? 'موقعك الحالي' : language === 'fr' ? 'Votre position' : 'Your Location'}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-6 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 z-[1000]">
          <p className="text-xs font-bold mb-2">
            {language === 'ar' ? 'دليل الألوان' : language === 'fr' ? 'Légende' : 'Legend'}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span>{language === 'ar' ? 'فنادق' : language === 'fr' ? 'Hôtels' : 'Hotels'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-sky-500"></div>
              <span>{language === 'ar' ? 'شواطئ' : language === 'fr' ? 'Plages' : 'Beaches'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span>{language === 'ar' ? 'نوادي' : language === 'fr' ? 'Clubs' : 'Clubs'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>{language === 'ar' ? 'أخرى' : language === 'fr' ? 'Autres' : 'Others'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Highlighted Place Card */}
      {highlightedPlace && (
        <div className="absolute bottom-24 left-4 right-4 bg-white dark:bg-card rounded-3xl shadow-2xl p-4 z-[1000]">
          <div className="flex items-center gap-3">
            {highlightedPlace.image && (
              <img 
                src={highlightedPlace.image} 
                alt={t(highlightedPlace.name)}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-bold text-lg">{t(highlightedPlace.name)}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {t(highlightedPlace.description) || t(highlightedPlace.facilities) || ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => openGoogleMapsDirections(highlightedPlace)}
              className="flex-1 bg-green-600 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              {language === 'ar' ? 'اتجاهات' : language === 'fr' ? 'Itinéraire' : 'Directions'}
            </button>
            <button
              onClick={() => navigate(`/place/${highlightedPlace.id}`)}
              className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 font-bold"
            >
              {language === 'ar' ? 'فتح' : language === 'fr' ? 'Ouvrir' : 'Open'}
            </button>
          </div>
        </div>
      )}

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>
    </div>
  );
};

export default MapPage;
