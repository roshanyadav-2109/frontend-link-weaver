
import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d0e0f2] pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using the Anantya Overseas website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily download one copy of the materials on Anantya Overseas's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside mb-4 ml-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Services Description</h2>
              <p className="mb-4">
                Anantya Overseas provides international trade facilitation services, including but not limited to product sourcing, supplier verification, quality assurance, logistics coordination, and trade documentation assistance. We act as intermediaries to connect buyers and sellers in global markets.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. User Responsibilities</h2>
              <p className="mb-4">Users of our platform agree to:</p>
              <ul className="list-disc list-inside mb-4 ml-4">
                <li>Provide accurate and truthful information in all communications</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect intellectual property rights</li>
                <li>Maintain confidentiality of sensitive business information</li>
                <li>Use the platform solely for legitimate business purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Payment Terms</h2>
              <p className="mb-4">
                Payment terms for services will be specified in individual service agreements. Unless otherwise specified, payment is due within 30 days of invoice date. Late payments may incur additional charges as specified in the service agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Limitation of Liability</h2>
              <p className="mb-4">
                Anantya Overseas shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Privacy Policy</h2>
              <p className="mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Termination</h2>
              <p className="mb-4">
                Either party may terminate the service agreement at any time with written notice. Upon termination, your right to use the service will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Governing Law</h2>
              <p className="mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">10. Changes to Terms</h2>
              <p className="mb-4">
                Anantya Overseas reserves the right to revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>Anantya Overseas</strong></p>
                <p>Email: anantyaoverseas@gmail.com</p>
                <p>Address: Mumbai, Maharashtra, India</p>
              </div>
            </section>

            <div className="text-center mt-8 text-sm text-gray-500">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
