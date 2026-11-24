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

  const visible = projects.filter((p) => matchesFilter(p, filter));
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
    <div>
      {/* Filter pills */}
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2.5">
        {projectFilters.map((name) => {
          const count = projects.filter((p) => matchesFilter(p, name)).length;
          const active = name === filter;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={active}
              onClick={() => selectFilter(name)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                active
                  ? 'border-transparent bg-electric-cyan text-navy'
                  : 'border-white/10 bg-slate-card text-muted-slate hover:border-white/25 hover:text-white'
              }`}
            >
              {name}
              <span
                className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-[11px] leading-5 ${
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

      {/* Cards */}
      <div
        ref={gridRef}
        style={{ minHeight: lockedHeight || undefined }}
        className="mt-8 grid content-start gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((project) => (
          <article
            key={project.id}
            className="card card-hover animate-fade-in flex flex-col gap-4 p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <CategoryTags categories={project.categories} />
              {project.featured && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-muted-slate">
                  <Star size={11} aria-hidden="true" /> Featured
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold leading-snug text-white">{project.title}</h3>
              <p className="text-sm leading-relaxed text-muted-slate">{project.summary}</p>
            </div>

            <StackPills stack={project.stack} />

            <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setOpenId(project.id)}
                aria-haspopup="dialog"
                aria-label={`Case study: ${project.title}`}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-electric-cyan px-3 py-2 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
              >
                Case Study
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <ProjectLinks project={project} />
            </div>
          </article>
        ))}
      </div>

      {openProject && (
        <CaseStudyModal project={openProject} onClose={closeModal} onRequestBuild={requestBuild} />
      )}
    </div>
  );
}
