
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, User } from 'lucide-react';
import { toast } from 'sonner';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Form submission would go here in a real application
      console.log('Form submitted:', formData);
      
      toast.success('Thank you for your message. We will be in touch shortly!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }
  };

  return (
    <div className="bg-brand-light min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-blue mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? Our team is here to help you navigate our platform and services.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-brand-blue mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your name"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your email"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone (Optional)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      placeholder="Your phone number"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                      errors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Product Information">Product Information</option>
                    <option value="Manufacturer Registration">Manufacturer Registration</option>
                    <option value="Client Support">Client Support</option>
                    <option value="Technical Issue">Technical Issue</option>
                  </select>
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal h-32 ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your message"
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90 py-3 text-lg">
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-brand-blue mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-brand-light p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-brand-teal" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Our Location</h3>
                    <p className="text-gray-600">1234 Industrial Way, Business Park<br />San Francisco, CA 92101</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brand-light p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-brand-teal" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email Us</h3>
                    <a href="mailto:info@linkweaver.com" className="text-brand-blue hover:underline">info@linkweaver.com</a><br />
                    <a href="mailto:support@linkweaver.com" className="text-brand-blue hover:underline">support@linkweaver.com</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brand-light p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-brand-teal" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Call Us</h3>
                    <a href="tel:+18001234567" className="text-brand-blue hover:underline">+1 (800) 123-4567</a><br />
                    <p className="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-brand-blue rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  {
                    question: 'How do I register as a manufacturer?',
                    answer: 'Visit our Manufacturer Sign In page and click on the Register tab to create your account. You will need to provide company details and verification information.'
                  },
                  {
                    question: 'Can I request catalogs from multiple manufacturers?',
                    answer: 'Yes, you can request product catalogs from as many manufacturers as you need through our catalog request feature.'
                  },
                  {
                    question: 'Is there a cost to join as a client?',
                    answer: 'No, client accounts are free. You can browse products and request catalogs without any charge.'
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-brand-teal/30 pb-4">
                    <h3 className="font-medium text-white mb-2">{faq.question}</h3>
                    <p className="text-gray-300 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
