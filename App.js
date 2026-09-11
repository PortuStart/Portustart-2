import React, { useState } from 'react';
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
// DEINE PARTNER- & AFFILIATE-LINKS
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
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
];

const TRANSLATOR_LANGUAGES = [
  { code: 'pt', label: 'PT', flag: '🇵🇹', voice: 'pt-PT' },
  { code: 'de', label: 'DE', flag: '🇩🇪', voice: 'de-DE' },
  { code: 'en', label: 'EN', flag: '🇬🇧', voice: 'en-US' },
  { code: 'es', label: 'ES', flag: '🇪🇸', voice: 'es-ES' },
  { code: 'fr', label: 'FR', flag: '🇫🇷', voice: 'fr-FR' },
  { code: 'it', label: 'IT', flag: '🇮🇹', voice: 'it-IT' },
  { code: 'uk', label: 'UKR', flag: '🇺🇦', voice: 'uk-UA' },
  { code: 'hi', label: 'HIN', flag: '🇮🇳', voice: 'hi-IN' },
];

const CITIES_METADATA = {
  lisboa: {
    lat: 38.7223,
    lng: -9.1393,
    zoom: 12,
    placesMeta: [
      { id: 'l1', img: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?w=800&q=80', query: 'Torre de Belem Lisbon', gygQuery: 'Belem Tower Lisbon' },
      { id: 'l2', img: 'https://images.unsplash.com/photo-1513688285115-45a1c5847541?w=800&q=80', query: 'Miradouro de Santa Luzia Lisbon', gygQuery: 'Alfama Lisbon Fado' },
      { id: 'l3', img: 'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=800&q=80', query: 'Praca do Comercio Lisbon', gygQuery: 'Tagus River cruise Lisbon' },
      { id: 'lb1', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Praia de Carcavelos', gygQuery: 'Carcavelos surf lesson' },
      { id: 'lb2', img: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80', query: 'Praia dos Galapinhos Arrabida', gygQuery: 'Arrabida natural park tour' },
    ],
  },
  porto: {
    lat: 41.1579,
    lng: -8.6291,
    zoom: 12,
    placesMeta: [
      { id: 'p1', img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80', query: 'Dom Luis I Bridge Porto', gygQuery: 'Douro river cruise Porto' },
      { id: 'p2', img: 'https://images.unsplash.com/photo-1583275479278-8571871f3ce3?w=800&q=80', query: 'Livraria Lello Porto', gygQuery: 'Livraria Lello Porto ticket' },
      { id: 'p3', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', query: 'Port Wine Cellars Gaia Porto', gygQuery: 'Port wine tasting Porto Gaia' },
      { id: 'pb1', img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80', query: 'Praia de Matosinhos', gygQuery: 'Matosinhos surf lesson' },
      { id: 'pb2', img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', query: 'Praia de Miramar Senhor da Pedra', gygQuery: 'Porto coastal tour' },
    ],
  },
  sintra: {
    lat: 38.8029,
    lng: -9.3817,
    zoom: 12,
    placesMeta: [
      { id: 's1', img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&q=80', query: 'Pena Palace Sintra', gygQuery: 'Pena Palace Sintra ticket' },
      { id: 's2', img: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=800&q=80', query: 'Quinta da Regaleira Sintra', gygQuery: 'Quinta da Regaleira guided tour' },
      { id: 's3', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Cabo da Roca Portugal', gygQuery: 'Cabo da Roca Cascais day trip' },
      { id: 'sb1', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80', query: 'Praia do Guincho Cascais', gygQuery: 'Guincho surf lesson' },
      { id: 'sb2', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80', query: 'Praia da Ursa Sintra', gygQuery: 'Sintra coastal hike' },
    ],
  },
  algarve: {
    lat: 37.0194,
    lng: -7.9322,
    zoom: 10,
    placesMeta: [
      { id: 'a1', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Benagil Cave Algarve', gygQuery: 'Benagil cave boat tour' },
      { id: 'a2', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80', query: 'Ponta da Piedade Lagos', gygQuery: 'Ponta da Piedade boat tour Lagos' },
      { id: 'a3', img: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80', query: 'Ria Formosa Natural Park Faro', gygQuery: 'Ria Formosa boat tour Faro' },
      { id: 'ab1', img: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80', query: 'Praia da Marinha Lagoa', gygQuery: 'Seven Hanging Valleys hike Algarve' },
      { id: 'ab2', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Praia da Falesia Albufeira', gygQuery: 'Albufeira boat tour' },
    ],
  },
  coimbra: {
    lat: 40.2033,
    lng: -8.4103,
    zoom: 12,
    placesMeta: [
      { id: 'c1', img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', query: 'Biblioteca Joanina Coimbra', gygQuery: 'University of Coimbra Joanina library ticket' },
      { id: 'c2', img: 'https://images.unsplash.com/photo-1513688285115-45a1c5847541?w=800&q=80', query: 'Monastery of Santa Cruz Coimbra', gygQuery: 'Coimbra walking tour' },
      { id: 'cb1', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Praia da Claridade Figueira da Foz', gygQuery: 'Figueira da Foz' },
      { id: 'cb2', img: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=800&q=80', query: 'Praia de Mira Portugal', gygQuery: 'Aveiro lagoon day trip' },
    ],
  },
  madeira: {
    lat: 32.6500,
    lng: -16.9089,
    zoom: 11,
    placesMeta: [
      { id: 'm1', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', query: 'Pico do Arieiro Madeira', gygQuery: 'Pico do Arieiro to Pico Ruivo transfer' },
      { id: 'm2', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80', query: '25 Fontes Levada Madeira', gygQuery: 'Rabaçal 25 Fontes levada walk' },
      { id: 'mb1', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', query: 'Prainha do Canical Madeira', gygQuery: 'Ponta de Sao Lourenco boat tour' },
      { id: 'mb2', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Praia da Calheta Madeira', gygQuery: 'Madeira whale watching Calheta' },
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
    selectLangTitle: 'App-Sprache wählen',
    tabServices: 'Services',
    tabPlaces: 'Entdecken',
    tabAtms: 'ATMs',
    tabDoctors: 'Ärzte',
    tabPerks: 'Deals',
    tabTrans: 'Translator',
    tabCalc: 'Gehalt',
    placesSectionTitle: '🇵🇹 Interaktive Karte & Highlights',
    placesSectionSub: 'Live-Karte von Portugal – wähle eine Region oder buche Touren:',
    openInAppMaps: 'In Maps-App',
    swipeInstruction: '👉 Horizontal wischen für Highlights, Strände & Touren:',
    openInMapsBtn: 'Route',
    gygBtn: 'Tickets & Touren (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Portugiesisch fließend sprechen lernen',
    italkiBannerDesc: 'Finde zertifizierte Muttersprachler für 1-zu-1 Online-Unterricht auf italki.',
    italkiBtn: 'Muttersprachler finden (italki) ↗',
    
    atmSectionTitle: '🏧 Gebührenfreie ATMs (Multibanco)',
    atmSectionSub: 'Nutze das offizielle Multibanco-Netzwerk an echten Bankfilialen, um mit Revolut & Wise gebührenfrei Geld abheben zu können:',
    atmTipTitle: '💡 Wichtiger Expat-Tipp:',
    atmTipDesc: 'Achte darauf, immer in Euro (€) abzurechnen, falls der Automat die Abrechnung in deiner Heimatwährung anbietet.',
    
    docSectionTitle: '🩺 Englischsprachige Ärzte & Notfall',
    docSectionSub: 'Wichtige Notrufnummern sowie private Kliniken mit internationalem Patientenservice:',
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
    closeBtn: 'Schließen',
    nextBtn: 'Weiter',
    startBtn: 'Loslegen',

    onboardingSteps: [
      { title: 'Willkommen bei PortuStart! 🇵🇹', desc: 'Dein digitaler Begleiter für einen nahtlosen und stressfreien Umzug nach Portugal.' },
      { title: '1. Offizielle Services & Roadmap 📄', desc: 'Erledige NIF, Bankkonto, NISS und Krankenversicherung komplett digital und verfolge deine ersten 30 Tage.' },
      { title: '2. Entdecke Portugal 🗺', desc: 'Finde die schönsten Highlights, Strände und buche direkt Touren über unsere Partner.' },
      { title: '3. ATMs & Notfall-Ärzte 🏧🩺', desc: 'Finde gebührenfreie Multibanco-Geldautomaten und englischsprachige Ärzte in deiner Nähe.' },
      { title: '4. Exklusive Expat-Deals 🔥', desc: 'Spare bares Geld bei unseren Partnern wie Revolut, e-Residence und italki.' },
      { title: '5. Translator & Gehaltsrechner 🗣💶', desc: 'Übersetze vor Ort mit STT/TTS und berechne dein portugiesisches Nettoeinkommen.' },
    ],

    from: 'Von:',
    to: 'Nach:',
    inputLabel: 'Eingabe:',
    placeholderTrans: 'Text eingeben oder sprechen...',
    btnTrans: 'Übersetzen',
    listenBtn: 'Anhören (TTS)',
    speakBtn: 'Sprechen (STT)',
    resultLabel: 'Ergebnis',
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
    calcTitle: '💶 Nettogehalt-Rechner',
    calcSub: 'Für Angestellte, Single ohne Kinder (14 Monatsgehälter).',
    calcGrossLabel: 'Monatliches Bruttogehalt (€):',
    calcBtn: 'Berechnen',
    calcNetMonthly: 'Geschätztes Netto (pro Monat):',
    calc14Notice: 'Basis: 14 Auszahlungen (inkl. Urlaubs-/Weihnachtsgeld)',
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
        name: 'Lisboa (Lissabon)',
        tagline: 'Die Stadt der 7 Hügel, Fado & Aussichtspunkte',
        places: [
          { id: 'l1', title: 'Torre de Belém & Mosteiro dos Jerónimos', category: 'UNESCO Welterbe', desc: 'Meisterwerk des manuelinischen Stils am Tejo.', tip: 'Tipp: Vor 10:00 Uhr kommen.' },
          { id: 'l2', title: 'Miradouro de Santa Luzia & Alfama', category: 'Aussichtspunkt', desc: 'Bougainvillea-Blüten und Blick über die bunten Dächer der Alfama.', tip: 'Tipp: Bei Sonnenuntergang besuchen.' },
          { id: 'l3', title: 'Praça do Comércio', category: 'Historischer Platz', desc: 'Riesiger Palastplatz direkt am Ufer des Tejo.', tip: 'Tipp: Spaziergang am Ufer starten.' },
          { id: 'lb1', title: 'Praia de Carcavelos', category: '🏖 Surf- & Stadtstrand', desc: 'Größter Sandstrand an der Bahnlinie nach Cascais.', tip: 'Tipp: 25 Min. mit dem Zug ab Cais do Sodré.' },
          { id: 'lb2', title: 'Praia dos Galapinhos', category: '🏖 Naturstrand Arrábida', desc: 'Kristallklares, ruhiges Wasser vor den Felsen des Naturparks.', tip: 'Tipp: Früh morgens anreisen.' },
        ],
      },
      {
        id: 'porto',
        name: 'Porto',
        tagline: 'Granit, Portwein und dramatische Brücken',
        places: [
          { id: 'p1', title: 'Ponte Luís I & Ribeira', category: 'Wahrzeichen', desc: 'Zweistöckige Eisenbrücke von Gustave Eiffels Partner Seyrig.', tip: 'Tipp: Zu Fuß über das obere Deck gehen.' },
          { id: 'p2', title: 'Livraria Lello & Clérigos-Turm', category: 'Kultur & Architektur', desc: 'Weltberühmte Buchhandlung mit roter Holztreppe.', tip: 'Tipp: Ticket online reservieren.' },
          { id: 'p3', title: 'Portweinkeller in Gaia', category: 'Genuss & Tradition', desc: 'Historische Reifekeller mit Rabelo-Booten am Ufer.', tip: 'Tipp: Führung mit Verkostung buchen.' },
          { id: 'pb1', title: 'Praia de Matosinhos', category: '🏖 Metro-Strand', desc: 'Breiter Strand direkt an der Metro, ideal zum Surfen.', tip: 'Tipp: Frischen Fischgrill probieren.' },
          { id: 'pb2', title: 'Praia de Miramar', category: '🏖 Kapelle im Meer', desc: 'Wunderschöne Kapelle Senhor da Pedra auf einem Meeresfelsen.', tip: 'Tipp: Tolles Sonnenuntergangsmotiv.' },
        ],
      },
      {
        id: 'sintra',
        name: 'Sintra & Cascais',
        tagline: 'Märchenschlösser im Nebelwald & Atlantikklippen',
        places: [
          { id: 's1', title: 'Palácio Nacional da Pena', category: 'Märchenschloss', desc: 'Farbenfrohes Romantik-Schloss auf den Bergkämmen.', tip: 'Tipp: Zeitfenster online buchen.' },
          { id: 's2', title: 'Quinta da Regaleira', category: 'Mystik & Gärten', desc: 'Verzaubertes Anwesen mit dem berühmten Initiationsbrunnen.', tip: 'Tipp: Taschenlampe bereithalten.' },
          { id: 's3', title: 'Cabo da Roca', category: 'Naturwunder', desc: 'Westlichster Punkt des europäischen Festlands.', tip: 'Tipp: Windjacke mitnehmen.' },
          { id: 'sb1', title: 'Praia do Guincho', category: '🏖 Surf-Dünenstrand', desc: 'Weltbekannter Surfstrand vor der Kulisse der Sintra-Berge.', tip: 'Tipp: Holzstege über den Dünen nutzen.' },
          { id: 'sb2', title: 'Praia da Ursa', category: '🏖 Wilde Bucht', desc: 'Spektakuläre Felsnadeln, erreichbar über einen Wanderpfad.', tip: 'Tipp: Feste Schuhe anziehen.' },
        ],
      },
      {
        id: 'algarve',
        name: 'Faro & Algarve',
        tagline: 'Goldene Sandsteinklippen & 300 Sonnentage',
        places: [
          { id: 'a1', title: 'Benagil Meereshöhle', category: 'Grotten & Strand', desc: 'Berühmte Brandungshöhle mit kreisrundem Naturfenster.', tip: 'Tipp: Früh mit dem Kajak erkunden.' },
          { id: 'a2', title: 'Ponta da Piedade (Lagos)', category: 'Klippenlandschaft', desc: 'Bizarre Felstürme, Bögen und türkisblaues Wasser.', tip: 'Tipp: Fischerboottour machen.' },
          { id: 'a3', title: 'Ria Formosa Naturpark', category: 'Lagune & Inseln', desc: 'Riesiges Gezeitenschutzgebiet mit autofreien Inseln.', tip: 'Tipp: Fähre nach Armona nehmen.' },
          { id: 'ab1', title: 'Praia da Marinha', category: '🏖 Top-Strand Europas', desc: 'Doppelfelsbögen und kristallklares Schnorchel-Wasser.', tip: 'Tipp: Seven Hanging Valleys Trail.' },
          { id: 'ab2', title: 'Praia da Falésia', category: '🏖 Rote Klippenküste', desc: 'Über 6 km Sandstrand unter roten Steilklippen.', tip: 'Tipp: Barfuß-Wanderungen bei Ebbe.' },
        ],
      },
      {
        id: 'coimbra',
        name: 'Coimbra & Centro',
        tagline: 'Alte Königsstadt & Universitätsgeschichte',
        places: [
          { id: 'c1', title: 'Biblioteca Joanina', category: 'Historische Bibliothek', desc: 'Barockes Prunkjuwel mit Goldverzierungen aus dem 18. Jh.', tip: 'Tipp: Kombiticket buchen.' },
          { id: 'c2', title: 'Kloster Santa Cruz', category: 'Geschichte & Fado', desc: 'Ruhestätte der ersten portugiesischen Könige.', tip: 'Tipp: Fado-Konzert besuchen.' },
          { id: 'cb1', title: 'Praia da Claridade (Figueira)', category: '🏖 Breitester Sandstrand', desc: 'Gigantische Sandfläche mit Holzwegen zum Wasser.', tip: 'Tipp: 40 Min. Zug ab Coimbra.' },
          { id: 'cb2', title: 'Praia de Mira', category: '🏖 Tradition & Dünen', desc: 'Malerischer Strand mit bunten Holzstreifenhäusern.', tip: 'Tipp: Frische Calamares probieren.' },
        ],
      },
      {
        id: 'madeira',
        name: 'Madeira (Funchal)',
        tagline: 'Die Blumeninsel mit schroffen Gipfeln und Levadas',
        places: [
          { id: 'm1', title: 'Pico do Arieiro bis Pico Ruivo', category: 'Hochgebirgswanderung', desc: 'Spektakuläre Gratwanderung über den Wolken.', tip: 'Tipp: Zum Sonnenaufgang starten.' },
          { id: 'm2', title: 'Levada das 25 Fontes', category: 'UNESCO Naturerbe', desc: 'Wanderung entlang historischer Kanäle im Lorbeerwald.', tip: 'Tipp: Früh loswandern.' },
          { id: 'mb1', title: 'Prainha do Caniçal', category: '🏖 Schwarzer Lavasand', desc: 'Versteckte Bucht nahe der Ponta de São Lourenço.', tip: 'Tipp: Toller Farbkontrast.' },
          { id: 'mb2', title: 'Praia da Calheta', category: '🏖 Goldener Sandstrand', desc: 'Geschützte Zwillingsbucht mit ruhigem Wasser.', tip: 'Tipp: Ideal zum Schwimmen.' },
        ],
      },
    ],
  },
  en: {
    title: 'PortuStart',
    sub: 'Your Relocation Partner for Portugal',
    selectLangTitle: 'Select App Language',
    tabServices: 'Services',
    tabPlaces: 'Explore',
    tabAtms: 'ATMs',
    tabDoctors: 'Doctors',
    tabPerks: 'Deals',
    tabTrans: 'Translator',
    tabCalc: 'Salary',
    placesSectionTitle: '🇵🇹 Interactive Map & Sights',
    placesSectionSub: 'Live map of Portugal – choose a region or book tours:',
    openInAppMaps: 'Open in Maps App',
    swipeInstruction: '👉 Swipe horizontally for sights, beaches & tours:',
    openInMapsBtn: 'Route',
    gygBtn: 'Tickets & Tours (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Learn to speak fluent Portuguese',
    italkiBannerDesc: 'Find certified native tutors for 1-on-1 online lessons on italki.',
    italkiBtn: 'Find Native Tutors (italki) ↗',
    
    atmSectionTitle: '🏧 Fee-Free ATMs (Multibanco)',
    atmSectionSub: 'Use official Multibanco network machines at bank branches to withdraw cash with Revolut or Wise without surcharges:',
    atmTipTitle: '💡 Important Expat Tip:',
    atmTipDesc: 'Always choose to be billed in Euros (€) if the ATM offers conversion to your home currency.',

    docSectionTitle: '🩺 English-Speaking Doctors & Emergencies',
    docSectionSub: 'Essential emergency hotlines and private medical centers with international patient support:',
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
    closeBtn: 'Close',
    nextBtn: 'Next',
    startBtn: 'Get Started',

    onboardingSteps: [
      { title: 'Welcome to PortuStart! 🇵🇹', desc: 'Your digital companion for a seamless and stress-free move to Portugal.' },
      { title: '1. Official Services & Roadmap 📄', desc: 'Handle NIF, bank account, NISS, and health insurance digitally and track your first 30 days.' },
      { title: '2. Explore Portugal 🗺', desc: 'Find top sights, beaches, and book tours directly through our trusted partners.' },
      { title: '3. ATMs & Emergency Doctors 🏧🩺', desc: 'Locate fee-free Multibanco ATMs and English-speaking doctors nearby.' },
      { title: '4. Exclusive Expat Deals 🔥', desc: 'Save money with our official partners like Revolut, e-Residence, and italki.' },
      { title: '5. Translator & Salary Calculator 🗣💶', desc: 'Translate on the go with STT/TTS and estimate your net salary in Portugal.' },
    ],

    from: 'From:',
    to: 'To:',
    inputLabel: 'Input:',
    placeholderTrans: 'Enter text or speak...',
    btnTrans: 'Translate',
    listenBtn: 'Listen (TTS)',
    speakBtn: 'Speech-to-Text (STT)',
    resultLabel: 'Result',
    servicesTitle: '📄 Official Relocation Services',
    servicesSub: 'Order essential documents & coverage 100% online through our partner e-Residence:',
    checklistTitle: '📋 First 30 Days Roadmap',
    checklistSub: 'Your step-by-step relocation checklist',
    checklistDone: 'completed',
    applyOnlineBtn: 'Apply online now ↗',
    affiliateDisclosure: 'Transparency notice: These links route to certified express processing with e-Residence. We receive a small referral commission at no additional cost to you.',
    affiliateCards: [
      { key: 'nif', title: 'NIF (Portuguese Tax Number)', badge: 'Step 1 • Essential', desc: 'The master key for renting, SIM cards, jobs and bank accounts.', link: AFFILIATE_LINKS.eResidenceNif, icon: 'document-text' },
      { key: 'bank', title: 'Portuguese Bank Account', badge: 'Step 2 • IBAN', desc: 'Open a compliant local bank account with Portuguese IBAN.', link: AFFILIATE_LINKS.eResidenceBank, icon: 'card' },
      { key: 'niss', title: 'NISS (Social Security Number)', badge: 'Step 3 • Employment', desc: 'Mandatory for payroll processing and employment contracts.', link: AFFILIATE_LINKS.eResidenceNiss, icon: 'shield-checkmark' },
      { key: 'health', title: 'International Expat Health Insurance', badge: 'Step 4 • Visa & Care', desc: 'Compliant health coverage required for D7/D8 nomad visas.', link: AFFILIATE_LINKS.eResidenceHealth, icon: 'medkit' },
    ],
    calcTitle: '💶 Net Salary Calculator',
    calcSub: 'Single employee, mainland Portugal (14 payments).',
    calcGrossLabel: 'Monthly Gross Salary (€):',
    calcBtn: 'Calculate',
    calcNetMonthly: 'Estimated Net (Monthly):',
    calc14Notice: 'Based on standard 14 payments / year',
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
        name: 'Lisbon',
        tagline: 'City of 7 hills, Fado & scenic viewpoints',
        places: [
          { id: 'l1', title: 'Belém Tower & Jerónimos Monastery', category: 'UNESCO World Heritage', desc: 'Manueline masterpiece perched along the Tagus River.', tip: 'Tip: Arrive before 10:00 AM.' },
          { id: 'l2', title: 'Miradouro de Santa Luzia', category: 'Viewpoint', desc: 'Bougainvillea blossoms overlooking terracotta roofs.', tip: 'Tip: Visit during sunset.' },
          { id: 'l3', title: 'Praça do Comércio', category: 'Historic Square', desc: 'Grand harbor square opening toward the river.', tip: 'Tip: Great start for walks.' },
          { id: 'lb1', title: 'Praia de Carcavelos', category: '🏖 City & Surf Beach', desc: 'Largest beach on the Cascais train line with surf schools.', tip: 'Tip: 25 min train ride.' },
          { id: 'lb2', title: 'Praia dos Galapinhos', category: '🏖 Arrábida Nature', desc: 'Crystal-clear waters beneath the cliffs of Arrábida.', tip: 'Tip: Arrive early in summer.' },
        ],
      },
      {
        id: 'porto',
        name: 'Porto',
        tagline: 'Granite architecture, Port wine & dramatic bridges',
        places: [
          { id: 'p1', title: 'Dom Luís I Bridge & Ribeira', category: 'Landmark', desc: 'Iconic double-deck iron arched bridge over the Douro.', tip: 'Tip: Walk the top deck.' },
          { id: 'p2', title: 'Livraria Lello Bookstore', category: 'Architecture', desc: 'Celebrated neo-gothic bookstore with red staircase.', tip: 'Tip: Book tickets online.' },
          { id: 'p3', title: 'Port Wine Cellars in Gaia', category: 'Tasting & Heritage', desc: 'Centuries-old aging cellars with traditional boats.', tip: 'Tip: Book a guided tasting.' },
          { id: 'pb1', title: 'Praia de Matosinhos', category: '🏖 Metro Beach', desc: 'Broad beach at the metro terminus, famous for fresh seafood.', tip: 'Tip: Try the grilled sea bass.' },
          { id: 'pb2', title: 'Praia de Miramar', category: '🏖 Seaside Chapel', desc: 'Seventeenth-century chapel perched on ocean rocks.', tip: 'Tip: Great sunset photo spot.' },
        ],
      },
      {
        id: 'sintra',
        name: 'Sintra & Cascais',
        tagline: 'Fairytale palaces in misty cloud forests & ocean cliffs',
        places: [
          { id: 's1', title: 'Pena National Palace', category: 'Romantic Palace', desc: 'Vibrant yellow and red castle on the high peaks of Sintra.', tip: 'Tip: Book morning slots.' },
          { id: 's2', title: 'Quinta da Regaleira', category: 'Mystical Estate', desc: 'Enchanted park with grottoes and Initiation Well.', tip: 'Tip: Bring a flashlight.' },
          { id: 's3', title: 'Cabo da Roca', category: 'Natural Wonder', desc: 'The westernmost point of continental Europe.', tip: 'Tip: Pack a windbreaker.' },
          { id: 'sb1', title: 'Praia do Guincho', category: '🏖 Wild Surf Dunes', desc: 'World-renowned surfing haven framed by dunes.', tip: 'Tip: Walk the wooden trail.' },
          { id: 'sb2', title: 'Praia da Ursa', category: '🏖 Secret Cove', desc: 'Secluded wild beach flanked by gigantic sea stacks.', tip: 'Tip: Wear hiking shoes.' },
        ],
      },
      {
        id: 'algarve',
        name: 'Faro & Algarve',
        tagline: 'Golden sandstone sea cliffs & 300 days of sunshine',
        places: [
          { id: 'a1', title: 'Benagil Sea Cave', category: 'Caves & Beaches', desc: 'Europe’s most famous wave-carved cathedral cave.', tip: 'Tip: Rent a kayak early.' },
          { id: 'a2', title: 'Ponta da Piedade (Lagos)', category: 'Cliff Coastline', desc: 'Limestone arches and crystal-clear turquoise waters.', tip: 'Tip: Take a small boat tour.' },
          { id: 'a3', title: 'Ria Formosa Park', category: 'Lagoon & Islands', desc: 'Protected coastal wetland with car-free islands.', tip: 'Tip: Ferry to Armona.' },
          { id: 'ab1', title: 'Praia da Marinha', category: '🏖 Top European Beach', desc: 'Iconic double sea arches and snorkeling waters.', tip: 'Tip: Hanging Valleys Trail.' },
          { id: 'ab2', title: 'Praia da Falésia', category: '🏖 Red Cliffs', desc: 'Over 6 km of sand sheltered by red sandstone cliffs.', tip: 'Tip: Low-tide strolls.' },
        ],
      },
      {
        id: 'coimbra',
        name: 'Coimbra & Central',
        tagline: 'Ancient royal capital & university history',
        places: [
          { id: 'c1', title: 'Biblioteca Joanina', category: 'Baroque Library', desc: 'Gilded library holding rare historical manuscripts.', tip: 'Tip: Book combined tickets.' },
          { id: 'c2', title: 'Santa Cruz Monastery', category: 'History & Fado', desc: 'Resting place of the first Portuguese kings.', tip: 'Tip: Catch an evening fado.' },
          { id: 'cb1', title: 'Praia da Claridade (Figueira)', category: '🏖 Vast Beach', desc: 'Massive sand beach equipped with wooden boardwalks.', tip: 'Tip: 40 min train.' },
          { id: 'cb2', title: 'Praia de Mira', category: '🏖 Traditional Fishing', desc: 'Picturesque beach with striped wooden cottages.', tip: 'Tip: Taste fried calamari.' },
        ],
      },
      {
        id: 'madeira',
        name: 'Madeira (Funchal)',
        tagline: 'The flower island of jagged peaks & lush levadas',
        places: [
          { id: 'm1', title: 'Pico do Arieiro to Pico Ruivo', category: 'Alpine Trail', desc: 'Mountain ridge traverse above the cloud line.', tip: 'Tip: Watch the sunrise.' },
          { id: 'm2', title: '25 Fontes Levada Trail', category: 'UNESCO Nature', desc: 'Canal trail through ancient laurel forest.', tip: 'Tip: Start early.' },
          { id: 'mb1', title: 'Prainha do Caniçal', category: '🏖 Black Sand Beach', desc: 'Charming natural cove of dark volcanic sand.', tip: 'Tip: Beautiful contrast.' },
          { id: 'mb2', title: 'Praia da Calheta', category: '🏖 Golden Lagoon', desc: 'Protected twin beach with calm, warm waters.', tip: 'Tip: Great for families.' },
        ],
      },
    ],
  },
  es: {
    title: 'PortuStart',
    sub: 'Tu socio de reubicación para Portugal',
    selectLangTitle: 'Seleccionar idioma',
    tabServices: 'Servicios',
    tabPlaces: 'Explorar',
    tabAtms: 'CAJERO',
    tabDoctors: 'Médicos',
    tabPerks: 'Ofertas',
    tabTrans: 'Traductor',
    tabCalc: 'Salario',
    placesSectionTitle: '🇵🇹 Mapa interactivo y lugares',
    placesSectionSub: 'Mapa en vivo de Portugal – elige una región:',
    openInAppMaps: 'Abrir en Mapas',
    swipeInstruction: '👉 Desliza para ver lugares y tours:',
    openInMapsBtn: 'Ruta',
    gygBtn: 'Tickets y Tours (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Aprende portugués fluido',
    italkiBannerDesc: 'Encuentra profesores nativos certificados en italki.',
    italkiBtn: 'Buscar profesores (italki) ↗',
    atmSectionTitle: '🏧 Cajeros sin comisión (Multibanco)',
    atmSectionSub: 'Usa la red oficial Multibanco para retirar con Revolut o Wise:',
    atmTipTitle: '💡 Consejo clave:',
    atmTipDesc: 'Elige siempre cobro en Euros (€).',
    docSectionTitle: '🩺 Médicos de habla inglesa y emergencias',
    docSectionSub: 'Números de emergencia y clínicas privadas:',
    callDoctorBtn: 'Llamar',
    directionBtn: 'Ubicación',
    emergencyTitle: '🚨 Contactos de emergencia',
    perksSectionTitle: '🔥 Ofertas exclusivas para expatriados',
    perksSectionSub: 'Ahorra dinero con nuestros socios oficiales:',
    claimDealBtn: 'Obtener oferta ↗',
    perk1Title: 'Cuenta Revolut Expat',
    perk1Badge: 'Finanzas • Sin comisiones',
    perk1Desc: '• Cero comisiones en el extranjero\n• Incluye tarjeta física Visa\n• Ideal para alquiler y salario en PT',
    perk2Title: 'e-Residence NIF Express',
    perk2Badge: 'Gobierno • En 48h',
    perk2Desc: '• Sin cita presencial en Finanças\n• 100% digital y legal\n• Incluye firma digital',
    perk3Title: 'Clases de italki',
    perk3Badge: 'Idiomas • 1 a 1',
    perk3Desc: '• Profesores nativos de portugués\n• Clases online flexibles\n• Ideal para el día a día',
    congratsTitle: '🎉 ¡Felicitaciones!',
    congratsDesc: '¡Has completado con éxito los 7 pasos de tu hoja de ruta! Estás listo para tu nuevo comienzo en Portugal.',
    closeBtn: 'Cerrar',
    from: 'De:',
    to: 'A:',
    inputLabel: 'Entrada:',
    placeholderTrans: 'Introduce texto o habla...',
    btnTrans: 'Traducir',
    listenBtn: 'Escuchar (TTS)',
    speakBtn: 'Hablar (STT)',
    resultLabel: 'Resultado',
    servicesTitle: '📄 Servicios oficiales de reubicación',
    servicesSub: 'Solicita tus documentos 100% online a través de e-Residence:',
    checklistTitle: '📋 Hoja de ruta de los primeros 30 días',
    checklistSub: 'Tu lista de verificación paso a paso',
    checklistDone: 'completado',
    applyOnlineBtn: 'Solicitar online ↗',
    affiliateDisclosure: 'Transparencia: Estos enlaces dirigen a un procesamiento exprés con e-Residence. Recibimos una pequeña comisión sin coste adicional para ti.',
    affiliateCards: [
      { key: 'nif', title: 'NIF (Número de Identificación Fiscal)', badge: 'Paso 1 • Esencial', desc: 'La llave maestra para alquiler, tarjeta SIM y cuentas.', link: AFFILIATE_LINKS.eResidenceNif, icon: 'document-text' },
      { key: 'bank', title: 'Cuenta bancaria en Portugal', badge: 'Paso 2 • IBAN', desc: 'Abre una cuenta bancaria local compatible.', link: AFFILIATE_LINKS.eResidenceBank, icon: 'card' },
      { key: 'niss', title: 'NISS (Número de Seguridad Social)', badge: 'Paso 3 • Empleo', desc: 'Obligatorio para contratos de trabajo.', link: AFFILIATE_LINKS.eResidenceNiss, icon: 'shield-checkmark' },
      { key: 'health', title: 'Seguro médico internacional', badge: 'Paso 4 • Visado', desc: 'Cobertura médica requerida para visados.', link: AFFILIATE_LINKS.eResidenceHealth, icon: 'medkit' },
    ],
    calcTitle: '💶 Calculadora de salario neto',
    calcSub: 'Empleado soltero, Portugal continental (14 pagas).',
    calcGrossLabel: 'Salario bruto mensual (€):',
    calcBtn: 'Calcular',
    calcNetMonthly: 'Neto estimado (mensual):',
    calc14Notice: 'Basado en 14 pagos estándar / año',
    calcGrossRow: 'Bruto mensual:',
    calcSSRow: 'Seguridad Social (-11%):',
    calcIRSRow: 'Retención IRS:',
    checklist: [
      { id: 1, title: 'Obtener NIF (Número Fiscal)', tip: 'La llave maestra para alquiler y servicios.' },
      { id: 2, title: 'Conseguir tarjeta SIM local', tip: 'Esencial para autenticación digital.' },
      { id: 3, title: 'Abrir cuenta bancaria portuguesa', tip: 'Requerido para salario y depósitos.' },
      { id: 4, title: 'Contratar seguro médico', tip: 'Esencial para trámites de visado.' },
      { id: 5, title: 'Obtener número de Seguridad Social (NISS)', tip: 'Obligatorio para contratos.' },
      { id: 6, title: 'Registro de residencia (CRUE / AIMA)', tip: 'Ciudadanos de la UE en el ayuntamiento.' },
      { id: 7, title: 'Obtener número SNS (Salud)', tip: 'Acceso a centros de salud públicos.' },
    ],
    cities: [
      {
        id: 'lisboa',
        name: 'Lisboa',
        tagline: 'Ciudad de 7 colinas y Fado',
        places: [
          { id: 'l1', title: 'Torre de Belém', category: 'Patrimonio UNESCO', desc: 'Obra maestra manuelina junto al Tajo.', tip: 'Consejo: Llegar antes de las 10:00.' },
          { id: 'l2', title: 'Mirador de Santa Luzia', category: 'Mirador', desc: 'Vistas a los tejados de Alfama.', tip: 'Consejo: Visitar al atardecer.' },
          { id: 'l3', title: 'Praça do Comércio', category: 'Plaza histórica', desc: 'Gran plaza junto al río.', tip: 'Consejo: Inicio para paseos.' },
          { id: 'lb1', title: 'Playa de Carcavelos', category: '🏖 Playa de surf', desc: 'Playa más grande en la línea de Cascais.', tip: 'Consejo: 25 min en tren.' },
          { id: 'lb2', title: 'Playa de Galapinhos', category: '🏖 Naturaleza Arrábida', desc: 'Aguas cristalinas.', tip: 'Consejo: Llegar temprano.' },
        ],
      },
      {
        id: 'porto',
        name: 'Oporto',
        tagline: 'Arquitectura de granito y vino de Oporto',
        places: [
          { id: 'p1', title: 'Puente Don Luis I', category: 'Monumento', desc: 'Icónico puente de hierro sobre el Duero.', tip: 'Consejo: Cruza por la planta alta.' },
          { id: 'p2', title: 'Librería Lello', category: 'Arquitectura', desc: 'Famosa librería neogótica.', tip: 'Consejo: Reserva online.' },
          { id: 'p3', title: 'Bodegas de Vino', category: 'Cata', desc: 'Bodegas centenarias.', tip: 'Consejo: Reserva una cata.' },
          { id: 'pb1', title: 'Playa de Matosinhos', category: '🏖 Playa y marisco', desc: 'Amplia playa famosa por su pescado.', tip: 'Consejo: Prueba el pescado asado.' },
          { id: 'pb2', title: 'Playa de Miramar', category: '🏖 Capilla en el mar', desc: 'Capilla sobre rocas oceánicas.', tip: 'Consejo: Buena puesta de sol.' },
        ],
      },
      {
        id: 'sintra',
        name: 'Sintra y Cascais',
        tagline: 'Palacios de cuento y acantilados',
        places: [
          { id: 's1', title: 'Palacio Nacional da Pena', category: 'Palacio romántico', desc: 'Castillo colorido en las cumbres.', tip: 'Consejo: Reserva por la mañana.' },
          { id: 's2', title: 'Quinta da Regaleira', category: 'Finca mística', desc: 'Parque encantado con Pozo Iniciático.', tip: 'Consejo: Trae linterna.' },
          { id: 's3', title: 'Cabo da Roca', category: 'Maravilla natural', desc: 'Punto más occidental de Europa.', tip: 'Consejo: Lleva cortavientos.' },
          { id: 'sb1', title: 'Playa do Guincho', category: '🏖 Dunas y surf', desc: 'Paraíso del surf rodeado de dunas.', tip: 'Consejo: Paseo de madera.' },
          { id: 'sb2', title: 'Playa da Ursa', category: '🏖 Cala secreta', desc: 'Playa virgen salvaje.', tip: 'Consejo: Usa calzado de trekking.' },
        ],
      },
      {
        id: 'algarve',
        name: 'Faro y Algarve',
        tagline: 'Acantilados dorados y 300 días de sol',
        places: [
          { id: 'a1', title: 'Cueva de Benagil', category: 'Cuevas y playas', desc: 'Catedral marina esculpida por olas.', tip: 'Consejo: Alquila un kayak temprano.' },
          { id: 'a2', title: 'Ponta da Piedade', category: 'Costa de acantilados', desc: 'Arcos de piedra caliza.', tip: 'Consejo: Tour en barca pequeña.' },
          { id: 'a3', title: 'Parque de la Ría Formosa', category: 'Laguna e islas', desc: 'Humedal costero protegido.', tip: 'Consejo: Ferry a Armona.' },
          { id: 'ab1', title: 'Playa de la Marinha', category: '🏖 Top playa europea', desc: 'Arcos dobles y aguas cristalinas.', tip: 'Consejo: Ruta de los Valles Colgantes.' },
          { id: 'ab2', title: 'Playa de la Falésia', category: '🏖 Acantilados rojos', desc: 'Más de 6 km de arena.', tip: 'Consejo: Paseo con marea baja.' },
        ],
      },
      {
        id: 'coimbra',
        name: 'Coímbra y Centro',
        tagline: 'Antigua capital real e historia universitaria',
        places: [
          { id: 'c1', title: 'Biblioteca Joanina', category: 'Biblioteca barroca', desc: 'Biblioteca dorada con manuscritos.', tip: 'Consejo: Reserva entrada combinada.' },
          { id: 'c2', title: 'Monasterio de Santa Cruz', category: 'Historia y Fado', desc: 'Descanso de los primeros reyes.', tip: 'Consejo: Escucha fado nocturno.' },
          { id: 'cb1', title: 'Playa da Claridade', category: '🏖 Playa vasta', desc: 'Gran playa de arena con pasarelas.', tip: 'Consejo: 40 min en tren.' },
          { id: 'cb2', title: 'Playa de Mira', category: '🏖 Pesca tradicional', desc: 'Casas de madera a rayas.', tip: 'Consejo: Prueba calamares.' },
        ],
      },
      {
        id: 'madeira',
        name: 'Madeira (Funchal)',
        tagline: 'La isla de las flores y picos escarpados',
        places: [
          { id: 'm1', title: 'Pico do Arieiro a Pico Ruivo', category: 'Ruta alpina', desc: 'Travesía de crestas sobre las nubes.', tip: 'Consejo: Ver el amanecer.' },
          { id: 'm2', title: 'Levada das 25 Fontes', category: 'Naturaleza UNESCO', desc: 'Ruta de canales en bosque de laurisilva.', tip: 'Consejo: Empieza temprano.' },
          { id: 'mb1', title: 'Prainha do Caniçal', category: '🏖 Playa de arena negra', desc: 'Cala natural de arena volcánica.', tip: 'Consejo: Bonito contraste.' },
          { id: 'mb2', title: 'Playa da Calheta', category: '🏖 Laguna dorada', desc: 'Playa gemela protegida.', tip: 'Consejo: Ideal para familias.' },
        ],
      },
    ],
  },
  fr: {
    title: 'PortuStart',
    sub: 'Votre partenaire d’expatriation au Portugal',
    selectLangTitle: 'Sélectionner la langue',
    tabServices: 'Services',
    tabPlaces: 'Explorer',
    tabAtms: 'DAB',
    tabDoctors: 'Médecins',
    tabPerks: 'Bons plans',
    tabTrans: 'Traducteur',
    tabCalc: 'Salaire',
    placesSectionTitle: '🇵🇹 Carte interactive et sites',
    placesSectionSub: 'Carte en direct du Portugal – choisissez une région :',
    openInAppMaps: 'Ouvrir dans Plans',
    swipeInstruction: '👉 Glissez pour voir les sites et excursions :',
    openInMapsBtn: 'Itinéraire',
    gygBtn: 'Billets et Tours (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Apprenez à parler couramment le portugais',
    italkiBannerDesc: 'Trouvez des tuteurs natifs certifiés sur italki.',
    italkiBtn: 'Trouver des tuteurs (italki) ↗',
    atmSectionTitle: '🏧 Distributeurs sans frais (Multibanco)',
    atmSectionSub: 'Utilisez le réseau officiel Multibanco pour retirer avec Revolut ou Wise :',
    atmTipTitle: '💡 Conseil clé :',
    atmTipDesc: 'Choisissez toujours la facturation en Euros (€).',
    docSectionTitle: '🩺 Médecins anglophones et urgences',
    docSectionSub: 'Numéros d’urgence et cliniques privées :',
    callDoctorBtn: 'Appeler',
    directionBtn: 'Emplacement',
    emergencyTitle: '🚨 Contacts d’urgence',
    perksSectionTitle: '🔥 Offres exclusives pour expatriés',
    perksSectionSub: 'Économisez avec nos partenaires officiels :',
    claimDealBtn: 'Profiter de l’offre ↗',
    perk1Title: 'Compte Expat Revolut',
    perk1Badge: 'Finances • Sans frais',
    perk1Desc: '• Zéro frais de change\n• Carte Visa physique incluse\n• Idéal pour loyer et salaire au PT',
    perk2Title: 'e-Residence NIF Express',
    perk2Badge: 'Administratif • En 48h',
    perk2Desc: '• Sans déplacement aux Finanças\n• 100% numérique et légal\n• Signature numérique incluse',
    perk3Title: 'Cours de langues italki',
    perk3Badge: 'Langues • 1-à-1',
    perk3Desc: '• Professeurs natifs de portugais\n• Cours en ligne flexibles\n• Idéal pour le quotidien',
    congratsTitle: '🎉 Félicitations !',
    congratsDesc: 'Vous avez complété avec succès les 7 étapes de votre feuille de route ! Vous êtes prêt pour votre nouveau départ au Portugal.',
    closeBtn: 'Fermer',
    from: 'De :',
    to: 'Vers :',
    inputLabel: 'Saisie :',
    placeholderTrans: 'Entrez du texte ou parlez...',
    btnTrans: 'Traduire',
    listenBtn: 'Écouter (TTS)',
    speakBtn: 'Parler (STT)',
    resultLabel: 'Résultat',
    servicesTitle: '📄 Services officiels de relocalisation',
    servicesSub: 'Commandez vos documents 100% en ligne via e-Residence :',
    checklistTitle: '📋 Feuille de route des 30 premiers jours',
    checklistSub: 'Votre liste de contrôle étape par étape',
    checklistDone: 'terminé',
    applyOnlineBtn: 'Demander en ligne ↗',
    affiliateDisclosure: 'Transparence : ces liens mènent à un traitement express avec e-Residence. Nous recevons une petite commission sans coût supplémentaire pour vous.',
    affiliateCards: [
      { key: 'nif', title: 'NIF (Numéro fiscal portugais)', badge: 'Étape 1 • Essentiel', desc: 'La clé pour louer, carte SIM et comptes bancaires.', link: AFFILIATE_LINKS.eResidenceNif, icon: 'document-text' },
      { key: 'bank', title: 'Compte bancaire portugais', badge: 'Étape 2 • IBAN', desc: 'Ouvrez un compte bancaire local conforme.', link: AFFILIATE_LINKS.eResidenceBank, icon: 'card' },
      { key: 'niss', title: 'NISS (Sécurité sociale)', badge: 'Étape 3 • Emploi', desc: 'Obligatoire pour les contrats de travail.', link: AFFILIATE_LINKS.eResidenceNiss, icon: 'shield-checkmark' },
      { key: 'health', title: 'Assurance santé internationale', badge: 'Étape 4 • Visa', desc: 'Couverture requise pour les visas nomad.', link: AFFILIATE_LINKS.eResidenceHealth, icon: 'medkit' },
    ],
    calcTitle: '💶 Calculateur de salaire net',
    calcSub: 'Salarié célibataire, Portugal continental (14 mois).',
    calcGrossLabel: 'Salaire brut mensuel (€) :',
    calcBtn: 'Calculer',
    calcNetMonthly: 'Net estimé (mensuel) :',
    calc14Notice: 'Basé sur 14 versements standard / an',
    calcGrossRow: 'Brut mensuel :',
    calcSSRow: 'Sécurité sociale (-11%) :',
    calcIRSRow: 'Retenue IRS :',
    checklist: [
      { id: 1, title: 'Obtenir votre NIF (Numéro fiscal)', tip: 'La clé pour le loyer et la carte SIM.' },
      { id: 2, title: 'Obtenir une carte SIM portugaise', tip: 'Essentiel pour l’authentification numérique.' },
      { id: 3, title: 'Ouvrir un compte bancaire portugais', tip: 'Requis pour le salaire et les loyers.' },
      { id: 4, title: 'Souscrire une assurance santé', tip: 'Essentiel pour le traitement des visas.' },
      { id: 5, title: 'Obtenir le numéro de Sécurité sociale (NISS)', tip: 'Obligatoire pour la paie.' },
      { id: 6, title: 'Enregistrement de résidence (CRUE/AIMA)', tip: 'Les citoyens UE s’inscrivent à la mairie.' },
      { id: 7, title: 'Obtenir votre numéro SNS (Santé)', tip: 'Accès aux cliniques de soins primaires.' },
    ],
    cities: [
      {
        id: 'lisboa',
        name: 'Lisbonne',
        tagline: 'Ville aux 7 collines et au Fado',
        places: [
          { id: 'l1', title: 'Tour de Belém', category: 'Patrimoine UNESCO', desc: 'Chef-d’œuvre manuélin au bord du Tage.', tip: 'Conseil : Arriver avant 10h00.' },
          { id: 'l2', title: 'Miradouro de Santa Luzia', category: 'Point de vue', desc: 'Bougainvilliers surplombant l’Alfama.', tip: 'Conseil : Visiter au coucher du soleil.' },
          { id: 'l3', title: 'Praça do Comércio', category: 'Place historique', desc: 'Grande place ouvrant sur le fleuve.', tip: 'Conseil : Idéal pour débuter une marche.' },
          { id: 'lb1', title: 'Plage de Carcavelos', category: '🏖 Plage de surf', desc: 'Grande plage sur la ligne de Cascais.', tip: 'Conseil : 25 min de train.' },
          { id: 'lb2', title: 'Plage des Galapinhos', category: '🏖 Nature d’Arrábida', desc: 'Eaux cristallines sous les falaises.', tip: 'Conseil : Arriver tôt en été.' },
        ],
      },
      {
        id: 'porto',
        name: 'Porto',
        tagline: 'Architecture en granit et vin de Porto',
        places: [
          { id: 'p1', title: 'Pont Dom Luís I', category: 'Monument', desc: 'Pont en fer emblématique sur le Douro.', tip: 'Conseil : Traverser par le tablier supérieur.' },
          { id: 'p2', title: 'Librairie Lello', category: 'Architecture', desc: 'Célèbre librairie néogothique.', tip: 'Conseil : Réserver en ligne.' },
          { id: 'p3', title: 'Caves de vin de Porto', category: 'Dégustation', desc: 'Caves centenaires à Gaia.', tip: 'Conseil : Réserver une visite guidée.' },
          { id: 'pb1', title: 'Plage de Matosinhos', category: '🏖 Plage et fruits de mer', desc: 'Large plage connue pour ses restaurants de poisson.', tip: 'Conseil : Goûter le bar grillé.' },
          { id: 'pb2', title: 'Plage de Miramar', category: '🏖 Chapelle sur l’océan', desc: 'Chapelle du XVIIe siècle sur les rochers.', tip: 'Conseil : Superbe coucher de soleil.' },
        ],
      },
      {
        id: 'sintra',
        name: 'Sintra et Cascais',
        tagline: 'Palais de fées et falaises océaniques',
        places: [
          { id: 's1', title: 'Palais national de Pena', category: 'Palais romantique', desc: 'Château coloré sur les hauteurs de Sintra.', tip: 'Conseil : Réserver le matin.' },
          { id: 's2', title: 'Quinta da Regaleira', category: 'Domaine mystique', desc: 'Parc enchanté avec le Puits d’initiation.', tip: 'Conseil : Apporter une lampe torche.' },
          { id: 's3', title: 'Cabo da Roca', category: 'Merveille naturelle', desc: 'Point le plus occidental d’Europe.', tip: 'Conseil : Prenez un coupe-vent.' },
          { id: 'sb1', title: 'Plage du Guincho', category: '🏖 Dunes et surf', desc: 'Spot de surf mondialement connu.', tip: 'Conseil : Emprunter la passerelle en bois.' },
          { id: 'sb2', title: 'Plage de l’Ours (Ursa)', category: '🏖 Calanque sauvage', desc: 'Plage isolée flanquée de stacks géants.', tip: 'Conseil : Porter des chaussures de marche.' },
        ],
      },
      {
        id: 'algarve',
        name: 'Faro et Algarve',
        tagline: 'Falaises dorées et 300 jours de soleil',
        places: [
          { id: 'a1', title: 'Grotte marine de Benagil', category: 'Grottes et plages', desc: 'Célèbre cathédrale marine creusée par les vagues.', tip: 'Conseil : Louer un kayak tôt.' },
          { id: 'a2', title: 'Ponta da Piedade', category: 'Côte rocheuse', desc: 'Arches de calcaire et eaux turquoise.', tip: 'Conseil : Faire un tour en bateau.' },
          { id: 'a3', title: 'Parc de la Ria Formosa', category: 'Lagune et îles', desc: 'Zone humide côtière protégée.', tip: 'Conseil : Prenez le ferry pour Armona.' },
          { id: 'ab1', title: 'Plage de Marinha', category: '🏖 Top plage européenne', desc: 'Doubles arches et fonds marins.', tip: 'Conseil : Sentier des Sept Vallées Suspendues.' },
          { id: 'ab2', title: 'Plage de Falésia', category: '🏖 Falaises rouges', desc: 'Plus de 6 km de sable abrité.', tip: 'Conseil : Balade à marée basse.' },
        ],
      },
      {
        id: 'coimbra',
        name: 'Coimbra et Centre',
        tagline: 'Ancienne capitale royale et cité universitaire',
        places: [
          { id: 'c1', title: 'Bibliothèque Joanina', category: 'Bibliothèque baroque', desc: 'Bibliothèque dorée abritant des manuscrits.', tip: 'Conseil : Réserver un billet combiné.' },
          { id: 'c2', title: 'Monastère de Santa Cruz', category: 'Histoire et Fado', desc: 'Dernière demeure des premiers rois.', tip: 'Conseil : Assister à un concert de fado.' },
          { id: 'cb1', title: 'Plage de la Claridade', category: '🏖 Vaste plage', desc: 'Immense plage de sable avec passerelles.', tip: 'Conseil : 40 min de train.' },
          { id: 'cb2', title: 'Plage de Mira', category: '🏖 Pêche traditionnelle', desc: 'Village pittoresque aux maisons rayées.', tip: 'Conseil : Goûter les calamars frits.' },
        ],
      },
      {
        id: 'madeira',
        name: 'Madère (Funchal)',
        tagline: 'L’île aux fleurs aux sommets escarpés et levadas',
        places: [
          { id: 'm1', title: 'Pico do Arieiro au Pico Ruivo', category: 'Sentier alpin', desc: 'Traversée de crêtes au-dessus des nuages.', tip: 'Conseil : Assister au lever du soleil.' },
          { id: 'm2', title: 'Sentier des 25 Fontes', category: 'Nature UNESCO', desc: 'Randonnée le long des canaux de la forêt de lauriers.', tip: 'Conseil : Partir tôt.' },
          { id: 'mb1', title: 'Prainha do Caniçal', category: '🏖 Plage de sable noir', desc: 'Charmante crique naturelle de sable volcanique.', tip: 'Conseil : Superbe contraste de couleurs.' },
          { id: 'mb2', title: 'Plage de Calheta', category: '🏖 Lagon doré', desc: 'Plage jumelle protégée aux eaux calmes.', tip: 'Conseil : Idéal en famille.' },
        ],
      },
    ],
  },
  it: {
    title: 'PortuStart',
    sub: 'Il tuo partner per il trasferimento in Portogallo',
    selectLangTitle: 'Seleziona lingua',
    tabServices: 'Servizi',
    tabPlaces: 'Esplora',
    tabAtms: 'Bancomat',
    tabDoctors: 'Medici',
    tabPerks: 'Offerte',
    tabTrans: 'Traduttore',
    tabCalc: 'Stipendio',
    placesSectionTitle: '🇵🇹 Mappa interattiva e luoghi',
    placesSectionSub: 'Mappa in tempo reale del Portogallo – scegli una regione:',
    openInAppMaps: 'Apri in Mappe',
    swipeInstruction: '👉 Scorri in orizzontale per luoghi e tour:',
    openInMapsBtn: 'Percorso',
    gygBtn: 'Biglietti e Tour (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Impara a parlare portoghese fluentemente',
    italkiBannerDesc: 'Trova tutor madrelingua certificati su italki.',
    italkiBtn: 'Trova tutor (italki) ↗',
    atmSectionTitle: '🏧 Bancomat senza commissioni (Multibanco)',
    atmSectionSub: 'Usa la rete ufficiale Multibanco per prelevare con Revolut o Wise:',
    atmTipTitle: '💡 Consiglio importante:',
    atmTipDesc: 'Scegli sempre di pagare in Euro (€).',
    docSectionTitle: '🩺 Medici di lingua inglese ed emergenze',
    docSectionSub: 'Numeri di emergenza e cliniche private:',
    callDoctorBtn: 'Chiama',
    directionBtn: 'Posizione',
    emergencyTitle: '🚨 Contatti di emergenza',
    perksSectionTitle: '🔥 Offerte esclusive per expat',
    perksSectionSub: 'Risparmia con i nostri partner ufficiali:',
    claimDealBtn: 'Ottieni offerta ↗',
    perk1Title: 'Conto Expat Revolut',
    perk1Badge: 'Finanza • Senza commissioni',
    perk1Desc: '• Zero commissioni di cambio\n• Include carta fisica Visa\n• Perfetto per affitto e stipendio in PT',
    perk2Title: 'e-Residence NIF Express',
    perk2Badge: 'Governo • In 48h',
    perk2Desc: '• Senza appuntamento di persona\n• 100% digitale e legale\n• Firma digitale inclusa',
    perk3Title: 'Lezioni italki',
    perk3Badge: 'Lingue • 1-a-1',
    perk3Desc: '• Tutor madrelingua di portoghese\n• Orari online flessibili\n• Ideale per la vita di tutti i giorni',
    congratsTitle: '🎉 Congratulazioni!',
    congratsDesc: 'Hai completato con successo tutti i 7 passaggi della tua roadmap! Sei pronto per il tuo nuovo inizio in Portogallo.',
    closeBtn: 'Chiudi',
    from: 'Da:',
    to: 'A:',
    inputLabel: 'Inserimento:',
    placeholderTrans: 'Inserisci testo o parla...',
    btnTrans: 'Traduci',
    listenBtn: 'Ascolta (TTS)',
    speakBtn: 'Parla (STT)',
    resultLabel: 'Risultato',
    servicesTitle: '📄 Servizi ufficiali di trasferimento',
    servicesSub: 'Richiedi i tuoi documenti 100% online tramite e-Residence:',
    checklistTitle: '📋 Roadmap primi 30 giorni',
    checklistSub: 'La tua checklist passo dopo passo',
    checklistDone: 'completato',
    applyOnlineBtn: 'Richiedi online ↗',
    affiliateDisclosure: 'Trasparenza: Questi link portano a un’elaborazione express con e-Residence. Riceviamo una piccola commissione senza costi aggiuntivi per te.',
    affiliateCards: [
      { key: 'nif', title: 'NIF (Codice fiscale portoghese)', badge: 'Passo 1 • Essenziale', desc: 'La chiave per affitti, SIM e conti bancari.', link: AFFILIATE_LINKS.eResidenceNif, icon: 'document-text' },
      { key: 'bank', title: 'Conto bancario portoghese', badge: 'Passo 2 • IBAN', desc: 'Apri un conto locale conforme.', link: AFFILIATE_LINKS.eResidenceBank, icon: 'card' },
      { key: 'niss', title: 'NISS (Codice di previdenza sociale)', badge: 'Passo 3 • Lavoro', desc: 'Obbligatorio per contratti di lavoro.', link: AFFILIATE_LINKS.eResidenceNiss, icon: 'shield-checkmark' },
      { key: 'health', title: 'Assicurazione sanitaria internazionale', badge: 'Passo 4 • Visto', desc: 'Copertura richiesta per visti nomad.', link: AFFILIATE_LINKS.eResidenceHealth, icon: 'medkit' },
    ],
    calcTitle: '💶 Calcolatore stipendio netto',
    calcSub: 'Dipendente single, Portogallo continentale (14 mensilità).',
    calcGrossLabel: 'Stipendio lordo mensile (€):',
    calcBtn: 'Calcola',
    calcNetMonthly: 'Netto stimato (mensile):',
    calc14Notice: 'Basato su 14 pagamenti standard / anno',
    calcGrossRow: 'Lordo mensile:',
    calcSSRow: 'Sicurezza sociale (-11%):',
    calcIRSRow: 'Trattenuta IRS:',
    checklist: [
      { id: 1, title: 'Ottieni il tuo NIF (Codice fiscale)', tip: 'La chiave per affitto e SIM.' },
      { id: 2, title: 'Procura una SIM portoghese', tip: 'Essenziale per l’autenticazione digitale.' },
      { id: 3, title: 'Apri un conto bancario portoghese', tip: 'Richiesto per stipendio e depositi.' },
      { id: 4, title: 'Sottoscrivi un’assicurazione sanitaria', tip: 'Essenziale per le pratiche di visto.' },
      { id: 5, title: 'Ottieni il numero di previdenza sociale (NISS)', tip: 'Obbligatorio per la busta paga.' },
      { id: 6, title: 'Registrazione residenza (CRUE / AIMA)', tip: 'I cittadini UE si registrano in comune.' },
      { id: 7, title: 'Ottieni il numero SNS (Sanità)', tip: 'Accesso alle cliniche pubbliche di base.' },
    ],
    cities: [
      {
        id: 'lisboa',
        name: 'Lisbona',
        tagline: 'Città dei 7 colli e del Fado',
        places: [
          { id: 'l1', title: 'Torre di Belém', category: 'Patrimonio UNESCO', desc: 'Capolavoro manuelino lungo il Tago.', tip: 'Consiglio: Arrivare prima delle 10:00.' },
          { id: 'l2', title: 'Miradouro de Santa Luzia', category: 'Belvedere', desc: 'Bougainvillea con vista sui tetti dell’Alfama.', tip: 'Consiglio: Visitare al tramonto.' },
          { id: 'l3', title: 'Praça do Comércio', category: 'Piazza storica', desc: 'Grande piazza sul fiume.', tip: 'Consiglio: Ottimo punto di partenza.' },
          { id: 'lb1', title: 'Spiaggia di Carcavelos', category: '🏖 Spiaggia da surf', desc: 'La spiaggia più grande sulla linea di Cascais.', tip: 'Consiglio: 25 min di treno.' },
          { id: 'lb2', title: 'Spiaggia di Galapinhos', category: '🏖 Natura dell’Arrábida', desc: 'Acque cristalline sotto le scogliere.', tip: 'Consiglio: Arrivare presto in estate.' },
        ],
      },
      {
        id: 'porto',
        name: 'Porto',
        tagline: 'Architettura in granito e vino Porto',
        places: [
          { id: 'p1', title: 'Ponte Dom Luís I', category: 'Monumento', desc: 'Iconico ponte in ferro sul Douro.', tip: 'Consiglio: Cammina sul ponte superiore.' },
          { id: 'p2', title: 'Libreria Lello', category: 'Architettura', desc: 'Famosa libreria neogotica.', tip: 'Consiglio: Prenota online.' },
          { id: 'p3', title: 'Cantine del Porto', category: 'Degustazione', desc: 'Cantine secolari a Gaia.', tip: 'Consiglio: Prenota una degustazione guidata.' },
          { id: 'pb1', title: 'Spiaggia di Matosinhos', category: '🏖 Spiaggia e pesce', desc: 'Ampia spiaggia famosa per i ristoranti di pesce.', tip: 'Consiglio: Prova il branzino alla griglia.' },
          { id: 'pb2', title: 'Spiaggia di Miramar', category: '🏖 Cappella sull’oceano', desc: 'Cappella del XVII secolo sugli scogli.', tip: 'Consiglio: Ottimo per foto al tramonto.' },
        ],
      },
      {
        id: 'sintra',
        name: 'Sintra e Cascais',
        tagline: 'Palazzi da fiaba e scogliere oceaniche',
        places: [
          { id: 's1', title: 'Palazzo Nazionale di Pena', category: 'Palazzo romantico', desc: 'Castello colorato sulle vette di Sintra.', tip: 'Consiglio: Prenota la mattina.' },
          { id: 's2', title: 'Quinta da Regaleira', category: 'Tenuta mistica', desc: 'Parco incantato con il Pozzo Iniziatico.', tip: 'Consiglio: Porta una torcia.' },
          { id: 's3', title: 'Cabo da Roca', category: 'Meraviglia naturale', desc: 'Il punto più occidentale dell’Europa continentale.', tip: 'Consiglio: Porta una giacca a vento.' },
          { id: 'sb1', title: 'Spiaggia del Guincho', category: '🏖 Dune e surf', desc: 'Paradiso del surf incorniciato da dune.', tip: 'Consiglio: Percorri la passerella in legno.' },
          { id: 'sb2', title: 'Spiaggia dell’Orsa (Ursa)', category: '🏖 Cala segreta', desc: 'Spiaggia selvaggia e isolata.', tip: 'Consiglio: Indossa scarpe da trekking.' },
        ],
      },
      {
        id: 'algarve',
        name: 'Faro e Algarve',
        tagline: 'Scogliere dorate e 300 giorni di sole',
        places: [
          { id: 'a1', title: 'Grotta di Benagil', category: 'Grotte e spiagge', desc: 'Famosa cattedrale marina scolpita dalle onde.', tip: 'Consiglio: Noleggia un kayak presto.' },
          { id: 'a2', title: 'Ponta da Piedade', category: 'Costiera a falesia', desc: 'Archi di calcare e acque turchesi.', tip: 'Consiglio: Fai un tour in barca.' },
          { id: 'a3', title: 'Parco della Ria Formosa', category: 'Laguna e isole', desc: 'Zona umida costiera protetta.', tip: 'Consiglio: Traghetto per Armona.' },
          { id: 'ab1', title: 'Spiaggia di Marinha', category: '🏖 Top spiaggia europea', desc: 'Doppi archi marini e acque cristalline.', tip: 'Consiglio: Sentiero delle Sette Valli Sospese.' },
          { id: 'ab2', title: 'Spiaggia di Falésia', category: '🏖 Falesie rosse', desc: 'Oltre 6 km di sabbia riparata.', tip: 'Consiglio: Passeggiata con la bassa marea.' },
        ],
      },
      {
        id: 'coimbra',
        name: 'Coimbra e Centro',
        tagline: 'Antica capitale reale e storia universitaria',
        places: [
          { id: 'c1', title: 'Biblioteca Joanina', category: 'Biblioteca barocca', desc: 'Biblioteca dorata con manoscritti storici.', tip: 'Consiglio: Prenota il biglietto combinato.' },
          { id: 'c2', title: 'Monastero di Santa Cruz', category: 'Storia e Fado', desc: 'Luogo di riposo dei primi re.', tip: 'Consiglio: Ascolta il fado serale.' },
          { id: 'cb1', title: 'Spiaggia da Claridade', category: '🏖 Vasta spiaggia', desc: 'Enorme spiaggia sabbiosa con passerelle.', tip: 'Consiglio: 40 min di treno.' },
          { id: 'cb2', title: 'Spiaggia di Mira', category: '🏖 Pesca tradizionale', desc: 'Pittoresca spiaggia con casette a righe.', tip: 'Consiglio: Assaggia i calamari fritti.' },
        ],
      },
      {
        id: 'madeira',
        name: 'Madera (Funchal)',
        tagline: 'L’isola dei fiori tra cime aspre e levadas',
        places: [
          { id: 'm1', title: 'Da Pico do Arieiro a Pico Ruivo', category: 'Sentiero alpino', desc: 'Traversata di crête montuosa sopra le nuvole.', tip: 'Consiglio: Guarda l’alba.' },
          { id: 'm2', title: 'Sentiero delle 25 Fontes', category: 'Natura UNESCO', desc: 'Sentiero tra canali nella foresta dialloro.', tip: 'Consiglio: Inizia presto.' },
          { id: 'mb1', title: 'Prainha do Caniçal', category: '🏖 Spiaggia di sabbia nera', desc: 'Deliziosa caletta naturale di sabbia vulcanica.', tip: 'Consiglio: Bellissimo contrasto cromatico.' },
          { id: 'mb2', title: 'Spiaggia di Calheta', category: '🏖 Laguna dorata', desc: 'Spiaggia gemella protetta con acque calme.', tip: 'Consiglio: Ideale per famiglie.' },
        ],
      },
    ],
  },
  uk: {
    title: 'PortuStart',
    sub: 'Ваш партнер з релокації в Португалію',
    selectLangTitle: 'Виберіть мову програми',
    tabServices: 'Сервіси',
    tabPlaces: 'Огляд',
    tabAtms: 'Банкомати',
    tabDoctors: 'Лікарі',
    tabPerks: 'Знижки',
    tabTrans: 'Перекладач',
    tabCalc: 'Зарплата',
    placesSectionTitle: '🇵🇹 Інтерактивна карта та місця',
    placesSectionSub: 'Жива карта Португалії – виберіть регіон:',
    openInAppMaps: 'Відкрити в Картах',
    swipeInstruction: '👉 Гортайте для перегляду місць та турів:',
    openInMapsBtn: 'Маршрут',
    gygBtn: 'Квитки та тури (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Вивчайте португальську вільно',
    italkiBannerDesc: 'Знайдіть сертифікованих носіїв мови на italki.',
    italkiBtn: 'Знайти репетиторів (italki) ↗',
    atmSectionTitle: '🏧 Банкомати без комісії (Multibanco)',
    atmSectionSub: 'Використовуйте мережу Multibanco для зняття готівки через Revolut або Wise:',
    atmTipTitle: '💡 Важлива порада:',
    atmTipDesc: 'Завжди обирайте списання в євро (€).',
    docSectionTitle: '🩺 Англомовні лікарі та екстрені служби',
    docSectionSub: 'Важливі номери та приватні клініки:',
    callDoctorBtn: 'Подзвонити',
    directionBtn: 'Локація',
    emergencyTitle: '🚨 Екстрені контакти',
    perksSectionTitle: '🔥 Ексклюзивні пропозиції для експатів',
    perksSectionSub: 'Економте кошти з нашими офіційними партнерами:',
    claimDealBtn: 'Отримати знижку ↗',
    perk1Title: 'Рахунок Revolut Expat',
    perk1Badge: 'Фінанси • Без комісій',
    perk1Desc: '• Нуль комісій за конвертацію\n• Фізична картка Visa в комплекті\n• Ідеально для оренди та зарплати в PT',
    perk2Title: 'e-Residence NIF Express',
    perk2Badge: 'Держпослуги • За 48г',
    perk2Desc: '• Без візитів до Finanças\n• 100% цифровий процес\n• Цифровий підпис включено',
    perk3Title: 'Мовні курси italki',
    perk3Badge: 'Мови • 1-на-1',
    perk3Desc: '• Носії португальської мови\n• Гнучкий онлайн-графік\n• Ідеально для адаптації',
    congratsTitle: '🎉 Вітаємо!',
    congratsDesc: 'Ви успішно пройшли всі 7 кроків дорожньої карти! Ви готові до нового початку в Португалії.',
    closeBtn: 'Закрити',
    from: 'Від:',
    to: 'До:',
    inputLabel: 'Введення:',
    placeholderTrans: 'Введіть текст або кажіть...',
    btnTrans: 'Перекласти',
    listenBtn: 'Прослухати (TTS)',
    speakBtn: 'Говорити (STT)',
    resultLabel: 'Результат',
    servicesTitle: '📄 Офіційні послуги релокації',
    servicesSub: 'Замовляйте документи 100% онлайн через e-Residence:',
    checklistTitle: '📋 Дорожня карта на перші 30 днів',
    checklistSub: 'Ваш покроковий чек-лист',
    checklistDone: 'виконано',
    applyOnlineBtn: 'Подати заявку онлайн ↗',
    affiliateDisclosure: 'Прозорість: Ці посилання ведуть на експрес-обробку через e-Residence. Ми отримуємо невелику комісію без додаткових витрат для вас.',
    affiliateCards: [
      { key: 'nif', title: 'NIF (Податковий номер у Португалії)', badge: 'Крок 1 • Основа', desc: 'Ключ до оренди, SIM-карти та банківського рахунку.', link: AFFILIATE_LINKS.eResidenceNif, icon: 'document-text' },
      { key: 'bank', title: 'Португальський банківський рахунок', badge: 'Крок 2 • IBAN', desc: 'Відкрийте офіційний рахунок з місцевим IBAN.', link: AFFILIATE_LINKS.eResidenceBank, icon: 'card' },
      { key: 'niss', title: 'NISS (Номер соціального страхування)', badge: 'Крок 3 • Робота', desc: 'Необхідно для трудового договору.', link: AFFILIATE_LINKS.eResidenceNiss, icon: 'shield-checkmark' },
      { key: 'health', title: 'Міжнародне медичне страхування', badge: 'Крок 4 • Віза', desc: 'Покриття, необхідне для віз цифрових кочівників.', link: AFFILIATE_LINKS.eResidenceHealth, icon: 'medkit' },
    ],
    calcTitle: '💶 Калькулятор чистої зарплати',
    calcSub: 'Для нежонатих працівників у материковій Португалії (14 зарплат).',
    calcGrossLabel: 'Місячна брутто-зарплата (€):',
    calcBtn: 'Розрахувати',
    calcNetMonthly: 'Орієнтовний чистий дохід (місяць):',
    calc14Notice: 'На основі 14 виплат на рік',
    calcGrossRow: 'Брутто на місяць:',
    calcSSRow: 'Соцстрах (-11%):',
    calcIRSRow: 'Податок IRS:',
    checklist: [
      { id: 1, title: 'Отримати податковий номер (NIF)', tip: 'Головний ключ для оренди та мобільного зв’язку.' },
      { id: 2, title: 'Придбати португальську SIM-карту', tip: 'Потрібно для цифровізації (Chave Móvel).' },
      { id: 3, title: 'Відкрити банківський рахунок', tip: 'Необхідно для зарплати та застави за житло.' },
      { id: 4, title: 'Оформити медичну страховку', tip: 'Необхідно для візи та доступу до SNS.' },
      { id: 5, title: 'Отримати номер соцстрахування (NISS)', tip: 'Потрібно для офіційного працевлаштування.' },
      { id: 6, title: 'Реєстрація резиденції (CRUE / AIMA)', tip: 'Громадяни ЄС реєструються в мерії (Câmara).' },
      { id: 7, title: 'Отримати номер SNS (Центр здоров’я)', tip: 'Доступ до державних поліклінік.' },
    ],
    cities: [
      {
        id: 'lisboa',
        name: 'Лісабон',
        tagline: 'Місто на 7 пагорбах, фаду та оглядових майданчиків',
        places: [
          { id: 'l1', title: 'Торрі-де-Белен та Єроніміт', category: 'Спадщина ЮНЕСКО', desc: 'Шедевр мануеліно на березі Тежу.', tip: 'Порада: приходьте до 10:00.' },
          { id: 'l2', title: 'Мірадору-де-Санта-Лузія', category: 'Оглядовий майданчик', desc: 'Бугенвілії з видом на дахи району Альфама.', tip: 'Порада: відвідайте на заході сонця.' },
          { id: 'l3', title: 'Торгова площа (Praca do Comercio)', category: 'Історична площа', desc: 'Величезна палацова площа біля води.', tip: 'Порада: чудове місце для прогулянки.' },
          { id: 'lb1', title: 'Пляж Каркавелуш', category: '🏖 Пляж для серфінгу', desc: 'Найбільший піщаний пляж на лінії Кашкайш.', tip: 'Порада: 25 хв на потязі від центру.' },
          { id: 'lb2', title: 'Пляж Галапіньюш', category: '🏖 Природа Аррабіди', desc: 'Кристально чиста вода серед скель заповідника.', tip: 'Порада: приїжджайте рано влітку.' },
        ],
      },
      {
        id: 'porto',
        name: 'Порту',
        tagline: 'Гранітна архітектура, портвейн та величні мости',
        places: [
          { id: 'p1', title: 'Міст дона Луїша I та Рібейра', category: 'Символ міста', desc: 'Двоярусний залізний арочний міст через Дору.', tip: 'Порада: пройдіться верхнім ярусом.' },
          { id: 'p2', title: 'Книгарня Леллу', category: 'Архітектура', desc: 'Всесвітньо відома неоготична книгарня.', tip: 'Порада: бронюйте квитки онлайн.' },
          { id: 'p3', title: 'Підвали портвейну в Гая', category: 'Дегустація', desc: 'Історичні винні погреби з човнами.', tip: 'Порада: забронюйте екскурсію.' },
          { id: 'pb1', title: 'Пляж Матозіньюш', category: '🏖 Пляж та морепродукти', desc: 'Широкий пляж біля метро, відомий рибою.', tip: 'Порада: скуштуйте смажену рибу.' },
          { id: 'pb2', title: 'Пляж Мірамар', category: '🏖 Каплиця в океані', desc: 'Красива каплиця Сеньйор-да-Педра на скелі.', tip: 'Порада: чудові фото на заході сонця.' },
        ],
      },
      {
        id: 'sintra',
        name: 'Сінтра та Кашкайш',
        tagline: 'Казкові палаци в туманних лісах та океанські скелі',
        places: [
          { id: 's1', title: 'Національний палац Пена', category: 'Казковий палац', desc: 'Барвистий романтичний замок на гірських хребтах.', tip: 'Порада: бронюйте ранкові слоти.' },
          { id: 's2', title: 'Кінта-да-Регалейра', category: 'Містичний парк', desc: 'Зачарований маєток із колодязем посвячення.', tip: 'Порада: візьміть ліхтарик.' },
          { id: 's3', title: 'Мис Рока (Cabo da Roca)', category: 'Природне диво', desc: 'Найзахідніша точка континентальної Європи.', tip: 'Порада: візьміть вітровку.' },
          { id: 'sb1', title: 'Пляж Гіншу', category: '🏖 Дюни та серфінг', desc: 'Всесвітньо відомий спот для серфінгу.', tip: 'Порада: використовуйте дерев’яні доріжки.' },
          { id: 'sb2', title: 'Пляж Урса', category: '🏖 Дика бухта', desc: 'Вражаючі скелі, доступні через пішохідну стежку.', tip: 'Порада: вдягайте міцне взуття.' },
        ],
      },
      {
        id: 'algarve',
        name: 'Фару та Алгарве',
        tagline: 'Золоті скелі та 300 сонячних днів на рік',
        places: [
          { id: 'a1', title: 'Бенагілська морська печера', category: 'Гроти та пляжі', desc: 'Знаменита печера з круглим природним вікном.', tip: 'Порада: досліджуйте на каяку вранці.' },
          { id: 'a2', title: 'Понта-да-П'єдаде (Лагуш)', category: 'Скелястий берег', desc: 'Бітумні вежі та бірюзова вода.', tip: 'Порада: візьміть прогулянку на човні.' },
          { id: 'a3', title: 'Природний парк Ріа-Формоза', category: 'Лагуна та острови', desc: 'Величезна заповідна прибережна зона.', tip: 'Порада: пором на острів Армона.' },
          { id: 'ab1', title: 'Пляж Марінья', category: '🏖 Топ-пляж Європи', desc: 'Подвійні арки та кришталева вода для снорклінгу.', tip: 'Порада: стежка Сім висічених долин.' },
          { id: 'ab2', title: 'Пляж Фалезія', category: '🏖 Червоні скелі', desc: 'Понад 6 км піску під червоними стрімчаками.', tip: 'Порада: прогулянка босоніж під час відливу.' },
        ],
      },
      {
        id: 'coimbra',
        name: 'Коїмбра та Центр',
        tagline: 'Стародавня королівська столиця та університет',
        places: [
          { id: 'c1', title: 'Бібліотека Жуаніна', category: 'Історична бібліотека', desc: 'Барокова перлина з позолотою XVIII століття.', tip: 'Порада: беріть комбінований квиток.' },
          { id: 'c2', title: 'Монастир Санта-Круш', category: 'Історія та фаду', desc: 'Місце спочинку перших королів Португалії.', tip: 'Порада: відвідайте концерт фаду.' },
          { id: 'cb1', title: 'Пляж Кларідаде (Фігейра)', category: '🏖 Широкий пляж', desc: 'Величезна піщана зона з доріжками до води.', tip: 'Порада: 40 хв потягом з Коїмбри.' },
          { id: 'cb2', title: 'Пляж Міра', category: '🏖 Традиції та дюни', desc: 'Мальовничий пляж з кольоровими дерев’яними будиночками.', tip: 'Порада: скуштуйте свіжі кальмари.' },
        ],
      },
      {
        id: 'madeira',
        name: 'Мадейра (Funchal)',
        tagline: 'Острів квітів із гострими піками та левадами',
        places: [
          { id: 'm1', title: 'Піку-ду-Аріейру до Піку-Руіву', category: 'Альпійський маршрут', desc: 'Захоплюючий хребетний похід вище хмар.', tip: 'Порада: вирушайте на світанку.' },
          { id: 'm2', title: 'Левада 25 дівчат (25 Fontes)', category: 'Природа ЮНЕСКО', desc: 'Прогулянка вздовж стародавніх каналів у лавровому лісі.', tip: 'Порада: виходьте якомога раніше.' },
          { id: 'mb1', title: 'Пляж Канісал (Prainha)', category: '🏖 Чорний пісок', desc: 'Прихована бухта з вулканічним темним піском.', tip: 'Порада: чудове поєднання кольорів.' },
          { id: 'mb2', title: 'Пляж Кальєта', category: '🏖 Золота лагуна', desc: 'Захищений подвійний пляж із тихою водою.', tip: 'Порада: ідеально для сімейного відпочинку.' },
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
  const [congratsModalVisible, setCongratsModalVisible] = useState(false);
  const [lastCompletedCount, setLastCompletedCount] = useState(0);

  // Onboarding Slideshow State
  const [onboardingVisible, setOnboardingVisible] = useState(true);
  const [onboardingStepIndex, setOnboardingStepIndex] = useState(0);

  const t = LOCALES[appLang] || LOCALES['de'];
  const onboardingSteps = t.onboardingSteps || LOCALES['de'].onboardingSteps;

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
  const [calcResult, setCalcResult] = useState(null);

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
    const newCheckedMap = { ...checkedMap, [id]: !checkedMap[id] };
    setCheckedMap(newCheckedMap);

    const newCompletedCount = t.checklist.filter((item) => newCheckedMap[item.id]).length;
    if (newCompletedCount === t.checklist.length && lastCompletedCount < t.checklist.length) {
      setCongratsModalVisible(true);
    }
    setLastCompletedCount(newCompletedCount);
  };

  const completedCount = t.checklist.filter((item) => checkedMap[item.id]).length;

  const dialNumber = (number) => {
    Linking.openURL(`tel:${number}`).catch(() => Alert.alert('Info', `Nummer wählen: ${number}`));
  };

  const openUrl = (url) => {
    Linking.openURL(url).catch(() => Alert.alert('Fehler', 'Link konnte nicht geöffnet werden.'));
  };

  const openCityInNativeMaps = (lat, lng, label) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
      web: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    Linking.openURL(url).catch(() => {
      openUrl(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
    });
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
        const speechToTextResult = event.results[0][0].transcript;
        setInputText(speechToTextResult);
      };
      recognition.onerror = () => Alert.alert('Fehler', 'Spracherkennung fehlgeschlagen.');
      recognition.start();
    } else {
      Alert.alert('Speech-to-Text (STT)', 'Mikrofon-Eingabe (Simulation): Bitte Text manuell eingeben oder auf Mobilgeräten nutzen.');
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const langPair = `${sourceLang}|${targetLang}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText.trim())}&langpair=${langPair}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.responseData?.translatedText) {
        setTranslatedText(data.responseData.translatedText);
      }
    } catch {
      setTranslatedText('Verbindungsfehler.');
    } finally {
      setLoading(false);
    }
  };

  const calculateNetSalary = (gross) => {
    const salary = parseFloat(gross) || 0;
    const ssAmount = salary * 0.11;
    let irsRate = salary <= 820 ? 0 : salary <= 1300 ? 0.11 : salary <= 2000 ? 0.18 : 0.25;
    const irsAmount = salary * irsRate;
    const netMonthly = salary - ssAmount - irsAmount;
    setCalcResult({
      gross: salary.toFixed(2),
      ss: ssAmount.toFixed(2),
      irs: irsAmount.toFixed(2),
      irsPercent: (irsRate * 100).toFixed(0),
      netMonthly: netMonthly.toFixed(2),
      netAnnual: (netMonthly * 14).toFixed(2),
    });
  };

  const mapEmbedUrl = `https://maps.google.com/maps?q=${currentCityMeta.lat},${currentCityMeta.lng}&z=${currentCityMeta.zoom}&output=embed`;
  const atmMapUrl = `https://maps.google.com/maps?q=Multibanco+Portugal&z=12&output=embed`;
  const doctorsMapUrl = `https://maps.google.com/maps?q=Hospital+Lisbon+Porto+Algarve&z=7&output=embed`;

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

        {/* 7-FACH MENÜLEISTE */}
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'services' && styles.tabButtonActive]} onPress={() => setActiveTab('services')}>
              <Ionicons name="briefcase" size={11} color={activeTab === 'services' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'services' && styles.tabTextActive]}>{t.tabServices}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabButton, activeTab === 'places' && styles.tabButtonActive]} onPress={() => setActiveTab('places')}>
              <Ionicons name="map" size={11} color={activeTab === 'places' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'places' && styles.tabTextActive]}>{t.tabPlaces}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabButton, activeTab === 'atms' && styles.tabButtonActive]} onPress={() => setActiveTab('atms')}>
              <Ionicons name="card" size={11} color={activeTab === 'atms' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'atms' && styles.tabTextActive]}>{t.tabAtms}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabButton, activeTab === 'doctors' && styles.tabButtonActive]} onPress={() => setActiveTab('doctors')}>
              <Ionicons name="medkit" size={11} color={activeTab === 'doctors' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'doctors' && styles.tabTextActive]}>{t.tabDoctors}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabButton, activeTab === 'perks' && styles.tabButtonActive]} onPress={() => setActiveTab('perks')}>
              <Ionicons name="gift" size={11} color={activeTab === 'perks' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'perks' && styles.tabTextActive]}>{t.tabPerks}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabButton, activeTab === 'trans' && styles.tabButtonActive]} onPress={() => setActiveTab('trans')}>
              <Ionicons name="chatbubbles" size={11} color={activeTab === 'trans' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'trans' && styles.tabTextActive]}>{t.tabTrans}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabButton, activeTab === 'calc' && styles.tabButtonActive]} onPress={() => { setActiveTab('calc'); if (!calcResult) calculateNetSalary(grossInput); }}>
              <Ionicons name="calculator" size={11} color={activeTab === 'calc' ? '#fff' : '#64748B'} />
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

        {/* TAB 2: PLACES / ENTDECKEN */}
        {activeTab === 'places' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>{t.placesSectionTitle}</Text>
              <Text style={styles.subText}>{t.placesSectionSub}</Text>

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

              <View style={styles.liveMapWrapper}>
                {Platform.OS === 'web' ? (
                  <iframe title="Portugal Interactive Map" src={mapEmbedUrl} style={styles.mapIframe} loading="lazy" allowFullScreen />
                ) : (
                  <View style={styles.nativeMapFallback}>
                    <Ionicons name="map-outline" size={40} color="#0F5132" />
                    <Text style={styles.nativeMapText}>Portugal Live-Karte</Text>
                  </View>
                )}
                
                <TouchableOpacity style={styles.floatingOpenMapsBtn} onPress={() => openCityInNativeMaps(currentCityMeta.lat, currentCityMeta.lng, currentCityText.name)}>
                  <Ionicons name="navigate-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.floatingOpenMapsBtnText}>{t.openInAppMaps}</Text>
                </TouchableOpacity>
              </View>
            </View>

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
                  <View style={[styles.attractionCategoryBadge, place.category.includes('🏖') && { backgroundColor: '#0284C7' }]}>
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
                    <TouchableOpacity style={styles.openMapBtn} onPress={() => openUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`)}>
                      <Ionicons name="navigate-outline" size={13} color="#475569" style={{ marginRight: 4 }} />
                      <Text style={styles.openMapBtnText}>{t.openInMapsBtn}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </ScrollView>
        )}

        {/* TAB 3: ATMS / MULTIBANCO */}
        {activeTab === 'atms' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Ionicons name="card" size={24} color="#0F5132" style={{ marginRight: 8 }} />
                <Text style={styles.sectionHeaderTitle}>{t.atmSectionTitle}</Text>
              </View>
              <Text style={styles.subText}>{t.atmSectionSub}</Text>

              <View style={styles.liveMapWrapper}>
                {Platform.OS === 'web' ? (
                  <iframe title="Multibanco ATMs Map" src={atmMapUrl} style={styles.mapIframe} loading="lazy" allowFullScreen />
                ) : (
                  <View style={styles.nativeMapFallback}>
                    <Ionicons name="card-outline" size={40} color="#0F5132" />
                    <Text style={styles.nativeMapText}>Multibanco ATMs</Text>
                  </View>
                )}
                
                <TouchableOpacity style={styles.floatingOpenMapsBtn} onPress={() => openUrl('https://www.google.com/maps/search/?api=1&query=Multibanco+ATM+Portugal')}>
                  <Ionicons name="navigate-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.floatingOpenMapsBtnText}>{t.openInAppMaps}</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.attractionTipBox, { marginTop: 12 }]}>
                <Ionicons name="information-circle" size={18} color="#D97706" style={{ marginRight: 6, marginTop: 1 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.attractionTipText, { fontWeight: 'bold' }]}>{t.atmTipTitle}</Text>
                  <Text style={[styles.attractionTipText, { marginTop: 2 }]}>{t.atmTipDesc}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}

        {/* TAB 4: DOCTORS & EMERGENCIES */}
        {activeTab === 'doctors' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
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
            </View>

            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Ionicons name="medkit" size={24} color="#0F5132" style={{ marginRight: 8 }} />
                <Text style={styles.sectionHeaderTitle}>{t.docSectionTitle}</Text>
              </View>
              <Text style={styles.subText}>{t.docSectionSub}</Text>

              <View style={styles.liveMapWrapper}>
                {Platform.OS === 'web' ? (
                  <iframe title="English Speaking Doctors Map" src={doctorsMapUrl} style={styles.mapIframe} loading="lazy" allowFullScreen />
                ) : (
                  <View style={styles.nativeMapFallback}>
                    <Ionicons name="medkit-outline" size={40} color="#0F5132" />
                    <Text style={styles.nativeMapText}>Kliniken & Ärzte</Text>
                  </View>
                )}
                
                <TouchableOpacity style={styles.floatingOpenMapsBtn} onPress={() => openUrl('https://www.google.com/maps/search/?api=1&query=Hospital+Portugal')}>
                  <Ionicons name="navigate-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.floatingOpenMapsBtnText}>{t.openInAppMaps}</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 12 }}>
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
            </View>
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

        {/* TAB 6: TRANSLATOR */}
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

              <TouchableOpacity style={[styles.primaryBtn, !inputText.trim() && styles.btnDisabled]} onPress={handleTranslate} disabled={loading || !inputText.trim()}>
                {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnText}>{t.btnTrans}</Text>}
              </TouchableOpacity>
            </View>

            {translatedText ? (
              <View style={styles.resultCard}>
                <View style={styles.resultHeaderRow}>
                  <Text style={styles.resultHeader}>{t.resultLabel} ({targetLang.toUpperCase()}):</Text>
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

        {/* TAB 7: CALC */}
        {activeTab === 'calc' && (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>{t.calcTitle}</Text>
              <Text style={styles.subText}>{t.calcSub}</Text>

              <Text style={styles.inputFieldLabel}>{t.calcGrossLabel}</Text>
              <TextInput style={styles.salaryInputField} keyboardType="numeric" value={grossInput} onChangeText={(val) => { setGrossInput(val); calculateNetSalary(val); }} />

              <TouchableOpacity style={styles.primaryBtn} onPress={() => calculateNetSalary(grossInput)}>
                <Text style={styles.btnText}>{t.calcBtn}</Text>
              </TouchableOpacity>
            </View>

            {calcResult && (
              <View style={styles.calcResultCard}>
                <Text style={styles.netLabel}>{t.calcNetMonthly}</Text>
                <Text style={styles.netValue}>{calcResult.netMonthly} €</Text>
                <Text style={styles.netNote}>{t.calc14Notice}</Text>
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
              <Text style={styles.modalTitle}>{t.selectLangTitle}</Text>
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

        {/* MODAL CONGRATS POPUP */}
        <Modal visible={congratsModalVisible} transparent animationType="fade" onRequestClose={() => setCongratsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.congratsModalCard}>
              <View style={styles.congratsIconWrap}>
                <Ionicons name="trophy" size={36} color="#0F5132" />
              </View>
              <Text style={styles.congratsModalTitle}>{t.congratsTitle}</Text>
              <Text style={styles.congratsModalDesc}>{t.congratsDesc}</Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setCongratsModalVisible(false)}>
                <Text style={styles.btnText}>{t.closeBtn}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* MODAL ONBOARDING / SLIDESHOW */}
        <Modal visible={onboardingVisible} transparent animationType="slide" onRequestClose={() => setOnboardingVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.onboardingModalCard}>
              <View style={styles.onboardingHeaderIcon}>
                <Ionicons name="compass" size={40} color="#0F5132" />
              </View>
              <Text style={styles.onboardingTitle}>{onboardingSteps[onboardingStepIndex].title}</Text>
              <Text style={styles.onboardingDesc}>{onboardingSteps[onboardingStepIndex].desc}</Text>

              <View style={styles.paginationDots}>
                {onboardingSteps.map((_, i) => (
                  <View key={i} style={[styles.dot, onboardingStepIndex === i && styles.dotActive]} />
                ))}
              </View>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  if (onboardingStepIndex < onboardingSteps.length - 1) {
                    setOnboardingStepIndex(onboardingStepIndex + 1);
                  } else {
                    setOnboardingVisible(false);
                  }
                }}
              >
                <Text style={styles.btnText}>
                  {onboardingStepIndex < onboardingSteps.length - 1 ? (t.nextBtn || 'Weiter') : (t.startBtn || 'Loslegen')}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* REVOLUT DOMAIN VERIFICATION TOKEN */}
        <Text style={{ fontSize: 1, color: '#F8FAFC', opacity: 0.01, height: 1 }}>795dbaf6-de69-4f37-bae1-7e67ab1f4e47</Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F5132' },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
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
  tabText: { fontSize: 8.5, color: '#64748B', fontWeight: '600' },
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
  btnDisabled: { backgroundColor: '#86EFAC' },
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
  congratsModalCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22, width: '100%', maxWidth: 320, alignItems: 'center', elevation: 5 },
  congratsIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  congratsModalTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', textAlign: 'center', marginBottom: 6 },
  congratsModalDesc: { fontSize: 13, color: '#475569', textAlign: 'center', lineHeight: 18, marginBottom: 16 },

  // Onboarding Slideshow Styles
  onboardingModalCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22, width: '100%', maxWidth: 340, alignItems: 'center', elevation: 6 },
  onboardingHeaderIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  onboardingTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', textAlign: 'center', marginBottom: 8 },
  onboardingDesc: { fontSize: 13.5, color: '#475569', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  paginationDots: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#CBD5E1' },
  dotActive: { width: 22, backgroundColor: '#0F5132' },
});
