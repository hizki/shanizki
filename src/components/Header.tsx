import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCatsPage, setShowCatsPage] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPageVisibility = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'show_cats_page')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching page visibility:', error);
          return;
        }

        setShowCatsPage(data?.value ?? true);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPageVisibility();

    // Subscribe to changes
    const channel = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
          filter: 'key=eq.show_cats_page'
        },
        (payload) => {
          setShowCatsPage(payload.new.value);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-yellow-400 shadow-md py-2' : 'bg-transparent py-4'
      }`}
      dir="ltr"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="z-50">
          <Logo size="medium" />
        </Link>
        
        <button 
          onClick={toggleMenu}
          className="z-50 p-2 rounded-full bg-purple-700 text-white hover:bg-purple-800 transition-colors"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <nav 
          className={`fixed inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-magenta-500 flex flex-col items-center justify-center transition-all duration-300 ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          dir="rtl"
        >
          <ul className="flex flex-col items-center space-y-8 text-2xl font-bold">
            <li>
              <Link 
                to="/" 
                className="text-purple-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                בית
              </Link>
            </li>
            <li>
              <Link 
                to="/products" 
                className="text-purple-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                צנצנות
              </Link>
            </li>
            <li>
              <Link 
                to="/processes" 
                className="text-purple-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                תהליכי הכנה
              </Link>
            </li>
            {showCatsPage && (
              <li>
                <Link 
                  to="/cats" 
                  className="text-purple-900 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  החתולים שלנו
                </Link>
              </li>
            )}
            <li>
              <Link 
                to="/wedding-photos" 
                className="text-purple-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                תמונות מהחתונה
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className="text-purple-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                צור קשר
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;