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

// UI-Sprachen
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

// EXAKTE GEOGRAFISCHE KOORDINATEN AUF DEM PORTUGAL-VEKTOR
const CITIES_METADATA = {
  porto: {
    mapCoords: { top: '18%', left: '50%' },
    placesMeta: [
      { id: 'p1', img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80', query: 'Dom Luis I Bridge Porto' },
      { id: 'p2', img: 'https://images.unsplash.com/photo-1583275479278-8571871f3ce3?w=800&q=80', query: 'Livraria Lello Porto' },
      { id: 'pb1', img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80', query: 'Praia de Matosinhos' },
    ],
  },
  coimbra: {
    mapCoords: { top: '38%', left: '54%' },
    placesMeta: [
      { id: 'c1', img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', query: 'Biblioteca Joanina Coimbra' },
      { id: 'cb1', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Praia da Claridade Figueira da Foz' },
    ],
  },
  sintra: {
    mapCoords: { top: '56%', left: '40%' },
    placesMeta: [
      { id: 's1', img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&q=80', query: 'Pena Palace Sintra' },
      { id: 'sb1', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80', query: 'Praia do Guincho Cascais' },
    ],
  },
  lisboa: {
    mapCoords: { top: '61%', left: '46%' },
    placesMeta: [
      { id: 'l1', img: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?w=800&q=80', query: 'Torre de Belem Lisbon' },
      { id: 'l2', img: 'https://images.unsplash.com/photo-1513688285115-45a1c5847541?w=800&q=80', query: 'Miradouro de Santa Luzia Lisbon' },
      { id: 'lb1', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Praia de Carcavelos' },
    ],
  },
  algarve: {
    mapCoords: { top: '88%', left: '55%' },
    placesMeta: [
      { id: 'a1', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Benagil Cave Algarve' },
      { id: 'ab1', img: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80', query: 'Praia da Marinha Lagoa' },
      { id: 'ab2', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Praia da Falesia Albufeira' },
    ],
  },
  madeira: {
    mapCoords: { top: '82%', left: '14%' },
    placesMeta: [
      { id: 'm1', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', query: 'Pico do Arieiro Madeira' },
      { id: 'mb2', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Praia da Calheta Madeira' },
    ],
  },
};

const LOCALES = {
  de: {
    title: 'PortuStart',
    sub: 'Dein Relocation-Partner für Portugal',
    tabServices: 'Services',
    tabPlaces: 'Entdecken',
    tabTrans: 'Translator',
    tabCalc: 'Gehalt',
    tabGuide: 'Guide',
    placesSectionTitle: '🇵🇹 Highlights & Traumstrände',
    placesSectionSub: 'Tippe auf eine Stadt auf der Karte Portugals:',
    mapInstruction: '📍 Portugal-Karte (Echte Geographie):',
    swipeInstruction: '👉 Horizontal wischen für Highlights & Strände:',
    openInMapsBtn: 'Route in Maps öffnen',
    from: 'Von:',
    to: 'Nach:',
    inputLabel: 'Eingabe:',
    placeholderTrans: 'Text eingeben oder sprechen...',
    btnTrans: 'Übersetzen',
    listenBtn: 'Anhören',
    listeningNotice: '🎙 Höre zu... Sprich jetzt!',
    resultLabel: 'Ergebnis',
    nameLabel: 'Vollständiger Name:',
    namePlaceholder: 'z. B. Julia Schneider',
    emailLabel: 'E-Mail-Adresse:',
    emailPlaceholder: 'name@example.com',
    docsLabel: 'Erforderliche Dokumente:',
    servicesTitle: '📄 Dokumente & Anträge',
    servicesSub: 'Beantrage deine NIF, NISS oder Bankkonto direkt online',
    checklistTitle: '📋 Erste 30 Tage Roadmap',
    checklistSub: 'Dein bürokratischer Ablaufplan für Portugal',
    checklistDone: 'erledigt',
    selectServices: 'Benötigte Services:',
    serviceLabels: { nif: 'NIF (Steuernummer)', niss: 'NISS (Sozialversicherung)', bank: 'Bankkonto' },
    uploadPass: 'Reisepass / Personalausweis anhängen',
    uploadProof: 'Wohnsitznachweis anhängen',
    submitBtn: 'Dokumente einreichen (portustart@proton.me)',
    fileSelected: 'Bereit: ',
    supportTitle: 'Hilfe & Support',
    supportHelpText: 'Fragen oder Probleme? Unser Support hilft dir gerne:',
    supportBtn: 'Support kontaktieren (portustart.support@proton.me)',
    calcTitle: '💶 Nettogehalt-Rechner',
    calcSub: 'Für Angestellte, Single ohne Kinder (14 Monatsgehälter).',
    calcGrossLabel: 'Monatliches Bruttogehalt (€):',
    calcBtn: 'Berechnen',
    calcNetMonthly: 'Geschätztes Netto (pro Monat):',
    calc14Notice: 'Basis: 14 Auszahlungen (inkl. Urlaubs-/Weihnachtsgeld)',
    calcGrossRow: 'Brutto / Monat:',
    calcSSRow: 'Sozialversicherung (-11%):',
    calcIRSRow: 'IRS Steuerabzug:',
    emergencyTitle: '🚨 Notfall- & Behördenkontakte',
    transitTitle: '🚆 Bus, Bahn & Metro (Ganz Portugal)',
    transitSub: 'Fahrpläne, Netze & Spartickets von Porto bis Faro',
    openLiveTransitBtn: 'Live-Navigation in Google Maps',
    welcomeTitle: 'Bem-vindo zu PortuStart! 🇵🇹',
    welcomeSub: 'Dein Begleiter für das Ankommen in Portugal.',
    guideStepRoadmapTitle: '1. Erste 30 Tage Roadmap',
    guideStepRoadmapDesc: 'Interaktiver Schritt-für-Schritt-Plan durch die Bürokratie.',
    guideStepServicesTitle: '2. Papiere & Anträge',
    guideStepServicesDesc: 'NIF, NISS und Bankkonto direkt online anfordern.',
    guideStepTransitTitle: '3. Landesweiter ÖPNV-Guide',
    guideStepTransitDesc: 'Metro Porto, Metro Lissabon, CP-Züge und Monatskarten.',
    guideStepEmergencyTitle: '4. Notruf & Hotlines',
    guideStepEmergencyDesc: 'Ein-Klick-Direktwahl für Notruf (112) und SNS 24.',
    guideStepSlangTitle: '5. Slang & Audio-Übersetzer',
    guideStepSlangDesc: 'Spracheingabe, Sprachausgabe und Dialektanpassungen.',
    welcomeBtn: 'Alles klar, los geht\'s!',
    celebTitle: 'Parabéns! 🇵🇹🎉',
    celebSub: 'Du hast alle 7 Schritte der Roadmap gemeistert!',
    celebDesc: 'Vom NIF über das Bankkonto bis zur SNS-Gesundheitsnummer: Du hast das Fundament gelegt!',
    celebBtn: 'Muito obrigado! Weiter geht\'s 🚀',
    checklist: [
      { id: 1, title: 'Steuernummer (NIF) beantragen', tip: 'Der Schlüssel für Miete, Handyvertrag, Arbeit und Bankkonto.' },
      { id: 2, title: 'Portugiesische SIM-Karte besorgen', tip: 'Notwendig für die Chave Móvel Digital und Behörden-SMS.' },
      { id: 3, title: 'Bankkonto eröffnen', tip: 'Erforderlich für Gehaltseingang und Wohnungskaution.' },
      { id: 4, title: 'Wohnungsanmietung & Registrierung', tip: 'Der Mietvertrag muss beim Finanzamt (Finanças) gemeldet sein.' },
      { id: 5, title: 'Sozialversicherungsnummer (NISS)', tip: 'Wird für Arbeitsvertrag und Rentenanspruch benötigt.' },
      { id: 6, title: 'Aufenthaltsrecht (CRUE / AIMA)', tip: 'EU-Bürger melden sich nach 3 Monaten bei der Câmara Municipal an.' },
      { id: 7, title: 'SNS-Gesundheitsnummer (Centro de Saúde)', tip: 'Zugang zum staatlichen Hausarztsystem und Kliniken.' },
    ],
    cities: [
      {
        id: 'lisboa',
        name: 'Lisboa (Lissabon)',
        tagline: 'Die Stadt der 7 Hügel, Fado & Tejo-Mündung',
        places: [
          { id: 'l1', title: 'Torre de Belém & Mosteiro dos Jerónimos', category: 'UNESCO Welterbe', desc: 'Meisterwerk des manuelinischen Stils am Tejo. Gleich nebenan gibt es die echten Pastéis de Belém.', tip: 'Tipp: Vor 10:00 Uhr kommen, um die Warteschlangen zu vermeiden.' },
          { id: 'l2', title: 'Miradouro de Santa Luzia & Alfama', category: 'Aussichtspunkt', desc: 'Bougainvillea-Blüten, Azulejos und Panoramablick über die roten Dächer der Alfama.', tip: 'Tipp: Bei Sonnenuntergang den Straßenmusikern mit einer Bica lauschen.' },
          { id: 'lb1', title: 'Praia de Carcavelos (Strand)', category: '🏖 Surf- & Stadtstrand', desc: 'Größter Sandstrand an der Bahnlinie nach Cascais mit Surfschulen und Strandbars.', tip: 'Tipp: Nur 25 Min. mit dem Zug ab Bahnhof Cais do Sodré.' },
        ],
      },
      {
        id: 'porto',
        name: 'Porto & Douro',
        tagline: 'Granit, Portwein und die Brücke Ponte Luís I',
        places: [
          { id: 'p1', title: 'Ponte Luís I & Ribeira', category: 'Wahrzeichen', desc: 'Zweistöckige Eisenbrücke von Gustave Eiffels Partner Seyrig über den Douro.', tip: 'Tipp: Zu Fuß über das obere Deck gehen für beste Sicht auf Vila Nova de Gaia.' },
          { id: 'p2', title: 'Livraria Lello & Clérigos-Turm', category: 'Kultur & Architektur', desc: 'Ikonische Buchhandlung mit weltberühmter roter Holztreppe und neugotischer Schnitzkunst.', tip: 'Tipp: Ticket-Gutschein vorab online reservieren.' },
          { id: 'pb1', title: 'Praia de Matosinhos (Strand)', category: '🏖 Metro-Strand & Surfen', desc: 'Breiter Atlantikstrand direkt an der Metro. Berühmt für Surfer und Fischgrills.', tip: 'Tipp: Nach dem Surfen gegrillten Wolfsbarsch in den Gassen essen.' },
        ],
      },
      {
        id: 'sintra',
        name: 'Sintra & Cascais',
        tagline: 'Märchenschlösser im Nebelwald & Atlantikklippen',
        places: [
          { id: 's1', title: 'Palácio Nacional da Pena', category: 'Märchenschloss', desc: 'Farbenfrohes Romantik-Schloss auf den Bergkämmen über dichten Wäldern.', tip: 'Tipp: Feste Einlasszeiten online buchen, morgens ist es am ruhigsten.' },
          { id: 'sb1', title: 'Praia do Guincho (Strand)', category: '🏖 Wilder Dünenstrand', desc: 'Weltbekannter Surf- & Kitesurf-Strand vor der Kulisse des Sintra-Gebirges.', tip: 'Tipp: Panoramaspaziergang auf Holzstegen über die Dünen.' },
        ],
      },
      {
        id: 'coimbra',
        name: 'Coimbra & Centro',
        tagline: 'Alte Königsstadt & Universitätsgeschichte',
        places: [
          { id: 'c1', title: 'Biblioteca Joanina', category: 'Barockbibliothek', desc: 'Barockes Prunkjuwel aus dem 18. Jahrhundert mit Goldverzierungen und seltenen Büchern.', tip: 'Tipp: Kombiticket mit Königspalast und Kapelle buchen.' },
          { id: 'cb1', title: 'Praia da Claridade (Figueira)', category: '🏖 Riesiger Sandstrand', desc: 'Gigantische Sandfläche mit Holzwegen zum Meer, die "Königin der Strände".', tip: 'Tipp: Nur 40 Min. mit dem Zug von Coimbra direkt ans Wasser.' },
        ],
      },
      {
        id: 'algarve',
        name: 'Faro & Algarve',
        tagline: 'Goldene Sandsteinklippen & 300 Sonnentage',
        places: [
          { id: 'a1', title: 'Benagil Meereshöhle', category: 'Grotten & Strand', desc: 'Die berühmteste Felsengrotte Portugals mit kreisrundem Deckenauge und Sandstrand.', tip: 'Tipp: Früh morgens per Stand-up-Paddleboard anfahren.' },
          { id: 'ab1', title: 'Praia da Marinha (Strand)', category: '🏖 Top-Strand Europas', desc: 'Ikonische Felsformationen mit Doppelbögen und smaragdgrünem Wasser zum Schnorcheln.', tip: 'Tipp: Startpunkt des Wanderwegs "Seven Hanging Valleys".' },
          { id: 'ab2', title: 'Praia da Falésia (Strand)', category: '🏖 Rote Klippenküste', desc: 'Über 6 km feiner Sandstrand unter riesigen roten Steilklippen mit Pinienkronen.', tip: 'Tipp: Herrlich für Barfuß-Spaziergänge bei Ebbe.' },
        ],
      },
      {
        id: 'madeira',
        name: 'Madeira (Funchal)',
        tagline: 'Die Blumeninsel mit schroffen Gipfeln & Levadas',
        places: [
          { id: 'm1', title: 'Pico do Arieiro bis Pico Ruivo', category: 'Hochgebirgswanderung', desc: 'Gratwanderung über den Wolken zwischen den höchsten Bergen Madeiras.', tip: 'Tipp: Zum Sonnenaufgang auf den Gipfel fahren.' },
          { id: 'mb2', title: 'Praia da Calheta (Strand)', category: '🏖 Goldener Sandstrand', desc: 'Geschützte Bucht mit feinem, goldgelbem Sand und zwei Wellenbrechern zum Schwimmen.', tip: 'Tipp: Perfekt für Familien und windgeschütztes Sonnenbaden.' },
        ],
      },
    ],
    phrases: [
      {
        category: 'Wohnungssuche & Miete (Arrendamento)',
        color: '#0284C7',
        items: [
          { trans: 'Ist die Wohnung noch verfügbar?', pt: 'O apartamento ainda está disponível?', ph: 'Oo ah-par-tah-men-too eye-ndah esh-tah deesh-poo-nee-vel?' },
          { trans: 'Wie hoch ist die Kaution / Vorauszahlung?', pt: 'Quanto é a caução e quantos meses adiantados?', ph: 'Kwan-too eh ah kow-sow ee kwan-toosh...?' },
        ],
      },
      {
        category: 'Behörden & Papiere (AIMA / Finanças)',
        color: '#0F5132',
        items: [
          { trans: 'Ich brauche eine Steuernummer (NIF).', pt: 'Preciso de pedir o NIF nas Finanças.', ph: 'Preh-see-zoo deh peh-deer oo neef...' },
        ],
      },
    ],
    emergencies: [
      { name: 'Notruf (Polizei & Krankenwagen)', num: '112', icon: 'flame', color: '#DC2626', desc: 'Zentraler EU-Notruf für akute Notfälle.' },
      { name: 'SNS 24 (Gesundheitshotline)', num: '808242424', icon: 'medkit', color: '#0F5132', desc: 'Medizinische Beratung vor Klinikbesuch.' },
    ],
  },
  en: {
    title: 'PortuStart',
    sub: 'Your Relocation Partner for Portugal',
    tabServices: 'Services',
    tabPlaces: 'Explore',
    tabTrans: 'Translator',
    tabCalc: 'Salary',
    tabGuide: 'Guide',
    placesSectionTitle: '🇵🇹 Sights & Golden Beaches',
    placesSectionSub: 'Tap a city on the map of Portugal:',
    mapInstruction: '📍 Portugal Map (True Geography):',
    swipeInstruction: '👉 Swipe horizontally to discover spots & beaches:',
    openInMapsBtn: 'Open Route in Maps',
    from: 'From:',
    to: 'To:',
    inputLabel: 'Input:',
    placeholderTrans: 'Enter text or speak...',
    btnTrans: 'Translate',
    listenBtn: 'Listen',
    listeningNotice: '🎙 Listening... Speak now!',
    resultLabel: 'Result',
    nameLabel: 'Full Name:',
    namePlaceholder: 'e.g. Julia Schneider',
    emailLabel: 'Email Address:',
    emailPlaceholder: 'name@example.com',
    docsLabel: 'Required Documents:',
    servicesTitle: '📄 Document Services',
    servicesSub: 'Request your NIF, NISS or Bank Account online',
    checklistTitle: '📋 First 30 Days Roadmap',
    checklistSub: 'Your step-by-step relocation checklist',
    checklistDone: 'completed',
    selectServices: 'Required Services:',
    serviceLabels: { nif: 'NIF (Tax Number)', niss: 'NISS (Social Security)', bank: 'Bank Account' },
    uploadPass: 'Attach Passport / ID',
    uploadProof: 'Attach Proof of Address',
    submitBtn: 'Submit Documents (portustart@proton.me)',
    fileSelected: 'Ready: ',
    supportTitle: 'Help & Support',
    supportHelpText: 'Questions or issues? Contact support directly:',
    supportBtn: 'Contact Support (portustart.support@proton.me)',
    calcTitle: '💶 Net Salary Calculator',
    calcSub: 'Single employee, mainland Portugal (14 payments).',
    calcGrossLabel: 'Monthly Gross Salary (€):',
    calcBtn: 'Calculate',
    calcNetMonthly: 'Estimated Net (Monthly):',
    calc14Notice: 'Based on standard 14 payments / year',
    calcGrossRow: 'Monthly Gross:',
    calcSSRow: 'Social Security (-11%):',
    calcIRSRow: 'IRS Withholding:',
    emergencyTitle: '🚨 Emergency & Support Contacts',
    transitTitle: '🚆 Bus, Train & Metro (All Portugal)',
    transitSub: 'Schedules, network maps & passes from Porto to Faro',
    openLiveTransitBtn: 'Live Navigation in Google Maps',
    welcomeTitle: 'Welcome to PortuStart! 🇵🇹',
    welcomeSub: 'Your relaxed companion for settling into life in Portugal.',
    guideStepRoadmapTitle: '1. First 30 Days Roadmap',
    guideStepRoadmapDesc: 'Interactive checklist guiding you through paperwork.',
    guideStepServicesTitle: '2. Document Services',
    guideStepServicesDesc: 'Apply for NIF, NISS & bank accounts right in the app.',
    guideStepTransitTitle: '3. Nationwide Transit Guide',
    guideStepTransitDesc: 'Porto Metro, Lisbon Metro, CP trains and regional bus passes.',
    guideStepEmergencyTitle: '4. Emergency & Support Dial',
    guideStepEmergencyDesc: 'One-tap dialing for Emergency (112) and SNS 24.',
    guideStepSlangTitle: '5. Voice & Slang Translator',
    guideStepSlangDesc: 'Speech-to-text, audio pronunciation and slang detection.',
    welcomeBtn: 'Got it, let\'s start!',
    celebTitle: 'Parabéns! 🇵🇹🎉',
    celebSub: 'You completed all 7 roadmap milestones!',
    celebDesc: 'From your NIF to your SNS healthcare number: you are ready for Portugal!',
    celebBtn: 'Muito obrigado! Let\'s go 🚀',
    checklist: [
      { id: 1, title: 'Get your Tax Number (NIF)', tip: 'The master key for rent, SIM card, employment and utilities.' },
      { id: 2, title: 'Get a local Portuguese SIM card', tip: 'Essential for digital government authentication (Chave Móvel).' },
      { id: 3, title: 'Open a Portuguese Bank Account', tip: 'Required for salary payouts and rental deposits.' },
      { id: 4, title: 'Sign Lease & Register Contract', tip: 'Lease must be registered with Finanças for tax purposes.' },
      { id: 5, title: 'Get Social Security Number (NISS)', tip: 'Mandatory for payroll, pension and healthcare contributions.' },
      { id: 6, title: 'Residency Registration (CRUE / AIMA)', tip: 'EU citizens register at the local City Hall (Câmara) after 3 months.' },
      { id: 7, title: 'Get your SNS Healthcare Number', tip: 'Grants access to public primary care clinics (Centro de Saúde).' },
    ],
    cities: [
      {
        id: 'lisboa',
        name: 'Lisbon',
        tagline: 'City of 7 hills, Fado & Tagus River Estuary',
        places: [
          { id: 'l1', title: 'Belém Tower & Jerónimos Monastery', category: 'UNESCO World Heritage', desc: 'Manueline masterpiece perched along the Tagus River.', tip: 'Tip: Arrive before 10:00 AM to skip queues.' },
          { id: 'l2', title: 'Miradouro de Santa Luzia', category: 'Scenic Overlook', desc: 'Bougainvillea blossoms and terracotta rooftops overlooking the river.', tip: 'Tip: Great sunset listening to live fado.' },
          { id: 'lb1', title: 'Praia de Carcavelos (Beach)', category: '🏖 Surf & City Beach', desc: 'Largest sand beach on the Cascais train line with surf schools.', tip: 'Tip: 25 minutes by train from Cais do Sodré.' },
        ],
      },
      {
        id: 'porto',
        name: 'Porto & Douro',
        tagline: 'Granite architecture, Port wine & Dom Luís I bridge',
        places: [
          { id: 'p1', title: 'Dom Luís I Bridge & Ribeira', category: 'Landmark', desc: 'Iconic double-deck arched bridge designed by Gustave Eiffel’s partner.', tip: 'Tip: Walk the upper deck for Gaia views.' },
          { id: 'p2', title: 'Livraria Lello Bookstore', category: 'Architecture', desc: 'Celebrated bookstore with ornate crimson staircase.', tip: 'Tip: Buy tickets online in advance.' },
          { id: 'pb1', title: 'Praia de Matosinhos (Beach)', category: '🏖 Metro & Surf', desc: 'Vast beach at the blue metro terminus, renowned for seafood grills.', tip: 'Tip: Try the fresh sea bass nearby.' },
        ],
      },
      {
        id: 'sintra',
        name: 'Sintra & Cascais',
        tagline: 'Fairytale palaces in misty cloud forests & ocean cliffs',
        places: [
          { id: 's1', title: 'Pena National Palace', category: 'Romantic Palace', desc: 'Vibrant yellow and red Romanticist castle sitting on high peaks.', tip: 'Tip: Reserve morning entry slots.' },
          { id: 'sb1', title: 'Praia do Guincho (Beach)', category: '🏖 Wild Surf Dunes', desc: 'World-renowned surfing haven framed by coastal dunes.', tip: 'Tip: Walk the elevated boardwalk trail.' },
        ],
      },
      {
        id: 'coimbra',
        name: 'Coimbra & Central',
        tagline: 'Ancient royal capital & one of Europe\'s oldest universities',
        places: [
          { id: 'c1', title: 'Biblioteca Joanina', category: 'Baroque Library', desc: 'Magnificent 18th-century gilded library holding historical manuscripts.', tip: 'Tip: Book combined tickets.' },
          { id: 'cb1', title: 'Praia da Claridade (Figueira)', category: '🏖 Broad Sand Beach', desc: 'Immense expanse of sand equipped with boardwalks.', tip: 'Tip: 40 minutes by train from Coimbra.' },
        ],
      },
      {
        id: 'algarve',
        name: 'Faro & Algarve',
        tagline: 'Golden sandstone sea cliffs & 300 days of sunshine',
        places: [
          { id: 'a1', title: 'Benagil Sea Cave', category: 'Caves & Beaches', desc: 'Europe’s most famous wave-carved cathedral cave.', tip: 'Tip: Paddle early morning by kayak.' },
          { id: 'ab1', title: 'Praia da Marinha (Beach)', category: '🏖 Top European Beach', desc: 'Iconic double sea arches and turquoise snorkeling waters.', tip: 'Tip: Trailhead of Seven Hanging Valleys hike.' },
          { id: 'ab2', title: 'Praia da Falésia (Beach)', category: '🏖 Red Cliff Coast', desc: 'Over 6 km of sand beneath towering red cliffs.', tip: 'Tip: Heavenly for distance strolls.' },
        ],
      },
      {
        id: 'madeira',
        name: 'Madeira (Funchal)',
        tagline: 'The flower island of jagged peaks & lush levadas',
        places: [
          { id: 'm1', title: 'Pico do Arieiro to Pico Ruivo', category: 'Alpine Trail', desc: 'Mountain ridge traverse above the cloud line.', tip: 'Tip: Drive up for sunrise.' },
          { id: 'mb2', title: 'Praia da Calheta (Beach)', category: '🏖 Golden Sand Lagoon', desc: 'Twin golden-sand beach protected by double sea breakwaters.', tip: 'Tip: Sheltered ocean swimming.' },
        ],
      },
    ],
    phrases: [
      {
        category: 'Renting & Apartments (Arrendamento)',
        color: '#0284C7',
        items: [
          { trans: 'Is the apartment still available?', pt: 'O apartamento ainda está disponível?', ph: 'Oo ah-par-tah-men-too...' },
        ],
      },
    ],
    emergencies: [
      { name: 'Emergency (Police & Ambulance)', num: '112', icon: 'flame', color: '#DC2626', desc: 'Central EU emergency dispatch.' },
    ],
  },
};

export default function App() {
  const [appLang, setAppLang] = useState('de');
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);
  const [celebrationModalVisible, setCelebrationModalVisible] = useState(false);
  
  // STANDARD-START TAB: Services
  const [activeTab, setActiveTab] = useState('services');
  const [selectedCityId, setSelectedCityId] = useState('lisboa');

  const t = LOCALES[appLang] || LOCALES['de'];

  // Checkliste
  const [checkedMap, setCheckedMap] = useState({});

  // Translator
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('de');
  const [targetLang, setTargetLang] = useState('pt');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  // Gehaltsrechner
  const [grossInput, setGrossInput] = useState('1500');
  const [calcResult, setCalcResult] = useState(null);

  // Services Formular
  const [selectedServices, setSelectedServices] = useState({ nif: true, niss: false, bank: false });
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [passportFileName, setPassportFileName] = useState('');
  const [proofFileName, setProofFileName] = useState('');

  // Aktive Stadt und Attraktionen
  const currentCityText = t.cities.find((c) => c.id === selectedCityId) || t.cities[0];
  const currentCityMeta = CITIES_METADATA[currentCityText.id] || CITIES_METADATA['lisboa'];

  const dynamicPlaces = currentCityText.places.map((place, index) => {
    const meta = currentCityMeta.placesMeta[index] || currentCityMeta.placesMeta[0];
    return {
      ...place,
      img: meta.img,
      query: meta.query,
    };
  });

  const toggleChecklistItem = (id) => {
    const updated = { ...checkedMap, [id]: !checkedMap[id] };
    setCheckedMap(updated);

    const doneCount = t.checklist.filter((item) => updated[item.id]).length;
    if (doneCount === t.checklist.length) {
      setCelebrationModalVisible(true);
    }
  };

  const completedCount = t.checklist.filter((item) => checkedMap[item.id]).length;

  const dialNumber = (number) => {
    Linking.openURL(`tel:${number}`).catch(() => Alert.alert('Info', `Nummer wählen: ${number}`));
  };

  const openUrl = (url) => {
    Linking.openURL(url).catch(() => Alert.alert('Fehler', 'Link konnte nicht geöffnet werden.'));
  };

  const openPlaceInMaps = (query) => {
    openUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`);
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
    }
  };

  const handleServiceSubmit = () => {
    if (!userName.trim() || !userEmail.trim()) {
      Alert.alert('Hinweis', 'Bitte Name und E-Mail-Adresse angeben.');
      return;
    }

    const servicesList = Object.keys(selectedServices)
      .filter((k) => selectedServices[k])
      .map((s) => s.toUpperCase())
      .join(', ');

    const subject = encodeURIComponent(`Neuer Auftrag: ${servicesList} - ${userName}`);
    const body = encodeURIComponent(
      `Hallo PortuStart Team,\n\nServices: ${servicesList}\nName: ${userName}\nE-Mail: ${userEmail}\n\nDokumente: ${passportFileName || 'Separat'}`
    );

    Linking.openURL(`mailto:portustart@proton.me?subject=${subject}&body=${body}`).catch(() => {
      Alert.alert('E-Mail', 'Bitte schreibe an: portustart@proton.me');
    });
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F5132" />
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerTitle}>{t.title}</Text>
              <Text style={styles.headerSubtitle}>{t.sub}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.guideIconBtn} onPress={() => setWelcomeModalVisible(true)}>
                <Ionicons name="help-circle-outline" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.langSwitchHeaderBtn} onPress={() => setLangModalVisible(true)}>
                <Ionicons name="globe-outline" size={14} color="#fff" style={{ marginRight: 4 }} />
                <Text style={styles.langSwitchHeaderText}>
                  {UI_LANGUAGES.find((l) => l.code === appLang)?.flag} {appLang.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 5-Fach Menüleiste */}
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'services' && styles.tabButtonActive]}
              onPress={() => setActiveTab('services')}
            >
              <Ionicons name="briefcase" size={13} color={activeTab === 'services' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'services' && styles.tabTextActive]}>{t.tabServices}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'places' && styles.tabButtonActive]}
              onPress={() => setActiveTab('places')}
            >
              <Ionicons name="map" size={13} color={activeTab === 'places' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'places' && styles.tabTextActive]}>{t.tabPlaces}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'trans' && styles.tabButtonActive]}
              onPress={() => setActiveTab('trans')}
            >
              <Ionicons name="chatbubbles" size={13} color={activeTab === 'trans' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'trans' && styles.tabTextActive]}>{t.tabTrans}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'calc' && styles.tabButtonActive]}
              onPress={() => {
                setActiveTab('calc');
                if (!calcResult) calculateNetSalary(grossInput);
              }}
            >
              <Ionicons name="calculator" size={13} color={activeTab === 'calc' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'calc' && styles.tabTextActive]}>{t.tabCalc}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'guide' && styles.tabButtonActive]}
              onPress={() => setActiveTab('guide')}
            >
              <Ionicons name="compass" size={13} color={activeTab === 'guide' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'guide' && styles.tabTextActive]}>{t.tabGuide}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TAB 1: SERVICES & 30-TAGE ROADMAP */}
        {activeTab === 'services' && (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <View style={styles.checklistHeaderRow}>
                <View>
                  <Text style={styles.sectionHeaderTitle}>{t.checklistTitle}</Text>
                  <Text style={styles.subText}>{t.checklistSub}</Text>
                </View>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>
                    {completedCount} / {t.checklist.length} {t.checklistDone}
                  </Text>
                </View>
              </View>

              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${(completedCount / t.checklist.length) * 100}%` }]} />
              </View>

              {t.checklist.map((item) => {
                const isDone = !!checkedMap[item.id];
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.checklistItem, isDone && styles.checklistItemDone]}
                    onPress={() => toggleChecklistItem(item.id)}
                  >
                    <Ionicons
                      name={isDone ? 'checkmark-circle' : 'ellipse-outline'}
                      size={20}
                      color={isDone ? '#0F5132' : '#94A3B8'}
                      style={{ marginRight: 10, marginTop: 2 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.checklistText, isDone && styles.checklistTextDone]}>
                        {item.title}
                      </Text>
                      <Text style={styles.checklistTip}>{item.tip}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>{t.servicesTitle}</Text>
              <Text style={styles.subText}>{t.servicesSub}</Text>

              <Text style={styles.inputFieldLabel}>{t.selectServices}</Text>
              <View style={styles.serviceSelectorRow}>
                {[
                  { key: 'nif', label: t.serviceLabels.nif },
                  { key: 'niss', label: t.serviceLabels.niss },
                  { key: 'bank', label: t.serviceLabels.bank },
                ].map((s) => (
                  <TouchableOpacity
                    key={s.key}
                    style={[styles.serviceCheckChip, selectedServices[s.key] && styles.serviceCheckChipActive]}
                    onPress={() => setSelectedServices({ ...selectedServices, [s.key]: !selectedServices[s.key] })}
                  >
                    <Ionicons
                      name={selectedServices[s.key] ? 'checkbox' : 'square-outline'}
                      size={17}
                      color={selectedServices[s.key] ? '#0F5132' : '#64748B'}
                    />
                    <Text style={styles.serviceChipText}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputFieldLabel}>{t.nameLabel}</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder={t.namePlaceholder}
                placeholderTextColor="#94A3B8"
                value={userName}
                onChangeText={setUserName}
              />

              <Text style={styles.inputFieldLabel}>{t.emailLabel}</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder={t.emailPlaceholder}
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                value={userEmail}
                onChangeText={setUserEmail}
              />

              <TouchableOpacity style={styles.primaryBtn} onPress={handleServiceSubmit}>
                <Ionicons name="paper-plane" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.btnText}>{t.submitBtn}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* TAB 2: PLACES / ECHTE GEOGRAFISCHE PORTUGAL-KARTE */}
        {activeTab === 'places' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>{t.placesSectionTitle}</Text>
              <Text style={styles.subText}>{t.placesSectionSub}</Text>
              <Text style={styles.miniLabel}>{t.mapInstruction}</Text>

              {/* MASSSTABSGETREUE PORTUGAL-LANDKARTE (VEKTOR) */}
              <View style={styles.portugalMapBox}>
                {/* Meereshintergrund */}
                <View style={styles.oceanWaterMark}>
                  <Text style={styles.oceanWaterMarkText}>ATLÂNTICO</Text>
                </View>

                {/* Kontur Festland Portugal */}
                <View style={styles.portugalMainlandShape}>
                  {/* Region Norte */}
                  <View style={styles.geoNorte} />
                  {/* Region Centro */}
                  <View style={styles.geoCentro} />
                  {/* Region Tejo & Lisboa */}
                  <View style={styles.geoLisboa} />
                  {/* Region Alentejo */}
                  <View style={styles.geoAlentejo} />
                  {/* Region Algarve */}
                  <View style={styles.geoAlgarve} />
                </View>

                {/* Madeira Insel-Box */}
                <View style={styles.madeiraIslandBox}>
                  <Text style={styles.madeiraBoxTitle}>MADEIRA</Text>
                  <View style={styles.madeiraIslandShape} />
                </View>

                {/* Interaktive Pins auf den echten geographischen Punkten */}
                {t.cities.map((city) => {
                  const isSelected = selectedCityId === city.id;
                  const meta = CITIES_METADATA[city.id] || CITIES_METADATA['lisboa'];
                  return (
                    <TouchableOpacity
                      key={city.id}
                      style={[
                        styles.mapPinContainer,
                        { top: meta.mapCoords.top, left: meta.mapCoords.left },
                        isSelected && styles.mapPinContainerActive,
                      ]}
                      onPress={() => setSelectedCityId(city.id)}
                    >
                      <View style={[styles.mapPinDot, isSelected && styles.mapPinDotActive]}>
                        <Ionicons
                          name="location"
                          size={isSelected ? 16 : 12}
                          color={isSelected ? '#DC2626' : '#0F5132'}
                        />
                      </View>
                      <View style={[styles.mapPinLabelBadge, isSelected && styles.mapPinLabelBadgeActive]}>
                        <Text style={[styles.mapPinLabelText, isSelected && styles.mapPinLabelTextActive]}>
                          {city.name.split(' ')[0]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Filter-Leiste */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cityFilterScroll}>
                {t.cities.map((city) => {
                  const isSelected = selectedCityId === city.id;
                  return (
                    <TouchableOpacity
                      key={city.id}
                      style={[styles.cityChip, isSelected && styles.cityChipActive]}
                      onPress={() => setSelectedCityId(city.id)}
                    >
                      <Ionicons
                        name="business-outline"
                        size={13}
                        color={isSelected ? '#0F5132' : '#64748B'}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={[styles.cityChipText, isSelected && styles.cityChipTextActive]}>
                        {city.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Aktive Region Header */}
            <View style={styles.cityDetailsHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.activeCityName}>{currentCityText.name}</Text>
                <Text style={styles.activeCityTagline}>{currentCityText.tagline}</Text>
              </View>
              <View style={styles.cityPlacesCounter}>
                <Text style={styles.cityPlacesCounterText}>{dynamicPlaces.length} Orte & Strände</Text>
              </View>
            </View>

            <Text style={[styles.miniLabel, { marginHorizontal: 4, marginBottom: 8 }]}>
              {t.swipeInstruction}
            </Text>

            {/* Horizontales Swipe-Karussell */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToAlignment="start"
              decelerationRate="fast"
              contentContainerStyle={styles.attractionsSwipeScroll}
            >
              {dynamicPlaces.map((place) => (
                <View key={place.id} style={styles.attractionCard}>
                  <Image source={{ uri: place.img }} style={styles.attractionImage} />
                  
                  <View style={[
                    styles.attractionCategoryBadge,
                    place.category.includes('🏖') && { backgroundColor: '#0284C7' },
                  ]}>
                    <Text style={styles.attractionCategoryText}>{place.category}</Text>
                  </View>

                  <View style={styles.attractionBody}>
                    <Text style={styles.attractionTitle}>{place.title}</Text>
                    <Text style={styles.attractionDesc}>{place.desc}</Text>

                    <View style={styles.attractionTipBox}>
                      <Ionicons name="sparkles" size={13} color="#D97706" style={{ marginRight: 4, marginTop: 1 }} />
                      <Text style={styles.attractionTipText}>{place.tip}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.openMapBtn}
                      onPress={() => openPlaceInMaps(place.query)}
                    >
                      <Ionicons name="navigate-outline" size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                      <Text style={styles.openMapBtnText}>{t.openInMapsBtn}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </ScrollView>
        )}

        {/* TAB 3: TRANSLATOR */}
        {activeTab === 'trans' && (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Text style={styles.miniLabel}>{t.from}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langScroll}>
                {TRANSLATOR_LANGUAGES.map((l) => (
                  <TouchableOpacity
                    key={`src-${l.code}`}
                    onPress={() => setSourceLang(l.code)}
                    style={[styles.langChip, sourceLang === l.code && styles.langChipSelected]}
                  >
                    <Text style={[styles.langChipText, sourceLang === l.code && styles.langChipTextSelected]}>
                      {l.flag} {l.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.miniLabel, { marginTop: 10 }]}>{t.to}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langScroll}>
                {TRANSLATOR_LANGUAGES.map((l) => (
                  <TouchableOpacity
                    key={`tgt-${l.code}`}
                    onPress={() => setTargetLang(l.code)}
                    style={[styles.langChip, targetLang === l.code && styles.langChipSelected]}
                  >
                    <Text style={[styles.langChipText, targetLang === l.code && styles.langChipTextSelected]}>
                      {l.flag} {l.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TextInput
                style={[styles.textInput, { marginTop: 10 }]}
                placeholder={t.placeholderTrans}
                placeholderTextColor="#94A3B8"
                value={inputText}
                onChangeText={setInputText}
                multiline
              />

              <TouchableOpacity
                style={[styles.primaryBtn, !inputText.trim() && styles.btnDisabled]}
                onPress={handleTranslate}
                disabled={loading || !inputText.trim()}
              >
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
          </ScrollView>
        )}

        {/* TAB 4: GEHALTSRECHNER */}
        {activeTab === 'calc' && (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>{t.calcTitle}</Text>
              <Text style={styles.subText}>{t.calcSub}</Text>

              <Text style={styles.inputFieldLabel}>{t.calcGrossLabel}</Text>
              <TextInput
                style={styles.salaryInputField}
                keyboardType="numeric"
                value={grossInput}
                onChangeText={(val) => {
                  setGrossInput(val);
                  calculateNetSalary(val);
                }}
              />

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

        {/* TAB 5: GUIDE */}
        {activeTab === 'guide' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>{t.transitTitle}</Text>
              <Text style={styles.subText}>{t.transitSub}</Text>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: '#0284C7', marginTop: 6 }]}
                onPress={() => openUrl('https://www.google.com/maps/dir/?api=1&travelmode=transit')}
              >
                <Ionicons name="navigate-circle" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.btnText}>{t.openLiveTransitBtn}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.guideSection}>
              <Text style={styles.sectionTitle}>{t.emergencyTitle}</Text>
              {t.emergencies.map((item, idx) => (
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
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  headerSubtitle: { color: '#BBF7D0', fontSize: 11, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  guideIconBtn: { backgroundColor: 'rgba(255,255,255,0.18)', padding: 6, borderRadius: 12 },
  langSwitchHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  langSwitchHeaderText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  tabBarContainer: { paddingHorizontal: 8, marginTop: -16, marginBottom: 8, zIndex: 10 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 3,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    gap: 2,
  },
  tabButtonActive: { backgroundColor: '#0F5132' },
  tabText: { fontSize: 10, color: '#64748B', fontWeight: '600' },
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

  // ECHTE PORTUGAL KARTENKONTUR STYLES
  portugalMapBox: {
    height: 270,
    width: '100%',
    backgroundColor: '#DFF0FA', // Atlantikblau
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  oceanWaterMark: {
    position: 'absolute',
    top: 10,
    left: 10,
    opacity: 0.4,
  },
  oceanWaterMarkText: { fontSize: 13, fontWeight: '900', color: '#0284C7', letterSpacing: 2 },
  
  // Festland Silhouette
  portugalMainlandShape: {
    position: 'absolute',
    top: 20,
    right: 35,
    width: 135,
    height: 230,
  },
  geoNorte: {
    width: 100,
    height: 55,
    backgroundColor: '#D1E7DD',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 18,
    marginLeft: 15,
    borderWidth: 1,
    borderColor: '#A3CFBB',
  },
  geoCentro: {
    width: 115,
    height: 60,
    backgroundColor: '#DCFCE7',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 20,
    borderWidth: 1,
    borderColor: '#A3CFBB',
    marginTop: -5,
  },
  geoLisboa: {
    width: 90,
    height: 35,
    backgroundColor: '#FEF3C7',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 15,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: -4,
  },
  geoAlentejo: {
    width: 115,
    height: 55,
    backgroundColor: '#FEF08A',
    borderBottomLeftRadius: 20,
    borderWidth: 1,
    borderColor: '#FDE047',
    marginTop: -3,
    marginLeft: 5,
  },
  geoAlgarve: {
    width: 125,
    height: 28,
    backgroundColor: '#FED7AA',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 18,
    borderWidth: 1,
    borderColor: '#FDBA74',
    marginTop: -2,
  },

  // Madeira Box
  madeiraIslandBox: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 6,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  madeiraBoxTitle: { fontSize: 8.5, fontWeight: '800', color: '#475569', marginBottom: 2 },
  madeiraIslandShape: { width: 34, height: 14, backgroundColor: '#86EFAC', borderRadius: 7 },

  mapPinContainer: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    zIndex: 10,
  },
  mapPinContainerActive: { zIndex: 30 },
  mapPinDot: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 1.5,
    borderColor: '#0F5132',
  },
  mapPinDotActive: {
    borderColor: '#DC2626',
    backgroundColor: '#FEE2E2',
    transform: [{ scale: 1.25 }],
  },
  mapPinLabelBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  mapPinLabelBadgeActive: { backgroundColor: '#0F5132' },
  mapPinLabelText: { fontSize: 9.5, color: '#FFFFFF', fontWeight: 'bold' },
  mapPinLabelTextActive: { color: '#BBF7D0' },

  cityFilterScroll: { paddingVertical: 4, gap: 6 },
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
  openMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F5132',
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  openMapBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

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
  fieldInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
    minHeight: 44,
  },
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
  serviceSelectorRow: { flexDirection: 'column', gap: 6, marginBottom: 4 },
  serviceCheckChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#F1F5F9', gap: 8 },
  serviceCheckChipActive: { backgroundColor: '#DCFCE7', borderColor: '#0F5132', borderWidth: 1 },
  serviceChipText: { fontSize: 12, fontWeight: '600', color: '#1E293B' },
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
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
  guideSection: { marginBottom: 14 },
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
