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
  
  // Aktualisierter offizieller Link für das EU-Zertifikat / Terminvereinbarung
  euCertificatePortal: 'https://informacoeseservicos.lisboa.pt/contactos/agendamento-de-atendimento',

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

const CITIES_DATA = [
  {
    id: 'lisboa',
    name: 'Lisboa & Umgebung',
    tagline: 'Deine gespeicherten Orte in der Hauptstadt',
    lat: 38.7223,
    lng: -9.1393,
    zoom: 12,
    places: [
      { id: 'l1', title: 'Jardim da Estrela', category: 'City park (4.6 ⭐)', city: 'Lisboa', desc: 'Historischer Stadtpark mit Café.', bookable: false },
      { id: 'l2', title: 'PUT IT ON LISBON', category: 'Coffee shop (4.9 ⭐)', city: 'Lisboa', desc: 'Gemütliches Café.', bookable: false },
      { id: 'l3', title: 'Botanical Garden of Lisbon', category: 'Botanical garden (4.0 ⭐)', city: 'Lisboa', desc: 'Botanischer Garten.', bookable: true },
      { id: 'l4', title: 'ROOFTOP - TOPO MARTIM MONIZ', category: 'Cocktail bar (4.3 ⭐)', city: 'Lisboa', desc: 'Rooftop-Bar mit Ausblick.', bookable: false },
      { id: 'l5', title: 'Fábrica Braço de Prata', category: 'Cultural center (4.4 ⭐)', city: 'Lisboa', desc: 'Kulturzentrum & Bar.', bookable: true },
      { id: 'l6', title: 'A Capela', category: 'Club (4.4 ⭐)', city: 'Lisboa', desc: 'Kleine Club-Bar.', bookable: false },
      { id: 'l7', title: 'Jerónimos Monastery', category: 'Monastery (4.4 ⭐)', city: 'Lisboa / Belém', desc: 'Berühmtes UNESCO-Kloster.', bookable: true },
      { id: 'l8', title: 'Carmo Archaeological Museum', category: 'Archaeological museum (4.5 ⭐)', city: 'Lisboa', desc: 'Gotische Ruine und Museum.', bookable: true },
      { id: 'l9', title: 'A Minha Avó', category: 'Vegan restaurant (4.6 ⭐)', city: 'Lisboa', desc: 'Vegane Küche.', bookable: false },
      { id: 'l10', title: 'Cosmos Campolide', category: 'Cultural center (4.6 ⭐)', city: 'Lisboa', desc: 'Kulturzentrum.', bookable: false },
      { id: 'l11', title: 'Bar Badassery', category: 'Cocktail bar (4.6 ⭐)', city: 'Lisboa', desc: 'Cocktails und Drinks.', bookable: false },
      { id: 'l12', title: 'River Garden', category: 'Garden (4.7 ⭐)', city: 'Lisboa', desc: 'Schöner Gartenbereich.', bookable: false },
      { id: 'l13', title: 'Miradouro da Graça', category: 'Scenic spot (4.7 ⭐)', city: 'Lisboa', desc: 'Beliebter Aussichtspunkt mit Kiosk.', bookable: false },
      { id: 'l14', title: 'Fable Bookshop + Coffee', category: 'Book store / Cafe (4.8 ⭐)', city: 'Lisboa', desc: 'Bücher und Kaffee.', bookable: false },
      { id: 'l15', title: 'Seedge', category: 'Cannabis store (5.0 ⭐)', city: 'Lisboa', desc: 'Specialty store.', bookable: false },
      { id: 'l16', title: 'Retro City', category: 'Vintage clothing (4.5 ⭐)', city: 'Lisboa', desc: 'Vintage Mode.', bookable: false },
      { id: 'l17', title: 'Monsanto', category: 'Mountain peak (4.7 ⭐)', city: 'Lisboa', desc: 'Grüne Lunge von Lissabon.', bookable: false },
      { id: 'l18', title: 'Lara Coffee', category: 'Pastries (4.2 ⭐)', city: 'Lisboa', desc: 'Gebäck und Kaffee.', bookable: false },
      { id: 'l19', title: 'Castelo de São Jorge', category: 'Castle (4.5 ⭐)', city: 'Lisboa', desc: 'Historische Burg über der Stadt.', bookable: true },
      { id: 'l20', title: 'Estufa Fria', category: 'Botanical garden (4.7 ⭐)', city: 'Lisboa', desc: 'Gewächshaus mit exotischen Pflanzen.', bookable: true },
      { id: 'l21', title: 'Loja Real', category: 'Clothing store (3.3 ⭐)', city: 'Lisboa', desc: 'Modegeschäft.', bookable: false },
      { id: 'l22', title: 'Miradouro de Santa Luzia', category: 'Scenic spot (4.6 ⭐)', city: 'Lisboa', desc: 'Romantischer Aussichtspunkt.', bookable: false },
      { id: 'l23', title: 'Dearvains', category: 'Thrift store (4.7 ⭐)', city: 'Lisboa', desc: 'Second Hand Shop.', bookable: false },
      { id: 'l24', title: 'Campo das Cebolas', category: 'Square', city: 'Lisboa', desc: 'Historischer Platz.', bookable: false },
      { id: 'l25', title: 'Feira do Relógio', category: 'Flea market (4.3 ⭐)', city: 'Lisboa', desc: 'Großer Flohmarkt.', bookable: false },
      { id: 'l26', title: 'Amor Records', category: 'Record store (4.7 ⭐)', city: 'Lisboa', desc: 'Plattenladen.', bookable: false },
      { id: 'l27', title: 'Boubaud Vintage Boutique', category: 'Vintage clothing (4.9 ⭐)', city: 'Lisboa', desc: 'Vintage Boutique.', bookable: false },
      { id: 'l28', title: 'Little Chelsea', category: 'Art gallery (4.3 ⭐)', city: 'Lisboa', desc: 'Kunstgalerie.', bookable: false },
      { id: 'l29', title: '8 Marvila', category: 'Cultural center (4.6 ⭐)', city: 'Lisboa / Marvila', desc: 'Event- und Kulturhub.', bookable: true },
      { id: 'l30', title: 'Café da Garagem', category: 'Cafe (4.2 ⭐)', city: 'Lisboa', desc: 'Café mit tollem Blick.', bookable: false },
      { id: 'l31', title: 'Terraço Chill-Out Limão', category: 'Bar (4.3 ⭐)', city: 'Lisboa', desc: 'Chill-out Bar.', bookable: false },
      { id: 'l32', title: 'My Auchan', category: 'Supermarket (4.0 ⭐)', city: 'Lisboa', desc: 'Supermarkt.', bookable: false },
      { id: 'l33', title: 'Jardins do Bombarda', category: 'Park (4.6 ⭐)', city: 'Lisboa', desc: 'Gartenanlage.', bookable: false },
      { id: 'l34', title: 'Jardim das Cerejas', category: 'Vegan (4.6 ⭐)', city: 'Lisboa', desc: 'Veganes Restaurant.', bookable: false },
      { id: 'l35', title: 'Triparte Store & Tattoo', category: 'Clothing & Tattoo (4.6 ⭐)', city: 'Lisboa', desc: 'Store und Tattoo.', bookable: false },
      { id: 'l36', title: 'Rita Biju', category: 'Jewelry store (2.7 ⭐)', city: 'Lisboa', desc: 'Schmuck.', bookable: false },
      { id: 'l37', title: 'HUMANA', category: 'Second hand (4.4 ⭐)', city: 'Lisboa', desc: 'Second-Hand-Laden.', bookable: false },
      { id: 'l38', title: 'Trumps', category: 'Gay night club (4.2 ⭐)', city: 'Lisboa', desc: 'Bekannter Club.', bookable: false },
      { id: 'l39', title: 'POSH CLUB LISBON', category: 'Gay night club (4.1 ⭐)', city: 'Lisboa', desc: 'Club.', bookable: false },
      { id: 'l40', title: 'Machimbombo', category: 'Bar (4.3 ⭐)', city: 'Lisboa', desc: 'Bar in der Altstadt.', bookable: false },
      { id: 'l41', title: 'Side Bar', category: 'Gay bar (4.1 ⭐)', city: 'Lisboa', desc: 'Bar.', bookable: false },
      { id: 'l42', title: 'Drama Bar', category: 'Bar (4.6 ⭐)', city: 'Lisboa', desc: 'Szene-Bar.', bookable: false },
      { id: 'l43', title: 'Copenhagen Coffee Lab - Baixa', category: 'Coffee shop (4.3 ⭐)', city: 'Lisboa', desc: 'Skandinavischer Kaffee.', bookable: false },
      { id: 'l44', title: 'Green Street', category: 'Tourist attraction (4.2 ⭐)', city: 'Lisboa', desc: 'Begrünte Straße.', bookable: false },
      { id: 'l45', title: 'LX Factory', category: 'Art center (4.5 ⭐)', city: 'Lisboa', desc: 'Kreatives Zentrum in alter Fabrik.', bookable: true },
      { id: 'l46', title: 'Alfama', category: 'Historic district', city: 'Lisboa', desc: 'Ältestes Viertel von Lissabon.', bookable: true },
      { id: 'l47', title: 'Fauna & Flora - Anjos', category: 'Restaurant (4.4 ⭐)', city: 'Lisboa', desc: 'Brunch und Bowls.', bookable: false },
      { id: 'l48', title: 'Village Underground Lisboa', category: 'Cultural center (4.2 ⭐)', city: 'Lisboa', desc: 'Kreativraum in Containern.', bookable: false },
      { id: 'l49', title: 'Delirium Café Lisboa', category: 'Pub (4.5 ⭐)', city: 'Lisboa', desc: 'Bekannte Bar.', bookable: false },
    ],
  },
  {
    id: 'caparica',
    name: 'Caparica & Setúbal',
    tagline: 'Strände und Orte südlich des Tejo',
    lat: 38.5500,
    lng: -9.1800,
    zoom: 11,
    places: [
      { id: 'cp1', title: 'Praia da Fonte da Telha', category: 'Beach (4.5 ⭐)', city: 'Caparica', desc: 'Langer Sandstrand.', bookable: false },
      { id: 'cp2', title: 'Cash Converters', category: 'Second hand (3.9 ⭐)', city: 'Charneca de Caparica', desc: 'An- und Verkauf.', bookable: false },
    ],
  },
  {
    id: 'sintra_cascais',
    name: 'Sintra & Cascais',
    tagline: 'Märchenhafte Orte und Atlantikküsten',
    lat: 38.8029,
    lng: -9.3817,
    zoom: 12,
    places: [
      { id: 'sc1', title: 'Cape Carvoeiro Viewpoint', category: 'Scenic spot (4.6 ⭐)', city: 'Peniche / Sintra Region', desc: 'Aussichtspunkt an der Küste.', bookable: true },
      { id: 'sc2', title: 'Coin Caves', category: 'Tourist attraction (4.6 ⭐)', city: 'Sintra Region', desc: 'Beeindruckende Höhlen.', bookable: true },
      { id: 'sc3', title: 'Praia da Adraga', category: 'Beach (4.8 ⭐)', city: 'Sintra', desc: 'Dramatische Klippenküste.', bookable: false },
      { id: 'sc4', title: 'Carcavelos beach', category: 'Beach (4.4 ⭐)', city: 'Carcavelos', desc: 'Beliebter Surfstrand.', bookable: true },
    ],
  },
  {
    id: 'algarve_south',
    name: 'Algarve & Süden',
    tagline: 'Goldene Klippen und Küstenparadiese',
    lat: 37.0194,
    lng: -7.9322,
    zoom: 10,
    places: [
      { id: 'alg1', title: 'Sesimbra', category: 'Coastal town', city: 'Sesimbra', desc: 'Malerischer Fischerort.', bookable: true },
      { id: 'alg2', title: 'Galapos beach', category: 'Beach (4.7 ⭐)', city: 'Arrábida / Setúbal', desc: 'Kristallklares Wasser im Naturpark.', bookable: true },
      { id: 'alg3', title: 'Praia de Paredes da Vitória', category: 'Public beach (4.6 ⭐)', city: 'Leiria Region', desc: 'Weitläufiger Strand.', bookable: false },
      { id: 'alg4', title: 'Ponta da Piedade', category: 'Scenic spot (4.8 ⭐)', city: 'Lagos (Algarve)', desc: 'Klippenlandschaft an der Algarve.', bookable: true },
      { id: 'alg5', title: 'Praia do Ribeiro do Cavalo', category: 'Nature preserve (4.7 ⭐)', city: 'Sesimbra', desc: 'Versteckte, wilde Bucht.', bookable: true },
    ],
  },
  {
    id: 'other_regions',
    name: 'Weitere Regionen',
    tagline: 'Loures, Alqueva und sonstige Orte',
    lat: 38.2000,
    lng: -8.0000,
    zoom: 8,
    places: [
      { id: 'oth1', title: 'Espaço Casa Loures', category: 'Home goods (4.1 ⭐)', city: 'Loures', desc: 'Haushaltswaren.', bookable: false },
      { id: 'oth2', title: 'Observatório Oficial Dark Sky Alqueva', category: 'Observatory (4.7 ⭐)', city: 'Alqueva', desc: 'Sternenbeobachtung.', bookable: true },
      { id: 'oth3', title: 'Loja CTT', category: 'Post office (3.0 ⭐)', city: 'Portugal', desc: 'Postfiliale.', bookable: false },
    ],
  },
];

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
    placesSectionTitle: '🇵🇹 Nach Städten & Regionen sortiert',
    placesSectionSub: 'Wähle eine Region aus, um alle gespeicherten Orte zu sehen:',
    openInAppMaps: 'In Maps-App',
    swipeInstruction: '👉 Klicke auf "Standort öffnen", um den genauen Pin auf der Karte zu sehen:',
    openInMapsBtn: 'Standort öffnen',
    gygBtn: 'Tickets & Touren (GetYourGuide) ↗',
    euCertBtn: 'Offizielles EU-Zertifikat / Termin ↗',
    italkiBannerTitle: '🗣 Portugiesisch fließend sprechen lernen',
    italkiBannerDesc: 'Finde zertifizierte Muttersprachler für 1-zu-1 Online-Unterricht auf italki.',
    italkiBtn: 'Muttersprachler finden (italki) ↗',
    
    filterExplore: 'Städte & Orte',
    filterAtm: 'ATMs (Multibanco)',
    filterDoctors: 'Ärzte & Kliniken',

    callDoctorBtn: 'Anrufen',
    directionBtn: 'Standort öffnen',
    emergencyTitle: '🚨 Notfall- & Behördenkontakte',

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
      { id: 6, title: 'EU-Anmeldebescheinigung (CRUE)', tip: 'Offizielles Aufenthaltszertifikat für EU-Bürger nach 3 Monaten beantragen.', isEuCert: true, link: AFFILIATE_LINKS.euCertificatePortal },
      { id: 7, title: 'SNS-Gesundheitsnummer (Centro de Saúde)', tip: 'Zugang zum staatlichen Gesundheitssystem & Hausarzt.' },
    ],
    citiesData: CITIES_DATA,
  },
  en: {
    title: 'PortuStart',
    sub: 'Your Relocation Partner for Portugal',
    tabServices: 'Services',
    tabPlaces: 'Maps',
    tabTrans: 'Translator',
    tabCalc: 'Salary',
    placesSectionTitle: '🇵🇹 Sorted by Cities & Regions',
    placesSectionSub: 'Choose a region to view all saved places:',
    openInAppMaps: 'Open in Maps App',
    swipeInstruction: '👉 Click "Open Location" to see the exact pin on the map:',
    openInMapsBtn: 'Open Location',
    gygBtn: 'Tickets & Tours (GetYourGuide) ↗',
    euCertBtn: 'Official EU Certificate / Appointment ↗',
    italkiBannerTitle: '🗣 Learn to speak fluent Portuguese',
    italkiBannerDesc: 'Find certified native tutors for 1-on-1 online lessons on italki.',
    italkiBtn: 'Find Native Tutors (italki) ↗',
    
    filterExplore: 'Cities & Places',
    filterAtm: 'ATMs (Multibanco)',
    filterDoctors: 'Doctors & Clinics',

    callDoctorBtn: 'Call',
    directionBtn: 'Open Location',
    emergencyTitle: '🚨 Emergency & Support Contacts',

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
      { id: 6, title: 'EU Registration Certificate (CRUE)', tip: 'Official residence certificate for EU citizens after 3 months.', isEuCert: true, link: AFFILIATE_LINKS.euCertificatePortal },
      { id: 7, title: 'Get your SNS Healthcare Number', tip: 'Grants access to public primary care clinics (Centro de Saúde).' },
    ],
    citiesData: CITIES_DATA,
  },
  es: {
    title: 'PortuStart',
    sub: 'Tu socio de reubicación para Portugal',
    tabServices: 'Servicios',
    tabPlaces: 'Mapas',
    tabTrans: 'Traductor',
    tabCalc: 'Salario',
    placesSectionTitle: '🇵🇹 Ordenado por Ciudades y Regiones',
    placesSectionSub: 'Elige una región para ver todos los lugares guardados:',
    openInAppMaps: 'Abrir en Maps',
    swipeInstruction: '👉 Haz clic en "Abrir ubicación" para ver el pin exacto en el mapa:',
    openInMapsBtn: 'Abrir ubicación',
    gygBtn: 'Entradas y Tours (GetYourGuide) ↗',
    euCertBtn: 'Certificado UE Oficial / Cita ↗',
    italkiBannerTitle: '🗣 Aprende a hablar portugués con fluidez',
    italkiBannerDesc: 'Encuentra profesores nativos certificados para clases particulares en italki.',
    italkiBtn: 'Buscar profesores nativos (italki) ↗',
    
    filterExplore: 'Ciudades y Lugares',
    filterAtm: 'Cajeros (Multibanco)',
    filterDoctors: 'Médicos y Clínicas',

    callDoctorBtn: 'Llamar',
    directionBtn: 'Abrir ubicación',
    emergencyTitle: '🚨 Contactos de emergencia y soporte',

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
      { id: 6, title: 'Certificado de Registro UE (CRUE)', tip: 'Certificado de residencia oficial para ciudadanos de la UE.', isEuCert: true, link: AFFILIATE_LINKS.euCertificatePortal },
      { id: 7, title: 'Obtener número de sanidad SNS', tip: 'Acceso a centros de salud públicos y médico de cabecera.' },
    ],
    citiesData: CITIES_DATA,
  },
  fr: {
    title: 'PortuStart',
    sub: 'Votre partenaire de relocalisation pour le Portugal',
    tabServices: 'Services',
    tabPlaces: 'Cartes',
    tabTrans: 'Traducteur',
    tabCalc: 'Salaire',
    placesSectionTitle: '🇵🇹 Trié par Villes & Régions',
    placesSectionSub: 'Choisissez une région pour voir tous les lieux enregistrés :',
    openInAppMaps: 'Ouvrir dans Plans',
    swipeInstruction: '👉 Cliquez sur "Ouvrir l’emplacement" pour voir le pin exact sur la carte :',
    openInMapsBtn: 'Ouvrir l’emplacement',
    gygBtn: 'Billets et visites (GetYourGuide) ↗',
    euCertBtn: 'Certificat UE Officiel / Rendez-vous ↗',
    italkiBannerTitle: '🗣 Apprenez à parler couramment le portugais',
    italkiBannerDesc: 'Trouvez des tuteurs natifs certifiés pour des cours particuliers sur italki.',
    italkiBtn: 'Trouver des tuteurs natifs (italki) ↗',
    
    filterExplore: 'Villes & Lieux',
    filterAtm: 'DAB (Multibanco)',
    filterDoctors: 'Médecins & Cliniques',

    callDoctorBtn: 'Appeler',
    directionBtn: 'Ouvrir l’emplacement',
    emergencyTitle: '🚨 Contacts d’urgence et d’assistance',

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
      { id: 6, title: 'Certificat d’enregistrement UE (CRUE)', tip: 'Certificat de résidence officiel pour les citoyens de l’UE.', isEuCert: true, link: AFFILIATE_LINKS.euCertificatePortal },
      { id: 7, title: 'Obtenir votre numéro de santé SNS', tip: 'Accès aux centres de santé publics et médecin traitant.' },
    ],
    citiesData: CITIES_DATA,
  },
  it: {
    title: 'PortuStart',
    sub: 'Il tuo partner di trasferimento per il Portogallo',
    tabServices: 'Servizi',
    tabPlaces: 'Mappe',
    tabTrans: 'Traduttore',
    tabCalc: 'Stipendio',
    placesSectionTitle: '🇵🇹 Ordinato per Città e Regioni',
    placesSectionSub: 'Scegli una regione per visualizzare tutti i luoghi salvati:',
    openInAppMaps: 'Apri in Maps',
    swipeInstruction: '👉 Clicca su "Apri posizione" per vedere il pin esatto sulla mappa:',
    openInMapsBtn: 'Apri posizione',
    gygBtn: 'Biglietti e tour (GetYourGuide) ↗',
    euCertBtn: 'Certificato UE Ufficiale / Appuntamento ↗',
    italkiBannerTitle: '🗣 Impara a parlare portogruese fluentemente',
    italkiBannerDesc: 'Trova insegnanti madrelingua certificati per lezioni individuali su italki.',
    italkiBtn: 'Trova insegnanti madrelingua (italki) ↗',
    
    filterExplore: 'Città e Luoghi',
    filterAtm: 'ATM (Multibanco)',
    filterDoctors: 'Medici e Cliniche',

    callDoctorBtn: 'Chiama',
    directionBtn: 'Apri posizione',
    emergencyTitle: '🚨 Contatti di emergenza e supporto',

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
      { id: 6, title: 'Certificato di Registrazione UE (CRUE)', tip: 'Certificato di residenza ufficiale per i cittadini UE.', isEuCert: true, link: AFFILIATE_LINKS.euCertificatePortal },
      { id: 7, title: 'Ottieni il numero sanitario SNS', tip: 'Accesso a centri sanitari pubblici e medico di base.' },
    ],
    citiesData: CITIES_DATA,
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

  const currentCityObj = t.citiesData.find((c) => c.id === selectedCityId) || t.citiesData[0];

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

  const [mapQueryOverride, setMapQueryOverride] = useState(null);

  const getMapEmbedUrl = (placeTitle = null, placeCity = null) => {
    if (activePlaceFilter === 'atm') {
      return `https://maps.google.com/maps?q=Multibanco+Portugal&z=12&output=embed`;
    }
    if (activePlaceFilter === 'doctors') {
      return `https://maps.google.com/maps?q=Hospital+Lisbon+Porto+Algarve&z=7&output=embed`;
    }
    if (placeTitle) {
      const query = encodeURIComponent(`${placeTitle}, ${placeCity || ''}, Portugal`);
      return `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
    }
    return `https://maps.google.com/maps?q=${currentCityObj.lat},${currentCityObj.lng}&z=${currentCityObj.zoom}&output=embed`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F5132" />
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.appHeaderLogoPlaceholder}>
                <Ionicons name="map" size={20} color="#0F5132" />
              </View>
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

        {/* 4-FACH MENÜLEISTE (OHNE DEALS) */}
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
                  <View key={item.id} style={[styles.checklistItem, isDone && styles.checklistItemDone]}>
                    <TouchableOpacity onPress={() => toggleChecklistItem(item.id)} style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
                      <Ionicons name={isDone ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={isDone ? '#0F5132' : '#94A3B8'} style={{ marginRight: 10, marginTop: 2 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.checklistText, isDone && styles.checklistTextDone]}>{item.title}</Text>
                        <Text style={styles.checklistTip}>{item.tip}</Text>
                      </View>
                    </TouchableOpacity>
                    {item.isEuCert && item.link && (
                      <TouchableOpacity style={styles.euCertLinkBtn} onPress={() => openUrl(item.link)}>
                        <Text style={styles.euCertLinkBtnText}>{t.euCertBtn}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
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

        {/* TAB 2: KARTEN & ORTE */}
        {activeTab === 'places' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>{t.placesSectionTitle}</Text>
              <Text style={styles.subText}>{t.placesSectionSub}</Text>

              <View style={styles.filterRow}>
                <TouchableOpacity 
                  style={[styles.filterChip, activePlaceFilter === 'explore' && styles.filterChipActive]} 
                  onPress={() => { setActivePlaceFilter('explore'); setMapQueryOverride(null); }}
                >
                  <Ionicons name="compass" size={14} color={activePlaceFilter === 'explore' ? '#0F5132' : '#64748B'} style={{ marginRight: 4 }} />
                  <Text style={[styles.filterChipText, activePlaceFilter === 'explore' && styles.filterChipTextActive]}>{t.filterExplore}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.filterChip, activePlaceFilter === 'atm' && styles.filterChipActive]} 
                  onPress={() => { setActivePlaceFilter('atm'); setMapQueryOverride(null); }}
                >
                  <Ionicons name="card" size={14} color={activePlaceFilter === 'atm' ? '#0F5132' : '#64748B'} style={{ marginRight: 4 }} />
                  <Text style={[styles.filterChipText, activePlaceFilter === 'atm' && styles.filterChipTextActive]}>{t.filterAtm}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.filterChip, activePlaceFilter === 'doctors' && styles.filterChipActive]} 
                  onPress={() => { setActivePlaceFilter('doctors'); setMapQueryOverride(null); }}
                >
                  <Ionicons name="medkit" size={14} color={activePlaceFilter === 'doctors' ? '#0F5132' : '#64748B'} style={{ marginRight: 4 }} />
                  <Text style={[styles.filterChipText, activePlaceFilter === 'doctors' && styles.filterChipTextActive]}>{t.filterDoctors}</Text>
                </TouchableOpacity>
              </View>

              {activePlaceFilter === 'explore' && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cityFilterScroll}>
                  {t.citiesData.map((city) => {
                    const isSelected = selectedCityId === city.id;
                    return (
                      <TouchableOpacity key={city.id} style={[styles.cityChip, isSelected && styles.cityChipActive]} onPress={() => { setSelectedCityId(city.id); setMapQueryOverride(null); }}>
                        <Ionicons name="location" size={13} color={isSelected ? '#0F5132' : '#64748B'} style={{ marginRight: 4 }} />
                        <Text style={[styles.cityChipText, isSelected && styles.cityChipTextActive]}>{city.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              <View style={styles.liveMapWrapper}>
                {Platform.OS === 'web' ? (
                  <iframe title="Portugal Interactive Map" src={mapQueryOverride ? getMapEmbedUrl(mapQueryOverride.title, mapQueryOverride.city) : getMapEmbedUrl()} style={styles.mapIframe} loading="lazy" allowFullScreen />
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
                    <Text style={styles.activeCityName}>{currentCityObj.name}</Text>
                    <Text style={styles.activeCityTagline}>{currentCityObj.tagline}</Text>
                  </View>
                  <View style={styles.cityPlacesCounter}>
                    <Text style={styles.cityPlacesCounterText}>{currentCityObj.places.length} Orte</Text>
                  </View>
                </View>

                <Text style={[styles.miniLabel, { marginHorizontal: 4, marginBottom: 8 }]}>{t.swipeInstruction}</Text>

                {/* ORTLISTE MIT EXAKTEM KARTEN-PIN */}
                {currentCityObj.places.map((place) => (
                  <View key={place.id} style={styles.placeCardSimple}>
                    <View style={styles.placeCardHeaderRow}>
                      <View style={styles.placeIconBadge}>
                        <Ionicons name="location" size={16} color="#0F5132" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={styles.placeCardTitle}>{place.title}</Text>
                          <View style={styles.cityBadge}>
                            <Text style={styles.cityBadgeText}>{place.city}</Text>
                          </View>
                        </View>
                        <Text style={styles.placeCardCategory}>{place.category}</Text>
                      </View>
                    </View>
                    <Text style={styles.placeCardDesc}>{place.desc}</Text>

                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                      {place.bookable && (
                        <TouchableOpacity style={[styles.openMapBtn, { flex: 1, marginTop: 0, backgroundColor: '#FFF5F2' }]} onPress={() => openGetYourGuide(place.title)}>
                          <Ionicons name="ticket-outline" size={13} color="#FF5533" style={{ marginRight: 4 }} />
                          <Text style={[styles.openMapBtnText, { color: '#FF5533', fontWeight: 'bold' }]}>{t.gygBtn}</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity 
                        style={[styles.openMapBtn, { flex: 1, marginTop: 0, backgroundColor: '#DCFCE7' }]} 
                        onPress={() => {
                          setMapQueryOverride({ title: place.title, city: place.city });
                        }}
                      >
                        <Ionicons name="pin" size={13} color="#0F5132" style={{ marginRight: 4 }} />
                        <Text style={[styles.openMapBtnText, { color: '#0F5132', fontWeight: 'bold' }]}>{t.openInMapsBtn}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
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
  appHeaderLogoPlaceholder: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#BBF7D0', alignItems: 'center', justifyContent: 'center' },
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

  placeCardSimple: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  placeCardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  placeIconBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center' },
  placeCardTitle: { fontSize: 14.5, fontWeight: '800', color: '#0F172A' },
  placeCardCategory: { fontSize: 11, fontWeight: '700', color: '#0284C7', marginTop: 1 },
  placeCardDesc: { fontSize: 12, color: '#64748B', marginTop: 6, lineHeight: 17 },

  cityBadge: { backgroundColor: '#F1F5F9', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  cityBadgeText: { fontSize: 10, fontWeight: '700', color: '#475569' },

  attractionTipBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  attractionTipText: { fontSize: 11, color: '#92400E', flex: 1, fontWeight: '600' },
  openMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  openMapBtnText: { color: '#475569', fontSize: 11.5, fontWeight: '600' },

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
  euCertLinkBtn: { backgroundColor: '#DCFCE7', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, marginTop: 4, alignSelf: 'flex-start' },
  euCertLinkBtnText: { fontSize: 11, fontWeight: 'bold', color: '#0F5132' },
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
