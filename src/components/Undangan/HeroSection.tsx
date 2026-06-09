import { useState, useEffect } from 'react';
import ParallaxBg from './ParallaxBg';
import FloatingMusic from './FloatingMusic';
import WelcomingCard from './WelcomingCard';
import ContentSection from './ContentSection';

export default function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      setGuestName(to);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500/30">
      <ParallaxBg />
      <FloatingMusic />
      
      <WelcomingCard 
        onOpen={() => setIsOpen(true)} 
        isOpen={isOpen} 
        guestName={guestName} 
      />

      <div 
        className={`relative transition-all duration-1000 delay-500 ${
          isOpen ? 'opacity-100 pointer-events-auto z-50' : 'opacity-0 pointer-events-none h-screen overflow-hidden z-10'
        }`}
      >
        <ContentSection />
      </div>
    </div>
  );
}
