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
// Trage hier deine echten Partner-Codes ein!
// ==========================================
const AFFILIATE_LINKS = {
  // e-Residence Partner-Links
  eResidenceNif: 'https://e-residence.com/?ref=portustart',
  eResidenceNiss: 'https://e-residence.com/?ref=portustart',
  eResidenceBank: 'https://e-residence.com/?ref=portustart',
  eResidenceHealth: 'https://e-residence.com/?ref=portustart', // z. B. Cigna / Expat Health
  // GetYourGuide Partner-Basis-URL
  getYourGuidePartnerId: 'DEINE_GYG_PARTNER_ID', // optional: Partner-ID eintragen
};

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

// REALE GEO-KOORDINATEN FÜR DIE INTERAKTIVE LIVE-KARTE
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

const LOCALES = {
  de: {
    title: 'PortuStart',
    sub: 'Dein Relocation-Partner für Portugal',
    tabServices: 'Services',
    tabPlaces: 'Entdecken',
    tabTrans: 'Translator',
    tabCalc: 'Gehalt',
    tabGuide: 'Guide',
    placesSectionTitle: '🇵🇹 Interaktive Karte & Highlights',
    placesSectionSub: 'Live-Karte von Portugal – wähle eine Region oder buche Touren:',
    openInAppMaps: 'In Maps-App',
    swipeInstruction: '👉 Horizontal wischen für Highlights, Strände & Touren:',
    openInMapsBtn: 'Route',
    gygBtn: 'Tickets & Touren (GetYourGuide) ↗',
    from: 'Von:',
    to: 'Nach:',
    inputLabel: 'Eingabe:',
    placeholderTrans: 'Text eingeben oder sprechen...',
    btnTrans: 'Übersetzen',
    listenBtn: 'Anhören',
    resultLabel: 'Ergebnis',
    servicesTitle: '📄 Offizielle Services & Anträge',
    servicesSub: 'Beantrage deine Dokumente & Absicherung 100% digital über unseren Partner e-Residence:',
    checklistTitle: '📋 Erste 30 Tage Roadmap',
    checklistSub: 'Dein bürokratischer Ablaufplan für Portugal',
    checklistDone: 'erledigt',
    applyOnlineBtn: 'Jetzt online beantragen ↗',
    affiliateDisclosure: 'Transparenz: Über diese Links erhältst du geprüfte Express-Bearbeitung bei e-Residence. Wir erhalten eine kleine Vermittlungsprovision – für dich bleibt der Preis unverändert.',
    affiliateCards: [
      {
        key: 'nif',
        title: 'NIF (Portugiesische Steuernummer)',
        badge: 'Schritt 1 • Pflicht',
        desc: 'Der Schlüssel für Miete, SIM-Karte, Job und Bankkonto. 100% online ohne Gang zum Finanzamt.',
        link: AFFILIATE_LINKS.eResidenceNif,
        icon: 'document-text',
      },
      {
        key: 'bank',
        title: 'Portugiesisches Bankkonto',
        badge: 'Schritt 2 • IBAN',
        desc: 'Eröffne ein offizielles Bankkonto bei führenden portugiesischen Banken mit persönlicher IBAN.',
        link: AFFILIATE_LINKS.eResidenceBank,
        icon: 'card',
      },
      {
        key: 'niss',
        title: 'NISS (Sozialversicherungsnummer)',
        badge: 'Schritt 3 • Arbeit',
        desc: 'Notwendig für Arbeitsvertrag, Gehaltseingang und Rentenbeiträge in Portugal.',
        link: AFFILIATE_LINKS.eResidenceNiss,
        icon: 'shield-checkmark',
      },
      {
        key: 'health',
        title: 'Internationale Krankenversicherung',
        badge: 'Schritt 4 • Visum & Schutz',
        desc: 'Visum-konforme Auslandskrankenversicherung (für D7, D8 Nomad-Visum oder Festanstellung) vor dem SNS-Zugang.',
        link: AFFILIATE_LINKS.eResidenceHealth,
        icon: 'medkit',
      },
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
    emergencyTitle: '🚨 Notfall- & Behördenkontakte',
    transitTitle: '🚆 Bus, Bahn & Metro (Ganz Portugal)',
    transitSub: 'Fahrpläne, Netze & Spartickets von Porto bis Faro',
    openLiveTransitBtn: 'Live-Navigation in Google Maps',
    phrasesTitle: '🗣 Wichtige Sätze & Vokabeln für den Start',
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
    phrases: [
      {
        category: 'Wohnungssuche & Miete (Arrendamento)',
        color: '#0284C7',
        items: [
          { trans: 'Ist die Wohnung noch verfügbar?', pt: 'O apartamento ainda está disponível?', ph: 'Oo ah-par-tah-men-too eye-ndah esh-tah deesh-poo-nee-vel?' },
          { trans: 'Wie hoch ist die Kaution / Vorauszahlung?', pt: 'Quanto é a caução e quantos meses adiantados?', ph: 'Kwan-too eh ah kow-sow ee kwan-toosh...?' },
          { trans: 'Ich habe keinen Bürgen (Fiador).', pt: 'Não tenho fiador.', ph: 'Nowng teng-yoo fee-ah-dor.' },
        ],
      },
      {
        category: 'Behörden & Papiere (AIMA / Finanças)',
        color: '#0F5132',
        items: [
          { trans: 'Ich brauche eine Steuernummer (NIF).', pt: 'Preciso de pedir o NIF nas Finanças.', ph: 'Preh-see-zoo deh peh-deer oo neef...' },
          { trans: 'Ich habe einen Termin bei der AIMA.', pt: 'Tenho uma marcação na AIMA.', ph: 'Ten-yoo oo-mah mar-kah-sah-oo nah eye-mah' },
        ],
      },
      {
        category: 'Gastronomie & Unterwegs',
        color: '#D97706',
        items: [
          { trans: 'Ein gezapftes Bier, bitte.', pt: 'Uma imperial, por favor (Lissabon) / Um fino (Porto).', ph: 'Oo-mah eem-peh-ree-ahl / Oom fee-noo' },
          { trans: 'Die Rechnung, bitte.', pt: 'A conta, por favor.', ph: 'Ah kon-tah, poor fah-vor' },
          { trans: 'Einen Espresso, bitte.', pt: 'Um café / Uma bica, por favor.', ph: 'Oom kah-feh / Oo-mah bee-kah' },
        ],
      },
    ],
    emergencies: [
      { name: 'Notruf (Polizei & Krankenwagen)', num: '112', icon: 'flame', color: '#DC2626', desc: 'Zentraler EU-Notruf für Notfälle.' },
      { name: 'SNS 24 (Gesundheitshotline)', num: '808242424', icon: 'medkit', color: '#0F5132', desc: 'Medizinische Ersteinschätzung vor Klinikbesuch.' },
      { name: 'Linha Migrante (AIMA)', num: '218106196', icon: 'people', color: '#0284C7', desc: 'Auskünfte zu Einwanderung & Dokumenten.' },
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
    placesSectionTitle: '🇵🇹 Interactive Map & Sights',
    placesSectionSub: 'Live map of Portugal – choose a region or book tours:',
    openInAppMaps: 'Open in Maps App',
    swipeInstruction: '👉 Swipe horizontally for sights, beaches & tours:',
    openInMapsBtn: 'Route',
    gygBtn: 'Tickets & Tours (GetYourGuide) ↗',
    from: 'From:',
    to: 'To:',
    inputLabel: 'Input:',
    placeholderTrans: 'Enter text or speak...',
    btnTrans: 'Translate',
    listenBtn: 'Listen',
    resultLabel: 'Result',
    servicesTitle: '📄 Official Relocation Services',
    servicesSub: 'Order essential documents & coverage 100% online through our partner e-Residence:',
    checklistTitle: '📋 First 30 Days Roadmap',
    checklistSub: 'Your step-by-step relocation checklist',
    checklistDone: 'completed',
    applyOnlineBtn: 'Apply online now ↗',
    affiliateDisclosure: 'Transparency notice: These links route to certified express processing with e-Residence. We receive a small referral commission at no additional cost to you.',
    affiliateCards: [
      {
        key: 'nif',
        title: 'NIF (Portuguese Tax Number)',
        badge: 'Step 1 • Essential',
        desc: 'The master key for renting, SIM cards, jobs and bank accounts. 100% remote without queueing at tax offices.',
        link: AFFILIATE_LINKS.eResidenceNif,
        icon: 'document-text',
      },
      {
        key: 'bank',
        title: 'Portuguese Bank Account',
        badge: 'Step 2 • IBAN',
        desc: 'Open a compliant local bank account with Portuguese IBAN at leading national banks remotely.',
        link: AFFILIATE_LINKS.eResidenceBank,
        icon: 'card',
      },
      {
        key: 'niss',
        title: 'NISS (Social Security Number)',
        badge: 'Step 3 • Employment',
        desc: 'Mandatory for payroll processing, employment contracts and local social contributions in Portugal.',
        link: AFFILIATE_LINKS.eResidenceNiss,
        icon: 'shield-checkmark',
      },
      {
        key: 'health',
        title: 'International Expat Health Insurance',
        badge: 'Step 4 • Visa & Care',
        desc: 'Compliant health coverage required for D7/D8 nomad visas and private healthcare prior to public SNS access.',
        link: AFFILIATE_LINKS.eResidenceHealth,
        icon: 'medkit',
      },
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
    emergencyTitle: '🚨 Emergency & Support Contacts',
    transitTitle: '🚆 Bus, Train & Metro (All Portugal)',
    transitSub: 'Schedules, network maps & passes from Porto to Faro',
    openLiveTransitBtn: 'Live Navigation in Google Maps',
    phrasesTitle: '🗣 Key Phrases for Everyday Life',
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
          { id: 'm1', title: 'Pico do Arieiro to Pico Ruivo', category: 'Alpine Trail', desc: 'Thrilling ridge hike above a sea of clouds.', tip: 'Tip: Watch the sunrise.' },
          { id: 'm2', title: '25 Fontes Levada Trail', category: 'UNESCO Nature', desc: 'Canal trail through ancient laurel forest.', tip: 'Tip: Start early.' },
          { id: 'mb1', title: 'Prainha do Caniçal', category: '🏖 Black Sand Beach', desc: 'Charming natural cove of dark volcanic sand.', tip: 'Tip: Beautiful contrast.' },
          { id: 'mb2', title: 'Praia da Calheta', category: '🏖 Golden Lagoon', desc: 'Protected twin beach with calm, warm waters.', tip: 'Tip: Great for families.' },
        ],
      },
    ],
    phrases: [
      {
        category: 'Renting & Apartments (Arrendamento)',
        color: '#0284C7',
        items: [
          { trans: 'Is the apartment still available?', pt: 'O apartamento ainda está disponível?', ph: 'Oo ah-par-tah-men-too...' },
          { trans: 'How much is the deposit / upfront months?', pt: 'Quanto é a caução e quantos meses adiantados?', ph: 'Kwan-too eh ah kow-sow...?' },
        ],
      },
      {
        category: 'Public Services & Paperwork (AIMA / Finanças)',
        color: '#0F5132',
        items: [
          { trans: 'I need to apply for a NIF.', pt: 'Preciso de pedir o NIF nas Finanças.', ph: 'Preh-see-zoo deh peh-deer oo neef...' },
        ],
      },
      {
        category: 'Dining & Everyday Life',
        color: '#D97706',
        items: [
          { trans: 'A draught beer, please.', pt: 'Uma imperial, por favor (Lisbon) / Um fino (Porto).', ph: 'Oo-mah eem-peh-ree-ahl / Oom fee-noo' },
          { trans: 'The bill, please.', pt: 'A conta, por favor.', ph: 'Ah kon-tah, poor fah-vor' },
        ],
      },
    ],
    emergencies: [
      { name: 'Emergency (Police & Ambulance)', num: '112', icon: 'flame', color: '#DC2626', desc: 'Central EU emergency dispatch.' },
      { name: 'SNS 24 (Public Health Line)', num: '808242424', icon: 'medkit', color: '#0F5132', desc: 'Clinical guidance before visiting hospitals.' },
    ],
  },
};

export default function App() {
  const [appLang, setAppLang] = useState('de');
  const [langModalVisible, setLangModalVisible] = useState(false);
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

  // Aktive Stadt & Attraktionen
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

  // GETYOURGUIDE AFFILIATE ACTION
  const openGetYourGuide = (query) => {
    const partnerParam = AFFILIATE_LINKS.getYourGuidePartnerId ? `&partner_id=${AFFILIATE_LINKS.getYourGuidePartnerId}` : '';
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
      Alert.alert('Audio', `🗣 "${text}"`);
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
            <TouchableOpacity style={styles.langSwitchHeaderBtn} onPress={() => setLangModalVisible(true)}>
              <Ionicons name="globe-outline" size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.langSwitchHeaderText}>
                {UI_LANGUAGES.find((l) => l.code === appLang)?.flag} {appLang.toUpperCase()}
              </Text>
            </TouchableOpacity>
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

        {/* TAB 1: SERVICES & E-RESIDENCE AFFILIATE LINKS */}
        {activeTab === 'services' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* 30-TAGE ROADMAP */}
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

            {/* E-RESIDENCE SERVICES KARTEN (AFFILIATE MONETARISIERUNG) */}
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

                  <TouchableOpacity
                    style={styles.affiliateActionBtn}
                    onPress={() => openUrl(srv.link)}
                  >
                    <Text style={styles.affiliateActionBtnText}>{t.applyOnlineBtn}</Text>
                    <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              ))}

              <Text style={styles.disclosureText}>{t.affiliateDisclosure}</Text>
            </View>
          </ScrollView>
        )}

        {/* TAB 2: PLACES / LIVE-KARTE & GETYOURGUIDE TOUREN */}
        {activeTab === 'places' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>{t.placesSectionTitle}</Text>
              <Text style={styles.subText}>{t.placesSectionSub}</Text>

              {/* Städte-Filter */}
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
                        name="location"
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

              {/* LIVE MAP IFRAME */}
              <View style={styles.liveMapWrapper}>
                {Platform.OS === 'web' ? (
                  <iframe
                    title="Portugal Interactive Map"
                    src={mapEmbedUrl}
                    style={styles.mapIframe}
                    loading="lazy"
                    allowFullScreen
                  />
                ) : (
                  <View style={styles.nativeMapFallback}>
                    <Ionicons name="map-outline" size={40} color="#0F5132" />
                    <Text style={styles.nativeMapText}>Portugal Live-Karte</Text>
                  </View>
                )}
                
                <TouchableOpacity
                  style={styles.floatingOpenMapsBtn}
                  onPress={() => openCityInNativeMaps(currentCityMeta.lat, currentCityMeta.lng, currentCityText.name)}
                >
                  <Ionicons name="navigate-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.floatingOpenMapsBtnText}>{t.openInAppMaps}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Region Title */}
            <View style={styles.cityDetailsHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.activeCityName}>{currentCityText.name}</Text>
                <Text style={styles.activeCityTagline}>{currentCityText.tagline}</Text>
              </View>
              <View style={styles.cityPlacesCounter}>
                <Text style={styles.cityPlacesCounterText}>{dynamicPlaces.length} Highlights & Strände</Text>
              </View>
            </View>

            <Text style={[styles.miniLabel, { marginHorizontal: 4, marginBottom: 8 }]}>
              {t.swipeInstruction}
            </Text>

            {/* HORIZONTALES SWIPE-KARUSSELL MIT GETYOURGUIDE BUTTON */}
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

                    {/* GETYOURGUIDE PARTNER-BUTTON */}
                    <TouchableOpacity
                      style={styles.gygBtn}
                      onPress={() => openGetYourGuide(place.gygQuery)}
                    >
                      <Ionicons name="ticket-outline" size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                      <Text style={styles.gygBtnText}>{t.gygBtn}</Text>
                    </TouchableOpacity>

                    {/* Route Button */}
                    <TouchableOpacity
                      style={styles.openMapBtn}
                      onPress={() => openUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`)}
                    >
                      <Ionicons name="navigate-outline" size={13} color="#475569" style={{ marginRight: 4 }} />
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

        {/* TAB 5: GUIDE (TRANSIT + NOTRUF + STANDARD-SÄTZE) */}
        {activeTab === 'guide' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Transit Hub */}
            <View style={styles.card}>
              <View style={styles.transitHeaderRow}>
                <Ionicons name="train" size={24} color="#0F5132" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionHeaderTitle}>{t.transitTitle}</Text>
                  <Text style={styles.subText}>{t.transitSub}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: '#0284C7', marginBottom: 6 }]}
                onPress={() => openUrl('https://www.google.com/maps/dir/?api=1&travelmode=transit')}
              >
                <Ionicons name="navigate-circle" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.btnText}>{t.openLiveTransitBtn}</Text>
              </TouchableOpacity>
            </View>

            {/* Notfallkontakte */}
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

            {/* Standard-Sätze & Vokabeln */}
            <View style={styles.guideSection}>
              <Text style={styles.sectionTitle}>{t.phrasesTitle}</Text>
              {t.phrases.map((sec, i) => (
                <View key={i} style={{ marginBottom: 12 }}>
                  <Text style={[styles.phraseCategoryTitle, { color: sec.color }]}>{sec.category}</Text>
                  {sec.items.map((item, idx) => (
                    <View key={idx} style={styles.phraseCard}>
                      <View style={styles.phraseHeaderRow}>
                        <Text style={styles.ptText}>{item.pt}</Text>
                        <TouchableOpacity onPress={() => playAudio(item.pt, 'pt')} style={{ padding: 4 }}>
                          <Ionicons name="volume-medium" size={18} color="#0F5132" />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.phText}>🗣 {item.ph}</Text>
                      <Text style={styles.deText}>{item.trans}</Text>
                    </View>
                  ))}
                </View>
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

  // E-RESIDENCE AFFILIATE CARDS
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

  // LIVE MAP STYLES
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
    backgroundColor: '#FF5533', // GetYourGuide Signature Orange
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
  transitHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  guideSection: { marginBottom: 16 },
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
  phraseCategoryTitle: { fontSize: 12.5, fontWeight: '800', marginBottom: 6 },
  phraseCard: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  phraseHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ptText: { fontSize: 14, fontWeight: '700', color: '#0F172A', flex: 1 },
  phText: { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginVertical: 2 },
  deText: { fontSize: 12, color: '#334155' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, width: '100%', maxWidth: 340 },
  modalTitle: { fontSize: 16, fontWeight: '800', textAlign: 'center', marginBottom: 12, color: '#0F172A' },
  modalGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  modalLangBtn: { width: '48%', backgroundColor: '#F8FAFC', paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: '#E2E8F0' },
  modalLangBtnActive: { borderColor: '#0F5132', backgroundColor: '#DCFCE7' },
  modalLangText: { fontSize: 12, fontWeight: '700', color: '#1E293B', marginTop: 2 },
  modalLangTextActive: { color: '#0F5132' },
});
