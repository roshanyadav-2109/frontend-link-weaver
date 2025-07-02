
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const RemoveBackground = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Remove Background Tool
          </h1>
          <p className="text-gray-600 mb-8">
            This feature is currently under development. Please check back later for our advanced background removal tool.
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-gray-500 mb-4">
              Coming Soon
            </div>
            <p className="text-sm text-gray-600">
              We're working on bringing you a powerful background removal tool. 
              In the meantime, feel free to explore our other services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;
