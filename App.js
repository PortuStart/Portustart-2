import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  Platform,
  Linking,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ==========================================
// PARTNER-LINKS & DATENBANK
// ==========================================
const AFFILIATE_LINKS = {
  eResidenceNif: 'https://e-residence.com/?via=portustart',
  eResidenceNiss: 'https://e-residence.com/?via=portustart',
  eResidenceBank: 'https://e-residence.com/?via=portustart',
  eResidenceHealth: 'https://e-residence.com/?via=portustart',
  
  getYourGuidePartnerId: 'AJWYURO',
  getYourGuideCmp: 'share_to_earn',

  italkiLang: 'https://www.italki.com/affshare?ref=af33636608',
  revolut: 'https://revolut.com/referral/?referral-code=portustart',
};

const UI_LANGUAGES = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
];

const TRANSLATOR_LANGUAGES = [
  { code: 'pt', label: 'Português', flag: '🇵🇹', voice: 'pt-PT' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', voice: 'de-DE' },
  { code: 'en', label: 'English', flag: '🇬🇧', voice: 'en-US' },
  { code: 'es', label: 'Español', flag: '🇪🇸', voice: 'es-ES' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', voice: 'fr-FR' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', voice: 'it-IT' },
];

const CITIES_METADATA = {
  lisboa: {
    lat: 38.7223,
    lng: -9.1393,
    zoom: 12,
    placesMeta: [
      { id: 'l1', img: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&q=80', query: 'Jardim da Estrela Lisbon', gygQuery: 'Estrela Garden Lisbon' },
      { id: 'l2', img: 'https://images.unsplash.com/photo-1513688285115-45a1c5847541?w=800&q=80', query: 'Castelo de Sao Jorge Lisbon', gygQuery: 'Castelo de Sao Jorge ticket' },
      { id: 'l3', img: 'https://images.unsplash.com/photo-1565217245037-3bf791837c76?w=800&q=80', query: 'Miradouro da Graca Lisbon', gygQuery: 'Alfama Lisbon tour' },
      { id: 'l4', img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80', query: 'Jeronimos Monastery Lisbon', gygQuery: 'Jeronimos Monastery ticket' },
      { id: 'l5', img: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&q=80', query: 'LX Factory Lisbon', gygQuery: 'LX Factory Lisbon tour' },
    ],
  },
  beaches: {
    lat: 38.4500,
    lng: -9.1000,
    zoom: 10,
    placesMeta: [
      { id: 'b1', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Praia da Fonte da Telha', gygQuery: 'Costa da Caparica beach' },
      { id: 'b2', img: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80', query: 'Galapos beach Arrabida', gygQuery: 'Arrabida natural park tour' },
      { id: 'b3', img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80', query: 'Carcavelos beach', gygQuery: 'Carcavelos surf lesson' },
      { id: 'b4', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80', query: 'Praia da Adraga Sintra', gygQuery: 'Sintra coastal hike' },
      { id: 'b5', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80', query: 'Ponta da Piedade Lagos', gygQuery: 'Ponta da Piedade boat tour' },
    ],
  },
};

const ENGLISH_DOCTORS = [
  {
    id: 'doc1',
    name: 'CUF Descobertas Hospital',
    city: 'Lisboa',
    specialty: 'Multidisciplinary Hospital & Emergency',
    address: 'Rua Mário Botelho Moniz 7, Lisbon',
    query: 'CUF Descobertas Hospital Lisbon',
    lat: 38.7463,
    lng: -9.1172,
    phone: '+351 210 025 200',
    desc: 'Major private hospital with fully English-speaking doctors, specialists, and 24/7 urgent care.',
  },
  {
    id: 'doc2',
    name: 'Hospital da Luz',
    city: 'Lisboa',
    specialty: 'General Practice & Specialists',
    address: 'Av. Lusíada 100, Lisbon',
    query: 'Hospital da Luz Lisbon',
    lat: 38.7514,
    lng: -9.1822,
    phone: '+351 217 104 400',
    desc: 'Extremely popular among expats. Modern facility with international patient desk and English staff.',
  },
  {
    id: 'doc3',
    name: 'HPA Saúde (Faro)',
    city: 'Algarve',
    specialty: 'Private Medical Center',
    address: 'Rua Leão Penedo, Faro',
    query: 'Hospital Particular do Algarve Faro',
    lat: 37.0194,
    lng: -7.9322,
    phone: '+351 289 885 200',
    desc: 'Top-tier medical care in the Algarve region with fluent English-speaking practitioners.',
  },
  {
    id: 'doc4',
    name: 'Hospital da Lusiada Porto',
    city: 'Porto',
    specialty: 'Emergency & General Care',
    address: 'Avenida da Boavista 3105, Porto',
    query: 'Hospital Lusiadas Porto',
    lat: 41.1621,
    lng: -8.6565,
    phone: '+351 226 090 330',
    desc: 'Leading private hospital in northern Portugal providing comprehensive English-language support.',
  },
];

const LOCALES = {
  de: {
    title: 'PortuStart',
    sub: 'Dein Relocation-Partner für Portugal',
    tabServices: 'Services',
    tabPlaces: 'Karten',
    tabTrans: 'Übersetzer',
    tabCalc: 'Gehalt',
    tabPerks: 'Deals',
    placesSectionTitle: '🇵🇹 Deine Google Maps Favoriten',
    placesSectionSub: 'Wähle aus deinen importierten Orten, Cafés und Stränden:',
    openInAppMaps: 'In Maps-App',
    swipeInstruction: '👉 Entdecke deine gespeicherten Lieblingsorte:',
    openInMapsBtn: 'Route',
    gygBtn: 'Tickets & Touren (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Portugiesisch fließend sprechen lernen',
    italkiBannerDesc: 'Finde zertifizierte Muttersprachler für 1-zu-1 Online-Unterricht auf italki.',
    italkiBtn: 'Muttersprachler finden (italki) ↗',
    
    filterExplore: 'Highlights & Kultur',
    filterAtm: 'ATMs (Multibanco)',
    filterDoctors: 'Ärzte & Kliniken',

    callDoctorBtn: 'Anrufen',
    directionBtn: 'Standort öffnen',
    emergencyTitle: '🚨 Notfall- & Behördenkontakte',

    perksSectionTitle: '🔥 Exklusive Expat-Deals & Vorteile',
    perksSectionSub: 'Spare Geld und Zeit bei unseren offiziellen Partnern mit deinen PortuStart-Vorteilen:',
    claimDealBtn: 'Deal sichern ↗',

    perk1Title: 'Revolut Expat Konto',
    perk1Badge: 'Finanzen • Gebührenfrei',
    perk1Desc: '• Keine Fremdwährungsgebühren\n• Inklusive physischer Visa-Karte\n• Perfekt für Miete & Gehalt in PT',

    perk2Title: 'e-Residence Express NIF',
    perk2Badge: 'Behörden • In 48h',
    perk2Desc: '• Ohne Vor-Ort-Termin in den Finanças\n• 100% digital & rechtssicher\n• Inklusive digitaler Signatur',

    perk3Title: 'italki Sprachkurs',
    perk3Badge: 'Sprachen • 1-on-1',
    perk3Desc: '• Muttersprachliche Portugiesisch-Lehrer\n• Flexible Online-Stunden\n• Perfekt für Alltags- & Behördendeutsch/-englisch',

    congratsTitle: '🎉 Herzlichen Glückwunsch!',
    congratsDesc: 'Du hast alle 7 Schritte deiner Start-Roadmap erfolgreich gemeistert! Du bist bereit für deinen perfekten Neuanfang in Portugal.',

    from: 'Von:',
    to: 'Nach:',
    inputLabel: 'Eingabe:',
    placeholderTrans: 'Text zum Übersetzen eingeben...',
    listenBtn: 'Anhören (TTS)',
    speakBtn: 'Sprechen (STT)',
    resultLabel: 'Übersetzungsergebnis',
    servicesTitle: '📄 Offizielle Services & Anträge',
    servicesSub: 'Beantrage deine Dokumente & Absicherung 100% digital über unseren Partner e-Residence:',
    checklistTitle: '📋 Erste 30 Tage Roadmap',
    checklistSub: 'Dein bürokratischer Ablaufplan für Portugal',
    checklistDone: 'erledigt',
    applyOnlineBtn: 'Jetzt online beantragen ↗',
    affiliateDisclosure: 'Transparenz: Über diese Links erhältst du geprüfte Express-Bearbeitung bei e-Residence. Wir erhalten eine kleine Vermittlungsprovision – für dich bleibt der Preis unverändert.',
    affiliateCards: [
      { key: 'nif', title: 'NIF (Portugiesische Steuernummer)', badge: 'Schritt 1 • Pflicht', desc: 'Der Schlüssel für Miete, SIM-Karte, Job und Bankkonto.', link: AFFILIATE_LINKS.eResidenceNif, icon: 'document-text' },
      { key: 'bank', title: 'Portugiesisches Bankkonto', badge: 'Schritt 2 • IBAN', desc: 'Eröffne ein offizielles Bankkonto bei führenden portugiesischen Banken.', link: AFFILIATE_LINKS.eResidenceBank, icon: 'card' },
      { key: 'niss', title: 'NISS (Sozialversicherungsnummer)', badge: 'Schritt 3 • Arbeit', desc: 'Notwendig für Arbeitsvertrag, Gehaltseingang und Rentenbeiträge.', link: AFFILIATE_LINKS.eResidenceNiss, icon: 'shield-checkmark' },
      { key: 'health', title: 'Internationale Krankenversicherung', badge: 'Schritt 4 • Visum & Schutz', desc: 'Visum-konforme Auslandskrankenversicherung vor dem SNS-Zugang.', link: AFFILIATE_LINKS.eResidenceHealth, icon: 'medkit' },
    ],
    calcTitle: '💶 Brutto-Netto-Gehaltsrechner',
    calcSub: 'Berechne das Netto (automatische Umrechnung bei 12 oder 14 Monatsgehältern).',
    calcGrossLabel: 'Bruttogehalt (€):',
    calcPaymentsLabel: 'Auszahlungen pro Jahr:',
    calcStatusLabel: 'Steuerklasse / Familienstand:',
    calcNetMonthly: 'Geschätztes Netto (pro Monat):',
    calcGrossRow: 'Brutto / Monat:',
    calcSSRow: 'Sozialversicherung (-11%):',
    calcIRSRow: 'IRS Steuerabzug:',
    checklist: [
      { id: 1, title: 'Steuernummer (NIF) beantragen', tip: 'Der Schlüssel für Miete, Handyvertrag, Arbeit und Bankkonto.' },
      { id: 2, title: 'Portugiesische SIM-Karte besorgen', tip: 'Notwendig für Chave Móvel Digital und Behörden-SMS.' },
      { id: 3, title: 'Bankkonto eröffnen', tip: 'Erforderlich für Gehaltseingang und Wohnungskaution.' },
      { id: 4, title: 'Krankenversicherung abschließen', tip: 'Notwendig für Visum und Übergangszeit bis zur SNS-Nummer.' },
      { id: 5, title: 'Sozialversicherungsnummer (NISS)', tip: 'Wird für Arbeitsvertrag und Rentenanspruch benötigt.' },
      { id: 6, title: 'Aufenthaltsrecht (CRUE / AIMA)', tip: 'EU-Bürger melden sich nach 3 Monaten bei der Câmara an.' },
      { id: 7, title: 'SNS-Gesundheitsnummer (Centro de Saúde)', tip: 'Zugang zum staatlichen Gesundheitssystem & Hausarzt.' },
    ],
    cities: [
      {
        id: 'lisboa',
        name: 'Lisboa & Kultur',
        tagline: 'Deine gespeicherten Sehenswürdigkeiten & Cafés in Lissabon',
        places: [
          { id: 'l1', title: 'Jardim da Estrela', category: 'City Park (4.6 ⭐)', desc: 'Wunderschöner historischer Stadtpark mit tollem Café.', tip: 'Tipp: Perfekt zum Entspannen.' },
          { id: 'l2', title: 'Castelo de São Jorge', category: 'Castle (4.5 ⭐)', desc: 'Historische Burg mit Panoramablick über ganz Lissabon.', tip: 'Tipp: Frühzeitig Tickets sichern.' },
          { id: 'l3', title: 'Miradouro da Graça', category: 'Scenic Spot (4.7 ⭐)', desc: 'Einer der beliebtesten Aussichtspunkte mit Kiosk.', tip: 'Tipp: Ideal zum Sonnenuntergang.' },
          { id: 'l4', title: 'Jerónimos Monastery', category: 'Monastery (4.4 ⭐)', desc: 'Atemberaubendes UNESCO-Weltkulturerbe in Belém.', tip: 'Tipp: Direkt Pasteis de Belém probieren.' },
          { id: 'l5', title: 'LX Factory', category: 'Art Center (4.5 ⭐)', desc: 'Kreatives Zentrum in einer alten Fabrik mit Shops & Bars.', tip: 'Tipp: Buchhandlung Ler Devagar besuchen.' },
        ],
      },
      {
        id: 'beaches',
        name: 'Strände & Natur',
        tagline: 'Deine gespeicherten Strände & Küstenorte',
        places: [
          { id: 'b1', title: 'Praia da Fonte da Telha', category: 'Beach (4.5 ⭐)', desc: 'Langer Sandstrand an der Costa da Caparica.', tip: 'Tipp: Tolle Strandrestaurants.' },
          { id: 'b2', title: 'Galapos beach', category: 'Beach (4.7 ⭐)', desc: 'Kristallklares Wasser im Naturpark Arrábida.', tip: 'Tipp: Ein absolutes Naturparadies.' },
          { id: 'b3', title: 'Carcavelos beach', category: 'Beach (4.4 ⭐)', desc: 'Der Surf-Hotspot direkt an der Zugstrecke.', tip: 'Tipp: Sehr gut mit dem Zug erreichbar.' },
          { id: 'b4', title: 'Praia da Adraga', category: 'Beach (4.8 ⭐)', desc: 'Dramatische Klippen und wilder Atlantik.', tip: 'Tipp: Geheimtipp bei Sintra.' },
          { id: 'b5', title: 'Ponta da Piedade', category: 'Scenic Spot (4.8 ⭐)', desc: 'Spektakuläre Felsformationen an der Algarve.', tip: 'Tipp: Unbedingt Bootstour machen.' },
        ],
      },
    ],
  },
  en: {
    title: 'PortuStart',
    sub: 'Your Relocation Partner for Portugal',
    tabServices: 'Services',
    tabPlaces: 'Maps',
    tabTrans: 'Translator',
    tabCalc: 'Salary',
    tabPerks: 'Deals',
    placesSectionTitle: '🇵🇹 Your Google Maps Favorites',
    placesSectionSub: 'Choose from your imported places, cafés, and beaches:',
    openInAppMaps: 'Open in Maps App',
    swipeInstruction: '👉 Explore your saved favorite spots:',
    openInMapsBtn: 'Route',
    gygBtn: 'Tickets & Tours (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Learn to speak fluent Portuguese',
    italkiBannerDesc: 'Find certified native tutors for 1-on-1 online lessons on italki.',
    italkiBtn: 'Find Native Tutors (italki) ↗',
    
    filterExplore: 'Highlights & Culture',
    filterAtm: 'ATMs (Multibanco)',
    filterDoctors: 'Doctors & Clinics',

    callDoctorBtn: 'Call',
    directionBtn: 'Open Location',
    emergencyTitle: '🚨 Emergency & Support Contacts',

    perksSectionTitle: '🔥 Exclusive Expat Deals & Perks',
    perksSectionSub: 'Save money and time with our official partners using your PortuStart benefits:',
    claimDealBtn: 'Claim Deal ↗',

    perk1Title: 'Revolut Expat Account',
    perk1Badge: 'Finance • Fee-Free',
    perk1Desc: '• Zero foreign transaction fees\n• Includes physical Visa card\n• Perfect for rent & salary in PT',

    perk2Title: 'e-Residence Express NIF',
    perk2Badge: 'Government • 48h Delivery',
    perk2Desc: '• No physical trip to Finanças required\n• 100% digital & legally binding\n• Includes secure digital signature',

    perk3Title: 'italki Language Lessons',
    perk3Badge: 'Languages • 1-on-1',
    perk3Desc: '• Certified native Portuguese tutors\n• Flexible online scheduling\n• Ideal for everyday & official communication',

    congratsTitle: '🎉 Congratulations!',
    congratsDesc: 'You have successfully completed all 7 steps of your start roadmap! You are ready for your perfect new beginning in Portugal.',

    from: 'From:',
    to: 'To:',
    inputLabel: 'Input:',
    placeholderTrans: 'Enter text to translate...',
    listenBtn: 'Listen (TTS)',
    speakBtn: 'Speech-to-Text (STT)',
    resultLabel: 'Translation Result',
    servicesTitle: '📄 Official Relocation Services',
    servicesSub: 'Order essential documents & coverage 100% online through our partner e-Residence:',
    checklistTitle: '📋 First 30 Days Roadmap',
    checklistSub: 'Your step-by-step relocation checklist',
    checklistDone: 'completed',
    applyOnlineBtn: 'Apply online now ↗',
    affiliateDisclosure: 'Transparency notice: These links route to certified express processing with e-Residence. We receive a small referral commission at no additional cost to you.',
    calcTitle: '💶 Salary Calculator',
    calcSub: 'Precise calculation based on payments and tax status.',
    calcGrossLabel: 'Gross Salary (€):',
    calcPaymentsLabel: 'Payments per year:',
    calcStatusLabel: 'Tax status / Marital status:',
    calcNetMonthly: 'Estimated Net (Monthly):',
    calcGrossRow: 'Monthly Gross:',
    calcSSRow: 'Social Security (-11%):',
    calcIRSRow: 'IRS Withholding:',
    checklist: [
      { id: 1, title: 'Get your Tax Number (NIF)', tip: 'The master key for rent, SIM card, employment and utilities.' },
      { id: 2, title: 'Get a local Portuguese SIM card', tip: 'Essential for digital government authentication (Chave Móvel).' },
      { id: 3, title: 'Open a Portuguese Bank Account', tip: 'Required for salary payouts and rental deposits.' },
      { id: 4, title: 'Get Expat Health Insurance', tip: 'Essential for visa processing and pre-SNS medical care.' },
      { id: 5, title: 'Get Social Security Number (NISS)', tip: 'Mandatory for payroll, pension and healthcare contributions.' },
      { id: 6, title: 'Residency Registration (CRUE / AIMA)', tip: 'EU citizens register at the local City Hall (Câmara) after 3 months.' },
      { id: 7, title: 'Get your SNS Healthcare Number', tip: 'Grants access to public primary care clinics (Centro de Saúde).' },
    ],
    cities: [
      {
        id: 'lisboa',
        name: 'Lisbon & Culture',
        tagline: 'Your saved sights & cafes in Lisbon',
        places: [
          { id: 'l1', title: 'Jardim da Estrela', category: 'City Park (4.6 ⭐)', desc: 'Wonderful historic city park with a great cafe.', tip: 'Tip: Perfect for relaxing.' },
          { id: 'l2', title: 'Castelo de São Jorge', category: 'Castle (4.5 ⭐)', desc: 'Historic castle with panoramic views over all of Lisbon.', tip: 'Tip: Book tickets in advance.' },
          { id: 'l3', title: 'Miradouro da Graça', category: 'Scenic Spot (4.7 ⭐)', desc: 'One of the most popular viewpoints with a kiosk.', tip: 'Tip: Ideal for sunset.' },
          { id: 'l4', title: 'Jerónimos Monastery', category: 'Monastery (4.4 ⭐)', desc: 'Breathtaking UNESCO World Heritage site in Belém.', tip: 'Tip: Try Pasteis de Belém nearby.' },
          { id: 'l5', title: 'LX Factory', category: 'Art Center (4.5 ⭐)', desc: 'Creative hub in an old factory with shops & bars.', tip: 'Tip: Visit Ler Devagar bookstore.' },
        ],
      },
      {
        id: 'beaches',
        name: 'Beaches & Nature',
        tagline: 'Your saved beaches & coastal spots',
        places: [
          { id: 'b1', title: 'Praia da Fonte da Telha', category: 'Beach (4.5 ⭐)', desc: 'Long sandy beach at Costa da Caparica.', tip: 'Tip: Great beach restaurants.' },
          { id: 'b2', title: 'Galapos beach', category: 'Beach (4.7 ⭐)', desc: 'Crystal clear water inside Arrábida Natural Park.', tip: 'Tip: An absolute nature paradise.' },
          { id: 'b3', title: 'Carcavelos beach', category: 'Beach (4.4 ⭐)', desc: 'The surfing hotspot right on the train line.', tip: 'Tip: Very easy to reach by train.' },
          { id: 'b4', title: 'Praia da Adraga', category: 'Beach (4.8 ⭐)', desc: 'Dramatic cliffs and wild Atlantic ocean.', tip: 'Tip: Insider tip near Sintra.' },
          { id: 'b5', title: 'Ponta da Piedade', category: 'Scenic Spot (4.8 ⭐)', desc: 'Spectacular rock formations in the Algarve.', tip: 'Tip: Take a boat tour.' },
        ],
      },
    ],
  },
  es: {
    title: 'PortuStart',
    sub: 'Tu socio de reubicación para Portugal',
    tabServices: 'Servicios',
    tabPlaces: 'Mapas',
    tabTrans: 'Traductor',
    tabCalc: 'Salario',
    tabPerks: 'Ofertas',
    placesSectionTitle: '🇵🇹 Tus Favoritos de Google Maps',
    placesSectionSub: 'Elige entre tus lugares, cafeterías y playas importadas:',
    openInAppMaps: 'Abrir en Maps',
    swipeInstruction: '👉 Explora tus lugares favoritos guardados:',
    openInMapsBtn: 'Ruta',
    gygBtn: 'Entradas y Tours (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Aprende a hablar portugués con fluidez',
    italkiBannerDesc: 'Encuentra profesores nativos certificados para clases particulares en italki.',
    italkiBtn: 'Buscar profesores nativos (italki) ↗',
    
    filterExplore: 'Lugares y Cultura',
    filterAtm: 'Cajeros (Multibanco)',
    filterDoctors: 'Médicos y Clínicas',

    callDoctorBtn: 'Llamar',
    directionBtn: 'Abrir ubicación',
    emergencyTitle: '🚨 Contactos de emergencia y soporte',

    perksSectionTitle: '🔥 Ofertas y ventajas exclusivas para expatriados',
    perksSectionSub: 'Ahorra dinero y tiempo con nuestros socios oficiales usando tus beneficios de PortuStart:',
    claimDealBtn: 'Obtener oferta ↗',

    perk1Title: 'Cuenta Expat Revolut',
    perk1Badge: 'Finanzas • Sin comisiones',
    perk1Desc: '• Cero comisiones por cambio de divisa\n• Incluye tarjeta Visa física\n• Ideal para alquiler y salario en PT',

    perk2Title: 'NIF Express e-Residence',
    perk2Badge: 'Gobierno • En 48h',
    perk2Desc: '• Sin necesidad de ir a Finanças\n• 100% digital y legalmente válido\n• Incluye firma digital segura',

    perk3Title: 'Clases de idiomas italki',
    perk3Badge: 'Idiomas • 1 a 1',
    perk3Desc: '• Profesores nativos de portugués certificados\n• Horarios flexibles online\n• Ideal para trámites y día a día',

    congratsTitle: '🎉 ¡Felicitaciones!',
    congratsDesc: '¡Has completado con éxito los 7 pasos de tu hoja de ruta! Estás listo para tu nuevo comienzo en Portugal.',

    from: 'De:',
    to: 'A:',
    inputLabel: 'Entrada:',
    placeholderTrans: 'Introduce texto a traducir...',
    listenBtn: 'Escuchar (TTS)',
    speakBtn: 'Voz a texto (STT)',
    resultLabel: 'Resultado de traducción',
    servicesTitle: '📄 Servicios y trámites oficiales',
    servicesSub: 'Solicita documentos esenciales 100% online a través de nuestro socio e-Residence:',
    checklistTitle: '📋 Hoja de ruta primeros 30 días',
    checklistSub: 'Tu plan de reubicación paso a paso',
    checklistDone: 'completado',
    applyOnlineBtn: 'Solicitar online ahora ↗',
    affiliateDisclosure: 'Transparencia: Estos enlaces dirigen a un procesamiento exprés certificado con e-Residence. Recibimos una pequeña comisión sin coste adicional para ti.',
    calcTitle: '💶 Calculadora de salario',
    calcSub: 'Cálculo estimado según deducciones en Portugal.',
    calcGrossLabel: 'Salario bruto (€):',
    calcPaymentsLabel: 'Pagos al año:',
    calcStatusLabel: 'Estado fiscal / Situación familiar:',
    calcNetMonthly: 'Neto estimado (mensual):',
    calcGrossRow: 'Bruto mensual:',
    calcSSRow: 'Seguridad Social (-11%):',
    calcIRSRow: 'Retención IRS:',
    checklist: [
      { id: 1, title: 'Solicitar número fiscal (NIF)', tip: 'La clave para alquileres, SIM, trabajo y suministros.' },
      { id: 2, title: 'Conseguir tarjeta SIM portuguesa', tip: 'Esencial para autenticación digital (Chave Móvel).' },
      { id: 3, title: 'Abrir cuenta bancaria portuguesa', tip: 'Requerida para cobrar el salario y depósitos de alquiler.' },
      { id: 4, title: 'Contratar seguro médico de expatriado', tip: 'Esencial para el visado y atención previa al SNS.' },
      { id: 5, title: 'Obtener número de Seguridad Social (NISS)', tip: 'Obligatorio para contratos y pensiones.' },
      { id: 6, title: 'Registro de residencia (CRUE / AIMA)', tip: 'Los ciudadanos de la UE se registran en la Câmara tras 3 meses.' },
      { id: 7, title: 'Obtener número de sanidad SNS', tip: 'Acceso a centros de salud públicos y médico de cabecera.' },
    ],
    cities: [
      {
        id: 'lisboa',
        name: 'Lisboa y Cultura',
        tagline: 'Tus monumentos y cafés guardados en Lisboa',
        places: [
          { id: 'l1', title: 'Jardim da Estrela', category: 'City Park (4.6 ⭐)', desc: 'Maravilloso parque histórico con una gran cafetería.', tip: 'Consejo: Perfecto para relajarse.' },
          { id: 'l2', title: 'Castelo de São Jorge', category: 'Castle (4.5 ⭐)', desc: 'Castillo histórico con vistas panorámicas de Lisboa.', tip: 'Consejo: Reserva entradas con antelación.' },
          { id: 'l3', title: 'Miradouro da Graça', category: 'Scenic Spot (4.7 ⭐)', desc: 'Uno de los miradores más populares con quiosco.', tip: 'Consejo: Ideal para el atardecer.' },
          { id: 'l4', title: 'Jerónimos Monastery', category: 'Monastery (4.4 ⭐)', desc: 'Impresionante monumento patrimonio de la UNESCO.', tip: 'Consejo: Prueba los Pastéis de Belém.' },
          { id: 'l5', title: 'LX Factory', category: 'Art Center (4.5 ⭐)', desc: 'Centro creativo en una antigua fábrica con tiendas y bares.', tip: 'Consejo: Visita la librería Ler Devagar.' },
        ],
      },
      {
        id: 'beaches',
        name: 'Playas y Naturaleza',
        tagline: 'Tus playas y zonas costeras guardadas',
        places: [
          { id: 'b1', title: 'Praia da Fonte da Telha', category: 'Beach (4.5 ⭐)', desc: 'Larga playa de arena en Costa da Caparica.', tip: 'Consejo: Excelentes restaurantes de playa.' },
          { id: 'b2', title: 'Galapos beach', category: 'Beach (4.7 ⭐)', desc: 'Agua cristalina dentro del Parque Natural de Arrábida.', tip: 'Consejo: Un auténtico paraíso natural.' },
          { id: 'b3', title: 'Carcavelos beach', category: 'Beach (4.4 ⭐)', desc: 'El punto clave de surf directo en la línea de tren.', tip: 'Consejo: Muy fácil llegar en tren.' },
          { id: 'b4', title: 'Praia da Adraga', category: 'Beach (4.8 ⭐)', desc: 'Acantilados dramáticos y océano Atlántico salvaje.', tip: 'Consejo: Joya escondida cerca de Sintra.' },
          { id: 'b5', title: 'Ponta da Piedade', category: 'Scenic Spot (4.8 ⭐)', desc: 'Espectaculares formaciones rocosas en el Algarve.', tip: 'Consejo: Haz un tour en barco.' },
        ],
      },
    ],
  },
  fr: {
    title: 'PortuStart',
    sub: 'Votre partenaire de relocalisation pour le Portugal',
    tabServices: 'Services',
    tabPlaces: 'Cartes',
    tabTrans: 'Traducteur',
    tabCalc: 'Salaire',
    tabPerks: 'Bons plans',
    placesSectionTitle: '🇵🇹 Vos Favoris Google Maps',
    placesSectionSub: 'Choisissez parmi vos lieux, cafés et plages importés :',
    openInAppMaps: 'Ouvrir dans Plans',
    swipeInstruction: '👉 Découvrez vos lieux favoris enregistrés :',
    openInMapsBtn: 'Itinéraire',
    gygBtn: 'Billets et visites (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Apprenez à parler couramment le portugais',
    italkiBannerDesc: 'Trouvez des tuteurs natifs certifiés pour des cours particuliers sur italki.',
    italkiBtn: 'Trouver des tuteurs natifs (italki) ↗',
    
    filterExplore: 'Sites & Culture',
    filterAtm: 'DAB (Multibanco)',
    filterDoctors: 'Médecins & Cliniques',

    callDoctorBtn: 'Appeler',
    directionBtn: 'Ouvrir l’emplacement',
    emergencyTitle: '🚨 Contacts d’urgence et d’assistance',

    perksSectionTitle: '🔥 Offres et avantages exclusifs pour expatriés',
    perksSectionSub: 'Économisez du temps et de l’argent auprès de nos partenaires officiels grâce à vos avantages PortuStart :',
    claimDealBtn: 'Profiter de l’offre ↗',

    perk1Title: 'Compte Expat Revolut',
    perk1Badge: 'Finance • Sans frais',
    perk1Desc: '• Zéro frais de change à l’étranger\n• Carte Visa physique incluse\n• Idéal pour le loyer et salaire au PT',

    perk2Title: 'NIF Express e-Residence',
    perk2Badge: 'Administration • En 48h',
    perk2Desc: '• Sans déplacement aux Finanças\n• 100% numérique et juridiquement valide\n• Signature numérique sécurisée incluse',

    perk3Title: 'Cours de langues italki',
    perk3Badge: 'Langues • 1-sur-1',
    perk3Desc: '• Professeurs natifs de portugais certifiés\n• Horaires en ligne flexibles\n• Idéal pour le quotidien et les démarches',

    congratsTitle: '🎉 Félicitations !',
    congratsDesc: 'Vous avez terminé avec succès les 7 étapes de votre feuille de route ! Vous êtes prêt pour votre nouveau départ au Portugal.',

    from: 'De :',
    to: 'À :',
    inputLabel: 'Saisie :',
    placeholderTrans: 'Entrez le texte à traduire...',
    listenBtn: 'Écouter (TTS)',
    speakBtn: 'Parler (STT)',
    resultLabel: 'Résultat de la traduction',
    servicesTitle: '📄 Services officiels et démarches',
    servicesSub: 'Commandez vos documents essentiels 100% en ligne via notre partenaire e-Residence :',
    checklistTitle: '📋 Feuille de route 30 premiers jours',
    checklistSub: 'Votre plan de relocalisation étape par étape',
    checklistDone: 'terminé',
    applyOnlineBtn: 'Demander en ligne ↗',
    affiliateDisclosure: 'Transparence : Ces liens redirigent vers un traitement express certifié avec e-Residence. Nous recevons une petite commission sans coût supplémentaire pour vous.',
    calcTitle: '💶 Calculateur de salaire',
    calcSub: 'Calcul estimé basé sur les déductions standard au Portugal.',
    calcGrossLabel: 'Salaire brut (€) :',
    calcPaymentsLabel: 'Versements par an :',
    calcStatusLabel: 'Statut fiscal / Situation familiale :',
    calcNetMonthly: 'Net estimé (par mois) :',
    calcGrossRow: 'Brut mensuel :',
    calcSSRow: 'Sécurité Sociale (-11%) :',
    calcIRSRow: 'Retenue IRS :',
    checklist: [
      { id: 1, title: 'Obtenir votre numéro fiscal (NIF)', tip: 'La clé pour le loyer, la carte SIM, l’emploi et les services.' },
      { id: 2, title: 'Obtenir une carte SIM portugaise', tip: 'Essentiel pour l’authentification numérique (Chave Móvel).' },
      { id: 3, title: 'Ouvrir un compte bancaire portugais', tip: 'Requis pour le versement du salaire et la caution.' },
      { id: 4, title: 'Souscrire une assurance santé ex-pat', tip: 'Essentiel pour le visa et la période avant le SNS.' },
      { id: 5, title: 'Obtenir le numéro de Sécurité Sociale (NISS)', tip: 'Obligatoire pour la paie et les cotisations retraite.' },
      { id: 6, title: 'Enregistrement de résidence (CRUE / AIMA)', tip: 'Les citoyens de l’UE s’inscrivent à la Câmara après 3 mois.' },
      { id: 7, title: 'Obtenir votre numéro de santé SNS', tip: 'Accès aux centres de santé publics et médecin traitant.' },
    ],
    cities: [
      {
        id: 'lisboa',
        name: 'Lisbonne & Culture',
        tagline: 'Vos monuments et cafés enregistrés à Lisbonne',
        places: [
          { id: 'l1', title: 'Jardim da Estrela', category: 'City Park (4.6 ⭐)', desc: 'Magnifique parc historique avec un super café.', tip: 'Conseil : Idéal pour se détendre.' },
          { id: 'l2', title: 'Castelo de São Jorge', category: 'Castle (4.5 ⭐)', desc: 'Château historique offrant une vue panoramique sur Lisbonne.', tip: 'Conseil : Réservez à l’avance.' },
          { id: 'l3', title: 'Miradouro da Graça', category: 'Scenic Spot (4.7 ⭐)', desc: 'L’un des points de vue les plus populaires avec kiosque.', tip: 'Conseil : Idéal au coucher du soleil.' },
          { id: 'l4', title: 'Jerónimos Monastery', category: 'Monastery (4.4 ⭐)', desc: 'Chef-d’œuvre mondial de l’UNESCO à Belém.', tip: 'Conseil : Goûtez les Pasteis de Belém.' },
          { id: 'l5', title: 'LX Factory', category: 'Art Center (4.5 ⭐)', desc: 'Centre créatif dans une ancienne usine avec boutiques et bars.', tip: 'Conseil : Visitez la librairie Ler Devagar.' },
        ],
      },
      {
        id: 'beaches',
        name: 'Plages & Nature',
        tagline: 'Vos plages et zones côtières enregistrées',
        places: [
          { id: 'b1', title: 'Praia da Fonte da Telha', category: 'Beach (4.5 ⭐)', desc: 'Longue plage de sable à Costa da Caparica.', tip: 'Conseil : Superbes restaurants de plage.' },
          { id: 'b2', title: 'Galapos beach', category: 'Beach (4.7 ⭐)', desc: 'Eau cristalline au cœur du parc naturel d’Arrábida.', tip: 'Conseil : Un véritable paradis naturel.' },
          { id: 'b3', title: 'Carcavelos beach', category: 'Beach (4.4 ⭐)', desc: 'Le spot de surf directement sur la ligne de train.', tip: 'Conseil : Très facile d’accès en train.' },
          { id: 'b4', title: 'Praia da Adraga', category: 'Beach (4.8 ⭐)', desc: 'Falaises spectaculaires et océan Atlantique sauvage.', tip: 'Conseil : Trésor caché près de Sintra.' },
          { id: 'b5', title: 'Ponta da Piedade', category: 'Scenic Spot (4.8 ⭐)', desc: 'Formations rocheuses spectaculaires en Algarve.', tip: 'Conseil : Faites une excursion en bateau.' },
        ],
      },
    ],
  },
  it: {
    title: 'PortuStart',
    sub: 'Il tuo partner di trasferimento per il Portogallo',
    tabServices: 'Servizi',
    tabPlaces: 'Mappe',
    tabTrans: 'Traduttore',
    tabCalc: 'Stipendio',
    tabPerks: 'Offerte',
    placesSectionTitle: '🇵🇹 I tuoi Preferiti di Google Maps',
    placesSectionSub: 'Scegli tra i tuoi luoghi, caffè e spiagge importati:',
    openInAppMaps: 'Apri in Maps',
    swipeInstruction: '👉 Esplora i tuoi luoghi preferiti salvati:',
    openInMapsBtn: 'Percorso',
    gygBtn: 'Biglietti e tour (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Impara a parlare portogruese fluentemente',
    italkiBannerDesc: 'Trova insegnanti madrelingua certificati per lezioni individuali su italki.',
    italkiBtn: 'Trova insegnanti madrelingua (italki) ↗',
    
    filterExplore: 'Luoghi e Cultura',
    filterAtm: 'ATM (Multibanco)',
    filterDoctors: 'Medici e Cliniche',

    callDoctorBtn: 'Chiama',
    directionBtn: 'Apri posizione',
    emergencyTitle: '🚨 Contatti di emergenza e supporto',

    perksSectionTitle: '🔥 Offerte e vantaggi esclusivi per expat',
    perksSectionSub: 'Risparmia tempo e denaro con i nostri partner ufficiali usando i tuoi benefici PortuStart:',
    claimDealBtn: 'Ottieni offerta ↗',

    perk1Title: 'Conto Expat Revolut',
    perk1Badge: 'Finanza • Senza commissioni',
    perk1Desc: '• Zero commissioni di cambio valuta\n• Include carta Visa fisica\n• Ideale per affitto e stipendio in PT',

    perk2Title: 'NIF Express e-Residence',
    perk2Badge: 'Governo • In 48h',
    perk2Desc: '• Senza recarsi fisicamente alle Finanças\n• 100% digitale e legalmente valido\n• Include firma digitale sicura',

    perk3Title: 'Lezioni di lingua italki',
    perk3Badge: 'Lingue • 1 a 1',
    perk3Desc: '• Insegnanti madrelingua di portogruese certificati\n• Orari online flessibili\n• Ideale per la vita quotidiana e burocrazia',

    congratsTitle: '🎉 Congratulazioni!',
    congratsDesc: 'Hai completato con successo tutti i passaggi della roadmap!',

    from: 'Da:',
    to: 'A:',
    inputLabel: 'Inserimento:',
    placeholderTrans: 'Inserisci testo da tradurre...',
    listenBtn: 'Ascolta (TTS)',
    speakBtn: 'Parla (STT)',
    resultLabel: 'Risultato della traduzione',
    servicesTitle: '📄 Servizi e pratiche ufficiali',
    servicesSub: 'Richiedi documenti essenziali 100% online tramite il nostro partner e-Residence:',
    checklistTitle: '📋 Roadmap primi 30 giorni',
    checklistSub: 'Il tuo piano di trasferimento passo dopo passo',
    checklistDone: 'completato',
    applyOnlineBtn: 'Richiedi online ora ↗',
    affiliateDisclosure: 'Trasparenza: Questi link reindirizzano a un’elaborazione express certificata con e-Residence. Riceviamo una piccola commissione senza costi aggiuntivi per te.',
    calcTitle: '💶 Calcolatore stipendio',
    calcSub: 'Calcolo stimato basato sulle trattenute in Portogallo.',
    calcGrossLabel: 'Stipendio lordo (€):',
    calcPaymentsLabel: 'Mensilità all’anno:',
    calcStatusLabel: 'Regime fiscale / Stato civile:',
    calcNetMonthly: 'Netto stimato (mensile):',
    calcGrossRow: 'Lordo mensile:',
    calcSSRow: 'Previdenza Sociale (-11%):',
    calcIRSRow: 'Trattenuta IRS:',
    checklist: [
      { id: 1, title: 'Ottieni il codice fiscale (NIF)', tip: 'La chiave per affitto, SIM, lavoro e utenze.' },
      { id: 2, title: 'Procura una scheda SIM portoghese', tip: 'Essenziale per l’autenticazione digitale (Chave Móvel).' },
      { id: 3, title: 'Apri un conto bancario portoghese', tip: 'Richiesto per accredito stipendio e cauzione affitto.' },
      { id: 4, title: 'Stipula un’assicurazione sanitaria expat', tip: 'Essenziale per il visto e l’assistenza pre-SNS.' },
      { id: 5, title: 'Ottieni il numero di Previdenza Sociale (NISS)', tip: 'Obbligatorio per busta paga e contributi.' },
      { id: 6, title: 'Registrazione residenza (CRUE / AIMA)', tip: 'I cittadini UE si registrano in Câmara dopo 3 mesi.' },
      { id: 7, title: 'Ottieni il numero sanitario SNS', tip: 'Accesso a centri sanitari pubblici e medico di base.' },
    ],
    cities: [
      {
        id: 'lisboa',
        name: 'Lisbona e Cultura',
        tagline: 'I tuoi monumenti e caffè salvati a Lisbona',
        places: [
          { id: 'l1', title: 'Jardim da Estrela', category: 'City Park (4.6 ⭐)', desc: 'Meraviglioso parco storico con un ottimo caffè.', tip: 'Consiglio: Perfetto per rilassarsi.' },
          { id: 'l2', title: 'Castelo de São Jorge', category: 'Castle (4.5 ⭐)', desc: 'Storico castello con vista panoramica su tutta Lisbona.', tip: 'Consiglio: Prenota i biglietti in anticipo.' },
          { id: 'l3', title: 'Miradouro da Graça', category: 'Scenic Spot (4.7 ⭐)', desc: 'Uno dei punti panoramici più amati con chiosco.', tip: 'Consiglio: Ideale al tramonto.' },
          { id: 'l4', title: 'Jerónimos Monastery', category: 'Monastery (4.4 ⭐)', desc: 'Straordinario patrimonio mondiale UNESCO a Belém.', tip: 'Consiglio: Assaggia i Pasteis de Belém.' },
          { id: 'l5', title: 'LX Factory', category: 'Art Center (4.5 ⭐)', desc: 'Polo creativo in una vecchia fabbrica con negozi e bar.', tip: 'Consiglio: Visita la libreria Ler Devagar.' },
        ],
      },
      {
        id: 'beaches',
        name: 'Spiagge e Natura',
        tagline: 'Le tue spiagge e zone costiere salvate',
        places: [
          { id: 'b1', title: 'Praia da Fonte da Telha', category: 'Beach (4.5 ⭐)', desc: 'Lunga spiaggia di sabbia a Costa da Caparica.', tip: 'Consiglio: Ottimi ristoranti sulla spiaggia.' },
          { id: 'b2', title: 'Galapos beach', category: 'Beach (4.7 ⭐)', desc: 'Acqua cristallina all’interno del Parco Naturale di Arrábida.', tip: 'Consiglio: Un vero paradiso naturale.' },
          { id: 'b3', title: 'Carcavelos beach', category: 'Beach (4.4 ⭐)', desc: 'L’hotspot del surf direttamente sulla linea ferroviaria.', tip: 'Consiglio: Comodamente raggiungibile in treno.' },
          { id: 'b4', title: 'Praia da Adraga', category: 'Beach (4.8 ⭐)', desc: 'Scogliere spettacolari e oceano Atlantico selvaggio.', tip: 'Consiglio: Un gioiello nascosto vicino a Sintra.' },
          { id: 'b5', title: 'Ponta da Piedade', category: 'Scenic Spot (4.8 ⭐)', desc: 'Spettacolari formazioni rocciose in Algarve.', tip: 'Consiglio: Fai un giro in barca.' },
        ],
      },
    ],
  },
};

const EMERGENCIES = [
  { name: 'Notruf (Polizei & Krankenwagen)', num: '112', icon: 'flame', color: '#DC2626', desc: 'Zentraler EU-Notruf für Notfälle.' },
  { name: 'SNS 24 (Gesundheitshotline)', num: '808242424', icon: 'medkit', color: '#0F5132', desc: 'Medizinische Ersteinschätzung vor Klinikbesuch.' },
  { name: 'Linha Migrante (AIMA)', num: '218106196', icon: 'people', color: '#0284C7', desc: 'Auskünfte zu Einwanderung & Dokumenten.' },
];

export default function App() {
  const [appLang, setAppLang] = useState('de');
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const [selectedCityId, setSelectedCityId] = useState('lisboa');
  const [activePlaceFilter, setActivePlaceFilter] = useState('explore');

  const t = LOCALES[appLang] || LOCALES['de'];

  const EXPAT_PERKS = [
    {
      id: 'perk1',
      title: t.perk1Title,
      badge: t.perk1Badge,
      desc: t.perk1Desc,
      link: AFFILIATE_LINKS.revolut,
      icon: 'card',
      img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
    },
    {
      id: 'perk2',
      title: t.perk2Title,
      badge: t.perk2Badge,
      desc: t.perk2Desc,
      link: AFFILIATE_LINKS.eResidenceNif,
      icon: 'document-text',
      img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&q=80',
    },
    {
      id: 'perk3',
      title: t.perk3Title,
      badge: t.perk3Badge,
      desc: t.perk3Desc,
      link: AFFILIATE_LINKS.italkiLang,
      icon: 'school',
      img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    },
  ];

  const [checkedMap, setCheckedMap] = useState({});
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('de');
  const [targetLang, setTargetLang] = useState('pt');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [grossInput, setGrossInput] = useState('1500');
  
  const [paymentsCount, setPaymentsCount] = useState('14');
  const [taxStatus, setTaxStatus] = useState('single');
  const [calcResult, setCalcResult] = useState(null);

  // AUTOMATISCHE ÜBERSETZUNG BEIM TIPPEN (MIT DEBOUNCE)
  useEffect(() => {
    if (!inputText.trim()) {
      setTranslatedText('');
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText.trim())}&langpair=${sourceLang}|${targetLang}`);
        const data = await res.json();
        if (data && data.responseData && data.responseData.translatedText) {
          setTranslatedText(data.responseData.translatedText);
        } else {
          setTranslatedText('Übersetzungsfehler aufgetreten.');
        }
      } catch {
        setTranslatedText('Netzwerkfehler beim Übersetzen.');
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [inputText, sourceLang, targetLang]);

  // AUTOMATISCHE GEHALTSBERECHNUNG BEI ÄNDERUNGEN
  useEffect(() => {
    let monthlyBase = parseFloat(grossInput) || 0;
    if (monthlyBase <= 0) {
      setCalcResult(null);
      return;
    }

    if (paymentsCount === '12') {
      const annualTotal = monthlyBase * 14; 
      monthlyBase = annualTotal / 12; 
    }

    const ss = monthlyBase * 0.11;
    let irsFactor = taxStatus === 'single' ? 0.18 : taxStatus === 'married_1' ? 0.13 : 0.10;
    if (paymentsCount === '12') irsFactor += 0.03;
    const irs = monthlyBase * irsFactor;
    const net = monthlyBase - ss - irs;
    
    setCalcResult({
      gross: monthlyBase.toFixed(2),
      ss: ss.toFixed(2),
      irs: irs.toFixed(2),
      irsPercent: (irsFactor * 100).toFixed(0),
      netMonthly: net.toFixed(2),
      netAnnual: (net * parseInt(paymentsCount)).toFixed(2)
    });
  }, [grossInput, paymentsCount, taxStatus]);

  const currentCityText = t.cities.find((c) => c.id === selectedCityId) || t.cities[0];
  const currentCityMeta = CITIES_METADATA[currentCityText.id] || CITIES_METADATA['lisboa'];

  const dynamicPlaces = currentCityText.places.map((place, index) => {
    const meta = currentCityMeta.placesMeta[index] || currentCityMeta.placesMeta[0];
    return {
      ...place,
      img: meta.img,
      query: meta.query,
      gygQuery: meta.gygQuery || place.title,
    };
  });

  const toggleChecklistItem = (id) => {
    setCheckedMap({ ...checkedMap, [id]: !checkedMap[id] });
  };

  const completedCount = t.checklist.filter((item) => checkedMap[item.id]).length;
  const allCompleted = completedCount === t.checklist.length;

  const dialNumber = (number) => {
    Linking.openURL(`tel:${number}`).catch(() => Alert.alert('Info', `Nummer wählen: ${number}`));
  };

  const openUrl = (url) => {
    Linking.openURL(url).catch(() => Alert.alert('Fehler', 'Link konnte nicht geöffnet werden.'));
  };

  const openGetYourGuide = (query) => {
    const partnerParam = `&partner_id=${AFFILIATE_LINKS.getYourGuidePartnerId}&cmp=${AFFILIATE_LINKS.getYourGuideCmp}`;
    const gygUrl = `https://www.getyourguide.com/s/?q=${encodeURIComponent(query + ' Portugal')}${partnerParam}`;
    openUrl(gygUrl);
  };

  const openItalki = () => {
    openUrl(AFFILIATE_LINKS.italkiLang);
  };

  const playAudio = (text, langCode = 'pt') => {
    if (!text) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voiceObj = TRANSLATOR_LANGUAGES.find((l) => l.code === langCode);
      utterance.lang = voiceObj ? voiceObj.voice : 'pt-PT';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      Alert.alert('Audio (TTS)', `🗣 "${text}"`);
    }
  };

  const handleSpeechToText = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = sourceLang === 'pt' ? 'pt-PT' : sourceLang === 'de' ? 'de-DE' : 'en-US';
      recognition.onstart = () => Alert.alert('STT', 'Mikrofon aktiv – bitte sprechen...');
      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setInputText(speechResult);
      };
      recognition.onerror = () => Alert.alert('Fehler', 'Spracherkennung fehlgeschlagen.');
      recognition.start();
    } else {
      Alert.alert('Speech-to-Text (STT)', 'Mikrofon-Eingabe: Bitte Text manuell eingeben.');
    }
  };

  const getMapEmbedUrl = () => {
    if (activePlaceFilter === 'atm') {
      return `https://maps.google.com/maps?q=Multibanco+Portugal&z=12&output=embed`;
    }
    if (activePlaceFilter === 'doctors') {
      return `https://maps.google.com/maps?q=Hospital+Lisbon+Porto+Algarve&z=7&output=embed`;
    }
    return `https://maps.google.com/maps?q=${currentCityMeta.lat},${currentCityMeta.lng}&z=${currentCityMeta.zoom}&output=embed`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F5132" />
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1594897030264-ab7d4efefc87?w=200&q=80' }} style={styles.appHeaderLogo} />
              <View>
                <Text style={styles.headerTitle}>{t.title}</Text>
                <Text style={styles.headerSubtitle}>{t.sub}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.langSwitchHeaderBtn} onPress={() => setLangModalVisible(true)}>
              <Ionicons name="globe-outline" size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.langSwitchHeaderText}>
                {UI_LANGUAGES.find((l) => l.code === appLang)?.flag} {appLang.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5-FACH MENÜLEISTE */}
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'services' && styles.tabButtonActive]} onPress={() => setActiveTab('services')}>
              <Ionicons name="briefcase" size={12} color={activeTab === 'services' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'services' && styles.tabTextActive]}>{t.tabServices}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabButton, activeTab === 'places' && styles.tabButtonActive]} onPress={() => setActiveTab('places')}>
              <Ionicons name="map" size={12} color={activeTab === 'places' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'places' && styles.tabTextActive]}>{t.tabPlaces}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabButton, activeTab === 'trans' && styles.tabButtonActive]} onPress={() => setActiveTab('trans')}>
              <Ionicons name="chatbubbles" size={12} color={activeTab === 'trans' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'trans' && styles.tabTextActive]}>{t.tabTrans}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabButton, activeTab === 'calc' && styles.tabButtonActive]} onPress={() => setActiveTab('calc')}>
              <Ionicons name="calculator" size={12} color={activeTab === 'calc' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'calc' && styles.tabTextActive]}>{t.tabCalc}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabButton, activeTab === 'perks' && styles.tabButtonActive]} onPress={() => setActiveTab('perks')}>
              <Ionicons name="gift" size={12} color={activeTab === 'perks' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'perks' && styles.tabTextActive]}>{t.tabPerks}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TAB 1: SERVICES */}
        {activeTab === 'services' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <View style={styles.checklistHeaderRow}>
                <View>
                  <Text style={styles.sectionHeaderTitle}>{t.checklistTitle}</Text>
                  <Text style={styles.subText}>{t.checklistSub}</Text>
                </View>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>{completedCount} / {t.checklist.length} {t.checklistDone}</Text>
                </View>
              </View>

              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${(completedCount / t.checklist.length) * 100}%` }]} />
              </View>

              {allCompleted && (
                <View style={styles.congratsBanner}>
                  <Ionicons name="trophy" size={24} color="#0F5132" style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.congratsTitle}>{t.congratsTitle}</Text>
                    <Text style={styles.congratsDesc}>{t.congratsDesc}</Text>
                  </View>
                </View>
              )}

              {t.checklist.map((item) => {
                const isDone = !!checkedMap[item.id];
                return (
                  <TouchableOpacity key={item.id} style={[styles.checklistItem, isDone && styles.checklistItemDone]} onPress={() => toggleChecklistItem(item.id)}>
                    <Ionicons name={isDone ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={isDone ? '#0F5132' : '#94A3B8'} style={{ marginRight: 10, marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.checklistText, isDone && styles.checklistTextDone]}>{item.title}</Text>
                      <Text style={styles.checklistTip}>{item.tip}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>{t.servicesTitle}</Text>
              <Text style={styles.subText}>{t.servicesSub}</Text>

              {t.affiliateCards.map((srv) => (
                <View key={srv.key} style={styles.affiliateServiceCard}>
                  <View style={styles.affiliateTopRow}>
                    <View style={styles.affiliateIconBadge}>
                      <Ionicons name={srv.icon} size={20} color="#0F5132" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.affiliateBadgeText}>{srv.badge}</Text>
                      <Text style={styles.affiliateTitle}>{srv.title}</Text>
                    </View>
                  </View>
                  <Text style={styles.affiliateDesc}>{srv.desc}</Text>
                  <TouchableOpacity style={styles.affiliateActionBtn} onPress={() => openUrl(srv.link)}>
                    <Text style={styles.affiliateActionBtnText}>{t.applyOnlineBtn}</Text>
                    <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              ))}
              <Text style={styles.disclosureText}>{t.affiliateDisclosure}</Text>
            </View>
          </ScrollView>
        )}

        {/* TAB 2: KARTEN */}
        {activeTab === 'places' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>{t.placesSectionTitle}</Text>
              <Text style={styles.subText}>{t.placesSectionSub}</Text>

              <View style={styles.filterRow}>
                <TouchableOpacity 
                  style={[styles.filterChip, activePlaceFilter === 'explore' && styles.filterChipActive]} 
                  onPress={() => setActivePlaceFilter('explore')}
                >
                  <Ionicons name="compass" size={14} color={activePlaceFilter === 'explore' ? '#0F5132' : '#64748B'} style={{ marginRight: 4 }} />
                  <Text style={[styles.filterChipText, activePlaceFilter === 'explore' && styles.filterChipTextActive]}>{t.filterExplore}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.filterChip, activePlaceFilter === 'atm' && styles.filterChipActive]} 
                  onPress={() => setActivePlaceFilter('atm')}
                >
                  <Ionicons name="card" size={14} color={activePlaceFilter === 'atm' ? '#0F5132' : '#64748B'} style={{ marginRight: 4 }} />
                  <Text style={[styles.filterChipText, activePlaceFilter === 'atm' && styles.filterChipTextActive]}>{t.filterAtm}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.filterChip, activePlaceFilter === 'doctors' && styles.filterChipActive]} 
                  onPress={() => setActivePlaceFilter('doctors')}
                >
                  <Ionicons name="medkit" size={14} color={activePlaceFilter === 'doctors' ? '#0F5132' : '#64748B'} style={{ marginRight: 4 }} />
                  <Text style={[styles.filterChipText, activePlaceFilter === 'doctors' && styles.filterChipTextActive]}>{t.filterDoctors}</Text>
                </TouchableOpacity>
              </View>

              {activePlaceFilter === 'explore' && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cityFilterScroll}>
                  {t.cities.map((city) => {
                    const isSelected = selectedCityId === city.id;
                    return (
                      <TouchableOpacity key={city.id} style={[styles.cityChip, isSelected && styles.cityChipActive]} onPress={() => setSelectedCityId(city.id)}>
                        <Ionicons name="location" size={13} color={isSelected ? '#0F5132' : '#64748B'} style={{ marginRight: 4 }} />
                        <Text style={[styles.cityChipText, isSelected && styles.cityChipTextActive]}>{city.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              <View style={styles.liveMapWrapper}>
                {Platform.OS === 'web' ? (
                  <iframe title="Portugal Interactive Map" src={getMapEmbedUrl()} style={styles.mapIframe} loading="lazy" allowFullScreen />
                ) : (
                  <View style={styles.nativeMapFallback}>
                    <Ionicons name="map-outline" size={40} color="#0F5132" />
                    <Text style={styles.nativeMapText}>Portugal Live-Karte</Text>
                  </View>
                )}
                
                <TouchableOpacity style={styles.floatingOpenMapsBtn} onPress={() => openUrl('https://www.google.com/maps/search/?api=1&query=Portugal')}>
                  <Ionicons name="navigate-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.floatingOpenMapsBtnText}>{t.openInAppMaps}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {activePlaceFilter === 'explore' && (
              <>
                <View style={styles.cityDetailsHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activeCityName}>{currentCityText.name}</Text>
                    <Text style={styles.activeCityTagline}>{currentCityText.tagline}</Text>
                  </View>
                  <View style={styles.cityPlacesCounter}>
                    <Text style={styles.cityPlacesCounterText}>{dynamicPlaces.length} Highlights</Text>
                  </View>
                </View>

                <Text style={[styles.miniLabel, { marginHorizontal: 4, marginBottom: 8 }]}>{t.swipeInstruction}</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.attractionsSwipeScroll}>
                  {dynamicPlaces.map((place) => (
                    <View key={place.id} style={styles.attractionCard}>
                      <Image source={{ uri: place.img }} style={styles.attractionImage} />
                      <View style={[styles.attractionCategoryBadge, place.category.includes('Beach') && { backgroundColor: '#0284C7' }]}>
                        <Text style={styles.attractionCategoryText}>{place.category}</Text>
                      </View>
                      <View style={styles.attractionBody}>
                        <Text style={styles.attractionTitle}>{place.title}</Text>
                        <Text style={styles.attractionDesc}>{place.desc}</Text>
                        <View style={styles.attractionTipBox}>
                          <Ionicons name="sparkles" size={13} color="#D97706" style={{ marginRight: 4, marginTop: 1 }} />
                          <Text style={styles.attractionTipText}>{place.tip}</Text>
                        </View>
                        <TouchableOpacity style={styles.gygBtn} onPress={() => openGetYourGuide(place.gygQuery)}>
                          <Ionicons name="ticket-outline" size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                          <Text style={styles.gygBtnText}>{t.gygBtn}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.openMapBtn} onPress={() => openUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + ' Portugal')}`)}>
                          <Ionicons name="navigate-outline" size={13} color="#475569" style={{ marginRight: 4 }} />
                          <Text style={styles.openMapBtnText}>{t.openInMapsBtn}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </>
            )}

            {activePlaceFilter === 'atm' && (
              <View style={styles.card}>
                <View style={[styles.attractionTipBox, { marginTop: 4 }]}>
                  <Ionicons name="information-circle" size={18} color="#D97706" style={{ marginRight: 6, marginTop: 1 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.attractionTipText, { fontWeight: 'bold' }]}>💡 Multibanco Expat-Tipp:</Text>
                    <Text style={[styles.attractionTipText, { marginTop: 2 }]}>Nutze immer Geldautomaten direkt an echten Bankfilialen, um mit Revolut oder Wise gebührenfrei Geld abzuheben.</Text>
                  </View>
                </View>
              </View>
            )}

            {activePlaceFilter === 'doctors' && (
              <View style={{ marginTop: 4 }}>
                <Text style={styles.sectionTitle}>{t.emergencyTitle}</Text>
                {EMERGENCIES.map((item, idx) => (
                  <TouchableOpacity key={idx} style={styles.emergencyCard} onPress={() => dialNumber(item.num)}>
                    <View style={[styles.emergencyIconWrap, { backgroundColor: item.color }]}>
                      <Ionicons name={item.icon} size={18} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.emergencyName}>{item.name}</Text>
                      <Text style={styles.emergencyDesc}>{item.desc}</Text>
                    </View>
                    <View style={styles.callBadge}>
                      <Ionicons name="call" size={13} color="#0F5132" style={{ marginRight: 3 }} />
                      <Text style={styles.callBadgeText}>{item.num}</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Kliniken & internationale Ärzte</Text>
                {ENGLISH_DOCTORS.map((doc) => (
                  <View key={doc.id} style={styles.affiliateServiceCard}>
                    <View style={styles.affiliateTopRow}>
                      <View style={styles.affiliateIconBadge}>
                        <Ionicons name="hospital" size={20} color="#0F5132" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.affiliateBadgeText}>{doc.city} • {doc.specialty}</Text>
                        <Text style={styles.affiliateTitle}>{doc.name}</Text>
                      </View>
                    </View>

                    <Text style={styles.affiliateDesc}>{doc.desc}</Text>
                    <Text style={[styles.affiliateDesc, { fontWeight: '700', color: '#334155', marginTop: 4 }]}>📍 {doc.address}</Text>

                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                      <TouchableOpacity style={[styles.affiliateActionBtn, { flex: 1, marginTop: 0, backgroundColor: '#0284C7' }]} onPress={() => dialNumber(doc.phone)}>
                        <Ionicons name="call" size={13} color="#fff" style={{ marginRight: 4 }} />
                        <Text style={styles.affiliateActionBtnText}>{t.callDoctorBtn}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.affiliateActionBtn, { flex: 1, marginTop: 0 }]} onPress={() => openUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doc.query)}`)}>
                        <Ionicons name="navigate" size={13} color="#fff" style={{ marginRight: 4 }} />
                        <Text style={styles.affiliateActionBtnText}>{t.directionBtn}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        )}

        {/* TAB 3: TRANSLATOR */}
        {activeTab === 'trans' && (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Text style={styles.miniLabel}>{t.from}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langScroll}>
                {TRANSLATOR_LANGUAGES.map((l) => (
                  <TouchableOpacity key={`src-${l.code}`} onPress={() => setSourceLang(l.code)} style={[styles.langChip, sourceLang === l.code && styles.langChipSelected]}>
                    <Text style={[styles.langChipText, sourceLang === l.code && styles.langChipTextSelected]}>{l.flag} {l.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.miniLabel, { marginTop: 10 }]}>{t.to}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langScroll}>
                {TRANSLATOR_LANGUAGES.map((l) => (
                  <TouchableOpacity key={`tgt-${l.code}`} onPress={() => setTargetLang(l.code)} style={[styles.langChip, targetLang === l.code && styles.langChipSelected]}>
                    <Text style={[styles.langChipText, targetLang === l.code && styles.langChipTextSelected]}>{l.flag} {l.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={{ position: 'relative', marginTop: 10 }}>
                <TextInput style={styles.textInput} placeholder={t.placeholderTrans} placeholderTextColor="#94A3B8" value={inputText} onChangeText={setInputText} multiline />
                <TouchableOpacity style={styles.sttMicButton} onPress={handleSpeechToText}>
                  <Ionicons name="mic" size={18} color="#FFFFFF" />
                  <Text style={styles.sttMicButtonText}>{t.speakBtn}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {loading && (
              <View style={{ padding: 10, alignItems: 'center' }}>
                <ActivityIndicator color="#0F5132" size="small" />
              </View>
            )}

            {translatedText ? (
              <View style={styles.resultCard}>
                <View style={styles.resultHeaderRow}>
                  <Text style={styles.resultHeader}>{t.resultLabel}:</Text>
                  <TouchableOpacity style={styles.audioBtn} onPress={() => playAudio(translatedText, targetLang)}>
                    <Ionicons name="volume-high" size={16} color="#0F5132" />
                    <Text style={styles.audioBtnText}>{t.listenBtn}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.resultBody}>{translatedText}</Text>
              </View>
            ) : null}

            <View style={styles.italkiBannerCard}>
              <View style={styles.italkiTopRow}>
                <View style={styles.italkiIconBadge}>
                  <Ionicons name="school" size={20} color="#0F5132" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.italkiBadgeText}>Empfehlung</Text>
                  <Text style={styles.italkiTitle}>{t.italkiBannerTitle}</Text>
                </View>
              </View>
              <Text style={styles.italkiDesc}>{t.italkiBannerDesc}</Text>
              <TouchableOpacity style={styles.italkiActionBtn} onPress={openItalki}>
                <Text style={styles.italkiActionBtnText}>{t.italkiBtn}</Text>
                <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* TAB 4: SALARY CALCULATOR */}
        {activeTab === 'calc' && (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>{t.calcTitle}</Text>
              <Text style={styles.subText}>{t.calcSub}</Text>

              <Text style={styles.inputFieldLabel}>{t.calcGrossLabel}</Text>
              <TextInput style={styles.salaryInputField} keyboardType="numeric" value={grossInput} onChangeText={setGrossInput} />

              <Text style={styles.inputFieldLabel}>{t.calcPaymentsLabel}</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
                {['12', '14'].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[styles.modalLangBtn, paymentsCount === num && styles.modalLangBtnActive, { width: '48%' }]}
                    onPress={() => setPaymentsCount(num)}
                  >
                    <Text style={[styles.modalLangText, paymentsCount === num && styles.modalLangTextActive]}>{num} Gehälter</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputFieldLabel}>{t.calcStatusLabel}</Text>
              <View style={{ gap: 6, marginBottom: 10 }}>
                {[
                  { id: 'single', label: 'Single ohne Kinder (Não casado)' },
                  { id: 'married_1', label: 'Verheiratet (1 Verdiener / Único titular)' },
                  { id: 'married_2', label: 'Verheiratet (2 Verdiener / Dois titulares)' },
                ].map((st) => (
                  <TouchableOpacity
                    key={st.id}
                    style={[styles.modalLangBtn, taxStatus === st.id && styles.modalLangBtnActive, { width: '100%', alignItems: 'flex-start', paddingHorizontal: 12 }]}
                    onPress={() => setTaxStatus(st.id)}
                  >
                    <Text style={[styles.modalLangText, taxStatus === st.id && styles.modalLangTextActive]}>{st.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {calcResult && (
              <View style={styles.calcResultCard}>
                <Text style={styles.netLabel}>{t.calcNetMonthly}</Text>
                <Text style={styles.netValue}>{calcResult.netMonthly} €</Text>
                <Text style={styles.netNote}>Auszahlung auf Basis von {paymentsCount} Gehältern / Jahr (Jahresnetto: {calcResult.netAnnual} €)</Text>
                <View style={styles.calcDivider} />
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>{t.calcGrossRow}</Text>
                  <Text style={styles.rowValue}>{calcResult.gross} €</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>{t.calcSSRow}</Text>
                  <Text style={[styles.rowValue, { color: '#DC2626' }]}>- {calcResult.ss} €</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>{t.calcIRSRow} (~{calcResult.irsPercent}%):</Text>
                  <Text style={[styles.rowValue, { color: '#DC2626' }]}>- {calcResult.irs} €</Text>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* TAB 5: PERKS & DEALS */}
        {activeTab === 'perks' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Ionicons name="gift" size={24} color="#0F5132" style={{ marginRight: 8 }} />
                <Text style={styles.sectionHeaderTitle}>{t.perksSectionTitle}</Text>
              </View>
              <Text style={styles.subText}>{t.perksSectionSub}</Text>

              {EXPAT_PERKS.map((perk) => (
                <View key={perk.id} style={styles.attractionCardWide}>
                  <Image source={{ uri: perk.img }} style={styles.perkCardImage} />
                  <View style={styles.attractionBody}>
                    <View style={styles.affiliateTopRow}>
                      <View style={styles.affiliateIconBadge}>
                        <Ionicons name={perk.icon} size={18} color="#0F5132" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.affiliateBadgeText}>{perk.badge}</Text>
                        <Text style={styles.affiliateTitle}>{perk.title}</Text>
                      </View>
                    </View>
                    <Text style={styles.affiliateDesc}>{perk.desc}</Text>
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => openUrl(perk.link)}>
                      <Text style={styles.btnText}>{t.claimDealBtn}</Text>
                      <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <View style={[styles.attractionTipBox, { marginTop: 10 }]}>
                <Ionicons name="star" size={16} color="#D97706" style={{ marginRight: 6, marginTop: 1 }} />
                <Text style={styles.attractionTipText}>Alle Deals sind verifiziert und direkt mit unseren offiziellen Partner-Netzwerken verknüpft.</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {/* MODAL SPRACHAUSWAHL */}
        <Modal visible={langModalVisible} transparent animationType="fade" onRequestClose={() => setLangModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Ionicons name="language" size={28} color="#0F5132" style={{ alignSelf: 'center', marginBottom: 6 }} />
              <Text style={styles.modalTitle}>App-Sprache wählen</Text>
              <View style={styles.modalGrid}>
                {UI_LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[styles.modalLangBtn, appLang === lang.code && styles.modalLangBtnActive]}
                    onPress={() => {
                      setAppLang(lang.code);
                      setSourceLang(lang.code);
                      setLangModalVisible(false);
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{lang.flag}</Text>
                    <Text style={[styles.modalLangText, appLang === lang.code && styles.modalLangTextActive]}>{lang.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F5132' },
  container: { flex: 1, backgroundColor: '#FBF9F5' },
  header: {
    backgroundColor: '#0F5132',
    paddingTop: 8,
    paddingBottom: 22,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appHeaderLogo: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: '#BBF7D0' },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  headerSubtitle: { color: '#BBF7D0', fontSize: 11, marginTop: 2 },
  langSwitchHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  langSwitchHeaderText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  tabBarContainer: { paddingHorizontal: 4, marginTop: -16, marginBottom: 8, zIndex: 10 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    gap: 1,
  },
  tabButtonActive: { backgroundColor: '#0F5132' },
  tabText: { fontSize: 9.5, color: '#64748B', fontWeight: '600' },
  tabTextActive: { color: '#FFFFFF', fontWeight: '700' },
  scrollContent: { padding: 14, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeaderTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  subText: { fontSize: 12, color: '#64748B', marginTop: 2, marginBottom: 8 },
  miniLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },

  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 8,
  },
  filterChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#0F5132',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#0F5132',
  },

  congratsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  congratsTitle: { fontSize: 13, fontWeight: '800', color: '#166534' },
  congratsDesc: { fontSize: 11.5, color: '#14532D', marginTop: 2, lineHeight: 16 },

  affiliateServiceCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  affiliateTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  affiliateIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  affiliateBadgeText: { fontSize: 10, fontWeight: '800', color: '#0F5132', textTransform: 'uppercase' },
  affiliateTitle: { fontSize: 13.5, fontWeight: '800', color: '#0F172A' },
  affiliateDesc: { fontSize: 11.5, color: '#64748B', marginTop: 6, lineHeight: 16 },
  affiliateActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F5132',
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 10,
  },
  affiliateActionBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  disclosureText: { fontSize: 10, color: '#94A3B8', textAlign: 'center', marginTop: 6, lineHeight: 14 },

  attractionCardWide: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  perkCardImage: { width: '100%', height: 130, backgroundColor: '#E2E8F0' },

  italkiBannerCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  italkiTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  italkiIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  italkiBadgeText: { fontSize: 10, fontWeight: '800', color: '#166534', textTransform: 'uppercase' },
  italkiTitle: { fontSize: 14, fontWeight: '800', color: '#14532D' },
  italkiDesc: { fontSize: 12, color: '#166534', marginTop: 6, lineHeight: 17 },
  italkiActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F5132',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  italkiActionBtnText: { color: '#FFFFFF', fontSize: 12.5, fontWeight: '700' },

  liveMapWrapper: {
    height: 270,
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#E2E8F0',
  },
  mapIframe: { width: '100%', height: '100%', border: 'none' },
  nativeMapFallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  nativeMapText: { fontSize: 13, fontWeight: '700', color: '#0F5132', marginTop: 6 },
  floatingOpenMapsBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#0F5132',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  floatingOpenMapsBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },

  cityFilterScroll: { paddingVertical: 4, gap: 6, marginBottom: 4 },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  cityChipActive: { backgroundColor: '#DCFCE7', borderWidth: 1.5, borderColor: '#0F5132' },
  cityChipText: { fontSize: 12, fontWeight: '700', color: '#334155' },
  cityChipTextActive: { color: '#0F5132' },

  cityDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  activeCityName: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  activeCityTagline: { fontSize: 12, color: '#64748B', marginTop: 1 },
  cityPlacesCounter: { backgroundColor: '#DCFCE7', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 8 },
  cityPlacesCounterText: { fontSize: 11, fontWeight: '800', color: '#0F5132' },

  attractionsSwipeScroll: { paddingVertical: 4, gap: 12 },
  attractionCard: {
    width: width * 0.78,
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  attractionImage: { width: '100%', height: 160, backgroundColor: '#E2E8F0' },
  attractionCategoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15,23,42,0.85)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  attractionCategoryText: { color: '#FFFFFF', fontSize: 10.5, fontWeight: 'bold' },
  attractionBody: { padding: 12 },
  attractionTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  attractionDesc: { fontSize: 12, color: '#475569', marginTop: 4, lineHeight: 17 },
  attractionTipBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  attractionTipText: { fontSize: 11, color: '#92400E', flex: 1, fontWeight: '600' },
  gygBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5533',
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  gygBtnText: { color: '#FFFFFF', fontSize: 11.5, fontWeight: '800' },
  openMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
  },
  openMapBtnText: { color: '#475569', fontSize: 11, fontWeight: '600' },

  checklistHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  progressBadge: { backgroundColor: '#DCFCE7', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  progressBadgeText: { fontSize: 11, fontWeight: '700', color: '#0F5132' },
  progressBarTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden', marginVertical: 10 },
  progressBarFill: { height: '100%', backgroundColor: '#0F5132', borderRadius: 3 },
  checklistItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  checklistItemDone: { opacity: 0.65 },
  checklistText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  checklistTextDone: { textDecorationLine: 'line-through', color: '#64748B' },
  checklistTip: { fontSize: 11, color: '#64748B', marginTop: 2 },
  inputFieldLabel: { fontSize: 12, fontWeight: '700', color: '#334155', marginTop: 6, marginBottom: 4 },
  salaryInputField: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F5132',
    minHeight: 44,
  },
  primaryBtn: {
    backgroundColor: '#0F5132',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  btnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  langScroll: { paddingVertical: 4, gap: 6 },
  langChip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#F1F5F9' },
  langChipSelected: { backgroundColor: '#DCFCE7', borderColor: '#0F5132', borderWidth: 1.5 },
  langChipText: { fontSize: 12, fontWeight: '700', color: '#334155' },
  langChipTextSelected: { color: '#0F5132' },
  textInput: {
    minHeight: 80,
    fontSize: 15,
    textAlignVertical: 'top',
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    paddingBottom: 34,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sttMicButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  sttMicButtonText: { color: '#FFFFFF', fontSize: 10.5, fontWeight: 'bold' },
  resultCard: { backgroundColor: '#F0FDF4', borderRadius: 16, padding: 14, borderColor: '#BBF7D0', borderWidth: 1, marginTop: 10 },
  resultHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultHeader: { fontSize: 11, color: '#166534', fontWeight: '800', textTransform: 'uppercase' },
  resultBody: { fontSize: 16, color: '#14532D', fontWeight: '700', marginTop: 4 },
  audioBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, gap: 3 },
  audioBtnText: { fontSize: 11, color: '#0F5132', fontWeight: 'bold' },
  calcResultCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  netLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
  netValue: { fontSize: 26, fontWeight: '900', color: '#0F5132', marginTop: 2 },
  netNote: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  calcDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  rowLabel: { fontSize: 12, color: '#64748B' },
  rowValue: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8, color: '#0F172A' },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emergencyIconWrap: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  emergencyName: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  emergencyDesc: { fontSize: 11, color: '#64748B', marginTop: 1 },
  callBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  callBadgeText: { fontSize: 11, fontWeight: '800', color: '#0F5132' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, width: '100%', maxWidth: 340 },
  modalTitle: { fontSize: 16, fontWeight: '800', textAlign: 'center', marginBottom: 12, color: '#0F172A' },
  modalGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  modalLangBtn: { width: '48%', backgroundColor: '#F8FAFC', paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: '#E2E8F0' },
  modalLangBtnActive: { borderColor: '#0F5132', backgroundColor: '#DCFCE7' },
  modalLangText: { fontSize: 12, fontWeight: '700', color: '#1E293B', marginTop: 2 },
  modalLangTextActive: { color: '#0F5132' },
});
