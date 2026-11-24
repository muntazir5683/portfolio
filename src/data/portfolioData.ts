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
/* Automation sandbox presets (SRDS §4.2)                             */
/* ================================================================== */

export const workflowPresets: WorkflowPreset[] = [
  {
    id: 'pakgovjobs-scraper',
    title: 'PakGovJobs scrape pipeline',
    tagline: 'Fetch → parse dates → filter expired → JSON',
    description:
      'Demo of the job aggregator pipeline: hit a few portals, normalize closing dates, mark expired rows, return structured JSON.',
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
    title: 'SellerShield risk check',
    tagline: 'URL → trust signals → score',
    description:
      'Demo of the seller check: resolve the store, look at domain age and contact signals, weight them into a risk score.',
    icon: 'ShieldCheck',
    input: { label: 'Store URL', value: 'https://instagram.com/example_fashion_store' },
    stack: ['React', 'Vite', 'Python', 'FastAPI'],
    metric: { label: 'Signal coverage', value: 91.4 },
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
        label: 'Score signals',
        description: 'Weighted rules produce the final score',
        latencyMs: 310,
        logs: [
          { level: 'info', message: 'Applying weights to 14 signals' },
          { level: 'success', message: 'Risk score: 72/100 (high)' },
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
    title: 'WhatsApp lead router',
    tagline: 'Inbound message → match inventory → reply',
    description:
      'Demo of a real-estate lead flow: classify the message, pick matching listings, send a reply and open a CRM row.',
    icon: 'MessageSquare',
    input: {
      label: 'Incoming message',
      value: '"Hi, looking for a 5 marla house near Capital Smart City, budget around 1.5 crore"',
    },
    stack: ['Python', 'FastAPI', 'WhatsApp Business API', 'CRM webhook'],
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
        description: 'Extract intent and entities from the message',
        latencyMs: 520,
        logs: [
          { level: 'info', message: 'Intent: buy_property (0.96)' },
          { level: 'success', message: 'Entities: house, 5 marla, Capital Smart City, budget 1.5 crore' },
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
          { level: 'success', message: 'CRM lead created and queued for an agent' },
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
      priority: 'high',
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
