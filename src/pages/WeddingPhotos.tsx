import React from 'react';

const WeddingPhotos: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-purple-900 mb-6">תמונות מהחתונה</h1>
          
          <div className="mb-12 flex justify-center">
            <div className="w-48 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-magenta-500 rounded-full"></div>
          </div>
          
          <div className="bg-purple-50 p-8 rounded-2xl shadow-sm">
            <p className="text-lg text-purple-800 mb-4">
              התמונות מהחתונה יעלו בקרוב!
            </p>
            <p className="text-purple-700">
              אנחנו עובדים על עריכת התמונות ונשתף אותן איתכם ברגע שהן יהיו מוכנות.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingPhotos;