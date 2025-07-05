
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: January 1, 2025</p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="prose max-w-none p-8">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using the services provided by Anantya Overseas ("we," "our," or "us"), 
                  you accept and agree to be bound by the terms and provision of this agreement. If you do not 
                  agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Use of Services</h2>
                <p className="text-gray-700 mb-4">
                  You agree to use our services only for lawful purposes and in accordance with these Terms. 
                  You agree not to use the service:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                  <li>To transmit, or procure the sending of, any advertising or promotional material, or any other form of similar solicitation</li>
                  <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
                <p className="text-gray-700 mb-4">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                  You are responsible for safeguarding the password and for maintaining the confidentiality of your account information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Products and Services</h2>
                <p className="text-gray-700 mb-4">
                  We provide global sourcing and B2B wholesale services. All product descriptions, specifications, and pricing are subject to change without notice. 
                  We reserve the right to refuse service to anyone for any reason at any time.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Intellectual Property Rights</h2>
                <p className="text-gray-700 mb-4">
                  The service and its original content, features, and functionality are and will remain the exclusive property of 
                  Anantya Overseas and its licensors. The service is protected by copyright, trademark, and other laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Privacy Policy</h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
                  to understand our practices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  In no event shall Anantya Overseas, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                  be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
                  loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Termination</h2>
                <p className="text-gray-700 mb-4">
                  We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, 
                  under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                  If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Governing Law</h2>
                <p className="text-gray-700 mb-4">
                  These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions. 
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> anantyaoverseas@gmail.com<br />
                    <strong>Address:</strong> Ahmedabad, Gujarat, India
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
