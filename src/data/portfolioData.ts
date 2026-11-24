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
  | 'urdu-canvas'
  | 'loan-doc'
  | 'voice-agent';

export type ProjectShowcaseTier = 'flagship' | 'proof';

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
  /** Flagship mortgage systems vs engineering proof work. */
  showcase: ProjectShowcaseTier;
  stack: string[];
  featured: boolean;
  /** Only rendered when a non-empty string — never use '#' placeholders. */
  githubUrl?: string;
  liveUrl?: string;
  caseStudy: ProjectCaseStudy;
  /** Optional WebP thumbnail in /public/assets */
  thumbnail?: string;
}

export interface ServiceOffer {
  id: string;
  title: string;
  tagline: string;
  description: string;
  outcomes: string[];
  icon: 'Phone' | 'FileText' | 'RefreshCw';
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

export type PortfolioSection =
  | '#projects'
  | '#services'
  | '#automations'
  | '#contact'
  | '#experience';

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
  headline: 'Custom Python AI Agents for Independent US Mortgage Brokers',
  title: 'Mortgage AI Engineer',
  location: 'Remote · US Mortgage Ops',
  availability: 'Accepting broker & lending-team builds',
  summary:
    'Custom Python AI agents that pre-qualify leads 24/7 and parse W-2s & bank statements automatically — so independent brokers and lending teams stop losing deals to after-hours voicemail and manual document review.',
  roles: [
    '24/7 lead pre-qualification',
    'W-2 & bank statement parsing',
    'Borrower follow-up agents',
    'LOS / CRM sync',
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
  { label: 'Services', href: '#services' },
  { label: 'Systems', href: '#projects' },
  { label: 'Pipelines', href: '#automations' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

/* ================================================================== */
/* Services — mortgage AI offers                                      */
/* ================================================================== */

export const serviceOffers: ServiceOffer[] = [
  {
    id: 'voice-sms-receptionist',
    title: 'AI voice agent to answer calls for mortgage brokers',
    tagline: '24/7 Voice & SMS lead receptionist',
    description:
      'Answers inbound calls and texts around the clock, asks loan-intent questions, qualifies purchase vs refinance, and books warm handoffs to your LO without a call-center seat.',
    outcomes: [
      'Capture nights & weekend leads',
      'Purchase / refi / cash-out routing',
      'Calendar or CRM appointment booking',
    ],
    icon: 'Phone',
  },
  {
    id: 'loan-doc-parser',
    title: 'Best AI lending agent for mortgage brokers — doc parser',
    tagline: 'W-2 & bank statement DTI extraction',
    description:
      'Reads W-2s, paystubs, and bank statements; extracts income, deposits, and liabilities; and returns structured fields your team can trust before underwriting triage.',
    outcomes: [
      'W-2 / paystub / statement OCR + LLM',
      'Income & DTI draft fields',
      'Exception flags for human review',
    ],
    icon: 'FileText',
  },
  {
    id: 'followup-los-sync',
    title: 'Custom agentic AI development services — LOS sync',
    tagline: 'Borrower follow-up that writes back to CRM',
    description:
      'Sequences SMS/email nudges for missing docs, status updates, and rate-lock reminders, then writes activity back to your LOS or CRM so nothing falls through the cracks.',
    outcomes: [
      'Doc-request chase sequences',
      'Status & rate-lock reminders',
      'LOS / CRM activity sync',
    ],
    icon: 'RefreshCw',
  },
];

/* ================================================================== */
/* Skills                                                             */
/* ================================================================== */

export const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    title: 'AI Agents & Pipelines',
    skills: [
      'Python',
      'FastAPI',
      'Voice / SMS agents',
      'Document OCR + LLM',
      'Webhook & LOS sync',
      'Workflow automation',
    ],
  },
  {
    id: 'frontend',
    title: 'Broker Ops UIs',
    skills: ['React', 'Astro', 'Tailwind CSS', 'Vite', 'Ops dashboards'],
  },
  {
    id: 'qa-devops',
    title: 'Ship & Harden',
    skills: ['Regression QA', 'Git / GitHub', 'Vercel', 'Render', 'Secure handoff'],
  },
];

/* ================================================================== */
/* Experience & education                                             */
/* ================================================================== */

export const experience: ExperienceItem[] = [
  {
    id: 'fiverr-freelance',
    kind: 'work',
    role: 'Python AI Engineer (Freelance)',
    organization: 'Fiverr — @muntazirhamdani',
    period: 'Present',
    description:
      'Python AI engineering for lending teams: custom voice/CRM agents, RAG document pipelines for W-2s and bank statements, and borrower follow-up automation with clean handoffs.',
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
    id: 'loandoc-ai',
    title: 'LoanDoc AI (W-2 & Bank Statement Parser)',
    categories: ['AI & Automation', 'Full-Stack Web'],
    description:
      'Mortgage document AI that extracts income, liabilities, and deposit patterns from W-2s, paystubs, and bank statements into structured fields for LO review.',
    summary:
      'Upload W-2s and bank statements — get draft DTI/income fields and exception flags without manual spreadsheet entry.',
    problem: 'Processors burn hours re-keying W-2s and statements before a file is even touchable.',
    outcome: 'Structured income · DTI draft · review flags',
    motif: 'loan-doc',
    showcase: 'flagship',
    stack: ['Python', 'FastAPI', 'OCR + LLM', 'React'],
    featured: true,
    caseStudy: {
      problem:
        'Independent brokers receive PDFs and phone photos of W-2s, paystubs, and bank statements. Manual transcription slows pre-qual and introduces typos in income and liability fields.',
      solution:
        'A Python/FastAPI pipeline runs OCR, LLM field extraction, and rule checks for missing pages or inconsistent YTD income. React review UI lets an LO accept, edit, or escalate fields before syncing downstream.',
      highlights: [
        'W-2, paystub, and multi-page bank statement support',
        'Draft monthly income and DTI inputs for human confirmation',
        'Exception queue for low-confidence or conflicting values',
        'Export-ready JSON for CRM / LOS handoff',
      ],
    },
  },
  {
    id: 'brokervoice-ai',
    title: 'BrokerVoice AI (24/7 Lead Qualification Agent)',
    categories: ['AI & Automation', 'Full-Stack Web'],
    description:
      'Always-on voice and SMS agent that greets inbound mortgage leads, runs purchase vs refinance pre-qual questions, and books warm handoffs to the LO.',
    summary:
      'Answers after-hours calls and texts, qualifies intent and timeline, and schedules the LO instead of dumping to voicemail.',
    problem: 'Nights and weekends — high-intent borrowers hit voicemail and shop the next broker.',
    outcome: '24/7 pre-qual · booked LO handoffs',
    motif: 'voice-agent',
    showcase: 'flagship',
    stack: ['Python', 'Voice / SMS APIs', 'FastAPI', 'CRM webhooks'],
    featured: true,
    caseStudy: {
      problem:
        'Independent LOs cannot staff a call desk overnight. Missed first-touch often means the lead never returns.',
      solution:
        'BrokerVoice answers voice and SMS, asks compliant pre-qual questions (loan purpose, credit band, timeline, property status), scores readiness, and either books a calendar slot or creates a CRM task with transcript + summary.',
      highlights: [
        'Voice + SMS channels with shared conversation state',
        'Purchase / refinance / cash-out intent routing',
        'Warm transfer or calendar booking into LO availability',
        'Transcript + lead score written to CRM',
      ],
    },
  },
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
    showcase: 'proof',
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
    showcase: 'proof',
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
    title: 'Smart Page Monitor',
    categories: ['Browser & Utility Tools'],
    description:
      'Chrome extension that reloads selected tabs on a timer, highlights DOM changes, and nudges idle pages so sessions do not drop.',
    summary:
      'Keeps a tab fresh every two minutes and highlights what changed so you do not miss an update.',
    problem: 'Manual refresh on listings/dashboards misses updates and idle tabs time out.',
    outcome: 'Timed reload + DOM change highlights',
    motif: 'chrome-tabs',
    showcase: 'proof',
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
    showcase: 'proof',
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
    showcase: 'proof',
    stack: ['React', 'HTML5 Canvas', 'Tailwind CSS'],
    featured: false,
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
    id: 'borrower-prequal-voice-sms',
    title: '24/7 Inbound Borrower Pre-Qual Voice & SMS Agent',
    tagline: 'Voice/SMS in → intent + readiness → LO handoff',
    description:
      'Answers after-hours borrower calls and texts, runs purchase vs refinance pre-qual questions, scores readiness, and books a warm LO handoff instead of voicemail.',
    roi: 'Captures nights & weekend leads that used to go cold',
    icon: 'MessageSquare',
    input: {
      label: 'Inbound channel',
      value: 'voice + SMS — Hi, looking to refinance my primary in Austin this month',
    },
    stack: ['Python', 'FastAPI', 'Voice / SMS APIs', 'CRM webhooks'],
    metric: { label: 'Intent confidence', value: 94 },
    steps: [
      {
        id: 'answer',
        label: 'Answer inbound voice / SMS',
        description: 'Receive call or text on brokerage numbers',
        latencyMs: 180,
        logs: [
          { level: 'info', message: 'channel=voice from=+15125550198 duration_est=0:42' },
          { level: 'info', message: 'greeting played — brokerage hours note attached' },
          { level: 'success', message: 'session_id=BV-88421 opened' },
        ],
      },
      {
        id: 'qualify',
        label: 'Run purchase vs refinance pre-qual',
        description: 'Ask loan purpose, credit band, timeline, occupancy',
        latencyMs: 920,
        logs: [
          { level: 'info', message: 'intent=refinance confidence=0.93' },
          { level: 'info', message: 'occupancy=primary_residence timeline=30_days' },
          { level: 'success', message: 'credit_band=self_reported_680_plus' },
        ],
      },
      {
        id: 'score',
        label: 'Score borrower readiness',
        description: 'Weight intent, timeline, and completeness',
        latencyMs: 240,
        logs: [
          { level: 'info', message: 'readiness_score=86/100' },
          { level: 'success', message: 'route=warm_handoff (not nurture-only)' },
        ],
      },
      {
        id: 'handoff',
        label: 'Book LO handoff / CRM task',
        description: 'Calendar slot or task with transcript summary',
        latencyMs: 310,
        logs: [
          { level: 'info', message: 'matched LO=jordan.lee desk=TX-Central' },
          { level: 'success', message: 'calendar booked 2026-11-25 10:30 CT; CRM lead LD-9921' },
        ],
      },
    ],
    output: {
      lead_id: 'LD-9921',
      channel: 'voice',
      intent: 'refinance',
      readiness_score: 86,
      assigned_lo: 'jordan.lee@brokerage.example',
      appointment: '2026-11-25T16:30:00Z',
      transcript_summary:
        'Borrower wants to refinance primary in Austin; self-reported 680+ credit; timeline ~30 days.',
    },
  },
  {
    id: 'w2-bank-dti-pipeline',
    title: 'Automated W-2 & Bank Statement DTI Extraction Pipeline',
    tagline: 'PDF upload → OCR + LLM → income / DTI draft',
    description:
      'Ingests W-2s, paystubs, and bank statements; extracts income and liability signals; and returns draft DTI fields with exception flags for LO review.',
    roi: 'Cuts hours of manual re-keying per file',
    icon: 'FileSearch',
    input: {
      label: 'Document packet',
      value: 'W2_2025.pdf, paystub_oct.pdf, chase_statements_90d.pdf',
    },
    stack: ['Python', 'FastAPI', 'OCR + LLM', 'React review UI'],
    metric: { label: 'Field confidence', value: 91.4 },
    steps: [
      {
        id: 'ingest',
        label: 'Ingest document packet',
        description: 'Validate PDF pages and classify doc types',
        latencyMs: 420,
        logs: [
          { level: 'info', message: 'packet=3 files / 11 pages' },
          { level: 'success', message: 'classified: w2=1 paystub=1 bank_statement=1' },
        ],
      },
      {
        id: 'ocr',
        label: 'OCR + layout parse',
        description: 'Extract text blocks and tables',
        latencyMs: 780,
        logs: [
          { level: 'info', message: 'ocr engine=doc-pipeline v2' },
          { level: 'warn', message: 'page 4 low contrast — confidence 0.71' },
          { level: 'success', message: 'text layers ready for field extract' },
        ],
      },
      {
        id: 'extract',
        label: 'Extract income & liabilities',
        description: 'LLM + rules for wages, deposits, debts',
        latencyMs: 640,
        logs: [
          { level: 'info', message: 'w2_wages=89240 paystub_ytd=71420' },
          { level: 'success', message: 'monthly_income_draft=7436 liabilities_draft=1840' },
        ],
      },
      {
        id: 'dti',
        label: 'Compute DTI draft + flags',
        description: 'Assemble DTI and exception queue',
        latencyMs: 210,
        logs: [
          { level: 'success', message: 'dti_draft=24.7%' },
          { level: 'info', message: 'flags: none_critical; review_suggested=paystub_ytd_vs_w2' },
        ],
      },
    ],
    output: {
      packet_id: 'DOC-4410',
      monthly_income_draft: 7436,
      liabilities_draft: 1840,
      dti_draft: 24.7,
      flags: ['review_paystub_ytd_vs_w2'],
      status: 'ready_for_lo_review',
    },
  },
  {
    id: 'missing-doc-followup',
    title: 'Stalled Loan File & Missing Doc Follow-Up Engine',
    tagline: 'Stalled file → chase sequence → LOS/CRM sync',
    description:
      'Detects stalled loan files missing borrower docs, runs SMS/email chase sequences, and writes activity back to LOS/CRM so processors stay unblocked.',
    roi: 'Reactivates stalled files without manual chasing',
    icon: 'ShieldCheck',
    input: {
      label: 'LOS file',
      value: 'loan_file=LF-33018 status=processing missing=[bank_statements, photo_id]',
    },
    stack: ['Python', 'FastAPI', 'SMS/Email', 'LOS webhooks'],
    metric: { label: 'Response rate', value: 68 },
    steps: [
      {
        id: 'detect',
        label: 'Detect stalled / incomplete file',
        description: 'Compare required docs vs uploaded set',
        latencyMs: 160,
        logs: [
          { level: 'warn', message: 'LF-33018 idle 4d — missing bank_statements, photo_id' },
          { level: 'success', message: 'chase_plan=missing_docs_v3' },
        ],
      },
      {
        id: 'sequence',
        label: 'Launch borrower chase sequence',
        description: 'SMS then email with secure upload link',
        latencyMs: 380,
        logs: [
          { level: 'info', message: 'SMS sent to +1***-***-0198' },
          { level: 'success', message: 'email queued with upload portal token' },
        ],
      },
      {
        id: 'collect',
        label: 'Collect uploads / replies',
        description: 'Watch inbound docs and borrower replies',
        latencyMs: 520,
        logs: [
          { level: 'info', message: 'upload: bank_statements.pdf (3 pages)' },
          { level: 'warn', message: 'photo_id still missing — reminder T+24h scheduled' },
        ],
      },
      {
        id: 'sync',
        label: 'Sync activity to LOS / CRM',
        description: 'Write notes, tasks, and doc checklist updates',
        latencyMs: 260,
        logs: [
          { level: 'success', message: 'LOS checklist updated; CRM activity ACT-7712' },
          { level: 'success', message: 'processor notified jordan.lee' },
        ],
      },
    ],
    output: {
      loan_file: 'LF-33018',
      missing_before: ['bank_statements', 'photo_id'],
      missing_after: ['photo_id'],
      activities_synced: 2,
      next_reminder: '2026-11-25T15:00:00Z',
      status: 'partially_unblocked',
    },
  },
];

/* ================================================================== */
/* Ask-about-my-work chat knowledge                                   */
/* ================================================================== */

export const assistantKnowledge: AssistantKnowledge = {
  name: 'Mortgage AI Concierge',
  greeting:
    'I am the Mortgage AI Concierge for this studio. Ask how we pre-qualify borrowers 24/7, parse W-2s & bank statements, or sync follow-ups into your LOS/CRM.',
  fallback:
    "I don't have a canned answer for that. Browse [[#services|Services]] and [[#projects|Flagship systems]], or send a brief via [[#contact|Contact]] / email syedmuntazir.pwh@gmail.com.",
  intents: [
    {
      id: 'prequal',
      chip: 'How does 24/7 lead pre-qual work?',
      keywords: [
        'pre-qual',
        'prequal',
        'pre qualification',
        'lead',
        'voice',
        'sms',
        'after hours',
        '24/7',
        'brokervoice',
        'receptionist',
      ],
      answer:
        'BrokerVoice AI answers voice and SMS after hours, asks purchase vs refinance questions, scores readiness, and books a warm LO handoff instead of dumping to voicemail.\n\n[[#services|Services]] · [[#projects|BrokerVoice AI]]',
      followUps: ['What about W-2 / bank statement parsing?', 'Book a broker build'],
      sections: ['#services', '#projects'],
    },
    {
      id: 'docs',
      chip: 'What about W-2 / bank statement parsing?',
      keywords: [
        'w-2',
        'w2',
        'bank statement',
        'paystub',
        'dti',
        'income',
        'document',
        'parser',
        'loandoc',
        'ocr',
      ],
      answer:
        'LoanDoc AI OCR + LLM-extracts income, liabilities, and deposit patterns from W-2s, paystubs, and statements, then flags exceptions for LO review before any LOS write.\n\n[[#projects|LoanDoc AI]] · [[#services|Doc parser service]]',
      followUps: ['How does 24/7 lead pre-qual work?', 'Book a broker build'],
      sections: ['#projects', '#services'],
    },
    {
      id: 'services',
      chip: 'What can you automate for my brokerage?',
      keywords: [
        'service',
        'services',
        'automate',
        'brokerage',
        'mortgage',
        'lending',
        'follow-up',
        'follow up',
        'crm',
        'los',
        'offer',
      ],
      answer:
        'Three specialty builds: (1) 24/7 AI Voice & SMS Lead Receptionist, (2) Automated Loan Doc & Bank Statement Parser, (3) Borrower Follow-Up + LOS/CRM Sync.\n\n[[#services|See services]]',
      followUps: ['How does 24/7 lead pre-qual work?', 'Book a broker build'],
      sections: ['#services'],
    },
    {
      id: 'proof',
      chip: 'Show engineering proof work',
      keywords: [
        'sellershield',
        'pakgovjobs',
        'pakgov',
        'page monitor',
        'image to pdf',
        'proof',
        'engineering',
        'project',
        'projects',
        'portfolio',
      ],
      answer:
        'Under Engineering & Automation Proof: SellerShield, Smart Page Monitor, PakGovJobs, and Image→PDF — the same Python/React delivery muscle behind mortgage voice agents, DTI parsers, and LOS follow-up engines.\n\n[[#projects|Proof section]] · [[#automations|Pipeline demos]]',
      followUps: ['What can you automate for my brokerage?', 'Book a broker build'],
      sections: ['#projects', '#automations'],
    },
    {
      id: 'start-project',
      chip: 'Book a broker build',
      keywords: [
        'start',
        'contact',
        'book',
        'hire',
        'quote',
        'price',
        'pricing',
        'cost',
        'estimate',
        'budget',
        'fiverr',
        'email',
        'reach',
        'work together',
      ],
      answer:
        'Use the [[#contact|scope builder]] to describe your brokerage workflow, then copy or email the brief. You can also reach Fiverr (@muntazirhamdani) or syedmuntazir.pwh@gmail.com.',
      followUps: ['What can you automate for my brokerage?'],
      sections: ['#contact'],
    },
    {
      id: 'tech-stack',
      keywords: ['tech', 'stack', 'skills', 'python', 'react', 'fastapi', 'tools', 'language'],
      answer:
        'Delivery stack: Python, FastAPI, React/Astro, OCR + LLM pipelines, voice/SMS APIs, and CRM/LOS webhooks. [[#experience|Skills]]',
      sections: ['#experience'],
    },
    {
      id: 'experience',
      keywords: ['experience', 'background', 'career', 'intern', 'job history', 'worked'],
      answer:
        'Builds custom AI agents for broker ops; background spans freelance engineering, ops roles, and a software internship. [[#experience|Timeline]]',
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
      keywords: ['available', 'availability', 'freelance', 'open to', 'accepting'],
      answer:
        'Yes — accepting custom builds for independent US mortgage brokers and lending teams. [[#contact|Send a brief]]',
      sections: ['#contact'],
    },
  ],
};

/* ================================================================== */
/* Contact estimator options (SRDS §4.6)                              */
/* ================================================================== */

export const engagementTypes: EngagementType[] = [
  {
    id: 'ai-automation',
    label: '24/7 Lead Receptionist',
    description: 'Voice & SMS pre-qualification agent for your brokerage.',
  },
  {
    id: 'full-stack',
    label: 'Loan Doc / Statement Parser',
    description: 'W-2, paystub, and bank statement extraction into DTI fields.',
  },
  {
    id: 'chrome-extension',
    label: 'Follow-Up + LOS/CRM Sync',
    description: 'Borrower chase sequences wired into your existing stack.',
  },
  {
    id: 'full-time',
    label: 'Custom mortgage AI build',
    description: 'Scoped agent or pipeline beyond the three core offers.',
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
  { id: 'voice-sms', label: 'Voice & SMS Lead Agent' },
  { id: 'doc-parser', label: 'W-2 / Bank Statement Parser' },
  { id: 'followup', label: 'Borrower Follow-Up Sequences' },
  { id: 'los-crm', label: 'LOS / CRM Sync' },
  { id: 'python-backend', label: 'Python / FastAPI Backend' },
  { id: 'ops-dashboard', label: 'LO Review Dashboard' },
  { id: 'api-integration', label: 'Third-Party API Integration' },
];
