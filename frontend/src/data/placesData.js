// Comprehensive Travel Planner Annaba Data - Extracted from PDF

export const beaches = [
  {
    id: 'sidi-salim',
    name: { ar: 'شاطئ سيدي سالم', fr: 'Sidi Salim Beach' },
    category: 'beach',
    description: { 
      ar: 'خليج رملي شاسع في أقصى شرق عنابة بالقرب من مصب نهر سيبوس', 
      fr: 'Vaste baie sablonneuse à l\'extrémité est d\'Annaba près de l\'estuaire de Seybouse' 
    },
    mood: ['family', 'photo'],
    coordinates: [36.9000, 7.7500],
    wassimTip: { ar: 'مناسب للعائلات ومزدحم في أوقات الذروة', fr: 'Idéal pour les familles, bondé aux heures de pointe' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg'
  },
  {
    id: 'el-fedro',
    name: { ar: 'شاطئ الفيدرو', fr: 'El Fedro Beach' },
    category: 'beach',
    description: { 
      ar: 'شاطئ صغير وضيق، البحر هادئ عادة بدون أمواج', 
      fr: 'Petite plage étroite, mer généralement calme sans vagues' 
    },
    mood: ['quiet', 'photo'],
    coordinates: [36.8950, 7.7450],
    wassimTip: { ar: 'مكان هادئ وقريب من الأحياء النشطة', fr: 'Endroit calme près des quartiers actifs' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg'
  },
  {
    id: 'sanklou',
    name: { ar: 'شاطئ سان-كلو', fr: 'Sanklou Beach' },
    category: 'beach',
    description: { 
      ar: 'بحر مفتوح مع أمواج متوسطة، أجواء شبابية', 
      fr: 'Mer ouverte avec vagues moyennes, ambiance jeune' 
    },
    mood: ['adventure', 'photo'],
    coordinates: [36.8900, 7.7400],
    wassimTip: { ar: 'مقاهي ومطاعم قريبة، مكان حيوي', fr: 'Cafés et restaurants à proximité, lieu animé' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg'
  },
  {
    id: 'rizzi-amor',
    name: { ar: 'شاطئ ريزي أمور', fr: 'Rizzi Amor Beach' },
    category: 'beach',
    description: { 
      ar: 'بحر مفتوح مع أمواج متوسطة، مناسب للسباحة في الأيام الهادئة', 
      fr: 'Mer ouverte avec vagues moyennes, propice à la baignade par temps calme' 
    },
    mood: ['family', 'adventure'],
    coordinates: [36.8850, 7.7350],
    wassimTip: { ar: 'فعاليات موسمية ومطاعم قريبة مثل ميغا بيتزا وسكاي لاونج', fr: 'Événements saisonniers et restaurants à proximité comme Mega Pizza et Sky Lounge' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/1350197/pexels-photo-1350197.jpeg'
  },
  {
    id: 'kharrouba',
    name: { ar: 'شاطئ الخروبة', fr: 'Kharrouba Beach' },
    category: 'beach',
    description: { 
      ar: 'بحر متوسط الهيجان مع شريط رملي وخلجان صغيرة', 
      fr: 'Mer moyennement agitée avec bande de sable et petites criques' 
    },
    mood: ['family', 'quiet'],
    coordinates: [36.8700, 7.7200],
    wassimTip: { ar: 'مناسب للعائلات مع زوار من جميع الأعمار', fr: 'Convient aux familles avec visiteurs de tous âges' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg'
  },
  {
    id: 'belvedere',
    name: { ar: 'شاطئ بلفيدير', fr: 'Belvédère Beach' },
    category: 'beach',
    description: { 
      ar: 'بحر مفتوح، منظم ومناسب للعائلات مع إطلالة جميلة على الخليج', 
      fr: 'Mer ouverte, organisé et familial avec belle vue sur la baie' 
    },
    mood: ['family', 'photo'],
    coordinates: [36.8600, 7.7100],
    wassimTip: { ar: 'خدمات جيدة ومواقف سيارات قريبة ومقاهي', fr: 'Bons services et parkings à proximité avec cafés' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg'
  },
  {
    id: 'ain-achir',
    name: { ar: 'شاطئ عين عشير', fr: 'Ain Achir Beach' },
    category: 'beach',
    description: { 
      ar: 'الأفضل في الصباح، أمواج متوسطة، مكان محبوب لسكان عنابة', 
      fr: 'Meilleur le matin, vagues moyennes, lieu apprécié des habitants d\'Annaba' 
    },
    mood: ['family', 'quiet'],
    coordinates: [36.8550, 7.7050],
    wassimTip: { ar: 'أنظف من شواطئ الخليج الشرقي، مكاني المفضل!', fr: 'Plus propre que les plages de la baie est, mon endroit préféré !' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/1598073/pexels-photo-1598073.jpeg'
  },
  {
    id: 'jnan-bey',
    name: { ar: 'شاطئ جنان البي', fr: 'Jnan Bey Beach' },
    category: 'beach',
    description: { 
      ar: 'واسع، كبير، جميل، هادئ، مناسب للعائلات والشباب', 
      fr: 'Large, grand, beau, calme, convient aux familles et aux jeunes' 
    },
    mood: ['family', 'adventure', 'photo'],
    coordinates: [36.8400, 7.6900],
    wassimTip: { ar: 'المفضل لدى جميع سكان عنابة، مزدحم في العطلات', fr: 'Préféré de tous les habitants d\'Annaba, bondé pendant les vacances' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/1630039/pexels-photo-1630039.jpeg'
  },
  {
    id: 'plage-el-louh',
    name: { ar: 'بلاج اللوح', fr: 'Plage El Louh' },
    category: 'beach',
    description: { 
      ar: 'أفضل وأشهر شاطئ في الجزائر، يمكن الوصول إليه بالقوارب الصغيرة', 
      fr: 'Meilleure et plus célèbre plage d\'Algérie, accessible par petits bateaux' 
    },
    mood: ['adventure', 'photo', 'quiet'],
    coordinates: [36.8350, 7.6800],
    wassimTip: { ar: 'شاطئ صخري جذاب ونقي، مثالي للسباحة والتصوير', fr: 'Plage rocheuse attrayante et pure, idéale pour nager et photographier' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg'
  },
  {
    id: 'chetaibi-central',
    name: { ar: 'شاطئ شطايبي المركزي', fr: 'Chetaibi Central Beach' },
    category: 'beach',
    description: { 
      ar: 'رمال واسعة ومياه صافية في الأيام الهادئة، مكان شعبي للعائلات', 
      fr: 'Sable large et eaux claires par temps calme, lieu populaire pour les familles' 
    },
    mood: ['family', 'photo'],
    coordinates: [36.8200, 7.6500],
    wassimTip: { ar: 'ساعة واحدة من عنابة، تحسنت النظافة بشكل كبير', fr: 'Une heure d\'Annaba, propreté considérablement améliorée' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg'
  },
  {
    id: 'golden-sand',
    name: { ar: 'شاطئ الرمال الذهبية', fr: 'Golden Sand Beach' },
    category: 'beach',
    description: { 
      ar: 'رمال ذهبية ناعمة، مناسب للعائلات، طبيعة محيطة جميلة', 
      fr: 'Sable doré doux, familial, belle nature environnante' 
    },
    mood: ['family', 'photo'],
    coordinates: [36.8150, 7.6450],
    wassimTip: { ar: 'شعبي مع الشباب في الصيف، بعض الأجزاء مجانية', fr: 'Populaire avec les jeunes en été, certaines parties sont gratuites' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/1032649/pexels-photo-1032649.jpeg'
  },
  {
    id: 'akacha',
    name: { ar: 'شواطئ عكاشة', fr: 'Akacha Beaches' },
    category: 'beach',
    description: { 
      ar: 'طبيعة برية، أشجار صنوبر، ظل كثيف، بحر أزرق بعيد، مكان شبه سري وسحري', 
      fr: 'Nature sauvage, pins, ombre dense, mer bleue lointaine, lieu semi-secret et magique' 
    },
    mood: ['quiet', 'photo', 'adventure'],
    coordinates: [36.8100, 7.6400],
    wassimTip: { ar: 'مثالي للانفصال والاسترخاء، لقطات شعرية للتصوير', fr: 'Idéal pour se déconnecter et se détendre, prises poétiques pour la photographie' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg'
  }
];

export const restaurants = [
  {
    id: 'downtown-pizza',
    name: { ar: 'داون تاون بيتزا', fr: 'Downtown Pizza e Pasta' },
    category: 'restaurant',
    type: { ar: 'بيتزا، أطباق إيطالية', fr: 'Pizza, plats italiens' },
    phone: '0666918741',
    address: { ar: 'فيلا رقم 5، بوليفارد الصديق بن يحيى، عنابة', fr: 'Villa N.5, Boulevard Seddik Ben Yahia, Annaba' },
    mood: ['family'],
    coordinates: [36.9000, 7.7600],
    wassimTip: { ar: 'بيتزا طازجة ومشهورة على إنستغرام', fr: 'Pizza fraîche et célèbre sur Instagram' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg'
  },
  {
    id: 'le-jasmin',
    name: { ar: 'لو جاسمين', fr: 'Le Jasmin' },
    category: 'restaurant',
    type: { ar: 'بيتزا، مقهى، أطباق عالمية', fr: 'Pizza, café, plats internationaux' },
    phone: '030410540',
    address: { ar: '29 شارع ريزي أمور', fr: '29 Bd Rizzi Amor' },
    mood: ['family', 'photo'],
    coordinates: [36.8900, 7.7400],
    wassimTip: { ar: 'مناسب للعائلات مع إطلالة على البحر أحياناً', fr: 'Convient aux familles avec vue occasionnelle sur la mer' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg'
  },
  {
    id: 'la-renaissance',
    name: { ar: 'لا رينيسانس', fr: 'La Renaissance' },
    category: 'restaurant',
    type: { ar: 'مأكولات بحرية فرنسية/متوسطية', fr: 'Cuisine française/méditerranéenne, fruits de mer' },
    phone: '',
    address: { ar: 'بالقرب من الشاطئ، طريق كاب دي غارد', fr: 'Près de la plage, Route du Cap de Garde' },
    mood: ['family', 'photo'],
    coordinates: [36.8700, 7.7200],
    wassimTip: { ar: 'واحد من أعلى المطاعم تقييماً، أجواء أنيقة', fr: 'Un des restaurants les mieux notés, ambiance élégante' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg'
  },
  {
    id: 'le-pecheur',
    name: { ar: 'مطعم الصياد', fr: 'Le Pêcheur' },
    category: 'restaurant',
    type: { ar: 'مأكولات بحرية، سمك طازج', fr: 'Fruits de mer, poisson frais' },
    phone: '0555858973',
    address: { ar: '1 شارع المينا', fr: '1 Rue de l\'Avant-Port' },
    mood: ['family', 'photo'],
    coordinates: [36.9050, 7.7650],
    wassimTip: { ar: 'متخصص في السمك الطازج، ممتاز!', fr: 'Spécialisé en poisson frais, excellent !' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg'
  },
  {
    id: 'le-baroque',
    name: { ar: 'لو باروك', fr: 'Le Baroque' },
    category: 'restaurant',
    type: { ar: 'مطبخ متوسطي مع لمسات فرنسية', fr: 'Cuisine méditerranéenne avec touches françaises' },
    phone: '',
    address: { ar: 'منطقة شابوي', fr: 'Zone Chapuis' },
    mood: ['family', 'photo'],
    coordinates: [36.8850, 7.7350],
    wassimTip: { ar: 'أجواء لاونج أنيقة، مناسب للمناسبات', fr: 'Ambiance lounge élégante, parfait pour les occasions' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg'
  },
  {
    id: 'mama-saliha',
    name: { ar: 'ماما صليحة', fr: 'Mama Saliha' },
    category: 'restaurant',
    type: { ar: 'أطباق جزائرية تقليدية', fr: 'Plats algériens traditionnels' },
    phone: '',
    address: { ar: 'شارع المينا', fr: 'Rue de l\'Avant-Port' },
    mood: ['family'],
    coordinates: [36.9040, 7.7640],
    wassimTip: { ar: 'تجربة الطبخ الجزائري الأصيل', fr: 'Expérience de cuisine algérienne authentique' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg'
  },
  {
    id: 'abou-amir',
    name: { ar: 'أبو أمير', fr: 'Abou Amir' },
    category: 'restaurant',
    type: { ar: 'أطباق شعبية، مشاوي', fr: 'Plats populaires, grillades' },
    phone: '0542449197',
    address: { ar: 'شارع أول نوفمبر (البوني)', fr: '1 Novembre Street (El Bouni)' },
    mood: ['family'],
    coordinates: [36.9100, 7.7700],
    wassimTip: { ar: 'خيار جيد لتجربة الطعام الشعبي', fr: 'Bon choix pour la nourriture de rue' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg'
  },
  {
    id: 'mega-pizza',
    name: { ar: 'ميغا بيتزا', fr: 'Mega Pizza' },
    category: 'restaurant',
    type: { ar: 'بيتزا، تاكو', fr: 'Pizza, tacos' },
    phone: '0780834057',
    address: { ar: 'ثلاثة فروع: سانكلو، وسط المدينة، شاطئ ريزي أمور', fr: 'Trois branches : Sanklou, centre-ville, plage Rizzi Amor' },
    mood: ['family'],
    coordinates: [36.8950, 7.7450],
    wassimTip: { ar: 'مشهور بين محبي البيتزا والعائلات', fr: 'Populaire parmi les amateurs de pizza et les familles' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg'
  },
  {
    id: 'donatella',
    name: { ar: 'دوناتيلا', fr: 'Donatella' },
    category: 'restaurant',
    type: { ar: 'مطعم إيطالي فاخر', fr: 'Restaurant italien luxueux' },
    phone: '0553465148',
    address: { ar: 'سيدي عيسى، عنابة', fr: 'Sidi Aissa, Annaba' },
    mood: ['family', 'photo'],
    coordinates: [36.8800, 7.7300],
    wassimTip: { ar: 'أول مطعم إيطالي في المنطقة، ذوق راقي', fr: 'Premier restaurant italien de la région, goût raffiné' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg'
  }
];

export const cafes = [
  {
    id: 'gaadet-ezzman',
    name: { ar: 'قعدة زمان', fr: 'Gaadet Ezzman' },
    category: 'cafe',
    hours: { ar: 'يومياً من 2:00 ظهراً - 11:00 مساءً', fr: 'Quotidien 14h-23h' },
    address: { ar: 'شارع بوزقري سعيد، حي فيدرو', fr: 'Rue Bouzgari Said, quartier Fidrou' },
    mood: ['quiet', 'photo'],
    coordinates: [36.8980, 7.7480],
    wassimTip: { ar: 'مكان هادئ وأنيق، مثالي للاسترخاء', fr: 'Endroit calme et élégant, idéal pour se détendre' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg'
  },
  {
    id: 'dar-lyes',
    name: { ar: 'دار ليس', fr: 'Dar Lyes' },
    category: 'cafe',
    phone: '038433268',
    address: { ar: 'عنابة', fr: 'Annaba' },
    mood: ['family', 'photo'],
    coordinates: [36.9000, 7.7600],
    wassimTip: { ar: 'فندق ومطعم يقدم تجربة شاي مميزة', fr: 'Hôtel et restaurant offrant une expérience de thé distinctive' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg'
  },
  {
    id: 'the-throne',
    name: { ar: 'ذا ثرون', fr: 'The Throne' },
    category: 'cafe',
    phone: '0557774947',
    hours: { ar: '4:00 مساءً - 3:00 صباحاً', fr: '16h-3h' },
    address: { ar: 'شاطئ ريزي أمور', fr: 'Plage Rizzi Amor' },
    mood: ['photo', 'family'],
    coordinates: [36.8900, 7.7400],
    wassimTip: { ar: 'مكان فاخر للجلسات المسائية، ديكور أنيق', fr: 'Lieu luxueux pour soirées, décor élégant' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg'
  },
  {
    id: 'sky-lounge',
    name: { ar: 'سكاي لاونج', fr: 'Sky Lounge' },
    category: 'cafe',
    phone: '0671771079',
    hours: { ar: 'يومياً 1:00 ظهراً - 2:00 صباحاً', fr: 'Quotidien 13h-2h' },
    address: { ar: 'شاطئ ريزي أمور', fr: 'Plage Rizzi Amor' },
    mood: ['photo', 'family'],
    coordinates: [36.8910, 7.7410],
    wassimTip: { ar: 'إطلالة بحرية جميلة، يفضل الحجز المسبق', fr: 'Belle vue sur la mer, réservation recommandée' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1449791/pexels-photo-1449791.jpeg'
  },
  {
    id: 'dk-lounge',
    name: { ar: 'دي كي لاونج', fr: 'D&K Lounge' },
    category: 'cafe',
    phone: '0770741220',
    address: { ar: 'شاطئ شابوي', fr: 'Plage Chapuis' },
    mood: ['quiet', 'family'],
    coordinates: [36.8850, 7.7350],
    wassimTip: { ar: 'مكان مريح مع مشروبات ووجبات خفيفة', fr: 'Endroit confortable avec boissons et snacks' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg'
  },
  {
    id: 'el-fakhama',
    name: { ar: 'الفخامة بلس', fr: 'El Fakhama Plus' },
    category: 'cafe',
    phone: '0550235563',
    address: { ar: 'شاطئ ريزي أمور', fr: 'Plage Rizzi Amor' },
    mood: ['photo', 'family'],
    coordinates: [36.8920, 7.7420],
    wassimTip: { ar: 'أجواء فاخرة وديكور أنيق', fr: 'Ambiance luxueuse et décor élégant' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1833321/pexels-photo-1833321.jpeg'
  },
  {
    id: 'laltitude',
    name: { ar: 'لالتيتيود', fr: 'L\'Altitude' },
    category: 'cafe',
    phone: '0672565887',
    address: { ar: 'حديقة فاروق لاند، سيدي عشور', fr: 'Parc Farouk Land, Sidi Aichour' },
    mood: ['photo', 'quiet'],
    coordinates: [36.8950, 7.7500],
    wassimTip: { ar: 'موقع مرتفع مع إطلالة جميلة', fr: 'Emplacement en altitude avec belle vue' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg'
  },
  {
    id: 'oasis-cafe',
    name: { ar: 'أواسيس', fr: 'Salon de Thé Oasis' },
    category: 'cafe',
    address: { ar: 'طريق سرايدي', fr: 'Route Seraidi' },
    mood: ['quiet', 'family'],
    coordinates: [36.8400, 7.6900],
    wassimTip: { ar: 'مكان هادئ للإفطار الخفيف', fr: 'Endroit calme pour petit-déjeuner léger' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg'
  }
];

export const hotels = [
  {
    id: 'sheraton',
    name: { ar: 'شيراتون عنابة', fr: 'Sheraton Annaba' },
    category: 'hotel',
    stars: 5,
    phone: '+213 38452000',
    address: { ar: 'بوليفارد فيكتور هوجو', fr: 'Boulevard Victor Hugo' },
    amenities: { ar: 'مطعمان، مسبح خارجي، خدمات الأعمال', fr: 'Deux restaurants, piscine extérieure, services affaires' },
    mood: ['family'],
    coordinates: [36.9000, 7.7620],
    wassimTip: { ar: 'موقع مركزي بالقرب من الكورنيش، اطلب غرفة في الطوابق العليا', fr: 'Emplacement central près de la Corniche, demander chambre étages supérieurs' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
  },
  {
    id: 'golden-tulip',
    name: { ar: 'جولدن توليب سابري', fr: 'Golden Tulip Sabri' },
    category: 'hotel',
    stars: 4,
    phone: '',
    address: { ar: 'منطقة سابري، الكورنيش السياحي', fr: 'Zone Sabri, Corniche touristique' },
    amenities: { ar: 'غرف بإطلالة بحرية، قاعات اجتماعات، برامج عائلية', fr: 'Chambres vue mer, salles de réunion, programmes familiaux' },
    mood: ['family', 'photo'],
    coordinates: [36.8600, 7.7100],
    wassimTip: { ar: 'مناسب للعائلات، قرب الشاطئ دون سعر 5 نجوم', fr: 'Convient aux familles, près de la plage sans prix 5 étoiles' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'
  },
  {
    id: 'hotel-orient',
    name: { ar: 'هوتيل دوريان', fr: 'Hôtel d\'Orient' },
    category: 'hotel',
    stars: 3,
    phone: '+213 64 38 21 07',
    address: { ar: 'ساحة الثورة، عنابة', fr: 'Cours de la Révolution, Annaba' },
    amenities: { ar: 'قلب المدينة، قرب المعالم التاريخية', fr: 'Cœur de ville, près monuments historiques' },
    mood: ['family'],
    coordinates: [36.9010, 7.7640],
    wassimTip: { ar: 'اختيار عملي لاستكشاف وسط المدينة سيراً', fr: 'Choix pratique pour explorer le centre à pied' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg'
  },
  {
    id: 'montazah',
    name: { ar: 'فندق المنتزه سرايدي', fr: 'Montazah Seraidi' },
    category: 'hotel',
    stars: 4,
    phone: '038473560',
    email: 'HOTELMOUNTAZAH@GMAIL.COM',
    address: { ar: 'سرايدي، إطلالة على البحر', fr: 'Seraidi, vue sur la mer' },
    amenities: { ar: 'تحفة معمارية من الستينات', fr: 'Chef-d\'œuvre architectural des années 60' },
    mood: ['photo', 'quiet'],
    coordinates: [36.8350, 7.6850],
    wassimTip: { ar: 'معمار رائع وإطلالة خلابة', fr: 'Architecture magnifique et vue imprenable' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg'
  },
  {
    id: 'sebous',
    name: { ar: 'فندق سيبوس إنترناشيونال', fr: 'Sebous International Hotel' },
    category: 'hotel',
    stars: 5,
    phone: '',
    address: { ar: '1 شارع أول نوفمبر 1954، وسط المدينة', fr: '1, Rue 1er Novembre 1954, centre-ville' },
    amenities: { ar: 'مطعم بانورامي في الطابق 14، مسبح، سبا', fr: 'Restaurant panoramique 14ème étage, piscine, spa' },
    mood: ['family', 'photo'],
    coordinates: [36.9020, 7.7650],
    wassimTip: { ar: 'أفضل صورة لعنابة، برج عالي في قلب المدينة', fr: 'Meilleure photo d\'Annaba, tour haute au cœur de la ville' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg'
  },
  {
    id: 'rym-el-djamil',
    name: { ar: 'ريم الجميل', fr: 'Rym El Djamil' },
    category: 'hotel',
    stars: 3,
    phone: '038409811',
    address: { ar: 'الكورنيش بالقرب من شاطئ بلفيدير', fr: 'Corniche près de plage Belvédère' },
    amenities: { ar: 'شاطئ خاص نسبياً، مسبح موسمي', fr: 'Plage relativement privée, piscine saisonnière' },
    mood: ['family'],
    coordinates: [36.8650, 7.7150],
    wassimTip: { ar: 'مناسب للعائلات والزيارات الصيفية', fr: 'Convient aux familles et visites estivales' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg'
  },
  {
    id: 'mimousa-palace',
    name: { ar: 'ميموزا بالاس', fr: 'Mimousa Palace' },
    category: 'hotel',
    stars: 4,
    phone: '0781551537',
    address: { ar: 'سيدي عشور', fr: 'Sidi Achour' },
    amenities: { ar: 'فندق جميل وخيار رائع', fr: 'Bel hôtel et excellent choix' },
    mood: ['family', 'photo'],
    coordinates: [36.8950, 7.7500],
    wassimTip: { ar: 'موقع جميل وخدمة ممتازة', fr: 'Bel emplacement et excellent service' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg'
  }
];

export const historicalSites = [
  {
    id: 'hippo-regius',
    name: { ar: 'موقع هيبو ريجيوس الأثري', fr: 'Site Archéologique Hippo Regius' },
    category: 'historical',
    description: { 
      ar: 'القلب القديم للمدينة من العصور الفينيقية والنوميدية ثم الرومانية. خدم هنا القديس أوغسطين', 
      fr: 'Cœur antique de la ville des époques phénicienne et numide puis romaine. Saint Augustin y servit' 
    },
    hours: { ar: '9 صباحاً - 5 مساءً (مغلق الإثنين عادة)', fr: '9h-17h (généralement fermé lundi)' },
    coordinates: [36.8800, 7.7300],
    mood: ['quiet', 'photo'],
    wassimTip: { ar: 'ابدأ بالمتحف قبل النزول للموقع للفهم الأفضل', fr: 'Commencer par le musée avant de descendre au site pour mieux comprendre' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/9322242/pexels-photo-9322242.jpeg'
  },
  {
    id: 'basilique',
    name: { ar: 'بازيليك القديس أوغسطين', fr: 'Basilique Saint-Augustin' },
    category: 'historical',
    description: { 
      ar: 'بازيليك مهيبة تطل على أنقاض هيبو، بنيت عام 1881 وأكملت عام 1900', 
      fr: 'Basilique imposante surplombant ruines d\'Hippo, construite 1881-1900' 
    },
    hours: { ar: '8 صباحاً - 6 مساءً', fr: '8h-18h' },
    coordinates: [36.8810, 7.7310],
    mood: ['photo', 'quiet'],
    wassimTip: { ar: 'الغروب أفضل وقت لالتقاط واجهة الكنيسة المضاءة بالذهبي', fr: 'Coucher de soleil meilleur moment pour capturer façade illuminée en doré' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/3566187/pexels-photo-3566187.jpeg'
  },
  {
    id: 'sidi-bou-merouane',
    name: { ar: 'مسجد سيدي بومروان', fr: 'Mosquée Sidi Bou Merouane' },
    category: 'historical',
    description: { 
      ar: 'أقدم مسجد في عنابة، بني في القرن 11 الميلادي خلال العصر الزيري', 
      fr: 'Plus ancien mosquée d\'Annaba, construit au 11ème siècle époque Ziride' 
    },
    coordinates: [36.9020, 7.7660],
    mood: ['quiet', 'photo'],
    wassimTip: { ar: 'يُنصح بالزيارة مع التجول في الأزقة المحيطة', fr: 'Recommandé de visiter en se promenant dans les ruelles environnantes' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/3692748/pexels-photo-3692748.jpeg'
  },
  {
    id: 'saleh-bey',
    name: { ar: 'مسجد صالح باي', fr: 'Mosquée Saleh Bey' },
    category: 'historical',
    description: { 
      ar: 'تحفة عثمانية من أواخر القرن 18 (1791-1792)، يقع بالقرب من وسط المدينة', 
      fr: 'Chef-d\'œuvre ottoman fin 18ème siècle (1791-1792), près du centre-ville' 
    },
    coordinates: [36.9015, 7.7655],
    mood: ['quiet', 'photo'],
    wassimTip: { ar: 'مآذنه وعمارته الداخلية تعكس التأثيرات الأناضولية', fr: 'Minarets et architecture intérieure reflètent influences anatoliennes' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/3243027/pexels-photo-3243027.jpeg'
  },
  {
    id: 'old-city',
    name: { ar: 'المدينة القديمة - بلاص دارم', fr: 'Vieille Ville - Place Darmes' },
    category: 'historical',
    description: { 
      ar: 'قلب عنابة التاريخي النابض، أزقة ضيقة ومنازل قديمة شهدت قروناً من التحول', 
      fr: 'Cœur historique vibrant d\'Annaba, ruelles étroites et vieilles maisons témoins de siècles' 
    },
    hours: { ar: 'في أي وقت (حيوي صباحاً ومساءً)', fr: 'À tout moment (animé matin et soir)' },
    coordinates: [36.9018, 7.7658],
    mood: ['photo', 'adventure'],
    wassimTip: { ar: 'زوايا الأزقة الضيقة، الأبواب الخشبية القديمة - مثالية للتصوير', fr: 'Angles de ruelles étroites, vieilles portes en bois - idéal pour photos' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg'
  },
  {
    id: 'revolution-square',
    name: { ar: 'ساحة الثورة', fr: 'Place de la Révolution' },
    category: 'historical',
    description: { 
      ar: 'مكان التقاء اليوم، أصلها من الحقبة الاستعمارية الفرنسية، أصبحت رمزاً للذاكرة الوطنية', 
      fr: 'Lieu de rencontre aujourd\'hui, origine époque coloniale française, devenu symbole de mémoire nationale' 
    },
    hours: { ar: 'في أي وقت، المساء الأفضل', fr: 'À tout moment, soirée meilleure' },
    coordinates: [36.9012, 7.7645],
    mood: ['photo', 'family'],
    wassimTip: { ar: 'أي جزء من الساحة جميل للتصوير', fr: 'N\'importe quelle partie de la place est belle pour photos' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg'
  },
  {
    id: 'cap-de-garde',
    name: { ar: 'المنارة وجزيرة الجنويين', fr: 'Phare et Île des Génois' },
    category: 'historical',
    description: { 
      ar: 'في كاب دي غارد، تقف المنارة شامخة، ترشد السفن منذ أكثر من قرن', 
      fr: 'Au Cap de Garde, phare se dresse haut, guidant navires depuis plus d\'un siècle' 
    },
    hours: { ar: 'نهاراً حتى 6 مساءً', fr: 'Journée jusqu\'à 18h' },
    coordinates: [36.8600, 7.7100],
    mood: ['photo', 'adventure'],
    wassimTip: { ar: 'البحر الأزرق الشديد والصخور العالية تضيف الهيبة والسحر', fr: 'Mer bleue intense et roches hautes ajoutent majesté et magie' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/911758/pexels-photo-911758.jpeg'
  }
];

export const museums = [
  {
    id: 'hippone-museum',
    name: { ar: 'متحف هيبون', fr: 'Musée d\'Hippone' },
    category: 'museum',
    description: { 
      ar: 'متحف غني بمجموعات أثرية تمتد من العصر النوميدي إلى العصر الإسلامي', 
      fr: 'Musée riche en collections archéologiques s\'étendant de l\'époque numide à l\'époque islamique' 
    },
    hours: { ar: '8 صباحاً - 6 مساءً (أيام الأسبوع)', fr: '8h-18h (jours de semaine)' },
    coordinates: [36.8805, 7.7305],
    mood: ['quiet', 'photo'],
    wassimTip: { ar: 'صور مع مشاهد الفسيفساء وصخور الحديقة', fr: 'Cadrer photos avec scènes de mosaïques et rochers du jardin' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1840623/pexels-photo-1840623.jpeg'
  },
  {
    id: 'french-institute',
    name: { ar: 'المعهد الفرنسي - معرض فني', fr: 'Institut Français - Galerie d\'Art' },
    category: 'museum',
    description: { 
      ar: 'فضاء ثقافي معاصر يستضيف معارض فنية ومناسبات مثل "شوف آرت"', 
      fr: 'Espace culturel contemporain accueillant expositions d\'art et événements comme "Choof \'Art"' 
    },
    hours: { ar: 'الاستقبال من السبت إلى الخميس، 8:30 صباحاً - 5 مساءً', fr: 'Accueil samedi-jeudi, 8h30-17h' },
    address: { ar: 'شارع بلفيدير', fr: 'Rue Belvédère' },
    coordinates: [36.8650, 7.7150],
    mood: ['photo', 'quiet'],
    wassimTip: { ar: 'صور بانورامية داخل المعرض مع الإضاءة الملونة', fr: 'Photos panoramiques à l\'intérieur avec éclairage coloré' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg'
  },
  {
    id: 'azzedine-theatre',
    name: { ar: 'المسرح الجهوي عز الدين مجوبي', fr: 'Théâtre Régional Azzedine Medjoubi' },
    category: 'museum',
    description: { 
      ar: 'تأسيسه يعود لأواخر القرن 19، بأسلوب فني آرت ديكو', 
      fr: 'Fondation fin 19ème siècle, style artistique Art Déco' 
    },
    address: { ar: 'ساحة الثورة', fr: 'Place de la Révolution' },
    coordinates: [36.9010, 7.7642],
    mood: ['photo', 'family'],
    wassimTip: { ar: 'مركز ثقافي نشط، شاهد مهرجان عنابة السينمائي المتوسطي', fr: 'Centre culturel actif, témoin du Festival du Cinéma Méditerranéen d\'Annaba' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg'
  }
];

export const naturalSites = [
  {
    id: 'seraidi',
    name: { ar: 'سرايدي - الغابة والشلالات', fr: 'Seraidi - Forêts et Cascades' },
    category: 'nature',
    description: { 
      ar: 'رحلة قصيرة بالتلفريك من عنابة إلى سرايدي توفر إطلالة بانورامية على البحر والغابة', 
      fr: 'Courte trajet en téléphérique d\'Annaba à Seraidi offre vue panoramique mer et forêt' 
    },
    coordinates: [36.8350, 7.6850],
    mood: ['quiet', 'photo', 'adventure'],
    wassimTip: { ar: 'أفضل سرايدي في الشتاء من الصيف. الهدوء والسحب والمطر في الغابة تمنح شعوراً بالسلام', fr: 'Préfère Seraidi en hiver qu\'en été. Calme, nuages et pluie en forêt donnent sensation de paix' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/28447700/pexels-photo-28447700.jpeg'
  },
  {
    id: 'bouizizi',
    name: { ar: 'بوزيزي - الجوهرة المخفية', fr: 'Bouizizi - Gemme Cachée' },
    category: 'nature',
    description: { 
      ar: 'مكان يزدهر في الشتاء. منطقة طبيعية جبلية مع مسارات جميلة', 
      fr: 'Lieu qui fleurit en hiver. Zone naturelle montagneuse avec beaux sentiers' 
    },
    coordinates: [36.8500, 7.7000],
    mood: ['quiet', 'photo', 'adventure'],
    wassimTip: { ar: 'جنة للتنفس العميق والهدوء في الشتاء', fr: 'Paradis pour respirer profondément et tranquillité en hiver' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/16092036/pexels-photo-16092036.jpeg'
  }
];

export const activities = [
  {
    id: 'farouk-land',
    name: { ar: 'فاروك لاند', fr: 'Farouk Land' },
    category: 'activity',
    type: { ar: 'حديقة ألعاب', fr: 'Parc d\'attractions' },
    address: { ar: 'شارع سيدي عشور', fr: 'Rue Sidi Achour' },
    hours: { ar: '4 مساءً - منتصف الليل', fr: '16h-minuit' },
    price: { ar: 'بالغين 100 دج، أطفال 60 دج، باقة عائلية 3000 دج', fr: 'Adultes 100 DA, Enfants 60 DA, Forfait familial 3000 DA' },
    coordinates: [36.8950, 7.7500],
    mood: ['family'],
    wassimTip: { ar: 'أكبر حديقة ألعاب في عنابة، مكان محبوب للعائلات', fr: 'Plus grand parc d\'attractions d\'Annaba, lieu apprécié des familles' },
    winterRecommended: false,
    image: 'https://images.pexels.com/photos/163007/roller-coaster-amusement-park-ride-163007.jpeg'
  },
  {
    id: 'magic-land',
    name: { ar: 'ماجيك لاند', fr: 'Magic Land' },
    category: 'activity',
    type: { ar: 'حديقة ألعاب داخلية', fr: 'Parc d\'attractions intérieur' },
    address: { ar: 'توش، طريق الفنار', fr: 'Toche, Route du Phare' },
    phone: '0774106470',
    coordinates: [36.8850, 7.7350],
    mood: ['family'],
    wassimTip: { ar: 'أول حديقة ألعاب داخلية في عنابة، مثالي للطقس الحار أو الممطر', fr: 'Premier parc intérieur d\'Annaba, idéal temps chaud ou pluvieux' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg'
  },
  {
    id: 'laser-game',
    name: { ar: 'ليزر جيم عنابة', fr: 'Laser Game Annaba' },
    category: 'activity',
    type: { ar: 'ساحة ليزر تاغ', fr: 'Arène laser tag' },
    phone: '0665333271',
    price: { ar: '1000 دج لكل ربع ساعة للشخص', fr: '1000 DA par quart d\'heure par personne' },
    coordinates: [36.9000, 7.7600],
    mood: ['adventure', 'family'],
    wassimTip: { ar: 'مجموعة من أربعة ضد أربعة مثالية لأقصى متعة', fr: 'Groupe de quatre contre quatre idéal pour maximum de plaisir' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg'
  },
  {
    id: 'bouna-ball',
    name: { ar: 'بونا بول جيم', fr: 'Bouna Ball Game' },
    category: 'activity',
    type: { ar: 'منطقة ترفيه للأطفال والشباب', fr: 'Zone de divertissement enfants et jeunes' },
    phone: '0655688760',
    coordinates: [36.9050, 7.7650],
    mood: ['family'],
    wassimTip: { ar: 'حديقة ألعاب مثالية للأطفال - تجمع بين الراحة والأمان والمتعة', fr: 'Parc de jeux idéal pour enfants - combine confort, sécurité et plaisir' },
    winterRecommended: true,
    image: 'https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg'
  }
];

export const emergencyContacts = [
  {
    id: 'chu-ibn-rochd',
    name: { ar: 'مستشفى ابن رشد الجامعي', fr: 'CHU Ibn Rochd', en: 'Ibn Rochd University Hospital' },
    type: 'hospital',
    address: { ar: '11 بوليفارد الصديق بن يحيى، عنابة', fr: '11 Boulevard Seddik Benyahia, Annaba', en: '11 Boulevard Seddik Benyahia, Annaba' },
    hours: { ar: '24/7 (طوارئ وخدمات متنوعة)', fr: '24/7 (urgences et services divers)', en: '24/7 (emergency and various services)' },
    phone: '038865151',
    coordinates: [36.8950, 7.7500],
    description: { ar: 'المستشفى الجامعي الرئيسي في عنابة - طوارئ وجراحة وجميع التخصصات', fr: 'Principal hôpital universitaire d\'Annaba - urgences, chirurgie et toutes spécialités', en: 'Main university hospital in Annaba - emergency, surgery and all specialties' }
  },
  {
    id: 'chu-dorban',
    name: { ar: 'مستشفى دوربان', fr: 'CHU Dorban', en: 'Dorban Hospital' },
    type: 'hospital',
    address: { ar: 'حي دوربان، عنابة', fr: 'Quartier Dorban, Annaba', en: 'Dorban District, Annaba' },
    hours: { ar: '24/7', fr: '24/7', en: '24/7' },
    phone: '038864000',
    coordinates: [36.8920, 7.7480],
    description: { ar: 'قسم الطوارئ والجراحة العامة', fr: 'Service d\'urgence et chirurgie générale', en: 'Emergency and general surgery department' }
  },
  {
    id: 'hopital-mere-enfant',
    name: { ar: 'مستشفى الأم والطفل', fr: 'Hôpital Mère-Enfant', en: 'Mother and Child Hospital' },
    type: 'hospital',
    address: { ar: 'طريق القالة، عنابة', fr: 'Route d\'El Kala, Annaba', en: 'El Kala Road, Annaba' },
    hours: { ar: '24/7', fr: '24/7', en: '24/7' },
    phone: '038838000',
    coordinates: [36.9010, 7.7550],
    description: { ar: 'متخصص في صحة الأم والطفل - الولادة وطب الأطفال', fr: 'Spécialisé en santé mère-enfant - maternité et pédiatrie', en: 'Specialized in mother and child health - maternity and pediatrics' }
  },
  {
    id: 'cac-oncology',
    name: { ar: 'مركز مكافحة السرطان', fr: 'Centre Anti-Cancer (CAC)', en: 'Anti-Cancer Center (CAC)' },
    type: 'hospital',
    address: { ar: 'CHU - طريق المستشفى، عنابة', fr: 'CHU - Route de l\'Hôpital, Annaba', en: 'CHU - Hospital Road, Annaba' },
    hours: { ar: '24/7', fr: '24/7', en: '24/7' },
    phone: '038865200',
    coordinates: [36.8960, 7.7510],
    description: { ar: 'مركز متخصص في علاج السرطان والعلاج الكيميائي', fr: 'Centre spécialisé en traitement du cancer et chimiothérapie', en: 'Specialized center for cancer treatment and chemotherapy' }
  },
  {
    id: 'clinique-razi',
    name: { ar: 'عيادة الرازي', fr: 'Clinique El Razi', en: 'El Razi Clinic' },
    type: 'clinic',
    address: { ar: 'شارع زعرورة العربي، وسط المدينة، عنابة', fr: 'Rue Zaroura Larbi, Centre-ville, Annaba', en: 'Zaroura Larbi Street, City Center, Annaba' },
    phone: '038840505',
    coordinates: [36.9005, 7.7620],
    description: { ar: 'عيادة خاصة متعددة التخصصات - جراحة وتشخيص', fr: 'Clinique privée multi-spécialités - chirurgie et diagnostic', en: 'Private multi-specialty clinic - surgery and diagnostics' }
  },
  {
    id: 'clinique-farabi',
    name: { ar: 'عيادة الفارابي', fr: 'Clinique El Farabi', en: 'El Farabi Clinic' },
    type: 'clinic',
    address: { ar: '21-23 شارع الإخوة شوش، البرتقال، عنابة', fr: '21-23 Rue des Frères Chouch, El Orangerie, Annaba', en: '21-23 Frères Chouch Street, El Orangerie, Annaba' },
    phone: '038834343',
    coordinates: [36.9000, 7.7600],
    description: { ar: 'عيادة طبية متعددة التخصصات مع معدات حديثة', fr: 'Clinique médicale multi-spécialités avec équipements modernes', en: 'Multi-specialty medical clinic with modern equipment' }
  },
  {
    id: 'clinique-nour',
    name: { ar: 'عيادة النور', fr: 'Clinique Nour', en: 'Nour Clinic' },
    type: 'clinic',
    address: { ar: 'حي سيدي إبراهيم، عنابة', fr: 'Cité Sidi Brahim, Annaba', en: 'Sidi Brahim District, Annaba' },
    phone: '038866600',
    coordinates: [36.8980, 7.7580],
    description: { ar: 'عيادة خاصة للجراحة والتشخيص', fr: 'Clinique privée pour chirurgie et diagnostic', en: 'Private clinic for surgery and diagnostics' }
  },
  {
    id: 'police',
    name: { ar: 'الشرطة', fr: 'Police', en: 'Police' },
    type: 'police',
    phone: '1548',
    description: { ar: 'رقم الطوارئ للشرطة - متاح 24/7', fr: 'Numéro d\'urgence police - disponible 24/7', en: 'Police emergency number - available 24/7' }
  },
  {
    id: 'civil-protection',
    name: { ar: 'الحماية المدنية', fr: 'Protection Civile', en: 'Civil Protection' },
    type: 'emergency',
    phone: '14',
    description: { ar: 'رقم الطوارئ للحماية المدنية والإسعاف', fr: 'Numéro d\'urgence protection civile et ambulance', en: 'Civil protection and ambulance emergency number' }
  },
  {
    id: 'gendarmerie',
    name: { ar: 'الدرك الوطني', fr: 'Gendarmerie Nationale', en: 'National Gendarmerie' },
    type: 'police',
    phone: '1055',
    description: { ar: 'رقم الطوارئ للدرك الوطني', fr: 'Numéro d\'urgence gendarmerie nationale', en: 'National gendarmerie emergency number' }
  }
];

export const itineraries = {
  oneDay: {
    id: '1-day',
    name: { ar: 'عنابة السريعة', fr: 'Annaba Rapide' },
    duration: { ar: 'يوم واحد', fr: '1 jour' },
    activities: [
      { time: { ar: 'الصباح', fr: 'Matin' }, activity: { ar: 'جولة في وسط المدينة (المدينة القديمة + ساحة الثورة)', fr: 'Tour du centre-ville (Vieille Ville + Place Révolution)' } },
      { time: { ar: 'إفطار', fr: 'Petit-déj' }, activity: { ar: 'قهوة في أي مقهى قريب', fr: 'Café dans un café proche' } },
      { time: { ar: 'الظهر', fr: 'Midi' }, activity: { ar: 'زيارة كاب دي غارد ثم بازيليك القديس أوغسطين للتصوير', fr: 'Visite Cap de Garde puis Basilique Saint-Augustin pour photos' } },
      { time: { ar: 'الغداء', fr: 'Déjeuner' }, activity: { ar: 'طبق تقليدي (كسكس/حريرة) في "لو جاسمين"', fr: 'Plat traditionnel (couscous/harira) au "Le Jasmin"' } },
      { time: { ar: 'المساء', fr: 'Soir' }, activity: { ar: 'رحلة قصيرة إلى عين عشير مع صور الغروب', fr: 'Courte excursion à Ain Achir avec photos coucher de soleil' } },
      { time: { ar: 'العشاء', fr: 'Dîner' }, activity: { ar: 'بيتزا أو طبق خفيف في "بروفا بيتزا"', fr: 'Pizza ou plat léger chez "Prova Pizza"' } }
    ]
  },
  twoDays: {
    id: '2-days',
    name: { ar: 'عنابة المتنوعة', fr: 'Annaba Diverse' },
    duration: { ar: 'يومان', fr: '2 jours' },
    activities: [
      { day: { ar: 'اليوم 1', fr: 'Jour 1' }, activity: { ar: 'نفس برنامج اليوم الواحد + زيارة متحف هيبون. عشاء في "دوناتيلا" في سيدي عيسى مع إطلالة بحرية', fr: 'Même programme 1 jour + visite Musée Hippo. Dîner chez "Donatella" à Sidi Aissa avec vue mer' } },
      { day: { ar: 'اليوم 2 - الصباح', fr: 'Jour 2 - Matin' }, activity: { ar: 'رحلة إلى سرايدي (بالتلفريك أو السيارة)', fr: 'Voyage à Seraidi (par téléphérique ou voiture)' } },
      { day: { ar: 'اليوم 2 - الغداء', fr: 'Jour 2 - Déjeuner' }, activity: { ar: 'شواء خفيف أو مطعم محلي في سرايدي', fr: 'BBQ léger ou restaurant local à Seraidi' } },
      { day: { ar: 'اليوم 2 - المساء', fr: 'Jour 2 - Soir' }, activity: { ar: 'استكشاف السوق المغطى (مارشيه فرانسيه) لشراء الهدايا', fr: 'Explorer marché couvert (Marché Français) pour acheter souvenirs' } },
      { day: { ar: 'اليوم 2 - العشاء', fr: 'Jour 2 - Dîner' }, activity: { ar: 'مقهى "ميغا بيتزا" مع المشروبات', fr: 'Café "Mega Pizza" avec boissons' } }
    ]
  },
  threeDays: {
    id: '3-days',
    name: { ar: 'عنابة الكاملة', fr: 'Annaba Complete' },
    duration: { ar: 'ثلاثة أيام', fr: '3 jours' },
    activities: [
      { day: { ar: 'اليوم 1', fr: 'Jour 1' }, activity: { ar: 'استكشاف وسط المدينة (بازيليك، كاب دي غارد). غداء في "ميغا". زيارة متحف هيبون مساءً', fr: 'Explorer centre-ville (Basilique, Cap de Garde). Déjeuner chez "Mega". Visite Musée Hippo soir' } },
      { day: { ar: 'اليوم 2', fr: 'Jour 2' }, activity: { ar: 'يوم كامل في سرايدي: الغابة + الشلالات + عين الببر. العودة مساءً + عشاء في "لو باروك"', fr: 'Journée complète à Seraidi: Forêt + Cascades + Ain Berber. Retour soir + dîner au "Le Baroque"' } },
      { day: { ar: 'اليوم 3', fr: 'Jour 3' }, activity: { ar: 'رحلة إلى شطايبي (شاطئ الرمال الذهبية/سيدي عكاشة). غداء: سمك طازج في مطعم محلي في شطايبي. العودة مساءً إلى فاروك لاند ثم "لاتيتيود"', fr: 'Voyage à Chetaibi (Plage Sable Doré/Sidi Akacha). Déjeuner: poisson frais restaurant local Chetaibi. Retour soir Farouk Land puis "Latitude"' } }
    ]
  },
  winter: {
    id: 'winter',
    name: { ar: 'عنابة في الشتاء... سحر مختلف', fr: 'Annaba en Hiver... Charme Différent' },
    duration: { ar: 'يوم واحد', fr: '1 jour' },
    activities: [
      { time: { ar: 'الصباح', fr: 'Matin' }, activity: { ar: 'ركوب التلفريك من وسط المدينة إلى سرايدي', fr: 'Prendre téléphérique du centre-ville à Seraidi' } },
      { time: { ar: 'الرحلة', fr: 'Excursion' }, activity: { ar: 'جولة في غابة سرايدي، ثم إلى الشلالات (الشتاء موسمها الذروة)', fr: 'Tour de forêt Seraidi, puis Cascades (hiver saison de pointe)' } },
      { time: { ar: 'الغداء', fr: 'Déjeuner' }, activity: { ar: 'طعام تقليدي في سرايدي (حريرة أو بركوكس) في مطعم محلي', fr: 'Nourriture traditionnelle à Seraidi (Harira ou Berkoks) restaurant local' } },
      { time: { ar: 'المساء', fr: 'Soir' }, activity: { ar: 'النزول إلى عنابة وزيارة بوزيزي لمشاهدة المناظر الجبلية', fr: 'Descendre à Annaba et visiter Bouizizi pour voir paysages montagneux' } },
      { time: { ar: 'العشاء', fr: 'Dîner' }, activity: { ar: 'جلسة دافئة في "سكاي لاونج" أو "الفخامة" مع القهوة أو الشاي بالنعناع، مشاهدة المطر على البحر', fr: 'Session chaleureuse au "Sky Lounge" ou "El Fakhama" avec café ou thé menthe, regarder pluie sur mer' } }
    ]
  }
};

export const transportInfo = {
  taxis: {
    ar: 'سيارات أجرة متاحة في مواقع مختلفة',
    fr: 'Taxis disponibles à divers endroits',
    fares: [
      { route: { ar: 'إلى وسط المدينة (من الألمان، البوني)', fr: 'Au centre-ville (de Les Allemands, El Bouni)' }, price: '50 دج للشخص' },
      { route: { ar: 'إلى وسط المدينة (من سيدي عمار)', fr: 'Au centre-ville (de Sidi Amar)' }, price: '70 دج للشخص' },
      { route: { ar: 'إلى سرايدي (من منطقة الأمير عبد القادر)', fr: 'À Seraidi (de zone Prince Abdel Kader)' }, price: '70-100 دج للشخص' },
      { route: { ar: 'إلى سرايدي/الغابات (من موقف سرايدي)', fr: 'À Seraidi/forêts (de parking Seraidi)' }, price: '100-150 دج للشخص' }
    ]
  },
  bus: {
    ar: 'داخل المدينة: محطة لارماكا (مقابل حياتو دوران) تخدم معظم المناطق الداخلية. التذكرة: 20 دج فقط',
    fr: 'Dans la ville: Station Larmaka (face Hayatrou Douran) dessert la plupart des zones intérieures. Billet: 20 DA seulement',
    price: '20 دج / 20 DA'
  },
  telerik: {
    ar: 'يربط وسط المدينة بسرايدي. الرحلة: حوالي 10 دقائق',
    fr: 'Relie centre-ville à Seraidi. Trajet: environ 10 minutes',
    price: '60-70 دج للشخص / 60-70 DA par personne'
  },
  carRental: {
    ar: 'متاح على نطاق واسع، خاصة في وسط المدينة (منطقة الجسر الأبيض)',
    fr: 'Largement disponible, surtout au centre-ville (zone El Jiser El Abyed)',
    priceRange: '3500-6000 دج في اليوم / 3500-6000 DA par jour'
  }
};

export const wassimProfile = {
  name: { ar: 'بن فرنان محمد وسيم', fr: 'Benfernane Mohamed Ouassim', en: 'Benfernane Mohamed Ouassim' },
  bio: {
    ar: 'أنا بن فرنان محمد وسيم شاب عنابي في 23 من عمري، ولدت وترعرعت في هذه المدينة التي أحبها جدًا، لدرجة أنني اخترتها عنوانًا لأول كتاب قمت به على الإطلاق. حاصل على اثنين بكالوريوس، وأعمل كمساعد اجتماعي للصحة العمومية في ميدان الشبه طبي، حيث أتعامل مع الشباب والكبار في السن وأفهم تحدياتهم اليومية. في الوقت نفسه، أنا طالب تخصص الترجمة التحريرية والتفسيرية باللغات الإنجليزية والعربية والفرنسية، ما يمنحني القدرة على نقل الأفكار بدقة نوعا ما واجادة للغات. أحب المعلوماتية والتطور التكنولوجي، وأسعى دائمًا لأن أكون شابًا طموحًا يقدم محتوى ممتع ومفيد للآخرين. أتمنى أن يلقى هذا الدليل إعجابكم وفائدتكم، وأن تجدوا فيه جميع المعلومات التي تستحقونها.',
    fr: 'Je suis Benfernane Mohamed Ouassim, un jeune d\'Annaba de 23 ans, né et élevé dans cette ville que j\'aime beaucoup, au point que je l\'ai choisie comme titre de mon tout premier livre. Titulaire de deux licences, je travaille comme assistant social en santé publique dans le domaine paramédical, où je traite avec les jeunes et les personnes âgées et comprends leurs défis quotidiens. En même temps, je suis étudiant en traduction écrite et interprétation dans les langues anglaise, arabe et française, ce qui me donne la capacité de transmettre des idées avec une certaine précision et maîtrise des langues. J\'aime l\'informatique et le développement technologique, et je m\'efforce toujours d\'être un jeune ambitieux qui fournit un contenu agréable et utile aux autres. J\'espère que ce guide vous plaira et vous sera utile, et que vous y trouverez toutes les informations que vous méritez.',
    en: 'I am Benfernane Mohamed Ouassim, a 23-year-old young man from Annaba, born and raised in this city that I love very much, to the point that I chose it as the title of my very first book. Holder of two bachelor\'s degrees, I work as a social assistant in public health in the paramedical field, where I deal with young people and the elderly and understand their daily challenges. At the same time, I am a student of written translation and interpretation in English, Arabic and French languages, which gives me the ability to convey ideas with some accuracy and language proficiency. I love computer science and technological development, and I always strive to be an ambitious young man who provides enjoyable and useful content to others. I hope this guide will please you and be useful to you, and that you will find in it all the information you deserve.'
  },
  quote: {
    ar: 'أفضل شخصياً سرايدي في الشتاء من الصيف. الهدوء والسحب التي تغطي الجبال ورائحة المطر في الغابة تمنحني شعوراً بالسلام لا مثيل له',
    fr: 'Je préfère personnellement Seraidi en hiver qu\'en été. Le calme, les nuages couvrant les montagnes et l\'odeur de la pluie dans la forêt me donnent un sentiment de paix sans égal',
    en: 'I personally prefer Seraidi in winter over summer. The calm, the clouds covering the mountains and the smell of rain in the forest give me an unparalleled sense of peace'
  },
  favorites: {
    beaches: ['jnan-bey', 'plage-el-louh', 'akacha'],
    restaurants: ['donatella', 'le-jasmin', 'mega-pizza'],
    cafes: ['the-throne', 'el-fakhama'],
    activities: ['farouk-land']
  }
};

// Combine all places for easy searching
export const allPlaces = [
  ...beaches,
  ...restaurants,
  ...cafes,
  ...hotels,
  ...historicalSites,
  ...museums,
  ...naturalSites,
  ...activities
];

// Mood categories for filtering
export const moodCategories = [
  { id: 'quiet', icon: '🧘', name: { ar: 'هادئ', fr: 'Calme' } },
  { id: 'family', icon: '👨‍👩‍👧', name: { ar: 'عائلي', fr: 'Familial' } },
  { id: 'photo', icon: '📸', name: { ar: 'تصوير', fr: 'Photo' } },
  { id: 'adventure', icon: '🔥', name: { ar: 'مغامرة', fr: 'Aventure' } }
];

// Search helper function
export const searchPlaces = (query, language = 'ar') => {
  const lowerQuery = query.toLowerCase();
  return allPlaces.filter(place => {
    const name = place.name[language].toLowerCase();
    const description = place.description?.[language]?.toLowerCase() || '';
    const category = place.category.toLowerCase();
    return name.includes(lowerQuery) || description.includes(lowerQuery) || category.includes(lowerQuery);
  });
};

// Filter by mood
export const filterByMood = (moodId) => {
  return allPlaces.filter(place => place.mood?.includes(moodId));
};

// Get winter recommendations
export const getWinterRecommendations = () => {
  return allPlaces.filter(place => place.winterRecommended);
};
