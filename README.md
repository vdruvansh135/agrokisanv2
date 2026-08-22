# Krishi Connect

Role: Act as a Senior React & UI/UX Frontend Architect specializing in Framer Motion, Tailwind CSS, and mobile-first accessibility. Task: Build the complete frontend MVP for "Agro Kisan", a mobile-first agricultural utility ecosystem for Indian farmers based on the project system specifications. Tech Stack: React.js, Tailwind CSS, Shadcn UI, Framer Motion, Lucide React icons. Constraint: DO NOT write backend logic or APIs. Use rich, realistic hardcoded JSON dummy data (Indian farmer names, localized crop records, real scheme data) so the UI is fully interactive for a live hackathon demo. Use React Router or state management to switch smoothly between pages without refreshing.

1. Global Design System & Agricultural Theme:

Vibe: Trustworthy, Rural, Modern, and Natural. Avoid looking like a generic corporate banking app.

Layout: Strictly mobile-first container (max-w-md mx-auto min-h-screen relative overflow-hidden bg-[#f4f8f5]).

Color Palette: Earthy and natural. Primary brand color is vibrant Emerald Green (#10b981). Use warm soil accents (amber/brown) and high-contrast typography for readability.

Theming & Accessibility: Implement working React state toggles for Light Mode, Dark Mode, and "Eye Comfort Mode" (warm #fdf6e3 background tint).

Micro-Interactions & Animations: Use Framer Motion for spring-physics card taps, smooth page transitions, and staggered list fade-ins.

Navigation: A fixed BottomNav with icons for Home, Labor, Risk, and Schemes. Above the nav, place the permanent, glowing "Krishi AI" microphone button with expanding sonar rings.

2. Onboarding & Authentication Flow:

Splash Screen: Green gradient screen with the Agro Kisan branding transitioning into a quick onboarding carousel ("Find Workers", "Protect Your Farm", "Discover Schemes").

Mobile Number + OTP Screen: Clean input UI to enter a phone number and trigger a mock 6-digit OTP verification.

Role Selection & Profile Setup: Simple role selection (Farmer, Worker, Both) followed by a fast profile screen (Name, Village, Language selection for English, Hindi, Telugu) with a visual progress bar ("Profile 60% Complete").

3. Home Dashboard (The Core Hub):

Header: Farm landscape background with a glassmorphism overlay. Displays greeting ("Namaste, Ramu") and top-right profile avatar (opens a dropdown for Profile Details, Language toggle, Theme toggle, and Sign Out).

Weather & Crop Health Widget: Glass-pane card showing "32°C • Mostly Sunny" with a warning badge: "⚠️ High wind expected. Postpone spraying."

Quick Actions Grid: 2x2 animated grid linking to: Find Labor, Risk & Insurance, Govt Schemes, and Farm Records.

4. 🤖 The Krishi AI Assistant (Core Differentiator):

Trigger: Tapping the floating microphone button opens an immersive, sleek AI Voice/Chat modal overlay.

Multimodal Interface: Features a live animated soundwave/pulse visualizer, a text input bar, and a language selector (English/Hindi/Telugu).

Action-Taking Simulation: Includes pre-loaded smart query chips (e.g., "Find 5 workers for harvesting tomorrow", "What government schemes am I eligible for?"). Clicking a chip instantly simulates AI reasoning and navigates the user to the matching page with filters pre-applied.

Safety Notice: Displays a small disclaimer: "Krishi AI verifies data from official sources. Always cross-check official announcements."



5. P2P Labor Marketplace (Zero-Commission):

Top Toggle: Switch between "Hire Laborers" and "Find Work".

Worker Feed: List of worker cards featuring Avatar, Name, Star Rating, Distance (e.g., "2 km away"), Skills tags (Harvesting, Tractor Driver), and Expected Daily Wage (e.g., "₹500/day").

Indicators & Actions: Green dot for "Available Today". High-contrast buttons for "Call Directly" and "Send Message" (with an offline SMS fallback simulation).

6. Risk & Insurance Portal:

Portal Auth: Clean verification screen for government ID input.

Visual Risk Dashboard: Animated circular gauge showing "Groundwater Status: Moderate" and a progress bar for "Crop Risk Assessment".

Application & Tracker: Simple form for crop insurance estimation with an OCR "Scan Document" button. Includes a visual vertical timeline tracking claim status (Submitted → Under Review → Approved).

7. Smart Scheme Aggregator:

Smart Match Feed: Displays agricultural policies filtered automatically based on the farmer's profile (e.g., "Showing schemes matching 5.5 Acres Cotton").

Card UI: Scheme Name, Department, Deadline countdown timer, and a match percentage badge (e.g., "92% Relevant").

Accordion Details: Expandable sections for "Required Documents" and "Mistakes to Avoid", ending with an official external application button.

8. Utility & Support Screens:

Farm Records: Simple dashboard with mocked summary charts tracking harvest revenue versus labor expenses.

Document Wallet: Secure digital folder structure for land receipts and certificates.

Support Center: High-visibility buttons for "Call Support", "Create Ticket", and an Emergency Directory for local agricultural officers.

Execution: Generate the full React project structure with these exact screens. Ensure high visual fidelity, buttery-smooth Framer Motion transitions, and a fully functional UI state.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5f48f4ef-1113-4154-b099-325652c0912b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
