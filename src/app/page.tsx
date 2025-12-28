'use client';

import { useState, useRef, useEffect } from 'react';
import { Gavel, Copy, Download, Twitter, AlertTriangle, CheckCircle, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import clsx from 'clsx';

interface Judgment {
  verdict: "DENIED" | "GRANTED";
  copiumIndex: number;
  redFlag: string;
  reasoning: string;
  styles: string[];
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [appealText, setAppealText] = useState("");
  const [judgment, setJudgment] = useState<Judgment | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const showToast = (type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleJudge = async () => {
    if (!banReason || !appealText) return;

    setLoading(true);
    setJudgment(null);

    try {
      const res = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banReason, appealText }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setJudgment(data);
    } catch (error: any) {
      showToast('error', `⚖️ Court is recessed: ${error?.message || 'Error contacting the judge'}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, backgroundColor: '#0a0a0a' });
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('success', '📋 Judgement Card copied! Paste it anywhere.');
    } catch (err) {
      console.error("Failed to copy image", err);
      showToast('error', "Couldn't copy – try Download instead!");
    }
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, backgroundColor: '#0a0a0a' });
      const link = document.createElement('a');
      link.download = `ban-appeal-verdict-${judgment?.copiumIndex}pct-copium.png`;
      link.href = dataUrl;
      link.click();
      showToast('success', '📥 Image downloaded!');
    } catch (err) {
      console.error("Failed to download image", err);
      showToast('error', "Download failed. Try again.");
    }
  };

  const shareToTwitter = () => {
    if (!judgment) return;
    const verdict = judgment.verdict === "DENIED" ? "🚫 DENIED" : "✅ GRANTED";
    const emoji = judgment.copiumIndex > 70 ? "💨" : judgment.copiumIndex > 40 ? "🤔" : "👏";
    const text = `${verdict} ${emoji}\n\nCopium Index: ${judgment.copiumIndex}%\nRed Flag: "${judgment.redFlag}"\n\nJudge your ban appeals with AI 👉`;
    const url = "https://judge.gatekeeperai.app";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-neutral-950 py-12 px-4 md:px-8 selection:bg-red-500/30">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Top Bar */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2 p-2 px-3 bg-neutral-900 rounded-full border border-neutral-800">
            <Gavel className="w-4 h-4 text-red-500" />
            <span className="font-mono text-xs text-neutral-400">CASE #4: APPEAL JUDGE</span>
          </div>
          <a 
            href="https://gatekeeperai.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 px-3 bg-neutral-900/50 hover:bg-neutral-800 rounded-full border border-neutral-800 transition-colors group"
          >
            <span className="text-xs text-neutral-500 group-hover:text-neutral-300">Powered by</span>
            <span className="text-xs font-bold text-white">GatekeeperAI</span>
          </a>
        </nav>

        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
            THE BAN APPEAL <span className="text-red-600">JUDGE</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Admins hate reading lies. Paste the appeal below and get an instant <span className="text-white font-bold">Copium Index</span>.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Input Courtroom */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-neutral-900/40 p-6 md:p-8 rounded-3xl border border-neutral-800 backdrop-blur-sm"
          >
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-400 uppercase tracking-wider">The Crime (Ban Reason)</label>
              <textarea 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600/50 resize-none h-24 transition-all"
                placeholder="e.g. Spamming phishing links in general chat..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-400 uppercase tracking-wider">The Plea (Appeal Text)</label>
              <textarea 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600/50 resize-none h-40 transition-all"
                placeholder="e.g. I am so sorry, my little brother was using my keyboard..."
                value={appealText}
                onChange={(e) => setAppealText(e.target.value)}
              />
            </div>

            <button
              onClick={handleJudge}
              disabled={loading || !banReason || !appealText}
              className="w-full bg-white text-black font-black text-xl py-4 rounded-xl hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  DELIBERATING...
                </>
              ) : (
                <>
                  <Gavel className="w-6 h-6" />
                  JUDGE THIS APPEAL
                </>
              )}
            </button>
          </motion.section>

          {/* Verdict Output */}
          <section className="relative min-h-[400px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {!judgment ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-neutral-600 space-y-4"
                >
                  <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mx-auto border border-neutral-800">
                    <ScaleIcon className="w-10 h-10 opacity-20" />
                  </div>
                  <p>The court is waiting for your input.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="w-full"
                >
                  {/* The Shareable Card */}
                  <div 
                    ref={cardRef}
                    className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 shadow-2xl relative overflow-hidden group"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    
                    {/* Stamp */}
                    <motion.div 
                      initial={{ scale: 2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className={clsx(
                        "absolute top-6 right-6 border-4 rounded-lg px-4 py-2 font-black text-2xl -rotate-12 uppercase tracking-widest mix-blend-hard-light z-10",
                        judgment.verdict === "DENIED" ? "border-red-500 text-red-500 bg-red-500/10" : "border-green-500 text-green-500 bg-green-500/10"
                      )}
                    >
                      {judgment.verdict}
                    </motion.div>

                    <div className="relative z-10 space-y-8">
                      <div>
                        <h3 className="text-neutral-500 font-mono text-sm uppercase tracking-wider mb-1">Copium Index</h3>
                        <div className="flex items-end gap-4">
                          <span className={clsx(
                            "text-6xl font-black tabular-nums leading-none",
                            judgment.copiumIndex > 70 ? "text-red-500" : judgment.copiumIndex > 40 ? "text-orange-500" : "text-green-500"
                          )}>
                            {judgment.copiumIndex}%
                          </span>
                          <div className="flex-1 h-4 bg-neutral-800 rounded-full overflow-hidden mb-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${judgment.copiumIndex}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={clsx(
                                "h-full rounded-full",
                                judgment.copiumIndex > 70 ? "bg-red-500" : judgment.copiumIndex > 40 ? "bg-orange-500" : "bg-green-500"
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className={clsx(
                          "flex items-center gap-2 font-bold uppercase text-sm tracking-wider",
                          judgment.verdict === "DENIED" ? "text-red-400" : "text-green-400"
                        )}>
                          {judgment.verdict === "DENIED" ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          {judgment.verdict === "DENIED" ? "Red Flag" : "Key Insight"}
                        </div>
                        <p className="text-xl md:text-2xl text-white font-medium italic">
                          "{judgment.redFlag}"
                        </p>
                      </div>

                      <div className="bg-neutral-950/50 rounded-xl p-4 border border-neutral-800">
                         <h4 className="text-neutral-500 text-xs font-bold uppercase mb-2">Judge's Notes</h4>
                         <p className="text-neutral-300 text-sm leading-relaxed">{judgment.reasoning}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {judgment.styles.map((style) => (
                          <span key={style} className="px-3 py-1 bg-neutral-800 text-neutral-400 text-xs rounded-full font-medium">
                            {style}
                          </span>
                        ))}
                      </div>
                      
                      {/* Branding Footer */}
                      <div className="pt-6 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-500 font-mono">
                        <span>JUDGE.GATEKEEPER.AI</span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Share Prompt */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl border border-red-500/20"
                  >
                    <p className="text-sm text-center text-neutral-300">
                      {judgment.verdict === "DENIED" 
                        ? "🎭 This cope is too good not to share. Expose the BS!" 
                        : "🎉 A rare genuine appeal! Share this unicorn!"}
                    </p>
                  </motion.div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 mt-4 justify-center">
                    <button 
                      onClick={shareToTwitter}
                      className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-900 text-white rounded-full text-sm font-bold transition-all border border-neutral-700 hover:border-neutral-500"
                    >
                      <Twitter className="w-4 h-4" /> Share on X
                    </button>
                    <button 
                      onClick={copyImage}
                      className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full text-sm font-medium transition-colors"
                    >
                      <Copy className="w-4 h-4" /> Copy Image
                    </button>
                    <button 
                      onClick={downloadImage}
                      className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full text-sm font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>

        {/* The Bridge */}
        <footer className="pt-20 pb-12 text-center border-t border-neutral-900">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">Don't waste emotional energy on liars.</h2>
            <p className="text-neutral-400">
              This tool filters individual appeals. <span className="text-white">Gatekeeper AI</span> filters your entire community.
            </p>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
            >
              Automate Your Defense <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          
          {/* Copyright & Disclaimer */}
          <div className="mt-16 pt-8 border-t border-neutral-900 space-y-2">
            <p className="text-neutral-500 text-sm">
              © 2025{new Date().getFullYear() > 2025 ? `–${new Date().getFullYear()}` : ''} Gatekeeper AI. All rights reserved.
            </p>
            <p className="text-neutral-600 text-xs max-w-xl mx-auto">
              This tool is for entertainment purposes only. AI-generated verdicts should not be used as the sole basis for moderation decisions. Always apply human judgment.
            </p>
          </div>
        </footer>

      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={clsx(
                "flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-sm",
                toast.type === 'error' && "bg-red-950/90 border-red-500/50 text-red-100",
                toast.type === 'success' && "bg-green-950/90 border-green-500/50 text-green-100",
                toast.type === 'info' && "bg-neutral-900/90 border-neutral-700 text-neutral-100"
              )}
            >
              <div className="flex-1 text-sm font-medium">{toast.message}</div>
              <button 
                onClick={() => dismissToast(toast.id)}
                className="text-current opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}

function ScaleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  )
}
