
import React, { useState } from 'react';
import ManufacturerPartnershipForm from '@/components/ManufacturerPartnershipForm';

const ManufacturerPartnership: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Partner with Us
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our global network of trusted manufacturers and expand your business reach.
            We connect quality manufacturers with international buyers.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Global Reach</h3>
              <p className="text-gray-600">Access to international markets and buyers worldwide</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Quality Assurance</h3>
              <p className="text-gray-600">Rigorous verification and quality control processes</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Business Growth</h3>
              <p className="text-gray-600">Opportunities for scaling and expanding your business</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Apply for Partnership
          </button>
        </div>
      </div>
      
      <ManufacturerPartnershipForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </div>
  );
};

export default ManufacturerPartnership;
