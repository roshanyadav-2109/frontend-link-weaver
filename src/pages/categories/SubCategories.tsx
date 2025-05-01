
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Filter, Search } from 'lucide-react';

// Sample products data structure
const productsData = {
  'electronics': {
    categoryName: 'Electronics',
    description: 'Components, devices, and equipment for various applications',
    subcategories: {
      'circuit-boards': {
        name: 'Circuit Boards',
        products: [
          {
            id: 'e1',
            name: 'High-Performance PCB',
            manufacturer: 'TechCircuits Inc.',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&h=200',
            description: 'Multilayer PCB designed for high-frequency applications'
          },
          {
            id: 'e2',
            name: 'Flexible Circuit Board',
            manufacturer: 'FlexTech Solutions',
            image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300&h=200',
            description: 'Flexible PCB ideal for space-constrained applications'
          },
          {
            id: 'e3',
            name: 'Power Distribution Board',
            manufacturer: 'PowerElectronics Co.',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&h=200',
            description: 'High current capacity PCB for power applications'
          }
        ]
      },
      'connectors': {
        name: 'Connectors',
        products: [
          {
            id: 'e4',
            name: 'USB Type-C Connector',
            manufacturer: 'ConnectTech Ltd.',
            image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=300&h=200',
            description: 'High-speed USB Type-C connector with waterproof design'
          }
        ]
      }
    }
  },
  'machinery': {
    categoryName: 'Machinery',
    description: 'Industrial machines, tools, and equipment for manufacturing',
    subcategories: {
      'assembly-equipment': {
        name: 'Assembly Equipment',
        products: [
          {
            id: 'm1',
            name: 'Automated Assembly Line',
            manufacturer: 'IndustrialTech Systems',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&h=200',
            description: 'Complete automated assembly system for electronics manufacturing'
          }
        ]
      }
    }
  }
};

const SubCategories: React.FC = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string, path: string }[]>([]);
  
  useEffect(() => {
    if (categoryId) {
      const category = productsData[categoryId as keyof typeof productsData];
      
      if (category) {
        setSelectedCategory(category);
        
        // Set up breadcrumbs
        const newBreadcrumbs = [
          { name: 'Home', path: '/' },
          { name: 'Categories', path: '/categories' },
          { name: category.categoryName, path: `/categories/${categoryId}` }
        ];
        
        if (subcategoryId && category.subcategories[subcategoryId]) {
          // If viewing a subcategory
          const subcategory = category.subcategories[subcategoryId];
          setProducts(subcategory.products || []);
          newBreadcrumbs.push({
            name: subcategory.name,
            path: `/categories/${categoryId}/${subcategoryId}`
          });
        } else {
          // If viewing the main category, collect all products from all subcategories
          const allProducts: any[] = [];
          Object.values(category.subcategories).forEach((subcategory: any) => {
            if (subcategory.products) {
              allProducts.push(...subcategory.products);
            }
          });
          setProducts(allProducts);
        }
        
        setBreadcrumbs(newBreadcrumbs);
      }
    }
  }, [categoryId, subcategoryId]);

  if (!selectedCategory) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Category not found</h1>
        <p className="mt-4">The category you're looking for doesn't exist.</p>
        <Link to="/categories" className="mt-6 inline-block text-brand-blue hover:underline">
          Return to categories
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex flex-wrap items-center text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-brand-blue">{crumb.name}</span>
                ) : (
                  <Link to={crumb.path} className="hover:text-brand-teal">{crumb.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        
        {/* Category header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-brand-blue mb-2">
            {subcategoryId 
              ? selectedCategory.subcategories[subcategoryId]?.name 
              : selectedCategory.categoryName}
          </h1>
          <p className="text-gray-600">
            {selectedCategory.description}
          </p>
        </header>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar/filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-brand-blue">Filters</h2>
                <Filter size={18} className="text-gray-500" />
              </div>
              
              {/* Category list */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-gray-700">Subcategories</h3>
                <ul className="space-y-1">
                  {Object.entries(selectedCategory.subcategories).map(([id, subcat]: [string, any]) => (
                    <li key={id}>
                      <Link 
                        to={`/categories/${categoryId}/${id}`} 
                        className={`block py-1 px-2 rounded ${subcategoryId === id ? 'bg-brand-teal/10 text-brand-teal font-medium' : 'hover:bg-gray-100'}`}
                      >
                        {subcat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Manufacturer filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-gray-700">Manufacturers</h3>
                <div className="space-y-2">
                  {Array.from(new Set(products.map(p => p.manufacturer))).map((manufacturer, idx) => (
                    <div key={idx} className="flex items-center">
                      <input type="checkbox" id={`mfr-${idx}`} className="mr-2" />
                      <label htmlFor={`mfr-${idx}`} className="text-sm">{manufacturer}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
          </div>
          
          {/* Main content - Products */}
          <div className="lg:w-3/4">
            {/* Search and sort */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="relative w-full md:w-72 mb-4 md:mb-0">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal"
                />
                <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                <select className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm">
                  <option>Newest</option>
                  <option>Name (A-Z)</option>
                  <option>Name (Z-A)</option>
                </select>
              </div>
            </div>
            
            {/* Products grid */}
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No products found</h2>
                <p className="text-gray-600 mb-4">There are no products available in this category yet.</p>
                <Link to="/categories" className="text-brand-blue hover:underline">
                  Browse other categories
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="card group cursor-pointer">
                      <div className="h-48 overflow-hidden rounded-t-lg">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-brand-blue group-hover:text-brand-teal transition-colors">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">By {product.manufacturer}</p>
                        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <Link to={`/catalog-request?product=${product.id}`}>
                            <Button size="sm" variant="outline">Request Info</Button>
                          </Link>
                          <span className="text-brand-teal text-sm font-medium cursor-pointer flex items-center">
                            Details <ArrowRight className="ml-1 h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100">
                      <ArrowLeft size={16} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border bg-brand-blue text-white">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100">3</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {/* Request catalog banner */}
            <div className="mt-12 bg-gradient-to-r from-brand-blue to-brand-teal text-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold mb-2">Need a complete product catalog?</h3>
                  <p className="text-white/80">Request detailed information about products in this category</p>
                </div>
                <Link to="/catalog-request">
                  <Button variant="secondary" className="bg-white text-brand-blue hover:bg-gray-100">
                    Request Catalog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategories;
