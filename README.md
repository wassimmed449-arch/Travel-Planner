# Travel Planner Annaba PWA 🌊🏔️

A mobile-first Progressive Web App guide for Annaba, Algeria, created by Wassim.

## Features ✨

### Core Functionality
- **🏠 Home** - Featured places with Wassim's personal tips
- **🗺️ Explore** - Browse 52+ places (beaches, restaurants, cafes, hotels, historical sites)
- **📅 Plans** - Pre-made itineraries (1, 2, 3 days + winter program)
- **🆘 SOS** - Emergency contacts with click-to-call functionality

### Smart Features
- **🤖 Wassim's Bot** - Rule-based chatbot answering questions from book data
- **⭐ Wassim's Advice Badge** - Highlighting specific tips on place cards
- **🎭 Annaba by Mood** - Filter places by: Quiet 🧘, Family 👨‍👩‍👧, Photo 📸, Adventure 🔥
- **❄️ Winter Mode** - Dark theme highlighting Seraidi & waterfalls
- **🚕 Transport Calculator** - Estimate taxi fares (50-150 DA)
- **📍 Map View** - Interactive Leaflet map with all places
- **📸 Annaba Stories** - User-generated content stored in localStorage
- **🌐 Bilingual** - Arabic (RTL) by default, French (LTR) toggle

## Tech Stack 💻

- **Frontend**: React 19, Tailwind CSS, Framer Motion
- **UI Components**: Radix UI, Lucide Icons
- **Map**: React Leaflet, OpenStreetMap
- **State**: React Context (Language, Theme)
- **Storage**: LocalStorage (offline-first, user stories)
- **Routing**: React Router DOM v7

## Design System 🎨

### Colors
- **Primary** (Deep Blue): `hsl(201, 100%, 18%)` - Representing the Mediterranean Sea
- **Secondary** (Forest Green): `hsl(144, 49%, 20%)` - Representing Seraidi forests
- **Accent** (Sand): `hsl(34, 54%, 73%)` - Representing beaches

### Typography
- **Arabic (RTL)**: Tajawal (400, 500, 700, 900)
- **Latin (LTR)**: Outfit (400, 500, 600, 700)

### Layout
- **Mobile-First**: max-w-md container
- **Fixed Bottom Nav**: 4 main sections with icons
- **Glassmorphism**: Backdrop blur cards with border transparency
- **Touch-Friendly**: Minimum 44×44px touch targets

## Data Structure 📊

All data extracted from "Travel Planner Annaba" PDF:
- **12 Beaches** with coordinates, moods, Wassim's tips
- **9 Restaurants** with phones, addresses, cuisine types
- **8 Cafes** with hours, locations
- **7 Hotels** (3-5 stars) with amenities
- **7 Historical Sites** including Hippo Regius, St. Augustine Basilica
- **3 Museums** with visiting hours
- **2 Natural Sites** (Seraidi, Bouizizi)
- **4 Activities** (Farouk Land, Magic Land, Laser Game, Bouna Ball)
- **5 Emergency Contacts** (hospitals, clinics, police)
- **4 Itineraries** with detailed activities

## Offline Capability 🔌

- All place data stored in local `data.js` file
- No backend API calls required for browsing
- User stories saved in browser localStorage
- PWA-ready with manifest.json

## Development 🛠️

```bash
# Install dependencies
cd /app/frontend
yarn install

# Start development server
yarn start

# Build for production
yarn build
```

## Key Pages & Routes 🗺️

- `/` - Home with featured places
- `/explore` - Search & filter all places
- `/plans` - View itineraries
- `/plan/:id` - Detailed itinerary view
- `/sos` - Emergency contacts
- `/place/:id` - Place detail with map integration
- `/bot` - Wassim's chatbot
- `/map` - Interactive map view
- `/transport-calculator` - Taxi fare estimator
- `/about` - About Wassim (author)
- `/stories` - User photo gallery

## Wassim's Philosophy 💭

> "I personally prefer Seraidi in winter over summer. The quietness, the clouds covering the mountains, and the smell of rain in the forest give me an unparalleled sense of peace."

This guide is designed to be a personal companion, not a generic directory. Every recommendation carries Wassim's authentic voice and tested experiences.

## Credits 👏

- **Author**: Wassim (Social worker at CAC, Student at Faculty of Letters & Languages, El Bouni)
- **Design**: Deep Blue/Forest Green theme inspired by Annaba's sea and mountains
- **Data**: Extracted from "Travel Planner Annaba" guidebook
- **Built with**: Emergent AI Platform
