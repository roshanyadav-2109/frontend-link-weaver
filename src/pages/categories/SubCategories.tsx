import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { QuoteRequestModal } from '@/components/QuoteRequestModal';
import { useState } from 'react';

// Define categories and their subcategories
const categoryData = {
  textiles: {
    name: 'Textile Clothing',
    description: 'Handcrafted fabrics, garments, and home textiles with traditional artistry and modern precision.',
    image: 'https://images.unsplash.com/photo-1618520422828-41a3e03f7ee0?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      { id: 'cotton', name: 'Cotton Products' },
      { id: 'silk', name: 'Silk & Luxury Fabrics' },
      { id: 'garments', name: 'Ready-made Garments' },
      { id: 'home', name: 'Home Textiles' }
    ]
  },
  electronics: {
    name: 'Electronic Audios',
    description: 'Modern technology and electronic audio products meeting global standards for quality and reliability.',
    image: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      { id: 'consumer', name: 'Consumer Audio Devices' },
      { id: 'components', name: 'Audio Components' },
      { id: 'accessories', name: 'Accessories & Peripherals' },
      { id: 'industrial', name: 'Professional Audio Equipment' }
    ]
  }
};

// Dummy products for each subcategory
const generateProducts = (count: number) => {
  return Array(count).fill(null).map((_, index) => ({
    id: `product-${index + 1}`,
    name: `Product ${index + 1}`,
    description: 'High quality export product with competitive pricing.',
    image: `https://images.unsplash.com/photo-${1550000000 + index * 10000}?auto=format&fit=crop&w=300&q=80`,
    price: `$${Math.floor(Math.random() * 900) + 100}`
  }));
};

const SubCategories = () => {
  const { categoryId, subcategoryId } = useParams();
  const category = categoryId ? categoryData[categoryId as keyof typeof categoryData] : null;
  
  // Modal state for opening QuoteRequestModal with correct product
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id?: string;
    name?: string;
  }>({});

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Category not found</h2>
        <p className="mt-4">The category you're looking for doesn't exist.</p>
        <Link to="/categories">
          <Button className="mt-6">Back to Categories</Button>
        </Link>
      </div>
    );
  }

  // If subcategoryId is provided, show products for that subcategory
  if (subcategoryId) {
    const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
    
    if (!subcategory) {
      return (
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold">Subcategory not found</h2>
          <p className="mt-4">The subcategory you're looking for doesn't exist.</p>
          <Link to={`/categories/${categoryId}`}>
            <Button className="mt-6">Back to {category.name}</Button>
          </Link>
        </div>
      );
    }
    
    const products = generateProducts(8);
    
    return (
      <div>
        <div className="bg-brand-blue py-12">
          <div className="container mx-auto px-4">
            <Link to={`/categories/${categoryId}`} className="text-white hover:underline inline-flex items-center mb-4">
              &larr; Back to {category.name}
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {subcategory.name}
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-3xl">
              Reliable Quality, Certified Sources. Dive into our curated selection of {subcategory.name.toLowerCase()} trusted by global buyers.
            </p>
          </div>
        </div>

        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <div className="h-48 bg-gray-200">
                    {/* Placeholder for product image */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">Product Image</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-brand-blue">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-brand-teal font-medium">{product.price}</span>
                      <div className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProduct({ id: product.id, name: product.name });
                            setModalOpen(true);
                          }}
                        >
                          Request Quote
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/catalog-request">
                <Button className="bg-brand-teal hover:bg-brand-teal/90">
                  Request Full Product Catalogue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <QuoteRequestModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
        />
      </div>
    );
  }
  
  // Otherwise, show subcategories for the selected category
  return (
    <div>
      <div 
        className="bg-cover bg-center py-16" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${category.image})`,
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4">
          <Link to="/categories" className="text-white hover:underline inline-flex items-center mb-4">
            &larr; Back to All Categories
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {category.name}
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-3xl">
            {category.description}
          </p>
        </div>
      </div>
      
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                to={`/categories/${categoryId}/${subcategory.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all p-8 flex items-center justify-between group"
              >
                <h3 className="text-xl font-semibold text-brand-blue">
                  {subcategory.name}
                </h3>
                <ArrowRight className="text-brand-teal group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/catalog-request">
              <Button className="bg-brand-teal hover:bg-brand-teal/90">
                Request Full Product Catalogue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategories;
