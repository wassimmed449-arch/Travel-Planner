import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Calculate taxi fare based on route
export const calculateTaxiFare = (from, to) => {
  const routes = {
    'centre-seraidi': { min: 70, max: 150 },
    'centre-beach': { min: 50, max: 100 },
    'airport-centre': { min: 100, max: 200 },
    'default': { min: 50, max: 150 }
  };

  const routeKey = `${from}-${to}`.toLowerCase();
  const fare = routes[routeKey] || routes['default'];
  
  return fare;
};

// Get user stories from localStorage
export const getUserStories = () => {
  const stories = localStorage.getItem('annaba_stories');
  return stories ? JSON.parse(stories) : [];
};

// Save user story to localStorage
export const saveUserStory = (story) => {
  const stories = getUserStories();
  const newStory = {
    id: Date.now(),
    ...story,
    date: new Date().toISOString()
  };
  stories.unshift(newStory);
  localStorage.setItem('annaba_stories', JSON.stringify(stories));
  return newStory;
};

// Delete user story
export const deleteUserStory = (id) => {
  const stories = getUserStories();
  const filtered = stories.filter(story => story.id !== id);
  localStorage.setItem('annaba_stories', JSON.stringify(filtered));
};

// Format distance in kilometers
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} م`;
  }
  return `${distance.toFixed(1)} كم`;
};

// Simple distance calculation (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};
