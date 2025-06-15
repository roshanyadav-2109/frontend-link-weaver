
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description?: string | null;
  price: string;
  image?: string | null;
  status?: string | null;
}

const Categories: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Listen for real-time updates on the products table
  useEffect(() => {
    fetchProducts(); // initial fetch

    const channel = supabase
      .channel('realtime-products')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (_payload) => {
          // Instead of patching manually, re-fetch (simpler, more robust for now)
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-brand-blue">All Products</h2>
        <p className="text-gray-600 mb-10">Browse our export-quality product selection. This page is auto-updated from our backend in real time.</p>
        
        {loading && (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-brand-blue mr-3" />
            <span className="text-brand-blue font-semibold">Loading products ...</span>
          </div>
        )}

        {error && (
          <div className="py-8 text-center text-red-500 font-medium">{error}</div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="py-12 text-center text-gray-500">No products found. Please check back later.</div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border flex flex-col"
              >
                <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className="text-xs bg-brand-blue/90 text-white px-3">{product.category}</Badge>
                  </div>
                </div>
                <div className="flex-1 p-4 flex flex-col">
                  <h3 className="font-semibold text-lg text-brand-blue mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-gray-600 flex-1 line-clamp-2">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-brand-teal text-base">{product.price}</span>
                    <Badge className="ml-2" variant="secondary">
                      {product.subcategory}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
