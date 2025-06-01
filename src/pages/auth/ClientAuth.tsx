import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const registerSchema = z.object({
  full_name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
  company_name: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  address: z.string().min(10, { message: 'Address must be at least 10 characters.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  country: z.string().min(2, { message: 'Country must be at least 2 characters.' }),
  business_type: z.string().min(1, { message: 'Please select business type.' }),
  industry_sector: z.string().min(1, { message: 'Please select industry sector.' }),
  annual_import_volume: z.string().optional(),
  import_experience: z.boolean().default(false),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your password.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ClientAuth = () => {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');
  const { signInWithGoogle, isAuthenticated, isAdmin, loading, resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();
  const [emailForConfirmation, setEmailForConfirmation] = useState<string | null>(null);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  
  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      company_name: '',
      address: '',
      city: '',
      country: '',
      business_type: '',
      industry_sector: '',
      annual_import_volume: '',
      import_experience: false,
      password: '',
      confirmPassword: '',
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      
      if (error) {
        if (error.message === "Email not confirmed") {
          setEmailForConfirmation(values.email);
          setShowConfirmationMessage(true);
          toast.error("Please confirm your email before signing in.");
        } else {
          toast.error(error.message);
        }
        return;
      }
      
      toast.success('Successfully logged in! Welcome back.');
    } catch (error) {
      toast.error('An error occurred during login');
    }
  }

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
            phone: values.phone,
            company_name: values.company_name,
            address: values.address,
            city: values.city,
            country: values.country,
            user_type: 'client'
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      if (data.user) {
        // Create client profile with additional business information
        const { error: clientError } = await supabase
          .from('clients')
          .insert({
            user_id: data.user.id,
            business_type: values.business_type,
            industry_sector: values.industry_sector,
            annual_import_volume: values.annual_import_volume || null,
            import_experience: values.import_experience
          });

        if (clientError) {
          console.error('Error creating client profile:', clientError);
        }

        setEmailForConfirmation(values.email);
        setShowConfirmationMessage(true);
        toast.success('Registration successful! Please check your email to confirm your account.');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    }
  }

  const handleResendConfirmation = async () => {
    if (emailForConfirmation) {
      await resendConfirmationEmail(emailForConfirmation);
    }
  };

  const businessTypes = [
    'Import/Export Company',
    'Trading Company',
    'Manufacturing Company',
    'Retail Business',
    'Wholesale Business',
    'E-commerce Business',
    'Service Provider',
    'Other'
  ];

  const industrySectors = [
    'Textiles & Clothing',
    'Electronics & Technology',
    'Agriculture & Food',
    'Chemicals & Pharmaceuticals',
    'Automotive & Transport',
    'Home & Garden',
    'Health & Beauty',
    'Industrial Machinery',
    'Construction & Building',
    'Other'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#f0f4f8] to-[#d0e0f2]">
      {/* Left side - Authentication Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-premium-blue overflow-hidden border border-blue-100">
            <div className="bg-gradient-to-r from-[#1a365d] to-[#2d507a] p-8 text-white text-center">
              <h1 className="text-3xl font-bold">
                {isRegister ? 'Create Client Account' : 'Welcome Back, Client!'}
              </h1>
              <p className="mt-2 text-white/80">
                {isRegister 
                  ? 'Join thousands of global buyers sourcing quality products from India.'
                  : 'Sign in to access your personalized buying experience.'}
              </p>
            </div>
            
            <div className="p-8">
              {showConfirmationMessage && (
                <Alert className="mb-6 border-amber-300 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-700" />
                  <AlertTitle className="text-amber-700">Email confirmation required</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Please check your inbox for the confirmation email. If you didn't receive it, you can 
                    <Button 
                      variant="link" 
                      onClick={handleResendConfirmation}
                      className="p-0 h-auto text-amber-700 font-semibold mx-1 underline"
                    >
                      resend the confirmation email
                    </Button>
                    to {emailForConfirmation}.
                  </AlertDescription>
                </Alert>
              )}
              
              {isRegister ? (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@company.com" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 234 567 8900" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="company_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Company Ltd." {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Business Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Business Street, Suite 100" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Country</FormLabel>
                            <FormControl>
                              <Input placeholder="United States" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="business_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Business Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-300">
                                  <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {businessTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="industry_sector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Industry Sector</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-300">
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {industrySectors.map((sector) => (
                                  <SelectItem key={sector} value={sector}>
                                    {sector}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="annual_import_volume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Annual Import Volume (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., $100,000 - $500,000" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="import_experience"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-gray-700">
                              I have previous import experience
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-to-r from-[#1a365d] to-[#2d507a] hover:from-[#1a365d] hover:to-[#234069] text-white">
                      Create Account
                    </Button>
                  </form>
                </Form>
              ) : (
                <>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@company.com" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                            <div className="text-right">
                              <a href="#" className="text-sm text-[#2d6da3] hover:underline">
                                Forgot Password?
                              </a>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-[#1a365d] to-[#2d507a] hover:from-[#1a365d] hover:to-[#234069] text-white">
                        Sign In
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full border-gray-300 hover:bg-gray-50 transition-all"
                        onClick={() => signInWithGoogle()}
                      >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Sign in with Google
                      </Button>
                    </div>
                  </div>
                </>
              )}
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isRegister ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="ml-1 text-[#2d6da3] hover:underline font-medium"
                  >
                    {isRegister ? 'Sign In' : 'Register Now'}
                  </button>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-700">
              Looking to showcase your products?
              <a href="/auth/manufacturer" className="ml-1 text-[#2d6da3] hover:underline font-medium">
                Sign in as Manufacturer
              </a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Video */}
      <div className="md:w-1/2 relative overflow-hidden">
        {/* Background overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d]/60 to-[#2d507a]/60 z-10"></div>
        
        <video 
          className="absolute w-full h-full object-cover" 
          autoPlay 
          loop 
          muted 
          playsInline
          poster="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1740"
        >
          <source src="https://cdn.coverr.co/videos/coverr-international-business-handshake-7267/1080p.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Content overlay on the video */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 p-8">
          <div className="bg-[#1a365d]/50 backdrop-blur-sm p-8 rounded-2xl shadow-premium max-w-md">
            <h2 className="text-3xl font-bold text-white mb-4">Global Import-Export Solutions</h2>
            <p className="text-white/90 text-lg">
              Connect with trusted suppliers and buyers from around the world. Our platform streamlines international trade with secure, transparent processes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAuth;
