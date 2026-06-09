import { useEffect, useState } from 'react';

export default function ParallaxBg() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-neutral-950 overflow-hidden">
      {/* Background Parallax Effect Simulation */}
      <div 
        className="absolute inset-0 opacity-40 transition-transform duration-100 ease-linear"
        style={{ transform: `translate3d(0, ${scrollY * 0.1}px, 0)` }}
      >
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>
      </div>
    </div>
  );
}
