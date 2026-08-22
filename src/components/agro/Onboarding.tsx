import { AnimatePresence, motion } from "framer-motion";
import { Sprout, Users, ShieldCheck, Landmark, ArrowRight, Phone, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp, type Role } from "@/lib/app-store";
import { languages } from "@/lib/agro-data";

const slides = [
  { icon: Users, title: "Find Workers", body: "Hire trusted laborers near your village. Zero commission, always." },
  { icon: ShieldCheck, title: "Protect Your Farm", body: "Track crop risk, groundwater and insurance claims in one place." },
  { icon: Landmark, title: "Discover Schemes", body: "See only the government schemes that actually match your land." },
];

export function Onboarding() {
  const { setOnboarded, profile, setProfile } = useApp();
  const [step, setStep] = useState(0); // 0 splash, 1 carousel, 2 phone, 3 otp, 4 role, 5 profile
  const [slide, setSlide] = useState(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");

  useEffect(() => {
    if (step === 0) {
      const t = window.setTimeout(() => setStep(1), 1900);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [step]);

  return (
    <div className="relative mx-auto min-h-screen max-w-md overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="splash"
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary to-[oklch(0.45_0.12_155)] text-primary-foreground"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="grid h-24 w-24 place-items-center rounded-[2rem] bg-primary-foreground/15 backdrop-blur"
            >
              <Sprout className="h-12 w-12" />
            </motion.div>
            <motion.h1
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-6 text-4xl"
            >
              Agro Kisan
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.5 }}
              className="mt-1 text-sm"
            >
              किसान का साथी • Farmer&apos;s companion
            </motion.p>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="carousel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex min-h-screen flex-col justify-between p-6"
          >
            <div className="pt-14">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ type: "spring", stiffness: 240, damping: 26 }}
                  className="text-center"
                >
                  {(() => {
                    const Icon = slides[slide]!.icon;
                    return (
                      <span className="mx-auto grid h-28 w-28 place-items-center rounded-[2rem] bg-primary/12 text-primary">
                        <Icon className="h-14 w-14" />
                      </span>
                    );
                  })()}
                  <h2 className="mt-8 text-3xl">{slides[slide]!.title}</h2>
                  <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">{slides[slide]!.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div>
              <div className="mb-6 flex justify-center gap-2">
                {slides.map((s, i) => (
                  <span
                    key={s.title}
                    className={`h-2 rounded-full transition-all ${i === slide ? "w-6 bg-primary" : "w-2 bg-border"}`}
                  />
                ))}
              </div>
              <PrimaryButton
                onClick={() => (slide < slides.length - 1 ? setSlide(slide + 1) : setStep(2))}
                label={slide < slides.length - 1 ? "Next" : "Get Started"}
              />
              <button
                onClick={() => setStep(2)}
                className="mt-3 w-full py-2 text-sm font-medium text-muted-foreground"
              >
                Skip
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <StepShell key="phone" title="Enter your mobile number" subtitle="We will send a 6-digit OTP to verify">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
              <Phone className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm font-semibold">+91</span>
              <input
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="98765 43210"
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
            </div>
            <PrimaryButton
              disabled={phone.length !== 10}
              onClick={() => {
                setProfile({ phone: `+91 ${phone}` });
                setStep(3);
              }}
              label="Send OTP"
              className="mt-6"
            />
          </StepShell>
        )}

        {step === 3 && (
          <StepShell key="otp" title="Verify OTP" subtitle={`Sent to ${profile.phone} • demo code 123456`}>
            <div className="flex justify-between gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`grid h-14 flex-1 place-items-center rounded-xl border text-xl font-bold ${
                    otp.length === i ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  {otp[i] ?? ""}
                </div>
              ))}
            </div>
            <input
              autoFocus
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="mt-4 w-full rounded-xl border border-border bg-card px-4 py-3 text-center tracking-[0.5em] outline-none"
              placeholder="••••••"
            />
            <PrimaryButton
              disabled={otp.length !== 6}
              onClick={() => setStep(4)}
              label="Verify & Continue"
              className="mt-6"
            />
          </StepShell>
        )}

        {step === 4 && (
          <StepShell key="role" title="How will you use Agro Kisan?" subtitle="You can change this later">
            <div className="space-y-3">
              {(
                [
                  { key: "farmer", label: "Farmer", desc: "I own or cultivate land and hire workers" },
                  { key: "worker", label: "Worker", desc: "I look for daily farm work nearby" },
                  { key: "both", label: "Both", desc: "I farm and also take up work" },
                ] as { key: Role; label: string; desc: string }[]
              ).map((r) => (
                <motion.button
                  key={r.key}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setProfile({ role: r.key })}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left ${
                    profile.role === r.key ? "border-primary bg-primary/8" : "border-border bg-card"
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{r.label}</span>
                    <span className="block text-xs text-muted-foreground">{r.desc}</span>
                  </span>
                  {profile.role === r.key && (
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
            <PrimaryButton onClick={() => setStep(5)} label="Continue" className="mt-6" />
          </StepShell>
        )}

        {step === 5 && (
          <StepShell key="profile" title="Set up your profile" subtitle="Almost done">
            <div className="mb-5">
              <div className="mb-1 flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Profile {name && village ? 100 : 60}% Complete</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  animate={{ width: name && village ? "100%" : "60%" }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ramu Yadav"
              className="mb-4 w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none"
            />
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Village / District</label>
            <input
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="Kotapalli, Guntur"
              className="mb-4 w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none"
            />
            <label className="mb-2 block text-xs font-semibold text-muted-foreground">Preferred Language</label>
            <div className="flex gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setProfile({ language: l.code })}
                  className={`flex-1 rounded-full py-2 text-sm font-semibold ${
                    profile.language === l.code
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <PrimaryButton
              onClick={() => {
                setProfile({ name: name || "Ramu", village: village || "Kotapalli, Guntur" });
                setOnboarded(true);
              }}
              label="Enter Agro Kisan"
              className="mt-8"
            />
          </StepShell>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      className="min-h-screen p-6 pt-16"
    >
      <h2 className="text-2xl">{title}</h2>
      <p className="mb-8 mt-1 text-sm text-muted-foreground">{subtitle}</p>
      {children}
    </motion.div>
  );
}

function PrimaryButton({
  label,
  onClick,
  disabled,
  className = "",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-primary-foreground disabled:opacity-40 ${className}`}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </motion.button>
  );
}
