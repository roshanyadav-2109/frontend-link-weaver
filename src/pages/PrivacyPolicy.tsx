
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-600">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
              <p className="leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Create an account or profile</li>
                <li>Request quotes or services</li>
                <li>Contact us for support</li>
                <li>Subscribe to our newsletters</li>
                <li>Participate in surveys or feedback</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Types of Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Personal Information</h3>
                  <p className="leading-relaxed">
                    Name, email address, phone number, company information, billing address, and other contact details.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Business Information</h3>
                  <p className="leading-relaxed">
                    Company size, industry, procurement needs, product specifications, and business requirements.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Usage Information</h3>
                  <p className="leading-relaxed">
                    Website usage patterns, device information, IP address, browser type, and interaction data.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
              <p className="leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and improve our sourcing services</li>
                <li>Process quotes and fulfill service requests</li>
                <li>Communicate with you about our services</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Analyze usage patterns to improve user experience</li>
                <li>Comply with legal obligations</li>
                <li>Protect against fraud and security threats</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Information Sharing</h2>
              <p className="leading-relaxed mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in our operations</li>
                <li><strong>Business Partners:</strong> With suppliers and manufacturers to fulfill your requests</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet 
                or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Data Retention</h2>
              <p className="leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                unless a longer retention period is required or permitted by law. Business records may be retained for accounting 
                and legal compliance purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Your Rights</h2>
              <p className="leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and receive a copy of your personal information</li>
                <li>Rectify inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict processing of your information</li>
                <li>Data portability (receive your data in a structured format)</li>
                <li>Withdraw consent for processing based on consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. International Transfers</h2>
              <p className="leading-relaxed">
                As a global sourcing company, we may transfer your information to countries outside your residence. 
                We ensure appropriate safeguards are in place to protect your information during such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Cookies and Tracking</h2>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, 
                and understand user preferences. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Children's Privacy</h2>
              <p className="leading-relaxed">
                Our services are not intended for individuals under the age of 16. We do not knowingly collect personal 
                information from children under 16. If we become aware of such collection, we will take steps to delete the information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting 
                the new Privacy Policy on our website and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p><strong>Email:</strong> privacy@anantyaoverseas.com</p>
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

export default PrivacyPolicy;
