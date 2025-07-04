
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Our Commitment to Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700">
              At Anantya Overseas, we are committed to protecting your privacy and ensuring the security of your 
              personal information. This Privacy Policy explains how we collect, use, and safeguard your data when 
              you use our services.
            </p>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h3>
              <p className="text-gray-700 mb-4">We collect information that you provide directly to us, including:</p>
              
              <div className="ml-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Personal Information:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Name, email address, and phone number</li>
                    <li>Company name and business information</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely through third-party providers)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">Business Information:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Product specifications and requirements</li>
                    <li>Trade preferences and business needs</li>
                    <li>Communication records and transaction history</li>
                    <li>Documentation related to trade activities</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">Technical Information:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>IP address and browser information</li>
                    <li>Usage patterns and platform interactions</li>
                    <li>Device information and operating system</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h3>
              <p className="text-gray-700 mb-4">We use your information for the following purposes:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Providing and improving our trade facilitation services</li>
                <li>Processing transactions and managing business relationships</li>
                <li>Communicating about services, updates, and business opportunities</li>
                <li>Ensuring compliance with legal and regulatory requirements</li>
                <li>Protecting against fraud and unauthorized activities</li>
                <li>Analyzing usage patterns to enhance user experience</li>
                <li>Marketing relevant services (with your consent)</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Information Sharing</h3>
              <p className="text-gray-700 mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Business Partners:</strong> With suppliers and manufacturers to fulfill your requirements</li>
                <li><strong>Service Providers:</strong> With third-party service providers who assist in our operations</li>
                <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong>Protection:</strong> To protect our rights, property, or safety, or that of others</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Data Security</h3>
              <p className="text-gray-700 mb-4">
                We implement comprehensive security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure access controls and authentication systems</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Employee training on data protection practices</li>
                <li>Compliance with industry-standard security frameworks</li>
                <li>Incident response procedures for security breaches</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h3>
              <p className="text-gray-700">
                We retain your information for as long as necessary to provide services and comply with legal obligations. 
                Typically, we retain:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
                <li>Account information for the duration of your relationship with us</li>
                <li>Transaction records for 7 years for tax and legal compliance</li>
                <li>Communication records for 3 years for business purposes</li>
                <li>Marketing data until you opt out or as required by law</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h3>
              <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7. International Transfers</h3>
              <p className="text-gray-700">
                As an international trade facilitator, we may transfer your information across borders. We ensure 
                appropriate safeguards are in place, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
                <li>Adherence to international data protection standards</li>
                <li>Contractual data protection clauses with international partners</li>
                <li>Compliance with local data protection laws in relevant jurisdictions</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Cookies and Tracking</h3>
              <p className="text-gray-700">
                We use cookies and similar technologies to enhance your experience. These help us:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and recommendations</li>
                <li>Improve security and prevent fraud</li>
              </ul>
              <p className="text-gray-700 mt-3">
                You can control cookie settings through your browser, but this may affect some functionality.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h3>
              <p className="text-gray-700">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
                We will notify you of significant changes through email or platform notifications. Your continued use 
                of our services constitutes acceptance of the updated policy.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
              <p className="text-gray-700 mb-3">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="text-gray-700 space-y-1">
                <p><strong>Data Protection Officer:</strong> privacy@anantyaoverseas.com</p>
                <p><strong>General Inquiries:</strong> info@anantyaoverseas.com</p>
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

export default Privacy;
