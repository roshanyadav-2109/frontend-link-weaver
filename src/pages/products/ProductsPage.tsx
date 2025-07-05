
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Filter } from 'lucide-react';
import { toast } from 'sonner';
import QuoteRequestModal from '@/components/QuoteRequestModal';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string | null;
  price: string;
  image: string | null;
  status: string;
  created_at: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    console.log('ProductsPage: Component mounted, fetching products...');
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('ProductsPage: Fetching products from Supabase...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('ProductsPage: Error fetching products:', error);
        toast.error('Failed to load products');
        return;
      }

      console.log('ProductsPage: Products fetched successfully:', data?.length || 0);
      setProducts(data || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set((data || []).map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('ProductsPage: Unexpected error:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleQuoteRequest = (product: Product) => {
    setSelectedProduct(product);
    setShowQuoteModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Products
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover our wide range of high-quality products for global export
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              className="pl-10"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={20} />
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {product.subcategory}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-brand-blue">
                      {product.price}
                    </span>
                    <Button 
                      size="sm" 
                      onClick={() => handleQuoteRequest(product)}
                      className="bg-brand-blue hover:bg-brand-blue/90"
                    >
                      Get Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory ? 
                'Try adjusting your search or filter criteria.' : 
                'Products will be displayed here once available.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Quote Request Modal */}
      <QuoteRequestModal
        isOpen={showQuoteModal}
        onClose={() => {
          setShowQuoteModal(false);
          setSelectedProduct(null);
        }}
        productName={selectedProduct?.name || ''}
        productId={selectedProduct?.id}
      />
    </div>
  );
};

export default ProductsPage;
