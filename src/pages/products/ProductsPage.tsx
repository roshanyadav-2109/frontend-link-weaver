
import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { AnimatedCard } from '@/components/ui/animated-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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

// High-quality product images
const productImages = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop'
];

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
        // Assign random high-quality images to products
        const productsWithImages = (data || []).map((product, index) => ({
          ...product,
          image: product.image || productImages[index % productImages.length]
        }));
        setProducts(productsWithImages);
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

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subcategory.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

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
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover our extensive range of high-quality products</p>
        </div>

        {/* Advanced Filters */}
        <AnimatedCard className="mb-8" delay={200}>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-brand-blue/20">
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

              <Select 
                value={selectedSubcategory} 
                onValueChange={setSelectedSubcategory}
                disabled={selectedCategory === 'all'}
              >
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-brand-blue/20">
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

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-brand-blue/20">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under $100</SelectItem>
                  <SelectItem value="medium">$100 - $500</SelectItem>
                  <SelectItem value="high">Over $500</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="transition-all duration-200"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="transition-all duration-200"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </AnimatedCard>

        {/* Products Grid/List */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredProducts.map((product, index) => (
              <AnimatedCard 
                key={product.id} 
                hoverEffect="lift"
                delay={index * 100}
                className="group"
              >
                <Card className="h-full overflow-hidden">
                  <CardContent className={viewMode === 'grid' ? 'p-4' : 'p-4 flex items-center space-x-4'}>
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2 text-xs animate-slide-in-right">
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
                            <span className="font-semibold text-brand-blue">{product.price}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-brand-blue hover:bg-brand-blue/90 transition-all duration-200"
                              onClick={() => handleRequestQuote(product.id, product.name)}
                            >
                              Request Quote
                            </Button>
                            <Link 
                              to={`/products/${product.id}`}
                              className="flex-1"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full transition-all duration-200 hover:bg-gray-50"
                              >
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
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
                                className="bg-brand-blue hover:bg-brand-blue/90 transition-all duration-200"
                                onClick={() => handleRequestQuote(product.id, product.name)}
                              >
                                Request Quote
                              </Button>
                              <Link to={`/products/${product.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="transition-all duration-200 hover:bg-gray-50"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <AnimatedCard className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSubcategory('all');
                setPriceRange('all');
              }}
              className="transition-all duration-200 hover:scale-105"
            >
              Clear Filters
            </Button>
          </AnimatedCard>
        )}

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
