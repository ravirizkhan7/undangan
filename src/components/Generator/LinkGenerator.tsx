import { useState } from 'react';
import { Copy, Link, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function LinkGenerator() {
  const [guestName, setGuestName] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!guestName.trim()) return;
    const url = new URL(window.location.href);
    url.searchParams.set('to', guestName.trim());
    setGeneratedUrl(url.toString());
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-neutral-100 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light tracking-widest text-amber-200 mb-2 font-serif">
            EXCLUSIVE INVITATION
          </h1>
          <p className="text-neutral-400 text-sm tracking-wider">
            Link Generator Portal
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 p-6 rounded-3xl shadow-2xl">
          <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold block mb-4">
            Link Generator
          </label>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 transition-all placeholder-neutral-600 mb-6"
            placeholder="Ketik nama tamu..."
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            disabled={!guestName.trim()}
            className="w-full py-3 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Link className="w-4 h-4" />
            Buat Undangan
          </button>
        </div>

        {generatedUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl overflow-hidden"
          >
            <p className="text-[10px] uppercase tracking-widest text-amber-500 font-bold block mb-4">
              URL Undangan Anda
            </p>
            <div className="p-3 bg-white/5 rounded-xl border border-dashed border-white/20 flex justify-between items-center mb-4">
              <code className="text-[10px] text-white/50 truncate pr-4 whitespace-nowrap">
                {generatedUrl}
              </code>
            </div>
            <button
              onClick={handleCopy}
              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Link
                </>
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
