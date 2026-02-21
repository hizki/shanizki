import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import Logo from './Logo';
import { supabase } from '../lib/supabase';

const HeroSection: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        const { data: { publicUrl } } = supabase.storage
          .from('assets')
          .getPublicUrl('logo.jpg');
        
        setLogoUrl(publicUrl);
      } catch (error) {
        console.error('Error fetching logo URL:', error);
      }
    };

    fetchLogoUrl();
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-magenta-500 z-0">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-purple-700"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
                transform: `translate(-50%, -50%)`,
                animation: `float ${Math.random() * 10 + 20}s infinite ease-in-out`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="mb-8">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="SHANIZKI - אהבה כבושה"
              className={`max-w-[280px] w-full h-auto transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-6 animate-slideUp">
          אהבה כבושה
        </h1>
        
        <p className="text-lg md:text-xl text-purple-800 max-w-md mb-12 animate-slideUp animation-delay-200">
          המזווה של שני וגיא - צנצנות עם דברים מותססים, מתוקים, ומעוררי תיאבון, בדיוק כמונו.
        </p>
        
        <button 
          onClick={scrollToContent}
          className="animate-bounce absolute bottom-8 bg-purple-700 text-white p-3 rounded-full hover:bg-purple-800 transition-colors"
          aria-label="Scroll down"
        >
          <ArrowDown size={24} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;