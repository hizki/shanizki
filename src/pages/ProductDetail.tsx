import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Product, Process } from '../types';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch main product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        // Fetch processes for this product
        const { data: processesData, error: processesError } = await supabase
          .from('processes')
          .select(`
            *,
            product_processes!inner(product_id)
          `)
          .eq('product_processes.product_id', id);

        if (processesError) throw processesError;
        setProcesses(processesData || []);

        // Fetch related products
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .neq('id', id)
          .order('id', { ascending: true })
          .limit(3);

        if (relatedError) throw relatedError;
        setRelatedProducts(relatedData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 px-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-purple-900 mb-4">Product Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-yellow-400/10">
              <div className="h-[400px] md:h-[500px]">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/2 p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-purple-900">{product.name}</h1>
              
              <div className="mt-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-purple-900 mb-2">מה זה?</h2>
                  <p className="text-purple-800">{product.what_is_it}</p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-purple-900 mb-2">מה עושים עם זה?</h2>
                  <p className="text-purple-800">{product.what_to_do}</p>
                </div>

                {product.instructions && (
                  <div>
                    <h2 className="text-xl font-bold text-purple-900 mb-2">הוראות</h2>
                    <p className="text-purple-800">{product.instructions}</p>
                  </div>
                )}

                {processes.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-purple-900 mb-2">תהליכי הכנה</h2>
                    <div className="flex flex-wrap gap-2">
                      {processes.map((process) => (
                        <Link
                          key={process.id}
                          to={`/process/${process.id}`}
                          className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm hover:bg-purple-200 transition-colors"
                        >
                          {process.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-purple-900 mb-8 text-center">צנצנות נוספות שתאהבו</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                to="/products"
                className="inline-flex items-center bg-purple-700 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-800 transition-all transform hover:scale-105"
              >
                לכל הצנצנות
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;