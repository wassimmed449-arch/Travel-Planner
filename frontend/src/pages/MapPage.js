import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ArrowLeft, Navigation } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { allPlaces } from '../data/placesData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const [userLocation, setUserLocation] = useState(null);

  const lat = parseFloat(searchParams.get('lat')) || 36.9;
  const lng = parseFloat(searchParams.get('lng')) || 7.76;
  const placeId = searchParams.get('place');

  const placesWithCoords = allPlaces.filter(p => p.coordinates);
  const highlightedPlace = placeId ? placesWithCoords.find(p => p.id === placeId) : null;

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

  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3 z-50 relative">
        <button 
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>
        <div>
          <h1 className="text-xl font-bold">
            {language === 'ar' ? 'خريطة عنابة' : 'Carte d\'Annaba'}
          </h1>
          <p className="text-sm opacity-80">
            {placesWithCoords.length} {language === 'ar' ? 'مكان' : 'lieux'}
          </p>
        </div>
      </div>

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

          {placesWithCoords.map((place) => (
            <Marker
              key={place.id}
              position={[place.coordinates[0], place.coordinates[1]]}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-sm mb-1">{t(place.name)}</h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {t(place.description) || t(place.type)}
                  </p>
                  <button
                    onClick={() => navigate(`/place/${place.id}`)}
                    className="w-full bg-blue-600 text-white rounded-lg py-1 px-2 text-xs font-medium hover:bg-blue-700"
                  >
                    {language === 'ar' ? 'عرض التفاصيل' : 'Voir Détails'}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={L.divIcon({
                className: 'custom-user-marker',
                html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })}
            >
              <Popup>
                <div className="text-center p-2">
                  <Navigation className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs font-bold">
                    {language === 'ar' ? 'موقعك' : 'Votre position'}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {highlightedPlace && (
        <div className="absolute bottom-6 left-6 right-6 bg-white dark:bg-card rounded-3xl shadow-2xl p-4 z-50">
          <div className="flex items-center gap-3">
            <img 
              src={highlightedPlace.image} 
              alt={t(highlightedPlace.name)}
              className="w-16 h-16 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold">{t(highlightedPlace.name)}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {t(highlightedPlace.description) || t(highlightedPlace.type)}
              </p>
            </div>
            <button
              onClick={() => navigate(`/place/${highlightedPlace.id}`)}
              className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-bold"
            >
              {language === 'ar' ? 'فتح' : 'Ouvrir'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
