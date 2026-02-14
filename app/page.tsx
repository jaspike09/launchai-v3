'use client';
import { useState, useEffect } from 'react';

export default function MasterDashboard() {
  const [input, setInput] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const runMeeting = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ prompt: input }) });
      setData(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10 print:hidden">
          <h1 className="text-2xl font-black text-blue-500">LAUNCHAI MASTER</h1>
          {data && (
            <button onClick={() => window.print()} className="bg-zinc-800 px-4 py-2 rounded-lg text-sm border border-zinc-700">
              💾 Download PDF
            </button>
          )}
        </header>

        <div className="space-y-6 print:hidden">
          <textarea 
            className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-lg outline-none focus:border-blue-500"
            placeholder="What are we building today?"
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={runMeeting} className="w-full py-4 bg-blue-600 rounded-2xl font-bold uppercase tracking-widest">
            {loading ? "Board Meeting in Progress..." : "Execute Strategy"}
          </button>
        </div>

        {data && (
          <div className="mt-10 bg-white text-black p-8 rounded-2xl print:p-0 print:shadow-none shadow-2xl">
            <h2 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-6">Executive Plan</h2>
            <p className="text-lg leading-relaxed mb-10 whitespace-pre-wrap">{data.architect}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-200">
              {data.board.map((m: any) => (
                <div key={m.role}>
                  <h3 className="text-xs font-bold text-blue-600 uppercase mb-2">{m.role}</h3>
                  <p className="text-xs text-zinc-600 leading-snug">{m.feedback.slice(0, 250)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
