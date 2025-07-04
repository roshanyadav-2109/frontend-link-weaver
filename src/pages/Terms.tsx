
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700">
              By accessing and using Anantya Overseas services, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, you are 
              prohibited from using our services.
            </p>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Services Description</h3>
              <p className="text-gray-700 mb-4">
                Anantya Overseas provides international trade facilitation services, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Product sourcing and procurement services</li>
                <li>International shipping and logistics coordination</li>
                <li>Quality assurance and inspection services</li>
                <li>Documentation and compliance assistance</li>
                <li>Business matchmaking and partnership facilitation</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. User Responsibilities</h3>
              <p className="text-gray-700 mb-4">By using our services, you agree to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Provide accurate and complete information in all communications</li>
                <li>Comply with all applicable local, national, and international laws</li>
                <li>Respect intellectual property rights of all parties</li>
                <li>Conduct business dealings with integrity and professionalism</li>
                <li>Notify us immediately of any security breaches or unauthorized access</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Payment Terms</h3>
              <p className="text-gray-700 mb-4">
                Payment for services shall be made according to the terms specified in individual service agreements. 
                General payment terms include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Payment due within 30 days of invoice date unless otherwise specified</li>
                <li>Late payments may incur additional charges as outlined in service agreements</li>
                <li>All payments must be made in the currency specified in the invoice</li>
                <li>Disputes must be raised within 15 days of invoice receipt</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Limitation of Liability</h3>
              <p className="text-gray-700 mb-4">
                Anantya Overseas acts as a facilitator and intermediary in international trade transactions. 
                Our liability is limited as follows:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>We are not liable for the quality, delivery, or performance of third-party suppliers</li>
                <li>Our maximum liability shall not exceed the total fees paid for the specific service</li>
                <li>We are not responsible for delays caused by customs, shipping, or regulatory authorities</li>
                <li>Force majeure events are excluded from our liability coverage</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Intellectual Property</h3>
              <p className="text-gray-700">
                All content, trademarks, and intellectual property on our platform remain the property of 
                Anantya Overseas or their respective owners. Users may not reproduce, distribute, or create 
                derivative works without explicit written permission.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Confidentiality</h3>
              <p className="text-gray-700">
                We maintain strict confidentiality regarding all business information shared by our clients. 
                This includes trade secrets, pricing information, supplier details, and strategic business plans. 
                We expect the same level of confidentiality from our clients regarding our business operations.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Termination</h3>
              <p className="text-gray-700">
                Either party may terminate services with 30 days written notice. Immediate termination may occur 
                in cases of breach of terms, illegal activities, or failure to make payments. Upon termination, 
                all outstanding obligations must be fulfilled.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Governing Law</h3>
              <p className="text-gray-700">
                These terms are governed by the laws of India. Any disputes shall be resolved through arbitration 
                in Mumbai, Maharashtra, in accordance with the Arbitration and Conciliation Act, 2015.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to Terms</h3>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. Users will be notified of significant 
                changes via email or platform notifications. Continued use of our services after changes 
                constitutes acceptance of the new terms.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Information</h3>
              <p className="text-gray-700">
                For questions regarding these Terms of Service, please contact us at:
              </p>
              <div className="mt-3 text-gray-700">
                <p><strong>Email:</strong> legal@anantyaoverseas.com</p>
                <p><strong>Phone:</strong> +91 9876 543 210</p>
                <p><strong>Address:</strong> Anantya Overseas, Business District, Mumbai, Maharashtra 400001, India</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
