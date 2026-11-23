import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  ArrowUp,
  Bot,
  MessageCircle,
  Sparkles,
  X,
} from 'lucide-react';
import {
  assistantKnowledge,
  type AssistantIntent,
  type PortfolioSection,
} from '../../data/portfolioData';

/* ------------------------------------------------------------------ */
/* Matching & formatting                                               */
/* ------------------------------------------------------------------ */

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  sections?: PortfolioSection[];
  followUps?: string[];
}

const SECTION_LABELS: Record<PortfolioSection, string> = {
  '#projects': 'Projects',
  '#automations': 'Automations',
  '#contact': 'Contact',
  '#experience': 'Experience',
};

/** Score an intent by how many of its keywords appear in the query. */
function matchIntent(query: string): AssistantIntent | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  let best: AssistantIntent | null = null;
  let bestScore = 0;

  for (const intent of assistantKnowledge.intents) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (q.includes(kw.toLowerCase())) {
        // Longer keywords weigh more so "pakgovjobs" beats "job".
        score += kw.length;
      }
    }
    // Exact chip match wins outright.
    if (intent.chip && intent.chip.toLowerCase() === q) score += 1000;
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  return bestScore > 0 ? best : null;
}

/** Parse [[#projects|Explore Projects]] markers into React nodes with links. */
function formatAnswer(text: string, onJump: (href: string) => void): ReactNode[] {
  const re = /\[\[(#[\w-]+)\|([^\]]+)\]\]/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(...splitParagraphs(text.slice(last, match.index), key));
    const [, href, label] = match;
    nodes.push(
      <button
        key={`link-${key++}`}
        type="button"
        onClick={() => onJump(href!)}
        className="inline cursor-pointer font-medium text-electric-cyan underline decoration-electric-cyan/40 underline-offset-2 transition-colors hover:text-white"
      >
        {label}
      </button>,
    );
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(...splitParagraphs(text.slice(last), key));
  return nodes;
}

function splitParagraphs(chunk: string, keyBase: number): ReactNode[] {
  if (!chunk) return [];
  // Preserve newlines as <br /> so multi-paragraph answers stay readable.
  return chunk.split('\n').flatMap((line, i, arr) => {
    const nodes: ReactNode[] = [<span key={`t-${keyBase}-${i}`}>{line}</span>];
    if (i < arr.length - 1) nodes.push(<br key={`br-${keyBase}-${i}`} />);
    return nodes;
  });
}

function jumpTo(href: string, close?: () => void) {
  close?.();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Let the drawer close (and any mobile overlay clear) before scrolling.
  window.setTimeout(() => {
    document
      .querySelector(href)
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', href);
  }, close ? 80 : 0);
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function AiPortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: 'assistant',
      text: assistantKnowledge.greeting,
      sections: ['#projects', '#automations', '#contact'],
    },
  ]);

  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const chips = assistantKnowledge.intents.filter((i) => i.chip).map((i) => i.chip!);

  const close = useCallback(() => {
    setOpen(false);
    // Restore focus to the launcher after the panel unmounts.
    window.setTimeout(() => toggleRef.current?.focus(), 0);
  }, []);

  const ask = useCallback((question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const intent = matchIntent(trimmed);
    const reply: ChatMessage = intent
      ? {
          id: nextId.current++,
          role: 'assistant',
          text: intent.answer,
          sections: intent.sections,
          followUps: intent.followUps,
        }
      : {
          id: nextId.current++,
          role: 'assistant',
          text: assistantKnowledge.fallback,
          sections: ['#contact'],
        };

    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, role: 'user', text: trimmed },
      reply,
    ]);
    setInput('');
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  // Auto-scroll chat to the newest message.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // Focus the input when the drawer opens.
  useLayoutEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Esc closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  const handleJump = useCallback(
    (href: string) => jumpTo(href, close),
    [close],
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-end gap-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
      {/* Drawer */}
      {open && (
        <div
          ref={panelRef}
          id="ai-assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="pointer-events-auto flex max-h-[min(34rem,calc(100dvh-7.5rem))] w-[min(100%,24rem)] max-w-full flex-col overflow-hidden rounded-2xl border border-[#233554] bg-[#112240]/95 shadow-2xl shadow-black/50 backdrop-blur-md animate-fade-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[#233554] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="relative inline-flex size-9 items-center justify-center rounded-full bg-electric-cyan/15 text-electric-cyan">
                <Bot size={18} aria-hidden="true" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-slate-card bg-emerald-status" />
              </span>
              <div>
                <h2 id={titleId} className="text-sm font-semibold text-white">
                  {assistantKnowledge.name}
                </h2>
                <p className="font-mono text-[11px] text-muted-slate">Online · instant answers</p>
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close assistant"
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-slate-border text-muted-slate transition-colors hover:border-electric-cyan hover:text-electric-cyan"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-md bg-electric-cyan text-navy'
                      : 'rounded-bl-md border border-slate-border bg-navy/60 text-slate-200'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <>
                      <div>{formatAnswer(msg.text, handleJump)}</div>
                      {msg.sections && msg.sections.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {msg.sections.map((section) => (
                            <button
                              key={section}
                              type="button"
                              onClick={() => handleJump(section)}
                              className="cursor-pointer rounded-md border border-slate-border bg-slate-card px-2 py-0.5 font-mono text-[11px] text-electric-cyan transition-colors hover:border-electric-cyan"
                            >
                              {SECTION_LABELS[section]}
                            </button>
                          ))}
                        </div>
                      )}
                      {msg.followUps && msg.followUps.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {msg.followUps.map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => ask(chip)}
                              className="cursor-pointer rounded-full border border-electric-cyan/30 px-2.5 py-1 text-[11px] text-electric-cyan transition-colors hover:bg-electric-cyan/10"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Prompt chips — show when the conversation is still short */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 border-t border-[#233554] px-4 py-3">
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => ask(chip)}
                  className="cursor-pointer rounded-full border border-slate-border bg-navy/40 px-2.5 py-1 text-left text-[11px] text-muted-slate transition-colors hover:border-electric-cyan hover:text-electric-cyan"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t border-[#233554] p-3"
          >
            <label className="sr-only" htmlFor="assistant-input">
              Ask a question
            </label>
            <input
              ref={inputRef}
              id="assistant-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, stack, hiring…"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-lg border border-slate-border bg-navy px-3 py-2.5 text-sm text-white placeholder:text-muted-slate/60 focus:border-electric-cyan focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-electric-cyan text-navy transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp size={18} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}

      {/* Launcher */}
      <button
        ref={toggleRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls="ai-assistant-panel"
        aria-label={open ? 'Close AI assistant' : 'Open AI portfolio assistant'}
        className="pointer-events-auto group relative inline-flex size-14 cursor-pointer items-center justify-center rounded-full bg-electric-cyan text-navy shadow-lg shadow-electric-cyan/20 transition-transform hover:scale-105"
      >
        {/* Subtle pulse ring */}
        {!open && (
          <span
            className="absolute inset-0 animate-ping rounded-full bg-electric-cyan/40"
            aria-hidden="true"
          />
        )}
        <span className="relative flex items-center justify-center">
          {open ? (
            <X size={22} aria-hidden="true" />
          ) : (
            <>
              <Bot size={22} className="group-hover:hidden" aria-hidden="true" />
              <Sparkles size={22} className="hidden group-hover:block" aria-hidden="true" />
              <MessageCircle
                size={12}
                className="absolute -bottom-0.5 -right-1 text-navy"
                aria-hidden="true"
              />
            </>
          )}
        </span>
      </button>
    </div>
  );
}
