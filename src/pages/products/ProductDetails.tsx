
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Package, ShoppingCart, FileText } from 'lucide-react';
import { QuoteRequestModal } from '@/components/QuoteRequestModal';
import { toast } from 'sonner';

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

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('status', 'active')
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          toast.error('Product not found');
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/products">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/products" 
            className="inline-flex items-center text-brand-blue hover:text-brand-blue/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <Package className="h-24 w-24 mx-auto mb-4" />
                    <p className="text-lg">No Image Available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-brand-blue border-brand-blue">
                  {product.category}
                </Badge>
                <Badge variant="secondary">
                  {product.subcategory}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="text-2xl font-bold text-brand-blue mb-6">{product.price}</div>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={() => setModalOpen(true)}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-6 text-lg"
                size="lg"
              >
                <FileText className="h-5 w-5 mr-2" />
                Request Quote for This Product
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Link to="/catalog-request">
                  <Button variant="outline" className="w-full" size="lg">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Request Catalog
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="w-full" size="lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Subcategory:</span>
                    <span className="font-medium">{product.subcategory}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-brand-blue">{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Available
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quote Request Modal */}
        <QuoteRequestModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          productId={product.id}
          productName={product.name}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
