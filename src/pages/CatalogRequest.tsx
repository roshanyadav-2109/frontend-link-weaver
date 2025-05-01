
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, Link } from 'react-router-dom';
import { Mail, Phone, User, Building, FileText, Check } from 'lucide-react';
import { toast } from 'sonner';

// Sample categories for the form
const categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'machinery', label: 'Machinery' },
  { value: 'building-materials', label: 'Building Materials' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'textiles', label: 'Textiles' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'plastics', label: 'Plastics & Rubber' },
];

const CatalogRequest: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('product');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    selectedCategories: productId ? ['electronics'] : [], // Default if product is specified
    specificProduct: productId || '',
    message: '',
    preferredFormat: 'digital',
    agreeToTerms: false
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
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (formData.selectedCategories.length === 0) {
      newErrors.categories = 'Please select at least one category';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      let updatedCategories = [...prev.selectedCategories];
      
      if (checked) {
        updatedCategories.push(value);
      } else {
        updatedCategories = updatedCategories.filter(cat => cat !== value);
      }
      
      return {
        ...prev,
        selectedCategories: updatedCategories
      };
    });
    
    // Clear category error if at least one is selected
    if (errors.categories) {
      setErrors(prev => ({
        ...prev,
        categories: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Form submission logic would go here
      console.log('Form submitted:', formData);
      
      toast.success('Your catalog request has been submitted. We will be in touch shortly!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        selectedCategories: [],
        specificProduct: '',
        message: '',
        preferredFormat: 'digital',
        agreeToTerms: false
      });
    }
  };

  return (
    <div className="bg-brand-light min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-brand-blue mb-4">Request Product Catalog</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fill out the form below to request product catalogs from our trusted manufacturers. We'll send you detailed information about products that match your needs.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                
                <div>
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
                
                <div>
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
                
                <div>
                  <label htmlFor="company" className="block text-gray-700 font-medium mb-2">Company</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                        errors.company ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your company name"
                    />
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-2">Product Categories</label>
                <p className="text-sm text-gray-500 mb-3">Select the categories you are interested in</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <div key={category.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.value}`}
                        name="category"
                        value={category.value}
                        checked={formData.selectedCategories.includes(category.value)}
                        onChange={handleCategoryChange}
                        className="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label htmlFor={`category-${category.value}`} className="ml-2 block text-sm text-gray-700">
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.categories && <p className="text-red-500 text-sm mt-1">{errors.categories}</p>}
              </div>
              
              <div className="mt-6">
                <label htmlFor="specificProduct" className="block text-gray-700 font-medium mb-2">Specific Product (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    id="specificProduct"
                    name="specificProduct"
                    value={formData.specificProduct}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    placeholder="Enter specific product name or details if any"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Additional Information (Optional)</label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal h-32"
                    placeholder="Tell us more about your specific requirements or questions"
                  ></textarea>
                  <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-2">Preferred Format</label>
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="digital"
                      name="preferredFormat"
                      value="digital"
                      checked={formData.preferredFormat === 'digital'}
                      onChange={handleChange}
                      className="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                    />
                    <label htmlFor="digital" className="ml-2 block text-sm text-gray-700">
                      Digital (Email)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="printed"
                      name="preferredFormat"
                      value="printed"
                      checked={formData.preferredFormat === 'printed'}
                      onChange={handleChange}
                      className="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                    />
                    <label htmlFor="printed" className="ml-2 block text-sm text-gray-700">
                      Printed (Mail)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="both"
                      name="preferredFormat"
                      value="both"
                      checked={formData.preferredFormat === 'both'}
                      onChange={handleChange}
                      className="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                    />
                    <label htmlFor="both" className="ml-2 block text-sm text-gray-700">
                      Both
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className={`h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded ${
                        errors.terms ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-700">
                      I agree to receive product information and updates from LinkWeaver and related manufacturers
                    </label>
                  </div>
                </div>
                {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
              </div>
              
              <div className="mt-8">
                <Button type="submit" className="w-full bg-brand-teal hover:bg-brand-teal/90 py-3 text-lg">
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
          
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="h-12 w-12 rounded-full bg-brand-teal/10 flex items-center justify-center mr-4">
                <Check className="h-6 w-6 text-brand-teal" />
              </div>
              <h2 className="text-2xl font-bold text-brand-blue">Why Request a Catalog?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center p-4">
                <div className="h-12 w-12 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Detailed Product Information</h3>
                <p className="text-gray-600 text-sm">
                  Gain access to comprehensive product specifications, technical details, and performance data.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="h-12 w-12 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                  <Building className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Manufacturer Insights</h3>
                <p className="text-gray-600 text-sm">
                  Learn about the manufacturers, their capabilities, certifications, and quality standards.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="h-12 w-12 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Direct Communication</h3>
                <p className="text-gray-600 text-sm">
                  Open a direct line of communication with manufacturers interested in your business needs.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Have questions about our catalog request process?{' '}
              <Link to="/contact" className="text-brand-blue hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogRequest;
