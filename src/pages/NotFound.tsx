import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-purple-900 mb-6">איבדת את הדרך חמוד?</h1>
          
          <div className="mb-12 flex justify-center">
            <div className="w-48 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-magenta-500 rounded-full"></div>
          </div>
          
          <div className="bg-purple-50 p-8 rounded-2xl shadow-sm">
            <p className="text-lg text-purple-800 mb-8">
              איבדת את הדרך חמוד?
            </p>
            
            <Link 
              to="/"
              className="inline-flex items-center bg-purple-700 text-white px-6 py-3 rounded-full hover:bg-purple-800 transition-colors"
            >
              <Home size={20} className="ml-2" />
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;