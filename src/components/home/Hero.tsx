
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="bg-brand-light py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-blue mb-4 leading-tight">
              Connect with Leading Manufacturers
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              LinkWeaver brings together quality manufacturers and clients in one seamless platform, 
              making it easier to discover products and build valuable business relationships.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/categories">
                <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-5 rounded">
                  Browse Products <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/catalog-request">
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-6 py-5 rounded">
                  Request Catalog
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 animate-fade-in">
              <h2 className="text-2xl font-semibold text-brand-blue mb-6">Find Products</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, manufacturers..."
                  className="w-full p-4 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-teal">
                  <Search size={20} />
                </button>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Popular Categories:</h3>
                <div className="flex flex-wrap gap-2">
                  {['Electronics', 'Machinery', 'Building Materials', 'Packaging', 'Textiles'].map((category) => (
                    <Link 
                      key={category} 
                      to={`/categories/${category.toLowerCase().replace(' ', '-')}`}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-brand-teal hover:text-white transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
