import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-purple-900 text-white py-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          <div className="mb-8 md:mb-0">
            <Logo colorful={false} />
            <p className="mt-4 text-purple-200 max-w-xs">
              מביאים טעם וצבע לחיי היומיום דרך תסיסה ואהבה אינסופית.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:gap-16">
            <div>
              <h4 className="text-lg font-bold mb-4">קישורים</h4>
              <ul className="space-y-2">
                <li><Link to="/products" className="text-purple-200 hover:text-yellow-400 transition-colors">צנצנות</Link></li>
                <li><Link to="/processes" className="text-purple-200 hover:text-yellow-400 transition-colors">שיטות הכנה</Link></li>
                <li><Link to="/contact" className="text-purple-200 hover:text-yellow-400 transition-colors">צור קשר</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">עקבו אחרינו</h4>
              <div className="flex space-x-4 space-x-reverse">
                <a 
                  href="https://www.instagram.com/shanagin?igsh=MTgwOG9scWo1emhlZA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-200 hover:text-yellow-400 transition-colors"
                >
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-purple-800 text-center text-purple-300 text-sm">
          <p>© {new Date().getFullYear()} SHANIZKI. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;