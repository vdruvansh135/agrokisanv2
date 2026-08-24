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
    disclaimer: "Krishi AI verifies data from official sources.",
    errorVoice: "Voice input is not supported. Please use Google Chrome.",
    errorApi: "API Key missing. Using offline routing.",
    errorGeneral: "Sorry, I had trouble understanding that. Let me try routing you.",
    chips: [
      "Find 5 workers for harvesting tomorrow",
      "Check market prices for Paddy",
      "Rent a tractor nearby",
      "Am I eligible for a bank loan?"
    ]
  },
  HI: {
    title: "कृषि AI",
    subtitle: "आपका कृषि सहायक",
    micHint: "बोलने के लिए माइक पर टैप करें, या नीचे कोई सुझाव चुनें",
    listening: "आपकी आवाज़ सुन रहा हूँ...",
    thinking: "कृषि AI सोच रहा है...",
    placeholder: "अपने खेत के बारे में कुछ भी पूछें…",
    disclaimer: "कृषि AI आधिकारिक स्रोतों से डेटा सत्यापित करता है।",
    errorVoice: "वॉइस इनपुट समर्थित नहीं है। कृपया क्रोम का उपयोग करें।",
    errorApi: "API कुंजी गायब है। ऑफ़लाइन रूटिंग का उपयोग कर रहा हूँ।",
    errorGeneral: "क्षमा करें, मुझे वह समझ नहीं आया।",
    chips: [
      "कल कटाई के लिए 5 मजदूर खोजें",
      "धान के बाजार भाव की जाँच करें",
      "आसपास ट्रैक्टर किराए पर लें",
      "क्या मैं बैंक ऋण के लिए पात्र हूं?"
    ]
  },
  TE: {
    title: "కృషి AI",
    subtitle: "మీ వ్యవసాయ సహాయకుడు",
    micHint: "మాట్లాడటానికి మైక్ నొక్కండి లేదా క్రింద సూచనను ఎంచుకోండి",
    listening: "మీ వాయిస్ వింటున్నాను...",
    thinking: "కృషి AI ఆలోచిస్తోంది...",
    placeholder: "మీ పొలం గురించి ఏదైనా అడగండి…",
    disclaimer: "కృషి AI అధికారిక వనరుల నుండి డేటాను ధృవీకరిస్తుంది.",
    errorVoice: "వాయిస్ ఇన్‌పుట్‌కు మద్దతు లేదు. దయచేసి క్రోమ్ వాడండి.",
    errorApi: "API కీ లేదు. ఆఫ్‌లైన్ రూటింగ్‌ని ఉపయోగిస్తున్నాను.",
    errorGeneral: "క్షమించండి, నాకు అర్థం కాలేదు.",
    chips: [
      "రేపు కోత కోసం 5 మంది కార్మికులను కనుగొనండి",
      "వరికి మార్కెట్ ధరలను తనిఖీ చేయండి",
      "ట్రాక్టర్‌ను అద్దెకు తీసుకోండి",
      "నేను బ్యాంక్ లోన్‌కు అర్హుడినా?"
    ]
  }
};

export function KrishiAI() {
  const { aiOpen, setAiOpen, profile, setProfile, setLaborTab, setLaborFilter, setSchemeFilter } = useApp();
  const navigate = useNavigate();
  const [thinking, setThinking] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const safeLang = (profile?.language || "EN").toUpperCase() as "EN" | "HI" | "TE";
  const dict = translations[safeLang] || translations.EN;

  useEffect(() => {
    if (!aiOpen) {
      setThinking(null);
      setText("");
      setIsListening(false);
    }
  }, [aiOpen]);

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
      setIsListening(false);
      setThinking(`Error: ${event.error}. Try typing.`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // --- FALLBACK ROUTER (Saves the demo if API fails) ---
  const executeFallback = (transcript: string) => {
    const t = transcript.toLowerCase();
    let route = "/";
    
    if (t.includes("worker") || t.includes("labor") || t.includes("hire") || t.includes("harvest")) {
      route = "/labor";
      setLaborTab("hire");
    } else if (t.includes("market") || t.includes("price") || t.includes("mandi")) {
      route = "/market";
    } else if (t.includes("tractor") || t.includes("machine") || t.includes("rent")) {
      route = "/machinery";
    } else if (t.includes("loan") || t.includes("bank") || t.includes("eligible")) {
      route = "/loans";
    } else if (t.includes("scheme") || t.includes("subsidy")) {
      route = "/schemes";
    }

    setThinking(route === "/" ? "Hello! How can I help with your farm today?" : "Opening that for you now...");
    
    setTimeout(() => {
      if (route !== "/") {
        setAiOpen(false);
        navigate({ to: route });
      }
      setThinking(null);
      setText("");
    }, 2000);
  };

  // --- GEMINI API INTEGRATION ---
  const processWithGemini = async (userQuery: string) => {
    if (!userQuery.trim()) return;
    setThinking(dict.thinking);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("VITE_GEMINI_API_KEY is missing. Falling back to local routing.");
      executeFallback(userQuery);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // CRITICAL UPGRADE: Force JSON mode so it never crashes with markdown backticks
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
You are Krishi AI, an expert agricultural assistant for Indian farmers.
User Query: "${userQuery}"

Return strictly a JSON object with this exact format:
{
  "route": "/labor" | "/market" | "/machinery" | "/loans" | "/schemes" | "/risk" | "/records" | "/soil" | "/water" | "/",
  "reply": "Write a friendly 1-2 sentence conversational reply in English, Hindi, or Telugu depending on the query.",
  "filter": "Harvesting" | "Transplanting" | null
}

Rules for Routing:
- hiring/workers -> "/labor"
- prices/mandi -> "/market"
- tools/tractors -> "/machinery"
- subsidies -> "/schemes"
- banks/credit -> "/loans"
- crop health, insurance, weather -> "/risk"
- harvest records, income -> "/records"
- soil testing -> "/soil"
- water sharing, borewells -> "/water"

CRITICAL CHATBOT RULE: 
If the user asks a general farming question (e.g., "how is my crop health?" or "when should I water?"), DO NOT just say hello. Actually ANSWER their question briefly in the "reply" field, and set the route to "/risk" or "/". 
If they just say a simple greeting like "Hi", only then say "Hello, how can I help with your farm today?" and set route to "/".
`;

      const result = await model.generateContent(prompt);
      
      // Because we strictly enforced JSON, we can parse immediately
      const data = JSON.parse(result.response.text());

      // Display the AI's intelligent reply
      setThinking(data.reply);

      setTimeout(() => {
        if (data.route === "/") {
          setText(""); 
          return; // Stay open to continue the chat
        }

        setThinking(null);
        setAiOpen(false);
        setText("");

        if (data.route === "/labor") {
          setLaborTab("hire");
          if (data.filter) setLaborFilter(data.filter);
        } else if (data.route === "/schemes") {
          setSchemeFilter(null);
        }
        
        navigate({ to: data.route });
      }, 4000); // 4 seconds gives the user time to read the reply before navigating

    } catch (error) {
      console.error("Gemini API Error:", error);
      executeFallback(userQuery); 
    }
  };

  const run = (message: string, action: () => void) => {
    setThinking(message);
    window.setTimeout(() => {
      setThinking(null);
      setAiOpen(false);
      action();
    }, 1500);
  };

  const chips: Chip[] = [
    {
      label: dict.chips[0],
      thinking: safeLang === 'EN' ? "Matching harvesting workers..." : safeLang === 'HI' ? "मजदूरों की तलाश..." : "కార్మికుల కోసం వెతుకుతోంది...",
      action: () => { setLaborTab("hire"); setLaborFilter("Harvesting"); navigate({ to: "/labor" }); },
    },
    {
      label: dict.chips[1],
      thinking: safeLang === 'EN' ? "Fetching market prices..." : safeLang === 'HI' ? "बाजार भाव प्राप्त कर रहा है..." : "మార్కెట్ ధరలను పొందుతోంది...",
      action: () => navigate({ to: "/market" }),
    },
    {
      label: dict.chips[2],
      thinking: safeLang === 'EN' ? "Locating machinery..." : safeLang === 'HI' ? "मशीनरी की तलाश..." : "యంత్రాలను వెతుకుతోంది...",
      action: () => navigate({ to: "/machinery" }),
    },
    {
      label: dict.chips[3],
      thinking: safeLang === 'EN' ? "Checking eligibility criteria..." : safeLang === 'HI' ? "पात्रता की जांच कर रहा है..." : "అర్హతను తనిఖీ చేస్తోంది...",
      action: () => navigate({ to: "/loans" }),
    },
  ];

  return (
    <AnimatePresence>
      {aiOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 mx-auto flex max-w-md flex-col justify-end bg-foreground/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="max-h-[92vh] overflow-y-auto rounded-t-[2rem] bg-card p-5 pb-8"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <Sparkles className="h-5 w-5"/>
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-lg leading-tight">{dict.title}</h3>
                  <p className="truncate text-xs text-muted-foreground">{dict.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setAiOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                <X className="h-4 w-4"/>
              </button>
            </div>

            <div className="mt-5 grid place-items-center rounded-3xl bg-primary/10 py-8 border border-primary/20 shadow-inner">
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
                    isListening ? "bg-red-500 scale-110" : "bg-primary hover:scale-105"
                  }`}
                >
                  <Mic className="h-7 w-7"/>
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
              
              <p className="mt-4 text-sm font-bold text-center text-primary max-w-[280px]">
                {thinking ? thinking : dict.micHint}
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {chips.map((chip, i) => (
                <motion.button
                  key={chip.label}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }} whileTap={{ scale: 0.97 }}
                  onClick={() => run(chip.thinking, chip.action)}
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-left text-sm font-medium hover:border-primary/40 transition-colors shadow-sm"
                >
                  {chip.label}
                </motion.button>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 shadow-sm focus-within:border-primary/50 transition-colors">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && processWithGemini(text)}
                placeholder={dict.placeholder}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground font-medium"
              />
              <button
                onClick={() => processWithGemini(text)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground active:scale-95 transition-transform hover:shadow-md"
              >
                <Send className="h-4 w-4 ml-0.5"/>
              </button>
            </div>

            <p className="mt-4 flex items-start justify-center gap-2 text-[11px] font-medium leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0"/>
              {dict.disclaimer}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}