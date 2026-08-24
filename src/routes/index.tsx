import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, ShieldCheck, Landmark, NotebookPen, CloudSun, Wind, Droplets,
  FolderLock, LifeBuoy, Sun, Moon, Eye, LogOut, User, Languages,
  Tractor, FlaskConical, ChevronDown, CloudRain, Cloud, MapPin
} from "lucide-react";
import { useState } from "react";
import { PhoneShell } from "@/components/agro/PhoneShell";
import { Onboarding } from "@/components/agro/Onboarding";
import { useApp } from "@/lib/app-store";
import { cropRecords, languages, schemes } from "@/lib/agro-data";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { onboarded } = useApp();
  if (!onboarded) return <Onboarding />;
  return (
    <PhoneShell>
      <Dashboard />
    </PhoneShell>
  );
}

// --- 11-LANGUAGE DYNAMIC TRANSLATION DICTIONARY ---
const translations = {
  EN: {
    greeting: "Namaste", season: "Kharif 2026", quickActionsTitle: "Quick Actions", myCropsTitle: "My Crops", wallet: "Document Wallet", support: "Support", weatherTemp: "32°C • Partly cloudy", weatherDetails: "Humidity 64% • Wind 28 km/h", weatherAlert: "⚠️ High wind expected. Postpone spraying.", weatherMoisture: "Soil moisture adequate for the next 3 days", profileLanguage: "Language", profileAppearance: "Appearance", profileSignOut: "Sign Out", acres: "acres", sown: "sown",
    actions: {
      labor: { label: "Find Labor", note: "128 nearby" }, risk: { label: "Risk & Insurance", note: "1 claim open" }, schemes: { label: "Govt Schemes", note: "matches" }, records: { label: "Farm Records", note: "Kharif 2026" }, machinery: { label: "Machinery", note: "Rent equipment" }, water: { label: "Water Share", note: "Peer-to-peer" }, soil: { label: "Soil Test", note: "Local agents" }, loans: { label: "Loan Check", note: "Eligibility status" }, profile: { label: "Farmer Profile", note: "Your network" }
    }
  },
  HI: {
    greeting: "नमस्ते", season: "खरीफ 2026", quickActionsTitle: "त्वरित कार्रवाइयां", myCropsTitle: "मेरी फसलें", wallet: "दस्तावेज़ वॉलेट", support: "सहायता", weatherTemp: "32°C • आंशिक रूप से बादल", weatherDetails: "नमी 64% • हवा 28 किमी/घंटा", weatherAlert: "⚠️ तेज हवा चलने की उम्मीद है। छिड़काव स्थगित करें।", weatherMoisture: "अगले 3 दिनों के लिए मिट्टी की नमी पर्याप्त है", profileLanguage: "भाषा", profileAppearance: "दिखावट", profileSignOut: "साइन आउट", acres: "एकड़", sown: "बोया गया",
    actions: {
      labor: { label: "मजदूर खोजें", note: "128 पास में" }, risk: { label: "जोखिम और बीमा", note: "1 दावा खुला" }, schemes: { label: "सरकारी योजनाएं", note: "मिलान" }, records: { label: "खेत के रिकॉर्ड", note: "खरीफ 2026" }, machinery: { label: "मशीनरी", note: "उपकरण किराए पर लें" }, water: { label: "जल साझाकरण", note: "पीयर-टू-पीयर" }, soil: { label: "मिट्टी परीक्षण", note: "स्थानीय एजेंट" }, loans: { label: "ऋण जांच", note: "पात्रता स्थिति" }, profile: { label: "प्रोफ़ाइल", note: "आपका नेटवर्क" }
    }
  },
  BN: {
    greeting: "নমস্কার", season: "খারিফ ২০২৬", quickActionsTitle: "দ্রুত পদক্ষেপ", myCropsTitle: "আমার ফসল", wallet: "ডকুমেন্ট ওয়ালেট", support: "সহায়তা", weatherTemp: "32°C • আংশিক মেঘলা", weatherDetails: "আর্দ্রতা 64% • বাতাস 28 কিমি/ঘন্টা", weatherAlert: "⚠️ ঝোড়ো হাওয়া। স্প্রে করা স্থগিত করুন।", weatherMoisture: "আগামী ৩ দিনের জন্য মাটির আর্দ্রতা পর্যাপ্ত", profileLanguage: "ভাষা", profileAppearance: "থিম", profileSignOut: "লগ আউট", acres: "একর", sown: "বপন করা হয়েছে",
    actions: {
      labor: { label: "শ্রমিক খুঁজুন", note: "128 জন কাছে" }, risk: { label: "ঝুঁকি ও বীমা", note: "1টি দাবি" }, schemes: { label: "সরকারি স্কিম", note: "ম্যাচ" }, records: { label: "খামারের রেকর্ড", note: "খারিফ ২০২৬" }, machinery: { label: "যন্ত্রপাতি", note: "ভাড়া" }, water: { label: "জল ভাগ", note: "পিয়ার-টু-পিয়ার" }, soil: { label: "মাটি পরীক্ষা", note: "এজেন্ট" }, loans: { label: "ঋণ যাচাই", note: "যোগ্যতা" }, profile: { label: "প্রোফাইল", note: "আপনার নেটওয়ার্ক" }
    }
  },
  MR: {
    greeting: "नमस्कार", season: "खरीप 2026", quickActionsTitle: "त्वरित कृती", myCropsTitle: "माझी पिके", wallet: "कागदपत्रे", support: "मदत", weatherTemp: "32°C • अंशतः ढगाळ", weatherDetails: "आर्द्रता 64% • वारा 28 किमी/तास", weatherAlert: "⚠️ सोसाट्याचा वारा. फवारणी पुढे ढकला.", weatherMoisture: "पुढील ३ दिवसांसाठी जमिनीत ओलावा पुरेसा आहे", profileLanguage: "भाषा", profileAppearance: "थीम", profileSignOut: "बाहेर पडा", acres: "एकर", sown: "पेरणी",
    actions: {
      labor: { label: "मजूर शोधा", note: "128 जवळ" }, risk: { label: "धोका आणि विमा", note: "1 दावा" }, schemes: { label: "सरकारी योजना", note: "जुळणारे" }, records: { label: "शेत नोंदी", note: "खरीप 2026" }, machinery: { label: "यंत्रसामग्री", note: "भाड्याने" }, water: { label: "पाणी वाटप", note: "पीअर-टू-पीअर" }, soil: { label: "माती परीक्षण", note: "एजंट" }, loans: { label: "कर्ज पात्रता", note: "तपासणी" }, profile: { label: "प्रोफाइल", note: "तुमचे नेटवर्क" }
    }
  },
  TE: {
    greeting: "నమస్తే", season: "ఖరీఫ్ 2026", quickActionsTitle: "శీఘ్ర చర్యలు", myCropsTitle: "నా పంటలు", wallet: "పత్రాల వాలెట్", support: "మద్దతు", weatherTemp: "32°C • పాక్షికంగా మేఘావృతం", weatherDetails: "తేమ 64% • గాలి 28 కిమీ/గం", weatherAlert: "⚠️ అధిక గాలి ఆశించబడుతుంది. పిచికారీ వాయిదా వేయండి.", weatherMoisture: "తదుపరి 3 రోజుల వరకు నేల తేమ సరిపోతుంది", profileLanguage: "భాష", profileAppearance: "ప్రదర్శన", profileSignOut: "సైన్ అవుట్", acres: "ఎకరాలు", sown: "విత్తబడినది",
    actions: {
      labor: { label: "కూలీలను వెతకండి", note: "128 సమీపంలో" }, risk: { label: "ప్రమాదం & భీమా", note: "1 క్లెయిమ్" }, schemes: { label: "ప్రభుత్వ పథకాలు", note: "సరిపోలికలు" }, records: { label: "పొలం రికార్డులు", note: "ఖరీఫ్ 2026" }, machinery: { label: "యంత్రాలు", note: "అద్దె పరికరాలు" }, water: { label: "నీటి భాగస్వామ్యం", note: "పీర్-టు-పీర్" }, soil: { label: "మట్టి పరీక్ష", note: "ఏజెంట్లు" }, loans: { label: "లోన్ చెక్", note: "అర్హత స్థితి" }, profile: { label: "రైతు ప్రొఫైల్", note: "మీ నెట్‌వర్క్" }
    }
  },
  TA: {
    greeting: "வணக்கம்", season: "காரிஃப் 2026", quickActionsTitle: "விரைவான செயல்கள்", myCropsTitle: "என் பயிர்கள்", wallet: "ஆவணங்கள்", support: "ஆதரவு", weatherTemp: "32°C • மேகமூட்டம்", weatherDetails: "ஈரப்பதம் 64% • காற்று 28 கிமீ/ம", weatherAlert: "⚠️ பலத்த காற்று. தெளிப்பதை ஒத்திவைக்க.", weatherMoisture: "மண் ஈரப்பதம் 3 நாட்களுக்கு போதுமானது", profileLanguage: "மொழி", profileAppearance: "தோற்றம்", profileSignOut: "வெளியேறு", acres: "ஏக்கர்", sown: "விதைக்கப்பட்டது",
    actions: {
      labor: { label: "தொழிலாளர்", note: "128 அருகில்" }, risk: { label: "காப்பீடு", note: "1 கோரிக்கை" }, schemes: { label: "அரசு திட்டங்கள்", note: "பொருத்தங்கள்" }, records: { label: "பண்ணை பதிவுகள்", note: "காரிஃப் 2026" }, machinery: { label: "இயந்திரங்கள்", note: "வாடகைக்கு" }, water: { label: "நீர் பகிர்வு", note: "நண்பர்களுடன்" }, soil: { label: "மண் பரிசோதனை", note: "முகவர்கள்" }, loans: { label: "கடன் தகுதி", note: "சரிபார்" }, profile: { label: "சுயவிவரம்", note: "நெட்வொர்க்" }
    }
  },
  GU: {
    greeting: "નમસ્તે", season: "ખરીફ 2026", quickActionsTitle: "ઝડપી ક્રિયાઓ", myCropsTitle: "મારા પાક", wallet: "દસ્તાવેજ વૉલેટ", support: "આધાર", weatherTemp: "32°C • આંશિક વાદળછાયું", weatherDetails: "ભેજ 64% • પવન 28 કિમી/કલાક", weatherAlert: "⚠️ ભારે પવન. છંટકાવ મુલતવી રાખો.", weatherMoisture: "આગામી 3 દિવસ માટે જમીનમાં ભેજ પૂરતો છે", profileLanguage: "ભાષા", profileAppearance: "દેખાવ", profileSignOut: "સાઇન આઉટ", acres: "એકર", sown: "વાવેતર",
    actions: {
      labor: { label: "મજૂર શોધો", note: "128 નજીકમાં" }, risk: { label: "જોખમ અને વીમો", note: "1 દાવો" }, schemes: { label: "સરકારી યોજનાઓ", note: "મેળ" }, records: { label: "ફાર્મ રેકોર્ડ્સ", note: "ખરીફ 2026" }, machinery: { label: "મશીનરી", note: "ભાડે" }, water: { label: "પાણીની વહેંચણી", note: "પીઅર-ટુ-પીઅર" }, soil: { label: "માટી પરીક્ષણ", note: "એજન્ટો" }, loans: { label: "લોન પાત્રતા", note: "સ્થિતિ" }, profile: { label: "પ્રોફાઇલ", note: "તમારું નેટવર્ક" }
    }
  },
  UR: {
    greeting: "آداب", season: "خریف 2026", quickActionsTitle: "فوری کارروائیاں", myCropsTitle: "میری فصلیں", wallet: "دستاویز والیٹ", support: "مدد", weatherTemp: "32°C • جزوی طور پر ابر آلود", weatherDetails: "نمی 64% • ہوا 28 کلومیٹر/گھنٹہ", weatherAlert: "⚠️ تیز ہوا متوقع۔ اسپرے ملتوی کریں۔", weatherMoisture: "مٹی کی نمی 3 دن کے لیے کافی ہے", profileLanguage: "زبان", profileAppearance: "ظہور", profileSignOut: "سائن آؤٹ", acres: "ایکڑ", sown: "بویا گیا",
    actions: {
      labor: { label: "مزدور تلاش کریں", note: "128 قریب" }, risk: { label: "خطرہ اور انشورنس", note: "1 دعوی" }, schemes: { label: "سرکاری اسکیمیں", note: "مماثلت" }, records: { label: "فارم ریکارڈز", note: "خریف 2026" }, machinery: { label: "مشینری", note: "کرایہ" }, water: { label: "پانی کی تقسیم", note: "پیئر ٹو پیئر" }, soil: { label: "مٹی کا ٹیسٹ", note: "ایجنٹ" }, loans: { label: "قرض کی اہلیت", note: "اسٹیٹس" }, profile: { label: "پروفائل", note: "آپ کا نیٹ ورک" }
    }
  },
  KN: {
    greeting: "ನಮಸ್ಕಾರ", season: "ಖಾರಿಫ್ 2026", quickActionsTitle: "ತ್ವರಿತ ಕ್ರಮಗಳು", myCropsTitle: "ನನ್ನ ಬೆಳೆಗಳು", wallet: "ದಾಖಲೆ ವಾಲೆಟ್", support: "ಬೆಂಬಲ", weatherTemp: "32°C • ಭಾಗಶಃ ಮೋಡ", weatherDetails: "ತೇವಾಂಶ 64% • ಗಾಳಿ 28 ಕಿಮೀ/ಗಂ", weatherAlert: "⚠️ ಭಾರೀ ಗಾಳಿ. ಸಿಂಪಡಣೆಯನ್ನು ಮುಂದೂಡಿ.", weatherMoisture: "ಮುಂದಿನ 3 ದಿನಗಳವರೆಗೆ ಮಣ್ಣಿನ ತೇವಾಂಶ ಸಾಕಷ್ಟು", profileLanguage: "ಭಾಷೆ", profileAppearance: "ಗೋಚರತೆ", profileSignOut: "ಸೈನ್ ಔಟ್", acres: "ಎಕರೆ", sown: "ಬಿತ್ತನೆ",
    actions: {
      labor: { label: "ಕಾರ್ಮಿಕರು", note: "128 ಹತ್ತಿರದಲ್ಲಿ" }, risk: { label: "ವಿಮೆ", note: "1 ಕ್ಲೈಮ್" }, schemes: { label: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", note: "ಹೊಂದಾಣಿಕೆಗಳು" }, records: { label: "ಕೃಷಿ ದಾಖಲೆಗಳು", note: "ಖಾರಿಫ್ 2026" }, machinery: { label: "ಯಂತ್ರೋಪಕರಣಗಳು", note: "ಬಾಡಿಗೆಗೆ" }, water: { label: "ನೀರು ಹಂಚಿಕೆ", note: "ಪೀರ್-ಟು-ಪೀರ್" }, soil: { label: "ಮಣ್ಣು ಪರೀಕ್ಷೆ", note: "ಏಜೆಂಟರು" }, loans: { label: "ಸಾಲದ ಅರ್ಹತೆ", note: "ಪರಿಶೀಲಿಸಿ" }, profile: { label: "ಪ್ರೊಫೈಲ್", note: "ನಿಮ್ಮ ನೆಟ್‌ವರ್ಕ್" }
    }
  },
  OR: {
    greeting: "ନମସ୍କାର", season: "ଖରିଫ 2026", quickActionsTitle: "ତ୍ୱରିତ କାର୍ଯ୍ୟ", myCropsTitle: "ମୋର ଫସଲ", wallet: "ଡକ୍ୟୁମେଣ୍ଟ୍ ୱାଲେଟ୍", support: "ସମର୍ଥନ", weatherTemp: "32°C • ଆଂଶିକ ମେଘୁଆ", weatherDetails: "ଆର୍ଦ୍ରତା 64% • ପବନ 28 କିମି/ଘଣ୍ଟା", weatherAlert: "⚠️ ପ୍ରବଳ ପବନ। ସ୍ପ୍ରେ ସ୍ଥଗିତ ରଖନ୍ତୁ।", weatherMoisture: "ଆସନ୍ତା 3 ଦିନ ପାଇଁ ମାଟିର ଆର୍ଦ୍ରତା ଯଥେଷ୍ଟ", profileLanguage: "ଭାଷା", profileAppearance: "ଦୃଶ୍ୟ", profileSignOut: "ସାଇନ୍ ଆଉଟ୍", acres: "ଏକର", sown: "ବୁଣାଯାଇଛି",
    actions: {
      labor: { label: "ଶ୍ରମିକ ଖୋଜନ୍ତୁ", note: "128 ପାଖରେ" }, risk: { label: "ବିପଦ ଏବଂ ବୀମା", note: "1 ଦାବି" }, schemes: { label: "ସରକାରୀ ଯୋଜନା", note: "ମେଳ" }, records: { label: "ଫାର୍ମ ରେକର୍ଡ", note: "ଖରିଫ 2026" }, machinery: { label: "ଯନ୍ତ୍ରପାତି", note: "ଭଡା" }, water: { label: "ଜଳ ବଣ୍ଟନ", note: "ପିଅର-ଟୁ-ପିଅର" }, soil: { label: "ମାଟି ପରୀକ୍ଷା", note: "ଏଜେଣ୍ଟ" }, loans: { label: "ଋଣ ଯୋଗ୍ୟତା", note: "ସ୍ଥିତି" }, profile: { label: "ପ୍ରୋଫାଇଲ୍", note: "ଆପଣଙ୍କ ନେଟୱାର୍କ" }
    }
  },
  ML: {
    greeting: "നമസ്കാരം", season: "ഖാരിഫ് 2026", quickActionsTitle: "പെട്ടെന്നുള്ള പ്രവർത്തനങ്ങൾ", myCropsTitle: "എന്റെ വിളകൾ", wallet: "രേഖകൾ", support: "സഹായം", weatherTemp: "32°C • ഭാഗികമായി മേഘാവൃതം", weatherDetails: "ഈർപ്പം 64% • കാറ്റ് 28 കി.മീ/മ", weatherAlert: "⚠️ ശക്തമായ കാറ്റ്. തളിക്കുന്നത് മാറ്റിവെക്കുക.", weatherMoisture: "അടുത്ത 3 ദിവസത്തേക്ക് മണ്ണിലെ ഈർപ്പം മതിയാകും", profileLanguage: "ഭാഷ", profileAppearance: "തീം", profileSignOut: "സൈൻ ഔട്ട്", acres: "ഏക്കർ", sown: "വിതച്ചത്",
    actions: {
      labor: { label: "തൊഴിലാളികളെ കണ്ടെത്തുക", note: "128 അടുത്തു" }, risk: { label: "ഇൻഷുറൻസ്", note: "1 ക്ലെയിം" }, schemes: { label: "സർക്കാർ പദ്ധതികൾ", note: "യോജിച്ചവ" }, records: { label: "കൃഷി രേഖകൾ", note: "ഖാരിഫ് 2026" }, machinery: { label: "യന്ത്രങ്ങൾ", note: "വാടകയ്ക്ക്" }, water: { label: "വെള്ളം പങ്കിടൽ", note: "പിയർ-ടു-പിയർ" }, soil: { label: "മണ്ണ് പരിശോധന", note: "ഏജന്റുമാർ" }, loans: { label: "വായ്പാ അർഹത", note: "പരിശോധിക്കുക" }, profile: { label: "പ്രൊഫൈൽ", note: "നിങ്ങളുടെ നെറ്റ്‌വർക്ക്" }
    }
  }
};

function Dashboard() {
  const { profile } = useApp();
  
  const safeLang = (profile?.language || "EN").toUpperCase() as keyof typeof translations;
  const t = translations[safeLang] || translations.EN;

  const quickActions = [
    { to: "/labor", label: t.actions.labor.label, icon: Users, note: t.actions.labor.note },
    { to: "/risk", label: t.actions.risk.label, icon: ShieldCheck, note: t.actions.risk.note },
    { to: "/schemes", label: t.actions.schemes.label, icon: Landmark, note: `${schemes.length} ${t.actions.schemes.note}` },
    { to: "/records", label: t.actions.records.label, icon: NotebookPen, note: t.actions.records.note },
    { to: "/machinery", label: t.actions.machinery.label, icon: Tractor, note: t.actions.machinery.note },
    { to: "/water", label: t.actions.water.label, icon: Droplets, note: t.actions.water.note },
    { to: "/soil", label: t.actions.soil.label, icon: FlaskConical, note: t.actions.soil.note },
    { to: "/loans", label: t.actions.loans.label, icon: ShieldCheck, note: t.actions.loans.note },
    { to: "/profile", label: t.actions.profile.label, icon: User, note: t.actions.profile.note, gridSpan: "col-span-2" }
  ] as const;

  return (
    <div className="bg-background min-h-screen">
      <div className="relative pb-6 min-h-[16rem]">
        
        {/* Animated Main Header Background */}
        <div className="absolute inset-0 overflow-hidden rounded-b-[2.5rem] shadow-lg bg-gradient-to-b from-green-800 to-green-950">
          <motion.div 
            animate={{ opacity: [0.1, 0.2, 0.1] }} 
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"
          />
        </div>
        
        <div className="relative z-20 flex flex-col p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 mb-4">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="backdrop-blur-md bg-white/10 border border-white/20 min-w-0 rounded-2xl px-5 py-4 shadow-sm"
            >
              <p className="text-xs font-medium text-white/80 tracking-wide uppercase">{profile.village} • {t.season}</p>
              <h1 className="truncate text-2xl font-bold text-white tracking-tight leading-tight mt-1">{t.greeting}, {profile.name}</h1>
            </motion.div>
            <ProfileMenu />
          </div>
          
          <WeatherCard />
        </div>
      </div>

      <section className="px-5 pt-4">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
          {t.quickActionsTitle}
        </motion.h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((a, i) => (
            <motion.div key={a.to} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: i * 0.08, type: "spring", stiffness: 120, damping: 15 }} whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }} className={(a as any).gridSpan || ""}>
              <Link to={a.to} className="group flex h-32 flex-col justify-between rounded-[1.5rem] bg-card/80 backdrop-blur-md border border-border/40 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <a.icon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm font-bold leading-tight text-foreground">{a.label}</span>
                  <span className="block text-[11px] font-medium text-muted-foreground mt-0.5">{a.note}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-5 pt-8">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
          {t.myCropsTitle}
        </motion.h2>
        <div className="space-y-3">
          {cropRecords.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i, type: "spring", stiffness: 90, damping: 14 }} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-3xl bg-card/80 backdrop-blur-md border border-border/40 p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="min-w-0">
                <p className="truncate font-bold text-base text-foreground">{c.crop}</p>
                <p className="truncate text-xs font-medium text-muted-foreground mt-0.5">{c.acres} {t.acres} • {c.stage} • {t.sown} {c.sown}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary/50">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.health}%` }} transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }} className="h-full rounded-full bg-primary" />
                </div>
              </div>
              <span className="shrink-0 rounded-2xl bg-primary/10 px-4 py-1.5 text-xs font-black text-primary border border-primary/10">{c.health}%</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 px-5 pt-8 pb-24">
        <Link to="/wallet">
          <motion.div whileTap={{ scale: 0.95 }} className="flex items-center gap-3 rounded-2xl bg-accent/80 backdrop-blur-sm border border-accent/20 p-4 text-accent-foreground shadow-sm">
            <FolderLock className="h-5 w-5 shrink-0 opacity-80" />
            <span className="min-w-0 truncate text-sm font-bold">{t.wallet}</span>
          </motion.div>
        </Link>
        <Link to="/support">
          <motion.div whileTap={{ scale: 0.95 }} className="flex items-center gap-3 rounded-2xl bg-secondary/80 backdrop-blur-sm border border-secondary/20 p-4 text-secondary-foreground shadow-sm">
            <LifeBuoy className="h-5 w-5 shrink-0 opacity-80" />
            <span className="min-w-0 truncate text-sm font-bold">{t.support}</span>
          </motion.div>
        </Link>
      </section>
    </div>
  );
}

function WeatherCard() {
  const { profile } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const safeLang = (profile?.language || "EN").toUpperCase() as keyof typeof translations;
  const t = translations[safeLang] || translations.EN;

  const tempSplit = t.weatherTemp.split("•");
  const tempValue = tempSplit[0]?.trim() || "32°C";
  const tempCondition = tempSplit[1]?.trim() || "Partly cloudy";

  const weeklyForecast = [
    { day: "Mon", date: "24", icon: CloudSun, high: 32, low: 22, rain: "0.0" },
    { day: "Tue", date: "25", icon: Cloud, high: 29, low: 21, rain: "1.2" },
    { day: "Wed", date: "26", icon: CloudRain, high: 28, low: 20, rain: "4.5" },
    { day: "Thu", date: "27", icon: Sun, high: 34, low: 24, rain: "0.0" },
    { day: "Fri", date: "28", icon: Sun, high: 35, low: 25, rain: "0.0" },
  ];

  const hourlyForecast = [
    { time: "17:00", icon: CloudSun, temp: 32, rain: "0%" },
    { time: "18:00", icon: Sun, temp: 30, rain: "0%" },
    { time: "19:00", icon: Moon, temp: 27, rain: "0%" },
    { time: "20:00", icon: Moon, temp: 25, rain: "10%" },
    { time: "21:00", icon: CloudRain, temp: 24, rain: "40%" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full rounded-[2rem] overflow-hidden shadow-xl z-30 border border-primary/20">
      
      {/* AGRO KISAN THEMED BACKGROUND */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-950 px-5 py-6">
        
        {/* Subtle animated organic shapes (Abstract fields/sunlight) */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.05, 1] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -right-12 w-64 h-64 bg-green-400/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.1, 1] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"
        />

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5 mb-1 opacity-90">
              <MapPin size={12} className="text-green-200" />
              <span className="text-green-100 text-[10px] font-black uppercase tracking-widest">{profile.village || "Local Farm"}</span>
            </div>
            <div className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
              {tempValue}
            </div>
            <div className="text-green-50 font-medium mt-1 drop-shadow-sm flex items-center gap-2 text-sm">
              <CloudSun size={18} className="text-yellow-300" /> {tempCondition}
            </div>
          </div>

          {/* Weather Quick Stats (Glassmorphism) */}
          <div className="flex flex-col gap-2 text-right">
            <div className="bg-black/20 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/10 shadow-sm">
              <p className="text-[9px] text-green-200 uppercase font-black tracking-wider">Humidity</p>
              <p className="text-sm font-bold text-white">64%</p>
            </div>
            <div className="bg-black/20 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/10 shadow-sm">
              <p className="text-[9px] text-green-200 uppercase font-black tracking-wider">Wind</p>
              <p className="text-sm font-bold text-white">28 km/h</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card px-4 py-3 flex flex-col border-b border-border/50 relative z-10">
        <div className="flex items-center gap-3 bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-xs font-bold mb-3 border border-red-500/20 shadow-sm">
          <Wind className="h-4 w-4 shrink-0" />
          <span>{t.weatherAlert}</span>
        </div>
        
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-between w-full text-muted-foreground hover:text-primary transition-colors py-1 group">
          <span className="text-[10px] font-black tracking-widest uppercase group-hover:text-primary">Extended Forecast</span>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown size={18} className="group-hover:text-primary" /></motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-card overflow-hidden flex flex-col"
          >
            <div className="flex justify-between px-5 py-6 border-b border-border/50">
              {weeklyForecast.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <span className="text-foreground font-bold text-sm">{day.day}</span>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold mb-1">{day.date}</span>
                  <day.icon className="text-primary mb-2" size={24} />
                  <span className="text-foreground font-black text-sm">{day.high}°</span>
                  <div className="w-1.5 h-10 bg-secondary/50 rounded-full overflow-hidden my-1 flex items-end">
                    <div className="w-full bg-primary rounded-full" style={{ height: `${(day.low / day.high) * 100}%` }} />
                  </div>
                  <span className="text-muted-foreground font-bold text-xs">{day.low}°</span>
                </div>
              ))}
            </div>

            <div className="flex gap-5 overflow-x-auto px-5 py-6 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {hourlyForecast.map((hour, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 snap-center min-w-[3.5rem]">
                  <span className={`text-xs font-bold ${idx === 0 ? 'bg-primary text-primary-foreground px-3 py-1 rounded-full shadow-sm' : 'text-muted-foreground'}`}>
                    {hour.time}
                  </span>
                  <hour.icon className="text-foreground" size={22} />
                  <span className="text-foreground font-black text-sm">{hour.temp}°</span>
                  <span className="text-blue-500 font-bold text-[10px] bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/10">
                    {hour.rain}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProfileMenu() {
  const { profile, setProfile, theme, setTheme } = useApp();
  const [open, setOpen] = useState(false);
  
  const safeLang = (profile?.language || "EN").toUpperCase() as keyof typeof translations;
  const t = translations[safeLang] || translations.EN;

  return (
    <div className="relative z-50 shrink-0">
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={() => setOpen((o) => !o)}
        className="grid h-12 w-12 place-items-center rounded-full bg-primary text-lg font-black text-primary-foreground shadow-md border-2 border-background/50"
      >
        {profile.name.charAt(0)}
      </motion.button>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: -10 }}
          className="absolute right-0 top-14 z-40 w-64 rounded-3xl border border-border/50 backdrop-blur-2xl bg-popover/90 p-4 text-popover-foreground shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><User className="h-5 w-5" /></div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold">{profile.name}</p>
              <p className="truncate text-xs font-medium text-muted-foreground mt-0.5">{profile.village}</p>
            </div>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground"><Languages className="h-4 w-4" /> {t.profileLanguage}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {languages.map((l) => (
              <button key={l.code} onClick={() => setProfile({ language: l.code })} className={`rounded-xl py-2 text-xs font-bold transition-all ${profile.language === l.code ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground"}`}>{l.label}</button>
            ))}
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.profileAppearance}</p>
          <div className="mt-2 flex gap-2">
            {([{ key: "light", icon: Sun }, { key: "dark", icon: Moon }, { key: "comfort", icon: Eye }] as const).map((themeOption) => (
              <button key={themeOption.key} onClick={() => setTheme(themeOption.key)} className={`grid flex-1 place-items-center rounded-xl py-2.5 transition-all ${theme === themeOption.key ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground"}`}><themeOption.icon className="h-4 w-4" /></button>
            ))}
          </div>

          <Link to="/signout" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-bold text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground shadow-sm">
            <LogOut className="h-4 w-4" /> {t.profileSignOut}
          </Link>
        </motion.div>
      )}
    </div>
  );
}