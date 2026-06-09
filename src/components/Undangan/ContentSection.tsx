import { useState, useEffect } from 'react';
import BukuTamu from './BukuTamu';
import { Copy, CalendarPlus, MapPin, Heart, Clock, Navigation, CheckCircle2 } from 'lucide-react';

export default function ContentSection() {
  const weddingDateStr = "2026-10-10T09:00:00+07:00"; // Statis 10 Okt 2026
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const targetDate = new Date(weddingDateStr).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      
      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyRekening = async () => {
    await navigator.clipboard.writeText("123456789012");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Billar & Rara Wedding//ID
BEGIN:VEVENT
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'}
DTSTART:20261010T020000Z
DTEND:20261010T050000Z
SUMMARY:Pernikahan Billar & Rara
DESCRIPTION:Acara Akad dan Resepsi Pernikahan Billar & Rara.
LOCATION:Hotel Keren Jakarta
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Pernikahan_Billar_Rara.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex justify-center items-center flex-col min-h-screen">
      {/* A. HERO MAIN DETAIL */}
      <section className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-6 pt-20">
        
        <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
          <p className="text-amber-300 tracking-[0.2em] uppercase text-xs sm:text-sm font-medium mb-12 text-center text-shadow">
            Pernikahan Suci
          </p>

          <div className="w-full flex flex-col space-y-12 my-8">
            {/* PRIA ZIG ZAG - Kiri */}
            <div className="text-left w-full pl-4 md:pl-0">
              <h2 className="text-4xl sm:text-5xl font-serif text-amber-50 mb-2 drop-shadow-lg">
                Billar Saputra
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm italic font-serif">
                Putra Pertama dari<br/>Bapak Budi & Ibu Ani
              </p>
            </div>

            {/* DAN - Center */}
            <div className="text-center w-full flex justify-center py-4">
              <div className="w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center bg-black/20 backdrop-blur-sm shadow-[0_0_20px_rgba(217,119,6,0.2)]">
                <span className="text-3xl font-serif text-amber-400 italic drop-shadow-md">&</span>
              </div>
            </div>

            {/* WANITA ZIG ZAG - Kanan */}
            <div className="text-right w-full pr-4 md:pr-0 self-end">
              <h2 className="text-4xl sm:text-5xl font-serif text-amber-50 mb-2 drop-shadow-lg">
                Rara LIDA
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm italic font-serif">
                Putri Bungsu dari<br/>Bapak Anto & Ibu Tini
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-70">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-amber-500 to-transparent"></div>
        </div>
      </section>

      {/* B. SECTION COUNTDOWN & SIMPAN TANGGAL */}
      <section className="relative w-full py-20 px-6 flex justify-center bg-gradient-to-b from-transparent to-neutral-950/80">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-3xl font-serif text-amber-100 mb-8">Menuju Hari Bahagia</h2>
          
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-10 w-full max-w-lg mx-auto">
            {Object.entries({ Hari: timeLeft.d, Jam: timeLeft.h, Menit: timeLeft.m, Detik: timeLeft.s }).map(([label, value], i) => (
              <div key={i} className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-4 sm:py-6 shadow-xl">
                <span className="text-2xl sm:text-4xl font-serif text-amber-400">{value.toString().padStart(2, '0')}</span>
                <span className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider mt-1">{label}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={handleDownloadICS}
            className="mx-auto flex items-center justify-center gap-2 bg-neutral-900 border border-amber-900/40 text-amber-100 px-8 py-3 rounded-full hover:bg-neutral-800 transition-all shadow-[0_0_20px_rgba(217,119,6,0.15)] group"
          >
            <CalendarPlus className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium tracking-wide">Simpan Ke Kalender</span>
          </button>
        </div>
      </section>

      {/* C. JADWAL ACARA & RUTE MAPS */}
      <section className="relative w-full py-20 px-6 flex justify-center bg-neutral-950">
        <div className="max-w-4xl w-full z-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* AKAD */}
            <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/5 p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-serif text-amber-500 mb-2">Akad Nikah</h3>
              <p className="text-neutral-300 font-medium mb-1">Sabtu, 10 Oktober 2026</p>
              <p className="text-neutral-400 text-sm mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                09.00 WIB - Selesai
              </p>
              
              <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="font-medium text-neutral-200 mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" /> Masjid Agung Jakarta
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Jl. Sudirman No 123, Jakarta Pusat, DKI Jakarta
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href="https://maps.google.com/?q=Masjid+Agung+Jakarta" target="_blank" rel="noopener noreferrer" className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Navigation className="w-4 h-4 text-blue-400" /> Google Maps
                </a>
                <a href="maps://?q=Masjid+Agung+Jakarta" className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Navigation className="w-4 h-4 text-neutral-300" /> Apple Maps
                </a>
              </div>
            </div>

            {/* RESEPSI */}
            <div className="bg-gradient-to-bl from-neutral-900 to-black border border-white/5 p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-serif text-amber-500 mb-2">Resepsi</h3>
              <p className="text-neutral-300 font-medium mb-1">Sabtu, 10 Oktober 2026</p>
              <p className="text-neutral-400 text-sm mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                12.00 WIB - Selesai
              </p>
              
              <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="font-medium text-neutral-200 mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" /> Hotel Indonesia Kempinski
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Jl. M.H. Thamrin No.1, Jakarta Pusat, DKI Jakarta
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href="https://maps.google.com/?q=Hotel+Indonesia+Kempinski+Jakarta" target="_blank" rel="noopener noreferrer" className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Navigation className="w-4 h-4 text-blue-400" /> Google Maps
                </a>
                <a href="maps://?q=Hotel+Indonesia+Kempinski+Jakarta" className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Navigation className="w-4 h-4 text-neutral-300" /> Apple Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* D. SUSUNAN ACARA (TIMELINE) */}
      <section className="relative w-full py-20 px-6 flex justify-center bg-neutral-950">
        <div className="max-w-2xl w-full text-center">
          <h2 className="text-3xl font-serif text-amber-100 mb-16">Susunan Acara</h2>
          
          <div className="relative border-l border-amber-900/50 ml-4 py-4 md:ml-1/2 md:border-none md:flex md:flex-col items-center">
            {/* Animasi Garis Vertikal (CSS pseudo elements/ Tailwind borders on relative div) */}
            <div className="hidden md:block absolute top-0 bottom-0 left-[50%] w-[1px] bg-gradient-to-b from-transparent via-amber-700/50 to-transparent"></div>

            {/* Item 1 */}
            <div className="relative pl-8 md:pl-0 md:w-[50%] md:pr-12 md:self-start mb-14 md:text-right group">
              <div className="absolute left-[-5px] md:left-[100%] md:-translate-x-1/2 top-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-neutral-950 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(217,119,6,1)]"></div>
              <h4 className="text-xl font-serif text-amber-300 mb-1">Penyambutan Tamu</h4>
              <p className="text-sm font-medium text-neutral-300 mb-2">08:00 WIB</p>
              <p className="text-xs text-neutral-500 leading-relaxed">Penyambutan keluarga besar dan tamu undangan, ramah tamah singkat.</p>
            </div>

            {/* Item 2 */}
            <div className="relative pl-8 md:pl-0 md:w-[50%] md:pl-12 md:self-end mb-14 md:text-left group">
              <div className="absolute left-[-5px] md:left-0 md:-translate-x-1/2 top-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-neutral-950 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(217,119,6,1)]"></div>
              <h4 className="text-xl font-serif text-amber-300 mb-1">Prosesi Akad</h4>
              <p className="text-sm font-medium text-neutral-300 mb-2">09:00 WIB</p>
              <p className="text-xs text-neutral-500 leading-relaxed">Pembacaan ijab kabul yang khidmat disaksikan oleh saksi dan keluarga.</p>
            </div>

            {/* Item 3 */}
            <div className="relative pl-8 md:pl-0 md:w-[50%] md:pr-12 md:self-start mb-14 md:text-right group">
              <div className="absolute left-[-5px] md:left-[100%] md:-translate-x-1/2 top-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-neutral-950 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(217,119,6,1)]"></div>
              <h4 className="text-xl font-serif text-amber-300 mb-1">Sesi Foto Keluarga</h4>
              <p className="text-sm font-medium text-neutral-300 mb-2">10:30 WIB</p>
              <p className="text-xs text-neutral-500 leading-relaxed">Pengabadian momen berharga bersama keluarga inti dan kerabat agung.</p>
            </div>

            {/* Item 4 */}
            <div className="relative pl-8 md:pl-0 md:w-[50%] md:pl-12 md:self-end md:text-left group">
              <div className="absolute left-[-5px] md:left-0 md:-translate-x-1/2 top-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-neutral-950 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(217,119,6,1)]"></div>
              <h4 className="text-xl font-serif text-amber-300 mb-1">Resepsi & Hiburan</h4>
              <p className="text-sm font-medium text-neutral-300 mb-2">12:00 WIB - Selesai</p>
              <p className="text-xs text-neutral-500 leading-relaxed">Makan siang bersama diiringi alunan musik live dan doa restu tamu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* E. MOMEN BAHAGIA & BERITA CINTA (LOVE STORY) */}
      <section className="relative w-full py-20 px-6 flex justify-center bg-black">
        <div className="max-w-4xl w-full text-center">
          <Heart className="w-8 h-8 text-amber-600 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-serif text-amber-100 mb-12">Kisah Cinta Kami</h2>

          {/* Momen Bahagia 1 Cover */}
          <div className="w-full h-64 sm:h-96 rounded-3xl overflow-hidden relative mb-16 shadow-2xl border border-white/5">
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" alt="Momen" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-8">
              <p className="text-amber-50 font-serif italic text-lg text-left drop-shadow-md">
                "Cinta tidak berupa tatapan satu sama lain, tetapi memandang bersama ke arah yang sama."
              </p>
            </div>
          </div>

          <div className="space-y-16 mt-8">
            {/* Story 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-center text-left">
              <div className="w-full md:w-1/2 shrink-0">
                <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-neutral-900 shadow-xl max-w-[250px] mx-auto md:mx-0">
                  <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80" alt="Pertama bertemu" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <span className="text-amber-500 font-mono text-sm mb-2 block">2021 - Awal Berjumpa</span>
                <h3 className="text-2xl font-serif text-white mb-3">Pandangan Pertama</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Kami pertama kali bertemu di sebuah acara reuni teman SMA. Tidak ada yang spesial pada awalnya, hanya sapaan canggung. Namun senyum di sore itu menjadi awal segalanya.
                </p>
              </div>
            </div>

            {/* Story 2 */}
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center text-left md:text-right">
              <div className="w-full md:w-1/2 shrink-0">
                <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-neutral-900 shadow-xl max-w-[250px] mx-auto md:ml-auto">
                  <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80" alt="Pacaran" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <span className="text-amber-500 font-mono text-sm mb-2 block">2023 - Menjalin Kasih</span>
                <h3 className="text-2xl font-serif text-white mb-3">Semakin Dekat & Tumbuh</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Dua tahun mengenal, melewati berbagai musim kehidupan bersama. Kami belajar memahami ego masing-masing, tertawa menangis, hingga akhirnya yakin bahwa kami saling melengkapi.
                </p>
              </div>
            </div>

            {/* Story 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-center text-left">
              <div className="w-full md:w-1/2 shrink-0">
                <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-neutral-900 shadow-xl max-w-[250px] mx-auto md:mx-0">
                  <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80" alt="Lamaran" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <span className="text-amber-500 font-mono text-sm mb-2 block">2025 - Memutuskan</span>
                <h3 className="text-2xl font-serif text-white mb-3">Langkah Menuju Halal</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Dia datang ke rumah dengan keberanian, mengucap janji suci di depan orang tua. Kami memutuskan mengikat ikatan di bawah ridho Ilahi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* F. DOMPET DIGITAL & KIRIM HADIAH (GIFT CARD) */}
      <section className="relative w-full py-20 px-6 flex justify-center bg-neutral-950">
        <div className="max-w-xl w-full text-center">
          <h2 className="text-3xl font-serif text-amber-100 mb-4">Tanda Kasih</h2>
          <p className="text-neutral-400 text-sm mb-10">Doa restu Anda merupakan karunia terbesar bagi kami.<br/>Bagi keluarga & sahabat yang ingin mengirim hadiah, dapat memberikan melalui form di bawah.</p>

          {/* ATM Card Visual */}
          <div className="relative w-[320px] sm:w-[380px] h-[200px] mx-auto rounded-2xl bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-6 flex flex-col justify-between shadow-2xl border border-white/10 overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-start z-10 w-full">
              <span className="text-amber-400 font-bold italic tracking-widest text-lg">BCA</span>
              <svg className="w-8 h-8 text-amber-600/50" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>

            <div className="z-10 text-left">
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">No. Rekening</p>
              <h3 className="text-2xl font-mono text-white tracking-[0.2em] mb-4">1234 5678 9012</h3>
              <p className="text-sm text-neutral-300 font-medium uppercase tracking-wider">A.N Billar Saputra</p>
            </div>
            
            <button 
              onClick={handleCopyRekening}
              className="absolute bottom-6 right-6 w-10 h-10 bg-amber-500/20 hover:bg-amber-500/40 rounded-full flex items-center justify-center transition-colors z-20 pointer-events-auto cursor-pointer"
              title="Salin Rekening"
            >
              {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-500" />}
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left">
            <h4 className="text-neutral-200 font-medium mb-3 border-b border-white/10 pb-2">Kirim Kado Fisik</h4>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-amber-400 mb-1">Rara (Penerima)</p>
                <p className="text-xs text-neutral-400 mb-2">0812-3456-7890</p>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-[250px]">
                  Perumahan Indah Permai Blok B2 No. 15, Kec. Kemang, Jakarta Selatan, 12730
                </p>
              </div>
              <button 
                onClick={async () => {
                  await navigator.clipboard.writeText("Perumahan Indah Permai Blok B2 No. 15, Kec. Kemang, Jakarta Selatan, 12730");
                  alert("Alamat berhasil disalin!");
                }}
                className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors group cursor-pointer" title="Salin Alamat"
              >
                <Copy className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* G. KONFIRMASI KEHADIRAN & BUKUTAMU */}
      <BukuTamu />

      {/* H. UCAPAN TERIMA KASIH (FOOTER) */}
      <section className="relative w-full py-20 px-6 flex justify-center bg-black text-center border-t border-white/5">
        <div className="max-w-2xl w-full">
          <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-serif italic">
            "Merupakan suatu kehormatan dan kebahagiaan bagi kami,<br className="hidden sm:block"/>
            apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai."
          </p>
          <h3 className="text-2xl font-serif text-amber-50 mb-1">Terima Kasih</h3>
          <p className="text-amber-500 font-medium text-sm mb-12">Dari Kami Yang Berbahagia</p>
          
          <h2 className="text-4xl font-serif text-white/90">Billar & Rara</h2>
          <p className="text-[10px] uppercase text-neutral-600 tracking-[0.3em] mt-16">Exclusive Digital Invitation</p>
        </div>
      </section>

    </div>
  );
}
