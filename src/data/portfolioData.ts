/**
 * portfolioData.ts — single source of truth (SRDS §5).
 *
 * Consumed by:
 *  - Static Astro components (Navbar, Hero, SkillsExperience, Footer)
 *  - React islands (AutomationSandbox, ProjectShowcase, AiPortfolioAssistant, SmartContactEstimator)
 *
 * Keep this file free of runtime dependencies so it stays tree-shakeable and cheap to ship.
 */

/* ================================================================== */
/* Contact constants — edit these first                                */
/* Leave empty strings to hide LinkedIn / skip mailto until set.       */
/* ================================================================== */

/** e.g. 'muntazir@example.com' */
export const CONTACT_EMAIL = 'syedmuntazir.pwh@gmail.com';

/** e.g. 'https://www.linkedin.com/in/your-handle' */
export const CONTACT_LINKEDIN = 'https://www.linkedin.com/in/syed-muntazir-767489241';

/** e.g. '/resume.pdf' (place the file in /public) or keep '#contact' */
export const RESUME_URL = '#contact';

const hasValue = (value: string) => value.trim().length > 0;

/* ================================================================== */
/* Types                                                              */
/* ================================================================== */

export interface SocialLink {
  id: 'github' | 'fiverr' | 'email' | 'linkedin';
  label: string;
  url: string;
  handle?: string;
}

export interface Profile {
  name: string;
  brand: string; // Navbar monogram
  headline: string;
  title: string;
  location: string;
  availability: string;
  summary: string;
  roles: string[]; // Hero role ticker
  email: string;
  resumeUrl: string;
  socials: SocialLink[];
}

export interface NavLink {
  label: string;
  href: string;
}

export type SkillGroupId = 'backend' | 'frontend' | 'qa-devops';

export interface SkillGroup {
  id: SkillGroupId;
  title: string;
  skills: string[];
}

export type ExperienceKind = 'work' | 'education';

export interface ExperienceItem {
  id: string;
  kind: ExperienceKind;
  role: string;
  organization: string;
  /** Free-form period label; fill in exact dates when available. */
  period?: string;
  location?: string;
  description: string;
}

export type ProjectCategory =
  | 'AI & Automation'
  | 'Full-Stack Web'
  | 'Browser & Utility Tools';

export type ProjectFilter = 'All' | ProjectCategory;

export interface ProjectCaseStudy {
  problem: string;
  solution: string;
  highlights: string[];
}

export type ProjectMotif =
  | 'job-board'
  | 'risk-meter'
  | 'chrome-tabs'
  | 'pdf-sorter'
  | 'urdu-canvas';

export interface Project {
  id: string;
  title: string;
  /** A project can belong to multiple categories; the first is the primary one. */
  categories: ProjectCategory[];
  /** Full description (SRDS copy). */
  description: string;
  /** One-line problem-solving summary shown on the project card. */
  summary: string;
  /** Short business problem line for card UI. */
  problem: string;
  /** Measurable / concrete outcome badge on the card. */
  outcome: string;
  /** CSS/SVG architectural preview motif for the card header. */
  motif: ProjectMotif;
  stack: string[];
  featured: boolean;
  /** Only rendered when a non-empty string — never use '#' placeholders. */
  githubUrl?: string;
  liveUrl?: string;
  caseStudy: ProjectCaseStudy;
  /** Optional WebP thumbnail in /public/assets */
  thumbnail?: string;
}

/* ---- Automation sandbox -------------------------------------------- */

export type LogLevel = 'info' | 'success' | 'warn' | 'error';

export interface WorkflowLog {
  level: LogLevel;
  message: string;
}

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  /** Simulated latency for the step, in milliseconds. */
  latencyMs: number;
  logs: WorkflowLog[];
}

export interface WorkflowPreset {
  id: string;
  title: string;
  tagline: string;
  description: string;
  /** Business ROI / time-saved badge for the selector card. */
  roi: string;
  /** Name of the lucide-react icon the UI should render. */
  icon: 'FileSearch' | 'ShieldCheck' | 'MessageSquare' | 'Pill';
  input: { label: string; value: string };
  /** Tech stack tags shown for the selected automation. */
  stack: string[];
  /** Headline accuracy/confidence metric (percentage) revealed as the pipeline runs. */
  metric: { label: string; value: number };
  steps: WorkflowStep[];
  /** Final structured JSON shown after the pipeline completes. */
  output: Record<string, unknown>;
}

/* ---- AI portfolio assistant ---------------------------------------- */

export type PortfolioSection = '#projects' | '#automations' | '#contact' | '#experience';

export interface AssistantIntent {
  id: string;
  /** Text of the one-click prompt chip (omit for intents without a chip). */
  chip?: string;
  /** Lower-case keywords used for lightweight intent matching. */
  keywords: string[];
  /**
   * Answer text. Wrap section jumps as [[#projects|Explore Projects]] so the
   * chat UI can render them as clickable in-page links.
   */
  answer: string;
  /** Optional follow-up chips surfaced after this answer. */
  followUps?: string[];
  /** Quick jump links shown under the answer. */
  sections?: PortfolioSection[];
}

export interface AssistantKnowledge {
  name: string;
  greeting: string;
  fallback: string;
  intents: AssistantIntent[];
}

/* ---- Contact estimator --------------------------------------------- */

export interface EngagementType {
  id: 'full-time' | 'ai-automation' | 'full-stack' | 'chrome-extension';
  label: string;
  description: string;
}

export interface TimelineOption {
  id: 'urgent' | 'standard' | 'flexible';
  label: string;
  description: string;
  /** Approximate week range used by the estimator roadmap. */
  weeks: [number, number];
}

export interface DeliverableOption {
  id: string;
  label: string;
}

/* ================================================================== */
/* Profile & navigation                                               */
/* ================================================================== */

export const profile: Profile = {
  name: 'Syed Muntazir',
  brand: 'SM.',
  headline: 'Software Engineer — Python, FastAPI & React',
  title: 'Software Engineer',
  location: 'Pakistan',
  availability: 'Open to full-time roles and freelance work',
  summary:
    'I build web apps, data scrapers, browser extensions, and small workflow automations for businesses. Most of my work sits between Python/FastAPI backends and React frontends, with a lot of scraping and glue code in between.',
  roles: [
    'Python & FastAPI backends',
    'React web apps',
    'Scrapers & data pipelines',
    'Chrome extensions',
  ],
  email: CONTACT_EMAIL.trim(),
  resumeUrl: RESUME_URL.trim() || '#contact',
  socials: (
    [
      {
        id: 'github' as const,
        label: 'GitHub',
        url: 'https://github.com/muntazir5683',
        handle: 'muntazir5683',
      },
      hasValue(CONTACT_LINKEDIN)
        ? {
            id: 'linkedin' as const,
            label: 'LinkedIn',
            url: CONTACT_LINKEDIN.trim(),
          }
        : null,
      {
        id: 'fiverr' as const,
        label: 'Fiverr',
        url: 'https://www.fiverr.com/s/gvyGR7E',
        handle: '@muntazirhamdani',
      },
      hasValue(CONTACT_EMAIL)
        ? {
            id: 'email' as const,
            label: 'Email',
            url: `mailto:${CONTACT_EMAIL.trim()}`,
            handle: CONTACT_EMAIL.trim(),
          }
        : null,
    ] as Array<SocialLink | null>
  ).filter((link): link is SocialLink => link !== null),
};

export const navLinks: NavLink[] = [
  { label: 'Projects', href: '#projects' },
  { label: 'Pipelines', href: '#automations' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

/* ================================================================== */
/* Skills                                                             */
/* ================================================================== */

export const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    title: 'Backend & Automation',
    skills: [
      'Python',
      'FastAPI',
      'REST APIs',
      'Web Scraping',
      'Workflow automation',
      'Chrome Extensions',
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    skills: ['React', 'Astro', 'Tailwind CSS', 'Vite', 'HTML/CSS'],
  },
  {
    id: 'qa-devops',
    title: 'QA & Deploy',
    skills: ['Manual & regression QA', 'Git / GitHub', 'Vercel', 'Render'],
  },
];

/* ================================================================== */
/* Experience & education                                             */
/* ================================================================== */

export const experience: ExperienceItem[] = [
  {
    id: 'fiverr-freelance',
    kind: 'work',
    role: 'Freelance Software Developer',
    organization: 'Fiverr — @muntazirhamdani',
    period: 'Present',
    description:
      'Contract work for clients: web apps, scrapers, chatbots, and Python scripts. Most gigs are small-to-medium builds with a clear deliverable and a fixed timeline.',
  },
  {
    id: 'capital-smart-city',
    kind: 'work',
    role: 'Admin & HR Operations',
    organization: 'Capital Smart City',
    period: 'Through Oct 2026',
    description:
      'Day-to-day ops and HR paperwork, plus a few internal tracking sheets and process fixes that reduced manual follow-up.',
  },
  {
    id: 'moph-qatar',
    kind: 'work',
    role: 'Customer Service Representative',
    organization: 'Ministry of Public Health, Qatar',
    location: 'Qatar',
    description:
      'Handled a high volume of public inquiries. Useful practice for clear communication under pressure.',
  },
  {
    id: 'app-in-snap',
    kind: 'work',
    role: 'Software Engineering Intern',
    organization: 'App in Snap',
    description:
      'Shipped small frontend and backend features, wrote test cases, and filed/regression-tested bugs before releases.',
  },
];

export const education: ExperienceItem[] = [
  {
    id: 'comsats-bse',
    kind: 'education',
    role: 'BS in Software Engineering',
    organization: 'COMSATS University Islamabad, Wah Campus',
    location: 'Wah Cantt, Pakistan',
    description: 'Coursework in software design, databases, and web development.',
  },
];

/* ================================================================== */
/* Projects                                                           */
/* ================================================================== */

export const projectFilters: ProjectFilter[] = [
  'All',
  'AI & Automation',
  'Full-Stack Web',
  'Browser & Utility Tools',
];

export const projects: Project[] = [
  {
    id: 'pakgovjobs',
    title: 'PakGovJobs',
    categories: ['Full-Stack Web', 'AI & Automation'],
    description:
      'Aggregator for Pakistani government jobs. Scrapes several portals, normalizes dates, and splits active listings from expired ones.',
    summary:
      'One feed of government jobs with expired listings filtered out, instead of hopping between half a dozen portals.',
    problem: 'Job seekers jump across portals with inconsistent dates and expired posts still listed.',
    outcome: 'Single cleaned feed · active vs expired',
    motif: 'job-board',
    stack: ['Python', 'FastAPI', 'Web Scraping', 'React'],
    featured: true,
    githubUrl: 'https://github.com/muntazir5683/pakgovtjobs',
    caseStudy: {
      problem:
        'Job ads live on separate federal, provincial, armed forces, and medical sites. Formats differ, closing dates are inconsistent, and expired posts often stay visible.',
      solution:
        'A Python scraper pulls each site on a schedule. Dates get normalized to ISO; anything past today is marked expired. FastAPI serves the cleaned list; React shows active jobs grouped by sector. The awkward part was date parsing — some portals use DD/MM/YYYY, others write “last date” as free text — so failures are logged instead of silently dropped.',
      highlights: [
        'Multi-portal scrape with retries on flaky endpoints',
        'Active vs expired based on parsed closing dates',
        'Dedupes listings that appear on more than one site',
        'REST API + React UI for browsing by sector',
      ],
    },
  },
  {
    id: 'sellershield',
    title: 'SellerShield',
    categories: ['AI & Automation', 'Full-Stack Web'],
    description:
      'Checks a store URL (web or social) against basic trust signals and returns a risk score with the reasons behind it.',
    summary:
      'Paste a store link, get a risk score and the signals that drove it — useful before you pay an unknown seller.',
    problem: 'Buyers guess whether Instagram / small-web sellers are legit before paying.',
    outcome: 'Risk score + explainable signals',
    motif: 'risk-meter',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Python FastAPI'],
    featured: true,
    caseStudy: {
      problem:
        'A lot of buying in Pakistan happens through Instagram or small websites. Buyers mostly guess whether a seller is legit.',
      solution:
        'Frontend submits a URL to FastAPI. The backend looks up domain age, contact details, and rough social signals, then weights them into a score. I kept the scoring rules explicit so the UI can show why a store looks risky instead of hiding it behind a black box.',
      highlights: [
        'Works with websites and common social store links',
        'Score plus the contributing signals, not just a label',
        'Rules tuned for how local sellers actually present themselves',
        'Mobile-friendly so you can check a link on the go',
      ],
    },
  },
  {
    id: 'auto-tab-refresher',
    title: 'Auto Tab Refresher',
    categories: ['Browser & Utility Tools'],
    description:
      'Chrome extension that reloads selected tabs on a timer, highlights DOM changes, and nudges idle pages so sessions do not drop.',
    summary:
      'Keeps a tab fresh every two minutes and highlights what changed so you do not miss an update.',
    problem: 'Manual refresh on listings/dashboards misses updates and idle tabs time out.',
    outcome: 'Timed reload + DOM change highlights',
    motif: 'chrome-tabs',
    stack: ['JavaScript', 'Chrome Extension APIs', 'DOM Mutation'],
    featured: true,
    caseStudy: {
      problem:
        'Waiting on listing pages or dashboards means constant manual refresh. Easy to miss a change, and some sites time out if the tab goes idle.',
      solution:
        'Background script reloads chosen tabs on an interval. A content script uses MutationObserver to mark new nodes. Optional light scroll/mouse activity keeps some sites from signing you out. Kept the permissions minimal — tabs + scripting only for pages the user opts into.',
      highlights: [
        'Configurable refresh interval (default 2 minutes)',
        'Highlights new DOM content after each reload',
        'Optional keep-alive activity for sticky sessions',
        'No server; everything runs in the browser',
      ],
    },
  },
  {
    id: 'image-to-pdf',
    title: 'Image → PDF (client-side)',
    categories: ['Browser & Utility Tools'],
    description:
      'Browser tool that builds a PDF from selected images without uploading anything. Order and resolution stay as the user chose them.',
    summary:
      'Convert images to PDF in the browser — no account, no upload, pages stay in the order you picked.',
    problem: 'Online converters upload private docs and often reorder or crush quality.',
    outcome: 'Local PDF · selection order preserved',
    motif: 'pdf-sorter',
    stack: ['JavaScript', 'Client-Side PDF Generation', 'Responsive UI'],
    featured: true,
    caseStudy: {
      problem:
        'Online converters ask for uploads or logins. That is a bad fit for IDs and receipts, and some tools reorder or crush image quality.',
      solution:
        'FileReader + a client-side PDF library. Images never leave the device. Page order follows the selection list; each image keeps its resolution. Layout works on phone and desktop without a separate app.',
      highlights: [
        'No upload path — files stay local',
        'No login required',
        'Selection order becomes page order',
        'Same flow on mobile and desktop',
      ],
    },
  },
  {
    id: 'urdu-poster-studio',
    title: 'Urdu Poster Studio',
    categories: ['Full-Stack Web'],
    description:
      'In-browser canvas editor for Urdu event posters — text, layout, and export without installing desktop design software.',
    summary:
      'A small canvas editor aimed at Urdu typography and formal event posters, runnable in the browser.',
    problem: 'Formal Urdu posters need heavy desktop software; web editors break RTL.',
    outcome: 'Browser canvas · Urdu / RTL first-class',
    motif: 'urdu-canvas',
    stack: ['React', 'HTML5 Canvas', 'Tailwind CSS'],
    featured: true,
    caseStudy: {
      problem:
        'Formal Urdu posters usually need CorelDRAW or similar. Lightweight web editors tend to mishandle right-to-left text and font shaping.',
      solution:
        'React drives an HTML5 canvas layer with tools for text blocks, shapes, and export. Focused on the poster workflows organizers actually use rather than becoming a full design suite. Fonts and RTL layout were the main engineering work.',
      highlights: [
        'Canvas editing without a desktop install',
        'Urdu / RTL text treated as a first-class case',
        'Poster-oriented layout tools, not a general DTP clone',
        'Exports from the browser',
      ],
    },
  },
];

/* ================================================================== */
/* Automation sandbox presets                                         */
/* ================================================================== */

export const workflowPresets: WorkflowPreset[] = [
  {
    id: 'pakgovjobs-scraper',
    title: 'PakGovJobs Automated Scraper & Expiry Filter',
    tagline: 'HTML fetch → date normalize → expiry filter → DB upsert',
    description:
      'Pulls job pages from target portals, normalizes dates and department tags, drops expired rows, and upserts what is still open.',
    roi: 'Saves ~12 hrs/week of manual sorting',
    icon: 'FileSearch',
    input: {
      label: 'Target portals',
      value: 'fpsc.gov.pk/jobs, punjab-jobs.gov.pk/latest, paf.gov.pk/careers',
    },
    stack: ['Python', 'FastAPI', 'BeautifulSoup', 'Cron'],
    metric: { label: 'Parse success', value: 97.1 },
    steps: [
      {
        id: 'fetch',
        label: 'Fetch target portal HTML',
        description: 'HTTP GET each portal listing page',
        latencyMs: 680,
        logs: [
          { level: 'info', message: 'cron tick 06:15 PKT — 3 portals queued' },
          { level: 'info', message: 'GET fpsc.gov.pk/jobs → 200 (218 ms) 142 KB' },
          { level: 'info', message: 'GET punjab-jobs.gov.pk/latest → 200 (294 ms) 98 KB' },
          { level: 'warn', message: 'GET paf.gov.pk/careers → timeout; retry 1/2' },
          { level: 'success', message: 'GET paf.gov.pk/careers → 200 (156 ms) 61 KB' },
        ],
      },
      {
        id: 'normalize',
        label: 'Normalize dates & department tags',
        description: 'Parse closing dates; map department labels to a shared enum',
        latencyMs: 420,
        logs: [
          { level: 'info', message: 'Extracted 156 raw rows from HTML tables/lists' },
          { level: 'info', message: 'Date formats seen: DD/MM/YYYY, DD-MMM-YYYY, free-text last-date lines' },
          { level: 'warn', message: '6 rows missing a closing date — kept as unknown' },
          { level: 'success', message: 'Department tags mapped (federal / provincial / armed_forces / medical)' },
        ],
      },
      {
        id: 'filter',
        label: 'Filter out expired deadlines',
        description: 'Compare closing_date to today (Asia/Karachi)',
        latencyMs: 180,
        logs: [
          { level: 'info', message: 'today = 2026-11-24 (UTC+5)' },
          { level: 'success', message: 'Active: 101 · Expired: 49 · Unknown: 6' },
          { level: 'info', message: 'Removed 9 duplicates posted on more than one portal' },
        ],
      },
      {
        id: 'upsert',
        label: 'Upsert active jobs to database',
        description: 'Insert/update by (source, external_id)',
        latencyMs: 240,
        logs: [
          { level: 'info', message: 'BEGIN upsert batch (101 active + 6 unknown)' },
          { level: 'success', message: 'inserted=14 updated=87 skipped_expired=49 (312 ms)' },
          { level: 'success', message: 'pipeline ok — next cron in 6h' },
        ],
      },
    ],
    output: {
      status: 'ok',
      ran_at: '2026-11-24T01:15:42Z',
      sources: 3,
      totals: { active: 101, expired: 49, unknown: 6, upserted: 107 },
      sample_active: [
        {
          title: 'Assistant Director (BS-17)',
          department: 'Federal Public Service Commission',
          sector: 'federal',
          closing_date: '2026-12-05',
          status: 'active',
        },
        {
          title: 'Junior Commissioned Officer',
          department: 'Pakistan Air Force',
          sector: 'armed_forces',
          closing_date: '2026-12-18',
          status: 'active',
        },
      ],
      sample_expired: [
        {
          title: 'Medical Officer',
          department: 'Health Department Punjab',
          sector: 'medical',
          closing_date: '2026-11-10',
          status: 'expired',
        },
      ],
    },
  },
  {
    id: 'sellershield-analyzer',
    title: 'SellerShield Online Seller Risk Analyzer',
    tagline: 'Domain/handle → red flags → reviews → trust score',
    description:
      'Inspects a store URL or social handle, checks contact/payment red flags and review consistency, then returns a weighted trust score.',
    roi: 'Cuts risky purchases before payment',
    icon: 'ShieldCheck',
    input: {
      label: 'Store URL / handle',
      value: 'https://instagram.com/example_fashion_store',
    },
    stack: ['Python', 'FastAPI', 'React', 'Heuristic + LLM Scoring'],
    metric: { label: 'Confidence', value: 88 },
    steps: [
      {
        id: 'inspect',
        label: 'Inspect domain / handle metadata',
        description: 'Resolve platform, age, and public profile fields',
        latencyMs: 390,
        logs: [
          { level: 'info', message: 'platform=instagram handle=@example_fashion_store' },
          { level: 'info', message: 'public profile: followers=3240 posts=86 linked_site=example-fashion.pk' },
          { level: 'success', message: 'WHOIS example-fashion.pk created 2026-10-31 (24 days)' },
        ],
      },
      {
        id: 'redflags',
        label: 'Check contact & payment red flags',
        description: 'Look for address, registration, and payment patterns',
        latencyMs: 510,
        logs: [
          { level: 'warn', message: 'no physical address or NTN / business registration found' },
          { level: 'warn', message: 'bio pushes advance bank transfer only (no COD mentioned)' },
          { level: 'info', message: 'contact: WhatsApp number present; email missing' },
        ],
      },
      {
        id: 'reviews',
        label: 'Cross-check review / follower consistency',
        description: 'Compare engagement ratios and external mentions',
        latencyMs: 640,
        logs: [
          { level: 'info', message: 'engagement rate ≈ 0.4% (low for follower count)' },
          { level: 'warn', message: 'comment set: 58% near-duplicate generic praise' },
          { level: 'success', message: '2 external complaint threads matched on public forums' },
        ],
      },
      {
        id: 'score',
        label: 'Compute weighted trust score',
        description: 'Heuristics + LLM note on edge cases → final score',
        latencyMs: 360,
        logs: [
          { level: 'info', message: 'weights: domain_age=0.25 contact=0.25 engagement=0.2 reviews=0.3' },
          { level: 'info', message: 'LLM note: new domain + advance-payment push; treat as high risk' },
          { level: 'success', message: 'trust_score=28/100 → risk_level=high (confidence=0.88)' },
        ],
      },
    ],
    output: {
      store: 'instagram.com/example_fashion_store',
      trust_score: 28,
      risk_level: 'high',
      confidence: 0.88,
      flagged_signals: [
        'domain_age_under_90_days',
        'no_business_registration',
        'advance_payment_only',
        'low_engagement_authenticity',
        'external_complaints',
      ],
      recommendation:
        'Prefer cash on delivery. Do not send full payment up front until the seller is verified.',
    },
  },
  {
    id: 'whatsapp-real-estate',
    title: 'WhatsApp Real Estate Lead & Voice Router',
    tagline: 'Voice/text in → STT + intent → assign agent',
    description:
      'Takes an inbound WhatsApp voice or text lead, transcribes if needed, pulls budget/sector/intent, and routes it to a sales agent.',
    roi: 'Routes leads in seconds, not hours',
    icon: 'MessageSquare',
    input: {
      label: 'Inbound WhatsApp',
      value:
        'voice note (0:18) — “Salam, Capital Smart City mein 5 marla ghar chahiye, budget 1.5 crore ke qareeb”',
    },
    stack: ['Python', 'FastAPI', 'Whisper STT', 'WhatsApp Webhook'],
    metric: { label: 'Intent confidence', value: 94 },
    steps: [
      {
        id: 'receive',
        label: 'Receive incoming voice / text message',
        description: 'WhatsApp Cloud API webhook',
        latencyMs: 160,
        logs: [
          { level: 'info', message: 'POST /webhooks/whatsapp 200 — message_id=wamid.HBgNMjM…' },
          { level: 'info', message: 'from=+923001234567 type=audio duration=18s' },
          { level: 'success', message: 'media downloaded (ogg/opus, 86 KB)' },
        ],
      },
      {
        id: 'transcribe',
        label: 'Transcribe & detect language',
        description: 'Whisper STT; tag Urdu / English / mixed',
        latencyMs: 920,
        logs: [
          { level: 'info', message: 'whisper-small local — lang_detect=ur (mixed Roman Urdu)' },
          {
            level: 'success',
            message:
              'transcript: “Salam, Capital Smart City mein 5 marla ghar chahiye, budget 1.5 crore ke qareeb” (1.1 s)',
          },
        ],
      },
      {
        id: 'extract',
        label: 'Extract budget, sector & plot/house intent',
        description: 'Entity parse over transcript + optional text follow-ups',
        latencyMs: 340,
        logs: [
          { level: 'info', message: 'intent=buy_house confidence=0.94' },
          {
            level: 'success',
            message: 'entities: location=Capital Smart City size=5_marla budget_pkr=15000000',
          },
        ],
      },
      {
        id: 'assign',
        label: 'Assign lead to sales agent',
        description: 'Round-robin / territory match + CRM create',
        latencyMs: 280,
        logs: [
          { level: 'info', message: 'territory match: Capital Smart City → desk CSC-A' },
          { level: 'success', message: 'assigned_agent=aisha.khan@agency.pk lead_id=LD-4821' },
          { level: 'success', message: 'WhatsApp ack sent; CRM row created' },
        ],
      },
    ],
    output: {
      lead_id: 'LD-4821',
      channel: 'whatsapp_voice',
      language: 'ur_roman_mixed',
      transcript:
        'Salam, Capital Smart City mein 5 marla ghar chahiye, budget 1.5 crore ke qareeb',
      location: 'Capital Smart City',
      budget_pkr: 15000000,
      intent: 'buy_house',
      size: '5_marla',
      assigned_agent: 'aisha.khan@agency.pk',
      confidence: 0.94,
    },
  },
  {
    id: 'pharmacy-expiry',
    title: 'Pharmacy Batch & Expiry Alert Pipeline',
    tagline: 'Inventory sheet → days-to-expiry → alerts + reorder',
    description:
      'Reads the daily inventory export, flags batches under 30 / 90 days to expiry, and emails a vendor reorder summary.',
    roi: 'Flags expiry risk before stock is wasted',
    icon: 'Pill',
    input: {
      label: 'Inventory file',
      value: 'inventory_2026-11-24.csv (1,842 SKU rows)',
    },
    stack: ['Python', 'Pandas', 'Excel / CSV', 'SMTP Alerts'],
    metric: { label: 'Valid expiry rows', value: 99.8 },
    steps: [
      {
        id: 'parse',
        label: 'Parse daily inventory sheet',
        description: 'Load CSV/XLSX; validate required columns',
        latencyMs: 310,
        logs: [
          { level: 'info', message: 'open inventory_2026-11-24.csv encoding=utf-8' },
          { level: 'info', message: 'columns ok: sku, batch_id, qty, expiry_date, vendor' },
          { level: 'warn', message: '3 rows with blank expiry_date — excluded from alert math' },
          { level: 'success', message: 'parsed 1842 rows in 188 ms' },
        ],
      },
      {
        id: 'expiry',
        label: 'Calculate days-to-expiry per batch',
        description: 'expiry_date − today for each batch line',
        latencyMs: 140,
        logs: [
          { level: 'info', message: 'as_of=2026-11-24' },
          { level: 'success', message: 'days_to_expiry computed for 1839 batches' },
        ],
      },
      {
        id: 'group',
        label: 'Group critical (<30d) & warning (<90d) SKUs',
        description: 'Bucket by urgency for ops and purchasing',
        latencyMs: 90,
        logs: [
          { level: 'warn', message: 'critical (<30d): 27 batches / 412 units' },
          { level: 'info', message: 'warning (30–89d): 64 batches / 1,105 units' },
          { level: 'success', message: 'ok (≥90d): 1,748 batches' },
        ],
      },
      {
        id: 'reorder',
        label: 'Generate vendor reorder summary',
        description: 'Aggregate by vendor; send SMTP digest',
        latencyMs: 420,
        logs: [
          { level: 'info', message: 'reorder draft: 11 vendors, 41 SKUs' },
          { level: 'success', message: 'SMTP sent → pharmacy-ops@clinic.local (246 ms)' },
          { level: 'success', message: 'wrote reorder_2026-11-24.json' },
        ],
      },
    ],
    output: {
      as_of: '2026-11-24',
      rows_parsed: 1842,
      critical_count: 27,
      warning_count: 64,
      flagged_batches: [
        {
          sku: 'AMOX-500',
          batch_id: 'B-1182',
          days_to_expiry: 12,
          qty: 48,
          severity: 'critical',
          vendor: 'MediSupply Co.',
          action: 'return_or_discount',
        },
        {
          sku: 'PARA-250-SYR',
          batch_id: 'B-0944',
          days_to_expiry: 45,
          qty: 120,
          severity: 'warning',
          vendor: 'HealthLine Dist.',
          action: 'prioritize_sale',
        },
      ],
      reorder_actions: [
        { vendor: 'MediSupply Co.', skus: 6, suggested_units: 320 },
        { vendor: 'HealthLine Dist.', skus: 4, suggested_units: 200 },
      ],
      alert_email: 'pharmacy-ops@clinic.local',
    },
  },
];

/* ================================================================== */
/* Ask-about-my-work chat knowledge                                   */
/* ================================================================== */

export const assistantKnowledge: AssistantKnowledge = {
  name: 'Ask About My Work',
  greeting:
    'Ask about projects, stack, or how to get in touch. Short answers — use the links if you want the full page.',
  fallback:
    "I don't have a canned answer for that. Use [[#contact|Contact]], email syedmuntazir.pwh@gmail.com, Fiverr (@muntazirhamdani), or GitHub (muntazir5683).",
  intents: [
    {
      id: 'why-hire',
      chip: 'What kind of work does he do?',
      keywords: ['why hire', 'hire', 'automation', 'ai automation', 'workflow', 'benefit', 'strength', 'kind of work', 'what does'],
      answer:
        'Mostly Python/FastAPI backends, React UIs, scrapers, and small automations that glue systems together. PakGovJobs and SellerShield are the clearest examples.\n\n[[#automations|Pipeline demos]] · [[#projects|Projects]]',
      followUps: ['SellerShield & PakGovJobs?', 'How do I reach him?'],
      sections: ['#automations', '#projects'],
    },
    {
      id: 'projects',
      chip: 'SellerShield & PakGovJobs?',
      keywords: ['sellershield', 'pakgovjobs', 'pakgov', 'project', 'projects', 'portfolio', 'work', 'built'],
      answer:
        'PakGovJobs scrapes several government job sites, normalizes closing dates, and filters expired ads (Python, FastAPI, React). SellerShield takes a store URL and returns a risk score with the signals behind it (React, FastAPI).\n\n[[#projects|Case studies]] · [[#automations|Run the demos]]',
      followUps: ['What is his stack?', 'How do I reach him?'],
      sections: ['#projects', '#automations'],
    },
    {
      id: 'tech-stack',
      chip: 'What is his stack?',
      keywords: ['tech', 'stack', 'skills', 'technology', 'technologies', 'python', 'react', 'fastapi', 'tools', 'language'],
      answer:
        'Day to day: Python, FastAPI, React, Astro, Tailwind, scraping, Chrome extensions. Deployments on Vercel and Render. QA experience from internship and freelance handoffs.\n\n[[#experience|Skills & experience]]',
      followUps: ['SellerShield & PakGovJobs?', 'How do I reach him?'],
      sections: ['#experience'],
    },
    {
      id: 'start-project',
      chip: 'How do I reach him?',
      keywords: ['start', 'contact', 'project with', 'work together', 'quote', 'price', 'pricing', 'cost', 'estimate', 'budget', 'fiverr', 'email', 'reach'],
      answer:
        'Fill the [[#contact|inquiry form]] and copy or email the brief, or message on Fiverr (@muntazirhamdani) / GitHub (muntazir5683). Open to full-time roles too.',
      followUps: ['What is his stack?'],
      sections: ['#contact'],
    },
    {
      id: 'experience',
      keywords: ['experience', 'background', 'career', 'intern', 'job history', 'worked'],
      answer:
        'Freelance on Fiverr now. Before that: Admin/HR at Capital Smart City, customer service at MoPH Qatar, and a software intern role at App in Snap.\n\n[[#experience|Timeline]]',
      sections: ['#experience'],
    },
    {
      id: 'education',
      keywords: ['education', 'degree', 'university', 'study', 'studied', 'comsats', 'bs '],
      answer:
        'BS Software Engineering, COMSATS University Islamabad (Wah Campus). [[#experience|Details]]',
      sections: ['#experience'],
    },
    {
      id: 'availability',
      keywords: ['available', 'availability', 'full-time', 'full time', 'freelance', 'open to', 'job'],
      answer:
        'Yes — full-time or freelance. Use [[#contact|Contact]] to send a short brief.',
      sections: ['#contact'],
    },
    {
      id: 'extensions-tools',
      keywords: ['chrome', 'extension', 'scraper', 'scraping', 'pdf', 'urdu', 'poster', 'tool', 'tools', 'utility'],
      answer:
        'Also shipped a tab refresher Chrome extension, a client-side image→PDF tool, and a canvas-based Urdu poster editor. [[#projects|Projects]]',
      sections: ['#projects'],
    },
  ],
};

/* ================================================================== */
/* Contact estimator options (SRDS §4.6)                              */
/* ================================================================== */

export const engagementTypes: EngagementType[] = [
  {
    id: 'full-time',
    label: 'Full-time / contract role',
    description: 'Join a team as a software engineer.',
  },
  {
    id: 'ai-automation',
    label: 'Automation / bot',
    description: 'Scrapers, chatbots, scheduled jobs, glue code.',
  },
  {
    id: 'full-stack',
    label: 'Web app',
    description: 'React UI with a Python/FastAPI backend.',
  },
  {
    id: 'chrome-extension',
    label: 'Chrome extension / scraper',
    description: 'Browser extensions and page monitors.',
  },
];

export const timelineOptions: TimelineOption[] = [
  {
    id: 'urgent',
    label: '1–2 weeks',
    description: 'Tight deadline, small scope.',
    weeks: [1, 2],
  },
  {
    id: 'standard',
    label: '3–5 weeks',
    description: 'Normal build with a bit of polish.',
    weeks: [3, 5],
  },
  {
    id: 'flexible',
    label: 'Flexible / longer',
    description: 'Phased work or an ongoing retainer.',
    weeks: [6, 12],
  },
];

export const deliverableOptions: DeliverableOption[] = [
  { id: 'python-backend', label: 'Python / FastAPI Backend' },
  { id: 'react-frontend', label: 'React / Astro Frontend' },
  { id: 'ai-chatbot', label: 'AI Chatbot / RAG' },
  { id: 'scraping', label: 'Web Scraping / Data Pipeline' },
  { id: 'qa-deploy', label: 'QA & Deployment' },
  { id: 'chrome-ext', label: 'Chrome Extension' },
  { id: 'api-integration', label: 'Third-Party API Integration' },
];
