import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  Braces,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  FileSearch,
  Gauge,
  Loader2,
  MessageSquare,
  Pill,
  Play,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Timer,
  type LucideIcon,
} from 'lucide-react';
import {
  workflowPresets,
  type LogLevel,
  type WorkflowLog,
  type WorkflowPreset,
} from '../../data/portfolioData';

/* ------------------------------------------------------------------ */
/* Config & helpers                                                    */
/* ------------------------------------------------------------------ */

/** Real animation time for a full run (within the 2–3s target). Simulated latency is scaled to this. */
const TARGET_MS = 2600;
const TICK_MS = 50;

type RunStatus = 'idle' | 'running' | 'done';
type StepState = 'idle' | 'running' | 'done';

interface LogEntry extends WorkflowLog {
  id: number;
  time: string;
}

const presetIcons: Record<WorkflowPreset['icon'], LucideIcon> = {
  FileSearch,
  ShieldCheck,
  MessageSquare,
  Pill,
};

const logStyles: Record<LogLevel, { tag: string; text: string }> = {
  info: { tag: 'INFO', text: 'text-slate-300' },
  success: { tag: ' OK ', text: 'text-emerald-status' },
  warn: { tag: 'WARN', text: 'text-amber-300' },
  error: { tag: 'ERR ', text: 'text-red-400' },
};

const pad = (n: number, len = 2) => String(n).padStart(len, '0');

function timestamp(): string {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}

const setAt = <T,>(arr: T[], index: number, value: T): T[] =>
  arr.map((item, i) => (i === index ? value : item));

/** Tokenizes JSON text into colored spans (keys / strings / numbers / literals) without innerHTML. */
function highlightJson(json: string): ReactNode[] {
  const re =
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(json)) !== null) {
    if (match.index > last) nodes.push(json.slice(last, match.index));
    const [, str, colon, literal] = match;

    if (str !== undefined) {
      if (colon !== undefined) {
        nodes.push(
          <span key={key++} className="text-sky-300">
            {str}
          </span>,
          colon,
        );
      } else {
        nodes.push(
          <span key={key++} className="text-emerald-status">
            {str}
          </span>,
        );
      }
    } else if (literal !== undefined) {
      nodes.push(
        <span key={key++} className="text-violet-300">
          {match[0]}
        </span>,
      );
    } else {
      nodes.push(
        <span key={key++} className="text-amber-300">
          {match[0]}
        </span>,
      );
    }
    last = re.lastIndex;
  }
  if (last < json.length) nodes.push(json.slice(last));
  return nodes;
}

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

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function AutomationSandbox() {
  const [activeId, setActiveId] = useState(workflowPresets[0]?.id ?? '');
  const [status, setStatus] = useState<RunStatus>('idle');
  const [stepStates, setStepStates] = useState<StepState[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const timeouts = useRef<number[]>([]);
  const interval = useRef<number | null>(null);
  const startedAt = useRef(0);
  const logId = useRef(0);
  const copyTimer = useRef<number | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const preset = workflowPresets.find((p) => p.id === activeId) ?? workflowPresets[0];

  const clearTimers = useCallback(() => {
    timeouts.current.forEach((t) => window.clearTimeout(t));
    timeouts.current = [];
    if (interval.current !== null) {
      window.clearInterval(interval.current);
      interval.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      clearTimers();
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    },
    [clearTimers],
  );

  useEffect(() => {
    const el = terminalRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  const reset = useCallback(() => {
    clearTimers();
    setStatus('idle');
    setStepStates([]);
    setLogs([]);
    setElapsed(0);
    setCopyState('idle');
  }, [clearTimers]);

  const selectPreset = useCallback(
    (id: string) => {
      if (id === activeId) return;
      reset();
      setActiveId(id);
    },
    [activeId, reset],
  );

  const run = useCallback(() => {
    if (!preset) return;
    clearTimers();

    const { steps } = preset;
    const totalLatency = steps.reduce((sum, s) => sum + s.latencyMs, 0);
    const scale = TARGET_MS / totalLatency;

    setStatus('running');
    setStepStates(steps.map(() => 'idle'));
    setLogs([]);
    setElapsed(0);
    setCopyState('idle');

    startedAt.current = performance.now();
    interval.current = window.setInterval(() => {
      setElapsed(Math.min(performance.now() - startedAt.current, TARGET_MS));
    }, TICK_MS);

    const at = (ms: number, fn: () => void) => {
      timeouts.current.push(window.setTimeout(fn, Math.max(0, ms)));
    };
    const pushLog = (log: WorkflowLog) =>
      setLogs((prev) => [...prev, { ...log, id: ++logId.current, time: timestamp() }]);

    let cursor = 0;
    at(0, () => pushLog({ level: 'info', message: `Pipeline started: ${preset.title}` }));

    steps.forEach((step, i) => {
      const duration = step.latencyMs * scale;

      at(cursor, () => {
        setStepStates((prev) => setAt(prev, i, 'running'));
        pushLog({
          level: 'info',
          message: `▶ [${i + 1}/${steps.length}] ${step.label}`,
        });
      });

      step.logs.forEach((log, k) => {
        at(cursor + (duration * (k + 1)) / (step.logs.length + 1), () => pushLog(log));
      });

      at(cursor + duration, () => {
        setStepStates((prev) => setAt(prev, i, 'done'));
        pushLog({
          level: 'success',
          message: `✔ ${step.label} completed in ${step.latencyMs} ms`,
        });
      });

      cursor += duration;
    });

    at(cursor + 120, () => {
      if (interval.current !== null) {
        window.clearInterval(interval.current);
        interval.current = null;
      }
      setElapsed(TARGET_MS);
      setStatus('done');
      pushLog({
        level: 'success',
        message: `Pipeline finished — ${totalLatency} ms total, output ready`,
      });
    });
  }, [preset, clearTimers]);

  const handleCopy = useCallback(async () => {
    if (!preset) return;
    const ok = await copyText(JSON.stringify(preset.output, null, 2));
    setCopyState(ok ? 'copied' : 'failed');
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 2000);
  }, [preset]);

  const handleTabKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = workflowPresets.findIndex((p) => p.id === activeId);
    let next = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % workflowPresets.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = (index - 1 + workflowPresets.length) % workflowPresets.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = workflowPresets.length - 1;
    else return;

    e.preventDefault();
    const target = workflowPresets[next];
    if (target) {
      selectPreset(target.id);
      tabRefs.current[next]?.focus();
    }
  };

  if (!preset) return null;

  const totalLatency = preset.steps.reduce((sum, s) => sum + s.latencyMs, 0);
  const progress = status === 'done' ? 1 : Math.min(elapsed / TARGET_MS, 1);
  const liveLatency = Math.round(progress * totalLatency);
  const easedProgress = 1 - (1 - progress) ** 2;
  const liveMetric = status === 'idle' ? null : (preset.metric.value * easedProgress).toFixed(1);
  const completedSteps = stepStates.filter((s) => s === 'done').length;
  const isRunning = status === 'running';
  const jsonText = JSON.stringify(preset.output, null, 2);

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
      {/* -------- Left: workflow selector + ROI -------- */}
      <div className="space-y-4 lg:col-span-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-slate">
            Live system simulator
          </p>
          <span className="tag-mono !text-[10px]">{workflowPresets.length} pipelines</span>
        </div>

        <div
          role="tablist"
          aria-label="Automation workflows"
          className="flex flex-col gap-3"
          onKeyDown={handleTabKeys}
        >
          {workflowPresets.map((p, i) => {
            const Icon = presetIcons[p.icon];
            const selected = p.id === preset.id;
            return (
              <button
                key={p.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`tab-${p.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="sandbox-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => selectPreset(p.id)}
                className={`card flex min-w-0 cursor-pointer flex-col gap-2.5 p-4 text-left transition-all ${
                  selected
                    ? 'border-white/25! bg-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : 'hover:-translate-y-0.5 hover:border-white/18'
                }`}
              >
                <span className="flex min-w-0 items-start gap-3">
                  <span
                    className={`inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-white/10 ${
                      selected ? 'bg-white/[0.06] text-electric-cyan' : 'text-muted-slate'
                    }`}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block break-words text-sm font-semibold leading-snug text-white">
                      {p.title}
                    </span>
                    <span className="mt-1 block break-words font-mono text-[11px] text-muted-slate">
                      {p.tagline}
                    </span>
                  </span>
                </span>
                <span className="inline-flex w-fit items-center rounded-md border border-emerald-status/25 bg-emerald-status/10 px-2 py-1 font-mono text-[11px] text-emerald-status">
                  {p.roi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* -------- Right: macOS simulator window -------- */}
      <div
        id="sandbox-panel"
        role="tabpanel"
        aria-labelledby={`tab-${preset.id}`}
        className="overflow-hidden rounded-xl border border-white/[0.09] bg-[#0c1220] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:col-span-8"
      >
        {/* Chrome */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="size-2.5 rounded-full bg-[#28c840]/80" />
            <span className="ml-2 hidden font-mono text-[11px] text-muted-slate sm:inline">
              simulator — {preset.id}.run
            </span>
          </div>
          <span
            className={`font-mono text-[11px] ${
              isRunning ? 'text-electric-cyan' : status === 'done' ? 'text-emerald-status' : 'text-muted-slate'
            }`}
          >
            {isRunning ? '● running' : status === 'done' ? '● complete' : '○ idle'}
          </span>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          {/* Header + actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
              <p className="text-sm leading-relaxed text-muted-slate">{preset.description}</p>
              <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-white/[0.08] bg-navy/70 px-3 py-2 font-mono text-[11px] text-emerald-status sm:text-xs">
                <span className="select-none text-muted-slate">$ </span>
                {preset.input.value}
              </pre>
              <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
                {preset.stack.map((tech) => (
                  <li key={tech} className="tag-mono">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={run}
                disabled={isRunning}
                className="btn-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:transform-none"
              >
                {isRunning ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Play size={16} aria-hidden="true" />
                )}
                {isRunning ? 'Running…' : status === 'done' ? 'Run again' : 'Run demo'}
              </button>
              <button
                type="button"
                onClick={reset}
                disabled={status === 'idle'}
                className="btn-glass cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw size={16} aria-hidden="true" />
                Reset
              </button>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="mb-2 flex items-center justify-between text-[11px] text-muted-slate">
              <span className="flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <Cpu size={12} aria-hidden="true" /> Pipeline
              </span>
              <span className="font-mono">
                {completedSteps}/{preset.steps.length} · {status === 'idle' ? '—' : `${liveLatency} ms`}
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-navy"
              role="progressbar"
              aria-label="Pipeline progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
            >
              <div
                className="h-full origin-left rounded-full bg-gradient-to-r from-electric-cyan/80 to-emerald-status/80 transition-transform duration-100"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          </div>

          {/* Animated pipeline nodes */}
          <ol className="flex flex-wrap gap-2" aria-label="Pipeline nodes">
            {preset.steps.map((step, i) => {
              const state = stepStates[i] ?? 'idle';
              return (
                <li
                  key={step.id}
                  aria-current={state === 'running' ? 'step' : undefined}
                  className={`flex min-w-0 flex-1 basis-[calc(50%-0.25rem)] items-center gap-2 rounded-lg border px-2.5 py-2 transition-all duration-300 sm:basis-0 ${
                    state === 'running'
                      ? 'border-electric-cyan/40 bg-electric-cyan/10 shadow-[0_0_20px_rgba(56,189,248,0.12)]'
                      : state === 'done'
                        ? 'border-emerald-status/30 bg-emerald-status/5'
                        : 'border-white/[0.07] bg-navy/50'
                  }`}
                >
                  <span className="shrink-0">
                    {state === 'done' ? (
                      <CheckCircle2 size={14} className="text-emerald-status" aria-hidden="true" />
                    ) : state === 'running' ? (
                      <Loader2 size={14} className="animate-spin text-electric-cyan" aria-hidden="true" />
                    ) : (
                      <span className="flex size-3.5 items-center justify-center rounded-full border border-white/15 font-mono text-[9px] text-muted-slate">
                        {i + 1}
                      </span>
                    )}
                  </span>
                  <span
                    className={`min-w-0 truncate text-[11px] font-medium sm:text-xs ${
                      state === 'idle' ? 'text-muted-slate' : 'text-white'
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* Metrics + terminal */}
          <div className="grid gap-4 sm:grid-cols-5">
            <div className="grid grid-cols-2 gap-2 sm:col-span-2 sm:grid-cols-1 sm:gap-3">
              <div className="rounded-lg border border-white/[0.08] bg-navy/60 p-3">
                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-slate">
                  <Timer size={11} aria-hidden="true" /> Latency
                </p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-white">
                  {status === 'idle' ? '—' : liveLatency}
                  <span className="ml-1 text-[10px] font-normal text-muted-slate">ms</span>
                </p>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-navy/60 p-3">
                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-slate">
                  <Gauge size={11} aria-hidden="true" /> {preset.metric.label}
                </p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-white">
                  {liveMetric ?? '—'}
                  {liveMetric !== null && (
                    <span className="ml-0.5 text-[10px] font-normal text-muted-slate">%</span>
                  )}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#060a12] sm:col-span-3">
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-1.5">
                <Terminal size={11} className="text-muted-slate" aria-hidden="true" />
                <span className="font-mono text-[10px] text-muted-slate">pipeline.log</span>
              </div>
              <div
                ref={terminalRef}
                role="log"
                aria-live="off"
                aria-label="Pipeline execution logs"
                className="h-44 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed sm:h-52 sm:text-xs"
              >
                {logs.length === 0 ? (
                  <p className="text-muted-slate">
                    <span className="text-white/40">$</span> awaiting run…
                  </p>
                ) : (
                  logs.map((log) => {
                    const style = logStyles[log.level];
                    return (
                      <div key={log.id} className="flex gap-2 break-words">
                        <span className="shrink-0 text-muted-slate/50">{log.time}</span>
                        <span className={`shrink-0 ${style.text}`}>[{style.tag}]</span>
                        <span className={`min-w-0 ${style.text}`}>{log.message}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* JSON output */}
          {status === 'done' && (
            <div className="animate-fade-in overflow-hidden rounded-lg border border-emerald-status/25 bg-[#060a12]">
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-3 py-2">
                <span className="flex items-center gap-2 font-mono text-[11px] text-emerald-status">
                  <Braces size={12} aria-hidden="true" /> output.json
                  <CheckCircle2 size={12} aria-hidden="true" />
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-white/12 px-2.5 py-1 font-mono text-[11px] text-white transition-colors hover:border-white/25"
                >
                  {copyState === 'copied' ? (
                    <Check size={12} className="text-emerald-status" aria-hidden="true" />
                  ) : (
                    <Copy size={12} aria-hidden="true" />
                  )}
                  <span aria-live="polite">
                    {copyState === 'copied' ? 'Copied!' : copyState === 'failed' ? 'Failed' : 'Copy'}
                  </span>
                </button>
              </div>
              <pre className="max-h-56 overflow-auto p-3 font-mono text-[11px] leading-relaxed text-slate-300 sm:text-xs">
                <code>{highlightJson(jsonText)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
