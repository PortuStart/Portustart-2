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
// DEIN OPENAI API-KEY & PARTNER-LINKS
// ==========================================
const OPENAI_API_KEY = 'vck_5LPthEy2whGmjOe0cmJ8xqAjlKDmuKVRdCeTS73N7vVTFcFgpt47DlNd';

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
  { code: 'pt', label: 'PT', flag: '🇵🇹', voice: 'pt-PT' },
  { code: 'de', label: 'DE', flag: '🇩🇪', voice: 'de-DE' },
  { code: 'en', label: 'EN', flag: '🇬🇧', voice: 'en-US' },
  { code: 'es', label: 'ES', flag: '🇪🇸', voice: 'es-ES' },
  { code: 'fr', label: 'FR', flag: '🇫🇷', voice: 'fr-FR' },
  { code: 'it', label: 'IT', flag: '🇮🇹', voice: 'it-IT' },
  { code: 'hi', label: 'HIN', flag: '🇮🇳', voice: 'hi-IN' },
];

// ECHTE BILD-METADATEN DER SEHENSWÜRDIGKEITEN & STRÄNDE
const CITIES_METADATA = {
  lisboa: {
    lat: 38.7223,
    lng: -9.1393,
    zoom: 12,
    placesMeta: [
      { id: 'l1', img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80', query: 'Torre de Belem Lisbon', gygQuery: 'Belem Tower Lisbon' }, // Torre de Belém
      { id: 'l2', img: 'https://images.unsplash.com/photo-1565217245037-3bf791837c76?w=800&q=80', query: 'Miradouro de Santa Luzia Lisbon', gygQuery: 'Alfama Lisbon Fado' }, // Alfama / Santa Luzia
      { id: 'l3', img: 'https://images.unsplash.com/photo-1513688285115-45a1c5847541?w=800&q=80', query: 'Praca do Comercio Lisbon', gygQuery: 'Tagus River cruise Lisbon' }, // Praça do Comércio
      { id: 'lb1', img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80', query: 'Praia de Carcavelos', gygQuery: 'Carcavelos surf lesson' }, // Praia de Carcavelos
      { id: 'lb2', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Praia dos Galapinhos Arrabida', gygQuery: 'Arrabida natural park tour' }, // Galapinhos / Arrábida
    ],
  },
  porto: {
    lat: 41.1579,
    lng: -8.6291,
    zoom: 12,
    placesMeta: [
      { id: 'p1', img: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&q=80', query: 'Dom Luis I Bridge Porto', gygQuery: 'Douro river cruise Porto' }, // Dom Luís I Brücke
      { id: 'p2', img: 'https://images.unsplash.com/photo-1583275479278-8571871f3ce3?w=800&q=80', query: 'Livraria Lello Porto', gygQuery: 'Livraria Lello Porto ticket' }, // Livraria Lello
      { id: 'p3', img: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80', query: 'Port Wine Cellars Gaia Porto', gygQuery: 'Port wine tasting Porto Gaia' }, // Portweinkeller Gaia
      { id: 'pb1', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80', query: 'Praia de Matosinhos', gygQuery: 'Matosinhos surf lesson' }, // Praia de Matosinhos
      { id: 'pb2', img: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80', query: 'Praia de Miramar Senhor da Pedra', gygQuery: 'Porto coastal tour' }, // Senhor da Pedra / Miramar
    ],
  },
  sintra: {
    lat: 38.8029,
    lng: -9.3817,
    zoom: 12,
    placesMeta: [
      { id: 's1', img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&q=80', query: 'Pena Palace Sintra', gygQuery: 'Pena Palace Sintra ticket' }, // Pena Palast
      { id: 's2', img: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=800&q=80', query: 'Quinta da Regaleira Sintra', gygQuery: 'Quinta da Regaleira guided tour' }, // Quinta da Regaleira
      { id: 's3', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', query: 'Cabo da Roca Portugal', gygQuery: 'Cabo da Roca Cascais day trip' }, // Cabo da Roca
      { id: 'sb1', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80', query: 'Praia do Guincho Cascais', gygQuery: 'Guincho surf lesson' }, // Praia do Guincho
      { id: 'sb2', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', query: 'Praia da Ursa Sintra', gygQuery: 'Sintra coastal hike' }, // Praia da Ursa
    ],
  },
  algarve: {
    lat: 37.0194,
    lng: -7.9322,
    zoom: 10,
    placesMeta: [
      { id: 'a1', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Benagil Cave Algarve', gygQuery: 'Benagil cave boat tour' }, // Benagil Höhle
      { id: 'a2', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80', query: 'Ponta da Piedade Lagos', gygQuery: 'Ponta da Piedade boat tour Lagos' }, // Ponta da Piedade
      { id: 'a3', img: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80', query: 'Ria Formosa Natural Park Faro', gygQuery: 'Ria Formosa boat tour Faro' }, // Ria Formosa
      { id: 'ab1', img: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80', query: 'Praia da Marinha Lagoa', gygQuery: 'Seven Hanging Valleys hike Algarve' }, // Praia da Marinha
      { id: 'ab2', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Praia da Falesia Albufeira', gygQuery: 'Albufeira boat tour' }, // Praia da Falésia
    ],
  },
  coimbra: {
    lat: 40.2033,
    lng: -8.4103,
    zoom: 12,
    placesMeta: [
      { id: 'c1', img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', query: 'Biblioteca Joanina Coimbra', gygQuery: 'University of Coimbra Joanina library ticket' }, // Biblioteca Joanina
      { id: 'c2', img: 'https://images.unsplash.com/photo-1513688285115-45a1c5847541?w=800&q=80', query: 'Monastery of Santa Cruz Coimbra', gygQuery: 'Coimbra walking tour' }, // Coimbra Altstadt
      { id: 'cb1', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Praia da Claridade Figueira da Foz', gygQuery: 'Figueira da Foz' }, // Figueira da Foz
      { id: 'cb2', img: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=800&q=80', query: 'Praia de Mira Portugal', gygQuery: 'Aveiro lagoon day trip' }, // Praia de Mira
    ],
  },
  madeira: {
    lat: 32.6500,
    lng: -16.9089,
    zoom: 11,
    placesMeta: [
      { id: 'm1', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', query: 'Pico do Arieiro Madeira', gygQuery: 'Pico do Arieiro to Pico Ruivo transfer' }, // Pico do Arieiro
      { id: 'm2', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80', query: '25 Fontes Levada Madeira', gygQuery: 'Rabaçal 25 Fontes levada walk' }, // Levada / Madeira Natur
      { id: 'mb1', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', query: 'Prainha do Canical Madeira', gygQuery: 'Ponta de Sao Lourenco boat tour' }, // Prainha Caniçal
      { id: 'mb2', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', query: 'Praia da Calheta Madeira', gygQuery: 'Madeira whale watching Calheta' }, // Calheta Strand
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
    tabPlaces: 'Entdecken',
    tabAtms: 'ATMs',
    tabDoctors: 'Ärzte',
    tabPerks: 'Deals',
    tabTrans: 'KI-Assistent',
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

    from: 'Von:',
    to: 'Nach:',
    inputLabel: 'Eingabe:',
    placeholderTrans: 'Frage an die KI stellen oder Text übersetzen...',
    btnTrans: 'KI-Antwort / Übersetzung anfordern',
    listenBtn: 'Anhören (TTS)',
    speakBtn: 'Sprechen (STT)',
    resultLabel: 'KI-Ergebnis',
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
    calcTitle: '💶 KI-Nettogehalt-Rechner',
    calcSub: 'Präzise Berechnung inklusive neuester IRS-Steuertabellen über OpenAI.',
    calcGrossLabel: 'Monatliches Bruttogehalt (€):',
    calcBtn: 'Mit KI berechnen',
    calcNetMonthly: 'Geschätztes Netto (pro Monat):',
    calc14Notice: 'Basis: 14 Auszahlungen (inkl. Urlaubs-/Weihnachtsgeld)',
    calcGrossRow: 'Brutto / Monat:',
    calcSSRow: 'Sozialversicherung (-11%):',
    calcIRSRow: 'IRS Steuerabzug:',
    faqTitle: '🤖 PortuStart KI-FAQ & Expertenrat',
    faqSub: 'Stelle der KI eine Frage zu Portugal (z.B. NIF, Wohnung, Steuern):',
    faqPlaceholder: 'z.B. Wie bekomme ich ohne Mietvertrag eine NIF?',
    faqBtn: 'KI-Frage senden',
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
    tabServices: 'Services',
    tabPlaces: 'Explore',
    tabAtms: 'ATMs',
    tabDoctors: 'Doctors',
    tabPerks: 'Deals',
    tabTrans: 'AI Assistant',
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

    from: 'From:',
    to: 'To:',
    inputLabel: 'Input:',
    placeholderTrans: 'Ask the AI a question or translate text...',
    btnTrans: 'Request AI Answer / Translation',
    listenBtn: 'Listen (TTS)',
    speakBtn: 'Speech-to-Text (STT)',
    resultLabel: 'AI Result',
    servicesTitle: '📄 Official Relocation Services',
    servicesSub: 'Order essential documents & coverage 100% online through our partner e-Residence:',
    checklistTitle: '📋 First 30 Days Roadmap',
    checklistSub: 'Your step-by-step relocation checklist',
    checklistDone: 'completed',
    applyOnlineBtn: 'Apply online now ↗',
    affiliateDisclosure: 'Transparency notice: These links route to certified express processing with e-Residence. We receive a small referral commission at no additional cost to you.',
    calcTitle: '💶 AI Net Salary Calculator',
    calcSub: 'Precise calculation based on latest IRS tax tables via OpenAI.',
    calcGrossLabel: 'Monthly Gross Salary (€):',
    calcBtn: 'Calculate with AI',
    calcNetMonthly: 'Estimated Net (Monthly):',
    calc14Notice: 'Based on standard 14 payments / year',
    calcGrossRow: 'Monthly Gross:',
    calcSSRow: 'Social Security (-11%):',
    calcIRSRow: 'IRS Withholding:',
    faqTitle: '🤖 PortuStart AI-FAQ & Expert Advice',
    faqSub: 'Ask the AI any question about Portugal (e.g. NIF, housing, taxes):',
    faqPlaceholder: 'e.g. How to get a NIF without a rental contract?',
    faqBtn: 'Send AI Question',
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
    tabServices: 'Servicios',
    tabPlaces: 'Explorar',
    tabAtms: 'Cajeros',
    tabDoctors: 'Médicos',
    tabPerks: 'Ofertas',
    tabTrans: 'Asistente IA',
    tabCalc: 'Salario',
    placesSectionTitle: '🇵🇹 Mapa Interactivo y Lugares',
    placesSectionSub: 'Mapa en vivo de Portugal – elige una región o reserva tours:',
    openInAppMaps: 'Abrir en Maps',
    swipeInstruction: '👉 Desliza horizontalmente para ver lugares, playas y tours:',
    openInMapsBtn: 'Ruta',
    gygBtn: 'Entradas y Tours (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Aprende a hablar portugués con fluidez',
    italkiBannerDesc: 'Encuentra profesores nativos certificados para clases particulares en italki.',
    italkiBtn: 'Buscar profesores nativos (italki) ↗',
    
    atmSectionTitle: '🏧 Cajeros sin comisiones (Multibanco)',
    atmSectionSub: 'Utiliza la red oficial Multibanco en sucursales bancarias para retirar efectivo con Revolut o Wise sin recargos:',
    atmTipTitle: '💡 Consejo importante:',
    atmTipDesc: 'Elige siempre que te cobren en Euros (€) si el cajero ofrece conversión a tu moneda local.',

    docSectionTitle: '🩺 Médicos de habla inglesa y emergencias',
    docSectionSub: 'Números de emergencia esenciales y centros médicos privados con atención internacional:',
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
    placeholderTrans: 'Haz una pregunta a la IA o traduce texto...',
    btnTrans: 'Solicitar respuesta IA / traducción',
    listenBtn: 'Escuchar (TTS)',
    speakBtn: 'Voz a texto (STT)',
    resultLabel: 'Resultado IA',
    servicesTitle: '📄 Servicios y trámites oficiales',
    servicesSub: 'Solicita documentos esenciales 100% online a través de nuestro socio e-Residence:',
    checklistTitle: '📋 Hoja de ruta primeros 30 días',
    checklistSub: 'Tu plan de reubicación paso a paso',
    checklistDone: 'completado',
    applyOnlineBtn: 'Solicitar online ahora ↗',
    affiliateDisclosure: 'Transparencia: Estos enlaces dirigen a un procesamiento exprés certificado con e-Residence. Recibimos una pequeña comisión sin coste adicional para ti.',
    calcTitle: '💶 Calculadora de salario neto IA',
    calcSub: 'Cálculo preciso basado en las últimas tablas de impuestos IRS mediante OpenAI.',
    calcGrossLabel: 'Salario bruto mensual (€):',
    calcBtn: 'Calcular con IA',
    calcNetMonthly: 'Neto estimado (mensual):',
    calc14Notice: 'Basado en 14 pagas anuales',
    calcGrossRow: 'Bruto mensual:',
    calcSSRow: 'Seguridad Social (-11%):',
    calcIRSRow: 'Retención IRS:',
    faqTitle: '🤖 Preguntas frecuentes (FAQ) y Asesoría IA PortuStart',
    faqSub: 'Haz una pregunta a la IA sobre Portugal (NIF, vivienda, impuestos):',
    faqPlaceholder: 'ej. ¿Cómo obtener el NIF sin contrato de alquiler?',
    faqBtn: 'Enviar pregunta a la IA',
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
        name: 'Lisboa',
        tagline: 'La ciudad de las 7 colinas, Fado y miradores',
        places: [
          { id: 'l1', title: 'Torre de Belém y Monasterio de los Jerónimos', category: 'Patrimonio de la Humanidad', desc: 'Obra maestra manuelina junto al río Tajo.', tip: 'Consejo: Llegar antes de las 10:00.' },
          { id: 'l2', title: 'Mirador de Santa Luzia y Alfama', category: 'Mirador', desc: 'Flores de buganvilla con vistas a tejados de terracota.', tip: 'Consejo: Visitar al atardecer.' },
          { id: 'l3', title: 'Praça do Comércio', category: 'Plaza histórica', desc: 'Gran plaza abierta frente al río Tajo.', tip: 'Consejo: Ideal para pasear.' },
          { id: 'lb1', title: 'Playa de Carcavelos', category: '🏖 Playa urbana y surf', desc: 'La mayor playa en la línea de tren a Cascais.', tip: 'Consejo: 25 min en tren.' },
          { id: 'lb2', title: 'Playa de Galapinhos', category: '🏖 Naturaleza en Arrábida', desc: 'Aguas cristalinas bajo los acantilados de Arrábida.', tip: 'Consejo: Llegar temprano en verano.' },
        ],
      },
      {
        id: 'porto',
        name: 'Oporto',
        tagline: 'Arquitectura de granito, vino de Oporto y puentes',
        places: [
          { id: 'p1', title: 'Puente Don Luis I y Ribeira', category: 'Monumento', desc: 'Icónico puente de hierro de doble piso sobre el Duero.', tip: 'Consejo: Cruza por la planta superior.' },
          { id: 'p2', title: 'Librería Lello y Torre de los Clérigos', category: 'Cultura', desc: 'Famosa librería neogótica con escalera roja.', tip: 'Consejo: Reserva entradas online.' },
          { id: 'p3', title: 'Bodegas de Oporto en Gaia', category: 'Tradición', desc: 'Históricas bodegas de envejecimiento junto al río.', tip: 'Consejo: Reserva una cata guiada.' },
          { id: 'pb1', title: 'Playa de Matosinhos', category: '🏖 Playa de metro', desc: 'Amplia playa famosa por su marisco fresco.', tip: 'Consejo: Prueba la lubina a la parrilla.' },
          { id: 'pb2', title: 'Playa de Miramar', category: '🏖 Capilla en el mar', desc: 'Capilla del siglo XVII sobre rocas marinas.', tip: 'Consejo: Excelente para fotos al atardecer.' },
        ],
      },
      {
        id: 'sintra',
        name: 'Sintra y Cascais',
        tagline: 'Palacios de cuento y acantilados atlánticos',
        places: [
          { id: 's1', title: 'Palacio Nacional da Pena', category: 'Palacio romántico', desc: 'Castillo colorido en las cumbres de Sintra.', tip: 'Consejo: Reserva turnos de mañana.' },
          { id: 's2', title: 'Quinta da Regaleira', category: 'Finca mística', desc: 'Parque encantado con grutas y pozo iniciático.', tip: 'Consejo: Lleva linterna.' },
          { id: 's3', title: 'Cabo da Roca', category: 'Maravilla natural', desc: 'El punto más occidental de Europa continental.', tip: 'Consejo: Lleva cortavientos.' },
          { id: 'sb1', title: 'Playa de Guincho', category: '🏖 Surf y dunas', desc: 'Paraíso del surf rodeado de dunas.', tip: 'Consejo: Usa las pasarelas de madera.' },
          { id: 'sb2', title: 'Playa da Ursa', category: '🏖 Cala secreta', desc: 'Playa salvaje rodeada de gigantescos roques.', tip: 'Consejo: Usa calzado de senderismo.' },
        ],
      },
      {
        id: 'algarve',
        name: 'Faro y Algarve',
        tagline: 'Acantilados dorados y 300 días de sol',
        places: [
          { id: 'a1', title: 'Cueva de Benagil', category: 'Cuevas y playas', desc: 'Famosa cueva marina con claraboya natural.', tip: 'Consejo: Alquila un kayak temprano.' },
          { id: 'a2', title: 'Ponta da Piedade (Lagos)', category: 'Costa de acantilados', desc: 'Arcos de piedra caliza y aguas turquesas.', tip: 'Consejo: Haz un tour en barquita.' },
          { id: 'a3', title: 'Parque Natural Ría Formosa', category: 'Laguna e islas', desc: 'Humedal protegido con islas sin coches.', tip: 'Consejo: Toma el ferry a Armona.' },
          { id: 'ab1', title: 'Playa de Marinha', category: '🏖 Top playa europea', desc: 'Arcos dobles de piedra y aguas cristalinas.', tip: 'Consejo: Sendero de los Valles Colgantes.' },
          { id: 'ab2', title: 'Playa de la Falésia', category: '🏖 Acantilados rojos', desc: 'Más de 6 km de arena bajo acantilados rojizos.', tip: 'Consejo: Paseos con marea baja.' },
        ],
      },
      {
        id: 'coimbra',
        name: 'Coímbra y Centro',
        tagline: 'Antigua capital real e historia universitaria',
        places: [
          { id: 'c1', title: 'Biblioteca Joanina', category: 'Biblioteca barroca', desc: 'Joya barroca con manuscritos históricos.', tip: 'Consejo: Reserva entradas combinadas.' },
          { id: 'c2', title: 'Monasterio de Santa Cruz', category: 'Historia y Fado', desc: 'Lugar de descanso de los primeros reyes.', tip: 'Consejo: Asiste a un concierto de fado.' },
          { id: 'cb1', title: 'Playa de la Claridade (Figueira)', category: '🏖 Playa amplia', desc: 'Inmensa superficie de arena con pasarelas.', tip: 'Consejo: 40 min en tren.' },
          { id: 'cb2', title: 'Playa de Mira', category: '🏖 Pesca tradicional', desc: 'Pintoresca playa con casas de madera rayadas.', tip: 'Consejo: Prueba calamares fritos.' },
        ],
      },
      {
        id: 'madeira',
        name: 'Madeira (Funchal)',
        tagline: 'La isla de las flores, picos y levadas',
        places: [
          { id: 'm1', title: 'Pico do Arieiro al Pico Ruivo', category: 'Ruta alpina', desc: 'Travesía de montaña sobre el mar de nubes.', tip: 'Consejo: Comienza al amanecer.' },
          { id: 'm2', title: 'Levada de las 25 Fuentes', category: 'Naturaleza UNESCO', desc: 'Sendero de canales por el bosque de laurisilva.', tip: 'Consejo: Sal temprano.' },
          { id: 'mb1', title: 'Prainha do Caniçal', category: '🏖 Playa de arena negra', desc: 'Encantadora cala de arena volcánica oscura.', tip: 'Consejo: Hermoso contraste de colores.' },
          { id: 'mb2', title: 'Playa de Calheta', category: '🏖 Laguna dorada', desc: 'Bahía gemela protegida de aguas tranquilas.', tip: 'Consejo: Ideal para familias.' },
        ],
      },
    ],
  },
  fr: {
    title: 'PortuStart',
    sub: 'Votre partenaire de relocalisation pour le Portugal',
    tabServices: 'Services',
    tabPlaces: 'Explorer',
    tabAtms: 'DAB',
    tabDoctors: 'Médecins',
    tabPerks: 'Bons plans',
    tabTrans: 'Assistant IA',
    tabCalc: 'Salaire',
    placesSectionTitle: '🇵🇹 Carte interactive et sites',
    placesSectionSub: 'Carte en direct du Portugal – choisissez une région ou réservez des visites :',
    openInAppMaps: 'Ouvrir dans Plans',
    swipeInstruction: '👉 Balayez horizontalement pour voir les sites, plages et visites :',
    openInMapsBtn: 'Itinéraire',
    gygBtn: 'Billets et visites (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Apprenez à parler couramment le portugais',
    italkiBannerDesc: 'Trouvez des tuteurs natifs certifiés pour des cours particuliers sur italki.',
    italkiBtn: 'Trouver des tuteurs natifs (italki) ↗',
    
    atmSectionTitle: '🏧 Distributeurs sans frais (Multibanco)',
    atmSectionSub: 'Utilisez le réseau officiel Multibanco dans les agences bancaires pour retirer de l’argent avec Revolut ou Wise sans frais :',
    atmTipTitle: '💡 Conseil important :',
    atmTipDesc: 'Choisissez toujours d’être facturé en Euros (€) si le distributeur propose une conversion dans votre devise.',

    docSectionTitle: '🩺 Médecins anglophones et urgences',
    docSectionSub: 'Numéros d’urgence essentiels et cliniques privées avec service international :',
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
    placeholderTrans: 'Posez une question à l’IA ou traduisez du texte...',
    btnTrans: 'Demander réponse IA / traduction',
    listenBtn: 'Écouter (TTS)',
    speakBtn: 'Parler (STT)',
    resultLabel: 'Résultat IA',
    servicesTitle: '📄 Services officiels et démarches',
    servicesSub: 'Commandez vos documents essentiels 100% en ligne via notre partenaire e-Residence :',
    checklistTitle: '📋 Feuille de route 30 premiers jours',
    checklistSub: 'Votre plan de relocalisation étape par étape',
    checklistDone: 'terminé',
    applyOnlineBtn: 'Demander en ligne ↗',
    affiliateDisclosure: 'Transparence : Ces liens redirigent vers un traitement express certifié avec e-Residence. Nous recevons une petite commission sans coût supplémentaire pour vous.',
    calcTitle: '💶 Calculateur de salaire net IA',
    calcSub: 'Calcul précis basé sur les dernières tables fiscales IRS via OpenAI.',
    calcGrossLabel: 'Salaire brut mensuel (€) :',
    calcBtn: 'Calculer avec l’IA',
    calcNetMonthly: 'Net estimé (par mois) :',
    calc14Notice: 'Basé sur 14 versements par an',
    calcGrossRow: 'Brut mensuel :',
    calcSSRow: 'Sécurité Sociale (-11%) :',
    calcIRSRow: 'Retenue IRS :',
    faqTitle: '🤖 FAQ & Conseil d’expert IA PortuStart',
    faqSub: 'Posez une question à l’IA sur le Portugal (NIF, logement, impôts) :',
    faqPlaceholder: 'ex. Comment obtenir un NIF sans contrat de location ?',
    faqBtn: 'Envoyer la question à l’IA',
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
        name: 'Lisbonne',
        tagline: 'La ville aux 7 collines, du Fado et des panoramas',
        places: [
          { id: 'l1', title: 'Tour de Belém et Monastère des Hiéronymites', category: 'Patrimoine mondial UNESCO', desc: 'Chef-d’œuvre manuélin le long du Tage.', tip: 'Conseil : Arriver avant 10h00.' },
          { id: 'l2', title: 'Miradouro de Santa Luzia et Alfama', category: 'Point de vue', desc: 'Bougainvilliers surplombant les toits de l’Alfama.', tip: 'Conseil : Visiter au coucher du soleil.' },
          { id: 'l3', title: 'Praça do Comércio', category: 'Place historique', desc: 'Grande place ouverte face au Tage.', tip: 'Conseil : Idéal pour débuter une balade.' },
          { id: 'lb1', title: 'Plage de Carcavelos', category: '🏖 Plage urbaine et surf', desc: 'Plus grande plage sur la ligne de train de Cascais.', tip: 'Conseil : 25 min de train.' },
          { id: 'lb2', title: 'Plage de Galapinhos', category: '🏖 Nature d’Arrábida', desc: 'Eaux cristallines sous les falaises du parc d’Arrábida.', tip: 'Conseil : Arriver tôt en été.' },
        ],
      },
      {
        id: 'porto',
        name: 'Porto',
        tagline: 'Architecture en granit, vin de Porto et ponts suspendus',
        places: [
          { id: 'p1', title: 'Pont Dom Luís I et Ribeira', category: 'Monument', desc: 'Pont emblématique en fer à double tablier sur le Douro.', tip: 'Conseil : Emprunter le tablier supérieur.' },
          { id: 'p2', title: 'Librairie Lello et Tour des Clercs', category: 'Culture', desc: 'Célèbre librairie néogothique avec escalier rouge.', tip: 'Conseil : Réserver en ligne.' },
          { id: 'p3', title: 'Caves de vin de Porto à Gaia', category: 'Tradition', desc: 'Chais de vieillissement historiques le long du fleuve.', tip: 'Conseil : Réserver une dégustation.' },
          { id: 'pb1', title: 'Plage de Matosinhos', category: '🏖 Plage métro', desc: 'Grande plage réputée pour ses fruits de mer frais.', tip: 'Conseil : Goûter le bar grillé.' },
          { id: 'pb2', title: 'Plage de Miramar', category: '🏖 Chapelle sur l’eau', desc: 'Chapelle du XVIIe siècle perchée sur des rochers.', tip: 'Conseil : Superbe spot photo au coucher du soleil.' },
        ],
      },
      {
        id: 'sintra',
        name: 'Sintra et Cascais',
        tagline: 'Palais de conte de fées et falaises de l’Atlantique',
        places: [
          { id: 's1', title: 'Palais national de Pena', category: 'Palais romantique', desc: 'Château coloré sur les sommets de Sintra.', tip: 'Conseil : Réserver un créneau le matin.' },
          { id: 's2', title: 'Quinta da Regaleira', category: 'Domaine mystique', desc: 'Parc enchanté avec grottes et Puits initiatique.', tip: 'Conseil : Apporter une lampe torche.' },
          { id: 's3', title: 'Cabo da Roca', category: 'Merveille naturelle', desc: 'Le point le plus occidental de l’Europe continentale.', tip: 'Conseil : Prévoir un coupe-vent.' },
          { id: 'sb1', title: 'Plage du Guincho', category: '🏖 Surf et dunes', desc: 'Paradis du surf entouré de dunes.', tip: 'Conseil : Emprunter les passerelles en bois.' },
          { id: 'sb2', title: 'Plage d’Ursa', category: '🏖 Crique secrète', desc: 'Plage sauvage flanquée d’immenses rochers.', tip: 'Conseil : Porter des chaussures de marche.' },
        ],
      },
      {
        id: 'algarve',
        name: 'Faro et Algarve',
        tagline: 'Falaises de grès doré et 300 jours de soleil',
        places: [
          { id: 'a1', title: 'Grotte marine de Benagil', category: 'Grottes et plages', desc: 'Célèbre grotte avec ouverture circulaire naturelle.', tip: 'Conseil : Louer un kayak tôt le matin.' },
          { id: 'a2', title: 'Ponta da Piedade (Lagos)', category: 'Côte de falaises', desc: 'Arches calcaires et eaux turquoise cristallines.', tip: 'Conseil : Faire une excursion en bateau.' },
          { id: 'a3', title: 'Parc naturel de Ria Formosa', category: 'Lagune et îles', desc: 'Zone humide côtière protégée avec îles piétonnes.', tip: 'Conseil : Prendre le ferry pour Armona.' },
          { id: 'ab1', title: 'Plage de Marinha', category: '🏖 Top plage européenne', desc: 'Doubles arches rocheuses et eaux de baignade.', tip: 'Conseil : Sentier des Vallées Suspendues.' },
          { id: 'ab2', title: 'Plage de Falésia', category: '🏖 Falaises rouges', desc: 'Plus de 6 km de sable abrités par des falaises rouges.', tip: 'Conseil : Balades à marée basse.' },
        ],
      },
      {
        id: 'coimbra',
        name: 'Coimbra et Centre',
        tagline: 'Ancienne capitale royale et histoire universitaire',
        places: [
          { id: 'c1', title: 'Bibliothèque Joanina', category: 'Bibliothèque baroque', desc: 'Joyeux écrin baroque abritant des manuscrits rares.', tip: 'Conseil : Réserver un billet combiné.' },
          { id: 'c2', title: 'Monastère de Santa Cruz', category: 'Histoire et Fado', desc: 'Dernière demeure des premiers rois du Portugal.', tip: 'Conseil : Assister à un concert de fado.' },
          { id: 'cb1', title: 'Plage de la Claridade (Figueira)', category: '🏖 Vaste plage', desc: 'Immense étendue de sable équipée de passerelles.', tip: 'Conseil : 40 min de train.' },
          { id: 'cb2', title: 'Plage de Mira', category: '🏖 Pêche traditionnelle', desc: 'Plage pittoresque avec cabanes en bois rayées.', tip: 'Conseil : Goûter les calmants frits.' },
        ],
      },
      {
        id: 'madeira',
        name: 'Madère (Funchal)',
        tagline: 'L’île aux fleurs aux sommets escarpés et levadas',
        places: [
          { id: 'm1', title: 'Pico do Arieiro au Pico Ruivo', category: 'Randonnée alpine', desc: 'Traversée de crête au-dessus de la mer de nuages.', tip: 'Conseil : Partir au lever du soleil.' },
          { id: 'm2', title: 'Levada des 25 Fontes', category: 'Nature UNESCO', desc: 'Sentier de canaux à travers la forêt laurifère.', tip: 'Conseil : Commencer tôt.' },
          { id: 'mb1', title: 'Prainha do Caniçal', category: '🏖 Plage de sable noir', desc: 'Charmante crique naturelle de sable volcanique sombre.', tip: 'Conseil : Superbe contraste visuel.' },
          { id: 'mb2', title: 'Plage de Calheta', category: '🏖 Lagon doré', desc: 'Double plage protégée aux eaux calmes.', tip: 'Conseil : Idéal pour les familles.' },
        ],
      },
    ],
  },
  it: {
    title: 'PortuStart',
    sub: 'Il tuo partner di trasferimento per il Portogallo',
    tabServices: 'Servizi',
    tabPlaces: 'Esplora',
    tabAtms: 'ATM',
    tabDoctors: 'Medici',
    tabPerks: 'Offerte',
    tabTrans: 'Assistente IA',
    tabCalc: 'Stipendio',
    placesSectionTitle: '🇵🇹 Mappa interattiva e luoghi',
    placesSectionSub: 'Mappa in tempo reale del Portogallo – scegli una regione o prenota tour:',
    openInAppMaps: 'Apri in Maps',
    swipeInstruction: '👉 Scorri in orizzontale per luoghi, spiagge e tour:',
    openInMapsBtn: 'Percorso',
    gygBtn: 'Biglietti e tour (GetYourGuide) ↗',
    italkiBannerTitle: '🗣 Impara a parlare portogruese fluentemente',
    italkiBannerDesc: 'Trova insegnanti madrelingua certificati per lezioni individuali su italki.',
    italkiBtn: 'Trova insegnanti madrelingua (italki) ↗',
    
    atmSectionTitle: '🏧 ATM senza commissioni (Multibanco)',
    atmSectionSub: 'Usa la rete ufficiale Multibanco presso le filiali bancarie per prelevare contanti con Revolut o Wise senza costi aggiuntivi:',
    atmTipTitle: '💡 Consiglio importante:',
    atmTipDesc: 'Scegli sempre di pagare in Euro (€) se l’ATM offre la conversione nella tua valuta locale.',

    docSectionTitle: '🩺 Medici di lingua inglese ed emergenze',
    docSectionSub: 'Numeri di emergenza essenziali e centri medici privati con assistenza internazionale:',
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
    congratsDesc: 'Hai completato con successo tutti i 7 passaggi della roadmap! Sei pronto per il tuo nuovo inizio in Portogallo.',

    from: 'Da:',
    to: 'A:',
    inputLabel: 'Inserimento:',
    placeholderTrans: 'Fai una domanda all’IA o traduci del testo...',
    btnTrans: 'Richiedi risposta IA / traduzione',
    listenBtn: 'Ascolta (TTS)',
    speakBtn: 'Parla (STT)',
    resultLabel: 'Risultato IA',
    servicesTitle: '📄 Servizi e pratiche ufficiali',
    servicesSub: 'Richiedi documenti essenziali 100% online tramite il nostro partner e-Residence:',
    checklistTitle: '📋 Roadmap primi 30 giorni',
    checklistSub: 'Il tuo piano di trasferimento passo dopo passo',
    checklistDone: 'completato',
    applyOnlineBtn: 'Richiedi online ora ↗',
    affiliateDisclosure: 'Trasparenza: Questi link reindirizzano a un’elaborazione express certificata con e-Residence. Riceviamo una piccola commissione senza costi aggiuntivi per te.',
    calcTitle: '💶 Calcolatore stipendio netto IA',
    calcSub: 'Calcolo preciso basato sulle ultime tabelle fiscali IRS tramite OpenAI.',
    calcGrossLabel: 'Stipendio lordo mensile (€):',
    calcBtn: 'Calcola con l’IA',
    calcNetMonthly: 'Netto stimato (mensile):',
    calc14Notice: 'Basato su 14 mensilità annuali',
    calcGrossRow: 'Lordo mensile:',
    calcSSRow: 'Previdenza Sociale (-11%):',
    calcIRSRow: 'Trattenuta IRS:',
    faqTitle: '🤖 FAQ & Consulenza esperta IA PortuStart',
    faqSub: 'Fai una domanda all’IA sul Portogallo (NIF, alloggio, tasse):',
    faqPlaceholder: 'es. Come ottenere un NIF senza contratto d’affitto?',
    faqBtn: 'Invia domanda all’IA',
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
        name: 'Lisbona',
        tagline: 'La città dei 7 colli, del Fado e dei punti panoramici',
        places: [
          { id: 'l1', title: 'Torre di Belém e Monastero dos Jerónimos', category: 'Patrimonio dell’Umanità UNESCO', desc: 'Capolavoro manuelino lungo il fiume Tago.', tip: 'Consiglio: Arrivare prima delle 10:00.' },
          { id: 'l2', title: 'Miradouro de Santa Luzia e Alfama', category: 'Punto panoramico', desc: 'Bougainvillea con vista sui tetti dell’Alfama.', tip: 'Consiglio: Visitare al tramonto.' },
          { id: 'l3', title: 'Praça do Comércio', category: 'Piazza storica', desc: 'Grande piazza affacciata sul fiume Tago.', tip: 'Consiglio: Ottimo punto di partenza per passeggiate.' },
          { id: 'lb1', title: 'Spiaggia di Carcavelos', category: '🏖 Spiaggia urbana e surf', desc: 'La spiaggia più grande sulla linea ferroviaria per Cascais.', tip: 'Consiglio: 25 min di treno.' },
          { id: 'lb2', title: 'Spiaggia di Galapinhos', category: '🏖 Natura di Arrábida', desc: 'Acque cristalline sotto le scogliere del parco.', tip: 'Consiglio: Arrivare presto in estate.' },
        ],
      },
      {
        id: 'porto',
        name: 'Porto',
        tagline: 'Architettura in granito, vino Porto e ponti scenografici',
        places: [
          { id: 'p1', title: 'Ponte D. Luís I e Ribeira', category: 'Monumento', desc: 'Iconico ponte in ferro a due livelli sul fiume Douro.', tip: 'Consiglio: Percorri il livello superiore.' },
          { id: 'p2', title: 'Libreria Lello e Torre dos Clérigos', category: 'Cultura', desc: 'Famosa libreria neogotica con scala rossa in legno.', tip: 'Consiglio: Prenota i biglietti online.' },
          { id: 'p3', title: 'Cantine del Porto a Gaia', category: 'Tradizione', desc: 'Storiche cantine di invecchiamento lungo il fiume.', tip: 'Consiglio: Prenota una degustazione guidata.' },
          { id: 'pb1', title: 'Spiaggia di Matosinhos', category: '🏖 Spiaggia con metro', desc: 'Ampia spiaggia famosa per i ristoranti di pesce fresco.', tip: 'Consiglio: Prova il branzino alla griglia.' },
          { id: 'pb2', title: 'Spiaggia di Miramar', category: '🏖 Cappella sul mare', desc: 'Cappella del XVII secolo arroccata sugli scogli.', tip: 'Consiglio: Ottimo spot fotografico al tramonto.' },
        ],
      },
      {
        id: 'sintra',
        name: 'Sintra e Cascais',
        tagline: 'Palazzi da fiaba nella nebbia e scogliere atlantiche',
        places: [
          { id: 's1', title: 'Palazzo Nazionale di Pena', category: 'Palazzo romantico', desc: 'Colorato castello sulle cime dei monti di Sintra.', tip: 'Consiglio: Prenota fasce orarie mattutine.' },
          { id: 's2', title: 'Quinta da Regaleira', category: 'Tenuta mistica', desc: 'Parco incantato con grotte e Pozzo Iniziatico.', tip: 'Consiglio: Porta una torcia.' },
          { id: 's3', title: 'Cabo da Roca', category: 'Meraviglia naturale', desc: 'Il punto più occidentale dell’Europa continentale.', tip: 'Consiglio: Porta una giacca a vento.' },
          { id: 'sb1', title: 'Spiaggia del Guincho', category: '🏖 Surf e dune', desc: 'Famoso paradiso del surf incorniciato dalle dune.', tip: 'Consiglio: Usa le passerelle di legno.' },
          { id: 'sb2', title: 'Spiaggia dell’Ursa', category: '🏖 Cala segreta', desc: 'Selvaggia spiaggia affiancata da enormi faraglioni.', tip: 'Consiglio: Indossa scarpe da trekking.' },
        ],
      },
      {
        id: 'algarve',
        name: 'Faro e Algarve',
        tagline: 'Scogliere di arenaria dorata e 300 giorni di sole',
        places: [
          { id: 'a1', title: 'Grotta marina di Benagil', category: 'Grotte e spiagge', desc: 'Famosa grotta con apertura circolare naturale.', tip: 'Consiglio: Noleggia un kayak la mattina.' },
          { id: 'a2', title: 'Ponta da Piedade (Lagos)', category: 'Costa rocciosa', desc: 'Archi calcarei e acque turchesi cristalline.', tip: 'Consiglio: Fai un tour in barca.' },
          { id: 'a3', title: 'Parco Naturale di Ria Formosa', category: 'Laguna e isole', desc: 'Zona umida protetta con isole senza auto.', tip: 'Consiglio: Prendi il traghetto per Armona.' },
          { id: 'ab1', title: 'Spiaggia di Marinha', category: '🏖 Top spiaggia europea', desc: 'Doppi archi marini e acque ideali per lo snorkeling.', tip: 'Consiglio: Sentiero delle Valli Sospese.' },
          { id: 'ab2', title: 'Spiaggia di Falésia', category: '🏖 Scogliere rosse', desc: 'Oltre 6 km di sabbia riparati da scogliere rossastre.', tip: 'Consiglio: Passeggiate con la bassa marea.' },
        ],
      },
      {
        id: 'coimbra',
        name: 'Coimbra e Centro',
        tagline: 'Antica capitale reale e storia universitaria',
        places: [
          { id: 'c1', title: 'Biblioteca Joanina', category: 'Biblioteca barocca', desc: 'Gioiello barocco con decorazioni dorate.', tip: 'Consiglio: Prenota biglietti combinati.' },
          { id: 'c2', title: 'Monastero di Santa Cruz', category: 'Storia e Fado', desc: 'Luogo di sepoltura dei primi re del Portogallo.', tip: 'Consiglio: Assisti a un concerto di fado.' },
          { id: 'cb1', title: 'Spiaggia da Claridade (Figueira)', category: '🏖 Spiaggia ampia', desc: 'Immensa distesa di sabbia con passerelle in legno.', tip: 'Consiglio: 40 min di treno.' },
          { id: 'cb2', title: 'Spiaggia di Mira', category: '🏖 Pesca tradizionale', desc: 'Pittoresca spiaggia con case in legno a strisce.', tip: 'Consiglio: Assaggia i calamari fritti.' },
        ],
      },
      {
        id: 'madeira',
        name: 'Madera (Funchal)',
        tagline: 'L’isola dei fiori con cime frastagliate e levadas',
        places: [
          { id: 'm1', title: 'Pico do Arieiro a Pico Ruivo', category: 'Escursione alpina', desc: 'Spettacolare traversata di cresta sopra le nuvole.', tip: 'Consiglio: Inizia all’alba.' },
          { id: 'm2', title: 'Levada das 25 Fontes', category: 'Natura UNESCO', desc: 'Sentiero lungo i canali nella foresta di laurisilva.', tip: 'Consiglio: Parti presto.' },
          { id: 'mb1', title: 'Prainha do Caniçal', category: '🏖 Sabbia nera vulcanica', desc: 'Incantevole caletta nascosta di sabbia scura.', tip: 'Consiglio: Bellissimo contrasto cromatico.' },
          { id: 'mb2', title: 'Spiaggia di Calheta', category: '🏖 Laguna dorata', desc: 'Doppia spiaggia protetta con acque calme.', tip: 'Consiglio: Ideale per famiglie.' },
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
  const [calcResult, setCalcResult] = useState(null);

  const [faqInput, setFaqInput] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqLoading, setFaqLoading] = useState(false);

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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Du bist der KI-Assistent der App "PortuStart". Übersetze Text präzise von ${sourceLang} nach ${targetLang}. Wenn der Nutzer eine Frage zu Portugal hat, beantworte sie direkt fundiert.`
            },
            {
              role: 'user',
              content: inputText.trim()
            }
          ],
          temperature: 0.3,
        }),
      });
      const data = await response.json();
      if (data.choices && data.choices[0].message.content) {
        setTranslatedText(data.choices[0].message.content.trim());
      } else {
        setTranslatedText('Fehler bei der KI-Antwort.');
      }
    } catch {
      setTranslatedText('Verbindungsfehler zur OpenAI API.');
    } finally {
      setLoading(false);
    }
  };

  const calculateNetSalaryAI = async (gross) => {
    const salary = parseFloat(gross) || 0;
    if (salary <= 0) return;
    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Du bist ein portugiesischer Steuerberater. Berechne für ein monatliches Bruttogehalt von ${salary} € (bei 14 Monatsgehältern) das Nettoeinkommen in Portugal unter Berücksichtigung von 11% Sozialversicherung und IRS-Steuertabrufen. Antworte AUSSCHLIESSLICH im folgenden JSON-Format ohne Markdown-Zeichen: {"gross": "...", "ss": "...", "irs": "...", "irsPercent": "...", "netMonthly": "...", "netAnnual": "..."}`
            }
          ],
          temperature: 0.1,
        }),
      });
      const data = await response.json();
      if (data.choices && data.choices[0].message.content) {
        const cleanJson = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        setCalcResult(parsed);
      }
    } catch {
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
    } finally {
      setLoading(false);
    }
  };

  const handleAskFaqAI = async () => {
    if (!faqInput.trim()) return;
    setFaqLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Du bist der offizielle Expat-Experte der App "PortuStart". Antworte präzise, freundlich und hilfreich auf ${appLang} auf Fragen zur Auswanderung und Bürokratie in Portugal (NIF, NISS, Bankkonto, AIMA, etc.).`
            },
            {
              role: 'user',
              content: faqInput.trim()
            }
          ],
          temperature: 0.4,
        }),
      });
      const data = await response.json();
      if (data.choices && data.choices[0].message.content) {
        setFaqAnswer(data.choices[0].message.content.trim());
      } else {
        setFaqAnswer('Keine Antwort erhalten.');
      }
    } catch {
      setFaqAnswer('Verbindungsfehler zur KI.');
    } finally {
      setFaqLoading(false);
    }
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

            <TouchableOpacity style={[styles.tabButton, activeTab === 'calc' && styles.tabButtonActive]} onPress={() => { setActiveTab('calc'); if (!calcResult) calculateNetSalaryAI(grossInput); }}>
              <Ionicons name="calculator" size={11} color={activeTab === 'calc' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'calc' && styles.tabTextActive]}>{t.tabCalc}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TAB 1: SERVICES & KI-FAQ */}
        {activeTab === 'services' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={[styles.card, { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Ionicons name="sparkles" size={20} color="#0F5132" style={{ marginRight: 6 }} />
                <Text style={styles.sectionHeaderTitle}>{t.faqTitle}</Text>
              </View>
              <Text style={styles.subText}>{t.faqSub}</Text>
              <TextInput 
                style={[styles.textInput, { minHeight: 60, paddingBottom: 10, backgroundColor: '#FFFFFF' }]} 
                placeholder={t.faqPlaceholder} 
                placeholderTextColor="#94A3B8" 
                value={faqInput} 
                onChangeText={setFaqInput} 
                multiline 
              />
              <TouchableOpacity style={styles.primaryBtn} onPress={handleAskFaqAI} disabled={faqLoading}>
                {faqLoading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnText}>{t.faqBtn}</Text>}
              </TouchableOpacity>

              {faqAnswer ? (
                <View style={[styles.resultCard, { marginTop: 10 }]}>
                  <Text style={styles.resultHeader}>KI-Expertenantwort:</Text>
                  <Text style={[styles.resultBody, { fontSize: 14, fontWeight: 'normal' }]}>{faqAnswer}</Text>
                </View>
              ) : null}
            </View>

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

        {/* TAB 6: TRANSLATOR & ASSISTANT */}
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

        {/* TAB 7: AI SALARY CALCULATOR */}
        {activeTab === 'calc' && (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>{t.calcTitle}</Text>
              <Text style={styles.subText}>{t.calcSub}</Text>

              <Text style={styles.inputFieldLabel}>{t.calcGrossLabel}</Text>
              <TextInput style={styles.salaryInputField} keyboardType="numeric" value={grossInput} onChangeText={setGrossInput} />

              <TouchableOpacity style={styles.primaryBtn} onPress={() => calculateNetSalaryAI(grossInput)} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnText}>{t.calcBtn}</Text>}
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
});
