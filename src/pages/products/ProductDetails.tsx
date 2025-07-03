
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { QuoteRequestModal } from '@/components/QuoteRequestModal';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: string;
  image: string;
  status: string;
  created_at: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
        navigate('/products');
      } else {
        setProduct(data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestQuote = () => {
    if (!isAuthenticated) {
      toast.error('Please login to request a quote');
      navigate('/auth/client');
      return;
    }
    setShowQuoteModal(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      textiles: 'Textiles & Fabrics',
      electronics: 'Electronics & Audio',
    };
    return categoryMap[category] || category;
  };

  const getSubcategoryLabel = (category: string, subcategory: string) => {
    const subcategoryMap: { [key: string]: { [key: string]: string } } = {
      textiles: {
        cotton: 'Cotton Products',
        silk: 'Silk Products',
        garments: 'Ready-made Garments',
        home: 'Home Textiles'
      },
      electronics: {
        consumer: 'Consumer Electronics',
        industrial: 'Industrial Equipment',
        components: 'Electronic Components',
        accessories: 'Accessories'
      }
    };
    return subcategoryMap[category]?.[subcategory] || subcategory;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/products')}>
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/products')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <div className="text-lg">No Image Available</div>
                </div>
              )}
              
              {/* Action buttons overlay */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 hover:bg-white"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <Badge variant="outline" className="mb-2">
                {getCategoryLabel(product.category)}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">
                {getSubcategoryLabel(product.category, product.subcategory)}
              </p>
            </div>

            <div className="mb-6">
              <div className="text-3xl font-bold text-brand-blue mb-4">
                {product.price}
              </div>
              
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>

            {/* Action Buttons - Removed Email Inquiry Button */}
            <div className="space-y-3 mb-6">
              <Button 
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-lg py-3"
                onClick={handleRequestQuote}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Request Quote
              </Button>
            </div>

            {/* Product Information */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Product Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{getCategoryLabel(product.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subcategory:</span>
                  <span className="font-medium">{getSubcategoryLabel(product.category, product.subcategory)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="outline" className="text-xs">
                    {product.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>For detailed inquiries, please use the quote request form above.</p>
                  <p>Our team will respond within 24 hours with comprehensive information.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quote Request Modal */}
        <QuoteRequestModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          productId={product.id}
          productName={product.name}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
