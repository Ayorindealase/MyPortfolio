'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: messages.length > 1 ? 'smooth' : 'auto',
    });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: 'assistant', content: '' }]);
    setInput('');
    setIsLoading(true);

    try {
      abortRef.current = new AbortController();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const errText = await res.text();
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: errText || 'Error — please try again.' } : m)
        );
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: accumulated } : m)
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: 'Connection error — please try again.' } : m)
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed z-[10000] h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          bottom: 44,
          right: 24,
          background: open
            ? 'linear-gradient(180deg, rgba(0,243,255,0.28), rgba(0,243,255,0.12))'
            : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.24), transparent 24%), linear-gradient(180deg, rgba(0,243,255,0.28), rgba(0,243,255,0.10))',
          border: '1px solid rgba(0,243,255,0.62)',
          boxShadow: open
            ? '0 18px 48px rgba(0,243,255,0.28), 0 0 42px rgba(0,243,255,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)'
            : '0 20px 52px rgba(0,243,255,0.24), 0 0 54px rgba(0,243,255,0.34), inset 0 0 0 1px rgba(255,255,255,0.1)',
          color: 'var(--cyan)',
          backdropFilter: 'blur(16px)',
        }}
        title="Ask the Architect"
      >
        {!open && (
          <>
            <span className="absolute inset-0 rounded-full animate-ai-beacon pointer-events-none" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green animate-pulse-glow pointer-events-none" />
          </>
        )}
        <span
          className="relative z-10 font-mono-hud text-[16px] tracking-[0.18em]"
          style={{ textShadow: '0 0 16px rgba(0,243,255,0.95)' }}
        >
          {open ? '×' : 'AI'}
        </span>
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.08),rgba(3,3,8,0.82)_58%)] backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="hud-card pointer-events-auto relative flex w-full max-w-[460px] flex-col overflow-hidden"
              style={{
                height: 'min(620px, calc(100dvh - 32px))',
                maxHeight: 'min(620px, calc(100dvh - 32px))',
                background: 'linear-gradient(180deg, rgba(8,10,18,0.94), rgba(5,7,14,0.96))',
                boxShadow: '0 40px 120px rgba(0,0,0,0.55)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(0,243,255,0.14),transparent_65%)] pointer-events-none" />
              {/* Header */}
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div>
                  <div className="font-mono-hud text-[12px] tracking-[0.22em] text-cyan uppercase">Ask The Architect</div>
                  <div className="mt-1 font-mono-hud text-[10px] text-[var(--text-dim)] tracking-[0.14em] uppercase">AI Co-Pilot Online</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full animate-pulse-glow" style={{ backgroundColor: 'var(--green)' }} />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="font-mono-hud text-[14px] leading-none"
                    style={{ color: 'var(--text-dim)' }}
                    aria-label="Close chat"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-5 space-y-3 overscroll-contain">
                {messages.length === 0 && (
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-5 text-center">
                    <div className="font-mono-hud text-[11px] tracking-[0.22em] uppercase text-cyan">Prompt Ideas</div>
                    <div className="mt-3 font-body text-[15px] leading-7 text-[var(--text)]">
                      Ask about Ayorinde&apos;s research, publications, leadership work, or the systems he builds.
                    </div>
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className="max-w-[85%] rounded-2xl px-4 py-3 font-body text-[15px] leading-7"
                      style={{
                        background: m.role === 'user' ? 'rgba(255,184,0,0.12)' : 'rgba(0,243,255,0.08)',
                        border: `1px solid ${m.role === 'user' ? 'rgba(255,184,0,0.28)' : 'rgba(0,243,255,0.18)'}`,
                        color: 'var(--text)',
                      }}
                    >
                      {m.content || (m.role === 'assistant' && isLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : '')}
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'assistant' && !messages[messages.length - 1]?.content && (
                  <div className="flex justify-start">
                    <div
                      className="px-3 py-2 rounded-sm"
                      style={{ background: 'rgba(0,243,255,0.08)', border: '1px solid rgba(0,243,255,0.2)' }}
                    >
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: 'var(--cyan)',
                              animation: `blink 1s step-end infinite ${i * 0.2}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center px-4 py-3 gap-3">
                  <span className="font-mono-hud text-[12px] text-cyan">{'>'}</span>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent font-body text-[15px] text-white placeholder:text-[var(--text-dim)] outline-none"
                    style={{ caretColor: 'var(--cyan)' }}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="font-mono-hud text-[10px] tracking-[0.18em] px-3 py-2 rounded-full transition-all"
                    style={{
                      color: input.trim() ? 'var(--cyan)' : 'var(--text-dim)',
                      border: `1px solid ${input.trim() ? 'rgba(0,243,255,0.45)' : 'rgba(255,255,255,0.08)'}`,
                      background: input.trim() ? 'rgba(0,243,255,0.08)' : 'transparent',
                    }}
                  >
                    SEND
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
