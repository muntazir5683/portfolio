import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Briefcase,
  Check,
  Clock,
  Copy,
  FileText,
  Mail,
  Map,
  Sparkles,
} from 'lucide-react';
import {
  deliverableOptions,
  engagementTypes,
  profile,
  timelineOptions,
  type DeliverableOption,
  type EngagementType,
  type TimelineOption,
} from '../../data/portfolioData';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

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

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.23 0Z" />
    </svg>
  );
}

interface RoadmapPhase {
  title: string;
  detail: string;
  window: string;
}

function buildRoadmap(
  engagement: EngagementType,
  timeline: TimelineOption,
  features: DeliverableOption[],
): RoadmapPhase[] {
  const [lo, hi] = timeline.weeks;
  const featureNote =
    features.length > 0
      ? features.map((f) => f.label).join(', ')
      : 'core deliverables TBD after discovery';

  if (engagement.id === 'full-time') {
    return [
      {
        title: 'Intro & screening',
        detail: 'Share role context, preferred stack, and interview cadence.',
        window: timeline.id === 'urgent' ? 'Days 1–3' : 'Week 1',
      },
      {
        title: 'Technical deep-dive',
        detail: `Walk through relevant work (${featureNote}) and a practical take-home or live session.`,
        window: timeline.id === 'urgent' ? 'Days 3–7' : `Weeks 1–${Math.min(2, hi)}`,
      },
      {
        title: 'Offer & onboarding plan',
        detail: 'Align on start date, contract terms, and first-sprint goals.',
        window: timeline.id === 'flexible' ? `Weeks ${Math.max(2, lo)}–${hi}` : `Week ${hi}`,
      },
    ];
  }

  if (timeline.id === 'urgent') {
    return [
      {
        title: 'Scope lock (Day 1)',
        detail: `Confirm MVP for ${engagement.label}: ${featureNote}.`,
        window: 'Day 1',
      },
      {
        title: 'Build sprint',
        detail: 'Ship the highest-priority features with daily progress updates.',
        window: `Days 2–${Math.max(5, lo * 5)}`,
      },
      {
        title: 'QA & handoff',
        detail: 'Test, deploy, and deliver docs or walkthrough.',
        window: `Days ${Math.max(6, lo * 5)}–${hi * 7}`,
      },
    ];
  }

  if (timeline.id === 'standard') {
    return [
      {
        title: 'Discovery & architecture',
        detail: `Requirements, data sources, and stack choices for ${engagement.label}.`,
        window: 'Week 1',
      },
      {
        title: 'Core implementation',
        detail: `Build: ${featureNote}.`,
        window: `Weeks 2–${Math.max(3, hi - 1)}`,
      },
      {
        title: 'Polish, QA & launch',
        detail: 'Edge cases, deployment, and a short handover session.',
        window: `Week ${hi}`,
      },
    ];
  }

  // flexible / long-term
  return [
    {
      title: 'Kickoff & roadmap',
      detail: `Prioritize milestones for ${engagement.label} and set communication cadence.`,
      window: 'Week 1',
    },
    {
      title: 'Iterative delivery',
      detail: `Ship in phases: ${featureNote}.`,
      window: `Weeks 2–${Math.max(4, hi - 2)}`,
    },
    {
      title: 'Stabilization & growth',
      detail: 'Hardening, monitoring, and optional retainer for ongoing work.',
      window: `Weeks ${Math.max(5, hi - 2)}–${hi}+`,
    },
  ];
}

function buildBrief({
  engagement,
  timeline,
  features,
  name,
  contact,
  notes,
  roadmap,
}: {
  engagement: EngagementType;
  timeline: TimelineOption;
  features: DeliverableOption[];
  name: string;
  contact: string;
  notes: string;
  roadmap: RoadmapPhase[];
}): string {
  const featureLines =
    features.length > 0
      ? features.map((f) => `  - ${f.label}`).join('\n')
      : '  - (to be discussed)';

  const roadmapLines = roadmap
    .map((p, i) => `  ${i + 1}. ${p.title} (${p.window})\n     ${p.detail}`)
    .join('\n');

  return [
    `Inquiry — ${engagement.label} · ${timeline.label}`,
    '',
    `Hi ${profile.name.split(' ').slice(-1)[0]},`,
    '',
    `I'd like to discuss a ${engagement.label.toLowerCase()} opportunity.`,
    '',
    `Timeline: ${timeline.label}`,
    'Key deliverables:',
    featureLines,
    '',
    'Proposed delivery roadmap:',
    roadmapLines,
    '',
    `From: ${name.trim() || '(name)'}`,
    `Contact: ${contact.trim() || '(email / WhatsApp)'}`,
    notes.trim() ? `\nNotes:\n${notes.trim()}` : '',
    '',
    '— Sent from syedmuntazir portfolio contact form',
  ]
    .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
    .join('\n')
    .trim();
}

const fieldClass =
  'w-full rounded-lg border border-slate-border bg-navy px-3 py-2.5 text-sm text-white placeholder:text-muted-slate/60 focus:border-electric-cyan focus:outline-none';

const pillBase =
  'inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-left text-sm font-medium transition-colors';

const pillActive = 'border-transparent bg-electric-cyan text-navy';
const pillIdle =
  'border-white/10 bg-slate-card text-muted-slate hover:border-white/25 hover:text-white';

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function SmartContactEstimator() {
  const [engagementId, setEngagementId] = useState(engagementTypes[0]!.id);
  const [timelineId, setTimelineId] = useState(timelineOptions[1]!.id);
  const [featureIds, setFeatureIds] = useState<string[]>(['python-backend', 'react-frontend']);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copyTimer = useRef<number | null>(null);

  const engagement = engagementTypes.find((e) => e.id === engagementId) ?? engagementTypes[0]!;
  const timeline = timelineOptions.find((t) => t.id === timelineId) ?? timelineOptions[0]!;
  const features = deliverableOptions.filter((d) => featureIds.includes(d.id));

  const roadmap = useMemo(
    () => buildRoadmap(engagement, timeline, features),
    [engagement, timeline, features],
  );

  const brief = useMemo(
    () =>
      buildBrief({
        engagement,
        timeline,
        features,
        name,
        contact,
        notes,
        roadmap,
      }),
    [engagement, timeline, features, name, contact, notes, roadmap],
  );

  const subject = `Inquiry — ${engagement.label} · ${timeline.label}`;
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`;

  const github = profile.socials.find((s) => s.id === 'github');
  const linkedin = profile.socials.find((s) => s.id === 'linkedin');
  const fiverr = profile.socials.find((s) => s.id === 'fiverr');
  const hasEmail = profile.email.trim().length > 0;

  const toggleFeature = (id: string) => {
    setFeatureIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleCopy = useCallback(async () => {
    const ok = await copyText(brief);
    setCopyState(ok ? 'copied' : 'failed');
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 2000);
  }, [brief]);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* ---------------- Builder ---------------- */}
      <div className="space-y-7 lg:col-span-3">
        {/* Engagement */}
        <fieldset>
          <legend className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-muted-slate">
            <Briefcase size={14} aria-hidden="true" /> What do you need?
          </legend>
          <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Engagement type">
            {engagementTypes.map((type) => {
              const active = type.id === engagementId;
              return (
                <button
                  key={type.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setEngagementId(type.id)}
                  className={`card cursor-pointer p-4 text-left ${
                    active ? 'border-white/25! bg-white/[0.04]' : 'card-hover'
                  }`}
                >
                  <span className="block text-sm font-semibold text-white">{type.label}</span>
                  <span className="mt-1 block text-xs text-muted-slate">{type.description}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Timeline */}
        <fieldset>
          <legend className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-muted-slate">
            <Clock size={14} aria-hidden="true" /> Timeline
          </legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Estimated timeline">
            {timelineOptions.map((opt) => {
              const active = opt.id === timelineId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTimelineId(opt.id)}
                  className={`${pillBase} ${active ? pillActive : pillIdle}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Deliverables */}
        <fieldset>
          <legend className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-muted-slate">
            <Sparkles size={14} aria-hidden="true" /> Features needed
          </legend>
          <div className="flex flex-wrap gap-2">
            {deliverableOptions.map((opt) => {
              const active = featureIds.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleFeature(opt.id)}
                  className={`${pillBase} ${active ? pillActive : pillIdle}`}
                >
                  {active && <Check size={14} aria-hidden="true" />}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Contact */}
        <fieldset className="space-y-3">
          <legend className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-muted-slate">
            <Mail size={14} aria-hidden="true" /> Your details
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-muted-slate">
              Name
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={`mt-1.5 ${fieldClass}`}
              />
            </label>
            <label className="block text-sm text-muted-slate">
              Email / WhatsApp
              <input
                type="text"
                name="contact"
                autoComplete="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="you@company.com or +92…"
                className={`mt-1.5 ${fieldClass}`}
              />
            </label>
          </div>
          <label className="block text-sm text-muted-slate">
            Project / role description
            <textarea
              name="notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What are you hiring for or building? Stack preferences, must-haves, constraints…"
              className={`mt-1.5 resize-y ${fieldClass}`}
            />
          </label>
        </fieldset>
      </div>

      {/* ---------------- Live summary + brief ---------------- */}
      <div className="space-y-6 lg:col-span-2">
        <div className="card p-5 sm:p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Map size={16} className="text-muted-slate" aria-hidden="true" />
            Scope summary
          </h3>
          <p className="mt-2 text-xs text-muted-slate">
            Rough plan from your selections — not a formal quote.
          </p>

          <dl className="mt-4 space-y-2 border-b border-white/[0.08] pb-4 text-xs">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-slate">Type</dt>
              <dd className="text-right text-white">{engagement.label}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-slate">Timeline</dt>
              <dd className="text-right text-white">{timeline.label}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-slate">Features</dt>
              <dd className="text-right text-white">{features.length || '—'}</dd>
            </div>
          </dl>

          <ol className="mt-4 space-y-3">
            {roadmap.map((phase, i) => (
              <li key={phase.title} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-white/15 font-mono text-[11px] text-muted-slate">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-sm font-medium text-white">{phase.title}</span>
                    <span className="font-mono text-[11px] text-muted-slate">{phase.window}</span>
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-slate">
                    {phase.detail}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-border bg-[#020C1B]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-border px-4 py-2.5">
            <span className="flex items-center gap-2 text-xs text-muted-slate">
              <FileText size={14} aria-hidden="true" /> Brief preview
            </span>
            <span className="text-[11px] text-muted-slate">editable after copy</span>
          </div>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[12px] leading-relaxed text-slate-300">
            {brief}
          </pre>
        </div>

        <div className="flex flex-col gap-2.5">
          <button type="button" onClick={handleCopy} className="btn-primary cursor-pointer">
            {copyState === 'copied' ? (
              <Check size={18} aria-hidden="true" />
            ) : (
              <Copy size={18} aria-hidden="true" />
            )}
            <span aria-live="polite">
              {copyState === 'copied'
                ? 'Copied!'
                : copyState === 'failed'
                  ? 'Copy failed — try again'
                  : 'Copy brief'}
            </span>
          </button>

          {hasEmail && (
            <a href={mailto} className="btn-outline">
              <Mail size={18} aria-hidden="true" />
              Email brief
            </a>
          )}

          <div className="flex flex-wrap gap-2.5">
            {github && (
              <a
                href={github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-[8.5rem] flex-1 items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-white/25"
              >
                <GitHubIcon /> GitHub
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-[8.5rem] flex-1 items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-white/25"
              >
                <LinkedInIcon /> LinkedIn
              </a>
            )}
            {fiverr && (
              <a
                href={fiverr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-[8.5rem] flex-1 items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-white/25"
              >
                <Briefcase size={16} aria-hidden="true" /> Fiverr
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
