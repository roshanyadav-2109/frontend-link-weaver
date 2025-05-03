
import React, { useEffect } from 'react';
import CatalogRequestForm, { ProductInfo } from '@/components/CatalogRequestForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductTracking } from '@/hooks/useProductTracking';

const CatalogRequest: React.FC = () => {
  const { viewedProducts } = useProductTracking();
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    // Navigate back to homepage or thank you page
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div className="pt-24 bg-gradient-to-b from-[#f0f9ff] to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-4">Request Product Catalog</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete the form below to request detailed product catalogs tailored to your business needs. Our team will promptly send you the information you need to make informed sourcing decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CatalogRequestForm 
                preselectedProducts={viewedProducts.slice(0, 3)} 
                onSuccess={handleSuccess}
              />
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-blue-100 shadow-premium p-6 sticky top-28">
                <h3 className="text-xl font-bold text-[#1a365d] mb-4">Why Request Our Catalog?</h3>
                
                <ul className="space-y-4">
                  {[
                    {
                      title: 'Comprehensive Product Range',
                      description: 'Access our extensive collection of high-quality products across multiple categories.'
                    },
                    {
                      title: 'Detailed Specifications',
                      description: 'Get complete technical details, dimensions, materials, and available customizations.'
                    },
                    {
                      title: 'Competitive Pricing',
                      description: 'View our competitive pricing structures with volume-based discounts.'
                    },
                    {
                      title: 'Custom Solutions',
                      description: 'Discover our custom manufacturing capabilities tailored to your requirements.'
                    }
                  ].map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#d9eafb] flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="h-2 w-2 rounded-full bg-[#1a365d]"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1a365d]">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {viewedProducts.length === 0 && (
                  <div className="mt-6">
                    <Link to="/categories">
                      <Button className="w-full bg-[#1a365d] hover:bg-[#0f2341] text-white">
                        Browse Products First
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Need immediate assistance? Contact our team directly:
                  </p>
                  <a href="mailto:info@anantyaoverseas.com" className="text-[#2d6da3] font-medium hover:underline text-sm block mt-1">
                    info@anantyaoverseas.com
                  </a>
                  <a href="tel:+919876543210" className="text-[#2d6da3] font-medium hover:underline text-sm block">
                    +91 9876 543 210
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogRequest;
