# Travel Planner Annaba - Product Requirements Document

## Original Problem Statement
Build a high-end, Mobile-First Progressive Web App (PWA) called "Travel Planner Annaba" based on the attached PDF guide book by Benfernane Mohamed Ouassim. The app should be offline-first with Arabic (RTL) by default and French/English toggle.

## Core Tech Stack
- **Frontend**: React, Tailwind CSS, Lucide Icons, Framer Motion
- **Data Storage**: LocalStorage (client-side only - no backend)
- **Maps**: Leaflet.js + OpenStreetMap

## What's Been Implemented (December 2025)

### Phase 1 - Foundation & Monetization ✅
- [x] Mobile-first responsive design with RTL/LTR support
- [x] Trilingual support (Arabic, French, English fallback)
- [x] Winter Mode theme toggle
- [x] Mood-based filtering (quiet, family, photo, adventure)
- [x] Interactive Leaflet map with all places
- [x] Premium Access bundle (500 DA / 6 months)
- [x] BaridiMob manual payment flow
- [x] WhatsApp link: `https://wa.me/213552664037`
- [x] Key activation system with LocalStorage

### Phase 2 - Interactive Features ✅
- [x] **Instagram Explorer** (`/instagram`) - Real hashtag links to Instagram explore pages
  - Categories: General, Beaches, Hotels, Food, Nature, Landmarks
  - Clickable buttons opening `https://www.instagram.com/explore/tags/[hashtag]/`
  
- [x] **Scan & Go** (`/scan-and-go`) - Hacker/tech aesthetic
  - Black background, green text, terminal style
  - Links to external resources from the book
  - Direct WhatsApp contact button

- [x] **Services Page** (`/services`) - Tourism Agencies & Recreational Clubs
  - Tourism agencies with phone numbers (click-to-call)
  - Recreational clubs (diving, horseback, chess)
  - Full details from PDF including pricing and Wassim's tips

- [x] **Taxi Fare Guide** (`/transport-calculator`) - Static fare table
  - 8 common routes with price ranges in DA
  - Duration estimates
  - Bus, cable car, and car rental info
  - Wassim's transport tips

### Bug Fixes & Data Corrections ✅
- [x] Author name corrected to **"Benfernane Mohamed Ouassim"** everywhere
- [x] WhatsApp link fixed to `https://wa.me/213552664037`
- [x] Full biography text from PDF in About page
- [x] Added more hospitals to SOS page (7 total) with real phone numbers
- [x] All hospital/clinic phones are click-to-call (`<a href="tel:...">`)
- [x] Emergency numbers: 14 (Civil Protection), 1548 (Police), 1055 (Gendarmerie)
- [x] Removed Soundscapes feature (user feedback)
- [x] Removed "Favorite Quote" from About page
- [x] Added "Thank You for Using This Guide" closing section
- [x] All React lint errors fixed (useCallback, lazy initialization)

## Removed Features
- ~~Soundscapes~~ (deleted per user feedback)
- ~~Annaba Live community feed~~ (replaced with Instagram Explorer)

## Current File Structure
```
/app/frontend/src/
├── pages/
│   ├── HomePage.js
│   ├── InstagramExplorerPage.js    # NEW - hashtag explorer
│   ├── ScanAndGoPage.js            # NEW - hacker aesthetic links
│   ├── ServicesPage.js             # NEW - agencies & clubs
│   ├── TransportCalculatorPage.js  # UPDATED - static taxi guide
│   ├── SOSPage.js                  # UPDATED - more hospitals
│   ├── AboutPage.js                # UPDATED - no quote, thank you section
│   ├── ShopPage.js
│   ├── DualBotPage.js
│   ├── FoodRoulettePage.js
│   └── BonePassportPage.js
├── data/
│   ├── v3CompleteData.js           # Core texts & scan links
│   ├── v3EnhancedData.js           # Hotels, agencies, clubs
│   └── placesData.js               # All places + emergency contacts
└── utils/
    └── premiumManager.js
```

## Prioritized Backlog

### P1 - High Priority
- [ ] Add PWA Service Worker for offline caching
- [ ] Full "Wassim Super-Bot" implementation
- [ ] Create dedicated History & Introduction content pages

### P2 - Medium Priority
- [ ] Deep hotel/beach details as PREMIUM-ONLY content
- [ ] Add more English translations to placesData.js
- [ ] Add user profile/settings page

### P3 - Future Enhancements
- [ ] Real backend for actual community features
- [ ] Integration with actual BaridiMob API
- [ ] Offline maps download for premium users

## Key Technical Notes
- **No Backend**: All data is client-side via LocalStorage
- **Light Data Free**: Basic descriptions free, deep details reserved for premium
- **Manual Payment**: BaridiMob + WhatsApp receipt flow
- **Instagram Integration**: Opens real Instagram hashtag pages (not fake feed)
- **Click-to-Call**: All phone numbers use `<a href="tel:...">` format

## Testing Status
- ✅ Visual verification via screenshots
- ✅ All lint checks passed
- ✅ All pages loading correctly
