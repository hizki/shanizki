import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Process, Product } from '../types';
import ProductCard from '../components/ProductCard';

const ProcessPage = () => {
  const { id } = useParams<{ id: string }>();
  const [process, setProcess] = useState<Process | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch process details
        const { data: processData, error: processError } = await supabase
          .from('processes')
          .select('*')
          .eq('id', id)
          .single();

        if (processError) throw processError;
        setProcess(processData);

        // Fetch related products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            product_processes!inner(process_id)
          `)
          .eq('product_processes.process_id', id);

        if (productsError) throw productsError;
        setRelatedProducts(productsData || []);
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

  if (!process) {
    return (
      <div className="min-h-screen pt-20 px-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-purple-900 mb-4">תהליך לא נמצא</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden p-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-6">{process.name}</h1>
          <div className="prose max-w-none text-purple-800">
            <p>{process.description}</p>
          </div>

          {process.further_reading_links && process.further_reading_links.length > 0 && (
            <div className="mt-8 pt-8 border-t border-purple-100">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">קישורים להרחבת הידע</h2>
              <div className="grid gap-4">
                {process.further_reading_links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-purple-50 p-4 rounded-xl hover:bg-purple-100 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-purple-900 group-hover:text-purple-700 transition-colors mb-1">
                          {link.title}
                        </h3>
                        <p className="text-sm text-purple-600 break-words">
                          {link.url}
                        </p>
                      </div>
                      <ExternalLink className="text-purple-500 group-hover:text-purple-700 transition-colors flex-shrink-0 mt-1" size={20} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-purple-900 mb-8 text-center">
              מוצרים שמשתמשים בתהליך זה
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessPage;