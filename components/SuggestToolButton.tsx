'use client';
import { useState, useEffect } from 'react';
import { SuggestToolForm } from './SuggestTool';

export function SuggestToolButton({ sourcePage }: { sourcePage: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-6 z-40 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all hover:shadow-teal-500/25 hover:shadow-xl"
      >
        💡 Suggest a tool
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)} />
          {/* Modal — on mobile: bottom sheet; on desktop: centered */}
          <div className="fixed z-50 inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-[var(--bg-card)] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl">
            <div className="text-center mb-5">
              <span className="text-2xl">🛠️</span>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mt-1">Suggest a tool</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">What financial calculator do you wish existed?</p>
            </div>
            <SuggestToolForm sourcePage={sourcePage} onSuccess={() => setTimeout(() => setOpen(false), 2000)} />
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-xl">✕</button>
          </div>
        </>
      )}
    </>
  );
}
