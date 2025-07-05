
import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-600">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Agreement to Terms</h2>
              <p className="leading-relaxed">
                By accessing and using Anantya Overseas services, you accept and agree to be bound by the terms and provision of this agreement. 
                These Terms of Service ("Terms") govern your use of our website, products, and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Services Description</h2>
              <p className="leading-relaxed mb-4">
                Anantya Overseas provides global sourcing and procurement solutions, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Global product sourcing and procurement</li>
                <li>B2B wholesale solutions</li>
                <li>Quality assurance and vendor management</li>
                <li>Export facilitation services</li>
                <li>Custom sourcing solutions for startups and enterprises</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
              <p className="leading-relaxed mb-4">
                Users are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the confidentiality of account credentials</li>
                <li>Complying with all applicable laws and regulations</li>
                <li>Using our services for legitimate business purposes only</li>
                <li>Respecting intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Payment Terms</h2>
              <p className="leading-relaxed">
                Payment terms will be specified in individual service agreements. Generally, payments are due within 30 days 
                of invoice date unless otherwise agreed upon. Late payments may incur additional charges as specified in your service agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Quality Assurance</h2>
              <p className="leading-relaxed">
                While we strive to ensure the highest quality of products and services, we cannot guarantee that all products 
                will meet your specific requirements. Quality specifications should be clearly communicated during the sourcing process.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Limitation of Liability</h2>
              <p className="leading-relaxed">
                Anantya Overseas shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Intellectual Property</h2>
              <p className="leading-relaxed">
                All content, trademarks, and intellectual property on our website and in our services remain the property of 
                Anantya Overseas or our licensors. Users may not reproduce, distribute, or create derivative works without explicit permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Termination</h2>
              <p className="leading-relaxed">
                Either party may terminate services with appropriate notice as specified in individual service agreements. 
                Upon termination, all outstanding obligations must be fulfilled, and confidential information must be returned or destroyed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Governing Law</h2>
              <p className="leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising 
                from these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these Terms at any time. Users will be notified of significant changes, 
                and continued use of our services constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contact Information</h2>
              <p className="leading-relaxed">
                For questions regarding these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p><strong>Email:</strong> info@anantyaoverseas.com</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> Mumbai, Maharashtra, India</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Last updated: December 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
