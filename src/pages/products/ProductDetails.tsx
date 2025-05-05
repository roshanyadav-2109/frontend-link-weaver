
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, MessageSquare } from 'lucide-react';
import { QuoteRequestModal } from '@/components/QuoteRequestModal';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: string;
  image: string;
  status: 'active' | 'draft';
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setProduct(data as Product);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-gray-600 mb-6">{error || 'Product not found'}</p>
        <Link to="/categories">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Browse All Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link to="/categories" className="inline-flex items-center text-brand-blue hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="text-lg text-brand-teal font-medium mb-4">
            {product.price}
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {product.category}
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {product.subcategory}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          <Button 
            onClick={() => setQuoteModalOpen(true)}
            className="w-full bg-brand-teal hover:bg-brand-teal/90"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Get Quote
          </Button>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium mb-3">Why Choose Our Products</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                <span>Premium export quality materials</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                <span>Competitive pricing for bulk orders</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                <span>Customization options available</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                <span>Reliable shipping to worldwide destinations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <QuoteRequestModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        productId={product.id}
        productName={product.name}
      />
    </div>
  );
};

export default ProductDetails;
