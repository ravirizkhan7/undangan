import React, { useState } from 'react';
import { useBukuTamu } from './useBukuTamu';
import { Send, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function BukuTamu() {
  const { ucapanList, isSubmitting, error, submitUcapan } = useBukuTamu();
  const [nama, setNama] = useState('');
  const [komentar, setKomentar] = useState('');
  const [kehadiran, setKehadiran] = useState<boolean>(true);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !komentar.trim()) return;

    const success = await submitUcapan(nama, komentar, kehadiran);
    if (success) {
      setNama('');
      setKomentar('');
      setKehadiran(true);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-20 px-6">
      <div className="p-8 bg-black/40 border border-amber-500/30 rounded-3xl mt-2 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500 opacity-10 rounded-full blur-[80px]"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          
          {/* RSVP Form */}
          <div>
            <h2 className="font-serif text-2xl text-amber-500 mb-4">Kehadiran & Wishes</h2>
            
            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Terima kasih!
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nama Anda"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 text-white placeholder-white/50"
              />
              <select 
                value={kehadiran ? 'hadir' : 'tidak'}
                onChange={(e) => setKehadiran(e.target.value === 'hadir')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 text-white appearance-none"
              >
                <option value="hadir" className="bg-black text-white">Hadir</option>
                <option value="tidak" className="bg-black text-white">Maaf, Tidak Bisa Hadir</option>
              </select>
              <textarea
                placeholder="Doa & Harapan untuk Kami..."
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
                required
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 text-white placeholder-white/50 resize-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-colors flex justify-center items-center h-12"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  "Kirim Ucapan"
                )}
              </button>
            </form>
          </div>

          {/* Guest List */}
          <div className="flex flex-col h-full">
            <h2 className="font-serif text-2xl mb-4 text-white/50 flex justify-between items-center">
              Guest Board
              <span className="text-xs font-sans px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full">
                {ucapanList.length}
              </span>
            </h2>
            <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-4 space-y-4 overflow-y-auto max-h-[400px] md:max-h-[350px] pr-2 custom-scrollbar">
              {ucapanList.length === 0 ? (
                <p className="text-center text-white/30 text-sm italic py-8">
                  Belum ada pesan.
                </p>
              ) : (
                ucapanList.map((item) => (
                  <div key={item.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-sm text-amber-500">{item.nama}</span>
                      <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider ${
                        item.kehadiran 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-neutral-500/10 text-neutral-400'
                      }`}>
                        {item.kehadiran ? 'Hadir' : 'Absen'}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 italic leading-relaxed">"{item.komentar}"</p>
                    <span className="text-[9px] text-white/30 uppercase mt-2 block tracking-widest">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: idLocale })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
