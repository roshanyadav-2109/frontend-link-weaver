
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Building, Phone, User, Globe, FileText } from 'lucide-react';
import { toast } from 'sonner';

type AuthTab = 'login' | 'register';

const ManufacturerAuth: React.FC = () => {
  const location = useLocation();
  const showRegister = location.search.includes('register=true');
  const [activeTab, setActiveTab] = useState<AuthTab>(showRegister ? 'register' : 'login');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [registerData, setRegisterData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateLoginForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!loginData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(loginData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!registerData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!registerData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }
    
    if (!registerData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(registerData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!registerData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!registerData.password) {
      newErrors.password = 'Password is required';
    } else if (registerData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateLoginForm()) {
      // Login logic would go here
      console.log('Login submitted:', loginData);
      
      toast.success('Login successful! Redirecting to dashboard...');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateRegisterForm()) {
      // Registration logic would go here
      console.log('Registration submitted:', registerData);
      
      toast.success('Registration submitted! Please check your email to verify your account.');
    }
  };

  return (
    <div className="bg-brand-light min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex border-b">
              <button 
                className={`w-1/2 py-4 font-medium text-center ${activeTab === 'login' ? 'bg-brand-blue text-white' : 'text-gray-600 hover:text-brand-blue'}`}
                onClick={() => setActiveTab('login')}
              >
                Sign In
              </button>
              <button 
                className={`w-1/2 py-4 font-medium text-center ${activeTab === 'register' ? 'bg-brand-blue text-white' : 'text-gray-600 hover:text-brand-blue'}`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>
            
            <div className="p-8">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-brand-blue mb-2">
                  {activeTab === 'login' ? 'Manufacturer Sign In' : 'Register as a Manufacturer'}
                </h2>
                <p className="text-gray-600">
                  {activeTab === 'login' 
                    ? 'Access your manufacturer dashboard' 
                    : 'Create an account to showcase your products'}
                </p>
              </div>
              
              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Your email"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Your password"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={loginData.rememberMe}
                        onChange={handleLoginChange}
                        className="h-4 w-4 text-brand-blue focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm text-brand-blue hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  
                  <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90 py-3 text-lg">
                    Sign In
                  </Button>
                  
                  <p className="mt-4 text-center text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <button 
                      type="button"
                      onClick={() => setActiveTab('register')} 
                      className="text-brand-blue hover:underline"
                    >
                      Register now
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit}>
                  <div className="mb-4">
                    <label htmlFor="companyName" className="block text-gray-700 font-medium mb-2">Company Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={registerData.companyName}
                        onChange={handleRegisterChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                          errors.companyName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Your company name"
                      />
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="contactName" className="block text-gray-700 font-medium mb-2">Contact Person</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        value={registerData.contactName}
                        onChange={handleRegisterChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                          errors.contactName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Contact person name"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Business Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Your business email"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone</label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={registerData.phone}
                        onChange={handleRegisterChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Your phone number"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="website" className="block text-gray-700 font-medium mb-2">Website (Optional)</label>
                    <div className="relative">
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={registerData.website}
                        onChange={handleRegisterChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal"
                        placeholder="Your website URL"
                      />
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Company Description (Optional)</label>
                    <div className="relative">
                      <textarea
                        id="description"
                        name="description"
                        value={registerData.description}
                        onChange={handleRegisterChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal h-24"
                        placeholder="Brief description of your company and products"
                      ></textarea>
                      <FileText className="absolute left-3 top-6 text-gray-400" size={18} />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="reg-password" className="block text-gray-700 font-medium mb-2">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        id="reg-password"
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Create a password"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Confirm your password"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                  
                  <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90 py-3 text-lg">
                    Create Account
                  </Button>
                  
                  <p className="mt-4 text-center text-gray-600 text-sm">
                    Already have an account?{' '}
                    <button 
                      type="button"
                      onClick={() => setActiveTab('login')} 
                      className="text-brand-blue hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Looking to browse products as a client?{' '}
              <Link to="/auth/client" className="text-brand-blue hover:underline">
                Client Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerAuth;
