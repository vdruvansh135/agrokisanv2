import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Theme = "light" | "dark" | "comfort";
export type Role = "farmer" | "worker" | "both";

export type Profile = {
  name: string;
  village: string;
  language: string;
  role: Role;
  phone: string;
  acres: number;
  crop: string;
};

type Store = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  profile: Profile;
  setProfile: (p: Partial<Profile>) => void;
  aiOpen: boolean;
  setAiOpen: (v: boolean) => void;
  laborTab: "hire" | "work";
  setLaborTab: (v: "hire" | "work") => void;
  laborFilter: string | null;
  setLaborFilter: (v: string | null) => void;
  schemeFilter: string | null;
  setSchemeFilter: (v: string | null) => void;
  signOut: () => void;
};

const defaultProfile: Profile = {
  name: "Ramu",
  village: "Kotapalli, Guntur",
  language: "EN", // FIXED: Changed "en" to "EN" to match our translation dictionary
  role: "farmer",
  phone: "+91 98765 43210",
  acres: 5.5,
  crop: "Cotton",
};

const AppContext = createContext<Store | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [onboarded, setOnboarded] = useState(false);
  const [profile, setProfileState] = useState<Profile>(defaultProfile);
  const [aiOpen, setAiOpen] = useState(false);
  const [laborTab, setLaborTab] = useState<"hire" | "work">("hire");
  const [laborFilter, setLaborFilter] = useState<string | null>(null);
  const [schemeFilter, setSchemeFilter] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "comfort");
    if (theme !== "light") root.classList.add(theme);
  }, [theme]);

  const value = useMemo<Store>(
    () => ({
      theme,
      setTheme,
      onboarded,
      setOnboarded,
      profile,
      setProfile: (p) => setProfileState((prev) => ({ ...prev, ...p })),
      aiOpen,
      setAiOpen,
      laborTab,
      setLaborTab,
      laborFilter,
      setLaborFilter,
      schemeFilter,
      setSchemeFilter,
      signOut: () => {
        setOnboarded(false);
        setProfileState(defaultProfile);
      },
    }),
    [theme, onboarded, profile, aiOpen, laborTab, laborFilter, schemeFilter],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}