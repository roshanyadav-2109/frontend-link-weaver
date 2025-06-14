
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, MessageSquare, Star, Shield, Truck, Award, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AdvancedQuoteForm from '@/components/AdvancedQuoteForm';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
  const [showAdvancedQuote, setShowAdvancedQuote] = useState(false);
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
      <div className="flex items-center justify-center min-h-[500px] bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-blue mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-20 text-center bg-gray-50 min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist'}</p>
          <Link to="/categories">
            <Button className="bg-brand-blue hover:bg-brand-blue/90">
              <ArrowLeft className="mr-2 h-4 w-4" /> Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleQuoteSuccess = () => {
    setShowAdvancedQuote(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <Link to="/categories" className="inline-flex items-center text-brand-blue hover:text-brand-teal transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="animate-fade-in">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-6 left-6 flex gap-2 z-20">
                <Badge className="bg-green-500 text-white">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
                <Badge className="bg-brand-teal text-white">
                  Export Quality
                </Badge>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-fade-in animate-delay-200">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="ml-2 text-gray-600">(4.9) · 127 reviews</span>
                </div>
              </div>
              
              <div className="text-2xl font-bold text-brand-teal mb-6">
                {product.price}
              </div>
              
              <div className="flex items-center gap-3 mb-8">
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-sm">
                  {product.subcategory}
                </Badge>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Product Description</h3>
              <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
            </div>
            
            <Button 
              onClick={() => setShowAdvancedQuote(true)}
              className="w-full bg-gradient-to-r from-brand-teal to-brand-blue hover:from-brand-blue hover:to-brand-teal text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mb-8"
              size="lg"
            >
              <MessageSquare className="mr-3 h-6 w-6" />
              Get Detailed Quote
            </Button>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Shield, title: "Quality Assured", desc: "Premium export quality" },
                { icon: Truck, title: "Fast Shipping", desc: "Global delivery" },
                { icon: Award, title: "Certified", desc: "ISO standards" },
                { icon: Globe, title: "Worldwide", desc: "Available globally" }
              ].map((feature, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <feature.icon className="h-8 w-8 text-brand-teal mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Our Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: "✓",
                    title: "Premium Export Quality",
                    desc: "Materials sourced and processed to meet international standards"
                  },
                  {
                    icon: "✓", 
                    title: "Competitive Pricing",
                    desc: "Best rates for bulk orders with flexible payment terms"
                  },
                  {
                    icon: "✓",
                    title: "Customization Available", 
                    desc: "Tailored solutions to meet your specific requirements"
                  },
                  {
                    icon: "✓",
                    title: "Reliable Shipping",
                    desc: "Trusted logistics partners for worldwide destinations"
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                    <div className="bg-gradient-to-r from-green-400 to-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg group-hover:shadow-xl transition-shadow">
                      {item.icon}
                    </div>
                    <h4 className="font-semibold text-lg mb-2 text-gray-900">{item.title}</h4>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advanced Quote Form Modal */}
      {showAdvancedQuote && (
        <AdvancedQuoteForm
          product={product}
          onClose={() => setShowAdvancedQuote(false)}
          onSuccess={handleQuoteSuccess}
        />
      )}
    </div>
  );
};

export default ProductDetails;
