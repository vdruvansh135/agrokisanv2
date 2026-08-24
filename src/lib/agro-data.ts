export type Worker = {
  id: string;
  name: string;
  village: string;
  rating: number;
  jobs: number;
  distanceKm: number;
  skills: string[];
  wage: number;
  availableToday: boolean;
  phone: string;
  initials: string;
};

export const workers: Worker[] = [
  {
    id: "w1",
    name: "Ramesh Naidu",
    village: "Kotapalli, Guntur",
    rating: 4.8,
    jobs: 132,
    distanceKm: 2,
    skills: ["Harvesting", "Tractor Driver"],
    wage: 500,
    availableToday: true,
    phone: "+91 98490 11223",
    initials: "RN",
  },
  {
    id: "w2",
    name: "Lakshmi Devi",
    village: "Peddapuram, E. Godavari",
    rating: 4.9,
    jobs: 210,
    distanceKm: 3.5,
    skills: ["Transplanting", "Weeding"],
    wage: 420,
    availableToday: true,
    phone: "+91 90005 44192",
    initials: "LD",
  },
  {
    id: "w3",
    name: "Suresh Yadav",
    village: "Bhainsa, Nirmal",
    rating: 4.4,
    jobs: 76,
    distanceKm: 5,
    skills: ["Spraying", "Harvesting"],
    wage: 550,
    availableToday: false,
    phone: "+91 91778 20114",
    initials: "SY",
  },
  {
    id: "w4",
    name: "Anjamma Bai",
    village: "Warangal Rural",
    rating: 4.7,
    jobs: 188,
    distanceKm: 6.2,
    skills: ["Cotton Picking", "Harvesting"],
    wage: 450,
    availableToday: true,
    phone: "+91 96666 78321",
    initials: "AB",
  },
  {
    id: "w5",
    name: "Mohan Reddy",
    village: "Kurnool",
    rating: 4.6,
    jobs: 95,
    distanceKm: 8,
    skills: ["Tractor Driver", "Borewell Repair"],
    wage: 700,
    availableToday: true,
    phone: "+91 93910 55480",
    initials: "MR",
  },
  {
    id: "w6",
    name: "Gopal Singh",
    village: "Sirsa, Haryana",
    rating: 4.2,
    jobs: 54,
    distanceKm: 11,
    skills: ["Irrigation", "Weeding"],
    wage: 480,
    availableToday: false,
    phone: "+91 99887 30021",
    initials: "GS",
  },
];

export type JobPost = {
  id: string;
  title: string;
  farmer: string;
  village: string;
  distanceKm: number;
  wage: number;
  workers: number;
  date: string;
};

export const jobs: JobPost[] = [
  {
    id: "j1",
    title: "Tomato harvesting — 2 acres",
    farmer: "Ramu Yadav",
    village: "Kotapalli",
    distanceKm: 1.5,
    wage: 520,
    workers: 5,
    date: "Tomorrow, 6:00 AM",
  },
  {
    id: "j2",
    title: "Cotton picking — 4 acres",
    farmer: "Sitamma Rao",
    village: "Warangal Rural",
    distanceKm: 4,
    wage: 460,
    workers: 8,
    date: "Sat, 24 Aug",
  },
  {
    id: "j3",
    title: "Paddy transplanting",
    farmer: "Venkat Rami Reddy",
    village: "Nandyal",
    distanceKm: 7,
    wage: 500,
    workers: 12,
    date: "Mon, 26 Aug",
  },
];

export type Scheme = {
  id: string;
  name: string;
  department: string;
  match: number;
  benefit: string;
  deadline: string;
  summary: string;
  documents: string[];
  mistakes: string[];
  url: string;
  tags: string[];
};

export const schemes: Scheme[] = [
  {
    id: "s1",
    name: "PM Kisan Samman Nidhi",
    department: "Ministry of Agriculture & Farmers Welfare",
    match: 96,
    benefit: "₹6,000 / year in 3 instalments",
    deadline: "2026-09-30",
    summary:
      "Direct income support for all landholding farmer families, credited straight to your Aadhaar-linked bank account.",
    documents: ["Aadhaar Card", "Land Record (Pahani / 1-B)", "Bank Passbook", "Mobile linked to Aadhaar"],
    mistakes: [
      "Name spelling mismatch between Aadhaar and bank passbook",
      "Submitting an old land record without the latest mutation entry",
      "Not completing e-KYC before the instalment cut-off",
    ],
    url: "https://pmkisan.gov.in",
    tags: ["Income Support", "All Crops"],
  },
  {
    id: "s2",
    name: "Pradhan Mantri Fasal Bima Yojana",
    department: "Dept. of Agriculture, Cooperation & Farmers Welfare",
    match: 92,
    benefit: "Crop insurance at 2% premium for Kharif",
    deadline: "2026-08-31",
    summary:
      "Covers yield loss from drought, flood, pest attack and unseasonal rain for notified crops including cotton and paddy.",
    documents: ["Aadhaar Card", "Sowing Certificate", "Land Ownership Proof", "Bank Account Details"],
    mistakes: [
      "Applying after the notified cut-off date for the season",
      "Declaring a crop different from the one actually sown",
      "Not reporting localised damage within 72 hours",
    ],
    url: "https://pmfby.gov.in",
    tags: ["Insurance", "Cotton", "Paddy"],
  },
  {
    id: "s3",
    name: "Rythu Bharosa (Telangana)",
    department: "Government of Telangana, Agriculture Dept.",
    match: 88,
    benefit: "₹12,000 / acre / year investment support",
    deadline: "2026-10-15",
    summary:
      "Season-wise investment support for cultivating farmers with clean land title, paid before Kharif and Rabi sowing.",
    documents: ["Pattadar Passbook", "Aadhaar Card", "Bank Passbook"],
    mistakes: [
      "Land not updated in Dharani portal after inheritance",
      "Joint holdings not split correctly among family members",
    ],
    url: "https://rythubandhu.telangana.gov.in",
    tags: ["State Scheme", "Investment Support"],
  },
  {
    id: "s4",
    name: "Kisan Credit Card (KCC)",
    department: "NABARD / Public Sector Banks",
    match: 84,
    benefit: "Crop loan up to ₹3 lakh at 4% effective interest",
    deadline: "2026-12-31",
    summary:
      "Short-term credit for inputs, with interest subvention if repaid on time. Also covers allied activities like dairy.",
    documents: ["Aadhaar Card", "Land Records", "Passport Photos", "Crop Plan Estimate"],
    mistakes: [
      "Missing the on-time repayment window and losing the 3% subvention",
      "Using crop loan funds for non-farm expenses",
    ],
    url: "https://www.nabard.org",
    tags: ["Credit", "Loan"],
  },
  {
    id: "s5",
    name: "Per Drop More Crop — Micro Irrigation",
    department: "PMKSY, Ministry of Jal Shakti",
    match: 79,
    benefit: "Up to 55% subsidy on drip & sprinkler systems",
    deadline: "2026-11-20",
    summary: "Subsidy on micro-irrigation equipment for small and marginal farmers in water-stressed mandals.",
    documents: ["Land Record", "Aadhaar Card", "Water Source Certificate", "Vendor Quotation"],
    mistakes: ["Buying equipment before sanction approval", "Choosing a vendor not empanelled by the department"],
    url: "https://pmksy.gov.in",
    tags: ["Irrigation", "Subsidy"],
  },
];

export const revenueData = [
  { month: "Mar", revenue: 42000, expense: 18500 },
  { month: "Apr", revenue: 51000, expense: 21000 },
  { month: "May", revenue: 38000, expense: 24500 },
  { month: "Jun", revenue: 64000, expense: 27000 },
  { month: "Jul", revenue: 72500, expense: 30500 },
  { month: "Aug", revenue: 58000, expense: 22500 },
];

export const cropRecords = [
  { id: "c1", crop: "Cotton", acres: 3.5, sown: "12 Jun 2026", stage: "Flowering", health: 82 },
  { id: "c2", crop: "Paddy (MTU-1010)", acres: 1.5, sown: "28 Jun 2026", stage: "Tillering", health: 74 },
  { id: "c3", crop: "Tomato", acres: 0.5, sown: "05 Jul 2026", stage: "Fruiting", health: 91 },
];

export const documents = [
  { id: "d1", name: "Pattadar Passbook", type: "Land", updated: "14 Jan 2026", size: "1.2 MB" },
  { id: "d2", name: "Pahani / 1-B Extract", type: "Land", updated: "02 Mar 2026", size: "820 KB" },
  { id: "d3", name: "Aadhaar Card", type: "Identity", updated: "11 Nov 2025", size: "440 KB" },
  { id: "d4", name: "Soil Health Card", type: "Certificate", updated: "19 Apr 2026", size: "610 KB" },
  { id: "d5", name: "Crop Insurance Receipt 2025", type: "Receipt", updated: "08 Aug 2025", size: "300 KB" },
];

export const claimTimeline = [
  { id: "t1", label: "Application Submitted", date: "02 Aug 2026", state: "done" as const },
  { id: "t2", label: "Field Verification", date: "09 Aug 2026", state: "done" as const },
  { id: "t3", label: "Under Review — District Office", date: "In progress", state: "active" as const },
  { id: "t4", label: "Approved & Amount Credited", date: "Expected 05 Sep 2026", state: "pending" as const },
];

export const officers = [
  { id: "o1", name: "Mandal Agriculture Officer", person: "Sri K. Prasad", phone: "+91 98480 22110" },
  { id: "o2", name: "Veterinary Emergency", person: "District Helpline", phone: "1962" },
  { id: "o3", name: "Kisan Call Centre", person: "National Helpline", phone: "1800 180 1551" },
  { id: "o4", name: "Insurance Grievance", person: "PMFBY Cell", phone: "1800 200 7710" },
];

export const languages = [
  { code: "EN", label: "English" },
  { code: "HI", label: "हिन्दी" },
  { code: "BN", label: "বাংলা" },
  { code: "MR", label: "मराठी" },
  { code: "TE", label: "తెలుగు" },
  { code: "TA", label: "தமிழ்" },
  { code: "GU", label: "ગુજરાતી" },
  { code: "UR", label: "اردو" },
  { code: "KN", label: "ಕನ್ನಡ" },
  { code: "OR", label: "ଓଡ଼ିଆ" },
  { code: "ML", label: "മലയാളം" }
];
export function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date("2026-08-21").getTime();
  return Math.max(0, Math.round(diff / 86400000));
}
