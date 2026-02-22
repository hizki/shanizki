import type React from 'react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import type { Product, Process } from '../types';
import { Trash2, Edit, Plus, X, Upload, Copy } from 'lucide-react';
import CatGalleryAdmin from '../components/CatGalleryAdmin';

type CopyField = 'what_is_it' | 'what_to_do' | 'instructions';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingProcess, setEditingProcess] = useState<Partial<Process> | null>(null);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [showProductSelector, setShowProductSelector] = useState<CopyField | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, processesData] = await Promise.all([
        supabase
          .from('products')
          .select(`
            *,
            product_processes (
              process_id
            )
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('processes')
          .select('*')
          .order('name')
      ]);

      if (productsData.error) throw productsData.error;
      if (processesData.error) throw processesData.error;

      setProducts(productsData.data || []);
      setProcesses(processesData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('האם את/ה בטוח/ה שברצונך למחוק מוצר זה?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleDeleteProcess = async (id: string) => {
    if (!confirm('האם את/ה בטוח/ה שברצונך למחוק תהליך זה?')) return;

    try {
      const { error } = await supabase
        .from('processes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProcesses(processes.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting process:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileId = uuidv4();
    const { error } = await supabase.storage
      .from('product-images')
      .upload(`products/${fileId}.jpg`, file, { upsert: true });

    if (error) {
      console.error('Error uploading image:', error);
      return;
    }

    const imageUrl = supabase.storage
      .from('product-images')
      .getPublicUrl(`products/${fileId}.jpg`).data.publicUrl;

    setEditingProduct({ ...editingProduct, image_url: imageUrl });
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProduct) return;

    const { name, what_is_it, what_to_do, instructions, featured, id: productId, image_url } = editingProduct;

    const productData = {
      name,
      what_is_it,
      what_to_do,
      instructions,
      featured,
      image_url
    };

    try {
      let upsertedProduct;
      if (productId) {
        // Update existing product
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId)
          .select()
          .single();

        if (error) throw error;
        upsertedProduct = data;
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (error) throw error;
        upsertedProduct = data;
      }

      // Update product_processes
      await supabase
        .from('product_processes')
        .delete()
        .eq('product_id', upsertedProduct.id);

      const productProcesses = selectedProcesses.map(process_id => ({
        product_id: upsertedProduct.id,
        process_id
      }));

      if (productProcesses.length > 0) {
        const { error: ppError } = await supabase
          .from('product_processes')
          .insert(productProcesses);

        if (ppError) throw ppError;
      }

      // Update state
      setProducts(prevProducts => {
        if (productId) {
          return prevProducts.map(p => (p.id === productId ? upsertedProduct : p));
        } else {
          return [upsertedProduct, ...prevProducts];
        }
      });

      setEditingProduct(null);
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const handleProcessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProcess) return;

    const { name, description, further_reading_links, id: processId } = editingProcess;

    const processData = {
      name,
      description,
      further_reading_links
    };

    try {
      if (processId) {
        const { error } = await supabase
          .from('processes')
          .update(processData)
          .eq('id', processId);

        if (error) throw error;

        setProcesses(processes.map(p => 
          p.id === processId ? { ...p, name: name ?? p.name, description: description ?? p.description, further_reading_links: further_reading_links ?? p.further_reading_links } : p
        ));
      } else {
        const { data, error } = await supabase
          .from('processes')
          .insert(processData)
          .select()
          .single();

        if (error) throw error;

        setProcesses([...processes, data]);
      }

      setEditingProcess(null);
    } catch (error) {
      console.error('Error submitting process:', error);
    }
  };

  const handleCopyFromProduct = (sourceProduct: Product) => {
    if (!showProductSelector) return;

    setEditingProduct(prev => ({
      ...prev,
      [showProductSelector]: sourceProduct[showProductSelector]
    }));
    setShowProductSelector(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      const form = (e.target as HTMLElement).closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const CopyButton = ({ field }: { field: CopyField }) => (
    <button
      type="button"
      onClick={() => setShowProductSelector(field)}
      className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
    >
      <Copy size={14} className="ml-1" />
      העתק מצנצנת אחרת
    </button>
  );

  const ProductRow = ({ product }: { product: Product }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
      <div className="flex items-center space-x-4 space-x-reverse">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">{product.name}</div>
          <div className="text-sm text-gray-500 truncate">{product.what_is_it}</div>
        </div>
      </div>
      
      {product.featured && (
        <div className="flex items-center">
          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
            מומלץ
          </span>
        </div>
      )}
      
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            const productProcesses = product.product_processes?.map(pp => pp.process_id) || [];
            setSelectedProcesses(productProcesses);
            setEditingProduct(product);
          }}
          className="p-2 text-purple-600 hover:text-purple-900 transition-colors"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={() => handleDeleteProduct(product.id)}
          className="p-2 text-red-600 hover:text-red-900 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );

  const ProcessRow = ({ process }: { process: Process }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
      <div className="space-y-1">
        <div className="font-medium text-gray-900">{process.name}</div>
        <div className="text-sm text-gray-500 line-clamp-2">{process.description}</div>
        <div className="text-sm text-gray-500">
          {process.further_reading_links?.length || 0} קישורים
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setEditingProcess(process)}
          className="p-2 text-purple-600 hover:text-purple-900 transition-colors"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={() => handleDeleteProcess(process.id)}
          className="p-2 text-red-600 hover:text-red-900 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 max-w-full md:max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8">
          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 sm:flex-none min-h-[44px] px-6 py-3 rounded-lg text-base ${
                activeTab === 'products'
                  ? 'bg-purple-700 text-white'
                  : 'bg-white text-purple-700 hover:bg-purple-50'
              }`}
            >
              מוצרים
            </button>
            <button
              onClick={() => setActiveTab('processes')}
              className={`flex-1 sm:flex-none min-h-[44px] px-6 py-3 rounded-lg text-base ${
                activeTab === 'processes'
                  ? 'bg-purple-700 text-white'
                  : 'bg-white text-purple-700 hover:bg-purple-50'
              }`}
            >
              תהליכי הכנה
            </button>
            <button
              onClick={() => setActiveTab('cats')}
              className={`flex-1 sm:flex-none min-h-[44px] px-6 py-3 rounded-lg text-base ${
                activeTab === 'cats'
                  ? 'bg-purple-700 text-white'
                  : 'bg-white text-purple-700 hover:bg-purple-50'
              }`}
            >
              חתולים
            </button>
          </div>

          {/* Add Button */}
          {activeTab !== 'cats' && (
            <button
              onClick={() => activeTab === 'products' ? setEditingProduct({}) : setEditingProcess({})}
              className="w-full sm:w-auto min-h-[44px] bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-purple-800 transition-colors text-base"
            >
              <Plus size={20} className="ml-2" />
              {activeTab === 'products' ? 'הוספת מוצר' : 'הוספת תהליך'}
            </button>
          )}
        </div>

        {/* Content */}
        {activeTab === 'cats' ? (
          <CatGalleryAdmin />
        ) : (
          <div className="space-y-4">
            {/* Mobile List View */}
            <div className="block md:hidden space-y-4">
              {activeTab === 'products' ? (
                products.map(product => (
                  <ProductRow key={product.id} product={product} />
                ))
              ) : (
                processes.map(process => (
                  <ProcessRow key={process.id} process={process} />
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm">
              <div className="overflow-x-auto">
                {activeTab === 'products' ? (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">מוצר</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">סטטוס</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">פעולות</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="mr-4 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                                <div className="text-sm text-gray-500 truncate">{product.what_is_it}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {product.featured && (
                              <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                מומלץ
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-4 justify-end">
                              <button
                                onClick={() => {
                                  const productProcesses = product.product_processes?.map(pp => pp.process_id) || [];
                                  setSelectedProcesses(productProcesses);
                                  setEditingProduct(product);
                                }}
                                className="p-2 text-purple-600 hover:text-purple-900 transition-colors"
                              >
                                <Edit size={20} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-red-600 hover:text-red-900 transition-colors"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שם התהליך</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תיאור</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">קישורים</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">פעולות</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {processes.map((process) => (
                        <tr key={process.id}>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{process.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 line-clamp-2">{process.description}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {process.further_reading_links?.length || 0} קישורים
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-4 justify-end">
                              <button
                                onClick={() => setEditingProcess(process)}
                                className="p-2 text-purple-600 hover:text-purple-900 transition-colors"
                              >
                                <Edit size={20} />
                              </button>
                              <button
                                onClick={() => handleDeleteProcess(process.id)}
                                className="p-2 text-red-600 hover:text-red-900 transition-colors"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Product Edit Modal */}
        {editingProduct !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-purple-900 mb-6">
                  {editingProduct.id ? 'עריכת מוצר' : 'הוספת מוצר'}
                </h2>
                <form onSubmit={handleProductSubmit} onKeyDown={handleKeyDown} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      שם המוצר
                    </label>
                    <input
                      type="text"
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        מה זה?
                      </label>
                      <CopyButton field="what_is_it" />
                    </div>
                    <textarea
                      value={editingProduct.what_is_it || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, what_is_it: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        מה עושים עם זה?
                      </label>
                      <CopyButton field="what_to_do" />
                    </div>
                    <textarea
                      value={editingProduct.what_to_do || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, what_to_do: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        הוראות
                      </label>
                      <CopyButton field="instructions" />
                    </div>
                    <textarea
                      value={editingProduct.instructions || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, instructions: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      תמונה
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                          >
                            <span>העלאת קובץ</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                          <p className="pr-1">או גרור לכאן</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF עד 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      תהליכי הכנה
                    </label>
                    <div className="space-y-2">
                      {processes.map((process) => (
                        <label key={process.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedProcesses.includes(process.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProcesses([...selectedProcesses, process.id]);
                              } else {
                                setSelectedProcesses(selectedProcesses.filter(id => id !== process.id));
                              }
                            }}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="mr-2 text-gray-700">{process.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingProduct.featured || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="mr-2 text-gray-700">מוצר מומלץ</label>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                      ביטול
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
                    >
                      שמירה
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Product Selector Modal */}
        {showProductSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-purple-900 mb-6">
                  בחר צנצנת להעתקה
                </h2>
                <div className="space-y-4">
                  {products.filter(p => p.id !== editingProduct?.id).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleCopyFromProduct(product)}
                      className="w-full text-right bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate">{product.what_is_it}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowProductSelector(null)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Process Edit Modal */}
        {editingProcess !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-purple-900 mb-6">
                  {editingProcess.id ? 'עריכת תהליך' : 'הוספת תהליך'}
                </h2>
                <form onSubmit={handleProcessSubmit} onKeyDown={handleKeyDown} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      שם התהליך
                    </label>
                    <input
                      type="text"
                      value={editingProcess.name || ''}
                      onChange={(e) => setEditingProcess({ ...editingProcess, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      תיאור
                    </label>
                    <textarea
                      value={editingProcess.description || ''}
                      onChange={(e) => setEditingProcess({ ...editingProcess, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      קישורים להרחבת הידע
                    </label>
                    <div className="space-y-4">
                      {(editingProcess.further_reading_links || []).map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => {
                              const newLinks = [...(editingProcess.further_reading_links || [])];
                              newLinks[index] = { ...newLinks[index], title: e.target.value };
                              setEditingProcess({ ...editingProcess, further_reading_links: newLinks });
                            }}
                            placeholder="כותרת"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...(editingProcess.further_reading_links || [])];
                              newLinks[index] = { ...newLinks[index], url: e.target.value };
                              setEditingProcess({ ...editingProcess, further_reading_links: newLinks });
                            }}
                            placeholder="קישור"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newLinks = [...(editingProcess.further_reading_links || [])];
                              newLinks.splice(index, 1);
                              setEditingProcess({ ...editingProcess, further_reading_links: newLinks });
                            }}
                            className="p-2 text-red-600 hover:text-red-900"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newLinks = [...(editingProcess.further_reading_links || []), { title: '', url: '' }];
                          setEditingProcess({ ...editingProcess, further_reading_links: newLinks });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-purple-700 hover:bg-purple-50 transition-colors"
                      >
                        הוספת קישור
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setEditingProcess(null)}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                      ביטול
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
                    >
                      שמירה
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;