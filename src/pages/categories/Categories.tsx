
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight, Filter, Search, Grid, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      setFilteredProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products.');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Listen for real-time updates on the products table
  useEffect(() => {
    fetchProducts();

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

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    // Price filter (basic implementation)
    if (priceFilter !== 'all') {
      // This is a simplified price filter - you may want to implement actual price parsing
      if (priceFilter === 'low') {
        filtered = filtered.filter(product => product.price.includes('$') && parseInt(product.price.replace(/[^0-9]/g, '')) < 100);
      } else if (priceFilter === 'medium') {
        filtered = filtered.filter(product => {
          const price = parseInt(product.price.replace(/[^0-9]/g, ''));
          return price >= 100 && price <= 500;
        });
      } else if (priceFilter === 'high') {
        filtered = filtered.filter(product => parseInt(product.price.replace(/[^0-9]/g, '')) > 500);
      }
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedSubcategory, priceFilter]);

  const getProductsByCategory = (categoryId: string) => {
    return filteredProducts.filter(product => product.category === categoryId);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setPriceFilter('all');
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50 pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-brand-blue text-center">Product Categories</h1>
        <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Explore our comprehensive range of export-quality products. From traditional textiles to modern electronics, 
          we connect global buyers with premium Indian manufacturers.
        </p>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-brand-blue" />
                <h3 className="text-lg font-semibold">Filter Products</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="textiles">Textile Clothing</SelectItem>
                  <SelectItem value="electronics">Electronic Audios</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  <SelectItem value="cotton">Cotton Products</SelectItem>
                  <SelectItem value="silk">Silk & Luxury Fabrics</SelectItem>
                  <SelectItem value="garments">Ready-made Garments</SelectItem>
                  <SelectItem value="home">Home Textiles</SelectItem>
                  <SelectItem value="consumer">Consumer Audio Devices</SelectItem>
                  <SelectItem value="components">Audio Components</SelectItem>
                  <SelectItem value="accessories">Accessories & Peripherals</SelectItem>
                  <SelectItem value="industrial">Professional Audio Equipment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under $100</SelectItem>
                  <SelectItem value="medium">$100 - $500</SelectItem>
                  <SelectItem value="high">Above $500</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
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
                        Featured {category.name} Products ({categoryProducts.length})
                      </h3>
                      <Link 
                        to={`/categories/${category.id}`}
                        className="flex items-center text-brand-teal hover:text-brand-teal/80 font-medium"
                      >
                        View All <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                    
                    {categoryProducts.length > 0 ? (
                      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
                        {categoryProducts.slice(0, viewMode === 'grid' ? 4 : 8).map((product) => (
                          <Link
                            to={`/product/${product.id}`}
                            key={product.id}
                            className={`group bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow border ${
                              viewMode === 'list' ? 'flex items-center p-4' : ''
                            }`}
                          >
                            <div className={`bg-gray-100 relative overflow-hidden ${
                              viewMode === 'list' ? 'h-24 w-24 flex-shrink-0 mr-4' : 'h-48 w-full'
                            }`}>
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
                              {viewMode === 'grid' && (
                                <div className="absolute top-2 left-2">
                                  <Badge variant="outline" className="text-xs bg-white/90 text-brand-blue">
                                    {product.subcategory}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className={viewMode === 'list' ? 'flex-1' : 'p-4'}>
                              <h4 className="font-semibold text-brand-blue mb-2 line-clamp-2">{product.name}</h4>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-brand-teal">{product.price}</span>
                                {viewMode === 'list' && (
                                  <Badge variant="outline" className="text-xs">
                                    {product.subcategory}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <p>No products found matching your filters.</p>
                        <p className="text-sm mt-2">Try adjusting your search criteria!</p>
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
