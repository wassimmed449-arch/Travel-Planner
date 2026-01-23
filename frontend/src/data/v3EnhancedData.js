// ================================================================================================
// ANNABA TRAVEL GUIDE V3.0 ULTIMATE - COMPLETE DATA (PHASE 1)
// All data extracted from "Travel Planner Annaba" PDF by Wassim Ben Fernan
// ================================================================================================

import { completeTexts, wassimAuthor, scanAndGoLinks } from './v3CompleteData';

// ==================== HOTELS (COMPLETE WITH ALL DETAILS) ====================

export const hotelsComplete = [
  {
    id: 'sheraton-annaba',
    name: { ar: 'شيراتون عنابة', fr: 'Sheraton Annaba Hotel', en: 'Sheraton Annaba Hotel' },
    category: 'hotel',
    stars: 5,
    phone: '+213 38452000',
    email: 'marriott.com',
    address: { ar: 'بوليفارد فيكتور هوجو، عنابة', fr: 'Boulevard Victor Hugo, Annaba', en: 'Boulevard Victor Hugo, Annaba' },
    facilities: { 
      ar: 'فخامة، فندق أجنحة، غرف واسعة بإطلالات على وسط المدينة وميناء عنابة، مطعمان، مسبح خارجي، غرف مؤتمرات، وخدمات أعمال كاملة',
      fr: 'Luxe, suite hôtel, chambres spacieuses avec vues sur le centre-ville et le port d\'Annaba, deux restaurants, piscine extérieure, salles de conférence, et services d\'affaires complets',
      en: 'Luxury, suite hotel, spacious rooms with city center and Annaba port views, two restaurants, outdoor pool, conference rooms, and complete business services'
    },
    whyChoose: { 
      ar: 'خيار ممتاز لرجال الأعمال والعائلات الباحثة عن راحة عالية. موقع مركزي قرب الكورنيش، مرافق حديثة، وخيارات طعام راقية',
      fr: 'Excellent choix pour les hommes d\'affaires et les familles recherchant un grand confort. Emplacement central près de la Corniche, installations modernes, et options de restauration haut de gamme',
      en: 'Excellent choice for businessmen and families seeking high comfort. Central location near the Corniche, modern facilities, and upscale dining options'
    },
    wassimTip: { 
      ar: 'نصيحة سريعة: اطلب غرفة في الطوابق العليا لإطلالة أفضل على البحر/الميناء',
      fr: 'Conseil rapide: Demandez une chambre aux étages supérieurs pour une meilleure vue sur la mer/port',
      en: 'Quick tip: Request a room on the upper floors for a better sea/port view'
    },
    coordinates: [36.9000, 7.7620],
    mood: ['family', 'photo'],
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'golden-tulip-sabri',
    name: { ar: 'جولدن توليب سابري / فندق سابري', fr: 'Golden Tulip Sabri / Hotel Sabri', en: 'Golden Tulip Sabri / Hotel Sabri' },
    category: 'hotel',
    stars: 4,
    website: 'goldentulip.com',
    address: { ar: 'منطقة سابري / الكورنيش السياحي، عنابة', fr: 'Zone Sabri / Corniche touristique, Annaba', en: 'Sabri area / Tourist Corniche, Annaba' },
    facilities: { 
      ar: 'منتجع، فندق 4 نجوم على الكورنيش السياحي، غرف وإطلالات بحرية، مرافق للفعاليات، وبرامج عائلية',
      fr: 'Resort, hôtel 4 étoiles sur la Corniche touristique, chambres et vues mer, installations pour événements, et programmes familiaux',
      en: 'Resort, 4-star hotel on tourist Corniche, rooms and sea views, event facilities, and family programs'
    },
    whyChoose: { 
      ar: 'مناسب لمن يريد توازن الموقع والخدمة. فندق مناسب للعائلات أو من يريد البقاء قرب الشاطئ دون دفع سعر 5 نجوم',
      fr: 'Convient à ceux qui veulent un équilibre entre emplacement et service. Hôtel adapté aux familles ou à ceux qui veulent rester près de la plage sans payer un prix 5 étoiles',
      en: 'Suitable for those who want a balance of location and service. Hotel suitable for families or those who want to stay close to the beach without paying a 5-star price'
    },
    coordinates: [36.8600, 7.7100],
    mood: ['family', 'photo'],
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'hotel-orient',
    name: { ar: 'هوتيل دوريان', fr: 'Hôtel d\'Orient', en: 'Hôtel d\'Orient' },
    category: 'hotel',
    stars: 4,
    phone: '+213 64 38 21 07',
    website: 'hotel-dorient-annaba-82.webself.net',
    address: { ar: 'ساحة الثورة، عنابة', fr: 'Cours de la Révolution, Annaba', en: 'Cours de la Révolution, Annaba' },
    facilities: { 
      ar: 'فندق في قلب المدينة (ساحة الثورة). يقدم خدمات استقبال جيدة وإفطار صباحي',
      fr: 'Hôtel au cœur de la ville (Cours de la Révolution). Offre de bons services de réception et un petit-déjeuner matinal',
      en: 'Hotel in the heart of the city (Cours de la Révolution). Offers good reception services and morning breakfast'
    },
    whyChoose: { 
      ar: 'خيار عملي لمن يريد التجول في وسط المدينة وزيارة المواقع التاريخية',
      fr: 'Choix pratique pour ceux qui veulent se promener dans le centre-ville et visiter les sites historiques',
      en: 'Practical choice for those who want to walk around the city center and visit historical sites'
    },
    coordinates: [36.9010, 7.7640],
    mood: ['family'],
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'montazah-seraidi',
    name: { ar: 'فندق المنتزه سرايدي', fr: 'Hotel El Mountazah', en: 'Hotel El Mountazah' },
    category: 'hotel',
    stars: 4,
    phone: '038473560',
    email: 'HOTELMOUNTAZAH@GMAIL.COM',
    website: 'booking.com',
    address: { ar: 'سرايدي، إطلالة على البحر', fr: 'Seraidi, vue sur la mer', en: 'Seraidi, sea view' },
    facilities: { 
      ar: 'تحفة معمارية بنيت في الستينات، صممها فرناند بويون',
      fr: 'Chef-d\'œuvre architectural construit dans les années soixante, conçu par Fernand Bouillon',
      en: 'Architectural masterpiece built in the sixties, designed by Fernand Bouillon'
    },
    whyChoose: { 
      ar: 'معمار رائع وإطلالة خلابة',
      fr: 'Architecture magnifique et vue imprenable',
      en: 'Magnificent architecture and stunning view'
    },
    wassimTip: { 
      ar: 'الأسعار تختلف حسب التواريخ ونوع الغرفة',
      fr: 'Les prix varient selon les dates et le type de chambre',
      en: 'Prices vary depending on dates and room type'
    },
    coordinates: [36.8350, 7.6850],
    mood: ['photo', 'quiet'],
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'sebous-international',
    name: { ar: 'فندق سيبوس إنترناشيونال', fr: 'Hotel Seybouse International', en: 'Hotel Seybouse International' },
    category: 'hotel',
    stars: 5,
    website: 'booking.com',
    address: { ar: '1 شارع أول نوفمبر 1954، وسط المدينة', fr: '1, Rue 1er Novembre 1954, centre-ville', en: '1, November 1st 1954 Street, city center' },
    facilities: { 
      ar: 'غرف فاخرة وأجنحة جونيور بمرافق حديثة. مطعم بانورامي في الطابق 14، غرف اجتماعات ومؤتمرات (حتى 400 شخص)، مسبح، بار، سبا، ومركز لياقة',
      fr: 'Chambres luxueuses et Junior Suites avec installations modernes. Restaurant panoramique au 14ème étage, salles de réunion et conférences (jusqu\'à 400 personnes), piscine, bar, spa, et centre de fitness',
      en: 'Luxurious rooms and Junior Suites with modern facilities. Panoramic restaurant on 14th floor, meeting and conference rooms (up to 400 people), pool, bar, spa, and fitness center'
    },
    whyChoose: { 
      ar: 'موقع مركزي جداً، تصميم معماري أيقوني، مناسب لمن يبحث عن تجربة فندقية فاخرة. فندق سيبوس هو المكان حيث يمكنك التقاط أفضل صور لعنابة، برج عالٍ بحداثة في قلب المدينة، يجمع تاريخها وروحها',
      fr: 'Emplacement très central, design architectural emblématique, adapté à ceux qui recherchent une expérience hôtelière luxueuse. Hotel Seybouse est l\'endroit où vous pouvez prendre les meilleures photos d\'Annaba, une tour haute avec modernité au cœur de la ville, alliant son histoire et son âme',
      en: 'Very central location, iconic architectural design, suitable for those looking for a luxurious hotel experience. Hotel Seybouse is the place where you can take the best photos of Annaba, a tall tower with modernity in the heart of the city, combining its history and soul'
    },
    coordinates: [36.9020, 7.7650],
    mood: ['family', 'photo'],
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'rym-el-djamil',
    name: { ar: 'ريم الجميل', fr: 'Rym el Djamil Hotel', en: 'Rym el Djamil Hotel' },
    category: 'hotel',
    stars: 3,
    phone: '038409811',
    address: { ar: 'الكورنيش بالقرب من شاطئ بلفيدير', fr: 'Corniche près de plage Belvédère', en: 'Corniche near Belvédère beach' },
    facilities: { 
      ar: 'فندق عائلي ساحلي مع مسبح موسمي وشاطئ خاص نسبياً، مناسب للعائلات والزيارات الصيفية. يقدم نقل مجاني للمطار أحياناً',
      fr: 'Hôtel familial en bord de mer avec piscine saisonnière et plage relativement privée, adapté aux familles et visites estivales. Offre parfois un transfert gratuit vers l\'aéroport',
      en: 'Family seaside hotel with seasonal pool and relatively private beach, suitable for families and summer visits. Sometimes offers free airport transfer'
    },
    coordinates: [36.8650, 7.7150],
    mood: ['family'],
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'mimousa-palace',
    name: { ar: 'ميموزا بالاس', fr: 'Mimousa Palace', en: 'Mimousa Palace' },
    category: 'hotel',
    stars: 3,
    phone: '0781551537',
    website: 'mimousa-palace.com',
    address: { ar: 'سيدي عشور', fr: 'Sidi Achour', en: 'Sidi Achour' },
    whyChoose: { 
      ar: 'فندق جميل ورائع',
      fr: 'Hôtel beau et merveilleux',
      en: 'Beautiful and wonderful hotel'
    },
    coordinates: [36.8950, 7.7500],
    mood: ['family', 'photo'],
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'hotel-royal',
    name: { ar: 'هوتيل رويال إليزا', fr: 'Hotel Royal Elisa', en: 'Hotel Royal Elisa' },
    category: 'hotel',
    stars: 3,
    website: 'hotelroyalelisa.com',
    address: { ar: 'فندق مركزي صغير، قريب من وسط المدينة', fr: 'Petit hôtel central, proche du centre-ville', en: 'Small central hotel, close to city center' },
    facilities: { 
      ar: 'مناسب للمسافرين بميزانية محدودة أو للزيارات القصيرة',
      fr: 'Adapté aux voyageurs avec un budget limité ou pour de courtes visites',
      en: 'Suitable for travelers on a limited budget or for short visits'
    },
    coordinates: [36.9005, 7.7635],
    mood: ['family'],
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg' // REPLACE WITH REAL CAPTURE
  }
];

// ==================== GUEST HOUSES & APARTMENTS ====================

export const guestHouses = [
  {
    id: 'le-pont-blanc',
    name: { ar: 'دار الضيافة - لو بون بلان', fr: 'Maison d\'hôte – Le Pont Blanc', en: 'Guest House – Le Pont Blanc' },
    category: 'guesthouse',
    phone: '038.45.31.23',
    address: { ar: 'لوتيسمون المقاومة، بون بلان، واد فرشة، عنابة', fr: 'Lotissement El Mokawama, Pont Blanc, Oued-Forcha, Annaba', en: 'Lotissement El Mokawama, Pont Blanc, Oued-Forcha, Annaba' },
    facilities: { 
      ar: 'غرف بسعات أسرّة مختلفة (2، 3، 4)، تكييف، ماء ساخن 24/24، مطبخ في كل طابق، واي فاي، ومواقف سيارات. لديهم أيضاً شقق (F3) للإيجار الليلي. مناسبة للعائلات والمجموعات الصغيرة',
      fr: 'Chambres avec différentes capacités de lits (2, 3, 4), climatisation, eau chaude 24/24, cuisine à chaque étage, Wi-Fi, et parking. Ils ont aussi des appartements (F3) à louer à la nuit. Adaptés aux familles et petits groupes',
      en: 'Rooms with different bed capacities (2, 3, 4), air conditioning, hot water 24/24, kitchen on each floor, Wi-Fi, and parking. They also have apartments (F3) for nightly rent. Suitable for families and small groups'
    },
    coordinates: [36.8980, 7.7520],
    mood: ['family'],
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'maison-jardinee',
    name: { ar: 'ميزون جاردينيه', fr: 'Maison Jardinée', en: 'Maison Jardinée' },
    category: 'guesthouse',
    address: { ar: 'بوليفار إرنستو تشي جيفارا، عنابة 21', fr: 'Bd Ernesto Che Guevara, Annaba 21', en: 'Bd Ernesto Che Guevara, Annaba 21' },
    website: 'bedandbreakfasts.com',
    facilities: { 
      ar: 'منزل مجهز بحديقة، تكييف، مواقف خاصة، واي فاي. شقة تتكون من غرفتين و2 حمامات، مناسبة لمن يريد البقاء قرب الشواطئ. بديل جيد للفندق إذا كنت تفضل خصوصية المطبخ والمزيد من المساحة',
      fr: 'Maison équipée avec jardin, climatisation, parking privé, Wi-Fi. Appartement composé de deux chambres et 2 salles de bains, adapté à ceux qui veulent rester près des plages. Bonne alternative à l\'hôtel si vous préférez l\'intimité d\'une cuisine et plus d\'espace',
      en: 'Equipped house with garden, air conditioning, private parking, Wi-Fi. Apartment consisting of two rooms and 2 bathrooms, suitable for those who want to stay near beaches. Good alternative to hotel if you prefer privacy of kitchen and more space'
    },
    coordinates: [36.8900, 7.7420],
    mood: ['family', 'quiet'],
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'djeloul-boubidi',
    name: { ar: 'جلول بوبيدي - شامبر دوت (بني مهافر)', fr: 'Djeloul Boubidi – Chambre d\'hôtes', en: 'Djeloul Boubidi – Chambre d\'hôtes' },
    category: 'guesthouse',
    address: { ar: 'بني مهافر / شابوي / فلاح رشيد (قرب الشواطئ)', fr: 'Beni M\'Haffeur / Chapuis / Fellah Rachid (près plages)', en: 'Beni M\'Haffeur / Chapuis / Fellah Rachid (near beaches)' },
    facilities: { 
      ar: 'مكان صغير بأسلوب "شامبر دوت"',
      fr: 'Petit endroit avec style "chambre d\'hôtes"',
      en: 'Small place with "chambre d\'hôtes" style'
    },
    whyChoose: { 
      ar: 'مناسب لمن يبحث عن مكان قرب الشواطئ. تشير مراجعات الضيوف إلى أن الخدمة والمستوى أساسيان (تقييمات وتعليقات متنوعة). فكر في حجز تجريبي قبل الدفع بعد قراءة أحدث التعليقات',
      fr: 'Adapté à ceux qui cherchent un endroit près des plages. Les avis des clients indiquent que le service et le standard sont basiques (évaluations et commentaires variés). Envisagez une réservation d\'essai avant de payer après avoir lu les derniers commentaires',
      en: 'Suitable for those looking for a place near beaches. Guest reviews indicate that service and standard are basic (varying ratings and comments). Consider a trial booking before paying after reading latest comments'
    },
    coordinates: [36.8800, 7.7300],
    mood: ['quiet'],
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg' // REPLACE WITH REAL CAPTURE
  }
];

// ==================== TOURISM AGENCIES ====================

export const tourismAgencies = [
  {
    id: 'annaba-adventure',
    name: { ar: 'عنابة أدفينتشر', fr: 'Annaba Adventure', en: 'Annaba Adventure' },
    category: 'agency',
    services: { 
      ar: 'منظم رحلات يومية (شواطئ، مخيمات)، رحلات استكشافية، وباقات يوم كامل (نقل + نشاط)',
      fr: 'Organisateur de voyages quotidiens (plages, bivouac), voyages d\'exploration, et forfaits journée complète (transport + activité)',
      en: 'Organizer of daily trips (beaches, bivouac), exploration trips, and full-day packages (transport + activity)'
    },
    whyChoose: { 
      ar: 'جيد للرحلات الجماعية ورحلات المسافرين',
      fr: 'Bon pour les voyages de groupe et les voyageurs routards',
      en: 'Good for group trips and backpacker travelers'
    },
    coordinates: [36.9000, 7.7600],
    mood: ['adventure'],
    image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'plaisir-voyages',
    name: { ar: 'بليزير فوياج - عنابة', fr: 'Plaisir Voyages – Annaba', en: 'Plaisir Voyages – Annaba' },
    category: 'agency',
    phone: '0551128389 / 0564535900',
    services: { 
      ar: 'وكالة تقليدية تقدم باقات سياحية (محلية، دولية) وخدمات تأشيرات، حجز فنادق',
      fr: 'Agence traditionnelle offrant forfaits touristiques (domestiques, internationaux) et services de visa, réservations d\'hôtels',
      en: 'Traditional agency offering tourist packages (domestic, international) and visa services, hotel bookings'
    },
    whyChoose: { 
      ar: 'مفيدة للبرامج والباقات المنظمة',
      fr: 'Utile pour programmes et forfaits organisés',
      en: 'Useful for organized programs and packages'
    },
    coordinates: [36.9010, 7.7645],
    mood: ['family'],
    image: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'ad-voyages',
    name: { ar: 'AD فوياج إي توريزم - عنابة', fr: 'AD Voyages ET Tourisme – Annaba', en: 'AD Voyages ET Tourisme – Annaba' },
    category: 'agency',
    phone: '0559002128 / 0553366252',
    services: { 
      ar: 'وكالة تنظم جولات محلية وباقات سياحية',
      fr: 'Agence organisant visites locales et forfaits touristiques',
      en: 'Agency organizing local tours and tourist packages'
    },
    whyChoose: { 
      ar: 'مفيدة للجولات متعددة الأيام',
      fr: 'Utile pour circuits multi-jours',
      en: 'Useful for multi-day tours'
    },
    coordinates: [36.9005, 7.7640],
    mood: ['family'],
    image: 'https://images.pexels.com/photos/3155726/pexels-photo-3155726.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'nassamat-seraidi',
    name: { ar: 'نسمات سرايدي ترافيل', fr: 'Nassamat Séraidi Travel', en: 'Nassamat Séraidi Travel' },
    category: 'agency',
    instagram: '@nassamat_seraidi_travel',
    services: { 
      ar: 'تنظيم رحلات عائلية داخل وخارج عنابة - برامج 4 أيام، رحلات يومية للاسترخاء، أنشطة بحرية وخارجية',
      fr: 'Organisation de voyages familiaux dans et hors d\'Annaba – programmes de 4 jours, voyages quotidiens de détente, activités maritimes et de plein air',
      en: 'Organizing family trips in and outside Annaba – 4-day programs, daily relaxation trips, marine and outdoor activities'
    },
    pricing: { 
      ar: 'رحلة يومية شاملة النقل والطعام - حوالي 2000 دج للشخص. برامج أطول (4 أيام) - تبدأ الأسعار من 18,500 دج للشخص في غرف مشتركة',
      fr: 'Voyage quotidien incluant transport et nourriture - environ 2000 DA par personne. Programmes plus longs (4 jours) - prix à partir de 18 500 DA par personne en chambres partagées',
      en: 'Daily trip including transport and food - around 2000 DA per person. Longer programs (4 days) - prices start from 18,500 DA per person in shared rooms'
    },
    coordinates: [36.8350, 7.6850],
    mood: ['family', 'adventure'],
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' // REPLACE WITH REAL CAPTURE
  }
];

// ==================== RECREATIONAL CLUBS ====================

export const recreationalClubs = [
  {
    id: 'csa-hippone-sub',
    name: { ar: 'CSA / هيبون سوب', fr: 'CSA / Hippone Sub', en: 'CSA / Hippone Sub' },
    category: 'club',
    type: 'diving',
    website: 'csahippone.com',
    instagram: '@CSA Hippone',
    facebook: 'Hippone Sub Annaba',
    services: { 
      ar: 'غوص سكوبا، غوص حر (أبني)، دروس سباحة، تأجير قوارب شراعية صغيرة، تجديف، تجديف بالمجداف، تنظيم رحلات بحرية',
      fr: 'Plongée sous-marine, plongée libre (apnée), cours de natation, location de petits voiliers, kayak, paddle, organisation de voyages en mer',
      en: 'Scuba diving, free diving (apnea), swimming lessons, small sailboat rental, kayaking, paddleboarding, organizing sea trips'
    },
    whyChoose: { 
      ar: 'فريق ذو خبرة، قاعدة بحرية مجهزة جيداً، مناسب للمبتدئين والمحترفين',
      fr: 'Équipe expérimentée, base marine bien équipée, adapté aux débutants et professionnels',
      en: 'Experienced team, well-equipped sea base, suitable for beginners and professionals'
    },
    wassimTip: { 
      ar: 'نصيحة عملية: احجز غطسة اكتشافية قبل الظهر (البحر أهدأ) واطلب مدرباً. أحضر شهادتك الطبية للغوص إذا كنت مسجلاً في دورة',
      fr: 'Conseil pratique: Réservez une plongée découverte avant midi (la mer est plus calme) et demandez un instructeur. Apportez votre certificat médical pour la plongée si vous êtes inscrit à un cours',
      en: 'Practical tip: Book a discovery dive before noon (the sea is calmer) and ask for an instructor. Bring your medical certificate for diving if you are registered for a course'
    },
    coordinates: [36.8950, 7.7450],
    mood: ['adventure'],
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'chetaibi-diving',
    name: { ar: 'مدرسة الغوص - شطايبي', fr: 'École de Plongée – Chetaïbi', en: 'Diving School – Chetaïbi' },
    category: 'club',
    type: 'diving',
    phone: '0665020047 / 0663923749 / 0671362928 / 0770417283',
    services: { 
      ar: 'دورات غوص PADI من المستوى المبتدئ إلى المتقدم، رحلات غوص في خلجان شطايبي، غطس',
      fr: 'Cours de plongée PADI du niveau débutant au niveau avancé, voyages de plongée dans les baies de Chetaïbi, snorkeling',
      en: 'PADI diving courses from beginner to advanced level, diving trips in Chetaïbi bays, snorkeling'
    },
    whyChoose: { 
      ar: 'تفتخر شطايبي بمواقع غوص جميلة (كهوف، خلجان)، والمدربون محليون ويعرفون الأماكن الآمنة',
      fr: 'Chetaïbi possède de beaux sites de plongée (grottes, baies), et les instructeurs sont locaux et connaissent les endroits sûrs',
      en: 'Chetaïbi boasts beautiful dive sites (caves, bays), and instructors are local and know safe spots'
    },
    wassimTip: { 
      ar: 'معلومات الأسعار: يتم نشر عروض "غطسة اكتشاف" على صفحات المكان (مثل عروض بأسعار معقولة حوالي 1500 دج للشخص أحياناً) - تحقق من العرض الحالي على صفحة النادي قبل الحجز',
      fr: 'Info prix: Les offres "plongée découverte" sont publiées sur les pages du lieu (par exemple, offres à prix raisonnables autour de 1500 DA par personne parfois) - vérifiez l\'offre actuelle sur la page du club avant de réserver',
      en: 'Price info: "Discovery dive" offers are posted on venue pages (e.g., reasonable price offers around 1500 DA per person sometimes) - check current offer on club page before booking'
    },
    coordinates: [36.8200, 7.6500],
    mood: ['adventure'],
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/2422264/pexels-photo-2422264.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'club-hippique',
    name: { ar: 'نادي الفروسية المحترف عنابة', fr: 'Club Hippique Professionnel Annaba', en: 'Professional Equestrian Club Annaba' },
    category: 'club',
    type: 'horseback',
    instagram: '@club_hippique_de_annaba',
    services: { 
      ar: 'دروس ركوب الخيل للمبتدئين والمتقدمين، رحلات في الطبيعة، مسابقات محلية',
      fr: 'Cours d\'équitation pour débutants et cavaliers avancés, promenades dans la nature, compétitions locales',
      en: 'Horse riding lessons for beginners and advanced riders, nature rides, local competitions'
    },
    whyChoose: { 
      ar: 'عنابة لديها عدة إسطبلات ونوادي (Club El Fahd، NHCA، وغيرها) - اختر النادي بناءً على قربه وبرنامج التدريب (دروس خاصة أو جماعية)',
      fr: 'Annaba a plusieurs écuries et clubs (Club El Fahd, NHCA, et autres) – choisissez le club selon sa proximité et le programme d\'entraînement (cours privés ou en groupe)',
      en: 'Annaba has several stables and clubs (Club El Fahd, NHCA, and others) – choose club based on its proximity and training program (private or group lessons)'
    },
    coordinates: [36.8900, 7.7400],
    mood: ['family', 'adventure'],
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg' // REPLACE WITH REAL CAPTURE
  },
  {
    id: 'chess-club',
    name: { ar: 'نادي الشطرنج عنابة', fr: 'Chess Club Annaba', en: 'Chess Club Annaba' },
    category: 'club',
    type: 'cultural',
    instagram: '@annaba_chess & @chessclubannaba',
    services: { 
      ar: 'ورش عمل الشطرنج، دورات، بطولات محلية، لقاءات شبابية. خيار هادئ بعيداً عن أنشطة الشاطئ، لكن جزء من ثقافة الشباب',
      fr: 'Ateliers d\'échecs, cours, tournois locaux, rencontres jeunesse. Option calme loin des activités de plage, mais partie de la culture jeunesse',
      en: 'Chess workshops, courses, local tournaments, youth meetups. Quiet option away from beach activities, but part of youth culture'
    },
    wassimTip: { 
      ar: 'خيار لمن يفضل نشاطاً هادئاً بعد يوم على الشاطئ. شخصياً أنا من محبي الشطرنج',
      fr: 'Option pour ceux qui préfèrent une activité calme après une journée à la plage. Personnellement, je suis amateur d\'échecs',
      en: 'Option for those who prefer a quiet activity after a day at the beach. Personally, I\'m a chess lover'
    },
    coordinates: [36.9000, 7.7600],
    mood: ['quiet'],
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg' // REPLACE WITH REAL CAPTURE
  }
];

// Export combined data with texts
export const v3Data = {
  completeTexts,
  wassimAuthor,
  scanAndGoLinks,
  hotelsComplete,
  guestHouses,
  tourismAgencies,
  recreationalClubs
};

// Re-export imported items for convenience
export { completeTexts, wassimAuthor, scanAndGoLinks };

export default v3Data;
