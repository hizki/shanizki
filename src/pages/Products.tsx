import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.what_is_it?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.what_to_do?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      product.processes?.some(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || false
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white/90 to-yellow-50/80 backdrop-blur-xl" />
        <div className="absolute inset-0">
          <div 
            className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-400/60 rounded-[40%] blur-2xl animate-float"
            style={{ animationDelay: '0s', animationDuration: '20s' }}
          />
          <div 
            className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-orange-400/60 rounded-[60%] blur-2xl animate-float"
            style={{ animationDelay: '-10s', animationDuration: '25s' }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-magenta-500/50 rounded-[45%] blur-2xl animate-float"
            style={{ animationDelay: '-5s', animationDuration: '30s' }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">הרקיחות שלנו</h1>
          <p className="text-lg text-purple-700 max-w-2xl mx-auto">
            גלו את האוסף הייחודי שלנו של צנצנות ביתיות בעבודת יד
          </p>
        </div>
        
        <div className="relative max-w-md mx-auto mb-12">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search size={20} className="text-purple-500" />
          </div>
          <input
            type="text"
            placeholder="חיפוש מוצרים..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full pr-10 pl-4 py-3 border border-purple-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm text-right"
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
                <p className="text-xl text-purple-700 mb-4">לא נמצאו מוצרים התואמים לחיפוש "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="bg-purple-700 text-white px-6 py-2 rounded-full hover:bg-purple-800 transition-colors"
                >
                  נקה חיפוש
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;