import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface CatImage {
  id: string;
  url: string;
  thumbnail_url: string;
  order: number;
}

const Cats: React.FC = () => {
  const [images, setImages] = useState<CatImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('cat_images')
        .select('*')
        .order('order');

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-purple-900 mb-6 text-center">החתולים שלנו</h1>
        
        <div className="mb-12 flex justify-center">
          <div className="w-48 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-magenta-500 rounded-full"></div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg mb-8">
          <p className="text-purple-800 text-center">
            הכירו טוני וזיטי, החתולים ששינו את חיינו. הם תמיד שם כדי לעזור (או להפריע) בהכנת הצנצנות.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src={image.url}
                alt="תמונת חתול"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cats;