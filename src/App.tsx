import { useEffect, useState } from 'react';
import HeroSection from './components/Undangan/HeroSection';
import LinkGenerator from './components/Generator/LinkGenerator';
import './index.css';

export default function App() {
  const [hasGuest, setHasGuest] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('to')) {
      setHasGuest(true);
    }
  }, []);

  return hasGuest ? <HeroSection /> : <LinkGenerator />;
}

