
import React from "react";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";
import { useAuth } from "@/hooks/useAuth";

const RequestQuotePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d0e0f2] flex items-center justify-center pt-20">
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Request a Quote</h1>
            <p className="text-gray-600">Get personalized pricing for any product or service</p>
          </div>
          <QuoteRequestForm userId={user?.id} />
        </div>
      </div>
    </div>
  );
};

export default RequestQuotePage;
