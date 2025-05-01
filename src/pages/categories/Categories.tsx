
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  { 
    id: 'electronics', 
    name: 'Electronics', 
    description: 'Components, devices, and equipment for various applications',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&h=200',
    subcategories: ['Circuit Boards', 'Connectors', 'Displays', 'Power Supplies', 'Sensors']
  },
  { 
    id: 'machinery', 
    name: 'Machinery', 
    description: 'Industrial machines, tools, and equipment for manufacturing',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&h=200',
    subcategories: ['Assembly Equipment', 'Cutting Machines', 'Fabrication Tools', 'Packaging Machinery', 'Testing Equipment'] 
  },
  { 
    id: 'building-materials', 
    name: 'Building Materials', 
    description: 'Construction materials, supplies, and hardware components',
    image: 'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?auto=format&fit=crop&w=300&h=200',
    subcategories: ['Concrete Products', 'Insulation', 'Lumber & Timber', 'Roofing Materials', 'Structural Steel']
  },
  { 
    id: 'packaging', 
    name: 'Packaging', 
    description: 'Solutions for product protection, presentation, and shipping',
    image: 'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?auto=format&fit=crop&w=300&h=200',
    subcategories: ['Bottles & Containers', 'Cardboard & Paper', 'Flexible Packaging', 'Pallets & Crates', 'Protective Packaging']
  },
  { 
    id: 'textiles', 
    name: 'Textiles', 
    description: 'Fabrics, fibers, and materials for various industries',
    image: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=300&h=200',
    subcategories: ['Apparel Fabrics', 'Industrial Textiles', 'Leather & Synthetics', 'Technical Fabrics', 'Upholstery Materials']
  },
  { 
    id: 'chemicals', 
    name: 'Chemicals', 
    description: 'Industrial chemicals, compounds, and raw materials',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=300&h=200',
    subcategories: ['Adhesives & Sealants', 'Cleaning Chemicals', 'Coating Materials', 'Industrial Solvents', 'Specialty Compounds']
  },
  { 
    id: 'automotive', 
    name: 'Automotive', 
    description: 'Parts, components, and materials for vehicle manufacturing',
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=300&h=200',
    subcategories: ['Body Components', 'Electrical Systems', 'Engine Parts', 'Interior Components', 'Suspension & Steering']
  },
  { 
    id: 'plastics', 
    name: 'Plastics & Rubber', 
    description: 'Polymer materials and components for industrial applications',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=300&h=200',
    subcategories: ['Injection Molded Parts', 'Plastic Films', 'Plastic Sheets', 'Rubber Components', 'Thermoplastics']
  },
];

const Categories: React.FC = () => {
  return (
    <div className="bg-brand-light min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-brand-blue mb-2">Product Categories</h1>
            <p className="text-gray-600">Browse our extensive range of product categories from verified manufacturers</p>
          </div>
          
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative max-w-md mx-auto md:mx-0">
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-teal">
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="card hover:shadow-xl">
              <div className="h-40 overflow-hidden rounded-t-lg">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-brand-blue mb-2">{category.name}</h2>
                <p className="text-gray-600 mb-4">{category.description}</p>
                
                <h3 className="text-sm font-medium text-gray-500 mb-2">Popular subcategories:</h3>
                <ul className="mb-6">
                  {category.subcategories.slice(0, 3).map((subcat, index) => (
                    <li key={index} className="text-sm text-gray-600 mb-1">
                      <Link to={`/categories/${category.id}/${subcat.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-brand-teal">
                        • {subcat}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                <Link to={`/categories/${category.id}`} className="inline-flex items-center text-brand-teal font-medium hover:underline">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-brand-blue mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our team can help you source products from our network of trusted manufacturers. Contact us with your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact">
              <Button className="bg-brand-blue hover:bg-brand-blue/90">Contact Us</Button>
            </Link>
            <Link to="/catalog-request">
              <Button className="bg-brand-teal hover:bg-brand-teal/90">Request Catalog</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
