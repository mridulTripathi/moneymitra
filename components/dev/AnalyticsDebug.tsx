"use client";
import { useEffect, useState } from "react";

interface TrackCall { event: string; data?: Record<string, string | number>; ts: number }

export default function AnalyticsDebug() {
  const [calls, setCalls] = useState<TrackCall[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const original = window.umami;
    window.umami = {
      track: (event: string, data?: Record<string, string | number>) => {
        setCalls((prev) => [...prev.slice(-19), { event, data, ts: Date.now() }]);
        original?.track(event, data);
      },
    };
    return () => { window.umami = original; };
  }, []);

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-gray-900 text-green-400 px-3 py-1.5 rounded-lg shadow-lg"
      >
        📊 Analytics {calls.length > 0 && `(${calls.length})`}
      </button>
      {open && (
        <div className="mt-2 w-96 max-h-80 overflow-y-auto bg-gray-900 text-green-400 rounded-lg shadow-xl p-3 space-y-2">
          {calls.length === 0 && <p className="text-gray-500">No events tracked yet.</p>}
          {[...calls].reverse().map((c, i) => (
            <div key={i} className="border-b border-gray-700 pb-2">
              <span className="text-yellow-400">{c.event}</span>
              {c.data && (
                <pre className="text-gray-300 mt-0.5 whitespace-pre-wrap">
                  {JSON.stringify(c.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
