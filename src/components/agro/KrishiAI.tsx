import { AnimatePresence, motion } from "framer-motion";
import { Mic, Send, Sparkles, X, Info } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/app-store";
import { languages } from "@/lib/agro-data";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Chip = {
  label: string;
  thinking: string;
  action: () => void;
};

// --- DYNAMIC TRANSLATION DICTIONARY ---
const translations = {
  EN: {
    title: "Krishi AI",
    subtitle: "Your farming assistant",
    micHint: "Tap the mic to speak, or pick a suggestion below",
    listening: "Listening to your voice...",
    thinking: "Krishi AI is thinking...",
    placeholder: "Ask anything about your farm…",
    disclaimer: "Krishi AI verifies data from official sources. Always cross-check official announcements.",
    errorVoice: "Voice input is not supported. Please use Google Chrome.",
    errorApi: "API Key missing. Please check your .env file.",
    errorGeneral: "Sorry, I had trouble understanding that. Try again.",
    chips: [
      "Find 5 workers for harvesting tomorrow",
      "What government schemes am I eligible for?",
      "Is my crop insurance claim approved?",
      "Show my harvest income this season"
    ]
  },
  HI: {
    title: "कृषि AI",
    subtitle: "आपका कृषि सहायक",
    micHint: "बोलने के लिए माइक पर टैप करें, या नीचे कोई सुझाव चुनें",
    listening: "आपकी आवाज़ सुन रहा हूँ...",
    thinking: "कृषि AI सोच रहा है...",
    placeholder: "अपने खेत के बारे में कुछ भी पूछें…",
    disclaimer: "कृषि AI आधिकारिक स्रोतों से डेटा सत्यापित करता है। हमेशा आधिकारिक घोषणाओं की जांच करें।",
    errorVoice: "वॉइस इनपुट समर्थित नहीं है। कृपया क्रोम का उपयोग करें।",
    errorApi: "API कुंजी गायब है।",
    errorGeneral: "क्षमा करें, मुझे वह समझ नहीं आया। पुनः प्रयास करें।",
    chips: [
      "कल कटाई के लिए 5 मजदूर खोजें",
      "मैं किन सरकारी योजनाओं के लिए पात्र हूं?",
      "क्या मेरा फसल बीमा दावा स्वीकृत हो गया है?",
      "इस सीजन की मेरी फसल की आय दिखाएं"
    ]
  },
  TE: {
    title: "కృషి AI",
    subtitle: "మీ వ్యవసాయ సహాయకుడు",
    micHint: "మాట్లాడటానికి మైక్ నొక్కండి లేదా క్రింద సూచనను ఎంచుకోండి",
    listening: "మీ వాయిస్ వింటున్నాను...",
    thinking: "కృషి AI ఆలోచిస్తోంది...",
    placeholder: "మీ పొలం గురించి ఏదైనా అడగండి…",
    disclaimer: "కృషి AI అధికారిక వనరుల నుండి డేటాను ధృవీకరిస్తుంది. ఎల్లప్పుడూ అధికారిక ప్రకటనలను తనిఖీ చేయండి.",
    errorVoice: "వాయిస్ ఇన్‌పుట్‌కు మద్దతు లేదు. దయచేసి క్రోమ్ వాడండి.",
    errorApi: "API కీ లేదు.",
    errorGeneral: "క్షమించండి, నాకు అర్థం కాలేదు. మళ్ళీ ప్రయత్నించండి.",
    chips: [
      "రేపు కోత కోసం 5 మంది కార్మికులను కనుగొనండి",
      "నేను ఏ ప్రభుత్వ పథకాలకు అర్హుడిని?",
      "నా పంట బీమా దావా ఆమోదించబడిందా?",
      "ఈ సీజన్‌లో నా పంట ఆదాయాన్ని చూపించు"
    ]
  }
};

export function KrishiAI() {
  const { aiOpen, setAiOpen, profile, setProfile, setLaborTab, setLaborFilter, setSchemeFilter } = useApp();
  const navigate = useNavigate();
  const [thinking, setThinking] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Safely get language and dictionary
  const safeLang = (profile?.language || "EN").toUpperCase() as "EN" | "HI" | "TE";
  const dict = translations[safeLang] || translations.EN;

  useEffect(() => {
    if (!aiOpen) {
      setThinking(null);
      setText("");
      setIsListening(false);
    }
  }, [aiOpen]);

  // --- 1. WEB SPEECH API (VOICE TO TEXT) ---
  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setThinking(dict.errorVoice);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = safeLang === 'HI' ? 'hi-IN' : safeLang === 'TE' ? 'te-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setThinking(dict.listening);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      processWithGemini(transcript); 
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error);
      setIsListening(false);
      setThinking(`Error: ${event.error}. Try typing.`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // --- 2. GEMINI AI INTENT PARSER (WITH STRICT JSON OVERRIDE) ---
  const processWithGemini = async (userQuery: string) => {
    if (!userQuery.trim()) return;

    setThinking(dict.thinking);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      if (!apiKey) {
        setThinking(dict.errorApi);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      
      // CRITICAL FIX: Force application/json so Gemini never hallucinates markdown backticks
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const targetLanguageName = safeLang === 'HI' ? 'Hindi' : safeLang === 'TE' ? 'Telugu' : 'English';

      const prompt = `
You are Krishi AI, an operational agricultural assistant for Indian farmers.
The user said: "${userQuery}"

Respond ONLY with a valid JSON object matching this exact schema:
{
  "intent": "labor" | "schemes" | "risk" | "records" | "general",
  "reply": "Write a friendly, 1-2 sentence reply in ${targetLanguageName}. If they say hi/hello, greet them warmly and ask how you can help them with their farm today.",
  "labor_filter": "Harvesting" | "Sowing" | "Spraying" | "Tractor" | null
}
`;

      const result = await model.generateContent(prompt);
      const data = JSON.parse(result.response.text());

      // Show Gemini's reply in the UI
      setThinking(data.reply);

      setTimeout(() => {
        // If it's just a general chat (like "Hi"), keep the modal open
        if (data.intent === "general") {
          setText(""); 
          return; 
        }

        // Otherwise, close the modal and route
        setThinking(null);
        setAiOpen(false);
        setText("");

        if (data.intent === "labor") {
          setLaborTab("hire");
          if (data.labor_filter) setLaborFilter(data.labor_filter);
          navigate({ to: "/labor" });
        } else if (data.intent === "schemes") {
          setSchemeFilter(null);
          navigate({ to: "/schemes" });
        } else if (data.intent === "risk") {
          navigate({ to: "/risk" });
        } else if (data.intent === "records") {
          navigate({ to: "/records" });
        }
      }, 3500); // Wait 3.5 seconds so the user can read the reply before the page changes

    } catch (error) {
      console.error("Gemini API error:", error);
      setThinking(dict.errorGeneral);
    }
  };

  const run = (message: string, done: () => void) => {
    setThinking(message);
    window.setTimeout(() => {
      setThinking(null);
      setAiOpen(false);
      done();
    }, 1500);
  };

  const chips: Chip[] = [
    {
      label: dict.chips[0],
      thinking: safeLang === 'EN' ? "Matching harvesting workers..." : safeLang === 'HI' ? "मजदूरों की तलाश..." : "కార్మికుల కోసం వెతుకుతోంది...",
      action: () => {
        setLaborTab("hire");
        setLaborFilter("Harvesting");
        navigate({ to: "/labor" });
      },
    },
    {
      label: dict.chips[1],
      thinking: safeLang === 'EN' ? "Checking schemes..." : safeLang === 'HI' ? "योजनाओं की जांच कर रहा है..." : "పథకాలను తనిఖీ చేస్తోంది...",
      action: () => {
        setSchemeFilter(null);
        navigate({ to: "/schemes" });
      },
    },
    {
      label: dict.chips[2],
      thinking: safeLang === 'EN' ? "Fetching claim status..." : safeLang === 'HI' ? "दावे की स्थिति प्राप्त कर रहा है..." : "క్లెయిమ్ స్థితిని పొందుతోంది...",
      action: () => navigate({ to: "/risk" }),
    },
    {
      label: dict.chips[3],
      thinking: safeLang === 'EN' ? "Loading records..." : safeLang === 'HI' ? "रिकॉर्ड लोड हो रहा है..." : "రికార్డులు లోడ్ అవుతున్నాయి...",
      action: () => navigate({ to: "/records" }),
    },
  ];

  return (
    <AnimatePresence>
      {aiOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 mx-auto flex max-w-md flex-col justify-end bg-foreground/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="max-h-[92vh] overflow-y-auto rounded-t-[2rem] bg-card p-5 pb-8"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-lg leading-tight">{dict.title}</h3>
                  <p className="truncate text-xs text-muted-foreground">{dict.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setAiOpen(false)}
                aria-label="Close assistant"
                className="grid h-9 w-9 place-items-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid place-items-center rounded-3xl bg-primary/10 py-8">
              <div className="relative grid h-24 w-24 place-items-center">
                {isListening && (
                  <>
                    <motion.span
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 rounded-full bg-red-400/40"
                    />
                    <motion.span
                      animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                      className="absolute inset-0 rounded-full bg-red-400/30"
                    />
                  </>
                )}
                <button
                  onClick={startListening}
                  className={`relative grid h-16 w-16 place-items-center rounded-full text-primary-foreground shadow-lg transition-colors duration-300 ${
                    isListening ? "bg-red-500 scale-110" : "bg-primary"
                  }`}
                >
                  <Mic className="h-7 w-7" />
                </button>
              </div>
              <div className="mt-5 flex h-10 items-end gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{ height: [8, 10 + ((i * 7) % 30), 8] }}
                    transition={{ repeat: Infinity, duration: 0.9 + (i % 5) * 0.12, ease: "easeInOut" }}
                    className="w-1.5 rounded-full bg-primary/70"
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-center text-muted-foreground max-w-[280px]">
                {thinking ? thinking : dict.micHint}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setProfile({ language: l.code })}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                    profile.language === l.code
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              {chips.map((chip, i) => (
                <motion.button
                  key={chip.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => run(chip.thinking, chip.action)}
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-left text-sm font-medium"
                >
                  {chip.label}
                </motion.button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && processWithGemini(text)}
                placeholder={dict.placeholder}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                aria-label="Send"
                onClick={() => processWithGemini(text)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground active:scale-95 transition-transform"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {dict.disclaimer}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}