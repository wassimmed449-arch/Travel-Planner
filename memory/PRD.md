# Travel Planner Annaba - Product Requirements Document

## Original Problem Statement
Build a high-end, Mobile-First Progressive Web App (PWA) called "Travel Planner Annaba" based on the attached PDF guide book by Wassim Benfernane. The app should be offline-first with an Arabic (RTL) by default and French/English toggle.

## Core Tech Stack
- **Frontend**: React, Tailwind CSS, Lucide Icons, Framer Motion
- **Data Storage**: LocalStorage (client-side only - no backend)
- **Maps**: Leaflet.js + OpenStreetMap

## User Personas
1. **Tourists** visiting Annaba - need place discovery, itineraries, and local recommendations
2. **Locals** looking for hidden gems and new experiences
3. **Premium users** wanting exclusive content, PDF book, and direct support from Wassim

## What's Been Implemented

### Phase 1 - Foundation & Monetization ✅
**Completed: December 2025**

#### Core Features
- [x] Mobile-first responsive design with RTL/LTR support
- [x] Trilingual support (Arabic, French, English)
- [x] Winter Mode theme toggle
- [x] Mood-based filtering (quiet, family, photo, adventure)
- [x] Interactive Leaflet map with all places

#### Data Layer
- [x] Complete place data (beaches, hotels, restaurants, cafes, historical sites, museums, natural sites)
- [x] Full "About Wassim" biography from the book
- [x] Introduction and History of Annaba texts (trilingual)
- [x] Tourism agencies and recreational clubs data

#### Monetization System
- [x] Premium Access bundle (500 DA / 6 months)
- [x] BaridiMob manual payment flow
- [x] WhatsApp receipt validation link: `https://wa.me/213552664037`
- [x] Key activation system with LocalStorage
- [x] Premium features list and benefits display

#### V3.0 Feature Pages
- [x] **ShopPage** - Premium purchase flow with BaridiMob details
- [x] **DualBotPage** - Free Bot + Premium "Wassim Super-Bot"
- [x] **FoodRoulettePage** - Random food/restaurant selector game
- [x] **BonePassportPage** - Gamification check-in system

### Phase 2 - Interactive Features ✅
**Completed: December 2025**

- [x] **SoundscapesPage** - 6 ambient sounds (Beach Waves, Seraidi Forest, Mountain Wind, Forest Rain, Morning Birds, Night Waves)
  - Audio controls with volume slider
  - Now Playing card with visual feedback
  - Wassim's tip section
  
- [x] **AnnabaLivePage** - Mock community feed
  - Social media style post cards
  - Like/comment/share interactions
  - Create new post with image upload
  - LocalStorage persistence
  - Mock initial posts from "community members"

### Bug Fixes Applied
- [x] Author name corrected to "Benfernane Mohamed Ouassim" everywhere
- [x] WhatsApp link fixed to `https://wa.me/213552664037`
- [x] Full biography text injected from PDF source
- [x] React lint errors fixed (useCallback, lazy initialization)

## Prioritized Backlog

### P1 - High Priority
- [ ] Implement actual audio playback testing across devices
- [ ] Add offline caching with Service Worker for PWA
- [ ] Add "Wassim Super-Bot" premium persona logic
- [ ] Create dedicated History & Introduction content pages

### P2 - Medium Priority  
- [ ] Deep Details for hotels/beaches as PREMIUM-ONLY content
- [ ] Add more soundscapes based on user feedback
- [ ] Implement push notifications for community posts
- [ ] Add user profile/settings page

### P3 - Future Enhancements
- [ ] Real-time community posts (would require backend)
- [ ] Integration with actual BaridiMob API
- [ ] Offline maps download for premium users
- [ ] AI-powered personalized itineraries

## Key Technical Decisions
1. **No Backend**: All data is client-side via LocalStorage for offline-first experience
2. **Light Data for Free**: Basic hotel/beach descriptions free, deep details reserved for premium
3. **Manual Payment**: BaridiMob + WhatsApp receipt flow (no payment gateway integration)
4. **Mock Community**: Annaba Live is simulated with LocalStorage, not real-time

## File Structure
```
/app/frontend/src/
├── components/
│   ├── BottomNav.js
│   ├── BrandingFooter.js
│   └── Layout.js
├── contexts/
│   ├── LanguageContext.js
│   └── ThemeContext.js
├── data/
│   ├── v3CompleteData.js      # Core texts & author info
│   ├── v3EnhancedData.js      # Hotels, agencies, clubs
│   └── placesData.js          # All places + mood categories
├── pages/
│   ├── HomePage.js
│   ├── ExplorePage.js
│   ├── ShopPage.js
│   ├── DualBotPage.js
│   ├── FoodRoulettePage.js
│   ├── BonePassportPage.js
│   ├── SoundscapesPage.js     # NEW - Phase 2
│   ├── AnnabaLivePage.js      # NEW - Phase 2
│   ├── AboutPage.js
│   └── ... (other pages)
├── utils/
│   └── premiumManager.js      # Premium access logic
└── App.js
```

## Testing Status
- ✅ Visual verification via screenshots
- ✅ Lint checks passed
- Manual testing recommended for:
  - Audio playback on mobile devices
  - RTL layout consistency
  - LocalStorage persistence across sessions
