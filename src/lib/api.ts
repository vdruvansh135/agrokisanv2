import { jobs as localJobs, schemes as localSchemes, workers as localWorkers } from "@/lib/agro-data";
import type { JobPost, Scheme, Worker } from "@/lib/agro-data";

export const API_BASE_URL =
  (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ?? "http://localhost:8000";

export type ApiWorker = {
  id: string;
  name: string;
  initials: string;
  village: string;
  location: string;
  skills: string[];
  daily_wage: number;
  distance_km: number;
  rating: number;
  jobs_done: number;
  available_today: boolean;
  phone: string;
};

export type ApiJob = {
  id: string;
  title: string;
  farmer: string;
  village: string;
  distance_km: number;
  date: string;
  workers_needed: number;
  daily_wage: number;
};

export type ApiScheme = {
  id: string;
  name: string;
  department: string;
  description: string;
  benefit: string;
  requirements: string[];
  mistakes: string[];
  match_percentage: number;
  deadline: string;
  url: string;
};

export type IntentPayload = {
  action: string;
  route: string;
  filters: { skill?: string | null; tab?: "hire" | "work" | null; availableToday?: boolean | null };
  reply: string;
  thinking: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

const toWorker = (w: ApiWorker): Worker => ({
  id: w.id,
  name: w.name,
  village: w.village,
  rating: w.rating,
  jobs: w.jobs_done,
  distanceKm: w.distance_km,
  skills: w.skills,
  wage: w.daily_wage,
  availableToday: w.available_today,
  phone: w.phone,
  initials: w.initials,
});

const toJob = (j: ApiJob): JobPost => ({
  id: j.id,
  title: j.title,
  farmer: j.farmer,
  village: j.village,
  distanceKm: j.distance_km,
  date: j.date,
  workers: j.workers_needed,
  wage: j.daily_wage,
});

const toScheme = (s: ApiScheme): Scheme => ({
  id: s.id,
  name: s.name,
  department: s.department,
  summary: s.description,
  benefit: s.benefit,
  documents: s.requirements,
  mistakes: s.mistakes,
  match: s.match_percentage,
  deadline: s.deadline,
  url: s.url,
});

/** Filters supported by GET /api/labor */
export type LaborFilters = { skill?: string | null; maxDistance?: number; availableToday?: boolean };

export async function fetchWorkers(filters: LaborFilters = {}): Promise<{ data: Worker[]; live: boolean }> {
  const qs = new URLSearchParams();
  if (filters.skill) qs.set("skill", filters.skill);
  if (filters.maxDistance != null) qs.set("max_distance", String(filters.maxDistance));
  if (filters.availableToday != null) qs.set("available_today", String(filters.availableToday));
  const suffix = qs.toString() ? `?${qs}` : "";
  try {
    const rows = await request<ApiWorker[]>(`/api/labor${suffix}`);
    return { data: rows.map(toWorker), live: true };
  } catch {
    let data = localWorkers;
    if (filters.skill) data = data.filter((w) => w.skills.includes(filters.skill!));
    if (filters.availableToday != null) data = data.filter((w) => w.availableToday === filters.availableToday);
    if (filters.maxDistance != null) data = data.filter((w) => w.distanceKm <= filters.maxDistance!);
    return { data, live: false };
  }
}

export async function fetchJobs(): Promise<{ data: JobPost[]; live: boolean }> {
  try {
    const rows = await request<ApiJob[]>("/api/jobs");
    return { data: rows.map(toJob), live: true };
  } catch {
    return { data: localJobs, live: false };
  }
}

export async function fetchSchemes(acres?: number): Promise<{ data: Scheme[]; live: boolean }> {
  const suffix = acres != null ? `?acres=${acres}` : "";
  try {
    const rows = await request<ApiScheme[]>(`/api/schemes${suffix}`);
    return { data: rows.map(toScheme), live: true };
  } catch {
    return { data: localSchemes, live: false };
  }
}

const OFFLINE_ROUTES: Array<[string[], string, string]> = [
  [["worker", "labour", "labor", "hire", "harvest", "picking", "tractor", "coolie"], "/labor", "Matching workers near your farm…"],
  [["scheme", "subsidy", "pm kisan", "rythu", "loan", "credit"], "/schemes", "Checking schemes for your land…"],
  [["insurance", "claim", "water", "borewell", "drought", "rain", "risk"], "/risk", "Fetching claim and groundwater status…"],
  [["income", "expense", "profit", "yield", "record", "season"], "/records", "Summarising your season records…"],
  [["document", "pattadar", "land paper", "certificate"], "/wallet", "Opening your document wallet…"],
  [["officer", "helpline", "complaint", "support"], "/support", "Finding the right officer…"],
];

const SKILLS = ["Harvesting", "Transplanting", "Weeding", "Spraying", "Cotton Picking", "Tractor Driver"];

function offlineIntent(transcript: string): IntentPayload {
  const t = transcript.toLowerCase();
  const hit = OFFLINE_ROUTES.find(([keys]) => keys.some((k) => t.includes(k)));
  const route = hit?.[1] ?? "/schemes";
  const filters: IntentPayload["filters"] = {};
  if (route === "/labor") {
    filters.tab = t.includes("find work") || t.includes("need job") ? "work" : "hire";
    filters.skill = SKILLS.find((s) => t.includes(s.toLowerCase().split(" ")[0])) ?? null;
  }
  return {
    action: hit ? "navigate" : "unknown",
    route,
    filters,
    reply: "Opening the right screen for you.",
    thinking: hit?.[2] ?? "Understanding your question…",
  };
}

export async function postIntent(input: {
  transcript: string;
  language?: string;
  acres?: number;
  crop?: string;
}): Promise<{ data: IntentPayload; live: boolean }> {
  try {
    const data = await request<IntentPayload>("/api/ai/intent", {
      method: "POST",
      body: JSON.stringify({
        transcript: input.transcript,
        language: input.language ?? "en",
        acres: input.acres,
        crop: input.crop,
      }),
    });
    return { data, live: true };
  } catch {
    return { data: offlineIntent(input.transcript), live: false };
  }
}
