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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

// VOLLSTÄNDIGE LOKALISIERUNG FÜR ALLE DETAILS
const LOCALES = {
  de: {
    title: 'PortuStart',
    sub: 'Dein Relocation-Partner für Portugal',
    tabTrans: 'Translator',
    tabServices: 'Services',
    tabCalc: 'Gehalt',
    tabGuide: 'Guide',
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
    serviceLabels: {
      nif: 'NIF (Steuernummer)',
      niss: 'NISS (Sozialversicherung)',
      bank: 'Bankkonto',
    },
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
    celebDesc: 'Vom NIF über das Bankkonto bis zur SNS-Gesundheitsnummer: Du hast das Fundament für dein Leben in Portugal gelegt!',
    celebBtn: 'Muito obrigado! Weiter geht\'s 🚀',
    checklist: [
      { id: 1, title: 'Steuernummer (NIF) beantragen', tip: 'Der Schlüssel für Miete, Handyvertrag, Arbeit und Bankkonto.' },
      { id: 2, title: 'Portugiesische SIM-Karte besorgen', tip: 'Notwendig für die Chave Móvel Digital und Behörden-SMS.' },
      { id: 3, title: 'Bankkonto eröffnen', tip: 'Erforderlich für Gehaltseingang und Wohnungskaution.' },
      { id: 4, title: 'Wohnungsanmietung & Registrierung', tip: 'Der Mietvertrag muss beim Finanzamt (Finanças) gemeldet sein.' },
      { id: 5, title: 'Sozialversicherungsnummer (NISS)', tip: 'Wird für Arbeitsvertrag und Rentenanspruch benötigt.' },
      { id: 6, title: 'Aufenthaltsrecht (CRUE / AIMA)', tip: 'EU-Bürger melden sich nach 3 Monaten bei der Câmara Municipal an.' },
      { id: 7, title: 'SNS-Gesundheitsnummer (Centro de Saúde)', tip: 'Zugang zum staatlichen Hausarztsystem und Krankenhäusern.' },
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
        ],
      },
    ],
    emergencies: [
      { name: 'Notruf (Polizei & Krankenwagen)', num: '112', icon: 'flame', color: '#DC2626', desc: 'Zentraler EU-Notruf für akute Notfälle.' },
      { name: 'SNS 24 (Gesundheitshotline)', num: '808242424', icon: 'medkit', color: '#0F5132', desc: 'Medizinische Ersteinschätzung vor Klinikbesuch (auch Englisch).' },
      { name: 'Linha Migrante (AIMA / Integration)', num: '218106196', icon: 'people', color: '#0284C7', desc: 'Auskünfte zu Einwanderung, Dokumenten und Aufenthalt.' },
    ],
  },
  en: {
    title: 'PortuStart',
    sub: 'Your Relocation Partner for Portugal',
    tabTrans: 'Translator',
    tabServices: 'Services',
    tabCalc: 'Salary',
    tabGuide: 'Guide',
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
    serviceLabels: {
      nif: 'NIF (Tax Number)',
      niss: 'NISS (Social Security)',
      bank: 'Bank Account',
    },
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
    celebDesc: 'From your NIF and bank account to your SNS healthcare number: you are ready for Portugal!',
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
    phrases: [
      {
        category: 'Renting & Apartments (Arrendamento)',
        color: '#0284C7',
        items: [
          { trans: 'Is the apartment still available?', pt: 'O apartamento ainda está disponível?', ph: 'Oo ah-par-tah-men-too eye-ndah esh-tah deesh-poo-nee-vel?' },
          { trans: 'How much is the deposit / upfront months?', pt: 'Quanto é a caução e quantos meses adiantados?', ph: 'Kwan-too eh ah kow-sow ee kwan-toosh...?' },
          { trans: 'I do not have a guarantor (Fiador).', pt: 'Não tenho fiador.', ph: 'Nowng teng-yoo fee-ah-dor.' },
        ],
      },
      {
        category: 'Public Services & Paperwork (AIMA / Finanças)',
        color: '#0F5132',
        items: [
          { trans: 'I need to apply for a NIF.', pt: 'Preciso de pedir o NIF nas Finanças.', ph: 'Preh-see-zoo deh peh-deer oo neef...' },
          { trans: 'I have an appointment at AIMA.', pt: 'Tenho uma marcação na AIMA.', ph: 'Ten-yoo oo-mah mar-kah-sah-oo nah eye-mah' },
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
      { name: 'Emergency (Police & Ambulance)', num: '112', icon: 'flame', color: '#DC2626', desc: 'Central EU emergency dispatch for life-threatening events.' },
      { name: 'SNS 24 (Public Health Line)', num: '808242424', icon: 'medkit', color: '#0F5132', desc: 'Pre-triage clinical advice in English before hospital visits.' },
      { name: 'Linha Migrante (AIMA / Integration)', num: '218106196', icon: 'people', color: '#0284C7', desc: 'Official guidance on visas, residency and legal paperwork.' },
    ],
  },
  es: {
    title: 'PortuStart',
    sub: 'Tu socio de reubicación en Portugal',
    tabTrans: 'Traductor',
    tabServices: 'Servicios',
    tabCalc: 'Salario',
    tabGuide: 'Guía',
    from: 'De:',
    to: 'A:',
    inputLabel: 'Entrada:',
    placeholderTrans: 'Escribe texto o habla...',
    btnTrans: 'Traducir',
    listenBtn: 'Escuchar',
    listeningNotice: '🎙 Escuchando... ¡Habla ahora!',
    resultLabel: 'Resultado',
    nameLabel: 'Nombre completo:',
    namePlaceholder: 'ej. Julia Schneider',
    emailLabel: 'Correo electrónico:',
    emailPlaceholder: 'nombre@ejemplo.com',
    docsLabel: 'Documentos requeridos:',
    servicesTitle: '📄 Documentos y Trámites',
    servicesSub: 'Solicita NIF, NISS o cuenta bancaria online',
    checklistTitle: '📋 Hoja de ruta primeros 30 días',
    checklistSub: 'Plan burocrático paso a paso para Portugal',
    checklistDone: 'completado',
    selectServices: 'Servicios requeridos:',
    serviceLabels: {
      nif: 'NIF (Número Fiscal)',
      niss: 'NISS (Seguridad Social)',
      bank: 'Cuenta Bancaria',
    },
    uploadPass: 'Adjuntar Pasaporte / DNI',
    uploadProof: 'Adjuntar Comprobante de domicilio',
    submitBtn: 'Enviar documentos (portustart@proton.me)',
    fileSelected: 'Listo: ',
    supportTitle: 'Ayuda y Soporte',
    supportHelpText: '¿Preguntas o problemas? Contacta con soporte:',
    supportBtn: 'Contactar Soporte (portustart.support@proton.me)',
    calcTitle: '💶 Calculadora Salario Neto',
    calcSub: 'Empleado soltero sin hijos (14 pagas al año).',
    calcGrossLabel: 'Salario bruto mensual (€):',
    calcBtn: 'Calcular',
    calcNetMonthly: 'Neto estimado (al mes):',
    calc14Notice: 'Base: 14 mensualidades (incluye pagas extras)',
    calcGrossRow: 'Bruto mensual:',
    calcSSRow: 'Seguridad Social (-11%):',
    calcIRSRow: 'Retención IRS:',
    emergencyTitle: '🚨 Contactos de Emergencia',
    transitTitle: '🚆 Bus, Tren y Metro (Todo Portugal)',
    transitSub: 'Horarios, líneas y abonos de Oporto a Faro',
    openLiveTransitBtn: 'Navegación en Google Maps',
    welcomeTitle: '¡Bienvenido a PortuStart! 🇵🇹',
    welcomeSub: 'Tu compañero ideal para instalarte en Portugal.',
    guideStepRoadmapTitle: '1. Hoja de ruta 30 días',
    guideStepRoadmapDesc: 'Plan interactivo con barra de progreso.',
    guideStepServicesTitle: '2. Documentos y Servicios',
    guideStepServicesDesc: 'Pide tu NIF, NISS y cuenta bancaria fácilmente.',
    guideStepTransitTitle: '3. Transporte en Portugal',
    guideStepTransitDesc: 'Metro de Oporto, Lisboa, trenes CP y abonos baratos.',
    guideStepEmergencyTitle: '4. Teléfonos de Emergencia',
    guideStepEmergencyDesc: 'Llamada directa al 112 y SNS 24.',
    guideStepSlangTitle: '5. Voz y Traductor de Jerga',
    guideStepSlangDesc: 'Dictado por voz, audio y adaptación lingüística.',
    welcomeBtn: '¡Entendido, vamos!',
    celebTitle: '¡Parabéns! 🇵🇹🎉',
    celebSub: '¡Has completado los 7 pasos!',
    celebDesc: '¡Ya tienes la base lista para tu nueva vida en Portugal!',
    celebBtn: '¡Muchas gracias! Continuar 🚀',
    checklist: [
      { id: 1, title: 'Obtener el NIF (Número Fiscal)', tip: 'La clave para alquilar, contratos de teléfono y banco.' },
      { id: 2, title: 'Tarjeta SIM portuguesa', tip: 'Imprescindible para la Chave Móvel Digital y trámites oficiales.' },
      { id: 3, title: 'Abrir cuenta bancaria', tip: 'Necesaria para recibir el sueldo y fianza del alquiler.' },
      { id: 4, title: 'Contrato de alquiler y registro', tip: 'El contrato debe ser registrado en Finanças.' },
      { id: 5, title: 'Número de Seguridad Social (NISS)', tip: 'Requerido para trabajar y estar cubierto legalmente.' },
      { id: 6, title: 'Certificado de residencia (CRUE / AIMA)', tip: 'Los ciudadanos de la UE se registran tras 3 meses en la Câmara.' },
      { id: 7, title: 'Número SNS (Centro de Saúde)', tip: 'Acceso al sistema público de salud y médicos de cabecera.' },
    ],
    phrases: [
      {
        category: 'Alquiler y Vivienda (Arrendamento)',
        color: '#0284C7',
        items: [
          { trans: '¿El apartamento sigue disponible?', pt: 'O apartamento ainda está disponível?', ph: 'Oo ah-par-tah-men-too...' },
          { trans: '¿Cuánto es la fianza / meses por adelantado?', pt: 'Quanto é a caução e quantos meses adiantados?', ph: 'Kwan-too eh ah kow-sow...' },
          { trans: 'No tengo avalista (Fiador).', pt: 'Não tenho fiador.', ph: 'Nowng teng-yoo fee-ah-dor.' },
        ],
      },
      {
        category: 'Trámites y Administración (Finanças / AIMA)',
        color: '#0F5132',
        items: [
          { trans: 'Necesito solicitar el NIF.', pt: 'Preciso de pedir o NIF nas Finanças.', ph: 'Preh-see-zoo deh peh-deer oo neef...' },
          { trans: 'Tengo una cita en la AIMA.', pt: 'Tenho uma marcação na AIMA.', ph: 'Ten-yoo oo-mah mar-kah-sah-oo...' },
        ],
      },
      {
        category: 'Restaurantes y Día a Día',
        color: '#D97706',
        items: [
          { trans: 'Una cerveza de barril, por favor.', pt: 'Uma imperial, por favor (Lisboa) / Um fino (Oporto).', ph: 'Oo-mah eem-peh-ree-ahl' },
          { trans: 'La cuenta, por favor.', pt: 'A conta, por favor.', ph: 'Ah kon-tah, poor fah-vor' },
        ],
      },
    ],
    emergencies: [
      { name: 'Emergencias (Policía y Ambulancia)', num: '112', icon: 'flame', color: '#DC2626', desc: 'Número central europeo para emergencias graves.' },
      { name: 'SNS 24 (Salud Pública)', num: '808242424', icon: 'medkit', color: '#0F5132', desc: 'Orientación médica previa antes de ir a urgencias.' },
      { name: 'Linha Migrante (AIMA / Integración)', num: '218106196', icon: 'people', color: '#0284C7', desc: 'Dudas sobre visados, residencia y extranjería.' },
    ],
  },
  fr: {
    title: 'PortuStart',
    sub: 'Votre partenaire de relocation au Portugal',
    tabTrans: 'Traducteur',
    tabServices: 'Services',
    tabCalc: 'Salaire',
    tabGuide: 'Guide',
    from: 'De :',
    to: 'À :',
    inputLabel: 'Texte :',
    placeholderTrans: 'Écrivez ou parlez...',
    btnTrans: 'Traduire',
    listenBtn: 'Écouter',
    listeningNotice: '🎙 Écoute en cours... Parlez maintenant !',
    resultLabel: 'Résultat',
    nameLabel: 'Nom complet :',
    namePlaceholder: 'ex. Julia Schneider',
    emailLabel: 'Adresse e-mail :',
    emailPlaceholder: 'nom@exemple.com',
    docsLabel: 'Documents requis :',
    servicesTitle: '📄 Documents & Démarches',
    servicesSub: 'Demandez votre NIF, NISS ou compte bancaire',
    checklistTitle: '📋 Feuille de route 30 premiers jours',
    checklistSub: 'Votre guide administratif pour le Portugal',
    checklistDone: 'terminé',
    selectServices: 'Services nécessaires :',
    serviceLabels: {
      nif: 'NIF (Numéro Fiscal)',
      niss: 'NISS (Sécurité Sociale)',
      bank: 'Compte Bancaire',
    },
    uploadPass: 'Joindre Passeport / CNI',
    uploadProof: 'Joindre Justificatif de domicile',
    submitBtn: 'Envoyer les documents (portustart@proton.me)',
    fileSelected: 'Prêt : ',
    supportTitle: 'Aide & Support',
    supportHelpText: 'Des questions ? Contactez le support :',
    supportBtn: 'Contacter le Support (portustart.support@proton.me)',
    calcTitle: '💶 Calculateur de Salaire Net',
    calcSub: 'Célibataire sans enfant (14 mois de salaire).',
    calcGrossLabel: 'Salaire brut mensuel (€) :',
    calcBtn: 'Calculer',
    calcNetMonthly: 'Net estimé (par mois) :',
    calc14Notice: 'Base : 14 versements par an',
    calcGrossRow: 'Brut mensuel :',
    calcSSRow: 'Sécurité Sociale (-11%) :',
    calcIRSRow: 'Retenue IRS :',
    emergencyTitle: '🚨 Numéros d\'urgence',
    transitTitle: '🚆 Bus, Train & Métro (Tout le Portugal)',
    transitSub: 'Horaires, réseaux et forfaits de Porto à Faro',
    openLiveTransitBtn: 'Navigation en direct dans Maps',
    welcomeTitle: 'Bienvenue sur PortuStart ! 🇵🇹',
    welcomeSub: 'Votre guide pour vous installer sereinement au Portugal.',
    guideStepRoadmapTitle: '1. Feuille de route',
    guideStepRoadmapDesc: 'Checklist pas à pas pour votre installation.',
    guideStepServicesTitle: '2. Services Administratifs',
    guideStepServicesDesc: 'Obtenez NIF, NISS et compte bancaire.',
    guideStepTransitTitle: '3. Transports Nationaux',
    guideStepTransitDesc: 'Métro Porto, Lisbonne, trains CP et pass Navegante/Andante.',
    guideStepEmergencyTitle: '4. Numéros d\'Urgence',
    guideStepEmergencyDesc: 'Appel direct vers 112 et SNS 24.',
    guideStepSlangTitle: '5. Vocal & Argot Local',
    guideStepSlangDesc: 'Saisie vocale, synthèse vocale et expressions typiques.',
    welcomeBtn: 'C\'est parti !',
    celebTitle: 'Parabéns ! 🇵🇹🎉',
    celebSub: 'Vous avez complété les 7 étapes !',
    celebDesc: 'Félicitations, vous avez toutes les bases pour vivre au Portugal !',
    celebBtn: 'Merci beaucoup ! Continuer 🚀',
    checklist: [
      { id: 1, title: 'Obtenir le NIF (Numéro fiscal)', tip: 'Indispensable pour bail, forfait mobile, banque et travail.' },
      { id: 2, title: 'Carte SIM portugaise', tip: 'Nécessaire pour les codes SMS des administrations publiques.' },
      { id: 3, title: 'Ouvrir un compte bancaire', tip: 'Requis pour percevoir le salaire et payer la caution.' },
      { id: 4, title: 'Contrat de bail et enregistrement', tip: 'Le bail doit être validé auprès des Finanças.' },
      { id: 5, title: 'Numéro de Sécurité Sociale (NISS)', tip: 'Obligatoire pour travailler et cotiser au Portugal.' },
      { id: 6, title: 'Certificat de résidence (CRUE / AIMA)', tip: 'Les citoyens UE s\'enregistrent après 3 mois en mairie.' },
      { id: 7, title: 'Numéro SNS (Santé Publique)', tip: 'Donne accès aux centres de santé publics (Centro de Saúde).' },
    ],
    phrases: [
      {
        category: 'Location & Logement (Arrendamento)',
        color: '#0284C7',
        items: [
          { trans: 'L\'appartement est-il toujours disponible ?', pt: 'O apartamento ainda está disponível?', ph: 'Oo ah-par-tah-men-too...' },
          { trans: 'Combien pour la caution et les mois d\'avance ?', pt: 'Quanto é a caução e quantos meses adiantados?', ph: 'Kwan-too eh ah kow-sow...' },
          { trans: 'Je n\'ai pas de garant (Fiador).', pt: 'Não tenho fiador.', ph: 'Nowng teng-yoo fee-ah-dor.' },
        ],
      },
      {
        category: 'Administrations (Finanças / AIMA)',
        color: '#0F5132',
        items: [
          { trans: 'Je dois demander un NIF.', pt: 'Preciso de pedir o NIF nas Finanças.', ph: 'Preh-see-zoo deh peh-deer oo neef...' },
          { trans: 'J\'ai un rendez-vous à l\'AIMA.', pt: 'Tenho uma marcação na AIMA.', ph: 'Ten-yoo oo-mah mar-kah-sah-oo...' },
        ],
      },
      {
        category: 'Restaurants et Vie quotidienne',
        color: '#D97706',
        items: [
          { trans: 'Une bière pression, s\'il vous plaît.', pt: 'Uma imperial, por favor (Lisbonne) / Um fino (Porto).', ph: 'Oo-mah eem-peh-ree-ahl' },
          { trans: 'L\'addition, s\'il vous plaît.', pt: 'A conta, por favor.', ph: 'Ah kon-tah, poor fah-vor' },
        ],
      },
    ],
    emergencies: [
      { name: 'Urgences (Police & Ambulance)', num: '112', icon: 'flame', color: '#DC2626', desc: 'Numéro d\'urgence européen centralisé.' },
      { name: 'SNS 24 (Santé Publique)', num: '808242424', icon: 'medkit', color: '#0F5132', desc: 'Conseils médicaux préalables avant l\'hôpital.' },
      { name: 'Linha Migrante (AIMA / Intégration)', num: '218106196', icon: 'people', color: '#0284C7', desc: 'Informations visas, titres de séjour et régularisation.' },
    ],
  },
  it: {
    title: 'PortuStart',
    sub: 'Il tuo partner per il trasferimento in Portogallo',
    tabTrans: 'Traduttore',
    tabServices: 'Servizi',
    tabCalc: 'Stipendio',
    tabGuide: 'Guida',
    from: 'Da:',
    to: 'A:',
    inputLabel: 'Testo:',
    placeholderTrans: 'Scrivi o parla...',
    btnTrans: 'Traduci',
    listenBtn: 'Ascolta',
    listeningNotice: '🎙 Ascolto in corso... Parla adesso!',
    resultLabel: 'Risultato',
    nameLabel: 'Nome e Cognome:',
    namePlaceholder: 'es. Julia Schneider',
    emailLabel: 'Indirizzo Email:',
    emailPlaceholder: 'nome@esempio.com',
    docsLabel: 'Documenti richiesti:',
    servicesTitle: '📄 Documenti e Richieste',
    servicesSub: 'Richiedi NIF, NISS o conto bancario online',
    checklistTitle: '📋 Primi 30 Giorni Roadmap',
    checklistSub: 'La tua guida burocratica per il Portogallo',
    checklistDone: 'completato',
    selectServices: 'Servizi richiesti:',
    serviceLabels: {
      nif: 'NIF (Codice Fiscale)',
      niss: 'NISS (Previdenza Sociale)',
      bank: 'Conto Bancario',
    },
    uploadPass: 'Allega Passaporto / Carta d\'Identità',
    uploadProof: 'Allega Prova di Domicilio',
    submitBtn: 'Invia Documenti (portustart@proton.me)',
    fileSelected: 'Pronto: ',
    supportTitle: 'Aiuto & Supporto',
    supportHelpText: 'Domande o problemi? Contatta l\'assistenza:',
    supportBtn: 'Contatta Supporto (portustart.support@proton.me)',
    calcTitle: '💶 Calcolatore Stipendio Netto',
    calcSub: 'Dipendente single senza figli (14 mensilità).',
    calcGrossLabel: 'Stipendio lordo mensile (€):',
    calcBtn: 'Calcola',
    calcNetMonthly: 'Netto stimato (al mese):',
    calc14Notice: 'Su base 14 mensilità',
    calcGrossRow: 'Lordo mensile:',
    calcSSRow: 'Previdenza Sociale (-11%):',
    calcIRSRow: 'Ritenuta IRS:',
    emergencyTitle: '🚨 Numeri di Emergenza',
    transitTitle: '🚆 Bus, Treni e Metro (Tutto il Portogallo)',
    transitSub: 'Orari, linee e abbonamenti da Porto a Faro',
    openLiveTransitBtn: 'Navigazione su Google Maps',
    welcomeTitle: 'Bem-vindo a PortuStart! 🇵🇹',
    welcomeSub: 'Il tuo compagno ideale per vivere in Portogallo.',
    guideStepRoadmapTitle: '1. Roadmap 30 Giorni',
    guideStepRoadmapDesc: 'Guida burocratica passo dopo passo.',
    guideStepServicesTitle: '2. Servizi Documenti',
    guideStepServicesDesc: 'Richiedi NIF, NISS e conto corrente.',
    guideStepTransitTitle: '3. Trasporti Pubblici',
    guideStepTransitDesc: 'Metro Porto, Lisbona, treni CP e abbonamenti economici.',
    guideStepEmergencyTitle: '4. Numeri di Emergenza',
    guideStepEmergencyDesc: 'Chiamata rapida per 112 e SNS 24.',
    guideStepSlangTitle: '5. Sintesi Vocale e Slang',
    guideStepSlangDesc: 'Microfono, ascolto audio e dialetto portoghese.',
    welcomeBtn: 'Ottimo, andiamo!',
    celebTitle: 'Parabéns! 🇵🇹🎉',
    celebSub: 'Hai completato tutti i 7 passaggi!',
    celebDesc: 'Hai completato tutte le pratiche essenziali per iniziare la tua nuova vita!',
    celebBtn: 'Muito obrigado! Avanti 🚀',
    checklist: [
      { id: 1, title: 'Ottenere il NIF (Codice Fiscale)', tip: 'Fondamentale per affitto, SIM, lavoro e banca.' },
      { id: 2, title: 'Scheda SIM portoghese', tip: 'Indispensabile per ricevere gli SMS dalle autorità locali.' },
      { id: 3, title: 'Aprire un conto bancario', tip: 'Necessario per accreditare lo stipendio e versare la caparra.' },
      { id: 4, title: 'Contratto di affitto e registrazione', tip: 'Il contratto deve essere registrato presso le Finanças.' },
      { id: 5, title: 'Numero di Previdenza Sociale (NISS)', tip: 'Obbligatorio per contratti di lavoro e contributi.' },
      { id: 6, title: 'Certificato di residenza (CRUE / AIMA)', tip: 'I cittadini UE si registrano dopo 3 mesi presso il Comune.' },
      { id: 7, title: 'Numero SNS (Sanità Pubblica)', tip: 'Garantisce l\'accesso ai centri sanitari pubblici (Centro de Saúde).' },
    ],
    phrases: [
      {
        category: 'Affitti e Case (Arrendamento)',
        color: '#0284C7',
        items: [
          { trans: 'L\'appartamento è ancora disponibile?', pt: 'O apartamento ainda está disponível?', ph: 'Oo ah-par-tah-men-too...' },
          { trans: 'A quanto ammonta la cauzione / anticipo?', pt: 'Quanto é a caução e quantos meses adiantados?', ph: 'Kwan-too eh ah kow-sow...' },
          { trans: 'Non ho un garante (Fiador).', pt: 'Não tenho fiador.', ph: 'Nowng teng-yoo fee-ah-dor.' },
        ],
      },
      {
        category: 'Uffici e Pratiche (Finanças / AIMA)',
        color: '#0F5132',
        items: [
          { trans: 'Devo richiedere il NIF.', pt: 'Preciso de pedir o NIF nas Finanças.', ph: 'Preh-see-zoo deh peh-deer oo neef...' },
          { trans: 'Ho un appuntamento all\'AIMA.', pt: 'Tenho uma marcação na AIMA.', ph: 'Ten-yoo oo-mah mar-kah-sah-oo...' },
        ],
      },
      {
        category: 'Ristoranti e Vita quotidiana',
        color: '#D97706',
        items: [
          { trans: 'Una birra alla spina, per favore.', pt: 'Uma imperial, por favor (Lisbona) / Um fino (Porto).', ph: 'Oo-mah eem-peh-ree-ahl' },
          { trans: 'Il conto, per favore.', pt: 'A conta, por favor.', ph: 'Ah kon-tah, poor fah-vor' },
        ],
      },
    ],
    emergencies: [
      { name: 'Emergenze (Polizia e Ambulanza)', num: '112', icon: 'flame', color: '#DC2626', desc: 'Numero unico europeo per emergenze gravi.' },
      { name: 'SNS 24 (Sanità Pubblica)', num: '808242424', icon: 'medkit', color: '#0F5132', desc: 'Assistenza medica preliminare prima dell\'ospedale.' },
      { name: 'Linha Migrante (AIMA / Integrazione)', num: '218106196', icon: 'people', color: '#0284C7', desc: 'Informazioni su permessi di soggiorno e visti.' },
    ],
  },
  uk: {
    title: 'PortuStart',
    sub: 'Ваш помічник для переїзду в Португалію',
    tabTrans: 'Перекладач',
    tabServices: 'Сервіси',
    tabCalc: 'Зарплата',
    tabGuide: 'Гід',
    from: 'З:',
    to: 'На:',
    inputLabel: 'Введення:',
    placeholderTrans: 'Введіть текст або говоріть...',
    btnTrans: 'Перекласти',
    listenBtn: 'Слухати',
    listeningNotice: '🎙 Слухаю... Говоріть зараз!',
    resultLabel: 'Результат',
    nameLabel: 'ПІБ (повне ім\'я):',
    namePlaceholder: 'напр. Юлія Шнайдер',
    emailLabel: 'Електронна пошта:',
    emailPlaceholder: 'name@example.com',
    docsLabel: 'Необхідні документи:',
    servicesTitle: '📄 Оформлення Документів',
    servicesSub: 'Отримайте NIF, NISS та банківський рахунок онлайн',
    checklistTitle: '📋 План дій на перші 30 днів',
    checklistSub: 'Покроковий гід португальською бюрократією',
    checklistDone: 'виконано',
    selectServices: 'Потрібні послуги:',
    serviceLabels: {
      nif: 'NIF (Податковий номер)',
      niss: 'NISS (Соціальне страхування)',
      bank: 'Банківський рахунок',
    },
    uploadPass: 'Додати Закордонний паспорт / ID',
    uploadProof: 'Додати Підтвердження адреси',
    submitBtn: 'Надіслати документи (portustart@proton.me)',
    fileSelected: 'Готово: ',
    supportTitle: 'Допомога та підтримка',
    supportHelpText: 'Є питання? Зв\'яжіться з нашою підтримкою:',
    supportBtn: 'Написати в підтримку (portustart.support@proton.me)',
    calcTitle: '💶 Калькулятор Чистої Зарплати',
    calcSub: 'Штатний працівник, 14 виплат на рік.',
    calcGrossLabel: 'Місячна зарплата до податків (€):',
    calcBtn: 'Розрахувати',
    calcNetMonthly: 'Чистими на місяць:',
    calc14Notice: 'Розраховано на 14 виплат (з відпускними)',
    calcGrossRow: 'Брутто на місяць:',
    calcSSRow: 'Соціальний внесок (-11%):',
    calcIRSRow: 'Податок IRS:',
    emergencyTitle: '🚨 Важливі контакти та екстрені служби',
    transitTitle: '🚆 Транспорт: Поїзди, Автобуси, Метро',
    transitSub: 'Розклад, схеми ліній та проїзні по всій Португалії',
    openLiveTransitBtn: 'Маршрут у Google Maps',
    welcomeTitle: 'Ласкаво просимо до PortuStart! 🇵🇹',
    welcomeSub: 'Ваш комфортний старт для життя в Португалії.',
    guideStepRoadmapTitle: '1. Перші 30 днів',
    guideStepRoadmapDesc: 'Покроковий чек-лист оформлення документів.',
    guideStepServicesTitle: '2. Документи та сервіси',
    guideStepServicesDesc: 'Оформлення NIF, NISS та банківського рахунку.',
    guideStepTransitTitle: '3. Транспорт по всій країні',
    guideStepTransitDesc: 'Метро Порту, Лісабона, поїзди CP та проїзні.',
    guideStepEmergencyTitle: '4. Екстрений зв\'язок',
    guideStepEmergencyDesc: 'Швидкий дзвінок на 112 та медичну лінію SNS 24.',
    guideStepSlangTitle: '5. Голосовий перекладач та сленг',
    guideStepSlangDesc: 'Диктування голосом, озвучування та корисні фрази.',
    welcomeBtn: 'Зрозуміло, розпочати!',
    celebTitle: 'Parabéns! 🇵🇹🎉',
    celebSub: 'Ви виконали всі 7 кроків!',
    celebDesc: 'Ви успішно пройшли всі головні бюрократичні кроки в Португалії!',
    celebBtn: 'Muito obrigado! Вперед 🚀',
    checklist: [
      { id: 1, title: 'Отримати податковий номер (NIF)', tip: 'Ключ до оренди житла, контракту на інтернет та банку.' },
      { id: 2, title: 'Місцева португальська SIM-карта', tip: 'Обов\'язкова для реєстрації на держпорталах через SMS.' },
      { id: 3, title: 'Відкрити банківський рахунок', tip: 'Потрібен для виплати заробітної плати та депозиту за житло.' },
      { id: 4, title: 'Договір оренди та реєстрація', tip: 'Договір оренди обов\'язково реєструється в Finanças.' },
      { id: 5, title: 'Номер соцстрахування (NISS)', tip: 'Потрібен для офіційного працевлаштування та виплат.' },
      { id: 6, title: 'Реєстрація резиденції (CRUE / AIMA)', tip: 'Громадяни ЄС реєструються після 3 місяців у мерії (Câmara).' },
      { id: 7, title: 'Медичний номер SNS (Centro de Saúde)', tip: 'Доступ до сімейних лікарів та державних лікарень.' },
    ],
    phrases: [
      {
        category: 'Оренда та житло (Arrendamento)',
        color: '#0284C7',
        items: [
          { trans: 'Квартира ще вільна?', pt: 'O apartamento ainda está disponível?', ph: 'Oo ah-par-tah-men-too...' },
          { trans: 'Скільки складає застава та аванс?', pt: 'Quanto é a caução e quantos meses adiantados?', ph: 'Kwan-too eh ah kow-sow...' },
          { trans: 'У мене немає поручителя (Fiador).', pt: 'Não tenho fiador.', ph: 'Nowng teng-yoo fee-ah-dor.' },
        ],
      },
      {
        category: 'Державні органи (Finanças / AIMA)',
        color: '#0F5132',
        items: [
          { trans: 'Мені потрібно оформити NIF.', pt: 'Preciso de pedir o NIF nas Finanças.', ph: 'Preh-see-zoo deh peh-deer oo neef...' },
          { trans: 'У мене запис в AIMA.', pt: 'Tenho uma marcação na AIMA.', ph: 'Ten-yoo oo-mah mar-kah-sah-oo...' },
        ],
      },
      {
        category: 'Кафе, ресторани та побут',
        color: '#D97706',
        items: [
          { trans: 'Розливне пиво, будь ласка.', pt: 'Uma imperial, por favor (Лісабон) / Um fino (Порту).', ph: 'Oo-mah eem-peh-ree-ahl' },
          { trans: 'Рахунок, будь ласка.', pt: 'A conta, por favor.', ph: 'Ah kon-tah, poor fah-vor' },
        ],
      },
    ],
    emergencies: [
      { name: 'Екстрена допомога (Поліція / Швидка)', num: '112', icon: 'flame', color: '#DC2626', desc: 'Єдиний європейський номер для термінового виклику.' },
      { name: 'SNS 24 (Медична консультація)', num: '808242424', icon: 'medkit', color: '#0F5132', desc: 'Первинна консультація лікаря (є англійська мова).' },
      { name: 'Linha Migrante (AIMA / Інтеграція)', num: '218106196', icon: 'people', color: '#0284C7', desc: 'Питання документів, легалізації та дозволів на проживання.' },
    ],
  },
};

const NATIONAL_TRANSIT_SYSTEMS = [
  {
    region: '🇵🇹 Landesweit / National',
    color: '#0F5132',
    items: [
      {
        name: 'CP - Comboios de Portugal (Bahn)',
        desc: 'Alfa Pendular (Schnellzug), Intercidades & Regionalzüge zwischen Lissabon, Porto, Coimbra, Braga & Faro.',
        link: 'https://www.cp.pt/passageiros/en',
      },
      {
        name: 'Rede Expressos (Fernbusse)',
        desc: 'Das größte Busnetz Portugals mit günstigen Verbindungen in jede Stadt und jedes Dorf.',
        link: 'https://rede-expressos.pt/en',
      },
    ],
  },
  {
    region: '🍷 Porto & Nordportugal',
    color: '#0284C7',
    items: [
      {
        name: 'Metro do Porto (6 Linien A–F)',
        desc: 'Moderne Stadtbahn, die Porto mit dem Flughafen, Matosinhos, Gaia & Maia verbindet.',
        link: 'https://www.metrodoporto.pt/en/',
      },
      {
        name: 'STCP (Stadtbusse & Trams Porto)',
        desc: 'Umfassendes Busnetz im Großraum Porto.',
        link: 'https://www.stcp.pt/en/travel/',
      },
      {
        name: 'Andante Ticket & App Anda',
        desc: 'Einheitliches Zonenkartensystem für alle Verkehrsmittel im Großraum Porto.',
        link: 'https://andante.pt/en/',
      },
    ],
  },
  {
    region: '☀️ Lissabon & Tejo-Region',
    color: '#D97706',
    items: [
      {
        name: 'Metro Lisboa (4 Linien)',
        desc: 'Blau, Gelb, Grün, Rot – verbindet Zentrum, Bahnhof Oriente & Flughafen Lissabon.',
        link: 'https://www.metrolisboa.pt/en/',
      },
      {
        name: 'Carris & Carris Metropolitana',
        desc: 'Busse, gelbe Straßenbahnen (z. B. 28E) und Überlandbusse bis Setúbal & Cascais.',
        link: 'https://www.carrismetropolitana.pt/',
      },
      {
        name: 'Navegante Pass (40 € Flatrate)',
        desc: 'Monatskarte für ausnahmslos alle Metros, Busse, Tejo-Fähren und CP-Züge (Sintra/Cascais).',
        link: 'https://www.navegante.pt/',
      },
    ],
  },
  {
    region: '🏖 Algarve & Inseln',
    color: '#7C3AED',
    items: [
      {
        name: 'VAMUS Algarve (Busnetz Südportugal)',
        desc: 'Linienbusse zwischen Faro, Albufeira, Lagos, Portimão und Tavira.',
        link: 'https://vamusalgarve.pt/#/pt/vamus%20algarve/routes',
      },
      {
        name: 'SIGA Madeira (ÖPNV Funchal & Insel)',
        desc: 'Neues integriertes Busnetz für die gesamte Insel Madeira.',
        link: 'https://siga.madeira.gov.pt/',
      },
    ],
  },
];

const IDIOM_DICTIONARY = [
  {
    triggers: ['voll cool', 'mega cool', 'voll geil', 'that is so cool', 'really cool'],
    pt: 'Isso é bué fixe!',
    explanation: '💡 Slang: "bué" = sehr/mega, "fixe" = cool/klasse.',
  },
  {
    triggers: ['bier trinken', 'lass ein bier trinken', 'have a beer', 'grab a beer'],
    pt: 'Bora beber uma imperial / um fino!',
    explanation: '💡 In Lissabon "imperial", im Norden rund um Porto sagt man "um fino".',
  },
  {
    triggers: ['keinen bock', 'kein bock', 'keine lust', 'no mood'],
    pt: 'Não me apetece nada!',
    explanation: '💡 Umgangssprachlich für "Ich habe überhaupt keine Lust darauf".',
  },
  {
    triggers: ['was geht', 'wie läuft es', 'whats up'],
    pt: 'Tudo bem, pá? Então, como é?',
    explanation: '💡 "Pá" ist das meistgenutzte Füllwort in Portugal (wie "Alter" oder "Mensch").',
  },
];

const PT_PT_REPLACEMENTS = {
  'trem': 'comboio',
  'ônibus': 'autocarro',
  'celular': 'telemóvel',
  'café da manhã': 'pequeno-almoço',
  'banheiro': 'casa de banho',
  'legal': 'fixe',
  'muito legal': 'bué fixe',
  'aluguel': 'arrendamento',
};

export default function App() {
  const [appLang, setAppLang] = useState('de');
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(true);
  const [celebrationModalVisible, setCelebrationModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  // Dynamische Lokalisierungsdaten laden
  const t = LOCALES[appLang] || LOCALES['de'];

  // Checkliste: Status merken (ID -> Boolean)
  const [checkedMap, setCheckedMap] = useState({});

  // Translator
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('de');
  const [targetLang, setTargetLang] = useState('pt');
  const [translatedText, setTranslatedText] = useState('');
  const [slangNote, setSlangNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Gehaltsrechner
  const [grossInput, setGrossInput] = useState('1500');
  const [calcResult, setCalcResult] = useState(null);

  // Services Formular
  const [selectedServices, setSelectedServices] = useState({ nif: true, niss: false, bank: false });
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [passportFileName, setPassportFileName] = useState('');
  const [proofFileName, setProofFileName] = useState('');

  // Checkliste abhaken
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
    const url = `tel:${number}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Info', `Nummer wählen: ${number}`);
    });
  };

  const openUrl = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Fehler', 'Link konnte nicht geöffnet werden.');
    });
  };

  // TEXT-TO-SPEECH
  const playAudio = (text, langCode = 'pt') => {
    if (!text) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voiceObj = TRANSLATOR_LANGUAGES.find((l) => l.code === langCode);
      utterance.lang = voiceObj ? voiceObj.voice : 'pt-PT';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      Alert.alert('Audio', `🗣 "${text}"`);
    }
  };

  // SPEECH-TO-TEXT
  const startSpeechRecognition = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        Alert.alert('Hinweis', 'Spracherkennung wird in diesem Browser nicht unterstützt (bitte Chrome oder Safari nutzen).');
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        const srcObj = TRANSLATOR_LANGUAGES.find((l) => l.code === sourceLang);
        recognition.lang = srcObj ? srcObj.voice : 'de-DE';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsRecording(true);

        recognition.onresult = (event) => {
          const spokenText = event.results[0][0].transcript;
          setInputText(spokenText);
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
      } catch {
        setIsRecording(false);
      }
    } else {
      Alert.alert('Hinweis', 'Spracheingabe ist in der Web-App verfügbar.');
    }
  };

  const pickFile = (type) => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,application/pdf';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          if (type === 'passport') setPassportFileName(file.name);
          if (type === 'proof') setProofFileName(file.name);
        }
      };
      input.click();
    } else {
      const mockName = type === 'passport' ? 'passport_scan.pdf' : 'proof_of_address.pdf';
      if (type === 'passport') setPassportFileName(mockName);
      if (type === 'proof') setProofFileName(mockName);
      Alert.alert('Datei bereitgestellt', mockName);
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

    if (!servicesList) {
      Alert.alert('Hinweis', 'Bitte mindestens einen Service auswählen.');
      return;
    }

    const subject = encodeURIComponent(`Neuer Auftrag: ${servicesList} - ${userName}`);
    const body = encodeURIComponent(
      `Hallo PortuStart Team,\n\n` +
      `ich möchte folgende Dienstleistungen anfragen:\n\n` +
      `📌 Services: ${servicesList}\n` +
      `👤 Name: ${userName}\n` +
      `📧 E-Mail: ${userEmail}\n\n` +
      `📁 Anhänge:\n` +
      `- Ausweis / Pass: ${passportFileName || 'Wird separat gemailt'}\n` +
      `- Wohnsitznachweis: ${proofFileName || 'Wird separat gemailt'}\n\n` +
      `Bitte prüft meine Daten und sendet mir die Auftragsbestätigung.`
    );

    const mailtoUrl = `mailto:portustart@proton.me?subject=${subject}&body=${body}`;
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert('E-Mail', 'Bitte schreibe an: portustart@proton.me');
    });
  };

  const handleSupportContact = () => {
    const subject = encodeURIComponent('PortuStart Support-Anfrage');
    const body = encodeURIComponent('Hallo Support-Team,\n\nich habe eine Frage bezüglich:\n\n');
    const mailtoUrl = `mailto:portustart.support@proton.me?subject=${subject}&body=${body}`;
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert('Support-Kontakt', 'Schreibe an: portustart.support@proton.me');
    });
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setTranslatedText('');
    setSlangNote('');

    const cleanInput = inputText.trim().toLowerCase();

    if (targetLang === 'pt') {
      const matched = IDIOM_DICTIONARY.find((item) => item.triggers.some((trig) => cleanInput.includes(trig)));
      if (matched) {
        setTranslatedText(matched.pt);
        setSlangNote(matched.explanation);
        setLoading(false);
        return;
      }
    }

    try {
      const langPair = `${sourceLang}|${targetLang}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText.trim())}&langpair=${langPair}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.responseData?.translatedText) {
        let result = data.responseData.translatedText;
        if (targetLang === 'pt') {
          let notes = [];
          Object.keys(PT_PT_REPLACEMENTS).forEach((key) => {
            const reg = new RegExp(`\\b${key}\\b`, 'gi');
            if (reg.test(result)) {
              result = result.replace(reg, PT_PT_REPLACEMENTS[key]);
              notes.push(`"${PT_PT_REPLACEMENTS[key]}"`);
            }
          });
          if (notes.length > 0) setSlangNote(`🇵🇹 Portugiesisch angepasst: ${notes.join(', ')}`);
        }
        setTranslatedText(result);
      } else {
        setTranslatedText('Übersetzung nicht verfügbar.');
      }
    } catch {
      setTranslatedText('Verbindungsfehler.');
    } finally {
      setLoading(false);
    }
  };

  const switchLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
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

        {/* Navigation Tabs */}
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'services' && styles.tabButtonActive]}
              onPress={() => setActiveTab('services')}
            >
              <Ionicons name="briefcase" size={14} color={activeTab === 'services' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'services' && styles.tabTextActive]}>{t.tabServices}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'trans' && styles.tabButtonActive]}
              onPress={() => setActiveTab('trans')}
            >
              <Ionicons name="chatbubbles" size={14} color={activeTab === 'trans' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'trans' && styles.tabTextActive]}>{t.tabTrans}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'calc' && styles.tabButtonActive]}
              onPress={() => {
                setActiveTab('calc');
                if (!calcResult) calculateNetSalary(grossInput);
              }}
            >
              <Ionicons name="calculator" size={14} color={activeTab === 'calc' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'calc' && styles.tabTextActive]}>{t.tabCalc}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'guide' && styles.tabButtonActive]}
              onPress={() => setActiveTab('guide')}
            >
              <Ionicons name="compass" size={14} color={activeTab === 'guide' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'guide' && styles.tabTextActive]}>{t.tabGuide}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TAB 1: SERVICES & CHECKLISTE */}
        {activeTab === 'services' && (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            
            {/* ROADMAP (VOLLSTÄNDIG ÜBERSETZT) */}
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

            {/* SERVICES ANTRÄGE */}
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
                autoCorrect={false}
              />

              <Text style={styles.inputFieldLabel}>{t.emailLabel}</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder={t.emailPlaceholder}
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={userEmail}
                onChangeText={setUserEmail}
              />

              <Text style={styles.inputFieldLabel}>{t.docsLabel}</Text>
              <TouchableOpacity style={styles.uploadBtn} onPress={() => pickFile('passport')}>
                <Ionicons name="cloud-upload-outline" size={18} color="#0F5132" style={{ marginRight: 6 }} />
                <Text style={styles.uploadBtnText}>
                  {passportFileName ? `${t.fileSelected} ${passportFileName}` : t.uploadPass}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadBtn} onPress={() => pickFile('proof')}>
                <Ionicons name="document-attach-outline" size={18} color="#0F5132" style={{ marginRight: 6 }} />
                <Text style={styles.uploadBtnText}>
                  {proofFileName ? `${t.fileSelected} ${proofFileName}` : t.uploadProof}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleServiceSubmit}>
                <Ionicons name="paper-plane" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.btnText}>{t.submitBtn}</Text>
              </TouchableOpacity>
            </View>

            {/* Support */}
            <View style={styles.supportCard}>
              <View style={styles.supportHeaderRow}>
                <Ionicons name="help-buoy" size={18} color="#0F5132" style={{ marginRight: 6 }} />
                <Text style={styles.supportHeaderTitle}>{t.supportTitle}</Text>
              </View>
              <Text style={styles.supportHelpText}>{t.supportHelpText}</Text>
              <TouchableOpacity style={styles.supportOutlineBtn} onPress={handleSupportContact}>
                <Ionicons name="mail-unread-outline" size={15} color="#0F5132" style={{ marginRight: 6 }} />
                <Text style={styles.supportOutlineBtnText}>{t.supportBtn}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* TAB 2: TRANSLATOR */}
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

              <View style={styles.dividerRow}>
                <TouchableOpacity style={styles.switchButton} onPress={switchLanguages}>
                  <Ionicons name="swap-vertical" size={16} color="#0F5132" />
                </TouchableOpacity>
              </View>

              <Text style={styles.miniLabel}>{t.to}</Text>
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
            </View>

            <View style={styles.card}>
              <View style={styles.inputActionRow}>
                <Text style={styles.miniLabel}>{t.inputLabel}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {inputText.trim() ? (
                    <TouchableOpacity onPress={() => playAudio(inputText, sourceLang)} style={styles.iconActionBtn}>
                      <Ionicons name="volume-medium" size={18} color="#0F5132" />
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    onPress={startSpeechRecognition}
                    style={[styles.micButton, isRecording && styles.micButtonActive]}
                  >
                    <Ionicons name={isRecording ? 'mic' : 'mic-outline'} size={18} color={isRecording ? '#fff' : '#0F5132'} />
                  </TouchableOpacity>
                </View>
              </View>

              {isRecording ? (
                <Text style={styles.recordingText}>{t.listeningNotice}</Text>
              ) : null}

              <TextInput
                style={styles.textInput}
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
                {slangNote ? <Text style={styles.slangNote}>{slangNote}</Text> : null}
              </View>
            ) : null}
          </ScrollView>
        )}

        {/* TAB 3: GEHALT */}
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

        {/* TAB 4: GUIDE */}
        {activeTab === 'guide' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* TRANSIT HUB */}
            <View style={styles.card}>
              <View style={styles.transitHeaderRow}>
                <Ionicons name="train" size={24} color="#0F5132" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionHeaderTitle}>{t.transitTitle}</Text>
                  <Text style={styles.subText}>{t.transitSub}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: '#0284C7', marginBottom: 12 }]}
                onPress={() => openUrl('https://www.google.com/maps/dir/?api=1&travelmode=transit')}
              >
                <Ionicons name="navigate-circle" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.btnText}>{t.openLiveTransitBtn}</Text>
              </TouchableOpacity>

              {NATIONAL_TRANSIT_SYSTEMS.map((reg, rIdx) => (
                <View key={rIdx} style={styles.regionCard}>
                  <Text style={[styles.regionTitle, { color: reg.color }]}>{reg.region}</Text>
                  {reg.items.map((sys, sIdx) => (
                    <TouchableOpacity
                      key={sIdx}
                      style={styles.transitLinkRow}
                      onPress={() => openUrl(sys.link)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.transitSystemName}>{sys.name}</Text>
                        <Text style={styles.transitSystemDesc}>{sys.desc}</Text>
                      </View>
                      <Ionicons name="open-outline" size={16} color="#0F5132" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>

            {/* NOTFALLNUMMERN (VOLLSTÄNDIG ÜBERSETZT) */}
            <View style={styles.guideSection}>
              <Text style={styles.sectionTitle}>{t.emergencyTitle}</Text>
              {t.emergencies.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.emergencyCard}
                  onPress={() => dialNumber(item.num)}
                >
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

            {/* REDEWENDUNGEN (VOLLSTÄNDIG ÜBERSETZT) */}
            {t.phrases.map((sec, i) => (
              <View key={i} style={styles.guideSection}>
                <Text style={[styles.sectionTitle, { color: sec.color }]}>{sec.category}</Text>
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
          </ScrollView>
        )}

        {/* 1. CELEBRATION MODAL */}
        <Modal
          visible={celebrationModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setCelebrationModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.celebrationCard}>
              <View style={styles.celebBadge}>
                <Ionicons name="trophy" size={32} color="#D97706" />
              </View>
              <Text style={styles.celebTitle}>{t.celebTitle}</Text>
              <Text style={styles.celebSub}>{t.celebSub}</Text>
              <Text style={styles.celebDesc}>{t.celebDesc}</Text>

              <TouchableOpacity
                style={styles.celebBtn}
                onPress={() => setCelebrationModalVisible(false)}
              >
                <Text style={styles.celebBtnText}>{t.celebBtn}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 2. ONBOARDING MODAL */}
        <Modal
          visible={welcomeModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setWelcomeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.onboardingCard}>
              <View style={styles.onboardingHeader}>
                <View style={styles.bridgeIconBadge}>
                  <Ionicons name="compass" size={26} color="#0F5132" />
                </View>
                <Text style={styles.onboardingTitle}>{t.welcomeTitle}</Text>
                <Text style={styles.onboardingSub}>{t.welcomeSub}</Text>
              </View>

              <ScrollView style={styles.onboardingScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.onboardingFeatureRow}>
                  <View style={[styles.featureIconWrap, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="checkbox" size={20} color="#0F5132" />
                  </View>
                  <View style={styles.featureTextWrap}>
                    <Text style={styles.featureTitle}>{t.guideStepRoadmapTitle}</Text>
                    <Text style={styles.featureDesc}>{t.guideStepRoadmapDesc}</Text>
                  </View>
                </View>

                <View style={styles.onboardingFeatureRow}>
                  <View style={[styles.featureIconWrap, { backgroundColor: '#E0F2FE' }]}>
                    <Ionicons name="document-text" size={20} color="#0284C7" />
                  </View>
                  <View style={styles.featureTextWrap}>
                    <Text style={styles.featureTitle}>{t.guideStepServicesTitle}</Text>
                    <Text style={styles.featureDesc}>{t.guideStepServicesDesc}</Text>
                  </View>
                </View>

                <View style={styles.onboardingFeatureRow}>
                  <View style={[styles.featureIconWrap, { backgroundColor: '#E0E7FF' }]}>
                    <Ionicons name="train" size={20} color="#4338CA" />
                  </View>
                  <View style={styles.featureTextWrap}>
                    <Text style={styles.featureTitle}>{t.guideStepTransitTitle}</Text>
                    <Text style={styles.featureDesc}>{t.guideStepTransitDesc}</Text>
                  </View>
                </View>

                <View style={styles.onboardingFeatureRow}>
                  <View style={[styles.featureIconWrap, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="call" size={20} color="#DC2626" />
                  </View>
                  <View style={styles.featureTextWrap}>
                    <Text style={styles.featureTitle}>{t.guideStepEmergencyTitle}</Text>
                    <Text style={styles.featureDesc}>{t.guideStepEmergencyDesc}</Text>
                  </View>
                </View>

                <View style={styles.onboardingFeatureRow}>
                  <View style={[styles.featureIconWrap, { backgroundColor: '#EDE9FE' }]}>
                    <Ionicons name="chatbubbles" size={20} color="#7C3AED" />
                  </View>
                  <View style={styles.featureTextWrap}>
                    <Text style={styles.featureTitle}>{t.guideStepSlangTitle}</Text>
                    <Text style={styles.featureDesc}>{t.guideStepSlangDesc}</Text>
                  </View>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.onboardingBtn}
                onPress={() => setWelcomeModalVisible(false)}
              >
                <Text style={styles.onboardingBtnText}>{t.welcomeBtn}</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 3. SPRACHAUSWAHL MODAL */}
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
  guideIconBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: 6,
    borderRadius: 12,
  },
  langSwitchHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  langSwitchHeaderText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  tabBarContainer: { paddingHorizontal: 12, marginTop: -16, marginBottom: 8, zIndex: 10 },
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
    flexDirection: 'row',
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    gap: 3,
  },
  tabButtonActive: { backgroundColor: '#0F5132' },
  tabText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
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
  miniLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
  langScroll: { paddingVertical: 4, gap: 6 },
  langChip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#F1F5F9' },
  langChipSelected: { backgroundColor: '#DCFCE7', borderColor: '#0F5132', borderWidth: 1.5 },
  langChipText: { fontSize: 12, fontWeight: '700', color: '#334155' },
  langChipTextSelected: { color: '#0F5132' },
  dividerRow: { alignItems: 'center', marginVertical: 4 },
  switchButton: { padding: 6, backgroundColor: '#F1F5F9', borderRadius: 15 },
  inputActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  iconActionBtn: { padding: 6, backgroundColor: '#F1F5F9', borderRadius: 8 },
  micButton: { padding: 6, backgroundColor: '#F0FDF4', borderRadius: 8, borderWidth: 1, borderColor: '#86EFAC' },
  micButtonActive: { backgroundColor: '#DC2626', borderColor: '#B91C1C' },
  recordingText: { fontSize: 12, color: '#DC2626', fontWeight: 'bold', marginVertical: 4 },
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
  resultCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    borderColor: '#BBF7D0',
    borderWidth: 1,
  },
  resultHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultHeader: { fontSize: 11, color: '#166534', fontWeight: '800', textTransform: 'uppercase' },
  resultBody: { fontSize: 16, color: '#14532D', fontWeight: '700', marginTop: 4 },
  slangNote: { fontSize: 12, color: '#0F5132', marginTop: 6, fontStyle: 'italic' },
  audioBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, gap: 3 },
  audioBtnText: { fontSize: 11, color: '#0F5132', fontWeight: 'bold' },
  sectionHeaderTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  subText: { fontSize: 12, color: '#64748B', marginTop: 2, marginBottom: 8 },
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
  uploadBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#86EFAC', borderStyle: 'dashed', borderRadius: 10, padding: 10, marginVertical: 3 },
  uploadBtnText: { fontSize: 11, color: '#0F5132', fontWeight: '600' },
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  supportHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  supportHeaderTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  supportHelpText: { fontSize: 12, color: '#64748B', marginBottom: 8 },
  supportOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F5132',
    backgroundColor: '#F0FDF4',
    marginTop: 8,
  },
  supportOutlineBtnText: { fontSize: 11, fontWeight: '700', color: '#0F5132' },
  calcResultCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  netLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
  netValue: { fontSize: 26, fontWeight: '900', color: '#0F5132', marginTop: 2 },
  netNote: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  calcDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  rowLabel: { fontSize: 12, color: '#64748B' },
  rowValue: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
  transitHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  regionCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  regionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 6 },
  transitLinkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#EDF2F7' },
  transitSystemName: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  transitSystemDesc: { fontSize: 10.5, color: '#64748B', marginTop: 1 },
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
  phraseCard: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  phraseHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ptText: { fontSize: 14, fontWeight: '700', color: '#0F172A', flex: 1 },
  phText: { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginVertical: 2 },
  deText: { fontSize: 12, color: '#334155' },
  celebrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  celebBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  celebTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', textAlign: 'center' },
  celebSub: { fontSize: 13, fontWeight: '700', color: '#0F5132', textAlign: 'center', marginTop: 4 },
  celebDesc: { fontSize: 12, color: '#475569', textAlign: 'center', marginTop: 10, lineHeight: 18 },
  celebBtn: {
    backgroundColor: '#0F5132',
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    width: '100%',
  },
  celebBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  onboardingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 380,
    maxHeight: '85%',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  onboardingHeader: { alignItems: 'center', marginBottom: 14 },
  bridgeIconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  onboardingTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
  onboardingSub: { fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 3 },
  onboardingScroll: { marginVertical: 4 },
  onboardingFeatureRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  featureTextWrap: { flex: 1 },
  featureTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  featureDesc: { fontSize: 11.5, color: '#475569', marginTop: 2, lineHeight: 16 },
  onboardingBtn: {
    backgroundColor: '#0F5132',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 6,
  },
  onboardingBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, width: '100%', maxWidth: 340 },
  modalTitle: { fontSize: 16, fontWeight: '800', textAlign: 'center', marginBottom: 12, color: '#0F172A' },
  modalGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  modalLangBtn: { width: '48%', backgroundColor: '#F8FAFC', paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: '#E2E8F0' },
  modalLangBtnActive: { borderColor: '#0F5132', backgroundColor: '#DCFCE7' },
  modalLangText: { fontSize: 12, fontWeight: '700', color: '#1E293B', marginTop: 2 },
  modalLangTextActive: { color: '#0F5132' },
});
