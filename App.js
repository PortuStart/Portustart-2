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

const UI_TEXTS = {
  de: {
    title: 'PortuStart',
    sub: 'Dein Relocation-Partner für Portugal',
    tabTrans: 'Translator',
    tabServices: 'Services',
    tabCalc: 'Gehalt',
    tabGuide: 'Guide',
    from: 'Von:',
    to: 'Nach:',
    placeholderTrans: 'Text oder Slang eingeben...',
    btnTrans: 'Übersetzen',
    servicesTitle: '📄 Dokumente & Anträge',
    servicesSub: 'Beantrage deine NIF, NISS oder Bankkonto direkt online',
    checklistTitle: '📋 Erste 30 Tage Roadmap',
    checklistSub: 'Dein bürokratischer Ablaufplan für Portugal',
    checklistDone: 'erledigt',
    selectServices: 'Benötigte Services:',
    uploadPass: 'Reisepass / Personalausweis anhängen',
    uploadProof: 'Wohnsitznachweis anhängen',
    submitBtn: 'Dokumente einreichen (portustart@proton.me)',
    fileSelected: 'Bereit: ',
    supportHelpText: 'Fragen oder Probleme? Unser Support hilft dir:',
    supportBtn: 'Support kontaktieren',
    calcTitle: '💶 Nettogehalt-Rechner',
    calcSub: 'Für Angestellte, Single ohne Kinder (14 Monatsgehälter).',
    calcGrossLabel: 'Monatliches Bruttogehalt (€):',
    calcBtn: 'Berechnen',
    calcNetMonthly: 'Geschätztes Netto (pro Monat):',
    calc14Notice: 'Basis: 14 Auszahlungen (inkl. Urlaubs-/Weihnachtsgeld)',
    calcGrossRow: 'Brutto / Monat:',
    calcSSRow: 'Sozialversicherung (-11%):',
    calcIRSRow: 'IRS Steuerabzug:',
    calcAnnualNet: 'Jahresnetto (14 Gehälter):',
    emergencyTitle: '🚨 Notfall- & Behördenkontakte',
    transitTitle: '🚇 Bus, Metro & Bahn (Transit Hub)',
    transitSub: 'Tickets, das 40€-Monatsticket & Live-Fahrpläne',
    openLiveTransitBtn: 'Live-Route in Google Maps öffnen',
    metroAppBtn: 'Offizielle Metro Lisboa Website',
    welcomeTitle: 'Bem-vindo zu PortuStart! 🇵🇹',
    welcomeSub: 'Dein entspannter Begleiter für das Leben und Ankommen in Portugal.',
    guideStepRoadmapTitle: '1. First 30 Days Roadmap',
    guideStepRoadmapDesc: 'Interaktiver Schritt-für-Schritt-Ablaufplan durch die Bürokratie mit Fortschrittsbalken.',
    guideStepServicesTitle: '2. Papiere & Anträge',
    guideStepServicesDesc: 'NIF, NISS und Bankkonto direkt über die App anfragen und per Mail an uns senden.',
    guideStepTransitTitle: '3. ÖPNV & 40€-Ticket Guide',
    guideStepTransitDesc: 'Erfahre, wie du mit dem Navegante-Ticket für 40€ im Monat alle Metros, Busse und Züge nutzt.',
    guideStepEmergencyTitle: '4. Notruf & Hotlines',
    guideStepEmergencyDesc: 'Ein-Klick-Direktwahl für Notruf (112), SNS 24 (Gesundheit) und Einwanderungshilfe.',
    guideStepSlangTitle: '5. Lissabon-Slang & Audio',
    guideStepSlangDesc: 'Übersetzer für 8 Sprachen mit lokaler Dialektanpassung und Sprachausgabe.',
    welcomeBtn: 'Alles klar, los geht\'s!',
    celebTitle: 'Parabéns! 🇵🇹🎉',
    celebSub: 'Du hast alle 7 Schritte der Roadmap gemeistert!',
    celebDesc: 'Vom NIF über das Bankkonto bis zur SNS-Gesundheitsnummer: Du hast das bürokratische Fundament gelegt und bist nun offiziell startklar für dein neues Leben in Portugal!',
    celebBtn: 'Muito obrigado! Weiter geht\'s 🚀',
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
    placeholderTrans: 'Enter text or slang...',
    btnTrans: 'Translate',
    servicesTitle: '📄 Document Services',
    servicesSub: 'Request your NIF, NISS or Bank Account online',
    checklistTitle: '📋 First 30 Days Roadmap',
    checklistSub: 'Your step-by-step relocation checklist',
    checklistDone: 'completed',
    selectServices: 'Required Services:',
    uploadPass: 'Attach Passport / ID',
    uploadProof: 'Attach Proof of Address',
    submitBtn: 'Submit Documents (portustart@proton.me)',
    fileSelected: 'Ready: ',
    supportHelpText: 'Questions or issues? Contact support:',
    supportBtn: 'Contact Support',
    calcTitle: '💶 Net Salary Calculator',
    calcSub: 'Single employee, mainland Portugal (14 payments).',
    calcGrossLabel: 'Monthly Gross Salary (€):',
    calcBtn: 'Calculate',
    calcNetMonthly: 'Estimated Net (Monthly):',
    calc14Notice: 'Based on standard 14 payments / year',
    calcGrossRow: 'Monthly Gross:',
    calcSSRow: 'Social Security (-11%):',
    calcIRSRow: 'IRS Withholding:',
    calcAnnualNet: 'Annual Net (14 salaries):',
    emergencyTitle: '🚨 Emergency & Support Contacts',
    transitTitle: '🚇 Bus, Metro & Trains (Transit Hub)',
    transitSub: 'Tickets, the 40€ monthly pass & live timetables',
    openLiveTransitBtn: 'Open Live Transit in Maps',
    metroAppBtn: 'Official Metro Lisboa Website',
    welcomeTitle: 'Welcome to PortuStart! 🇵🇹',
    welcomeSub: 'Your relaxed companion for settling into life in Portugal.',
    guideStepRoadmapTitle: '1. First 30 Days Roadmap',
    guideStepRoadmapDesc: 'Interactive checklist guiding you through Portuguese paperwork.',
    guideStepServicesTitle: '2. Document Services',
    guideStepServicesDesc: 'Apply for NIF, NISS & bank accounts right in the app.',
    guideStepTransitTitle: '3. Public Transport & 40€ Pass',
    guideStepTransitDesc: 'Everything about the Navegante card and navigating buses, trains and metro.',
    guideStepEmergencyTitle: '4. Emergency & Support Dial',
    guideStepEmergencyDesc: 'One-tap dialing for Emergency (112), SNS 24 and immigration hotlines.',
    guideStepSlangTitle: '5. Authentic Lisbon Slang',
    guideStepSlangDesc: '8-language translator tailored to local dialect with audio.',
    welcomeBtn: 'Got it, let\'s start!',
    celebTitle: 'Parabéns! 🇵🇹🎉',
    celebSub: 'You completed all 7 roadmap milestones!',
    celebDesc: 'From your NIF and bank account to your SNS healthcare number: you conquered Portuguese paperwork and are ready to thrive!',
    celebBtn: 'Muito obrigado! Let\'s go 🚀',
  },
};

const TRANSLATOR_LANGUAGES = [
  { code: 'pt', label: 'PT', flag: '🇵🇹' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'it', label: 'IT', flag: '🇮🇹' },
  { code: 'uk', label: 'UKR', flag: '🇺🇦' },
  { code: 'hi', label: 'HIN', flag: '🇮🇳' },
];

const EMERGENCY_CONTACTS = [
  {
    name: 'Notruf (Polizei & Krankenwagen)',
    num: '112',
    icon: 'flame',
    color: '#DC2626',
    desc: 'Zentraler EU-Notruf für akute Notfälle.',
  },
  {
    name: 'SNS 24 (Gesundheitshotline)',
    num: '808242424',
    icon: 'medkit',
    color: '#0F5132',
    desc: 'Medizinische Beratung vor Klinikbesuch (auch Englisch).',
  },
  {
    name: 'Linha Migrante (AIMA / Integration)',
    num: '218106196',
    icon: 'people',
    color: '#0284C7',
    desc: 'Auskünfte zu Einwanderung, Dokumenten und Aufenthalt.',
  },
];

const INITIAL_CHECKLIST = [
  { id: 1, title: 'Steuernummer (NIF) beantragen', tip: 'Der Schlüssel für alles in Portugal (Miete, Vertrag, SIM).', done: false },
  { id: 2, title: 'Portugiesische SIM-Karte besorgen', tip: 'Notwendig für die mobile Autorisierung bei Ämtern (MEO, NOS, Vodafone).', done: false },
  { id: 3, title: 'Bankkonto eröffnen', tip: 'Erforderlich für Gehaltseingang & Wohnungskaution.', done: false },
  { id: 4, title: 'Wohnungsanmietung & Registrierung', tip: 'Mietvertrag muss von Finanças registriert sein.', done: false },
  { id: 5, title: 'Sozialversicherungsnummer (NISS)', tip: 'Wird für Arbeitsantritt & Absicherung benötigt.', done: false },
  { id: 6, title: 'Aufenthaltsrecht (CRUE / AIMA)', tip: 'EU-Bürger melden sich nach 3 Monaten bei der Câmara Municipal.', done: false },
  { id: 7, title: 'SNS-Gesundheitsnummer (Centro de Saúde)', tip: 'Zugang zum staatlichen Gesundheitssystem sichern.', done: false },
];

const METRO_LINES = [
  { name: 'Linha Azul (Blau)', code: 'Santa Apolónia ↔ Reboleira', color: '#0284C7' },
  { name: 'Linha Amarela (Gelb)', code: 'Rato ↔ Odivelas', color: '#EAB308' },
  { name: 'Linha Verde (Grün)', code: 'Cais do Sodré ↔ Telheiras', color: '#10B981' },
  { name: 'Linha Vermelha (Rot)', code: 'São Sebastião ↔ Aeroporto (Flughafen)', color: '#EF4444' },
];

const QUICK_PHRASES = [
  {
    category: 'Wohnungssuche & Miete (Arrendamento)',
    color: '#0284C7',
    items: [
      { trans: 'Ist die Wohnung noch verfügbar?', pt: 'O apartamento ainda está disponível?', ph: 'Oo ah-par-tah-men-too eye-ndah esh-tah deesh-poo-nee-vel?' },
      { trans: 'Wie hoch ist die Kaution / Monatsmieten im Voraus?', pt: 'Quanto é a caução e quantos meses adiantados?', ph: 'Kwan-too eh ah kow-sow ee kwan-toosh meh-zesh...?' },
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
      { trans: 'Ein gezapftes Bier, bitte.', pt: 'Uma imperial, por favor.', ph: 'Oo-mah eem-peh-ree-ahl, poor fah-vor' },
      { trans: 'Die Rechnung, bitte.', pt: 'A conta, por favor.', ph: 'Ah kon-tah, poor fah-vor' },
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
    pt: 'Bora beber uma imperial!',
    explanation: '💡 In Lissabon bestellt man Bier vom Fass als "imperial" (nicht "chope").',
  },
  {
    triggers: ['keinen bock', 'kein bock', 'keine lust', 'no mood'],
    pt: 'Nicht Lust darauf.',
    explanation: '💡 Umgangssprachlich für "Ich habe überhaupt keine Lust darauf".',
  },
  {
    triggers: ['was geht', 'wie läuft es', 'whats up'],
    pt: 'Tudo bem, pá? Então, como é?',
    explanation: '💡 "Pá" ist das typischste Füllwort in Lissabon (wie "Alter" oder "Mensch").',
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

  const t = UI_TEXTS[appLang] || UI_TEXTS['en'];

  // Checkliste
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);

  // Translator
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('de');
  const [targetLang, setTargetLang] = useState('pt');
  const [translatedText, setTranslatedText] = useState('');
  const [slangNote, setSlangNote] = useState('');
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

  const toggleChecklistItem = (id) => {
    const updated = checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item));
    setChecklist(updated);

    const doneCount = updated.filter((item) => item.done).length;
    if (doneCount === updated.length) {
      setCelebrationModalVisible(true);
    }
  };

  const completedCount = checklist.filter((item) => item.done).length;

  const dialNumber = (number) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Hinweis', `Wähle die Nummer manuell: ${number}`);
    });
  };

  const openUrl = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Fehler', 'Link konnte nicht geöffnet werden.');
    });
  };

  const playAudio = (text) => {
    if (!text) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-PT';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      Alert.alert('Audio', `🗣 "${text}"`);
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
      const mockName = type === 'passport' ? 'reisepass_scan.pdf' : 'wohnsitz_nachweis.pdf';
      if (type === 'passport') setPassportFileName(mockName);
      if (type === 'proof') setProofFileName(mockName);
      Alert.alert('Datei ausgewählt', mockName);
    }
  };

  const handleServiceSubmit = () => {
    if (!userName.trim() || !userEmail.trim()) {
      Alert.alert('Hinweis', 'Bitte Namen und E-Mail-Adresse angeben.');
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
      `ich möchte folgende Dienstleistungen in Auftrag geben:\n\n` +
      `📌 Services: ${servicesList}\n` +
      `👤 Name: ${userName}\n` +
      `📧 E-Mail: ${userEmail}\n\n` +
      `📁 Bereitgestellte Dokumente:\n` +
      `- Ausweis / Pass: ${passportFileName || 'Wird per E-Mail angehängt'}\n` +
      `- Wohnsitznachweis: ${proofFileName || 'Wird per E-Mail angehängt'}\n\n` +
      `Bitte prüft meine Daten und sendet mir die Auftragsbestätigung.`
    );

    const mailtoUrl = `mailto:portustart@proton.me?subject=${subject}&body=${body}`;

    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert('E-Mail', 'Bitte sende deine Unterlagen an: portustart@proton.me');
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
          if (notes.length > 0) setSlangNote(`🇵🇹 Für Lissabon angepasst: ${notes.join(', ')}`);
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
                <Ionicons name="globe-outline" size={14} color="#fff" style={{ marginRight: 3 }} />
                <Text style={styles.langSwitchHeaderText}>
                  {UI_LANGUAGES.find((l) => l.code === appLang)?.flag} {appLang.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Menüleiste */}
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
              <Ionicons name="book" size={14} color={activeTab === 'guide' ? '#fff' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'guide' && styles.tabTextActive]}>{t.tabGuide}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TAB: SERVICES */}
        {activeTab === 'services' && (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            
            {/* ROADMAP */}
            <View style={styles.card}>
              <View style={styles.checklistHeaderRow}>
                <View>
                  <Text style={styles.sectionHeaderTitle}>{t.checklistTitle}</Text>
                  <Text style={styles.subText}>{t.checklistSub}</Text>
                </View>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>
                    {completedCount} / {checklist.length} {t.checklistDone}
                  </Text>
                </View>
              </View>

              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${(completedCount / checklist.length) * 100}%` }]} />
              </View>

              {checklist.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.checklistItem, item.done && styles.checklistItemDone]}
                  onPress={() => toggleChecklistItem(item.id)}
                >
                  <Ionicons
                    name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={item.done ? '#0F5132' : '#94A3B8'}
                    style={{ marginRight: 10, marginTop: 2 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.checklistText, item.done && styles.checklistTextDone]}>
                      {item.title}
                    </Text>
                    <Text style={styles.checklistTip}>{item.tip}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* ANTRAGS-FORMULAR */}
            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>{t.servicesTitle}</Text>
              <Text style={styles.subText}>{t.servicesSub}</Text>

              <Text style={styles.inputFieldLabel}>{t.selectServices}</Text>
              <View style={styles.serviceSelectorRow}>
                {[
                  { key: 'nif', label: 'NIF (Steuernummer)' },
                  { key: 'niss', label: 'NISS (Sozialversicherung)' },
                  { key: 'bank', label: 'Bankkonto' },
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

              <Text style={styles.inputFieldLabel}>Vollständiger Name:</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="z. B. Julia Schneider"
                placeholderTextColor="#94A3B8"
                value={userName}
                onChangeText={setUserName}
                autoCorrect={false}
                autoCapitalize="words"
                editable={true}
              />

              <Text style={styles.inputFieldLabel}>E-Mail-Adresse:</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="name@example.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={userEmail}
                onChangeText={setUserEmail}
                editable={true}
              />

              <Text style={styles.inputFieldLabel}>Erforderliche Dokumente:</Text>
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
                <Text style={styles.supportHeaderTitle}>Hilfe & Support</Text>
              </View>
              <Text style={styles.supportHelpText}>{t.supportHelpText}</Text>
              <TouchableOpacity style={styles.supportOutlineBtn} onPress={handleSupportContact}>
                <Ionicons name="mail-unread-outline" size={15} color="#0F5132" style={{ marginRight: 6 }} />
                <Text style={styles.supportOutlineBtnText}>{t.supportBtn} (portustart.support@proton.me)</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* TAB: TRANSLATOR */}
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
              <TextInput
                style={styles.textInput}
                placeholder={t.placeholderTrans}
                placeholderTextColor="#94A3B8"
                value={inputText}
                onChangeText={setInputText}
                multiline
                editable={true}
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
                  <Text style={styles.resultHeader}>Ergebnis ({targetLang.toUpperCase()}):</Text>
                  {targetLang === 'pt' && (
                    <TouchableOpacity style={styles.audioBtn} onPress={() => playAudio(translatedText)}>
                      <Ionicons name="volume-high" size={16} color="#0F5132" />
                      <Text style={styles.audioBtnText}>Anhören</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.resultBody}>{translatedText}</Text>
                {slangNote ? <Text style={styles.slangNote}>{slangNote}</Text> : null}
              </View>
            ) : null}
          </ScrollView>
        )}

        {/* TAB: GEHALT */}
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
                editable={true}
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

        {/* TAB: GUIDE */}
        {activeTab === 'guide' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* ÖPNV & TRANSIT HUB */}
            <View style={styles.card}>
              <View style={styles.transitHeaderRow}>
                <Ionicons name="train" size={22} color="#0F5132" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionHeaderTitle}>{t.transitTitle}</Text>
                  <Text style={styles.subText}>{t.transitSub}</Text>
                </View>
              </View>

              <View style={styles.naveganteCard}>
                <View style={styles.naveganteTop}>
                  <Text style={styles.naveganteBadge}>Spar-Tipp: 40 € / Monat</Text>
                  <Text style={styles.naveganteTitle}>Navegante Metropolitano</Text>
                </View>
                <Text style={styles.naveganteText}>
                  Gilt unbegrenzt für Metro, Busse (Carris), Vorortzüge (CP nach Cascais & Sintra, Fertagus) und Fähren in allen 18 Bezirken rund um Lissabon.
                </Text>
                <View style={styles.zappingRow}>
                  <Ionicons name="card-outline" size={16} color="#0F5132" style={{ marginRight: 6 }} />
                  <Text style={styles.zappingText}>
                    <Text style={{ fontWeight: 'bold' }}>Zapping:</Text> Lade 5–40 € auf die grüne Viva-Karte. Einzelfahrten kosten so ca. 1,61 € statt 2,00 €+ beim Busfahrer.
                  </Text>
                </View>
              </View>

              <Text style={[styles.inputFieldLabel, { marginTop: 10 }]}>Metro Lissabon Liniennetz:</Text>
              <View style={styles.metroLinesContainer}>
                {METRO_LINES.map((m, idx) => (
                  <View key={idx} style={styles.metroLineRow}>
                    <View style={[styles.metroDot, { backgroundColor: m.color }]} />
                    <Text style={styles.metroLineName}>{m.name}:</Text>
                    <Text style={styles.metroLineCode}>{m.code}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: '#0284C7', marginTop: 12 }]}
                onPress={() => openUrl('https://www.google.com/maps/dir/?api=1&travelmode=transit')}
              >
                <Ionicons name="navigate-circle" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.btnText}>{t.openLiveTransitBtn}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.supportOutlineBtn}
                onPress={() => openUrl('https://www.metrolisboa.pt/en/')}
              >
                <Ionicons name="globe-outline" size={15} color="#0F5132" style={{ marginRight: 6 }} />
                <Text style={styles.supportOutlineBtnText}>{t.metroAppBtn}</Text>
              </TouchableOpacity>
            </View>

            {/* NOTFALLNUMMERN */}
            <View style={styles.guideSection}>
              <Text style={styles.sectionTitle}>{t.emergencyTitle}</Text>
              {EMERGENCY_CONTACTS.map((item, idx) => (
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

            {/* PHRASEN */}
            {QUICK_PHRASES.map((sec, i) => (
              <View key={i} style={styles.guideSection}>
                <Text style={[styles.sectionTitle, { color: sec.color }]}>{sec.category}</Text>
                {sec.items.map((item, idx) => (
                  <View key={idx} style={styles.phraseCard}>
                    <View style={styles.phraseHeaderRow}>
                      <Text style={styles.ptText}>{item.pt}</Text>
                      <TouchableOpacity onPress={() => playAudio(item.pt)} style={{ padding: 4 }}>
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

        {/* 2. ONBOARDING-GUIDE MODAL */}
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
  
  // Transit Hub Styles
  transitHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  naveganteCard: { backgroundColor: '#F0FDF4', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0', marginVertical: 6 },
  naveganteTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  naveganteBadge: { fontSize: 10, fontWeight: '800', color: '#0F5132', backgroundColor: '#DCFCE7', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6 },
  naveganteTitle: { fontSize: 12, fontWeight: '800', color: '#166534' },
  naveganteText: { fontSize: 11, color: '#14532D', lineHeight: 15 },
  zappingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#DCFCE7' },
  zappingText: { fontSize: 10.5, color: '#15803D', flex: 1 },
  metroLinesContainer: { gap: 4, marginTop: 4 },
  metroLineRow: { flexDirection: 'row', alignItems: 'center' },
  metroDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  metroLineName: { fontSize: 11, fontWeight: '700', color: '#0F172A', marginRight: 4 },
  metroLineCode: { fontSize: 11, color: '#64748B', flex: 1 },

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
