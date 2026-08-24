import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  Landmark,
  NotebookPen,
  CloudSun,
  Wind,
  Droplets,
  FolderLock,
  LifeBuoy,
  Sun,
  Moon,
  Eye,
  LogOut,
  User,
  Languages,
  Tractor,
  FlaskConical
} from "lucide-react";
import { useState } from "react";
import { PhoneShell } from "@/components/agro/PhoneShell";
import { Onboarding } from "@/components/agro/Onboarding";
import { useApp } from "@/lib/app-store";
import { cropRecords, languages, schemes } from "@/lib/agro-data";
import farmHero from "@/assets/farm-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agro Kisan — Labor, Risk & Schemes for Indian Farmers" },
      {
        name: "description",
        content:
          "Agro Kisan is a mobile-first farming companion: hire local labor, track crop risk and insurance, and find matching government schemes.",
      },
      { property: "og:title", content: "Agro Kisan — Farming companion for Indian farmers" },
      {
        property: "og:description",
        content: "Zero-commission labor marketplace, crop risk portal and smart scheme matching in one app.",
      },
    ],
  }),
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

// --- DYNAMIC TRANSLATION DICTIONARY ---
const translations = {
  EN: {
    greeting: "Namaste",
    season: "Kharif 2026",
    quickActionsTitle: "Quick Actions",
    myCropsTitle: "My Crops",
    wallet: "Document Wallet",
    support: "Support",
    weatherTemp: "32°C • Mostly Sunny",
    weatherDetails: "Humidity 64% • Wind 28 km/h",
    weatherAlert: "⚠️ High wind expected. Postpone spraying.",
    weatherMoisture: "Soil moisture adequate for the next 3 days",
    profileLanguage: "Language",
    profileAppearance: "Appearance",
    profileSignOut: "Sign Out",
    acres: "acres",
    sown: "sown",
    actions: {
      labor: { label: "Find Labor", note: "128 nearby" },
      risk: { label: "Risk & Insurance", note: "1 claim open" },
      schemes: { label: "Govt Schemes", note: "matches" },
      records: { label: "Farm Records", note: "Kharif 2026" },
      machinery: { label: "Machinery", note: "Rent equipment" },
      water: { label: "Water Share", note: "Peer-to-peer" },
      soil: { label: "Soil Test", note: "Local agents" },
      loans: { label: "Loan Check", note: "Eligibility status" },
      profile: { label: "Farmer Profile", note: "Your network & history" }
    }
  },
  HI: {
    greeting: "नमस्ते",
    season: "खरीफ 2026",
    quickActionsTitle: "त्वरित कार्रवाइयां",
    myCropsTitle: "मेरी फसलें",
    wallet: "दस्तावेज़ वॉलेट",
    support: "सहायता",
    weatherTemp: "32°C • अधिकांशतः धूप",
    weatherDetails: "नमी 64% • हवा 28 किमी/घंटा",
    weatherAlert: "⚠️ तेज हवा चलने की उम्मीद है। छिड़काव स्थगित करें।",
    weatherMoisture: "अगले 3 दिनों के लिए मिट्टी की नमी पर्याप्त है",
    profileLanguage: "भाषा",
    profileAppearance: "दिखावट",
    profileSignOut: "साइन आउट",
    acres: "एकड़",
    sown: "बोया गया",
    actions: {
      labor: { label: "मजदूर खोजें", note: "128 पास में" },
      risk: { label: "जोखिम और बीमा", note: "1 दावा खुला" },
      schemes: { label: "सरकारी योजनाएं", note: "मिलान" },
      records: { label: "खेत के रिकॉर्ड", note: "खरीफ 2026" },
      machinery: { label: "मशीनरी", note: "उपकरण किराए पर लें" },
      water: { label: "जल साझाकरण", note: "पीयर-टू-पीयर" },
      soil: { label: "मिट्टी परीक्षण", note: "स्थानीय एजेंट" },
      loans: { label: "ऋण जांच", note: "पात्रता स्थिति" },
      profile: { label: "किसान प्रोफ़ाइल", note: "आपका नेटवर्क" }
    }
  },
  TE: {
    greeting: "నమస్తే",
    season: "ఖరీఫ్ 2026",
    quickActionsTitle: "శీఘ్ర చర్యలు",
    myCropsTitle: "నా పంటలు",
    wallet: "పత్రాల వాలెట్",
    support: "మద్దతు",
    weatherTemp: "32°C • ఎండగా ఉంది",
    weatherDetails: "తేమ 64% • గాలి 28 కిమీ/గం",
    weatherAlert: "⚠️ అధిక గాలి ఆశించబడుతుంది. పిచికారీ వాయిదా వేయండి.",
    weatherMoisture: "తదుపరి 3 రోజుల వరకు నేల తేమ సరిపోతుంది",
    profileLanguage: "భాష",
    profileAppearance: "ప్రదర్శన",
    profileSignOut: "సైన్ అవుట్",
    acres: "ఎకరాలు",
    sown: "విత్తబడినది",
    actions: {
      labor: { label: "కార్మికులను కనుగొనండి", note: "128 సమీపంలో" },
      risk: { label: "ప్రమాదం & భీమా", note: "1 క్లెయిమ్ తెరిచి ఉంది" },
      schemes: { label: "ప్రభుత్వ పథకాలు", note: "సరిపోలికలు" },
      records: { label: "పొలం రికార్డులు", note: "ఖరీఫ్ 2026" },
      machinery: { label: "యంత్రాలు", note: "అద్దె పరికరాలు" },
      water: { label: "నీటి భాగస్వామ్యం", note: "పీర్-టు-పీర్" },
      soil: { label: "మట్టి పరీక్ష", note: "స్థానిక ఏజెంట్లు" },
      loans: { label: "లోన్ చెక్", note: "అర్హత స్థితి" },
      profile: { label: "రైతు ప్రొఫైల్", note: "మీ నెట్‌వర్క్" }
    }
  }
};

function Dashboard() {
  const { profile } = useApp();
  
  const safeLang = (profile?.language || "EN").toUpperCase() as "EN" | "HI" | "TE";
  const t = translations[safeLang] || translations.EN;

  // Dynamic quick actions array upgraded with the 5 new dashboards
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
    <div>
      <div className="relative h-60">
        <div className="absolute inset-0 overflow-hidden rounded-b-[2rem]">
          <img
            src={farmHero}
            alt="Green paddy fields at sunrise"
            width={1024}
            height={640}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/25 via-foreground/10 to-foreground/60" />
        </div>
        <div className="relative z-20 flex h-full flex-col justify-between p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="glass-pane min-w-0 rounded-2xl px-4 py-3">
              <p className="text-xs text-muted-foreground">{profile.village} • {t.season}</p>
              <h1 className="truncate text-xl leading-tight">{t.greeting}, {profile.name}</h1>
            </div>
            <ProfileMenu />
          </div>
          <WeatherCard />
        </div>
      </div>

      <section className="px-4 pt-6">
        <h2 className="mb-3 text-base">{t.quickActionsTitle}</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((a, i) => (
            <motion.div
              key={a.to}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 220, damping: 22 }}
              whileTap={{ scale: 0.95 }}
              className={(a as any).gridSpan || ""}
            >
              <Link
                to={a.to}
                className="soft-shadow flex h-32 flex-col justify-between rounded-3xl bg-card p-4"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
                  <a.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold leading-tight">{a.label}</span>
                  <span className="block text-[11px] text-muted-foreground">{a.note}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 text-base">{t.myCropsTitle}</h2>
        <div className="space-y-2">
          {cropRecords.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-card p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{c.crop}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.acres} {t.acres} • {c.stage} • {t.sown} {c.sown}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.health}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-primary/12 px-3 py-1 text-xs font-bold text-primary">
                {c.health}%
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 px-4 pt-6 pb-20">
        <Link to="/wallet" className="flex items-center gap-2 rounded-2xl bg-accent p-4 text-accent-foreground">
          <FolderLock className="h-5 w-5 shrink-0" />
          <span className="min-w-0 truncate text-sm font-semibold">{t.wallet}</span>
        </Link>
        <Link to="/support" className="flex items-center gap-2 rounded-2xl bg-secondary p-4 text-secondary-foreground">
          <LifeBuoy className="h-5 w-5 shrink-0" />
          <span className="min-w-0 truncate text-sm font-semibold">{t.support}</span>
        </Link>
      </section>
    </div>
  );
}

function WeatherCard() {
  const { profile } = useApp();
  
  const safeLang = (profile?.language || "EN").toUpperCase() as "EN" | "HI" | "TE";
  const t = translations[safeLang] || translations.EN;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-pane rounded-3xl p-4"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <p className="truncate text-2xl font-bold">{t.weatherTemp}</p>
          <p className="truncate text-xs text-muted-foreground">{t.weatherDetails}</p>
        </div>
        <CloudSun className="h-10 w-10 shrink-0 text-harvest" />
      </div>
      <div className="mt-3 flex items-start gap-2 rounded-2xl bg-destructive/12 px-3 py-2 text-xs font-medium text-destructive">
        <Wind className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{t.weatherAlert}</span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Droplets className="h-4 w-4 shrink-0 text-sky" />
        <span className="min-w-0 truncate">{t.weatherMoisture}</span>
      </div>
    </motion.div>
  );
}

function ProfileMenu() {
  const { profile, setProfile, theme, setTheme, signOut } = useApp();
  const [open, setOpen] = useState(false);
  
  const safeLang = (profile?.language || "EN").toUpperCase() as "EN" | "HI" | "TE";
  const t = translations[safeLang] || translations.EN;

  return (
    <div className="relative z-50 shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open profile menu"
        className="grid h-11 w-11 place-items-center rounded-full bg-primary text-base font-bold text-primary-foreground shadow-sm"
      >
        {profile.name.charAt(0)}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute right-0 top-13 z-40 w-60 rounded-2xl border border-border bg-popover p-3 text-popover-foreground shadow-xl"
        >
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <User className="h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{profile.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {profile.village} • {profile.acres} {t.acres}
              </p>
            </div>
          </div>

          <p className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <Languages className="h-3.5 w-3.5" /> {t.profileLanguage}
          </p>
          <div className="mt-1 flex gap-1">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setProfile({ language: l.code })}
                className={`flex-1 rounded-lg py-1.5 text-[11px] font-semibold transition-colors ${
                  profile.language === l.code ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <p className="mt-3 text-[11px] font-semibold text-muted-foreground">{t.profileAppearance}</p>
          <div className="mt-1 flex gap-1">
            {(
              [
                { key: "light", icon: Sun },
                { key: "dark", icon: Moon },
                { key: "comfort", icon: Eye },
              ] as const
            ).map((themeOption) => (
              <button
                key={themeOption.key}
                onClick={() => setTheme(themeOption.key)}
                aria-label={`${themeOption.key} mode`}
                className={`grid flex-1 place-items-center rounded-lg py-2 transition-colors ${
                  theme === themeOption.key ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                <themeOption.icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          <button
            onClick={signOut}
            className="mt-3 flex w-full items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20"
          >
            <LogOut className="h-4 w-4" /> {t.profileSignOut}
          </button>
        </motion.div>
      )}
    </div>
  );
}