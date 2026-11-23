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

export interface Project {
  id: string;
  title: string;
  /** A project can belong to multiple categories; the first is the primary one. */
  categories: ProjectCategory[];
  /** Full description (SRDS copy). */
  description: string;
  /** One-line problem-solving summary shown on the project card. */
  summary: string;
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
  /** Name of the lucide-react icon the UI should render. */
  icon: 'FileSearch' | 'ShieldCheck' | 'MessageSquare';
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
  headline: 'Full-Stack Software Engineer & AI Automation Architect',
  title: 'Full-Stack Software Engineer',
  location: 'Pakistan',
  availability: 'Available for Full-Time Roles & AI Projects',
  summary:
    'I design and ship fast React web apps, Python & FastAPI backends, AI workflow automations, scrapers and Chrome extensions — from first idea to a tested, deployed product. Open to full-time roles and freelance AI projects.',
  roles: [
    'AI Workflow Automations',
    'Python & FastAPI Backends',
    'React & Full-Stack Web Apps',
    'Browser Extensions & Scrapers',
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
  { label: 'Automations', href: '#automations' },
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
      'AI Workflow Automation',
      'Chrome Extensions',
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend & UI',
    skills: ['React.js', 'Astro', 'Tailwind CSS', 'Vite', 'HTML5/CSS3'],
  },
  {
    id: 'qa-devops',
    title: 'QA & DevOps',
    skills: [
      'Software Quality Assurance (QA) Testing',
      'Git/GitHub',
      'Vercel',
      'Render',
    ],
  },
];

/* ================================================================== */
/* Experience & education                                             */
/* ================================================================== */

export const experience: ExperienceItem[] = [
  {
    id: 'fiverr-freelance',
    kind: 'work',
    role: 'Freelance Full-Stack & AI Developer',
    organization: 'Fiverr — @muntazirhamdani',
    period: 'Present',
    description:
      'Building custom AI web apps, chatbots, and Python automation scripts for global clients.',
  },
  {
    id: 'capital-smart-city',
    kind: 'work',
    role: 'Admin & HR Operations',
    organization: 'Capital Smart City',
    period: 'Through Oct 2026',
    description:
      'Streamlined administrative workflows and digital tracking systems.',
  },
  {
    id: 'moph-qatar',
    kind: 'work',
    role: 'Customer Service Representative',
    organization: 'Ministry of Public Health, Qatar',
    location: 'Qatar',
    description:
      'High-volume public service operations and cross-cultural client communication.',
  },
  {
    id: 'app-in-snap',
    kind: 'work',
    role: 'Software Engineering Intern',
    organization: 'App in Snap',
    description: 'Frontend/backend feature development and QA testing.',
  },
];

export const education: ExperienceItem[] = [
  {
    id: 'comsats-bse',
    kind: 'education',
    role: 'BS in Software Engineering',
    organization: 'COMSATS University Islamabad, Wah Campus',
    location: 'Wah Cantt, Pakistan',
    description: 'Bachelor of Science in Software Engineering.',
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
      'Automated all-Pakistan government job aggregator portal separating active vacancies from expired listings across federal, provincial, armed forces, and medical departments.',
    summary:
      'Stops job seekers from wading through dozens of portals and expired ads by showing only what is still open.',
    stack: ['Python', 'FastAPI', 'Web Scraping', 'React'],
    featured: true,
    githubUrl: 'https://github.com/muntazir5683/pakgovtjobs',
    caseStudy: {
      problem:
        'Government vacancies in Pakistan are spread across many federal, provincial, armed forces and medical portals, each with its own format. Expired ads stay online, so applicants waste time on jobs they can no longer apply for.',
      solution:
        'A Python/FastAPI scraping pipeline fetches listings from multiple portals, normalizes titles, departments and closing dates, then classifies every job as active or expired. The cleaned data is served through a REST API to a React frontend that separates active vacancies from expired listings by sector.',
      highlights: [
        'One place to browse federal, provincial, armed forces and medical jobs',
        'Automatic active vs. expired classification from parsed closing dates',
        'Normalized, structured data exposed through a REST API',
        'Automated aggregation instead of manual job-board curation',
      ],
    },
  },
  {
    id: 'sellershield',
    title: 'SellerShield',
    categories: ['AI & Automation', 'Full-Stack Web'],
    description:
      'Online seller credibility and scam risk evaluation platform for Pakistani websites, Instagram, Facebook, TikTok, and YouTube stores.',
    summary:
      'Gives online shoppers a quick, evidence-based risk score before they pay an unknown seller.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Python FastAPI'],
    featured: true,
    caseStudy: {
      problem:
        'Buying from Instagram, Facebook, TikTok, YouTube and small web stores is common in Pakistan, but there is no easy way to judge whether a seller is trustworthy. Scams spread because buyers have to decide on gut feeling.',
      solution:
        'A React + Vite + Tailwind frontend sends a store URL to a Python FastAPI backend, which evaluates trust signals such as domain age, contact and business details, and social credibility. The backend combines these into a single risk score with the signals that drove it.',
      highlights: [
        'Covers websites plus Instagram, Facebook, TikTok and YouTube stores',
        'Clear risk score backed by visible trust signals',
        'Built around the Pakistani online-selling landscape',
        'Responsive UI for checking a seller from a phone',
      ],
    },
  },
  {
    id: 'auto-tab-refresher',
    title: 'Auto Tab Refresher & Smart Page Monitor',
    categories: ['Browser & Utility Tools'],
    description:
      'Chrome extension that refreshes tabs every 2 minutes, detects and highlights new DOM/notification changes, and simulates natural scroll/mouse activity.',
    summary:
      'Watches a page for you: reloads on a timer and highlights exactly what changed.',
    stack: ['JavaScript', 'Chrome Extension APIs', 'DOM Mutation'],
    featured: true,
    caseStudy: {
      problem:
        'Anyone waiting on a time-sensitive page, such as new listings, notifications or status updates, ends up refreshing tabs by hand and still misses what changed. Idle pages can also time out.',
      solution:
        'A Chrome extension uses extension APIs to reload chosen tabs every 2 minutes. A content script observes DOM mutations to detect new content or notification changes and highlights them on the page, while light, natural-looking scroll and mouse activity keeps sessions from going idle.',
      highlights: [
        'Automatic tab refresh every 2 minutes',
        'Detects and highlights new DOM and notification changes',
        'Simulated natural scroll and mouse activity',
        'Lightweight, runs entirely in the browser',
      ],
    },
  },
  {
    id: 'image-to-pdf',
    title: 'Zero-Upload Image to PDF Converter',
    categories: ['Browser & Utility Tools'],
    description:
      'Login-free, mobile- and desktop-compatible client-side tool preserving exact image selection sequence and original resolution.',
    summary:
      'Turns photos into a PDF without uploading anything, keeping your order and quality.',
    stack: ['JavaScript', 'Client-Side PDF Generation', 'Responsive UI'],
    featured: true,
    caseStudy: {
      problem:
        'Most online image-to-PDF converters require sign-ups or uploads, which is a privacy risk for documents like IDs and receipts. Many also shuffle the page order or recompress images.',
      solution:
        'Everything happens in the browser: images are read locally and assembled into a PDF with client-side generation, so no file ever leaves the device. Pages follow the exact order the user selected and images keep their original resolution. The responsive UI works on both mobile and desktop.',
      highlights: [
        'Zero upload: files never leave the device',
        'No login or account required',
        'Preserves exact selection order and original resolution',
        'Works on mobile and desktop browsers',
      ],
    },
  },
  {
    id: 'urdu-poster-studio',
    title: 'Web-Based Urdu Poster & Event Design Studio',
    categories: ['Full-Stack Web'],
    description:
      'Browser-based CorelDRAW-style graphic design editor tailored for Urdu typography and formal event posters.',
    summary:
      'A browser-based design editor that treats Urdu typography as a first-class citizen.',
    stack: ['React', 'HTML5 Canvas', 'Tailwind CSS'],
    featured: true,
    caseStudy: {
      problem:
        'Designing formal Urdu posters and event material usually means heavy desktop software like CorelDRAW, or generic web tools that handle Urdu text poorly. Small organizers need something quick that just works.',
      solution:
        'A React and HTML5 Canvas editor with a CorelDRAW-style workflow, tailored for Urdu typography and formal event poster layouts, styled with Tailwind CSS. It runs entirely in the browser with nothing to install.',
      highlights: [
        'CorelDRAW-style editing experience in the browser',
        'Built around Urdu typography and formal event posters',
        'Canvas-based rendering for precise layout control',
        'No installation required',
      ],
    },
  },
];

/* ================================================================== */
/* Automation sandbox presets (SRDS §4.2)                             */
/* ================================================================== */

export const workflowPresets: WorkflowPreset[] = [
  {
    id: 'pakgovjobs-scraper',
    title: 'PakGovJobs Scraper & Expiry Filter',
    tagline: 'Multi-portal job fetching → active vs. expired',
    description:
      'Fetches listings from multiple government portals, parses closing dates, classifies jobs as active or expired, and emits clean JSON.',
    icon: 'FileSearch',
    input: { label: 'Portals', value: 'fpsc.gov.pk, punjab-jobs.gov.pk, paf.gov.pk' },
    stack: ['Python', 'FastAPI', 'BeautifulSoup', 'httpx', 'Pydantic'],
    metric: { label: 'Date-parse accuracy', value: 97.3 },
    steps: [
      {
        id: 'fetch',
        label: 'Fetch portals',
        description: 'Concurrent requests to government job portals',
        latencyMs: 640,
        logs: [
          { level: 'info', message: 'Starting scraper: 3 portals queued' },
          { level: 'info', message: 'GET fpsc.gov.pk/jobs → 200 OK (212 ms)' },
          { level: 'info', message: 'GET punjab-jobs.gov.pk/latest → 200 OK (301 ms)' },
          { level: 'warn', message: 'GET paf.gov.pk/careers → retry 1/3 (timeout)' },
          { level: 'success', message: 'GET paf.gov.pk/careers → 200 OK (127 ms)' },
        ],
      },
      {
        id: 'parse',
        label: 'Parse listings & dates',
        description: 'Extract title, department, and closing date',
        latencyMs: 480,
        logs: [
          { level: 'info', message: 'Parsed 148 raw listings from 3 sources' },
          { level: 'info', message: 'Normalized closing dates (DD/MM/YYYY → ISO 8601)' },
          { level: 'warn', message: '4 listings missing closing date → flagged for review' },
        ],
      },
      {
        id: 'classify',
        label: 'Expiry classification',
        description: 'Separate active vacancies from expired listings',
        latencyMs: 220,
        logs: [
          { level: 'info', message: 'Comparing closing_date against today (UTC+5)' },
          { level: 'success', message: 'Active: 97 · Expired: 47 · Unknown: 4' },
          { level: 'info', message: 'Deduplicated 11 cross-posted listings' },
        ],
      },
      {
        id: 'structure',
        label: 'Structure JSON',
        description: 'Group by sector and serialize for the API',
        latencyMs: 150,
        logs: [
          { level: 'info', message: 'Grouping by sector: federal, provincial, armed forces, medical' },
          { level: 'success', message: 'Payload ready — 144 records, 18.4 KB' },
        ],
      },
    ],
    output: {
      status: 'ok',
      scraped_at: '2026-11-23T14:20:00Z',
      sources: 3,
      totals: { active: 97, expired: 47, unknown: 4 },
      sample: [
        {
          title: 'Assistant Director (BS-17)',
          department: 'Federal Public Service Commission',
          sector: 'federal',
          closing_date: '2026-12-05',
          status: 'active',
        },
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
    title: 'SellerShield AI Scam Risk Analyzer',
    tagline: 'Store URL → trust signals → risk score',
    description:
      'Evaluates an e-commerce or social store across trust signals, domain age, and social credibility metrics to produce a scam risk score.',
    icon: 'ShieldCheck',
    input: { label: 'Store URL', value: 'https://instagram.com/example_fashion_store' },
    stack: ['React', 'Vite', 'Python', 'FastAPI', 'LLM Scoring'],
    metric: { label: 'Model confidence', value: 91.4 },
    steps: [
      {
        id: 'resolve',
        label: 'Resolve store profile',
        description: 'Detect platform and collect public metadata',
        latencyMs: 420,
        logs: [
          { level: 'info', message: 'Platform detected: Instagram' },
          { level: 'info', message: 'Fetched public profile: 3.2k followers, 86 posts' },
        ],
      },
      {
        id: 'domain',
        label: 'Domain & contact checks',
        description: 'Domain age, WHOIS privacy, contact details',
        latencyMs: 560,
        logs: [
          { level: 'info', message: 'Linked website: example-fashion.pk' },
          { level: 'warn', message: 'Domain age: 23 days (< 90 day threshold)' },
          { level: 'warn', message: 'No physical address or business registration found' },
        ],
      },
      {
        id: 'social',
        label: 'Social credibility scan',
        description: 'Engagement authenticity and review sentiment',
        latencyMs: 690,
        logs: [
          { level: 'info', message: 'Engagement rate: 0.4% (follower/like ratio anomalous)' },
          { level: 'warn', message: 'Comment patterns: 62% repeated generic text' },
          { level: 'success', message: 'Customer reviews found on 2 external sources' },
        ],
      },
      {
        id: 'score',
        label: 'AI risk scoring',
        description: 'Weighted model produces final verdict',
        latencyMs: 310,
        logs: [
          { level: 'info', message: 'Weighting 14 trust signals' },
          { level: 'success', message: 'Risk score: 72/100 → HIGH RISK' },
        ],
      },
    ],
    output: {
      store: 'instagram.com/example_fashion_store',
      risk_score: 72,
      verdict: 'high_risk',
      signals: {
        domain_age_days: 23,
        business_registration: false,
        engagement_authenticity: 'low',
        external_reviews: 2,
      },
      recommendation: 'Prefer cash-on-delivery and verify seller identity before paying in advance.',
    },
  },
  {
    id: 'whatsapp-real-estate',
    title: 'WhatsApp Real Estate AI Router',
    tagline: 'Lead intent → property match → auto reply',
    description:
      'Classifies incoming WhatsApp lead intent, matches properties from inventory, and generates an automated CRM entry and reply.',
    icon: 'MessageSquare',
    input: {
      label: 'Incoming message',
      value: '"Hi, looking for a 5 marla house near Capital Smart City, budget around 1.5 crore"',
    },
    stack: ['Python', 'FastAPI', 'WhatsApp Business API', 'LLM Intent Routing', 'CRM Webhooks'],
    metric: { label: 'Intent confidence', value: 96 },
    steps: [
      {
        id: 'receive',
        label: 'Receive webhook',
        description: 'WhatsApp Business API inbound message',
        latencyMs: 180,
        logs: [
          { level: 'info', message: 'Webhook received: message_id=wamid.HBg…' },
          { level: 'info', message: 'Sender: +92 3XX XXXXXXX (new contact)' },
        ],
      },
      {
        id: 'intent',
        label: 'Classify intent',
        description: 'LLM extracts intent and entities',
        latencyMs: 520,
        logs: [
          { level: 'info', message: 'Intent: buy_property (confidence 0.96)' },
          { level: 'success', message: 'Entities: type=house, size=5 marla, area=Capital Smart City, budget=15000000 PKR' },
        ],
      },
      {
        id: 'match',
        label: 'Match properties',
        description: 'Query inventory and rank by fit',
        latencyMs: 340,
        logs: [
          { level: 'info', message: 'Querying inventory: 212 active listings' },
          { level: 'success', message: '3 matches found (top score 0.91)' },
        ],
      },
      {
        id: 'respond',
        label: 'Generate reply & sync CRM',
        description: 'Send WhatsApp response and create lead',
        latencyMs: 410,
        logs: [
          { level: 'info', message: 'Reply generated in Roman Urdu/English (lead language)' },
          { level: 'success', message: 'WhatsApp reply sent with 3 property cards' },
          { level: 'success', message: 'CRM lead created → assigned to agent queue (priority: hot)' },
        ],
      },
    ],
    output: {
      lead: {
        intent: 'buy_property',
        confidence: 0.96,
        budget_pkr: 15000000,
        preferred_area: 'Capital Smart City',
        property_type: 'house',
        size: '5 marla',
      },
      matches: [
        { id: 'P-1042', title: '5 Marla House, Overseas Block', price_pkr: 14800000, score: 0.91 },
        { id: 'P-0987', title: '5 Marla House, Executive Block', price_pkr: 15500000, score: 0.84 },
        { id: 'P-1120', title: '5 Marla House, Park View', price_pkr: 14200000, score: 0.79 },
      ],
      actions: ['whatsapp_reply_sent', 'crm_lead_created', 'agent_notified'],
      priority: 'hot',
    },
  },
];

/* ================================================================== */
/* AI Portfolio Assistant knowledge base (SRDS §4.5)                  */
/* ================================================================== */

export const assistantKnowledge: AssistantKnowledge = {
  name: 'Muntazir AI',
  greeting:
    "Hi! I'm Syed Muntazir's portfolio assistant. Ask me about his projects, tech stack, or how to start a project with him — or tap a suggestion below.",
  fallback:
    "I don't have a specific answer for that yet, but you can reach Muntazir directly via the contact section, Fiverr (@muntazirhamdani) or GitHub (muntazir5683). Try one of the suggested questions too!",
  intents: [
    {
      id: 'why-hire',
      chip: 'Why hire Muntazir for AI automation?',
      keywords: ['why hire', 'hire', 'automation', 'ai automation', 'workflow', 'benefit', 'strength'],
      answer:
        "Muntazir pairs full-stack engineering with practical AI automation. He builds end-to-end pipelines — scraping, data cleaning, classification, and API delivery — in Python & FastAPI, then ships them behind fast React UIs. Real examples: PakGovJobs and SellerShield. His QA background means the automations are tested and reliable, not just demos.\n\nTry the live demos in [[#automations|Automation Sandbox]], or browse the full case studies in [[#projects|Projects]].",
      followUps: ['Tell me about SellerShield & PakGovJobs', 'How can I start a project with him?'],
      sections: ['#automations', '#projects'],
    },
    {
      id: 'projects',
      chip: 'Tell me about SellerShield & PakGovJobs',
      keywords: ['sellershield', 'pakgovjobs', 'pakgov', 'project', 'projects', 'portfolio', 'work', 'built'],
      answer:
        'PakGovJobs is an automated all-Pakistan government job aggregator that separates active vacancies from expired listings across federal, provincial, armed forces and medical departments (Python, FastAPI, web scraping, React). SellerShield is a seller credibility and scam-risk platform for Pakistani websites and Instagram, Facebook, TikTok and YouTube stores (React, Vite, Tailwind CSS, FastAPI).\n\nOpen the [[#projects|Projects]] case studies, or run simulated pipelines in the [[#automations|Automation Sandbox]].',
      followUps: ['What is his core tech stack?', 'How can I start a project with him?'],
      sections: ['#projects', '#automations'],
    },
    {
      id: 'tech-stack',
      chip: 'What is his core tech stack?',
      keywords: ['tech', 'stack', 'skills', 'technology', 'technologies', 'python', 'react', 'fastapi', 'tools', 'language'],
      answer:
        'Backend & automation: Python, FastAPI, REST APIs, web scraping, AI agent workflows and Chrome extensions. Frontend: React.js, Astro, Tailwind CSS, Vite, HTML5/CSS3. QA & DevOps: software QA testing, Git/GitHub, and deployments on Vercel and Render.\n\nSee the full breakdown under [[#experience|Experience & Skills]].',
      followUps: ['Tell me about SellerShield & PakGovJobs', 'How can I start a project with him?'],
      sections: ['#experience'],
    },
    {
      id: 'start-project',
      chip: 'How can I start a project with him?',
      keywords: ['start', 'contact', 'project with', 'work together', 'quote', 'price', 'pricing', 'cost', 'estimate', 'budget', 'fiverr', 'email'],
      answer:
        "Easiest path: use the Smart Project Estimator in [[#contact|Contact]] to scope your project (type, timeline, features) and copy the generated brief. Then send it via email, message Muntazir on Fiverr (@muntazirhamdani), or reach out on GitHub (muntazir5683). He's also open to full-time roles.",
      followUps: ['What is his core tech stack?'],
      sections: ['#contact'],
    },
    {
      id: 'experience',
      keywords: ['experience', 'background', 'career', 'intern', 'job history', 'worked'],
      answer:
        "Muntazir works as a freelance full-stack & AI developer on Fiverr, building custom AI web apps, chatbots and Python automation for global clients. Earlier roles include Admin & HR Operations at Capital Smart City, Customer Service at the Ministry of Public Health, Qatar, and a Software Engineering internship at App in Snap (frontend/backend features and QA).\n\nFull timeline: [[#experience|Experience & Education]].",
      sections: ['#experience'],
    },
    {
      id: 'education',
      keywords: ['education', 'degree', 'university', 'study', 'studied', 'comsats', 'bs '],
      answer:
        'Muntazir holds a BS in Software Engineering from COMSATS University Islamabad, Wah Campus. More under [[#experience|Experience & Education]].',
      sections: ['#experience'],
    },
    {
      id: 'availability',
      keywords: ['available', 'availability', 'full-time', 'full time', 'freelance', 'open to', 'job'],
      answer:
        "Yes — Muntazir is currently available for full-time roles and AI/automation projects, including freelance and contract work. Scope a role or project in [[#contact|Contact]].",
      sections: ['#contact'],
    },
    {
      id: 'extensions-tools',
      keywords: ['chrome', 'extension', 'scraper', 'scraping', 'pdf', 'urdu', 'poster', 'tool', 'tools', 'utility'],
      answer:
        'Beyond web apps, Muntazir builds browser and utility tools: an Auto Tab Refresher & Smart Page Monitor Chrome extension, a zero-upload Image to PDF converter that runs fully client-side, and a web-based Urdu poster & event design studio built on HTML5 Canvas.\n\nDetails in [[#projects|Projects]].',
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
    label: 'Full-Time / Contract Role',
    description: 'Join your team as a full-stack / automation engineer.',
  },
  {
    id: 'ai-automation',
    label: 'AI Automation / Agent',
    description: 'Workflow automations, scrapers, chatbots and AI agents.',
  },
  {
    id: 'full-stack',
    label: 'Full-Stack Web App',
    description: 'React frontend with Python/FastAPI backend.',
  },
  {
    id: 'chrome-extension',
    label: 'Chrome Extension / Scraper',
    description: 'Custom browser extensions, scrapers and page monitors.',
  },
];

export const timelineOptions: TimelineOption[] = [
  {
    id: 'urgent',
    label: 'Urgent (1–2 Weeks)',
    description: 'Tight deadline — focused MVP delivery.',
    weeks: [1, 2],
  },
  {
    id: 'standard',
    label: 'Standard (3–5 Weeks)',
    description: 'Balanced discovery, build and polish.',
    weeks: [3, 5],
  },
  {
    id: 'flexible',
    label: 'Flexible / Long-Term',
    description: 'Ongoing collaboration or phased roadmap.',
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
