
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
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

const categories = [
  {
    id: 'textiles',
    name: 'Textile Clothing',
    description: 'Handcrafted fabrics, garments, and home textiles with traditional artistry and modern precision.',
    image: 'https://images.unsplash.com/photo-1618520422828-41a3e03f7ee0?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      { id: 'cotton', name: 'Cotton Products' },
      { id: 'silk', name: 'Silk & Luxury Fabrics' },
      { id: 'garments', name: 'Ready-made Garments' },
      { id: 'home', name: 'Home Textiles' }
    ]
  },
  {
    id: 'electronics',
    name: 'Electronic Audios',
    description: 'Modern technology and electronic audio products meeting global standards for quality and reliability.',
    image: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      { id: 'consumer', name: 'Consumer Audio Devices' },
      { id: 'components', name: 'Audio Components' },
      { id: 'accessories', name: 'Accessories & Peripherals' },
      { id: 'industrial', name: 'Professional Audio Equipment' }
    ]
  }
];

const Categories: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
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
      .channel('realtime-products-public')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Real-time product update:', payload);
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => product.category === categoryId);
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-brand-blue text-center">Product Categories</h1>
        <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Explore our comprehensive range of export-quality products. From traditional textiles to modern electronics, 
          we connect global buyers with premium Indian manufacturers.
        </p>
        
        {loading && (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-brand-blue mr-3" />
            <span className="text-brand-blue font-semibold">Loading categories...</span>
          </div>
        )}

        {error && (
          <div className="py-8 text-center text-red-500 font-medium">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-16">
            {categories.map((category) => {
              const categoryProducts = getProductsByCategory(category.id);
              
              return (
                <div key={category.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div 
                    className="bg-cover bg-center h-64 relative"
                    style={{ 
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.image})`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h2 className="text-3xl font-bold mb-2">{category.name}</h2>
                        <p className="text-lg opacity-90 max-w-2xl">{category.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-semibold text-brand-blue">
                        Featured {category.name} Products
                      </h3>
                      <Link 
                        to={`/categories/${category.id}`}
                        className="flex items-center text-brand-teal hover:text-brand-teal/80 font-medium"
                      >
                        View All <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                    
                    {categoryProducts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categoryProducts.slice(0, 4).map((product) => (
                          <Link
                            to={`/products/${product.id}`}
                            key={product.id}
                            className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow border"
                          >
                            <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                                  No Image Available
                                </div>
                              )}
                              <div className="absolute top-2 left-2">
                                <Badge variant="outline" className="text-xs bg-white/90 text-brand-blue">
                                  {product.subcategory}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-brand-blue mb-2 line-clamp-2">{product.name}</h4>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-brand-teal">{product.price}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <p>No products available in this category yet.</p>
                        <p className="text-sm mt-2">Check back soon for new additions!</p>
                      </div>
                    )}
                    
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          to={`/categories/${category.id}/${subcategory.id}`}
                          className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition-colors group"
                        >
                          <span className="text-sm font-medium text-brand-blue group-hover:text-brand-teal">
                            {subcategory.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
