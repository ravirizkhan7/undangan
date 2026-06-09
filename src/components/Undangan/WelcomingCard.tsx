import { motion } from 'motion/react';

interface WelcomingCardProps {
  onOpen: () => void;
  isOpen: boolean;
  guestName: string;
}

export default function WelcomingCard({ onOpen, isOpen, guestName }: WelcomingCardProps) {
  return (
    <div
      className={`fixed inset-0 z-40 transition-colors duration-[1500ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${
        isOpen ? 'bg-transparent pointer-events-none' : 'bg-neutral-950'
      }`}
    >
      <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80')] bg-cover bg-center transition-opacity duration-[1500ms] mix-blend-overlay ${isOpen ? 'opacity-0' : 'opacity-30'}`}></div>
      
      {/* The expanding photo */}
      <div 
        className={`absolute z-0 overflow-hidden transition-all duration-[1500ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${
          isOpen 
            ? 'w-[100vw] h-[100vh] rounded-none top-[50%]' 
            : 'w-44 h-[16rem] sm:w-60 sm:h-[20rem] rounded-[80px] top-[40%]'
        }`}
        style={{
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <img 
          src="https://media.kompas.tv/library/image/content_article/article_img/20211109223756.jpg" 
          alt="Couple"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay that fades in when open to match ContentSection */}
        <div className={`absolute inset-0 bg-neutral-950 transition-opacity duration-[1500ms] ${isOpen ? 'opacity-70 mix-blend-multiply' : 'opacity-0'}`}></div>
      </div>

      {/* The expanding and fading border frame */}
      <div 
        className={`absolute z-10 flex items-center justify-center p-2 transition-transform duration-[1500ms] ease-[cubic-bezier(0.87,0,0.13,1)] pointer-events-none ${
          isOpen ? 'scale-[2.5] opacity-0' : 'scale-100 opacity-100'
        } w-48 h-[17rem] sm:w-64 sm:h-[21rem]`}
        style={{
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
         <div className="absolute inset-0 border-2 border-amber-500 rounded-[80px]">
            <div className="absolute -top-3 -right-3 w-10 h-10 border-t-2 border-r-2 border-amber-500 rounded-tr-xl"></div>
            <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-2 border-l-2 border-amber-500 rounded-bl-xl"></div>
          </div>
      </div>

      {/* The text content */}
      <div
        className={`absolute w-full px-6 flex flex-col items-center text-center transition-all duration-[1000ms] ease-in-out pointer-events-auto ${
          isOpen ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
        }`}
        style={{
          bottom: '8%',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        <h1 className="text-4xl sm:text-5xl font-serif text-white font-light tracking-wide mb-1 drop-shadow-lg">
          Billar <span className="text-amber-500 font-sans italic mx-1">&</span> Rara
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold mb-4 sm:mb-6 italic drop-shadow-md">
          Opening Sequence
        </p>

        <div className="mb-6 flex flex-col items-center">
          <p className="text-[10px] text-neutral-400 tracking-widest uppercase mb-1 drop-shadow-md">
            Dear,
          </p>
          <div className="px-6 py-1 border-b border-amber-500/30">
            <p className="text-lg font-serif text-neutral-100 drop-shadow-md">{guestName || 'Tamu Kehormatan'}</p>
          </div>
        </div>

        <button
          onClick={onOpen}
          className="w-[80%] sm:w-auto min-w-[200px] py-3.5 px-8 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-amber-500 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          Buka Undangan
        </button>
      </div>
    </div>
  );
}
