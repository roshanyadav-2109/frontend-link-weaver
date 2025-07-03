
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";
import { Link } from "react-router-dom";

const RemoveBackgroundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl text-gray-800">
                <Construction className="h-8 w-8 text-brand-blue" />
                Feature Under Development
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-gray-600 text-lg">
                The background removal feature is currently under development. 
                We're working hard to bring you this amazing tool soon!
              </p>
              
              <div className="bg-gradient-to-r from-brand-blue/10 to-brand-teal/10 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2">Coming Soon:</h3>
                <ul className="text-gray-600 space-y-1 text-left">
                  <li>• AI-powered background removal</li>
                  <li>• High-quality image processing</li>
                  <li>• Bulk image processing</li>
                  <li>• Multiple export formats</li>
                </ul>
              </div>

              <Link to="/">
                <Button className="bg-gradient-to-r from-brand-blue to-brand-teal hover:from-brand-teal hover:to-brand-blue">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RemoveBackgroundPage;
