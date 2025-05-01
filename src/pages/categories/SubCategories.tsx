import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Define categories and their subcategories
const categoryData = {
  agriculture: {
    name: 'Agriculture & Food Products',
    description: 'Premium grains, spices, vegetables, fruits, and processed foods from India's fertile lands.',
    image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      { id: 'grains', name: 'Grains & Pulses' },
      { id: 'spices', name: 'Spices & Herbs' },
      { id: 'fruits', name: 'Fresh & Dried Fruits' },
      { id: 'processed', name: 'Processed Foods' }
    ]
  },
  textiles: {
    name: 'Textiles & Fabrics',
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
    name: 'Electronics & Components',
    description: 'Modern technology and electronic components meeting global standards for quality and reliability.',
    image: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      { id: 'consumer', name: 'Consumer Electronics' },
      { id: 'components', name: 'Electronic Components' },
      { id: 'accessories', name: 'Accessories & Peripherals' },
      { id: 'industrial', name: 'Industrial Electronics' }
    ]
  },
  handicrafts: {
    name: 'Handicrafts & Decor',
    description: 'Authentic handmade crafts, décor items, and artisanal products representing India's rich heritage.',
    image: 'https://images.unsplash.com/photo-1503455637927-730bce8583c0?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      { id: 'wooden', name: 'Wooden Handicrafts' },
      { id: 'metal', name: 'Metal Crafts' },
      { id: 'pottery', name: 'Pottery & Ceramics' },
      { id: 'decor', name: 'Home Decor Items' }
    ]
  },
  leather: {
    name: 'Leather Products',
    description: 'Premium leather goods, footwear, and accessories crafted with precision and durability.',
    image: 'https://images.unsplash.com/photo-1585457288043-7f871a128428?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      { id: 'footwear', name: 'Footwear' },
      { id: 'bags', name: 'Bags & Luggage' },
      { id: 'accessories', name: 'Fashion Accessories' },
      { id: 'furniture', name: 'Leather Furniture' }
    ]
  },
  chemicals: {
    name: 'Chemicals & Pharmaceuticals',
    description: 'Industrial chemicals, pharmaceutical ingredients, and formulations meeting international standards.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      { id: 'industrial', name: 'Industrial Chemicals' },
      { id: 'pharma', name: 'Pharmaceutical Products' },
      { id: 'cosmetic', name: 'Cosmetic Chemicals' },
      { id: 'agro', name: 'Agro Chemicals' }
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
                        <Button size="sm" variant="outline">Request Quote</Button>
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
