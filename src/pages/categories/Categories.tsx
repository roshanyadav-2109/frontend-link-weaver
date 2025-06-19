
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

const Categories: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const categories = [
    { value: 'textiles', label: 'Textiles & Fabrics' },
    { value: 'electronics', label: 'Electronics & Audio' },
    { value: 'handicrafts', label: 'Handicrafts & Artisan' },
    { value: 'organic', label: 'Organic Products' },
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
    handicrafts: [
      { value: 'pottery', label: 'Pottery & Ceramics' },
      { value: 'jewelry', label: 'Handmade Jewelry' },
      { value: 'woodwork', label: 'Woodwork' },
      { value: 'metalwork', label: 'Metalwork' },
    ],
    organic: [
      { value: 'food', label: 'Organic Food' },
      { value: 'cosmetics', label: 'Natural Cosmetics' },
      { value: 'herbs', label: 'Herbs & Spices' },
      { value: 'supplements', label: 'Health Supplements' },
    ],
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory, selectedSubcategory]);

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

    setFilteredProducts(filtered);
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
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover our extensive range of high-quality products</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className={viewMode === 'grid' ? 'p-4' : 'p-4 flex items-center space-x-4'}>
                  {viewMode === 'grid' ? (
                    <>
                      <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-gray-400 text-center">
                            <div className="text-4xl mb-2">📦</div>
                            <div className="text-sm">No Image</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-blue transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {getCategoryLabel(product.category)} • {getSubcategoryLabel(product.category, product.subcategory)}
                        </p>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-brand-blue">{product.price}</span>
                          <Link 
                            to={`/product/${product.id}`}
                            className="text-brand-blue hover:text-brand-red transition-colors inline-flex items-center text-sm"
                          >
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-blue transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {getCategoryLabel(product.category)} • {getSubcategoryLabel(product.category, product.subcategory)}
                        </p>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-brand-blue">{product.price}</span>
                          <Link 
                            to={`/product/${product.id}`}
                            className="text-brand-blue hover:text-brand-red transition-colors inline-flex items-center text-sm"
                          >
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedSubcategory('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
