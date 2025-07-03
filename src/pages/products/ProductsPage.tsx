import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { QuoteRequestModal } from '@/components/QuoteRequestModal';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: string;
  image: string;
  status: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null);
  
  const categories = [
    { value: 'textiles', label: 'Textiles & Fabrics' },
    { value: 'electronics', label: 'Electronics & Audio' },
  ];

  const subcategories: { [key: string]: { value: string; label: string }[] } = {
    textiles: [
      { value: 'cotton', label: 'Cotton Products' },
      { value: 'silk', label: 'Silk Products' },
      { value: 'garments', label: 'Ready-made Garments' },
      { value: 'home', label: 'Home Textiles' },
    ],
    electronics: [
      { value: 'consumer', label: 'Consumer Electronics' },
      { value: 'industrial', label: 'Industrial Equipment' },
      { value: 'components', label: 'Electronic Components' },
      { value: 'accessories', label: 'Accessories' },
    ],
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory, selectedSubcategory, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subcategory.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    // Filter by price range
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price.replace(/[^\d.]/g, ''));
        switch (priceRange) {
          case 'low': return price < 100;
          case 'medium': return price >= 100 && price < 500;
          case 'high': return price >= 500;
          default: return true;
        }
      });
    }

    setFilteredProducts(filtered);
  };

  const handleRequestQuote = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setShowQuoteModal(true);
  };

  const getCategoryLabel = (value: string) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  const getSubcategoryLabel = (category: string, value: string) => {
    const subs = subcategories[category] || [];
    const subcategory = subs.find(sub => sub.value === value);
    return subcategory ? subcategory.label : value;
  };

  const getProductImage = (product: Product) => {
    if (product.image) return product.image;
    
    // Category-specific placeholder images
    const categoryImages = {
      textiles: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      electronics: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80'
    };
    
    return categoryImages[product.category as keyof typeof categoryImages] || 
           'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover our extensive range of high-quality products</p>
        </motion.div>

        {/* Enhanced Filters with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AnimatedCard className="p-6 mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Subcategory Filter */}
              <Select 
                value={selectedSubcategory} 
                onValueChange={setSelectedSubcategory}
                disabled={selectedCategory === 'all'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Subcategories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {selectedCategory !== 'all' && subcategories[selectedCategory]?.map(sub => (
                    <SelectItem key={sub.value} value={sub.value}>
                      {sub.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Range Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under $100</SelectItem>
                  <SelectItem value="medium">$100 - $500</SelectItem>
                  <SelectItem value="high">Over $500</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex space-x-2">
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

            {/* Results count */}
            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Enhanced Products Grid/List with Staggered Animation */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredProducts.map((product, index) => (
              <AnimatedCard 
                key={product.id} 
                delay={index * 0.1}
                className="group overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {viewMode === 'grid' ? (
                  <div className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                      <motion.img 
                        src={getProductImage(product)} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div>
                      <Badge 
                        variant="outline" 
                        className="mb-2 text-xs bg-brand-blue/10 text-brand-blue border-brand-blue/20"
                      >
                        {getCategoryLabel(product.category)}
                      </Badge>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-blue transition-colors">
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {getSubcategoryLabel(product.category, product.subcategory)}
                      </p>
                      
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-brand-blue text-lg">{product.price}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-brand-blue to-brand-teal hover:from-brand-teal hover:to-brand-blue transition-all duration-300"
                          onClick={() => handleRequestQuote(product.id, product.name)}
                        >
                          Request Quote
                        </Button>
                        <Link to={`/products/${product.id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full group">
                            View Details
                            <motion.div
                              whileHover={{ x: 2 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </motion.div>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <div className="text-2xl">📦</div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(product.category)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-blue transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {getSubcategoryLabel(product.category, product.subcategory)}
                      </p>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-brand-blue">{product.price}</span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-brand-blue hover:bg-brand-blue/90"
                            onClick={() => handleRequestQuote(product.id, product.name)}
                          >
                            Request Quote
                          </Button>
                          <Link to={`/products/${product.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedSubcategory('all');
              setPriceRange('all');
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Quote Request Modal */}
        <QuoteRequestModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          productId={selectedProduct?.id}
          productName={selectedProduct?.name}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
