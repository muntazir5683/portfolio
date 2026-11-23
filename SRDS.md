# Software Requirements & Design Specification (SRDS)
**Project:** Syed Muntazir — Full-Stack Software Engineer & AI Automation Portfolio  
**Architecture:** Astro (Static-First) + React Islands + Tailwind CSS  
**Target Audience:** Technical Recruiters, Hiring Managers, and Freelance / Enterprise Clients  

---

## 1. Project Overview & Performance Goals
This portfolio website is engineered to showcase expertise in Full-Stack Web Applications (React, Python, FastAPI) and AI Workflow Automations while maintaining ultra-fast page load performance.

* **Performance Targets (Core Web Vitals):**
  * **Lighthouse Performance Score:** 98–100 / 100
  * **First Contentful Paint (FCP) & Largest Contentful Paint (LCP):** < 1.0s
  * **Zero-JS Baseline:** Static content renders as pure HTML/CSS via Astro; interactive React islands hydrate strictly on demand (`client:idle` or `client:visible`).

---

## 2. Tech Stack & Architecture
* **Core Framework:** Astro v5+ (Static Site Generation / Island Architecture)
* **Interactive UI Islands:** React 19 + TypeScript (`.tsx`)
* **Styling:** Tailwind CSS (purged utility classes, zero runtime overhead)
* **Icons:** `lucide-react` (tree-shaken SVG icons)
* **Fonts:** Google Fonts (`Inter` for UI/headings, `JetBrains Mono` for code tags & automation logs) with `font-display: swap`
* **Deployment & Edge CDN:** Vercel or Cloudflare Pages

---

## 3. Visual Identity & Design System
* **Color Palette:**
  * **Primary Background:** Deep Navy (`#0A192F`)
  * **Card / Elevated Surface:** Midnight Slate (`#112240`)
  * **Border / Subtle Divider:** Slate Navy (`#233554`)
  * **Primary Text / Headings:** Crisp White (`#FFFFFF`)
  * **Secondary / Body Text:** Muted Slate (`#8892B0`)
  * **Accent / Interactive Triggers:** Electric Cyan (`#38BDF8`) & Emerald Status (`#10B981`)
* **Design Principles:** High-contrast minimalist layout, crisp typography, subtle GPU-accelerated hover transitions, and glassmorphic interactive modals/widgets.

---

## 4. Functional Modules & Interactive Automations

### 4.1 Sticky Navigation & Hero Section (`Static Astro` + lightweight inline script)
* **Navbar:** Brand monogram (`SM.`), quick-scroll links (`Projects`, `Automations`, `Experience`, `Contact`), and a `"Resume / Hire Me"` CTA button.
* **Hero Content:**
  * Live status badge: `● Available for Full-Time Roles & AI Projects`
  * Name & Headline: **Syed Muntazir** — Full-Stack Software Engineer & AI Automation Architect.
  * Lightweight role ticker cycling through: `AI Workflow Automations`, `Python & FastAPI Backends`, `React & Modern Web Apps`, `Browser Extensions & Scrapers`.
  * Primary CTAs: `"Test Live Automations"` (scrolls to sandbox) and `"View Projects"`.

### 4.2 Interactive Automation Sandbox (`React Island` — `client:visible`)
An interactive workflow visualizer demonstrating real engineering pipelines in action. Visitors select a workflow preset and click **Run Pipeline** to watch step-by-step execution with real-time logs, latency metrics, and structured JSON output:
1. **PakGovJobs Automated Scraper & Expiry Filter:** Simulates multi-portal job fetching, date parsing, active vs. expired classification, and clean JSON structuring.
2. **SellerShield AI Scam Risk Analyzer:** Simulates evaluating an e-commerce/social store URL across trust signals, domain age, and social credibility metrics to output a risk score.
3. **WhatsApp Real Estate AI Voice/Chat Router:** Simulates incoming lead intent classification, property matching, and automated CRM/WhatsApp response generation.

### 4.3 Filterable Project Showcase (`React Island` — `client:visible`)
* **Category Filters:** `All`, `AI & Automation`, `Full-Stack Web`, `Browser & Utility Tools`
* **Featured Projects:**
  1. **PakGovJobs (`Full-Stack Web` / `AI & Automation`):** Automated all-Pakistan government job aggregator portal separating active vacancies from expired listings across federal, provincial, armed forces, and medical departments. *(Stack: Python, FastAPI, Web Scraping, React)* — `github.com/muntazir5683/pakgovtjobs`
  2. **SellerShield (`AI & Automation` / `Full-Stack Web`):** Online seller credibility and scam risk evaluation platform for Pakistani websites, Instagram, Facebook, TikTok, and YouTube stores. *(Stack: React, Vite, Tailwind CSS, Python FastAPI)*
  3. **Auto Tab Refresher & Smart Page Monitor (`Browser & Utility Tools`):** Chrome extension that refreshes tabs every 2 minutes, detects and highlights new DOM/notification changes, and simulates natural scroll/mouse activity. *(Stack: JavaScript, Chrome Extension APIs, DOM Mutation)*
  4. **Zero-Upload Image to PDF Converter (`Browser & Utility Tools`):** Login-free, mobile- and desktop-compatible client-side tool preserving exact image selection sequence and original resolution. *(Stack: JavaScript, Client-Side PDF Generation, Responsive UI)*
  5. **Web-Based Urdu Poster & Event Design Studio (`Full-Stack Web`):** Browser-based CorelDRAW-style graphic design editor tailored for Urdu typography and formal event posters. *(Stack: React, HTML5 Canvas, Tailwind CSS)*

### 4.4 Experience, Education & Credentials (`Static Astro`)
* **Technical Expertise Grid:**
  * *Backend & Automation:* Python, FastAPI, REST APIs, Web Scraping, AI Agent Workflows, Chrome Extensions
  * *Frontend & UI:* React.js, Astro, Tailwind CSS, Vite, HTML5/CSS3
  * *QA & DevOps:* Software Quality Assurance (QA) Testing, Git/GitHub, Vercel, Render
* **Timeline:**
  * **Freelance Full-Stack & AI Developer** (`Fiverr — @muntazirhamdani`) — Building custom AI web apps, chatbots, and Python automation scripts for global clients.
  * **Admin & HR Operations** (`Capital Smart City`) — Streamlined administrative workflows and digital tracking systems.
  * **Customer Service Representative** (`Ministry of Public Health, Qatar`) — High-volume public service operations and cross-cultural client communication.
  * **Software Engineering Intern** (`App in Snap`) — Frontend/backend feature development and QA testing.
  * **BS in Software Engineering** (`COMSATS University Islamabad, Wah Campus`)

### 4.5 AI Portfolio Assistant Widget (`React Island` — `client:idle`)
* Floating bottom-right chat assistant pre-loaded with Syed Muntazir's structured profile, tech stack, and project details.
* Includes one-click recruiter/client prompt chips:
  * *"Why hire Muntazir for AI automation?"*
  * *"Tell me about SellerShield & PakGovJobs"*
  * *"What is his core tech stack?"*
  * *"How can I start a project with him?"*
* Zero external API dependency required for instant baseline responses (with optional hook for live LLM API integration).

### 4.6 Smart Project Estimator & Contact Automation (`React Island` — `client:visible`)
* Interactive scope builder allowing clients/recruiters to select engagement type (`Full-Time Role`, `AI Automation / Bot`, `Full-Stack Web App`, `Chrome Extension`), timeline, and key features.
* Dynamically calculates an estimated delivery roadmap and generates a formatted inquiry brief with one-click **Copy Brief** or **Direct Email / Fiverr / GitHub** action links.

---

## 5. Directory & File Structure
```text
/
├── public/
│   ├── favicon.svg
│   └── assets/                  # Optimized WebP project thumbnails
├── src/
│   ├── components/
│   │   ├── static/              # Zero-JS Astro components
│   │   │   ├── Navbar.astro
│   │   │   ├── Hero.astro
│   │   │   ├── SkillsExperience.astro
│   │   │   └── Footer.astro
│   │   └── islands/             # Interactive React islands
│   │       ├── AutomationSandbox.tsx
│   │       ├── ProjectShowcase.tsx
│   │       ├── AiPortfolioAssistant.tsx
│   │       └── SmartContactEstimator.tsx
│   ├── data/
│   │   └── portfolioData.ts     # Single source of truth for projects, skills, & AI bot knowledge
│   ├── layouts/
│   │   └── BaseLayout.astro     # SEO meta tags, Google Fonts, global theme wrapper
│   ├── pages/
│   │   └── index.astro          # Main landing page assembling static & island components
│   └── styles/
│       └── global.css           # Tailwind directives & custom utility classes
├── SRDS.md
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```
