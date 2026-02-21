import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRandomProducts();
  }, []);

  const fetchRandomProducts = async () => {
    try {
      // First, get the total count of products
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (!count) return;

      // Generate a random offset that ensures we can get at least 2 products
      const maxOffset = Math.max(0, count - 2);
      const randomOffset = Math.floor(Math.random() * (maxOffset + 1));

      // Fetch 2 products starting from the random offset
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .range(randomOffset, randomOffset + 1);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">הצנצנות שלנו</h2>
            <p className="text-purple-700 max-w-xl mx-auto">
              טעימה קטנה מהמוצרים שלנו - כל צנצנת היא עולם ומלואו של טעמים וריחות
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Link 
                  to="/products"
                  className="inline-flex items-center bg-purple-700 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-800 transition-all transform hover:scale-105"
                >
                  לכל הצנצנות
                  <ArrowLeft size={20} className="ml-2" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      
      <section className="py-16 px-4 bg-gradient-to-br from-yellow-400 via-orange-400 to-magenta-500">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6">רצינו לעשות לכם טעים</h2>
            <p className="text-purple-800 mb-6">
              אנחנו שמחים לחלוק איתכם את פירות וירקות אהבתנו.
              מזווה ההתססות שלנו מורכב מפירות וירקות שליקטנו בטבע ומחוץ לבתים של משפחה, חברים, וברחבי העיר.
            </p>
            <p className="text-purple-800 mb-6">
              כל אחד מהמטעמים שהכנו לכם אפשר היה להינות ממנו כתענוג מיידי, אבל נהיה הרבה יותר טוב אחרי שעבר קצת זמן בצנצנת.
            </p>
            <p className="text-purple-800">
              וככה גם יהיה היום הזה. נכבוש אותו במלח ונשים בצנצנת וזה יהיה טעים. בטוח.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;