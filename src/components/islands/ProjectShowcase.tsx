import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ExternalLink,
  Layers,
  Lightbulb,
  Puzzle,
  Sparkles,
  Star,
  Target,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  projectFilters,
  projects,
  type Project,
  type ProjectCategory,
  type ProjectFilter,
  type ProjectMotif,
} from '../../data/portfolioData';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const categoryIcons: Record<ProjectCategory, LucideIcon> = {
  'AI & Automation': Bot,
  'Full-Stack Web': Layers,
  'Browser & Utility Tools': Wrench,
};

/** Only render links that actually point somewhere — no dead "#" links. */
const hasUrl = (url?: string): url is string => {
  const trimmed = url?.trim();
  return !!trimmed && trimmed !== '#';
};

const matchesFilter = (project: Project, filter: ProjectFilter) =>
  filter === 'All' || project.categories.includes(filter);

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.97 3.22 9.18 7.69 10.67.56.1.77-.24.77-.54v-1.9c-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.12-1.25-5.12-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.64 0c2.15-1.45 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.63 5.27-5.13 5.55.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.77.54 4.47-1.49 7.69-5.7 7.69-10.67C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  );
}

const linkClass =
  'inline-flex items-center gap-1.5 rounded-lg border border-slate-border px-3 py-2 text-sm font-medium text-white transition-colors hover:border-electric-cyan hover:text-electric-cyan';

function ProjectLinks({ project }: { project: Project }) {
  const github = hasUrl(project.githubUrl) ? project.githubUrl : null;
  const live = hasUrl(project.liveUrl) ? project.liveUrl : null;
  return (
    <>
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label={`${project.title} on GitHub (opens in a new tab)`}
        >
          <GitHubIcon /> GitHub
        </a>
      )}
      {live && (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label={`${project.title} live demo (opens in a new tab)`}
        >
          <ExternalLink size={16} aria-hidden="true" /> Live Demo
        </a>
      )}
    </>
  );
}

function CategoryTags({ categories }: { categories: ProjectCategory[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Categories">
      {categories.map((category, i) => {
        const Icon = categoryIcons[category];
        return (
          <li
            key={category}
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] ${
              i === 0
                ? 'border border-white/15 text-white'
                : 'border border-white/10 text-muted-slate'
            }`}
          >
            <Icon size={12} aria-hidden="true" />
            {category}
          </li>
        );
      })}
    </ul>
  );
}

function StackPills({ stack }: { stack: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
      {stack.map((tech) => (
        <li key={tech} className="tag-mono">
          {tech}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Architectural CSS/SVG card previews                                 */
/* ------------------------------------------------------------------ */

function MotifPreview({ motif }: { motif: ProjectMotif }) {
  return (
    <div
      className="relative h-28 overflow-hidden rounded-lg border border-white/[0.08] bg-[#060a12]"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgb(255 255 255 / 0.08) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      {motif === 'job-board' && (
        <div className="relative flex h-full flex-col gap-1.5 p-3">
          <div className="flex gap-1.5">
            <span className="h-2 w-14 rounded-sm bg-electric-cyan/50" />
            <span className="h-2 w-8 rounded-sm bg-white/15" />
          </div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded border border-white/10 bg-white/[0.03] px-2 py-1.5"
            >
              <span className="size-4 shrink-0 rounded bg-sky-400/30" />
              <span className="h-1.5 flex-1 rounded-sm bg-white/20" />
              <span
                className={`h-1.5 w-8 rounded-sm ${i === 2 ? 'bg-amber-400/40' : 'bg-emerald-status/40'}`}
              />
            </div>
          ))}
        </div>
      )}
      {motif === 'risk-meter' && (
        <div className="relative flex h-full items-center justify-center gap-4 p-3">
          <svg viewBox="0 0 100 60" className="h-14 w-24">
            <path
              d="M10 50 A40 40 0 0 1 90 50"
              fill="none"
              stroke="rgb(255 255 255 / 0.12)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M10 50 A40 40 0 0 1 42 14"
              fill="none"
              stroke="#f87171"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <line
              x1="50"
              y1="50"
              x2="28"
              y2="22"
              stroke="#f87171"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="3.5" fill="#94a3b8" />
          </svg>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-semibold text-red-400">28</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-slate">
              risk · high
            </p>
          </div>
        </div>
      )}
      {motif === 'chrome-tabs' && (
        <div className="relative flex h-full flex-col p-3 pt-2">
          <div className="flex items-end gap-1">
            {['Monitor', 'Listings', 'CRM'].map((label, i) => (
              <div
                key={label}
                className={`flex items-center gap-1.5 rounded-t border border-b-0 px-2.5 py-1.5 text-[10px] ${
                  i === 1
                    ? 'border-white/15 bg-[#0c1220] text-white'
                    : 'border-transparent bg-white/[0.04] text-muted-slate'
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${i === 1 ? 'bg-emerald-status' : 'bg-white/20'}`}
                />
                {label}
              </div>
            ))}
          </div>
          <div className="flex flex-1 items-center justify-center rounded-b border border-white/10 bg-navy/40">
            <span className="rounded border border-electric-cyan/30 bg-electric-cyan/10 px-2 py-1 font-mono text-[10px] text-electric-cyan">
              refresh · 2:00
            </span>
          </div>
        </div>
      )}
      {motif === 'pdf-sorter' && (
        <div className="relative flex h-full items-end justify-center gap-2 p-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex w-11 flex-col overflow-hidden rounded border border-white/12 bg-white/[0.04]"
              style={{ height: `${52 + i * 6}px`, transform: `translateY(${(3 - i) * 2}px)` }}
            >
              <div className="h-2 bg-red-400/50" />
              <div className="flex flex-1 flex-col gap-1 p-1.5">
                <span className="h-1 rounded-sm bg-white/20" />
                <span className="h-1 w-2/3 rounded-sm bg-white/12" />
              </div>
              <span className="pb-1 text-center font-mono text-[9px] text-muted-slate">{i + 1}</span>
            </div>
          ))}
        </div>
      )}
      {motif === 'urdu-canvas' && (
        <div className="relative flex h-full items-center justify-center p-3">
          <div
            className="absolute inset-3 rounded border border-dashed border-white/15"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          />
          <div className="relative rounded border border-white/15 bg-navy/80 px-4 py-2 text-center">
            <p className="font-serif text-lg leading-none text-white/90" dir="rtl">
              اردو
            </p>
            <p className="mt-1 font-mono text-[9px] text-muted-slate">canvas · RTL</p>
          </div>
        </div>
      )}
      {motif === 'loan-doc' && (
        <div className="relative flex h-full items-center gap-3 p-3">
          <div className="flex w-16 flex-col overflow-hidden rounded border border-white/12 bg-white/[0.04]">
            <div className="bg-electric-cyan/30 px-1.5 py-1 font-mono text-[8px] text-white">W-2</div>
            <div className="space-y-1 p-1.5">
              <span className="block h-1 rounded-sm bg-white/25" />
              <span className="block h-1 w-3/4 rounded-sm bg-white/15" />
              <span className="block h-1 w-1/2 rounded-sm bg-white/10" />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            {[
              ['income', '$7,420'],
              ['liabilities', '$1,105'],
              ['dti draft', '31%'],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between rounded border border-white/10 bg-navy/50 px-2 py-1 font-mono text-[10px]"
              >
                <span className="text-muted-slate">{k}</span>
                <span className="text-emerald-status">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {motif === 'voice-agent' && (
        <div className="relative flex h-full flex-col justify-between p-3">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-status opacity-40" />
              <span className="relative size-2 rounded-full bg-emerald-status" />
            </span>
            <span className="font-mono text-[10px] text-emerald-status">live · voice + SMS</span>
          </div>
          <div className="space-y-1.5">
            <div className="max-w-[85%] rounded-lg rounded-bl-sm border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-[10px] text-slate-300">
              Hi — looking to refinance my primary in Austin…
            </div>
            <div className="ml-auto max-w-[85%] rounded-lg rounded-br-sm border border-electric-cyan/25 bg-electric-cyan/10 px-2.5 py-1.5 text-[10px] text-electric-cyan">
              Got it. Purchase or refinance? Timeline?
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm bg-electric-cyan/40"
                style={{ height: `${6 + ((i * 7) % 14)}px` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
  badge,
}: {
  project: Project;
  onOpen: (id: string) => void;
  badge?: string;
}) {
  return (
    <article className="card group animate-fade-in flex flex-col gap-4 overflow-hidden p-0 transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_40px_rgba(0,0,0,0.35)]">
      <div className="px-4 pt-4 sm:px-5 sm:pt-5">
        <MotifPreview motif={project.motif} />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-4 pb-5 sm:px-5 sm:pb-6">
        <div className="flex items-start justify-between gap-3">
          <CategoryTags categories={project.categories} />
          {(badge || project.featured) && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-muted-slate">
              <Star size={11} aria-hidden="true" /> {badge ?? 'Featured'}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-snug text-white">{project.title}</h3>
          <p className="text-sm leading-relaxed text-muted-slate">{project.summary}</p>
        </div>

        <div className="space-y-2 rounded-lg border border-white/[0.07] bg-navy/40 p-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-slate">Problem</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-300">{project.problem}</p>
          </div>
          <div className="border-t border-white/[0.06] pt-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-slate">Outcome</p>
            <p className="mt-0.5 inline-flex rounded-md border border-emerald-status/25 bg-emerald-status/10 px-2 py-0.5 font-mono text-[11px] text-emerald-status">
              {project.outcome}
            </p>
          </div>
        </div>

        <StackPills stack={project.stack} />

        <div className="mt-auto flex flex-wrap gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => onOpen(project.id)}
            aria-haspopup="dialog"
            aria-label={`Case study: ${project.title}`}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-electric-cyan px-3 py-2 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
          >
            Case Study
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Case study modal                                                    */
/* ------------------------------------------------------------------ */

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function CaseStudyModal({
  project,
  onClose,
  onRequestBuild,
}: {
  project: Project;
  onClose: () => void;
  onRequestBuild: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const { caseStudy } = project;

  // Scroll lock, initial focus, focus restore.
  useLayoutEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const { body, documentElement } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      trigger?.focus?.({ preventScroll: true });
    };
  }, []);

  // Esc to close + Tab focus trap.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      const active = document.activeElement;

      if (!dialogRef.current?.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#020C1B]/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="glass animate-fade-in flex bg-slate-card/85 max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-b-none shadow-2xl shadow-black/50 sm:max-h-[88dvh] sm:rounded-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
          <div className="min-w-0 space-y-3">
            <CategoryTags categories={project.categories} />
            <h3 id={titleId} className="text-xl font-bold leading-snug text-white sm:text-2xl">
              {project.title}
            </h3>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-border text-muted-slate transition-colors hover:border-electric-cyan hover:text-electric-cyan"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 overflow-y-auto p-5 sm:p-6">
          <ModalSection icon={Target} title="Problem Statement">
            <p className="text-sm leading-relaxed text-muted-slate sm:text-base">
              {caseStudy.problem}
            </p>
          </ModalSection>

          <ModalSection icon={Puzzle} title="Architecture & Solution">
            <p className="text-sm leading-relaxed text-muted-slate sm:text-base">
              {caseStudy.solution}
            </p>
          </ModalSection>

          <ModalSection icon={Sparkles} title="Key Highlights / Impact">
            <ul className="space-y-2">
              {caseStudy.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300 sm:text-base">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-status"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </ModalSection>

          <ModalSection icon={Lightbulb} title="Tech Stack">
            <StackPills stack={project.stack} />
          </ModalSection>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 p-5 sm:p-6">
          <button type="button" onClick={onRequestBuild} className="btn-primary cursor-pointer">
            Request Similar Build
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <ProjectLinks project={project} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ModalSection({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-2.5 flex items-center gap-2 text-xs font-medium tracking-wide text-muted-slate">
        <Icon size={14} aria-hidden="true" />
        {title}
      </h4>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Showcase                                                            */
/* ------------------------------------------------------------------ */

export default function ProjectShowcase() {
  const [filter, setFilter] = useState<ProjectFilter>('All');
  const [openId, setOpenId] = useState<string | null>(null);
  // Keeps the grid from collapsing when switching to a filter with fewer cards.
  const [lockedHeight, setLockedHeight] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const flagships = projects.filter((p) => p.showcase === 'flagship');
  const proofProjects = projects.filter((p) => p.showcase === 'proof');
  const visible = proofProjects.filter((p) => matchesFilter(p, filter));
  const openProject = projects.find((p) => p.id === openId) ?? null;

  // Release the height lock when the viewport width changes (cards reflow).
  useEffect(() => {
    let width = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== width) {
        width = window.innerWidth;
        setLockedHeight(0);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const selectFilter = (next: ProjectFilter) => {
    if (next === filter) return;
    const current = gridRef.current?.offsetHeight ?? 0;
    setLockedHeight((prev) => Math.max(prev, current));
    setFilter(next);
  };

  const closeModal = useCallback(() => setOpenId(null), []);

  const requestBuild = useCallback(() => {
    setOpenId(null);
    // Wait for the modal to unmount and the scroll lock to release first.
    window.setTimeout(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document
        .getElementById('contact')
        ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', '#contact');
    }, 60);
  }, []);

  return (
    <div className="space-y-16">
      {/* Flagship mortgage AI systems */}
      <div>
        <header className="max-w-2xl">
          <p className="section-kicker">Flagship systems</p>
          <h2 className="section-heading mt-2">
            Flagship AI agents for mortgage brokers &amp; lending teams
          </h2>
          <p className="mt-3 text-muted-slate">
            Two production-shaped agents: document intake and 24/7 lead pre-qualification — examples of
            custom AI agent development services you can scope for your brokerage.
          </p>
        </header>
        <div className="mt-8 grid content-start gap-6 md:grid-cols-2">
          {flagships.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={setOpenId}
              badge="Flagship"
            />
          ))}
        </div>
      </div>

      {/* Engineering proof */}
      <div>
        <header className="max-w-2xl">
          <p className="section-kicker">Engineering &amp; automation proof</p>
          <h2 className="section-heading mt-2 !text-2xl sm:!text-3xl">
            SellerShield, Smart Page Monitor &amp; more
          </h2>
          <p className="mt-3 text-muted-slate">
            Prior shipped systems that prove the same Python / React delivery muscle behind the
            mortgage agents.
          </p>
        </header>

        <div
          role="group"
          aria-label="Filter proof projects by category"
          className="mt-8 flex flex-wrap gap-2.5"
        >
          {projectFilters.map((name) => {
            const count = proofProjects.filter((p) => matchesFilter(p, name)).length;
            const active = name === filter;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => selectFilter(name)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? 'border-transparent bg-electric-cyan text-navy'
                    : 'border-white/10 bg-slate-card text-muted-slate hover:border-white/25 hover:text-white'
                }`}
              >
                {name}
                <span
                  className={`inline-flex min-w-5 items-center justify-center rounded-md px-1.5 font-mono text-[11px] leading-5 ${
                    active ? 'bg-navy/20 text-navy' : 'bg-navy text-muted-slate'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
          {filter === 'All' ? '' : ` in ${filter}`}
        </p>

        <div
          ref={gridRef}
          style={{ minHeight: lockedHeight || undefined }}
          className="mt-8 grid content-start gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={setOpenId} badge="Proof" />
          ))}
        </div>
      </div>

      {openProject && (
        <CaseStudyModal project={openProject} onClose={closeModal} onRequestBuild={requestBuild} />
      )}
    </div>
  );
}
