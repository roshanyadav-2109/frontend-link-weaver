
import React from "react";
import ManufacturerPartnershipForm from "@/components/ManufacturerPartnershipForm";

const ManufacturerPartnership = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d0e0f2] pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Partner With Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our network of trusted manufacturers and expand your business globally through our platform.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <ManufacturerPartnershipForm isOpen={true} onClose={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default ManufacturerPartnership;
