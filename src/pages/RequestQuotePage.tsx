import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GenericQuoteForm from '@/components/GenericQuoteForm';

const RequestQuotePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d0e0f2] pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Card className="shadow-premium border-0">
          <CardHeader className="bg-gradient-to-r from-[#1a365d] to-[#2d507a] text-white">
            <CardTitle>Request a Quote</CardTitle>
            <CardDescription className="text-white/80">
              Fill out the form below to request a quote for our services
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <GenericQuoteForm 
              isAdvanced={false}
              onSuccess={() => {
                // Handle success - maybe show a success message or redirect
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestQuotePage;
