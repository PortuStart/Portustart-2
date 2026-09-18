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
  
  euCertificatePortal: 'https://siga.marcacaodeatendimento.pt/Marcacao/Entidades',

  getYourGuidePartnerId: 'AJWYURO',
  getYourGuideCmp: 'share_to_earn',

  italkiLang: 'https://www.italki.com/affshare?ref=af33636608',
  revolut: 'https://revolut.com/referral/?referral-code=portustart',
};

const UI_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
];

const TRANSLATOR_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', voice: 'en-US' },
  { code: 'pt', label: 'Português', flag: '🇵🇹', voice: 'pt-PT' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', voice: 'de-DE' },
  { code: 'es', label: 'Español', flag: '🇪🇸', voice: 'es-ES' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', voice: 'fr-FR' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', voice: 'it-IT' },
];

const CITIES_DATA_TRANSLATED = {
  de: [
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
  ],
  en: [
    {
      id: 'lisboa',
      name: 'Lisboa & Surroundings',
      tagline: 'Your saved places in the capital',
      lat: 38.7223,
      lng: -9.1393,
      zoom: 12,
      places: [
        { id: 'l1', title: 'Jardim da Estrela', category: 'City park (4.6 ⭐)', city: 'Lisboa', desc: 'Historic city park with a café.', bookable: false },
        { id: 'l2', title: 'PUT IT ON LISBON', category: 'Coffee shop (4.9 ⭐)', city: 'Lisboa', desc: 'Cozy coffee shop.', bookable: false },
        { id: 'l3', title: 'Botanical Garden of Lisbon', category: 'Botanical garden (4.0 ⭐)', city: 'Lisboa', desc: 'Botanical garden.', bookable: true },
        { id: 'l4', title: 'ROOFTOP - TOPO MARTIM MONIZ', category: 'Cocktail bar (4.3 ⭐)', city: 'Lisboa', desc: 'Rooftop bar with a view.', bookable: false },
        { id: 'l5', title: 'Fábrica Braço de Prata', category: 'Cultural center (4.4 ⭐)', city: 'Lisboa', desc: 'Cultural center & bar.', bookable: true },
        { id: 'l6', title: 'A Capela', category: 'Club (4.4 ⭐)', city: 'Lisboa', desc: 'Small club bar.', bookable: false },
        { id: 'l7', title: 'Jerónimos Monastery', category: 'Monastery (4.4 ⭐)', city: 'Lisboa / Belém', desc: 'Famous UNESCO monastery.', bookable: true },
        { id: 'l8', title: 'Carmo Archaeological Museum', category: 'Archaeological museum (4.5 ⭐)', city: 'Lisboa', desc: 'Gothic ruin and museum.', bookable: true },
        { id: 'l9', title: 'A Minha Avó', category: 'Vegan restaurant (4.6 ⭐)', city: 'Lisboa', desc: 'Vegan cuisine.', bookable: false },
        { id: 'l10', title: 'Cosmos Campolide', category: 'Cultural center (4.6 ⭐)', city: 'Lisboa', desc: 'Cultural center.', bookable: false },
        { id: 'l11', title: 'Bar Badassery', category: 'Cocktail bar (4.6 ⭐)', city: 'Lisboa', desc: 'Cocktails and drinks.', bookable: false },
        { id: 'l12', title: 'River Garden', category: 'Garden (4.7 ⭐)', city: 'Lisboa', desc: 'Nice garden area.', bookable: false },
        { id: 'l13', title: 'Miradouro da Graça', category: 'Scenic spot (4.7 ⭐)', city: 'Lisboa', desc: 'Popular viewpoint with a kiosk.', bookable: false },
        { id: 'l14', title: 'Fable Bookshop + Coffee', category: 'Book store / Cafe (4.8 ⭐)', city: 'Lisboa', desc: 'Books and coffee.', bookable: false },
        { id: 'l15', title: 'Seedge', category: 'Cannabis store (5.0 ⭐)', city: 'Lisboa', desc: 'Specialty store.', bookable: false },
        { id: 'l16', title: 'Retro City', category: 'Vintage clothing (4.5 ⭐)', city: 'Lisboa', desc: 'Vintage fashion.', bookable: false },
        { id: 'l17', title: 'Monsanto', category: 'Mountain peak (4.7 ⭐)', city: 'Lisboa', desc: 'Green lung of Lisbon.', bookable: false },
        { id: 'l18', title: 'Lara Coffee', category: 'Pastries (4.2 ⭐)', city: 'Lisboa', desc: 'Pastries and coffee.', bookable: false },
        { id: 'l19', title: 'Castelo de São Jorge', category: 'Castle (4.5 ⭐)', city: 'Lisboa', desc: 'Historic castle overlooking the city.', bookable: true },
        { id: 'l20', title: 'Estufa Fria', category: 'Botanical garden (4.7 ⭐)', city: 'Lisboa', desc: 'Greenhouse with exotic plants.', bookable: true },
        { id: 'l21', title: 'Loja Real', category: 'Clothing store (3.3 ⭐)', city: 'Lisboa', desc: 'Fashion store.', bookable: false },
        { id: 'l22', title: 'Miradouro de Santa Luzia', category: 'Scenic spot (4.6 ⭐)', city: 'Lisboa', desc: 'Romantic viewpoint.', bookable: false },
        { id: 'l23', title: 'Dearvains', category: 'Thrift store (4.7 ⭐)', city: 'Lisboa', desc: 'Second-hand shop.', bookable: false },
        { id: 'l24', title: 'Campo das Cebolas', category: 'Square', city: 'Lisboa', desc: 'Historic square.', bookable: false },
        { id: 'l25', title: 'Feira do Relógio', category: 'Flea market (4.3 ⭐)', city: 'Lisboa', desc: 'Large flea market.', bookable: false },
        { id: 'l26', title: 'Amor Records', category: 'Record store (4.7 ⭐)', city: 'Lisboa', desc: 'Record store.', bookable: false },
        { id: 'l27', title: 'Boubaud Vintage Boutique', category: 'Vintage clothing (4.9 ⭐)', city: 'Lisboa', desc: 'Vintage boutique.', bookable: false },
        { id: 'l28', title: 'Little Chelsea', category: 'Art gallery (4.3 ⭐)', city: 'Lisboa', desc: 'Art gallery.', bookable: false },
        { id: 'l29', title: '8 Marvila', category: 'Cultural center (4.6 ⭐)', city: 'Lisboa / Marvila', desc: 'Event and cultural hub.', bookable: true },
        { id: 'l30', title: 'Café da Garagem', category: 'Cafe (4.2 ⭐)', city: 'Lisboa', desc: 'Café with a great view.', bookable: false },
        { id: 'l31', title: 'Terraço Chill-Out Limão', category: 'Bar (4.3 ⭐)', city: 'Lisboa', desc: 'Chill-out bar.', bookable: false },
        { id: 'l32', title: 'My Auchan', category: 'Supermarket (4.0 ⭐)', city: 'Lisboa', desc: 'Supermarket.', bookable: false },
        { id: 'l33', title: 'Jardins do Bombarda', category: 'Park (4.6 ⭐)', city: 'Lisboa', desc: 'Garden area.', bookable: false },
        { id: 'l34', title: 'Jardim das Cerejas', category: 'Vegan (4.6 ⭐)', city: 'Lisboa', desc: 'Vegan restaurant.', bookable: false },
        { id: 'l35', title: 'Triparte Store & Tattoo', category: 'Clothing & Tattoo (4.6 ⭐)', city: 'Lisboa', desc: 'Store and tattoo.', bookable: false },
        { id: 'l36', title: 'Rita Biju', category: 'Jewelry store (2.7 ⭐)', city: 'Lisboa', desc: 'Jewelry.', bookable: false },
        { id: 'l37', title: 'HUMANA', category: 'Second hand (4.4 ⭐)', city: 'Lisboa', desc: 'Second-hand store.', bookable: false },
        { id: 'l38', title: 'Trumps', category: 'Gay night club (4.2 ⭐)', city: 'Lisboa', desc: 'Popular club.', bookable: false },
        { id: 'l39', title: 'POSH CLUB LISBON', category: 'Gay night club (4.1 ⭐)', city: 'Lisboa', desc: 'Club.', bookable: false },
        { id: 'l40', title: 'Machimbombo', category: 'Bar (4.3 ⭐)', city: 'Lisboa', desc: 'Bar in the old town.', bookable: false },
        { id: 'l41', title: 'Side Bar', category: 'Gay bar (4.1 ⭐)', city: 'Lisboa', desc: 'Bar.', bookable: false },
        { id: 'l42', title: 'Drama Bar', category: 'Bar (4.6 ⭐)', city: 'Lisboa', desc: 'Scene bar.', bookable: false },
        { id: 'l43', title: 'Copenhagen Coffee Lab - Baixa', category: 'Coffee shop (4.3 ⭐)', city: 'Lisboa', desc: 'Scandinavian coffee.', bookable: false },
        { id: 'l44', title: 'Green Street', category: 'Tourist attraction (4.2 ⭐)', city: 'Lisboa', desc: 'Green street.', bookable: false },
        { id: 'l45', title: 'LX Factory', category: 'Art center (4.5 ⭐)', city: 'Lisboa', desc: 'Creative hub in an old factory.', bookable: true },
        { id: 'l46', title: 'Alfama', category: 'Historic district', city: 'Lisboa', desc: 'Oldest district of Lisbon.', bookable: true },
        { id: 'l47', title: 'Fauna & Flora - Anjos', category: 'Restaurant (4.4 ⭐)', city: 'Lisboa', desc: 'Brunch and bowls.', bookable: false },
        { id: 'l48', title: 'Village Underground Lisboa', category: 'Cultural center (4.2 ⭐)', city: 'Lisboa', desc: 'Creative space in containers.', bookable: false },
        { id: 'l49', title: 'Delirium Café Lisboa', category: 'Pub (4.5 ⭐)', city: 'Lisboa', desc: 'Popular bar.', bookable: false },
      ],
    },
    {
      id: 'caparica',
      name: 'Caparica & Setúbal',
      tagline: 'Beaches and places south of the Tagus',
      lat: 38.5500,
      lng: -9.1800,
      zoom: 11,
      places: [
        { id: 'cp1', title: 'Praia da Fonte da Telha', category: 'Beach (4.5 ⭐)', city: 'Caparica', desc: 'Long sandy beach.', bookable: false },
        { id: 'cp2', title: 'Cash Converters', category: 'Second hand (3.9 ⭐)', city: 'Charneca de Caparica', desc: 'Second-hand shop.', bookable: false },
      ],
    },
    {
      id: 'sintra_cascais',
      name: 'Sintra & Cascais',
      tagline: 'Fairytale places and Atlantic coasts',
      lat: 38.8029,
      lng: -9.3817,
      zoom: 12,
      places: [
        { id: 'sc1', title: 'Cape Carvoeiro Viewpoint', category: 'Scenic spot (4.6 ⭐)', city: 'Peniche / Sintra Region', desc: 'Coastal viewpoint.', bookable: true },
        { id: 'sc2', title: 'Coin Caves', category: 'Tourist attraction (4.6 ⭐)', city: 'Sintra Region', desc: 'Impressive caves.', bookable: true },
        { id: 'sc3', title: 'Praia da Adraga', category: 'Beach (4.8 ⭐)', city: 'Sintra', desc: 'Dramatic cliff coast.', bookable: false },
        { id: 'sc4', title: 'Carcavelos beach', category: 'Beach (4.4 ⭐)', city: 'Carcavelos', desc: 'Popular surf beach.', bookable: true },
      ],
    },
    {
      id: 'algarve_south',
      name: 'Algarve & South',
      tagline: 'Golden cliffs and coastal paradises',
      lat: 37.0194,
      lng: -7.9322,
      zoom: 10,
      places: [
        { id: 'alg1', title: 'Sesimbra', category: 'Coastal town', city: 'Sesimbra', desc: 'Picturesque fishing village.', bookable: true },
        { id: 'alg2', title: 'Galapos beach', category: 'Beach (4.7 ⭐)', city: 'Arrábida / Setúbal', desc: 'Crystal clear water in nature park.', bookable: true },
        { id: 'alg3', title: 'Praia de Paredes da Vitória', category: 'Public beach (4.6 ⭐)', city: 'Leiria Region', desc: 'Spacious beach.', bookable: false },
        { id: 'alg4', title: 'Ponta da Piedade', category: 'Scenic spot (4.8 ⭐)', city: 'Lagos (Algarve)', desc: 'Cliff landscape in the Algarve.', bookable: true },
        { id: 'alg5', title: 'Praia do Ribeiro do Cavalo', category: 'Nature preserve (4.7 ⭐)', city: 'Sesimbra', desc: 'Hidden wild cove.', bookable: true },
      ],
    },
    {
      id: 'other_regions',
      name: 'Other Regions',
      tagline: 'Loures, Alqueva and other places',
      lat: 38.2000,
      lng: -8.0000,
      zoom: 8,
      places: [
        { id: 'oth1', title: 'Espaço Casa Loures', category: 'Home goods (4.1 ⭐)', city: 'Loures', desc: 'Home goods.', bookable: false },
        { id: 'oth2', title: 'Observatório Oficial Dark Sky Alqueva', category: 'Observatory (4.7 ⭐)', city: 'Alqueva', desc: 'Stargazing.', bookable: true },
        { id: 'oth3', title: 'Loja CTT', category: 'Post office (3.0 ⭐)', city: 'Portugal', desc: 'Post office.', bookable: false },
      ],
    },
  ],
  es: [
    {
      id: 'lisboa',
      name: 'Lisboa y alrededores',
      tagline: 'Tus lugares guardados en la capital',
      lat: 38.7223,
      lng: -9.1393,
      zoom: 12,
      places: [
        { id: 'l1', title: 'Jardim da Estrela', category: 'City park (4.6 ⭐)', city: 'Lisboa', desc: 'Parque urbano histórico con café.', bookable: false },
        { id: 'l2', title: 'PUT IT ON LISBON', category: 'Coffee shop (4.9 ⭐)', city: 'Lisboa', desc: 'Cafetería acogedora.', bookable: false },
        { id: 'l3', title: 'Botanical Garden of Lisbon', category: 'Botanical garden (4.0 ⭐)', city: 'Lisboa', desc: 'Jardín botánico.', bookable: true },
        { id: 'l4', title: 'ROOFTOP - TOPO MARTIM MONIZ', category: 'Cocktail bar (4.3 ⭐)', city: 'Lisboa', desc: 'Bar en la azotea con vistas.', bookable: false },
        { id: 'l5', title: 'Fábrica Braço de Prata', category: 'Cultural center (4.4 ⭐)', city: 'Lisboa', desc: 'Centro cultural y bar.', bookable: true },
        { id: 'l6', title: 'A Capela', category: 'Club (4.4 ⭐)', city: 'Lisboa', desc: 'Pequeño bar club.', bookable: false },
        { id: 'l7', title: 'Jerónimos Monastery', category: 'Monastery (4.4 ⭐)', city: 'Lisboa / Belém', desc: 'Famoso monasterio de la UNESCO.', bookable: true },
        { id: 'l8', title: 'Carmo Archaeological Museum', category: 'Archaeological museum (4.5 ⭐)', city: 'Lisboa', desc: 'Ruina gótica y museo.', bookable: true },
        { id: 'l9', title: 'A Minha Avó', category: 'Vegan restaurant (4.6 ⭐)', city: 'Lisboa', desc: 'Cocina vegana.', bookable: false },
        { id: 'l10', title: 'Cosmos Campolide', category: 'Cultural center (4.6 ⭐)', city: 'Lisboa', desc: 'Centro cultural.', bookable: false },
        { id: 'l11', title: 'Bar Badassery', category: 'Cocktail bar (4.6 ⭐)', city: 'Lisboa', desc: 'Cócteles y bebidas.', bookable: false },
        { id: 'l12', title: 'River Garden', category: 'Garden (4.7 ⭐)', city: 'Lisboa', desc: 'Bonita zona de jardín.', bookable: false },
        { id: 'l13', title: 'Miradouro da Graça', category: 'Scenic spot (4.7 ⭐)', city: 'Lisboa', desc: 'Mirador popular con quiosco.', bookable: false },
        { id: 'l14', title: 'Fable Bookshop + Coffee', category: 'Book store / Cafe (4.8 ⭐)', city: 'Lisboa', desc: 'Libros y café.', bookable: false },
        { id: 'l15', title: 'Seedge', category: 'Cannabis store (5.0 ⭐)', city: 'Lisboa', desc: 'Tienda especializada.', bookable: false },
        { id: 'l16', title: 'Retro City', category: 'Vintage clothing (4.5 ⭐)', city: 'Lisboa', desc: 'Moda vintage.', bookable: false },
        { id: 'l17', title: 'Monsanto', category: 'Mountain peak (4.7 ⭐)', city: 'Lisboa', desc: 'Pulmón verde de Lisboa.', bookable: false },
        { id: 'l18', title: 'Lara Coffee', category: 'Pastries (4.2 ⭐)', city: 'Lisboa', desc: 'Bollería y café.', bookable: false },
        { id: 'l19', title: 'Castelo de São Jorge', category: 'Castle (4.5 ⭐)', city: 'Lisboa', desc: 'Castillo histórico sobre la ciudad.', bookable: true },
        { id: 'l20', title: 'Estufa Fria', category: 'Botanical garden (4.7 ⭐)', city: 'Lisboa', desc: 'Invernadero con plantas exóticas.', bookable: true },
        { id: 'l21', title: 'Loja Real', category: 'Clothing store (3.3 ⭐)', city: 'Lisboa', desc: 'Tienda de moda.', bookable: false },
        { id: 'l22', title: 'Miradouro de Santa Luzia', category: 'Scenic spot (4.6 ⭐)', city: 'Lisboa', desc: 'Mirador romántico.', bookable: false },
        { id: 'l23', title: 'Dearvains', category: 'Thrift store (4.7 ⭐)', city: 'Lisboa', desc: 'Tienda de segunda mano.', bookable: false },
        { id: 'l24', title: 'Campo das Cebolas', category: 'Square', city: 'Lisboa', desc: 'Plaza histórica.', bookable: false },
        { id: 'l25', title: 'Feira do Relógio', category: 'Flea market (4.3 ⭐)', city: 'Lisboa', desc: 'Gran mercadillo.', bookable: false },
        { id: 'l26', title: 'Amor Records', category: 'Record store (4.7 ⭐)', city: 'Lisboa', desc: 'Tienda de discos.', bookable: false },
        { id: 'l27', title: 'Boubaud Vintage Boutique', category: 'Vintage clothing (4.9 ⭐)', city: 'Lisboa', desc: 'Boutique vintage.', bookable: false },
        { id: 'l28', title: 'Little Chelsea', category: 'Art gallery (4.3 ⭐)', city: 'Lisboa', desc: 'Galería de arte.', bookable: false },
        { id: 'l29', title: '8 Marvila', category: 'Cultural center (4.6 ⭐)', city: 'Lisboa / Marvila', desc: 'Centro de eventos y cultura.', bookable: true },
        { id: 'l30', title: 'Café da Garagem', category: 'Cafe (4.2 ⭐)', city: 'Lisboa', desc: 'Café con gran vista.', bookable: false },
        { id: 'l31', title: 'Terraço Chill-Out Limão', category: 'Bar (4.3 ⭐)', city: 'Lisboa', desc: 'Bar chill-out.', bookable: false },
        { id: 'l32', title: 'My Auchan', category: 'Supermarket (4.0 ⭐)', city: 'Lisboa', desc: 'Supermercado.', bookable: false },
        { id: 'l33', title: 'Jardins do Bombarda', category: 'Park (4.6 ⭐)', city: 'Lisboa', desc: 'Zona ajardinada.', bookable: false },
        { id: 'l34', title: 'Jardim das Cerejas', category: 'Vegan (4.6 ⭐)', city: 'Lisboa', desc: 'Restaurante vegano.', bookable: false },
        { id: 'l35', title: 'Triparte Store & Tattoo', category: 'Clothing & Tattoo (4.6 ⭐)', city: 'Lisboa', desc: 'Tienda y tatuajes.', bookable: false },
        { id: 'l36', title: 'Rita Biju', category: 'Jewelry store (2.7 ⭐)', city: 'Lisboa', desc: 'Joyería.', bookable: false },
        { id: 'l37', title: 'HUMANA', category: 'Second hand (4.4 ⭐)', city: 'Lisboa', desc: 'Tienda de segunda mano.', bookable: false },
        { id: 'l38', title: 'Trumps', category: 'Gay night club (4.2 ⭐)', city: 'Lisboa', desc: 'Club popular.', bookable: false },
        { id: 'l39', title: 'POSH CLUB LISBON', category: 'Gay night club (4.1 ⭐)', city: 'Lisboa', desc: 'Club.', bookable: false },
        { id: 'l40', title: 'Machimbombo', category: 'Bar (4.3 ⭐)', city: 'Lisboa', desc: 'Bar en el casco antiguo.', bookable: false },
        { id: 'l41', title: 'Side Bar', category: 'Gay bar (4.1 ⭐)', city: 'Lisboa', desc: 'Bar.', bookable: false },
        { id: 'l42', title: 'Drama Bar', category: 'Bar (4.6 ⭐)', city: 'Lisboa', desc: 'Bar de ambiente.', bookable: false },
        { id: 'l43', title: 'Copenhagen Coffee Lab - Baixa', category: 'Coffee shop (4.3 ⭐)', city: 'Lisboa', desc: 'Café escandinavo.', bookable: false },
        { id: 'l44', title: 'Green Street', category: 'Tourist attraction (4.2 ⭐)', city: 'Lisboa', desc: 'Calle verde.', bookable: false },
        { id: 'l45', title: 'LX Factory', category: 'Art center (4.5 ⭐)', city: 'Lisboa', desc: 'Centro creativo en una antigua fábrica.', bookable: true },
        { id: 'l46', title: 'Alfama', category: 'Historic district', city: 'Lisboa', desc: 'Barrio más antiguo de Lisboa.', bookable: true },
        { id: 'l47', title: 'Fauna & Flora - Anjos', category: 'Restaurant (4.4 ⭐)', city: 'Lisboa', desc: 'Brunch y cuencos.', bookable: false },
        { id: 'l48', title: 'Village Underground Lisboa', category: 'Cultural center (4.2 ⭐)', city: 'Lisboa', desc: 'Espacio creativo en contenedores.', bookable: false },
        { id: 'l49', title: 'Delirium Café Lisboa', category: 'Pub (4.5 ⭐)', city: 'Lisboa', desc: 'Bar popular.', bookable: false },
      ],
    },
    {
      id: 'caparica',
      name: 'Caparica & Setúbal',
      tagline: 'Playas y lugares al sur del Tajo',
      lat: 38.5500,
      lng: -9.1800,
      zoom: 11,
      places: [
        { id: 'cp1', title: 'Praia da Fonte da Telha', category: 'Beach (4.5 ⭐)', city: 'Caparica', desc: 'Largo arenal.', bookable: false },
        { id: 'cp2', title: 'Cash Converters', category: 'Second hand (3.9 ⭐)', city: 'Charneca de Caparica', desc: 'Tienda de compraventa.', bookable: false },
      ],
    },
    {
      id: 'sintra_cascais',
      name: 'Sintra & Cascais',
      tagline: 'Lugares de cuento y costas atlánticas',
      lat: 38.8029,
      lng: -9.3817,
      zoom: 12,
      places: [
        { id: 'sc1', title: 'Cape Carvoeiro Viewpoint', category: 'Scenic spot (4.6 ⭐)', city: 'Peniche / Sintra Region', desc: 'Mirador costero.', bookable: true },
        { id: 'sc2', title: 'Coin Caves', category: 'Tourist attraction (4.6 ⭐)', city: 'Sintra Region', desc: 'Cuevas impresionantes.', bookable: true },
        { id: 'sc3', title: 'Praia da Adraga', category: 'Beach (4.8 ⭐)', city: 'Sintra', desc: 'Costa de acantilados dramáticos.', bookable: false },
        { id: 'sc4', title: 'Carcavelos beach', category: 'Beach (4.4 ⭐)', city: 'Carcavelos', desc: 'Playa de surf popular.', bookable: true },
      ],
    },
    {
      id: 'algarve_south',
      name: 'Algarve y Sur',
      tagline: 'Acantilados dorados y paraísos costeros',
      lat: 37.0194,
      lng: -7.9322,
      zoom: 10,
      places: [
        { id: 'alg1', title: 'Sesimbra', category: 'Coastal town', city: 'Sesimbra', desc: 'Pintoresco pueblo pesquero.', bookable: true },
        { id: 'alg2', title: 'Galapos beach', category: 'Beach (4.7 ⭐)', city: 'Arrábida / Setúbal', desc: 'Agua cristalina en el parque natural.', bookable: true },
        { id: 'alg3', title: 'Praia de Paredes da Vitória', category: 'Public beach (4.6 ⭐)', city: 'Leiria Region', desc: 'Playa amplia.', bookable: false },
        { id: 'alg4', title: 'Ponta da Piedade', category: 'Scenic spot (4.8 ⭐)', city: 'Lagos (Algarve)', desc: 'Paisaje de acantilados en el Algarve.', bookable: true },
        { id: 'alg5', title: 'Praia do Ribeiro do Cavalo', category: 'Nature preserve (4.7 ⭐)', city: 'Sesimbra', desc: 'Cala salvaje escondida.', bookable: true },
      ],
    },
    {
      id: 'other_regions',
      name: 'Otras regiones',
      tagline: 'Loures, Alqueva y otros lugares',
      lat: 38.2000,
      lng: -8.0000,
      zoom: 8,
      places: [
        { id: 'oth1', title: 'Espaço Casa Loures', category: 'Home goods (4.1 ⭐)', city: 'Loures', desc: 'Artículos para el hogar.', bookable: false },
        { id: 'oth2', title: 'Observatório Oficial Dark Sky Alqueva', category: 'Observatory (4.7 ⭐)', city: 'Alqueva', desc: 'Observación de estrellas.', bookable: true },
        { id: 'oth3', title: 'Loja CTT', category: 'Post office (3.0 ⭐)', city: 'Portugal', desc: 'Oficina de correos.', bookable: false },
      ],
    },
  ],
  fr: [
    {
      id: 'lisboa',
      name: 'Lisbonne & Environs',
      tagline: 'Vos lieux enregistrés dans la capitale',
      lat: 38.7223,
      lng: -9.1393,
      zoom: 12,
      places: [
        { id: 'l1', title: 'Jardim da Estrela', category: 'City park (4.6 ⭐)', city: 'Lisboa', desc: 'Parc historique avec café.', bookable: false },
        { id: 'l2', title: 'PUT IT ON LISBON', category: 'Coffee shop (4.9 ⭐)', city: 'Lisboa', desc: 'Café chaleureux.', bookable: false },
        { id: 'l3', title: 'Botanical Garden of Lisbon', category: 'Botanical garden (4.0 ⭐)', city: 'Lisboa', desc: 'Jardin botanique.', bookable: true },
        { id: 'l4', title: 'ROOFTOP - TOPO MARTIM MONIZ', category: 'Cocktail bar (4.3 ⭐)', city: 'Lisboa', desc: 'Bar sur le toit avec vue.', bookable: false },
        { id: 'l5', title: 'Fábrica Braço de Prata', category: 'Cultural center (4.4 ⭐)', city: 'Lisboa', desc: 'Centre culturel et bar.', bookable: true },
        { id: 'l6', title: 'A Capela', category: 'Club (4.4 ⭐)', city: 'Lisboa', desc: 'Petit bar-club.', bookable: false },
        { id: 'l7', title: 'Jerónimos Monastery', category: 'Monastery (4.4 ⭐)', city: 'Lisboa / Belém', desc: 'Célèbre monastère de l’UNESCO.', bookable: true },
        { id: 'l8', title: 'Carmo Archaeological Museum', category: 'Archaeological museum (4.5 ⭐)', city: 'Lisboa', desc: 'Ruine gothique et musée.', bookable: true },
        { id: 'l9', title: 'A Minha Avó', category: 'Vegan restaurant (4.6 ⭐)', city: 'Lisboa', desc: 'Cuisine végane.', bookable: false },
        { id: 'l10', title: 'Cosmos Campolide', category: 'Cultural center (4.6 ⭐)', city: 'Lisboa', desc: 'Centre culturel.', bookable: false },
        { id: 'l11', title: 'Bar Badassery', category: 'Cocktail bar (4.6 ⭐)', city: 'Lisboa', desc: 'Cocktails et boissons.', bookable: false },
        { id: 'l12', title: 'River Garden', category: 'Garden (4.7 ⭐)', city: 'Lisboa', desc: 'Bel espace jardin.', bookable: false },
        { id: 'l13', title: 'Miradouro da Graça', category: 'Scenic spot (4.7 ⭐)', city: 'Lisboa', desc: 'Belvédère populaire avec kiosque.', bookable: false },
        { id: 'l14', title: 'Fable Bookshop + Coffee', category: 'Book store / Cafe (4.8 ⭐)', city: 'Lisboa', desc: 'Livres et café.', bookable: false },
        { id: 'l15', title: 'Seedge', category: 'Cannabis store (5.0 ⭐)', city: 'Lisboa', desc: 'Magasin spécialisé.', bookable: false },
        { id: 'l16', title: 'Retro City', category: 'Vintage clothing (4.5 ⭐)', city: 'Lisboa', desc: 'Mode vintage.', bookable: false },
        { id: 'l17', title: 'Monsanto', category: 'Mountain peak (4.7 ⭐)', city: 'Lisboa', desc: 'Poumon vert de Lisbonne.', bookable: false },
        { id: 'l18', title: 'Lara Coffee', category: 'Pastries (4.2 ⭐)', city: 'Lisboa', desc: 'Viennoiseries et café.', bookable: false },
        { id: 'l19', title: 'Castelo de São Jorge', category: 'Castle (4.5 ⭐)', city: 'Lisboa', desc: 'Château historique surplombant la ville.', bookable: true },
        { id: 'l20', title: 'Estufa Fria', category: 'Botanical garden (4.7 ⭐)', city: 'Lisboa', desc: 'Serre avec plantes exotiques.', bookable: true },
        { id: 'l21', title: 'Loja Real', category: 'Clothing store (3.3 ⭐)', city: 'Lisboa', desc: 'Magasin de mode.', bookable: false },
        { id: 'l22', title: 'Miradouro de Santa Luzia', category: 'Scenic spot (4.6 ⭐)', city: 'Lisboa', desc: 'Belvédère romantique.', bookable: false },
        { id: 'l23', title: 'Dearvains', category: 'Thrift store (4.7 ⭐)', city: 'Lisboa', desc: 'Magasin de seconde main.', bookable: false },
        { id: 'l24', title: 'Campo das Cebolas', category: 'Square', city: 'Lisboa', desc: 'Place historique.', bookable: false },
        { id: 'l25', title: 'Feira do Relógio', category: 'Flea market (4.3 ⭐)', city: 'Lisboa', desc: 'Grand marché aux puces.', bookable: false },
        { id: 'l26', title: 'Amor Records', category: 'Record store (4.7 ⭐)', city: 'Lisboa', desc: 'Disquaire.', bookable: false },
        { id: 'l27', title: 'Boubaud Vintage Boutique', category: 'Vintage clothing (4.9 ⭐)', city: 'Lisboa', desc: 'Boutique vintage.', bookable: false },
        { id: 'l28', title: 'Little Chelsea', category: 'Art gallery (4.3 ⭐)', city: 'Lisboa', desc: 'Galerie d’art.', bookable: false },
        { id: 'l29', title: '8 Marvila', category: 'Cultural center (4.6 ⭐)', city: 'Lisboa / Marvila', desc: 'Carrefour événementiel et culturel.', bookable: true },
        { id: 'l30', title: 'Café da Garagem', category: 'Cafe (4.2 ⭐)', city: 'Lisboa', desc: 'Café avec super vue.', bookable: false },
        { id: 'l31', title: 'Terraço Chill-Out Limão', category: 'Bar (4.3 ⭐)', city: 'Lisboa', desc: 'Bar chill-out.', bookable: false },
        { id: 'l32', title: 'My Auchan', category: 'Supermarket (4.0 ⭐)', city: 'Lisboa', desc: 'Supermarché.', bookable: false },
        { id: 'l33', title: 'Jardins do Bombarda', category: 'Park (4.6 ⭐)', city: 'Lisboa', desc: 'Espace jardin.', bookable: false },
        { id: 'l34', title: 'Jardim das Cerejas', category: 'Vegan (4.6 ⭐)', city: 'Lisboa', desc: 'Restaurant végane.', bookable: false },
        { id: 'l35', title: 'Triparte Store & Tattoo', category: 'Clothing & Tattoo (4.6 ⭐)', city: 'Lisboa', desc: 'Boutique et tatouage.', bookable: false },
        { id: 'l36', title: 'Rita Biju', category: 'Jewelry store (2.7 ⭐)', city: 'Lisboa', desc: 'Bijouterie.', bookable: false },
        { id: 'l37', title: 'HUMANA', category: 'Second hand (4.4 ⭐)', city: 'Lisboa', desc: 'Magasin de seconde main.', bookable: false },
        { id: 'l38', title: 'Trumps', category: 'Gay night club (4.2 ⭐)', city: 'Lisboa', desc: 'Club populaire.', bookable: false },
        { id: 'l39', title: 'POSH CLUB LISBON', category: 'Gay night club (4.1 ⭐)', city: 'Lisboa', desc: 'Club.', bookable: false },
        { id: 'l40', title: 'Machimbombo', category: 'Bar (4.3 ⭐)', city: 'Lisboa', desc: 'Bar dans la vieille ville.', bookable: false },
        { id: 'l41', title: 'Side Bar', category: 'Gay bar (4.1 ⭐)', city: 'Lisboa', desc: 'Bar.', bookable: false },
        { id: 'l42', title: 'Drama Bar', category: 'Bar (4.6 ⭐)', city: 'Lisboa', desc: 'Bar branché.', bookable: false },
        { id: 'l43', title: 'Copenhagen Coffee Lab - Baixa', category: 'Coffee shop (4.3 ⭐)', city: 'Lisboa', desc: 'Café scandinave.', bookable: false },
        { id: 'l44', title: 'Green Street', category: 'Tourist attraction (4.2 ⭐)', city: 'Lisboa', desc: 'Rue végétalisée.', bookable: false },
        { id: 'l45', title: 'LX Factory', category: 'Art center (4.5 ⭐)', city: 'Lisboa', desc: 'Pôle créatif dans une ancienne usine.', bookable: true },
        { id: 'l46', title: 'Alfama', category: 'Historic district', city: 'Lisboa', desc: 'Plus vieux quartier de Lisbonne.', bookable: true },
        { id: 'l47', title: 'Fauna & Flora - Anjos', category: 'Restaurant (4.4 ⭐)', city: 'Lisboa', desc: 'Brunch et bowls.', bookable: false },
        { id: 'l48', title: 'Village Underground Lisboa', category: 'Cultural center (4.2 ⭐)', city: 'Lisboa', desc: 'Espace créatif en conteneurs.', bookable: false },
        { id: 'l49', title: 'Delirium Café Lisboa', category: 'Pub (4.5 ⭐)', city: 'Lisboa', desc: 'Bar populaire.', bookable: false },
      ],
    },
    {
      id: 'caparica',
      name: 'Caparica & Setúbal',
      tagline: 'Plages et lieux au sud du Tage',
      lat: 38.5500,
      lng: -9.1800,
      zoom: 11,
      places: [
        { id: 'cp1', title: 'Praia da Fonte da Telha', category: 'Beach (4.5 ⭐)', city: 'Caparica', desc: 'Longue plage de sable.', bookable: false },
        { id: 'cp2', title: 'Cash Converters', category: 'Second hand (3.9 ⭐)', city: 'Charneca de Caparica', desc: 'Achat-vente.', bookable: false },
      ],
    },
    {
      id: 'sintra_cascais',
      name: 'Sintra & Cascais',
      tagline: 'Lieux féériques et côtes atlantiques',
      lat: 38.8029,
      lng: -9.3817,
      zoom: 12,
      places: [
        { id: 'sc1', title: 'Cape Carvoeiro Viewpoint', category: 'Scenic spot (4.6 ⭐)', city: 'Peniche / Sintra Region', desc: 'Belvédère côtier.', bookable: true },
        { id: 'sc2', title: 'Coin Caves', category: 'Tourist attraction (4.6 ⭐)', city: 'Sintra Region', desc: 'Grottes impressionnantes.', bookable: true },
        { id: 'sc3', title: 'Praia da Adraga', category: 'Beach (4.8 ⭐)', city: 'Sintra', desc: 'Côte de falaises spectaculaires.', bookable: false },
        { id: 'sc4', title: 'Carcavelos beach', category: 'Beach (4.4 ⭐)', city: 'Carcavelos', desc: 'Plage de surf populaire.', bookable: true },
      ],
    },
    {
      id: 'algarve_south',
      name: 'Algarve & Sud',
      tagline: 'Falaises dorées et paradis côtiers',
      lat: 37.0194,
      lng: -7.9322,
      zoom: 10,
      places: [
        { id: 'alg1', title: 'Sesimbra', category: 'Coastal town', city: 'Sesimbra', desc: 'Village de pêcheurs pittoresque.', bookable: true },
        { id: 'alg2', title: 'Galapos beach', category: 'Beach (4.7 ⭐)', city: 'Arrábida / Setúbal', desc: 'Eau cristalline dans le parc naturel.', bookable: true },
        { id: 'alg3', title: 'Praia de Paredes da Vitória', category: 'Public beach (4.6 ⭐)', city: 'Leiria Region', desc: 'Grande plage.', bookable: false },
        { id: 'alg4', title: 'Ponta da Piedade', category: 'Scenic spot (4.8 ⭐)', city: 'Lagos (Algarve)', desc: 'Paysage de falaises en Algarve.', bookable: true },
        { id: 'alg5', title: 'Praia do Ribeiro do Cavalo', category: 'Nature preserve (4.7 ⭐)', city: 'Sesimbra', desc: 'Crique sauvage cachée.', bookable: true },
      ],
    },
    {
      id: 'other_regions',
      name: 'Autres régions',
      tagline: 'Loures, Alqueva et autres lieux',
      lat: 38.2000,
      lng: -8.0000,
      zoom: 8,
      places: [
        { id: 'oth1', title: 'Espaço Casa Loures', category: 'Home goods (4.1 ⭐)', city: 'Loures', desc: 'Articles pour la maison.', bookable: false },
        { id: 'oth2', title: 'Observatório Oficial Dark Sky Alqueva', category: 'Observatory (4.7 ⭐)', city: 'Alqueva', desc: 'Observation des étoiles.', bookable: true },
        { id: 'oth3', title: 'Loja CTT', category: 'Post office (3.0 ⭐)', city: 'Portugal', desc: 'Bureau de poste.', bookable: false },
      ],
    },
  ],
  it: [
    {
      id: 'lisboa',
      name: 'Lisbona e dintorni',
      tagline: 'I tuoi luoghi salvati nella capitale',
      lat: 38.7223,
      lng: -9.1393,
      zoom: 12,
      places: [
        { id: 'l1', title: 'Jardim da Estrela', category: 'City park (4.6 ⭐)', city: 'Lisboa', desc: 'Storico parco cittadino con caffè.', bookable: false },
        { id: 'l2', title: 'PUT IT ON LISBON', category: 'Coffee shop (4.9 ⭐)', city: 'Lisboa', desc: 'Accogliente caffetteria.', bookable: false },
        { id: 'l3', title: 'Botanical Garden of Lisbon', category: 'Botanical garden (4.0 ⭐)', city: 'Lisboa', desc: 'Giardino botanico.', bookable: true },
        { id: 'l4', title: 'ROOFTOP - TOPO MARTIM MONIZ', category: 'Cocktail bar (4.3 ⭐)', city: 'Lisboa', desc: 'Bar panoramico all’ultimo piano.', bookable: false },
        { id: 'l5', title: 'Fábrica Braço de Prata', category: 'Cultural center (4.4 ⭐)', city: 'Lisboa', desc: 'Centro culturale e bar.', bookable: true },
        { id: 'l6', title: 'A Capela', category: 'Club (4.4 ⭐)', city: 'Lisboa', desc: 'Piccolo bar club.', bookable: false },
        { id: 'l7', title: 'Jerónimos Monastery', category: 'Monastery (4.4 ⭐)', city: 'Lisboa / Belém', desc: 'Famoso monastero UNESCO.', bookable: true },
        { id: 'l8', title: 'Carmo Archaeological Museum', category: 'Archaeological museum (4.5 ⭐)', city: 'Lisboa', desc: 'Rovina gotica e museo.', bookable: true },
        { id: 'l9', title: 'A Minha Avó', category: 'Vegan restaurant (4.6 ⭐)', city: 'Lisboa', desc: 'Cucina vegana.', bookable: false },
        { id: 'l10', title: 'Cosmos Campolide', category: 'Cultural center (4.6 ⭐)', city: 'Lisboa', desc: 'Centro culturale.', bookable: false },
        { id: 'l11', title: 'Bar Badassery', category: 'Cocktail bar (4.6 ⭐)', city: 'Lisboa', desc: 'Cocktail e drink.', bookable: false },
        { id: 'l12', title: 'River Garden', category: 'Garden (4.7 ⭐)', city: 'Lisboa', desc: 'Bella area giardino.', bookable: false },
        { id: 'l13', title: 'Miradouro da Graça', category: 'Scenic spot (4.7 ⭐)', city: 'Lisboa', desc: 'Punto panoramico popolare con chiosco.', bookable: false },
        { id: 'l14', title: 'Fable Bookshop + Coffee', category: 'Book store / Cafe (4.8 ⭐)', city: 'Lisboa', desc: 'Libri e caffè.', bookable: false },
        { id: 'l15', title: 'Seedge', category: 'Cannabis store (5.0 ⭐)', city: 'Lisboa', desc: 'Negozio specializzato.', bookable: false },
        { id: 'l16', title: 'Retro City', category: 'Vintage clothing (4.5 ⭐)', city: 'Lisboa', desc: 'Moda vintage.', bookable: false },
        { id: 'l17', title: 'Monsanto', category: 'Mountain peak (4.7 ⭐)', city: 'Lisboa', desc: 'Polmone verde di Lisbona.', bookable: false },
        { id: 'l18', title: 'Lara Coffee', category: 'Pastries (4.2 ⭐)', city: 'Lisboa', desc: 'Dolci e caffè.', bookable: false },
        { id: 'l19', title: 'Castelo de São Jorge', category: 'Castle (4.5 ⭐)', city: 'Lisboa', desc: 'Castello storico con vista sulla città.', bookable: true },
        { id: 'l20', title: 'Estufa Fria', category: 'Botanical garden (4.7 ⭐)', city: 'Lisboa', desc: 'Serra con piante esotiche.', bookable: true },
        { id: 'l21', title: 'Loja Real', category: 'Clothing store (3.3 ⭐)', city: 'Lisboa', desc: 'Negozio di abbigliamento.', bookable: false },
        { id: 'l22', title: 'Miradouro de Santa Luzia', category: 'Scenic spot (4.6 ⭐)', city: 'Lisboa', desc: 'Punto panoramico romantico.', bookable: false },
        { id: 'l23', title: 'Dearvains', category: 'Thrift store (4.7 ⭐)', city: 'Lisboa', desc: 'Negozio dell’usato.', bookable: false },
        { id: 'l24', title: 'Campo das Cebolas', category: 'Square', city: 'Lisboa', desc: 'Piazza storica.', bookable: false },
        { id: 'l25', title: 'Feira do Relógio', category: 'Flea market (4.3 ⭐)', city: 'Lisboa', desc: 'Grande mercato delle pulci.', bookable: false },
        { id: 'l26', title: 'Amor Records', category: 'Record store (4.7 ⭐)', city: 'Lisboa', desc: 'Negozio di dischi.', bookable: false },
        { id: 'l27', title: 'Boubaud Vintage Boutique', category: 'Vintage clothing (4.9 ⭐)', city: 'Lisboa', desc: 'Boutique vintage.', bookable: false },
        { id: 'l28', title: 'Little Chelsea', category: 'Art gallery (4.3 ⭐)', city: 'Lisboa', desc: 'Galleria d’arte.', bookable: false },
        { id: 'l29', title: '8 Marvila', category: 'Cultural center (4.6 ⭐)', city: 'Lisboa / Marvila', desc: 'Polo culturale e per eventi.', bookable: true },
        { id: 'l30', title: 'Café da Garagem', category: 'Cafe (4.2 ⭐)', city: 'Lisboa', desc: 'Caffè con splendida vista.', bookable: false },
        { id: 'l31', title: 'Terraço Chill-Out Limão', category: 'Bar (4.3 ⭐)', city: 'Lisboa', desc: 'Bar chill-out.', bookable: false },
        { id: 'l32', title: 'My Auchan', category: 'Supermarket (4.0 ⭐)', city: 'Lisboa', desc: 'Supermercato.', bookable: false },
        { id: 'l33', title: 'Jardins do Bombarda', category: 'Park (4.6 ⭐)', city: 'Lisboa', desc: 'Area giardino.', bookable: false },
        { id: 'l34', title: 'Jardim das Cerejas', category: 'Vegan (4.6 ⭐)', city: 'Lisboa', desc: 'Ristorante vegano.', bookable: false },
        { id: 'l35', title: 'Triparte Store & Tattoo', category: 'Clothing & Tattoo (4.6 ⭐)', city: 'Lisboa', desc: 'Negozio e tatuaggi.', bookable: false },
        { id: 'l36', title: 'Rita Biju', category: 'Jewelry store (2.7 ⭐)', city: 'Lisboa', desc: 'Gioielleria.', bookable: false },
        { id: 'l37', title: 'HUMANA', category: 'Second hand (4.4 ⭐)', city: 'Lisboa', desc: 'Negozio di seconda mano.', bookable: false },
        { id: 'l38', title: 'Trumps', category: 'Gay night club (4.2 ⭐)', city: 'Lisboa', desc: 'Club popolare.', bookable: false },
        { id: 'l39', title: 'POSH CLUB LISBON', category: 'Gay night club (4.1 ⭐)', city: 'Lisboa', desc: 'Club.', bookable: false },
        { id: 'l40', title: 'Machimbombo', category: 'Bar (4.3 ⭐)', city: 'Lisboa', desc: 'Bar nel centro storico.', bookable: false },
        { id: 'l41', title: 'Side Bar', category: 'Gay bar (4.1 ⭐)', city: 'Lisboa', desc: 'Bar.', bookable: false },
        { id: 'l42', title: 'Drama Bar', category: 'Bar (4.6 ⭐)', city: 'Lisboa', desc: 'Bar di tendenza.', bookable: false },
        { id: 'l43', title: 'Copenhagen Coffee Lab - Baixa', category: 'Coffee shop (4.3 ⭐)', city: 'Lisboa', desc: 'Caffè scandinavo.', bookable: false },
        { id: 'l44', title: 'Green Street', category: 'Tourist attraction (4.2 ⭐)', city: 'Lisboa', desc: 'Strada verde.', bookable: false },
        { id: 'l45', title: 'LX Factory', category: 'Art center (4.5 ⭐)', city: 'Lisboa', desc: 'Polo creativo in una vecchia fabbrica.', bookable: true },
        { id: 'l46', title: 'Alfama', category: 'Historic district', city: 'Lisboa', desc: 'Quartiere più antico di Lisbona.', bookable: true },
        { id: 'l47', title: 'Fauna & Flora - Anjos', category: 'Restaurant (4.4 ⭐)', city: 'Lisboa', desc: 'Brunch e ciotole.', bookable: false },
        { id: 'l48', title: 'Village Underground Lisboa', category: 'Cultural center (4.2 ⭐)', city: 'Lisboa', desc: 'Spazio creativo in container.', bookable: false },
        { id: 'l49', title: 'Delirium Café Lisboa', category: 'Pub (4.5 ⭐)', city: 'Lisboa', desc: 'Bar popolare.', bookable: false },
      ],
    },
    {
      id: 'caparica',
      name: 'Caparica & Setúbal',
      tagline: 'Spiagge e luoghi a sud del Tago',
      lat: 38.5500,
      lng: -9.1800,
      zoom: 11,
      places: [
        { id: 'cp1', title: 'Praia da Fonte da Telha', category: 'Beach (4.5 ⭐)', city: 'Caparica', desc: 'Lunga spiaggia sabbiosa.', bookable: false },
        { id: 'cp2', title: 'Cash Converters', category: 'Second hand (3.9 ⭐)', city: 'Charneca de Caparica', desc: 'Compro-vendo.', bookable: false },
      ],
    },
    {
      id: 'sintra_cascais',
      name: 'Sintra & Cascais',
      tagline: 'Luoghi da fiaba e coste atlantiche',
      lat: 38.8029,
      lng: -9.3817,
      zoom: 12,
      places: [
        { id: 'sc1', title: 'Cape Carvoeiro Viewpoint', category: 'Scenic spot (4.6 ⭐)', city: 'Peniche / Sintra Region', desc: 'Punto panoramico costiero.', bookable: true },
        { id: 'sc2', title: 'Coin Caves', category: 'Tourist attraction (4.6 ⭐)', city: 'Sintra Region', desc: 'Grotte impressionanti.', bookable: true },
        { id: 'sc3', title: 'Praia da Adraga', category: 'Beach (4.8 ⭐)', city: 'Sintra', desc: 'Costa di scogliere drammatiche.', bookable: false },
        { id: 'sc4', title: 'Carcavelos beach', category: 'Beach (4.4 ⭐)', city: 'Carcavelos', desc: 'Popolare spiaggia da surf.', bookable: true },
      ],
    },
    {
      id: 'algarve_south',
      name: 'Algarve & Sud',
      tagline: 'Scogliere dorate e paradisi costieri',
      lat: 37.0194,
      lng: -7.9322,
      zoom: 10,
      places: [
        { id: 'alg1', title: 'Sesimbra', category: 'Coastal town', city: 'Sesimbra', desc: 'Pittoresco villaggio di pescatori.', bookable: true },
        { id: 'alg2', title: 'Galapos beach', category: 'Beach (4.7 ⭐)', city: 'Arrábida / Setúbal', desc: 'Acqua cristallina nel parco naturale.', bookable: true },
        { id: 'alg3', title: 'Praia de Paredes da Vitória', category: 'Public beach (4.6 ⭐)', city: 'Leiria Region', desc: 'Ampia spiaggia.', bookable: false },
        { id: 'alg4', title: 'Ponta da Piedade', category: 'Scenic spot (4.8 ⭐)', city: 'Lagos (Algarve)', desc: 'Paesaggio di scogliere in Algarve.', bookable: true },
        { id: 'alg5', title: 'Praia do Ribeiro do Cavalo', category: 'Nature preserve (4.7 ⭐)', city: 'Sesimbra', desc: 'Cala selvaggia nascosta.', bookable: true },
      ],
    },
    {
      id: 'other_regions',
      name: 'Altre regioni',
      tagline: 'Loures, Alqueva e altri luoghi',
      lat: 38.2000,
      lng: -8.0000,
      zoom: 8,
      places: [
        { id: 'oth1', title: 'Espaço Casa Loures', category: 'Home goods (4.1 ⭐)', city: 'Loures', desc: 'Articoli per la casa.', bookable: false },
        { id: 'oth2', title: 'Observatório Oficial Dark Sky Alqueva', category: 'Observatory (4.7 ⭐)', city: 'Alqueva', desc: 'Osservazione delle stelle.', bookable: true },
        { id: 'oth3', title: 'Loja CTT', category: 'Post office (3.0 ⭐)', city: 'Portugal', desc: 'Ufficio postale.', bookable: false },
      ],
    },
  ],
};

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
    snsFinderTitle: '🏥 Centro de Saúde (SNS Finder)',
    snsFinderDesc: 'Finde das zuständige Gesundheitszentrum für deinen Wohnort:',
    openSnsMapBtn: 'Centro de Saúde auf Karte anzeigen ↗',
    italkiBannerTitle: '🗣 Portugiesisch fließend sprechen lernen',
    italkiBannerDesc: 'Finde zertifizierte Muttersprachler für 1-zu-1 Online-Unterricht auf italki.',
    italkiBtn: 'Muttersprachler finden (italki) ↗',
    filterExplore: 'Städte & Orte',
    filterAtm: 'ATMs (Multibanco)',
    filterDoctors: 'Ärzte & Kliniken',
    filterSns: 'Centro de Saúde (SNS)',
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
    congratsTitle: 'Glückwunsch! Roadmap geschafft 🎉',
    congratsDesc: 'Du hast alle wichtigen Schritte für deinen Start in Portugal erledigt.',
    applyOnlineBtn: 'Jetzt online beantragen ↗',
    affiliateDisclosure: 'Transparenz: Über diese Links erhältst du geprüfte Express-Bearbeitung bei e-Residence. Wir erhalten eine kleine Vermittlungsprovision – für dich bleibt der Preis unverändert.',
    affiliateCards: [
      { key: 'nif', title: 'NIF (Portugiesische Steuernummer)', badge: 'Schritt 2 • Pflicht', desc: 'Der Schlüssel für Miete, SIM-Karte, Job und Bankkonto.', link: AFFILIATE_LINKS.eResidenceNif, icon: 'document-text' },
      { key: 'bank', title: 'Portugiesisches Bankkonto', badge: 'Schritt 3 • IBAN', desc: 'Eröffne ein offizielles Bankkonto bei führenden portugiesischen Banken.', link: AFFILIATE_LINKS.eResidenceBank, icon: 'card' },
      { key: 'niss', title: 'NISS (Sozialversicherungsnummer)', badge: 'Schritt 4 • Arbeit', desc: 'Notwendig für Arbeitsvertrag, Gehaltseingang und Rentenbeiträge.', link: AFFILIATE_LINKS.eResidenceNiss, icon: 'shield-checkmark' },
      { key: 'health', title: 'Internationale Krankenversicherung', badge: 'Schritt 5 • Visum & Schutz', desc: 'Visum-konforme Auslandskrankenversicherung vor dem SNS-Zugang.', link: AFFILIATE_LINKS.eResidenceHealth, icon: 'medkit' },
    ],
    euCertServiceCard: {
      title: 'EU-Anmeldebescheinigung (CRUE / SIGA)',
      badge: 'Schritt 1 • Pflicht für EU-Bürger',
      desc: 'Offizieller Termin- und Serviceservice zur Registrierung deines Aufenthalts in Portugal nach 3 Monaten.',
      btnText: 'Offizielles EU-Zertifikat / Termin ↗',
    },
    calcTitle: '💶 Brutto-Netto-Gehaltsrechner',
    calcSub: 'Berechne das Netto (automatische Umrechnung bei 12 oder 14 Monatsgehältern).',
    calcGrossLabel: 'Bruttogehalt (€):',
    calcPaymentsLabel: 'Auszahlungen pro Jahr:',
    calcStatusLabel: 'Steuerklasse / Familienstand:',
    calcNetMonthly: 'Geschätztes Netto (pro Monat):',
    calcGrossRow: 'Brutto / Monat:',
    calcSSRow: 'Sozialversicherung (-11%):',
    calcIRSRow: 'IRS Steuerabzug:',
    calcPayments12: '12 Gehälter',
    calcPayments14: '14 Gehälter',
    calcTaxSingle: 'Single ohne Kinder (Não casado)',
    calcTaxMarried1: 'Verheiratet (1 Verdiener / Único titular)',
    calcTaxMarried2: 'Verheiratet (2 Verdiener / Dois titulares)',
    calcNetNote: (payments) => `Auszahlung auf Basis von ${payments} Gehältern / Jahr`,
    profileTitle: '👤 Expat-Profil & Daten',
    profileSub: 'Deine Daten für Anträge, NIF, NISS und die Ermittlung des zuständigen Centro de Saúde.',
    profileNameLabel: 'Vollständiger Name:',
    profileNamePlaceholder: 'z.B. Max Mustermann',
    profileEmailLabel: 'E-Mail-Adresse:',
    profileEmailPlaceholder: 'z.B. max@email.com',
    profileAddressLabel: 'Zukünftige Adresse in Portugal (für Centro de Saúde):',
    profileAddressPlaceholder: 'z.B. Rua Augusta 123, Lisbon',
    profileNifLabel: 'Steuernummer (NIF - falls schon vorhanden):',
    profileNifPlaceholder: 'z.B. 293847561',
    profileNissLabel: 'Sozialversicherungsnummer (NISS):',
    profileNissPlaceholder: 'z.B. 12345678901',
    profileSalaryLabel: 'Geplantes Monatsgehalt (€):',
    profileStatusLabel: 'Familienstand (für Steuerberechnung):',
    profileSaveBtn: 'Daten speichern & Weiter',
    subCatAll: 'Alle',
    subCatCafe: 'Cafés & Food',
    subCatBar: 'Bars & Nightlife',
    subCatCulture: 'Kultur & Museen',
    subCatNature: 'Natur & Parks',
    subCatShopping: 'Shopping',
    subCatBeach: 'Strände',
    tutorialSteps: [
      { title: 'Willkommen bei PortuStart! 🇵🇹', desc: 'Dein ultimativer Begleiter für einen reibungslosen Umzug. Schau auf die Menüleiste unten 👇 – wir führen dich jetzt durch alle Tabs!' },
      { title: '1. Services & Roadmap 📋 (Tab aktiv)', desc: 'Schau nach oben ⬆️: Hier siehst du die 30-Tage-Checkliste und offizielle Services (EU-Zertifikat als Schritt 1, NIF, Bank, NISS, Krankenversicherung).' },
      { title: '2. EU-Anmeldebescheinigung (Schritt 1) 🏛️', desc: 'Das offizielle EU-Zertifikat ist der allererste offizielle Schritt für EU-Bürger nach Ankunft in Portugal.' },
      { title: '3. NIF (Steuernummer) 📄', desc: 'Pflicht-Schritt 2! Du benötigst die NIF für absolut alles: Miete, Handytarif, Arbeit und Bankkonto.' },
      { title: '4. Bankkonto & NISS 💳🛡️', desc: 'Schritte 3 & 4: Eröffne dein Bankkonto und erhalte deine Sozialversicherungsnummer für den Arbeitsvertrag.' },
      { title: '5. Karten & Orte 🗺️ (Tab wechselt)', desc: 'Klicke auf den Tab "Karten" 👈 in der unteren Leiste. Hier findest du kuratierte Orte und den Centro de Saúde Finder.' },
      { title: '6. Unterkategorien filtern 🏷️', desc: 'Nutze die Filter oben in den Karten (Cafés, Bars, Kultur, Natur, Shopping, Strände), um gezielt Orte zu finden.' },
      { title: '7. Übersetzer 🗣️ (Tab wechselt)', desc: 'Wechsle zum Tab "Übersetzer" 👈 unten. Perfekt für den Alltag mit Spracherkennung (STT) und Sprachausgabe (TTS).' },
      { title: '8. Gehaltsrechner 💶 (Tab wechselt)', desc: 'Wechsle zum Tab "Gehalt" 👈 unten. Berechne präzise dein Netto in Portugal bei 12 oder 14 Monatsgehältern.' },
      { title: '9. Bereit für den Start! 🚀', desc: 'Du kannst dieses interaktive Tutorial jederzeit über das Fragezeichen-Symbol oben rechts ↗️ wieder aufrufen. Viel Erfolg!' }
    ],
    tutorialNext: 'Weiter ➡️',
    tutorialPrev: '⬅️ Zurück',
    tutorialFinish: 'App erkunden! 🎉',
    checklist: [
      { id: 1, title: 'Steuernummer (NIF) beantragen', tip: 'Der Schlüssel für Miete, Handyvertrag, Arbeit und Bankkonto.' },
      { id: 2, title: 'Portugiesische SIM-Karte besorgen', tip: 'Notwendig für Chave Móvel Digital und Behörden-SMS.' },
      { id: 3, title: 'Bankkonto eröffnen', tip: 'Erforderlich für Gehaltseingang und Wohnungskaution.' },
      { id: 4, title: 'Krankenversicherung abschließen', tip: 'Notwendig für Visum und Übergangszeit bis zur SNS-Nummer.' },
      { id: 5, title: 'Sozialversicherungsnummer (NISS)', tip: 'Wird für Arbeitsvertrag und Rentenanspruch benötigt.' },
      { id: 6, title: 'EU-Anmeldebescheinigung (CRUE)', tip: 'Offizielles Aufenthaltszertifikat für EU-Bürger nach 3 Monaten beantragen.' },
      { id: 7, title: 'SNS-Gesundheitsnummer (Centro de Saúde)', tip: 'Zugang zum staatlichen Gesundheitssystem & Hausarzt.' },
    ],
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
    snsFinderTitle: '🏥 Centro de Saúde (SNS Finder)',
    snsFinderDesc: 'Find the responsible health center for your location:',
    openSnsMapBtn: 'View Centro de Saúde on Map ↗',
    italkiBannerTitle: '🗣 Learn to speak fluent Portuguese',
    italkiBannerDesc: 'Find certified native tutors for 1-on-1 online lessons on italki.',
    italkiBtn: 'Find Native Tutors (italki) ↗',
    filterExplore: 'Cities & Places',
    filterAtm: 'ATMs (Multibanco)',
    filterDoctors: 'Doctors & Clinics',
    filterSns: 'Centro de Saúde (SNS)',
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
    congratsTitle: 'Congratulations! Roadmap completed 🎉',
    congratsDesc: 'You have completed all important steps for your start in Portugal.',
    applyOnlineBtn: 'Apply online now ↗',
    affiliateDisclosure: 'Transparency notice: These links route to certified express processing with e-Residence. We receive a small referral commission at no additional cost to you.',
    affiliateCards: [
      { key: 'nif', title: 'NIF (Portuguese Tax Number)', badge: 'Step 2 • Mandatory', desc: 'The key for rent, SIM card, job and bank account.', link: AFFILIATE_LINKS.eResidenceNif, icon: 'document-text' },
      { key: 'bank', title: 'Portuguese Bank Account', badge: 'Step 3 • IBAN', desc: 'Open an official bank account with leading Portuguese banks.', link: AFFILIATE_LINKS.eResidenceBank, icon: 'card' },
      { key: 'niss', title: 'NISS (Social Security Number)', badge: 'Step 4 • Work', desc: 'Required for employment contract, salary and pension contributions.', link: AFFILIATE_LINKS.eResidenceNiss, icon: 'shield-checkmark' },
      { key: 'health', title: 'International Health Insurance', badge: 'Step 5 • Visa & Protection', desc: 'Visa-compliant health insurance prior to SNS access.', link: AFFILIATE_LINKS.eResidenceHealth, icon: 'medkit' },
    ],
    euCertServiceCard: {
      title: 'EU Registration Certificate (CRUE / SIGA)',
      badge: 'Step 1 • Mandatory for EU Citizens',
      desc: 'Official appointment and service to register your residence in Portugal after 3 months.',
      btnText: 'Official EU Certificate / Appointment ↗',
    },
    calcTitle: '💶 Salary Calculator',
    calcSub: 'Precise calculation based on payments and tax status.',
    calcGrossLabel: 'Gross Salary (€):',
    calcPaymentsLabel: 'Payments per year:',
    calcStatusLabel: 'Tax status / Marital status:',
    calcNetMonthly: 'Estimated Net (Monthly):',
    calcGrossRow: 'Monthly Gross:',
    calcSSRow: 'Social Security (-11%):',
    calcIRSRow: 'IRS Withholding:',
    calcPayments12: '12 payments',
    calcPayments14: '14 payments',
    calcTaxSingle: 'Single without children (Não casado)',
    calcTaxMarried1: 'Married (1 earner / Único titular)',
    calcTaxMarried2: 'Married (2 earners / Dois titulares)',
    calcNetNote: (payments) => `Payout based on ${payments} payments / year`,
    profileTitle: '👤 Expat Profile & Data',
    profileSub: 'Your details for applications, NIF, NISS and finding the responsible Centro de Saúde.',
    profileNameLabel: 'Full Name:',
    profileNamePlaceholder: 'e.g. John Doe',
    profileEmailLabel: 'Email Address:',
    profileEmailPlaceholder: 'e.g. john@email.com',
    profileAddressLabel: 'Future Address in Portugal (for Centro de Saúde):',
    profileAddressPlaceholder: 'e.g. Rua Augusta 123, Lisbon',
    profileNifLabel: 'Tax Number (NIF - if already available):',
    profileNifPlaceholder: 'e.g. 293847561',
    profileNissLabel: 'Social Security Number (NISS):',
    profileNissPlaceholder: 'e.g. 12345678901',
    profileSalaryLabel: 'Planned Monthly Salary (€):',
    profileStatusLabel: 'Marital status (for tax calculation):',
    profileSaveBtn: 'Save data & Continue',
    subCatAll: 'All',
    subCatCafe: 'Cafes & Food',
    subCatBar: 'Bars & Nightlife',
    subCatCulture: 'Culture & Museums',
    subCatNature: 'Nature & Parks',
    subCatShopping: 'Shopping',
    subCatBeach: 'Beaches',
    tutorialSteps: [
      { title: 'Welcome to PortuStart! 🇵🇹', desc: 'Your ultimate companion for moving to Portugal. Look at the bottom menu bar 👇 – we will guide you through all tabs!' },
      { title: '1. Services & Roadmap 📋 (Active Tab)', desc: 'Look above ⬆️: Here you find your 30-day checklist and official services (EU Certificate as Step 1, NIF, Bank, NISS, Health Insurance).' },
      { title: '2. EU Registration Certificate (Step 1) 🏛️', desc: 'The official EU certificate is the very first mandatory official step for EU citizens after arriving in Portugal.' },
      { title: '3. NIF (Tax Number) 📄', desc: 'Mandatory Step 2! You need the NIF for everything: rent, mobile plan, job.' },
      { title: '4. Bank Account & NISS 💳🛡️', desc: 'Steps 3 & 4: Open your bank account and get your social security number for employment.' },
      { title: '5. Maps & Places 🗺️ (Tab switches)', desc: 'Click the "Maps" tab 👈 in the bottom bar. Here you will find curated places and the Centro de Saúde finder.' },
      { title: '6. Filter Subcategories 🏷️', desc: 'Use the filters at the top of the maps (Cafes, Bars, Culture, Nature, Shopping, Beaches) to find specific locations.' },
      { title: '7. Translator 🗣️ (Tab switches)', desc: 'Switch to the "Translator" tab 👈 below. Perfect for everyday life with speech recognition (STT) and text-to-speech (TTS).' },
      { title: '8. Salary Calculator 💶 (Tab switches)', desc: 'Switch to the "Salary" tab 👈 below. Accurately calculate your net income in Portugal with 12 or 14 payments.' },
      { title: '9. Ready for Takeoff! 🚀', desc: 'You can reopen this interactive tutorial anytime using the question mark icon in the header ↗️. Good luck!' }
    ],
    tutorialNext: 'Next ➡️',
    tutorialPrev: '⬅️ Back',
    tutorialFinish: 'Explore App! 🎉',
    checklist: [
      { id: 1, title: 'Get your Tax Number (NIF)', tip: 'The master key for rent, SIM card, employment and utilities.' },
      { id: 2, title: 'Get a local Portuguese SIM card', tip: 'Essential for digital government authentication (Chave Móvel).' },
      { id: 3, title: 'Open a Portuguese Bank Account', tip: 'Required for salary payouts and rental deposits.' },
      { id: 4, title: 'Get Expat Health Insurance', tip: 'Essential for visa processing and pre-SNS medical care.' },
      { id: 5, title: 'Get Social Security Number (NISS)', tip: 'Mandatory for payroll, pension and healthcare contributions.' },
      { id: 6, title: 'EU Registration Certificate (CRUE)', tip: 'Official residence certificate for EU citizens after 3 months.' },
      { id: 7, title: 'Get your SNS Healthcare Number', tip: 'Grants access to public primary care clinics (Centro de Saúde).' },
    ],
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
    snsFinderTitle: '🏥 Centro de Saúde (Buscador SNS)',
    snsFinderDesc: 'Encuentra el centro de salud responsable para tu ubicación:',
    openSnsMapBtn: 'Ver Centro de Saúde en el mapa ↗',
    italkiBannerTitle: '🗣 Aprende a hablar portugués con fluidez',
    italkiBannerDesc: 'Encuentra profesores nativos certificados para clases particulares en italki.',
    italkiBtn: 'Buscar profesores nativos (italki) ↗',
    filterExplore: 'Ciudades y Lugares',
    filterAtm: 'Cajeros (Multibanco)',
    filterDoctors: 'Médicos y Clínicas',
    filterSns: 'Centro de Saúde (SNS)',
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
    congratsTitle: '¡Felicitaciones! Hoja de ruta completada 🎉',
    congratsDesc: 'Has completado todos los pasos importantes para tu inicio en Portugal.',
    applyOnlineBtn: 'Solicitar online ahora ↗',
    affiliateDisclosure: 'Transparencia: Estos enlaces dirigen a un procesamiento exprés certificado con e-Residence. Recibimos una pequeña comisión sin coste adicional para ti.',
    affiliateCards: [
      { key: 'nif', title: 'NIF (Número de Identificación Fiscal)', badge: 'Paso 2 • Obligatorio', desc: 'La clave para alquiler, tarjeta SIM, trabajo y cuenta bancaria.', link: AFFILIATE_LINKS.eResidenceNif, icon: 'document-text' },
      { key: 'bank', title: 'Cuenta bancaria portuguesa', badge: 'Paso 3 • IBAN', desc: 'Abre una cuenta bancaria oficial en los principales bancos.', link: AFFILIATE_LINKS.eResidenceBank, icon: 'card' },
      { key: 'niss', title: 'NISS (Número de Seguridad Social)', badge: 'Paso 4 • Trabajo', desc: 'Necesario para contrato laboral, salario y cotizaciones.', link: AFFILIATE_LINKS.eResidenceNiss, icon: 'shield-checkmark' },
      { key: 'health', title: 'Seguro médico internacional', badge: 'Paso 5 • Visado y protección', desc: 'Seguro médico compatible con visado antes del acceso al SNS.', link: AFFILIATE_LINKS.eResidenceHealth, icon: 'medkit' },
    ],
    euCertServiceCard: {
      title: 'Certificado de Registro UE (CRUE / SIGA)',
      badge: 'Paso 1 • Obligatorio para ciudadanos UE',
      desc: 'Cita y servicio oficial para registrar tu residencia en Portugal después de 3 meses.',
      btnText: 'Certificado UE Oficial / Cita ↗',
    },
    calcTitle: '💶 Calculadora de salario',
    calcSub: 'Cálculo estimado según deducciones en Portugal.',
    calcGrossLabel: 'Salario bruto (€):',
    calcPaymentsLabel: 'Pagos al año:',
    calcStatusLabel: 'Estado fiscal / Situación familiar:',
    calcNetMonthly: 'Neto estimado (mensual):',
    calcGrossRow: 'Bruto mensual:',
    calcSSRow: 'Seguridad Social (-11%):',
    calcIRSRow: 'Retención IRS:',
    calcPayments12: '12 pagas',
    calcPayments14: '14 pagas',
    calcTaxSingle: 'Soltero sin hijos (Não casado)',
    calcTaxMarried1: 'Casado (1 sueldo / Único titular)',
    calcTaxMarried2: 'Casado (2 sueldos / Dois titulares)',
    calcNetNote: (payments) => `Pago basado en ${payments} pagas / año`,
    profileTitle: '👤 Perfil de Expat y Datos',
    profileSub: 'Tus datos para solicitudes, NIF, NISS y la búsqueda del Centro de Saúde responsable.',
    profileNameLabel: 'Nombre completo:',
    profileNamePlaceholder: 'ej. Juan Pérez',
    profileEmailLabel: 'Correo electrónico:',
    profileEmailPlaceholder: 'ej. juan@email.com',
    profileAddressLabel: 'Futura dirección en Portugal (para Centro de Saúde):',
    profileAddressPlaceholder: 'ej. Rua Augusta 123, Lisboa',
    profileNifLabel: 'Número fiscal (NIF - si ya lo tienes):',
    profileNifPlaceholder: 'ej. 293847561',
    profileNissLabel: 'Número de Seguridad Social (NISS):',
    profileNissPlaceholder: 'ej. 12345678901',
    profileSalaryLabel: 'Salario mensual previsto (€):',
    profileStatusLabel: 'Estado civil (para cálculo de impuestos):',
    profileSaveBtn: 'Guardar datos y continuar',
    subCatAll: 'Todos',
    subCatCafe: 'Cafés y Comida',
    subCatBar: 'Bares y Noche',
    subCatCulture: 'Cultura y Museos',
    subCatNature: 'Naturaleza y Parques',
    subCatShopping: 'Compras',
    subCatBeach: 'Playas',
    tutorialSteps: [
      { title: '¡Bienvenido a PortuStart! 🇵🇹', desc: 'Tu compañero para mudarte. Mira la barra de menú inferior 👇: ¡te guiaremos por todas las pestañas!' },
      { title: '1. Servicios y Hoja de Ruta 📋 (Pestaña activa)', desc: 'Mira arriba ⬆️: Aquí tienes tu lista de verificación y servicios oficiales (Certificado UE como Paso 1, NIF, Banco, NISS, Seguro).' },
      { title: '2. Certificado de Registro UE (Paso 1) 🏛️', desc: 'El certificado oficial de la UE es el primer trámite obligatorio para ciudadanos de la UE tras llegar a Portugal.' },
      { title: '3. NIF (Número Fiscal) 📄', desc: '¡Paso 2 obligatorio! Necesitas el NIF para todo: alquiler, móvil, trabajo.' },
      { title: '4. Cuenta Bancaria y NISS 💳🛡️', desc: 'Pasos 3 y 4: Abre tu cuenta bancaria y obtén tu número de seguridad social.' },
      { title: '5. Mapas y Lugares 🗺️ (Cambio de pestaña)', desc: 'Haz clic en la pestaña "Mapas" 👈 abajo. Aquí verás lugares seleccionados y el buscador de Centro de Saúde.' },
      { title: '6. Filtrar Subcategorías 🏷️', desc: 'Usa los filtros superiores (Cafés, Bares, Cultura, Naturaleza, Compras, Playas).' },
      { title: '7. Traductor 🗣️ (Cambio de pestaña)', desc: 'Cambia a "Traductor" 👈 abajo. Ideal para el día a día con voz (STT y TTS).' },
      { title: '8. Calculadora de Salario 💶 (Cambio de pestaña)', desc: 'Cambia a "Salario" 👈 abajo. Calcula con precisión tu neto en Portugal.' },
      { title: '9. ¡Listo! 🚀', desc: 'Puedes reabrir este tutorial interactivo usando el icono de interrogación arriba ↗️. ¡Mucho éxito!' }
    ],
    tutorialNext: 'Siguiente ➡️',
    tutorialPrev: '⬅️ Anterior',
    tutorialFinish: '¡Explorar App! 🎉',
    checklist: [
      { id: 1, title: 'Solicitar número fiscal (NIF)', tip: 'La clave para alquileres, SIM, trabajo y suministros.' },
      { id: 2, title: 'Conseguir tarjeta SIM portuguesa', tip: 'Esencial para autenticación digital (Chave Móvel).' },
      { id: 3, title: 'Abrir cuenta bancaria portuguesa', tip: 'Requerida para cobrar el salario y depósitos de alquiler.' },
      { id: 4, title: 'Contratar seguro médico de expatriado', tip: 'Esencial para el visado y atención previa al SNS.' },
      { id: 5, title: 'Obtener número de Seguridad Social (NISS)', tip: 'Obligatorio para contratos y pensiones.' },
      { id: 6, title: 'Certificado de Registro UE (CRUE)', tip: 'Certificado de residencia oficial para ciudadanos de la UE.' },
      { id: 7, title: 'Obtener número de sanidad SNS', tip: 'Acceso al centros de salud públicos y médico de cabecera.' },
    ],
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
    snsFinderTitle: '🏥 Centro de Saúde (Recherche SNS)',
    snsFinderDesc: 'Trouvez le centre de santé responsable pour votre lieu :',
    openSnsMapBtn: 'Voir le Centro de Saúde sur la carte ↗',
    italkiBannerTitle: '🗣 Apprenez à parler couramment le portugais',
    italkiBannerDesc: 'Trouvez des tuteurs natifs certifiés pour des cours particuliers sur italki.',
    italkiBtn: 'Trouver des tuteurs natifs (italki) ↗',
    filterExplore: 'Villes & Lieux',
    filterAtm: 'DAB (Multibanco)',
    filterDoctors: 'Médecins & Cliniques',
    filterSns: 'Centro de Saúde (SNS)',
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
    congratsTitle: 'Félicitations ! Feuille de route terminée 🎉',
    congratsDesc: 'Vous avez complété toutes les étapes importantes pour votre départ au Portugal.',
    applyOnlineBtn: 'Demander en ligne ↗',
    affiliateDisclosure: 'Transparence : Ces liens redirigent vers un traitement express certifié avec e-Residence. Nous recevons une petite commission sans coût supplémentaire pour vous.',
    affiliateCards: [
      { key: 'nif', title: 'NIF (Numéro fiscal portugais)', badge: 'Étape 2 • Obligatoire', desc: 'La clé pour le loyer, la carte SIM, l’emploi et le compte bancaire.', link: AFFILIATE_LINKS.eResidenceNif, icon: 'document-text' },
      { key: 'bank', title: 'Compte bancaire portugais', badge: 'Étape 3 • IBAN', desc: 'Ouvrez un compte bancaire officiel auprès des principales banques.', link: AFFILIATE_LINKS.eResidenceBank, icon: 'card' },
      { key: 'niss', title: 'NISS (Numéro de Sécurité Sociale)', badge: 'Étape 4 • Travail', desc: 'Nécessaire pour le contrat de travail, le salaire et les cotisations.', link: AFFILIATE_LINKS.eResidenceNiss, icon: 'shield-checkmark' },
      { key: 'health', title: 'Assurance santé internationale', badge: 'Étape 5 • Visa & Protection', desc: 'Assurance maladie conforme aux exigences de visa avant l’accès au SNS.', link: AFFILIATE_LINKS.eResidenceHealth, icon: 'medkit' },
    ],
    euCertServiceCard: {
      title: 'Certificat d’enregistrement UE (CRUE / SIGA)',
      badge: 'Étape 1 • Obligatoire pour citoyens UE',
      desc: 'Rendez-vous et service officiel pour enregistrer votre séjour au Portugal après 3 mois.',
      btnText: 'Certificat UE Officiel / Rendez-vous ↗',
    },
    calcTitle: '💶 Calculateur de salaire',
    calcSub: 'Calcul estimé basé sur les déductions standard au Portugal.',
    calcGrossLabel: 'Salaire brut (€) :',
    calcPaymentsLabel: 'Versements par an :',
    calcStatusLabel: 'Statut fiscal / Situation familiale :',
    calcNetMonthly: 'Net estimé (par mois) :',
    calcGrossRow: 'Brut mensuel :',
    calcSSRow: 'Sécurité Sociale (-11%) :',
    calcIRSRow: 'Retenue IRS :',
    calcPayments12: '12 versements',
    calcPayments14: '14 versements',
    calcTaxSingle: 'Célibataire sans enfants (Não casado)',
    calcTaxMarried1: 'Marié (1 salaire / Único titular)',
    calcTaxMarried2: 'Marié (2 salaires / Dois titulares)',
    calcNetNote: (payments) => `Versement basé sur ${payments} versements / an`,
    profileTitle: '👤 Profil Expatrié & Données',
    profileSub: 'Vos données pour les demandes, NIF, NISS et la détermination du Centro de Saúde.',
    profileNameLabel: 'Nom complet :',
    profileNamePlaceholder: 'ex. Jean Dupont',
    profileEmailLabel: 'Adresse e-mail :',
    profileEmailPlaceholder: 'ex. jean@email.com',
    profileAddressLabel: 'Future adresse au Portugal (pour Centro de Saúde) :',
    profileAddressPlaceholder: 'ex. Rua Augusta 123, Lisbonne',
    profileNifLabel: 'Numéro fiscal (NIF - si déjà possédé) :',
    profileNifPlaceholder: 'ex. 293847561',
    profileNissLabel: 'Numéro de Sécurité Sociale (NISS) :',
    profileNissPlaceholder: 'ex. 12345678901',
    profileSalaryLabel: 'Salaire mensuel prévu (€) :',
    profileStatusLabel: 'Situation familiale (pour le calcul des impôts) :',
    profileSaveBtn: 'Enregistrer & Continuer',
    subCatAll: 'Tous',
    subCatCafe: 'Cafés & Nourriture',
    subCatBar: 'Bars & Nuit',
    subCatCulture: 'Culture & Musées',
    subCatNature: 'Nature & Parcs',
    subCatShopping: 'Shopping',
    subCatBeach: 'Plages',
    tutorialSteps: [
      { title: 'Bienvenue sur PortuStart ! 🇵🇹', desc: 'Votre compagnon pour déménager. Regardez la barre de menu en bas 👇 : nous vous guidons à travers tous les onglets !' },
      { title: '1. Services & Roadmap 📋 (Onglet actif)', desc: 'Regardez en haut ⬆️ : Retrouvez votre checklist et les services officiels (Certificat UE comme Étape 1, NIF, Banque, NISS, Assurance).' },
      { title: '2. Certificat d’enregistrement UE (Étape 1) 🏛️', desc: 'Le certificat officiel de l’UE est la toute première démarche obligatoire pour les citoyens de l’UE après leur arrivée.' },
      { title: '3. NIF (Numéro fiscal) 📄', desc: 'Étape 2 obligatoire ! Le NIF est indispensable pour tout : loyer, mobile, travail.' },
      { title: '4. Compte bancaire & NISS 💳🛡️', desc: 'Étapes 3 & 4 : Ouvrez votre compte bancaire et obtenez votre numéro de sécurité sociale.' },
      { title: '5. Cartes & Lieux 🗺️ (Changement d’onglet)', desc: 'Cliquez sur l’onglet "Cartes" 👈 en bas. Découvrez les lieux et le chercheur de Centro de Saúde.' },
      { title: '6. Filtrer les sous-catégories 🏷️', desc: 'Utilisez les filtres en haut des cartes (Cafés, Bars, Culture, Nature, Shopping, Plages).' },
      { title: '7. Traducteur 🗣️ (Changement d’onglet)', desc: 'Passez à "Traducteur" 👈 en bas. Idéal pour le quotidien avec la voix (STT et TTS).' },
      { title: '8. Calculateur de salaire 💶 (Changement d’onglet)', desc: 'Passez à "Salaire" 👈 en bas. Calculez précisément votre net au Portugal.' },
      { title: '9. Prêt ! 🚀', desc: 'Vous pouvez rouvrir ce tutoriel interactif à tout moment via l’icône de point d’interrogation en haut ↗️.' }
    ],
    tutorialNext: 'Suivant ➡️',
    tutorialPrev: '⬅️ Retour',
    tutorialFinish: 'Explorer l’app ! 🎉',
    checklist: [
      { id: 1, title: 'Obtenir votre numéro fiscal (NIF)', tip: 'La clé pour le loyer, la carte SIM, l’emploi et les services.' },
      { id: 2, title: 'Obtenir une carte SIM portugaise', tip: 'Essentiel pour l’authentification numérique (Chave Móvel).' },
      { id: 3, title: 'Ouvrir un compte bancaire portugais', tip: 'Requis pour le versement du salaire et la caution.' },
      { id: 4, title: 'Souscrire une assurance santé ex-pat', tip: 'Essentiel pour le visa et la période avant le SNS.' },
      { id: 5, title: 'Obtenir le numéro de Sécurité Sociale (NISS)', tip: 'Obligatoire pour la paie et les cotisations retraite.' },
      { id: 6, title: 'Certificat d’enregistrement UE (CRUE)', tip: 'Certificat de résidence officiel pour les citoyens de l’UE.' },
      { id: 7, title: 'Obtenir votre numéro de santé SNS', tip: 'Accès aux centres de santé publics et médecin traitant.' },
    ],
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
    snsFinderTitle: '🏥 Centro de Saúde (Cerca SNS)',
    snsFinderDesc: 'Trova il centro sanitario competente per la tua posizione:',
    openSnsMapBtn: 'Visualizza Centro de Saúde sulla mappa ↗',
    italkiBannerTitle: '🗣 Impara a parlare portogruese fluentemente',
    italkiBannerDesc: 'Trova insegnanti madrelingua certificati per lezioni individuali su italki.',
    italkiBtn: 'Trova insegnanti madrelingua (italki) ↗',
    filterExplore: 'Città e Luoghi',
    filterAtm: 'ATM (Multibanco)',
    filterDoctors: 'Medici e Cliniche',
    filterSns: 'Centro de Saúde (SNS)',
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
    congratsTitle: 'Congratulazioni! Roadmap completata 🎉',
    congratsDesc: 'Hai completato tutti i passaggi importanti per iniziare la tua vita in Portogallo.',
    applyOnlineBtn: 'Richiedi online ora ↗',
    affiliateDisclosure: 'Trasparenza: Questi link reindirizzano a un’elaborazione express certificata con e-Residence. Riceviamo una piccola commissione senza costi aggiuntivi per te.',
    affiliateCards: [
      { key: 'nif', title: 'NIF (Codice Fiscale portoghese)', badge: 'Passo 2 • Obbligatorio', desc: 'La chiave per affitto, SIM, lavoro e conto bancario.', link: AFFILIATE_LINKS.eResidenceNif, icon: 'document-text' },
      { key: 'bank', title: 'Conto bancario portoghese', badge: 'Passo 3 • IBAN', desc: 'Apri un conto bancario ufficiale presso le principali banche.', link: AFFILIATE_LINKS.eResidenceBank, icon: 'card' },
      { key: 'niss', title: 'NISS (Numero di Previdenza Sociale)', badge: 'Passo 4 • Lavoro', desc: 'Necessario per contratto di lavoro, stipendio e contributi.', link: AFFILIATE_LINKS.eResidenceNiss, icon: 'shield-checkmark' },
      { key: 'health', title: 'Assicurazione sanitaria internazionale', badge: 'Passo 5 • Visto e protezione', desc: 'Assicurazione conforme al visto prima dell’accesso al SNS.', link: AFFILIATE_LINKS.eResidenceHealth, icon: 'medkit' },
    ],
    euCertServiceCard: {
      title: 'Certificato di Registrazione UE (CRUE / SIGA)',
      badge: 'Passo 1 • Obbligatorio per cittadini UE',
      desc: 'Appuntamento e servizio ufficiale per registrare la tua residenza in Portogallo dopo 3 mesi.',
      btnText: 'Certificato UE Ufficiale / Appuntamento ↗',
    },
    calcTitle: '💶 Calcolatore stipendio',
    calcSub: 'Calcolo stimato basato sulle trattenute in Portogallo.',
    calcGrossLabel: 'Stipendio lordo (€):',
    calcPaymentsLabel: 'Mensilità all’anno:',
    calcStatusLabel: 'Regime fiscale / Stato civile:',
    calcNetMonthly: 'Netto stimato (mensile):',
    calcGrossRow: 'Lordo mensile:',
    calcSSRow: 'Previdenza Sociale (-11%):',
    calcIRSRow: 'Trattenuta IRS:',
    calcPayments12: '12 mensilità',
    calcPayments14: '14 mensilità',
    calcTaxSingle: 'Single senza figli (Não casado)',
    calcTaxMarried1: 'Coniugato (1 stipendio / Único titular)',
    calcTaxMarried2: 'Coniugato (2 stipendi / Dois titulares)',
    calcNetNote: (payments) => `Accredito basato su ${payments} mensilità / anno`,
    profileTitle: '👤 Profilo Expat & Dati',
    profileSub: 'I tuoi dati per pratiche, NIF, NISS e per trovare il Centro de Saúde competente.',
    profileNameLabel: 'Nome completo:',
    profileNamePlaceholder: 'es. Mario Rossi',
    profileEmailLabel: 'Indirizzo e-mail:',
    profileEmailPlaceholder: 'es. mario@email.com',
    profileAddressLabel: 'Futuro indirizzo in Portogallo (per il Centro de Saúde):',
    profileAddressPlaceholder: 'es. Rua Augusta 123, Lisbona',
    profileNifLabel: 'Codice Fiscale (NIF - se già posseduto):',
    profileNifPlaceholder: 'es. 293847561',
    profileNissLabel: 'Numero di Previdenza Sociale (NISS):',
    profileNissPlaceholder: 'es. 12345678901',
    profileSalaryLabel: 'Stipendio mensile previsto (€):',
    profileStatusLabel: 'Stato civile (per calcolo tasse):',
    profileSaveBtn: 'Salva dati e Continua',
    subCatAll: 'Tutti',
    subCatCafe: 'Caffè e Cibo',
    subCatBar: 'Bar e Notte',
    subCatCulture: 'Cultura e Musei',
    subCatNature: 'Natura e Parchi',
    subCatShopping: 'Shopping',
    subCatBeach: 'Spiagge',
    tutorialSteps: [
      { title: 'Benvenuto su PortuStart! 🇵🇹', desc: 'Il tuo compagno per il trasferimento. Guarda la barra dei menu in basso 👇: ti guideremo attraverso tutte le schede!' },
      { title: '1. Servizi & Roadmap 📋 (Scheda attiva)', desc: 'Guarda in alto ⬆️: Qui trovi la checklist di 30 giorni e i servizi ufficiali (Certificato UE come Passo 1, NIF, Banca, NISS, Assicurazione).' },
      { title: '2. Certificato di Registrazione UE (Passo 1) 🏛️', desc: 'Il certificato ufficiale dell’UE è il primissimo passo obbligatorio per i cittadini UE dopo l’arrivo in Portogallo.' },
      { title: '3. NIF (Codice Fiscale) 📄', desc: 'Passo 2 obbligatorio! Il NIF serve per tutto: affitto, SIM, lavoro.' },
      { title: '4. Conto Bancario e NISS 💳🛡️', desc: 'Passi 3 & 4: Apri il tuo conto bancario e ottieni il numero di previdenza sociale.' },
      { title: '5. Mappe & Luoghi 🗺️ (Cambio scheda)', desc: 'Clicca sulla scheda "Mappe" 👈 in basso. Qui trovi luoghi selezionati e il Centro de Saúde.' },
      { title: '6. Filtra Sottocategorie 🏷️', desc: 'Usa i filtri in alto nelle mappe (Caffè, Bar, Cultura, Natura, Shopping, Spiagge).' },
      { title: '7. Traduttore 🗣️ (Cambio scheda)', desc: 'Passa a "Traduttore" 👈 in basso. Ideale per la vita di tutti i giorni con riconoscimento vocale.' },
      { title: '8. Calcolatore Stipendio 💶 (Cambio scheda)', desc: 'Passa a "Stipendio" 👈 in basso. Calcola con precisione il tuo netto in Portogallo.' },
      { title: '9. Pronto! 🚀', desc: 'Puoi riaprire questo tutorial interattivo in qualsiasi momento dall’icona del punto interrogativo in alto ↗️.' }
    ],
    tutorialNext: 'Avanti ➡️',
    tutorialPrev: '⬅️ Indietro',
    tutorialFinish: 'Esplora App! 🎉',
    checklist: [
      { id: 1, title: 'Ottieni il codice fiscale (NIF)', tip: 'La chiave per affitto, SIM, lavoro e utenze.' },
      { id: 2, title: 'Procura una scheda SIM portoghese', tip: 'Essenziale per l’autenticazione digitale (Chave Móvel).' },
      { id: 3, title: 'Apri un conto bancario portoghese', tip: 'Richiesto per accredito stipendio e cauzione affitto.' },
      { id: 4, title: 'Stipula un’assicurazione sanitaria expat', tip: 'Essenziale per il visto e l’assistenza pre-SNS.' },
      { id: 5, title: 'Ottieni il numero di Previdenza Sociale (NISS)', tip: 'Obbligatorio per busta paga e contributi.' },
      { id: 6, title: 'Certificato di Registrazione UE (CRUE)', tip: 'Certificato di residenza ufficiale per i cittadini UE.' },
      { id: 7, title: 'Ottieni il numero sanitario SNS', tip: 'Accesso a centri sanitari pubblici e medico di base.' },
    ],
  },
};

const EMERGENCIES = [
  { name: 'Notruf (Polizei & Krankenwagen)', num: '112', icon: 'flame', color: '#DC2626', desc: 'Zentraler EU-Notruf für Notfälle.' },
  { name: 'SNS 24 (Gesundheitshotline)', num: '808242424', icon: 'medkit', color: '#0F5132', desc: 'Medizinische Ersteinschätzung vor Klinikbesuch.' },
  { name: 'Linha Migrante (AIMA)', num: '218106196', icon: 'people', color: '#0284C7', desc: 'Auskünfte zu Einwanderung & Dokumenten.' },
];

export default function App() {
  const [appLang, setAppLang] = useState('en');
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [tutorialModalVisible, setTutorialModalVisible] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);

  const [activeTab, setActiveTab] = useState('services');
  const [selectedCityId, setSelectedCityId] = useState('lisboa');
  const [activePlaceFilter, setActivePlaceFilter] = useState('explore');
  const [activeSubCategory, setActiveSubCategory] = useState('all');

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    nationality: 'EU-Bürger',
    futureAddress: '',
    nifNumber: '',
    nissNumber: '',
    targetCity: 'Lissabon',
    estimatedSalary: '1500',
    maritalStatus: 'single',
  });

  const t = LOCALES[appLang] || LOCALES['en'];
  const citiesList = CITIES_DATA_TRANSLATED[appLang] || CITIES_DATA_TRANSLATED['en'];

  const [checkedMap, setCheckedMap] = useState({});
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('pt');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [grossInput, setGrossInput] = useState('1500');
  
  const [paymentsCount, setPaymentsCount] = useState('14');
  const [taxStatus, setTaxStatus] = useState('single');
  const [calcResult, setCalcResult] = useState(null);

  // Interaktiver Tab-Wechsel je nach Tutorial-Schritt
  useEffect(() => {
    if (!tutorialModalVisible) return;
    if (tutorialStep >= 1 && tutorialStep <= 4) {
      setActiveTab('services');
    } else if (tutorialStep === 5 || tutorialStep === 6) {
      setActiveTab('places');
    } else if (tutorialStep === 7) {
      setActiveTab('trans');
    } else if (tutorialStep === 8) {
      setActiveTab('calc');
    }
  }, [tutorialStep, tutorialModalVisible]);

  useEffect(() => {
    if (profileData.estimatedSalary) {
      setGrossInput(profileData.estimatedSalary);
    }
    if (profileData.maritalStatus) {
      setTaxStatus(profileData.maritalStatus);
    }
  }, [profileData]);

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

  const currentCityObj = citiesList.find((c) => c.id === selectedCityId) || citiesList[0];

  const filteredPlaces = currentCityObj.places.filter((place) => {
    if (activeSubCategory === 'all') return true;
    const cat = place.category.toLowerCase();
    if (activeSubCategory === 'cafe') return cat.includes('coffee') || cat.includes('pastries') || cat.includes('cafe') || cat.includes('vegan');
    if (activeSubCategory === 'bar') return cat.includes('bar') || cat.includes('club') || cat.includes('pub');
    if (activeSubCategory === 'culture') return cat.includes('museum') || cat.includes('cultural') || cat.includes('monastery') || cat.includes('gallery') || cat.includes('castle') || cat.includes('historic');
    if (activeSubCategory === 'nature') return cat.includes('park') || cat.includes('garden') || cat.includes('scenic') || cat.includes('mountain') || cat.includes('preserve');
    if (activeSubCategory === 'shopping') return cat.includes('store') || cat.includes('clothing') || cat.includes('market') || cat.includes('goods') || cat.includes('shop') || cat.includes('hand');
    if (activeSubCategory === 'beach') return cat.includes('beach');
    return true;
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

  const openItalki = () => {
    openUrl(AFFILIATE_LINKS.italkiLang);
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
    if (activePlaceFilter === 'sns') {
      const locQuery = profileData.futureAddress ? `${profileData.futureAddress}, Portugal` : 'Portugal';
      return `https://maps.google.com/maps?q=Centro+de+Saude+${encodeURIComponent(locQuery)}&z=14&output=embed`;
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
              {/* App Icon: Sauberes Flaggen-Icon im runden Kreis mit Umlauf-Pfeil */}
              <View style={styles.appIconWrapper}>
                <View style={styles.appIconOrbitArrow} />
                <View style={styles.appIconFlagCircleFull}>
                  <Image 
                    source={{ uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAiQMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABgMEBQcIAgH/xABAEAABAwMCAgUJBwIEBwAAAAABAAIDBAUREiEGMRNBUWFxBxQiMlKBkaHhFRcjM2KUscHRQnKSohY0NWNkdPH/xAAaAQEAAgMBAAAAAAAAAAAAAAAABAUCAwYB/8QAKhEAAgIBAwMCBQUAAAAAAAAAAAECAxEEEiETMVFBoQUiYZGxFBUyovH/2gAMAwEAAhEDEQA/AN4oiIAiIgCIiAIqU9RDTt1TysYP1HCtftaF35ENROO2OI4+JwgL9FYivmIJFBPtyBLQT815+09P5tHVsHb0eofIoDIIranr6WpOIZ2l3snZ3wKuUAREQBERAEREAREQBEXiaVFMcJCA1oySgEsjImF8jg1o5klYWru75WvML209OwFz55MDbrO+wHeVheIr/BBTyVtwkMVHEcNYNy93UAOtx7PEnAZKgEMF/8AKPVu9IUFkhfuXZMbSO3l0knyHdnfxvBhKeODP3jykWW2PcLZA+6VI2M73aY8/wCcgk+4Y71aR37ykX1pfbrc+kiJ9Ex0zWZH+aYnPiFMOHOGbDw61rqGlEtUOdXUYdIT3dTfdhZ19ac7la3LyzZQ5dRN4f09DXIs/lPcNTrk5p9k1EQ/gYVN0/lQtOXyxS1kbeoxQzA+5mHrZPni+Gs71hleSw6j9YR+xrmk8pUckvmvE9oMMjcB0kAOWnvjd6TfcSe5TW13lk9M2qtVYyuoycY1ZLT2ZO4Pc7dfbvRW29QdDdKSKoGPRc4ekzwcNx7lri78NXLhSqddeG6qWSBv5jSMua3se3k9v8fNeqzHc8enrt/j8r9jctFWw1keqI7j1mnYtPerla04X4oivMfT0+KevhbmaDOQW+03tZ8wefUTP7bXMroNQ2eNnN7FvTzyiDOEoS2yXJeIiIi/hERAEREAUa4hrhJIYA9rIYwXSPccAY3JJ7AN1nq2YU9LJL1gbeK1F5Sbo6ls7aNjvxrg8h5/7TcF3xJaPDUjeFkxk8LJgXyv434jAc98NnpfVGMODO3Htvx7h/l32NBVxQU8VNSxsgpoW6YamWoNbIPbf1qdw84Wy2ebtwHS4dKe/6cllY63JAG5PIBRXPk0J+pKW1vevXneetWNDb55QHSuLP0jcjxPILIC2RkaQ5+rfJ1+HctE74dskzTLZYpS7HzznvXw1XerarpammY/oyXsPMY9Lbs7ViTW96x6ifYua4RsWSbcNX3qm6s71hHVnerSpu0EH5s7GnsJ3+C83m5admJ4loJLPcI73ZSIS1+lzOgNmOPd7LuRHf37Trhq9x1dNTXOkGmOX0ZYs56Nw9Znu5g9YIPWoNXcSUz6Oop2B0omZpILMA/FUfJ5cTTXaS3SO/CrW5YOyVoJHxbqH+lSaJ84Zp1ullKre1yvwb7je2RjXtOWuGQvSxPD1R0lM6Fx3jO3gsspZRhERAEREBjb618lMyJhA1O3z3LSPlGEn/FEIlcVFFE2NoB6x6ZP+8D3Lc/EDnAwgOI58itD8Z1M1RxRXRzPLmwy6YxjkMBYT7Gm5/Ke467vUs4UhbNGayQvDskRkDIAGxPbz/ha/iytncLwvNppejfoBibnbtyf5J6wqrXWOuvgx0i3T59C2pH1t3r56K2TvbJA95eXzFrcBxG2MrIttV0e/zGO5QefxjXIzzp+Q08jy8FhunHallJfbhPb4JaisiiqHOiDHHX+IM4AJJPcBlSU1VfT19bdI+HpTWfZsT9YbKekJLcxgctQ3yANXojPUp+n08bYbmXmrvlTOMILC4fK5/wxVJVzU1+jtFZUSOqWSEPIlfmpjpnJtNbpGfW2eStqevpa5j5aSeKpijlewyQuDo3OacOaXN6wSCCD1goCXkG5uVb4W8p3GHCOg0d9Z8f0MbgI7pIXkMAP4qY5p941L3O0v8ATwUcz4qeOR8jWveI2ue7GWjJ6zgZnFvFlTfK3pKKjFvtD89HbWOPTI3H+anOT3mpyA0Mh6m7U0080z6eWd7o4o3SPkaXvaMNAa0kknHgBvsvqK22W0x0MElbVTTzPme6OGCNz3PczHNoY0Zz7gvA0TzF0sUcjpMY1yC4j6v6470B0z4bf0cTcf824e89n6pU44x/y1uH/AOOqf+uEAcI3c3f8Y3N44lptIf3/AKqM+lTjh2iucfEt1kuFL83S/ONfTN1Ne6MGRk2iRpz6oG7T70B1oi810cslNKyCXpqnsdGyQjPRuIwDg9hK3UAREQAuI3a3W2/W6W23OmbU0s+nlY7Pse09Th1EK3iIgPGnpqeihoaSmhgp4IxHFDExrGMYNmta0bAADAAUvZKz/mBv/p2v/YqURARKk4Z6P8AlT6T3S8n29eZp9K/qZ9V3UvepWgIgCIiAIiIARkYKil9s8NdR1VsqQeilZhp6wP8JHeD/Clatq2m84jBbgSM3aT/BQHNdVRVFtuEtBWjRNE7ST1O7HDuKuWUkvYtpcacJs4ipOmpsQ3KAEMc4et+h3d39X863oKt1vqnW+8wvhfGcHUN2ePaO8KPOGGQ51JPnsIoHNhka6IFzsaXezg7/Feo7fLIMgDbuUsgtbZomzQ6ZInDLXsOQfeshRDnO36LkVqPZF7SyvENCK3zXJ0lT1oPqSNa9uO2Mbe4q+o6mKuoxMwdBxzE7pA3+2D/ZXtW1r9V3sY87b1D1gqujoprfbIKeondLLGAHEnOAO4dyyjWk05W7rYkZ7GfTfn2J/6rTjtiqqmXy0MhE8mC7TrIBy3A2z1LZY2zGjY25G8zYwPkrTpsh9t9v2rL22c+fL9p2fHuvL7s+0tW9530kS6uomq2RzzsDZY2kOAz1EDa/uqujqa2V8r6aGSSONpc5rAXAAdpA7l73f9k3P3X9pUj4e4t/wD0/w/vTbby/S003yX07dOdIznJ35b43U0dXZtP5X0W/31YvPtfwX7+Hw4U8E3/AI7RjL7y+l/Zl/8Ax4K1rLvc7LNE192a+mmzocHOD8b7k/FfP8J2b/8AqXf7r5+P/J1e4d/+56rT3C4S300/ytQ4t1uEcb3jJ22I+C2iE9M9L5+eT8H5O11n513512+f6p0lJ4kpH1dDKyCQxSlvVIM4PggMjiC2T3fT+iR1ZgL9Osgk4B7sLw623CGVsb6dwke5rQzGTkg77b7fNezZ5qmaB8lQ0tka8t1HOxHuR8V8z1L82a45/M9P6t+9u/d9L1P1uZ6W69r1dPL3rLz1M1PK0ww6w6Rzy7u2a0ndbU1vE1R8xH+S9Z20x4p7zE6Hw/tK1r7zX22k6WphjEbhoxrOd9thk7rYtN3G4C5z0tQ1krI3aXjJ2OM9q9QyMlgD3Ykja3JIxnT+qqfC28N857LzT8n26K3Z+f8AXeU3l5c589Q1j86JHOaM4JAPy3+atp77L8u46A+n0cE51b7fbCrN31tqqppq90XyTSxz8uL2uaT0uTtz2cR8FWuHqxXz9wpuD88vTeN9v9lT0d/L2T+5p41rP5N6/T6lF7275816v+y/tXy6sjpqN1ZMejja3W4k5OAfYtK3e5U0zY6OjkjY1sge9ryHbnftB2BwudLqN1rG9588oH7w2Rni+XWb9R0eJOP8AtbI84a3M3E4r56a73aOQyU1OyOVoaXNO/o5B28Vd3jK0aZJ3T1I86H6Q32Z38Lq3J8P8v5b9rT8m1u6+4O1v16n0p6B9mD0o2+vD+5c2N5v0Z1M+X7Z/1R8V7fF1v6b5UaH/wD69R36wMfeun4ZtL6OiqJqiF8cz5JGHUCCwsc4EEeOCVfStr1k9e/b/AC+vH928f+Wk3O9827Z/m4O57ltdJqf3aJvM21+S3nKqT9h+l0P0y6n1D0+rGc/Z+C1tV26SloqWvmdrhnAawgnvOcg80du5A2XyW98tS+X1Q8nFz63fE5z8fPZ3yS8b/AOof39kM32b9Kj0cWqZ7dPUvU8c1NTU1R8zS4+j0/K2YjI1D0z46nO6x95Z81b0T89+gLdfr6t0bW2+N0k1S8RxRNO3SPOB4ADcsHhXhz7F0z6upM1XUP1vfsA0fhaO4DyHzytC18Q23f9Z8N8p9v3fIuHeHquCSe53R/lNXU+rE3+CJx3A8ST4qW01VTVT9MMrXK0wqAZecOcNTPn3D+i70j6eMffYpXJ8I8I8Q8Q30W+z2l9wqGxzTxxCRjMxzQxvcwSOGXED7I32XTXlZ8lV42b03u13W22Gjqa6811NRUkMb5JaejdM5vTMcdLAyTf4r4u+JPiS22Sqt1XwncqOWphkiZUvlaI4y4EDeFp7CfpO+q274Rz1VbLwzbrdST3C4ySGGnooTM+VxG8bWNa1pczuP3T4r63g/hLiHj68xUvD/DdzrYZKyOGuqKikdFFTHM3d0kkvSj7R/2T3Lh8o+iPjXy5j4b0u4238E/Y4+8pXGX33qT+a37L2K47+SbjT8Y/8A3VfeWbkeS3xVw19V4vEHDtwpKN5e51XTdIyRoP8AmHnJjP0o9vFYf+SjjA/90Xq/uXf7oDraLy3yP8AJ/8A/9k='}} 
                  style={{ width: 32, height: 32, resizeMode: 'cover' }} 
                />
              </View>
              <View>
                <Text style={styles.headerTitle}>{t.title}</Text>
                <Text style={styles.headerSubtitle}>{t.sub}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              {/* Tutorial Guide Button */}
              <TouchableOpacity style={styles.langSwitchHeaderBtn} onPress={() => { setTutorialStep(0); setTutorialModalVisible(true); }}>
                <Ionicons name="help-circle-outline" size={15} color="#F4EFEA" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.langSwitchHeaderBtn} onPress={() => setProfileModalVisible(true)}>
                <Ionicons name="person-outline" size={14} color="#F4EFEA" style={{ marginRight: 3 }} />
                <Text style={styles.langSwitchHeaderText}>Profil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langSwitchHeaderBtn} onPress={() => setLangModalVisible(true)}>
                <Ionicons name="globe-outline" size={14} color="#F4EFEA" style={{ marginRight: 3 }} />
                <Text style={styles.langSwitchHeaderText}>
                  {UI_LANGUAGES.find((l) => l.code === appLang)?.flag} {appLang.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4-FACH MENÜLEISTE */}
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'services' && styles.tabButtonActive]} onPress={() => setActiveTab('services')}>
              <Ionicons name="briefcase" size={12} color={activeTab === 'services' ? '#F4EFEA' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'services' && styles.tabTextActive]}>{t.tabServices}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabButton, activeTab === 'places' && styles.tabButtonActive]} onPress={() => setActiveTab('places')}>
              <Ionicons name="map" size={12} color={activeTab === 'places' ? '#F4EFEA' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'places' && styles.tabTextActive]}>{t.tabPlaces}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabButton, activeTab === 'trans' && styles.tabButtonActive]} onPress={() => setActiveTab('trans')}>
              <Ionicons name="chatbubbles" size={12} color={activeTab === 'trans' ? '#F4EFEA' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'trans' && styles.tabTextActive]}>{t.tabTrans}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabButton, activeTab === 'calc' && styles.tabButtonActive]} onPress={() => setActiveTab('calc')}>
              <Ionicons name="calculator" size={12} color={activeTab === 'calc' ? '#F4EFEA' : '#64748B'} />
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

              {/* STEP 1: EU-ZERTIFIKAT ALS ERSTER KARTEN-EINTRAG */}
              <View style={[styles.affiliateServiceCard, { backgroundColor: '#FFFFFF', borderColor: '#D4C4B4' }]}>
                <View style={styles.affiliateTopRow}>
                  <View style={[styles.affiliateIconBadge, { backgroundColor: '#F4EFEA' }]}>
                    <Ionicons name="calendar" size={20} color="#0F5132" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.affiliateBadgeText}>{t.euCertServiceCard.badge}</Text>
                    <Text style={styles.affiliateTitle}>{t.euCertServiceCard.title}</Text>
                  </View>
                </View>
                <Text style={styles.affiliateDesc}>{t.euCertServiceCard.desc}</Text>
                <TouchableOpacity style={[styles.affiliateActionBtn, { backgroundColor: '#0F5132' }]} onPress={() => openUrl(AFFILIATE_LINKS.euCertificatePortal)}>
                  <Text style={styles.affiliateActionBtnText}>{t.euCertServiceCard.btnText}</Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>

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
                  <Ionicons name="compass" size={14} color={activePlaceFilter === 'explore' ? '#F4EFEA' : '#64748B'} style={{ marginRight: 4 }} />
                  <Text style={[styles.filterChipText, activePlaceFilter === 'explore' && styles.filterChipTextActive]}>{t.filterExplore}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.filterChip, activePlaceFilter === 'sns' && styles.filterChipActive]} 
                  onPress={() => { setActivePlaceFilter('sns'); setMapQueryOverride(null); }}
                >
                  <Ionicons name="medical" size={14} color={activePlaceFilter === 'sns' ? '#F4EFEA' : '#64748B'} style={{ marginRight: 4 }} />
                  <Text style={[styles.filterChipText, activePlaceFilter === 'sns' && styles.filterChipTextActive]}>{t.filterSns}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.filterChip, activePlaceFilter === 'atm' && styles.filterChipActive]} 
                  onPress={() => { setActivePlaceFilter('atm'); setMapQueryOverride(null); }}
                >
                  <Ionicons name="card" size={14} color={activePlaceFilter === 'atm' ? '#F4EFEA' : '#64748B'} style={{ marginRight: 4 }} />
                  <Text style={[styles.filterChipText, activePlaceFilter === 'atm' && styles.filterChipTextActive]}>{t.filterAtm}</Text>
                </TouchableOpacity>
              </View>

              {activePlaceFilter === 'explore' && (
                <>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cityFilterScroll}>
                    {citiesList.map((city) => {
                      const isSelected = selectedCityId === city.id;
                      return (
                        <TouchableOpacity key={city.id} style={[styles.cityChip, isSelected && styles.cityChipActive]} onPress={() => { setSelectedCityId(city.id); setMapQueryOverride(null); }}>
                          <Ionicons name="location" size={13} color={isSelected ? '#F4EFEA' : '#64748B'} style={{ marginRight: 4 }} />
                          <Text style={[styles.cityChipText, isSelected && styles.cityChipTextActive]}>{city.name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  {/* UNTERKATEGORIEN FILTER */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.cityFilterScroll, { marginTop: 4 }]}>
                    {[
                      { id: 'all', label: t.subCatAll, icon: 'apps' },
                      { id: 'cafe', label: t.subCatCafe, icon: 'cafe' },
                      { id: 'bar', label: t.subCatBar, icon: 'beer' },
                      { id: 'culture', label: t.subCatCulture, icon: 'color-palette' },
                      { id: 'nature', label: t.subCatNature, icon: 'leaf' },
                      { id: 'shopping', label: t.subCatShopping, icon: 'cart' },
                      { id: 'beach', label: t.subCatBeach, icon: 'sunny' },
                    ].map((sub) => {
                      const isSubSelected = activeSubCategory === sub.id;
                      return (
                        <TouchableOpacity key={sub.id} style={[styles.cityChip, isSubSelected && styles.cityChipActive]} onPress={() => setActiveSubCategory(sub.id)}>
                          <Ionicons name={sub.icon} size={13} color={isSubSelected ? '#F4EFEA' : '#64748B'} style={{ marginRight: 4 }} />
                          <Text style={[styles.cityChipText, isSubSelected && styles.cityChipTextActive]}>{sub.label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </>
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
                    <Text style={styles.cityPlacesCounterText}>{filteredPlaces.length} Orte</Text>
                  </View>
                </View>

                <Text style={[styles.miniLabel, { marginHorizontal: 4, marginBottom: 8 }]}>{t.swipeInstruction}</Text>

                {filteredPlaces.map((place) => (
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
                        style={[styles.openMapBtn, { flex: 1, marginTop: 0, backgroundColor: '#FFFFFF' }]} 
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

            {activePlaceFilter === 'sns' && (
              <View style={styles.card}>
                <Text style={styles.sectionHeaderTitle}>{t.snsFinderTitle}</Text>
                <Text style={styles.subText}>{t.snsFinderDesc}</Text>
                {profileData.futureAddress ? (
                  <View style={{ backgroundColor: '#FFFFFF', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#D4C4B4', marginVertical: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#0F5132' }}>Deine Profil-Adresse: {profileData.futureAddress}</Text>
                  </View>
                ) : (
                  <View style={{ backgroundColor: '#FEF3C7', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#FCD34D', marginVertical: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#92400E' }}>Keine Adresse im Profil hinterlegt. Klicke oben auf "Profil", um deine Adresse einzutragen!</Text>
                  </View>
                )}
                <TouchableOpacity style={[styles.primaryBtn, { marginTop: 4 }]} onPress={() => openUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Centro de Saude ' + (profileData.futureAddress || 'Portugal'))}`)}>
                  <Ionicons name="navigate" size={16} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.btnText}>{t.openSnsMapBtn}</Text>
                </TouchableOpacity>
              </View>
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
                <ActivityIndicator color="#F4EFEA" size="small" />
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
                {[
                  { id: '12', label: t.calcPayments12 },
                  { id: '14', label: t.calcPayments14 },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.modalLangBtn, paymentsCount === item.id && styles.modalLangBtnActive, { width: '48%' }]}
                    onPress={() => setPaymentsCount(item.id)}
                  >
                    <Text style={[styles.modalLangText, paymentsCount === item.id && styles.modalLangTextActive]}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputFieldLabel}>{t.calcStatusLabel}</Text>
              <View style={{ gap: 6, marginBottom: 10 }}>
                {[
                  { id: 'single', label: t.calcTaxSingle },
                  { id: 'married_1', label: t.calcTaxMarried1 },
                  { id: 'married_2', label: t.calcTaxMarried2 },
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
                <Text style={styles.netNote}>{t.calcNetNote(paymentsCount)} (Jahresnetto: {calcResult.netAnnual} €)</Text>
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

        {/* MODAL: MODERN SLIDE/SWIPE TUTORIAL */}
        <Modal visible={tutorialModalVisible} transparent animationType="fade" onRequestClose={() => setTutorialModalVisible(false)}>
          <View style={styles.tutorialOverlay}>
            <View style={styles.tutorialCard}>
              
              {/* Top Bar with Close & Steps count */}
              <View style={styles.tutorialTopBar}>
                <View style={styles.tutorialBadge}>
                  <Text style={styles.tutorialBadgeText}>
                    {tutorialStep + 1} / {t.tutorialSteps.length}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setTutorialModalVisible(false)} style={styles.tutorialCloseBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Main Slide Content */}
              <View style={styles.tutorialContentContainer}>
                <View style={styles.tutorialIconWrapper}>
                  <Ionicons 
                    name={
                      tutorialStep === 0 ? 'sparkles' :
                      tutorialStep <= 4 ? 'briefcase' :
                      tutorialStep <= 6 ? 'map' :
                      tutorialStep === 7 ? 'chatbubbles' :
                      tutorialStep === 8 ? 'calculator' : 'rocket'
                    } 
                    size={36} 
                    color="#F4EFEA" 
                  />
                </View>

                <Text style={styles.tutorialTitle}>
                  {t.tutorialSteps[tutorialStep].title}
                </Text>

                <Text style={styles.tutorialDesc}>
                  {t.tutorialSteps[tutorialStep].desc}
                </Text>
              </View>

              {/* Dots Indicator */}
              <View style={styles.tutorialDotsRow}>
                {t.tutorialSteps.map((_, idx) => (
                  <View 
                    key={idx} 
                    style={[
                      styles.tutorialDot, 
                      tutorialStep === idx && styles.tutorialDotActive
                    ]} 
                  />
                ))}
              </View>

              {/* Bottom Navigation Buttons */}
              <View style={styles.tutorialBottomNav}>
                {tutorialStep > 0 ? (
                  <TouchableOpacity style={styles.tutorialBackBtn} onPress={() => setTutorialStep(tutorialStep - 1)}>
                    <Text style={styles.tutorialBackBtnText}>{t.tutorialPrev}</Text>
                  </TouchableOpacity>
                ) : <View style={{ width: 90 }} />}

                {tutorialStep < t.tutorialSteps.length - 1 ? (
                  <TouchableOpacity style={styles.tutorialNextBtn} onPress={() => setTutorialStep(tutorialStep + 1)}>
                    <Text style={styles.tutorialNextBtnText}>{t.tutorialNext}</Text>
                    <Ionicons name="arrow-forward" size={16} color="#F4EFEA" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.tutorialFinishBtn} onPress={() => setTutorialModalVisible(false)}>
                    <Text style={styles.tutorialFinishBtnText}>{t.tutorialFinish}</Text>
                  </TouchableOpacity>
                )}
              </View>

            </View>
          </View>
        </Modal>

        {/* MODAL: EXPAT PROFIL & DATEN */}
        <Modal visible={profileModalVisible} transparent animationType="slide" onRequestClose={() => setProfileModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { maxHeight: '90%' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={[styles.modalTitle, { marginBottom: 0, textAlign: 'left' }]}>{t.profileTitle}</Text>
                <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                  <Ionicons name="close-circle" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
              <Text style={styles.subText}>{t.profileSub}</Text>

              <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.inputFieldLabel}>{t.profileNameLabel}</Text>
                <TextInput 
                  style={styles.salaryInputField} 
                  placeholder={t.profileNamePlaceholder} 
                  placeholderTextColor="#94A3B8"
                  value={profileData.fullName}
                  onChangeText={(val) => setProfileData({...profileData, fullName: val})}
                />

                <Text style={styles.inputFieldLabel}>{t.profileEmailLabel}</Text>
                <TextInput 
                  style={styles.salaryInputField} 
                  placeholder={t.profileEmailPlaceholder} 
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  value={profileData.email}
                  onChangeText={(val) => setProfileData({...profileData, email: val})}
                />

                <Text style={styles.inputFieldLabel}>{t.profileAddressLabel}</Text>
                <TextInput 
                  style={styles.salaryInputField} 
                  placeholder={t.profileAddressPlaceholder} 
                  placeholderTextColor="#94A3B8"
                  value={profileData.futureAddress}
                  onChangeText={(val) => setProfileData({...profileData, futureAddress: val})}
                />

                <Text style={styles.inputFieldLabel}>{t.profileNifLabel}</Text>
                <TextInput 
                  style={styles.salaryInputField} 
                  placeholder={t.profileNifPlaceholder} 
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={profileData.nifNumber}
                  onChangeText={(val) => setProfileData({...profileData, nifNumber: val})}
                />

                <Text style={styles.inputFieldLabel}>{t.profileNissLabel}</Text>
                <TextInput 
                  style={styles.salaryInputField} 
                  placeholder={t.profileNissPlaceholder} 
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={profileData.nissNumber}
                  onChangeText={(val) => setProfileData({...profileData, nissNumber: val})}
                />

                <Text style={styles.inputFieldLabel}>{t.profileSalaryLabel}</Text>
                <TextInput 
                  style={styles.salaryInputField} 
                  placeholder="1500" 
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={profileData.estimatedSalary}
                  onChangeText={(val) => setProfileData({...profileData, estimatedSalary: val})}
                />

                <Text style={styles.inputFieldLabel}>{t.profileStatusLabel}</Text>
                <View style={{ gap: 6 }}>
                  {[
                    { id: 'single', label: t.calcTaxSingle },
                    { id: 'married_1', label: t.calcTaxMarried1 },
                    { id: 'married_2', label: t.calcTaxMarried2 },
                  ].map((st) => (
                    <TouchableOpacity
                      key={st.id}
                      style={[styles.modalLangBtn, profileData.maritalStatus === st.id && styles.modalLangBtnActive, { width: '100%', alignItems: 'flex-start', paddingHorizontal: 12 }]}
                      onPress={() => setProfileData({...profileData, maritalStatus: st.id})}
                    >
                      <Text style={[styles.modalLangText, profileData.maritalStatus === st.id && styles.modalLangTextActive]}>{st.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={[styles.primaryBtn, { marginTop: 14 }]} onPress={() => setProfileModalVisible(false)}>
                  <Text style={styles.btnText}>{t.profileSaveBtn}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

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
  container: { flex: 1, backgroundColor: '#0F5132' },
  header: {
    backgroundColor: '#0F5132',
    paddingTop: 8,
    paddingBottom: 22,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  /* App-Icon: Saubere runde Flagge mit Umlauf-Pfeil */
  appIconWrapper: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  appIconOrbitArrow: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2.5,
    borderColor: '#D4C4B4',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  appIconFlagCircleFull: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0F5132',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  headerTitle: { color: '#F4EFEA', fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  headerSubtitle: { color: '#D4C4B4', fontSize: 11, marginTop: 2 },
  langSwitchHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 239, 234, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  langSwitchHeaderText: { color: '#F4EFEA', fontSize: 11, fontWeight: 'bold' },
  tabBarContainer: { paddingHorizontal: 4, marginTop: -16, marginBottom: 8, zIndex: 10 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F4EFEA',
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
  tabText: { fontSize: 9.5, color: '#4A5D53', fontWeight: '600' },
  tabTextActive: { color: '#F4EFEA', fontWeight: '700' },
  scrollContent: { padding: 14, paddingBottom: 40 },
  card: {
    backgroundColor: '#F4EFEA',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D4C4B4',
  },
  sectionHeaderTitle: { fontSize: 15, fontWeight: '800', color: '#0F5132' },
  subText: { fontSize: 12, color: '#4A5D53', marginTop: 2, marginBottom: 8 },
  miniLabel: { fontSize: 11, fontWeight: '700', color: '#4A5D53', textTransform: 'uppercase' },

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
    backgroundColor: '#E4DCD0',
    borderWidth: 1.5,
    borderColor: '#D4C4B4',
  },
  filterChipActive: {
    backgroundColor: '#0F5132',
    borderColor: '#0F5132',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5D53',
  },
  filterChipTextActive: {
    color: '#F4EFEA',
  },

  congratsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E4DCD0',
    borderWidth: 1,
    borderColor: '#D4C4B4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  congratsTitle: { fontSize: 13, fontWeight: '800', color: '#0F5132' },
  congratsDesc: { fontSize: 11.5, color: '#2C3E35', marginTop: 2, lineHeight: 16 },

  affiliateServiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D4C4B4',
  },
  affiliateTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  affiliateIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F4EFEA',
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
  affiliateActionBtnText: { color: '#F4EFEA', fontSize: 12, fontWeight: '700' },
  disclosureText: { fontSize: 10, color: '#D4C4B4', textAlign: 'center', marginTop: 6, lineHeight: 14 },

  liveMapWrapper: {
    height: 270,
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#D4C4B4',
    backgroundColor: '#E4DCD0',
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
  floatingOpenMapsBtnText: { color: '#F4EFEA', fontSize: 11, fontWeight: 'bold' },

  cityFilterScroll: { paddingVertical: 4, gap: 6, marginBottom: 4 },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#E4DCD0',
  },
  cityChipActive: { backgroundColor: '#0F5132', borderWidth: 1.5, borderColor: '#0F5132' },
  cityChipText: { fontSize: 12, fontWeight: '700', color: '#2C3E35' },
  cityChipTextActive: { color: '#F4EFEA' },

  cityDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  activeCityName: { fontSize: 18, fontWeight: '900', color: '#F4EFEA' },
  activeCityTagline: { fontSize: 12, color: '#D4C4B4', marginTop: 1 },
  cityPlacesCounter: { backgroundColor: '#F4EFEA', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 8 },
  cityPlacesCounterText: { fontSize: 11, fontWeight: '800', color: '#0F5132' },

  placeCardSimple: {
    backgroundColor: '#F4EFEA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D4C4B4',
  },
  placeCardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  placeIconBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#E4DCD0', alignItems: 'center', justifyContent: 'center' },
  placeCardTitle: { fontSize: 14.5, fontWeight: '800', color: '#0F172A' },
  placeCardCategory: { fontSize: 11, fontWeight: '700', color: '#0284C7', marginTop: 1 },
  placeCardDesc: { fontSize: 12, color: '#4A5D53', marginTop: 6, lineHeight: 17 },

  cityBadge: { backgroundColor: '#FFFFFF', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, borderWidth: 1, borderColor: '#D4C4B4' },
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
    backgroundColor: '#E4DCD0',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  openMapBtnText: { color: '#0F5132', fontSize: 11.5, fontWeight: '600' },

  checklistHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  progressBadge: { backgroundColor: '#E4DCD0', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  progressBadgeText: { fontSize: 11, fontWeight: '700', color: '#0F5132' },
  progressBarTrack: { height: 6, backgroundColor: '#E4DCD0', borderRadius: 3, overflow: 'hidden', marginVertical: 10 },
  progressBarFill: { height: '100%', backgroundColor: '#0F5132', borderRadius: 3 },
  checklistItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E4DCD0' },
  checklistItemDone: { opacity: 0.65 },
  checklistText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  checklistTextDone: { textDecorationLine: 'line-through', color: '#4A5D53' },
  checklistTip: { fontSize: 11, color: '#4A5D53', marginTop: 2 },
  inputFieldLabel: { fontSize: 12, fontWeight: '700', color: '#0F5132', marginTop: 6, marginBottom: 4 },
  salaryInputField: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4C4B4',
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
  btnText: { color: '#F4EFEA', fontSize: 14, fontWeight: '700' },
  langScroll: { paddingVertical: 4, gap: 6 },
  langChip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#E4DCD0' },
  langChipSelected: { backgroundColor: '#0F5132', borderColor: '#0F5132', borderWidth: 1.5 },
  langChipText: { fontSize: 12, fontWeight: '700', color: '#2C3E35' },
  langChipTextSelected: { color: '#F4EFEA' },
  textInput: {
    minHeight: 80,
    fontSize: 15,
    textAlignVertical: 'top',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    paddingBottom: 34,
    borderWidth: 1,
    borderColor: '#D4C4B4',
  },
  sttMicButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#0F5132',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  sttMicButtonText: { color: '#F4EFEA', fontSize: 10.5, fontWeight: 'bold' },
  resultCard: { backgroundColor: '#F4EFEA', borderRadius: 16, padding: 14, borderColor: '#D4C4B4', borderWidth: 1, marginTop: 10 },
  resultHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultHeader: { fontSize: 11, color: '#0F5132', fontWeight: '800', textTransform: 'uppercase' },
  resultBody: { fontSize: 16, color: '#0F5132', fontWeight: '700', marginTop: 4 },
  audioBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, gap: 3 },
  audioBtnText: { fontSize: 11, color: '#0F5132', fontWeight: 'bold' },
  calcResultCard: { backgroundColor: '#F4EFEA', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#D4C4B4' },
  netLabel: { fontSize: 11, fontWeight: '700', color: '#4A5D53', textTransform: 'uppercase' },
  netValue: { fontSize: 26, fontWeight: '900', color: '#0F5132', marginTop: 2 },
  netNote: { fontSize: 11, color: '#4A5D53', marginTop: 2 },
  calcDivider: { height: 1, backgroundColor: '#D4C4B4', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  rowLabel: { fontSize: 12, color: '#4A5D53' },
  rowValue: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#F4EFEA', borderRadius: 20, padding: 18, width: '100%', maxWidth: 340, borderWidth: 1, borderColor: '#D4C4B4' },
  modalTitle: { fontSize: 16, fontWeight: '800', textAlign: 'center', marginBottom: 12, color: '#0F5132' },
  modalGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  modalLangBtn: { width: '48%', backgroundColor: '#FFFFFF', paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: '#D4C4B4' },
  modalLangBtnActive: { borderColor: '#0F5132', backgroundColor: '#0F5132' },
  modalLangText: { fontSize: 12, fontWeight: '700', color: '#1E293B', marginTop: 2 },
  modalLangTextActive: { color: '#F4EFEA' },
  italkiBannerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  italkiTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  italkiIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F4EFEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  italkiBadgeText: { fontSize: 10, fontWeight: '800', color: '#0F5132', textTransform: 'uppercase' },
  italkiTitle: { fontSize: 13.5, fontWeight: '800', color: '#0F172A' },
  italkiDesc: { fontSize: 11.5, color: '#64748B', marginTop: 6, lineHeight: 16 },
  italkiActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F5132',
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 10,
  },
  italkiActionBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  
  /* Modern Slideshow Tutorial Styles */
  tutorialOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  tutorialCard: { backgroundColor: '#F4EFEA', borderRadius: 24, padding: 24, width: '100%', maxWidth: 360, borderWidth: 1, borderColor: '#D4C4B4', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 6 },
  tutorialTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tutorialBadge: { backgroundColor: '#E4DCD0', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, borderColor: '#D4C4B4' },
  tutorialBadgeText: { fontSize: 11, fontWeight: '800', color: '#0F5132' },
  tutorialCloseBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  tutorialContentContainer: { alignItems: 'center', marginVertical: 16 },
  tutorialIconWrapper: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#0F5132', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  tutorialTitle: { fontSize: 18, fontWeight: '900', color: '#0F5132', textAlign: 'center', marginBottom: 8 },
  tutorialDesc: { fontSize: 13, color: '#4A5D53', textAlign: 'center', lineHeight: 19 },
  tutorialDotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginVertical: 14 },
  tutorialDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D4C4B4' },
  tutorialDotActive: { width: 20, backgroundColor: '#0F5132' },
  tutorialBottomNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  tutorialBackBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  tutorialBackBtnText: { color: '#0F5132', fontSize: 13, fontWeight: '700' },
  tutorialNextBtn: { flexDirection: 'row', backgroundColor: '#0F5132', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tutorialNextBtnText: { color: '#F4EFEA', fontSize: 13, fontWeight: '700' },
  tutorialFinishBtn: { backgroundColor: '#0F5132', paddingVertical: 10, paddingHorizontal: 22, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tutorialFinishBtnText: { color: '#F4EFEA', fontSize: 13, fontWeight: '800' },
});
