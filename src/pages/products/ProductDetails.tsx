import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Share2, Star, Shield, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
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

  const getProductImage = (product: Product) => {
    if (product.image) return product.image;
    
    const categoryImages = {
      textiles: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      electronics: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80'
    };
    
    return categoryImages[product.category as keyof typeof categoryImages] || 
           'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1200&q=80';
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button 
            variant="ghost" 
            className="mb-6 hover:bg-brand-blue/10" 
            onClick={() => navigate('/products')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Enhanced Product Image with Animation */}
          <AnimatedCard className="bg-white/90 backdrop-blur-sm border-0 shadow-lg p-6">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              <motion.img 
                src={getProductImage(product)} 
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              />
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white backdrop-blur-sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </AnimatedCard>

          {/* Enhanced Product Details */}
          <AnimatedCard className="bg-white/90 backdrop-blur-sm border-0 shadow-lg p-6" delay={0.2}>
            <div className="mb-4">
              <Badge variant="outline" className="mb-2 bg-brand-blue/10 text-brand-blue border-brand-blue/20">
                {getCategoryLabel(product.category)}
              </Badge>
              
              <motion.h1 
                className="text-3xl font-bold text-gray-900 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {product.name}
              </motion.h1>
              
              <p className="text-lg text-gray-600 mb-4">
                {getSubcategoryLabel(product.category, product.subcategory)}
              </p>
            </div>

            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-3xl font-bold text-brand-blue mb-4 bg-gradient-to-r from-brand-blue to-brand-teal bg-clip-text text-transparent">
                {product.price}
              </div>
              
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}
            </motion.div>

            {/* Enhanced Trust Indicators */}
            <motion.div 
              className="grid grid-cols-3 gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-green-700 font-medium">Quality Assured</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-blue-700 font-medium">Fast Shipping</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-purple-700 font-medium">24/7 Support</p>
              </div>
            </motion.div>

            {/* Enhanced Action Button */}
            <motion.div 
              className="space-y-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full bg-gradient-to-r from-brand-blue to-brand-teal hover:from-brand-teal hover:to-brand-blue text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleRequestQuote}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Request Quote
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>

            {/* Product Information */}
            <AnimatedCard className="mt-6">
              <CardContent className="p-4">
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
              </CardContent>
            </AnimatedCard>

            {/* Contact Information */}
            <AnimatedCard className="mt-6">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>For detailed inquiries, please use the quote request form above.</p>
                  <p>Our team will respond within 24 hours with comprehensive information.</p>
                </div>
              </CardContent>
            </AnimatedCard>
          </AnimatedCard>
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
