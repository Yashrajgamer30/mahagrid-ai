/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Internationalization (i18n) Dictionary & Engine
   Supports English (en), हिन्दी (hi), and मराठी (mr) with safe
   fallbacks, Devanagari typography, and localized formatting.
   ────────────────────────────────────────────────────────────────── */

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🚩' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Brand & Hero
    'brand.name': 'MahaGrid AI',
    'brand.tagline': 'SMART GRID DIGITAL TWIN',
    'hero.headline': 'Smarter Grid. Safer Tomorrow.',
    'hero.subtitle': 'Physics-informed digital twin and SCADA intelligence platform for Maharashtra state electrical distribution.',

    // Navigation Sections
    'nav.section.overview': 'Overview',
    'nav.section.operations': 'Operations',
    'nav.section.assets': 'Asset Infrastructure',
    'nav.section.intelligence': 'Intelligence & Analytics',
    'nav.section.system': 'System & Administration',
    'nav.section.field': 'Field Operations',
    'nav.section.spatial': 'Spatial & Grid',
    'nav.section.regional': 'Regional Oversight',

    // Navigation Items
    'nav.dashboard': 'Executive Dashboard',
    'nav.map': 'Live GIS Map',
    'nav.topology': 'Topology Engine',
    'nav.outages': 'Outages & Tripping',
    'nav.faultLocator': 'Fault Locator',
    'nav.maintenance': 'Maintenance Orders',
    'nav.assets': 'All Assets',
    'nav.substations': 'Substations',
    'nav.transformers': 'Transformers',
    'nav.feeders': 'Feeders & Lines',
    'nav.junctions': 'Junctions',
    'nav.meters': 'Smart Meters',
    'nav.devices': 'IoT Devices',
    'nav.aiAnalysis': 'AI Diagnosis',
    'nav.analytics': 'Analytics',
    'nav.reports': 'Executive Reports',
    'nav.simulation': 'Simulation Lab',
    'nav.notifications': 'Notifications',
    'nav.users': 'User RBAC',
    'nav.settings': 'Settings & Rules',

    // Topbar & Actions
    'topbar.searchPlaceholder': 'Search 33kV substations, transformers, feeders, faults…',
    'topbar.districtSelect': 'Select Maharashtra Circle',
    'topbar.connected': 'Connected',
    'topbar.connecting': 'Connecting…',
    'topbar.disconnected': 'Disconnected',
    'topbar.demoMode': 'DEMO TWIN',
    'topbar.switchPortal': 'SWITCH ROLE PORTAL (DEMO)',
    'topbar.myProfile': 'My Profile',
    'topbar.appearance': 'Appearance & Theme',
    'topbar.language': 'Language & Region',
    'topbar.preferences': 'Preferences',
    'topbar.security': 'Security',
    'topbar.signOut': 'Sign Out',

    // Portals & Roles
    'portal.admin': 'Admin Portal',
    'portal.adminRole': 'Chief Grid Engineer',
    'portal.adminDesc': 'Central Control, Users, Assets & Digital Twin Simulation',
    'portal.maintenance': 'Maintenance Portal',
    'portal.maintenanceRole': 'Field Squad Lead',
    'portal.maintenanceDesc': 'Work Orders, Repairs & Restorations',
    'portal.manager': 'Manager Portal',
    'portal.managerRole': 'Regional Shift In-Charge',
    'portal.managerDesc': 'Regional Outages & Analytics',

    // Common Buttons & Actions
    'action.save': 'Save Changes',
    'action.cancel': 'Cancel',
    'action.apply': 'Apply Preferences',
    'action.reset': 'Reset to Defaults',
    'action.signIn': 'Sign In',
    'action.continue': 'Continue',
    'action.back': 'Back',
    'action.export': 'Export Data',
    'action.filter': 'Filter',
    'action.refresh': 'Refresh Telemetry',
    'action.close': 'Close',

    // Settings Tabs
    'settings.title': 'Grid Control Settings & Preferences',
    'settings.subtitle': 'Appearance, language localization, telemetry thresholds, notification rules, and role preferences.',
    'settings.tab.appearance': 'Appearance & Theme',
    'settings.tab.language': 'Language & Region',
    'settings.tab.notifications': 'Notifications',
    'settings.tab.map': 'Map & GIS',
    'settings.tab.data': 'Dashboard & Data',
    'settings.tab.profile': 'Profile & Security',
    'settings.tab.thresholds': 'Alert Thresholds',

    // Theme Options
    'theme.cinematic': 'Cinematic Grid (Default)',
    'theme.cinematicDesc': 'Deep midnight charcoal, luminous teal pulses, and refined glass panels matching the cinematic reference.',
    'theme.light': 'Light Utility',
    'theme.lightDesc': 'Classic ivory, forest green, and high contrast for daytime field utility operations.',
    'theme.highContrast': 'High Contrast',
    'theme.highContrastDesc': 'Ultra-high contrast black background with vivid neon markers for low-vision accessibility.',

    // Status
    'status.normal': 'Normal',
    'status.warning': 'Warning',
    'status.critical': 'Critical Alert',
    'status.offline': 'Offline',
    'status.sync': 'Synchronized',
  },

  hi: {
    // Brand & Hero
    'brand.name': 'महाग्रिड एआई',
    'brand.tagline': 'स्मार्ट ग्रिड डिजिटल ट्विन',
    'hero.headline': 'स्मार्ट ग्रिड। सुरक्षित कल।',
    'hero.subtitle': 'महाराष्ट्र राज्य विद्युत वितरण के लिए भौतिकी-आधारित डिजिटल ट्विन और स्काडा बुद्धिमत्ता मंच।',

    // Navigation Sections
    'nav.section.overview': 'सिंहावलोकन',
    'nav.section.operations': 'संचालन एवं सुधार',
    'nav.section.assets': 'ग्रिड परिसंपत्तियां',
    'nav.section.intelligence': 'एआई एवं विश्लेषिकी',
    'nav.section.system': 'प्रणाली एवं प्रशासन',
    'nav.section.field': 'क्षेत्रीय संचालन',
    'nav.section.spatial': 'स्थानिक एवं ग्रिड',
    'nav.section.regional': 'क्षेत्रीय निगरानी',

    // Navigation Items
    'nav.dashboard': 'कार्यकारी डैशबोर्ड',
    'nav.map': 'लाइव जीआईएस मानचित्र',
    'nav.topology': 'टोपोलॉजी इंजन',
    'nav.outages': 'विद्युत कटौती एवं ट्रिपिंग',
    'nav.faultLocator': 'दोष स्थान निर्धारक',
    'nav.maintenance': 'रखरखाव कार्य आदेश',
    'nav.assets': 'समस्त परिसंपत्तियां',
    'nav.substations': 'सबस्टेशन',
    'nav.transformers': 'ट्रांसफार्मर',
    'nav.feeders': 'फीडर एवं लाइनें',
    'nav.junctions': 'जंक्शन',
    'nav.meters': 'स्मार्ट मीटर',
    'nav.devices': 'आईओटी उपकरण',
    'nav.aiAnalysis': 'एआई निदान',
    'nav.analytics': 'विश्लेषिकी',
    'nav.reports': 'कार्यकारी रिपोर्ट',
    'nav.simulation': 'सिमुलेशन लैब',
    'nav.notifications': 'अधिसूचनाएं',
    'nav.users': 'उपयोगकर्ता प्रबंधन',
    'nav.settings': 'सेटिंग्स एवं नियम',

    // Topbar & Actions
    'topbar.searchPlaceholder': 'सबस्टेशन, ट्रांसफार्मर, फीडर, दोष खोजें…',
    'topbar.districtSelect': 'महाराष्ट्र मंडल चुनें',
    'topbar.connected': 'संबद्ध',
    'topbar.connecting': 'संबद्ध हो रहा है…',
    'topbar.disconnected': 'संपर्क टूटा',
    'topbar.demoMode': 'डेमो ट्विन',
    'topbar.switchPortal': 'पोर्टल भूमिका बदलें (डेमो)',
    'topbar.myProfile': 'मेरी प्रोफ़ाइल',
    'topbar.appearance': 'रंग-रूप एवं थीम',
    'topbar.language': 'भाषा एवं क्षेत्र',
    'topbar.preferences': 'प्राथमिकताएं',
    'topbar.security': 'सुरक्षा',
    'topbar.signOut': 'साइन आउट',

    // Portals & Roles
    'portal.admin': 'एडमिन पोर्टल',
    'portal.adminRole': 'मुख्य ग्रिड अभियंता',
    'portal.adminDesc': 'केंद्रीय नियंत्रण, उपयोगकर्ता, परिसंपत्तियां एवं डिजिटल ट्विन',
    'portal.maintenance': 'रखरखाव पोर्टल',
    'portal.maintenanceRole': 'फील्ड स्क्वाड प्रमुख',
    'portal.maintenanceDesc': 'कार्य आदेश, मरम्मत एवं पुनर्बहाली',
    'portal.manager': 'प्रबंधक पोर्टल',
    'portal.managerRole': 'क्षेत्रीय शिफ्ट प्रभारी',
    'portal.managerDesc': 'क्षेत्रीय कटौती एवं विश्लेषिकी',

    // Common Buttons & Actions
    'action.save': 'परिवर्तन सहेजें',
    'action.cancel': 'रद्द करें',
    'action.apply': 'प्राथमिकताएं लागू करें',
    'action.reset': 'मूल स्थिति पर लाएं',
    'action.signIn': 'साइन इन करें',
    'action.continue': 'आगे बढ़ें',
    'action.back': 'पीछे जाएं',
    'action.export': 'डेटा निर्यात करें',
    'action.filter': 'फ़िल्टर करें',
    'action.refresh': 'रिफ्रेश करें',
    'action.close': 'बंद करें',

    // Settings Tabs
    'settings.title': 'ग्रिड नियंत्रण सेटिंग्स एवं प्राथमिकताएं',
    'settings.subtitle': 'रंग-रूप, भाषा स्थानीयकरण, सीमाएं, अधिसूचना नियम एवं भूमिका प्राथमिकताएं।',
    'settings.tab.appearance': 'रंग-रूप एवं थीम',
    'settings.tab.language': 'भाषा एवं क्षेत्र',
    'settings.tab.notifications': 'अधिसूचनाएं',
    'settings.tab.map': 'मानचित्र एवं जीआईएस',
    'settings.tab.data': 'डैशबोर्ड एवं डेटा',
    'settings.tab.profile': 'प्रोफ़ाइल एवं सुरक्षा',
    'settings.tab.thresholds': 'चेतावनी सीमाएं',

    // Theme Options
    'theme.cinematic': 'सिनेमैटिक ग्रिड (डिफ़ॉल्ट)',
    'theme.cinematicDesc': 'गहरा मिडनाइट चारकोल, चमकदार टील पल्स और परिष्कृत ग्लास पैनल।',
    'theme.light': 'लाइट यूटिलिटी',
    'theme.lightDesc': 'दिन के समय फील्ड कार्य के लिए क्लासिक आइवरी और वन-हरा रंग।',
    'theme.highContrast': 'उच्च कंट्रास्ट',
    'theme.highContrastDesc': 'अत्यधिक स्पष्टता के लिए गहरा काला और नीयन मार्कर।',

    // Status
    'status.normal': 'सामान्य',
    'status.warning': 'चेतावनी',
    'status.critical': 'गंभीर चेतावनी',
    'status.offline': 'ऑफलाइन',
    'status.sync': 'सिंक्रोनाइज़्ड',
  },

  mr: {
    // Brand & Hero
    'brand.name': 'महाग्रिड एआय',
    'brand.tagline': 'स्मार्ट ग्रिड डिजिटल ट्विन',
    'hero.headline': 'स्मार्ट ग्रिड. सुरक्षित उद्या.',
    'hero.subtitle': 'महाराष्ट्र राज्य वीज वितरण प्रणालीसाठी भौतिकशास्त्र-माहितीपूर्ण डिजिटल ट्विन व स्काडा मंच.',

    // Navigation Sections
    'nav.section.overview': 'आढावा',
    'nav.section.operations': 'संचालन व दुरुस्ती',
    'nav.section.assets': 'ग्रिड मालमत्ता',
    'nav.section.intelligence': 'एआय व विश्लेषण',
    'nav.section.system': 'प्रणाली व प्रशासन',
    'nav.section.field': 'क्षेत्रीय कामकाज',
    'nav.section.spatial': 'भौगोलिक व ग्रिड',
    'nav.section.regional': 'प्रादेशिक देखरेख',

    // Navigation Items
    'nav.dashboard': 'मुख्य डॅशबोर्ड',
    'nav.map': 'थेट जीआयएस नकाशा',
    'nav.topology': 'टोपॉलॉजी इंजिन',
    'nav.outages': 'वीज खंडित व ट्रिपिंग',
    'nav.faultLocator': 'दोष स्थान शोधक',
    'nav.maintenance': 'देखभाल कामे',
    'nav.assets': 'सर्व मालमत्ता',
    'nav.substations': 'उप-केंद्रे (सबस्टेशन)',
    'nav.transformers': 'रोहित्र (ट्रान्सफॉर्मर)',
    'nav.feeders': 'फीडर व वाहिन्या',
    'nav.junctions': 'जंक्शन',
    'nav.meters': 'स्मार्ट मीटर्स',
    'nav.devices': 'आयओटी उपकरणे',
    'nav.aiAnalysis': 'एआय निदान',
    'nav.analytics': 'विश्लेषण',
    'nav.reports': 'अहवाल',
    'nav.simulation': 'सिम्युलेशन लॅब',
    'nav.notifications': 'सूचना (अलर्ट्स)',
    'nav.users': 'वापरकर्ते नियंत्रण',
    'nav.settings': 'सेटिंग्ज व नियम',

    // Topbar & Actions
    'topbar.searchPlaceholder': 'सबस्टेशन्स, ट्रान्सफॉर्मर्स, फीडर्स, दोष शोधा…',
    'topbar.districtSelect': 'महाराष्ट्र मंडल निवडा',
    'topbar.connected': 'जोडलेले',
    'topbar.connecting': 'जोडले जात आहे…',
    'topbar.disconnected': 'संपर्क तुटला',
    'topbar.demoMode': 'डेमो ट्विन',
    'topbar.switchPortal': 'पोर्टल भूमिका बदला (डेमो)',
    'topbar.myProfile': 'माझी प्रोफाइल',
    'topbar.appearance': 'स्वरूप व थीम',
    'topbar.language': 'भाषा व प्रदेश',
    'topbar.preferences': 'प्राधान्ये',
    'topbar.security': 'सुरक्षा',
    'topbar.signOut': 'बाहेर पडा (साइन आउट)',

    // Portals & Roles
    'portal.admin': 'प्रशासक पोर्टल',
    'portal.adminRole': 'मुख्य ग्रिड अभियंता',
    'portal.adminDesc': 'केंद्रीय नियंत्रण, वापरकर्ते, मालमत्ता व डिजिटल ट्विन',
    'portal.maintenance': 'देखभाल पथक पोर्टल',
    'portal.maintenanceRole': 'फील्ड पथक प्रमुख',
    'portal.maintenanceDesc': 'दुरुस्ती कामे, तपासणी व वीज पुनर्स्थापना',
    'portal.manager': 'व्यवस्थापक पोर्टल',
    'portal.managerRole': 'विभागीय पाळी प्रभारी',
    'portal.managerDesc': 'विभागीय वीज खंडन व विश्लेषण',

    // Common Buttons & Actions
    'action.save': 'बदल जतन करा',
    'action.cancel': 'रद्द करा',
    'action.apply': 'लागू करा',
    'action.reset': 'मूळ स्थितीत आणा',
    'action.signIn': 'साइन इन करा',
    'action.continue': 'पुढे जा',
    'action.back': 'मागे',
    'action.export': 'डेटा डाउनलोड करा',
    'action.filter': 'फिल्टर',
    'action.refresh': 'ताजे करा',
    'action.close': 'बंद करा',

    // Settings Tabs
    'settings.title': 'ग्रिड नियंत्रण सेटिंग्ज व प्राधान्ये',
    'settings.subtitle': 'स्वरूप, भाषा, मर्यादा, सूचना नियम व भूमिका प्राधान्ये.',
    'settings.tab.appearance': 'स्वरूप व थीम',
    'settings.tab.language': 'भाषा व प्रदेश',
    'settings.tab.notifications': 'सूचना',
    'settings.tab.map': 'नकाशा व जीआयएस',
    'settings.tab.data': 'डॅशबोर्ड व डेटा',
    'settings.tab.profile': 'प्रोफाइल व सुरक्षा',
    'settings.tab.thresholds': 'अलर्ट मर्यादा',

    // Theme Options
    'theme.cinematic': 'सिनेमॅटिक ग्रिड (डीफॉल्ट)',
    'theme.cinematicDesc': 'गडद मिडनाईट चारकोल, ल्युमिनस टील व पारदर्शक ग्लास पॅनेल्स.',
    'theme.light': 'लाइट युटिलिटी',
    'theme.lightDesc': 'दिवसाच्या क्षेत्रीय कामासाठी क्लासिक आयव्हरी व हिरवा रंग.',
    'theme.highContrast': 'हाय कॉन्ट्रास्ट',
    'theme.highContrastDesc': 'अत्यंत स्पष्ट वाचनासाठी काळा पार्श्वभाग व ठळक निऑन चिन्हे.',

    // Status
    'status.normal': 'सुरळीत',
    'status.warning': 'सावधगिरी',
    'status.critical': 'गंभीर त्रुटी',
    'status.offline': 'बंद',
    'status.sync': 'सिंक्रोनाइझ्ड',
  },
};

/** Format dates according to language and region */
export function formatLocalizedDate(date: Date | string | number, lang: SupportedLanguage): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const locale = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return String(date);
  }
}

/** Format numbers according to Indian numbering system */
export function formatLocalizedNumber(value: number, lang: SupportedLanguage): string {
  try {
    const locale = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return String(value);
  }
}
