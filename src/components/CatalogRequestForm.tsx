import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

// Define the product interface
export interface ProductInfo {
  id?: string;
  name: string;
  category?: string;
  subcategory?: string;
}

// Form schema
const catalogRequestSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  company: z.string().min(2, { message: 'Company name is required' }),
  phone: z.string().min(5, { message: 'Valid phone number is required' }),
  country: z.string().min(2, { message: 'Country is required' }),
  message: z.string().optional(),
  products: z.array(z.string()).optional(),
  customCatalog: z.boolean().default(false),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type CatalogRequestFormProps = {
  preselectedProducts?: ProductInfo[];
  onSuccess?: () => void;
};

const EMAIL_ENDPOINT = "https://lusfthgqlkgktplplqnv.functions.supabase.co/send-form-email";

const CatalogRequestForm = ({ preselectedProducts = [], onSuccess }: CatalogRequestFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewedProducts, setViewedProducts] = useState<ProductInfo[]>([]);
  
  // Get form methods
  const form = useForm<z.infer<typeof catalogRequestSchema>>({
    resolver: zodResolver(catalogRequestSchema),
    defaultValues: {
      name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      company: user?.user_metadata?.company || '',
      phone: '',
      country: user?.user_metadata?.country || '',
      message: '',
      products: preselectedProducts.map(p => p.id || ''),
      customCatalog: preselectedProducts.length === 0,
      agreeToTerms: false,
    },
  });

  // Effect to load recently viewed products from local storage
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('viewedProducts');
      if (storedProducts) {
        setViewedProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Error loading viewed products:', error);
    }
  }, []);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof catalogRequestSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Compose minimal payload for email
      const payload = {
        ...values,
        selectedProductNames: preselectedProducts.map(p => p.name).join(", "),
        type: "catalog"
      };
      const response = await fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Catalog request submitted and sent via email!');
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error("Failed to send email: " + (result?.error || ""));
      }
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle custom catalog selection
  const toggleCustomCatalog = (checked: boolean) => {
    if (checked) {
      form.setValue('products', []);
    }
  };

  return (
    <div className="rounded-xl border border-blue-100 bg-white shadow-premium p-6 md:p-8">
      <h2 className="text-2xl font-bold text-[#1a365d] mb-6">Request Product Catalog</h2>
      
      {/* Display selected products if any */}
      {!form.watch('customCatalog') && (preselectedProducts.length > 0 || viewedProducts.length > 0) && (
        <div className="mb-6 bg-[#f7fafd] p-4 rounded-lg">
          <h3 className="font-semibold text-[#2d6da3] mb-2">Selected Products</h3>
          <ul className="space-y-1">
            {preselectedProducts.length > 0 ? (
              preselectedProducts.map((product, index) => (
                <li key={`selected-${index}`} className="flex items-center">
                  <span className="h-2 w-2 bg-[#2d6da3] rounded-full mr-2"></span>
                  <span className="text-gray-700">{product.name}</span>
                </li>
              ))
            ) : (
              viewedProducts.slice(0, 3).map((product, index) => (
                <li key={`viewed-${index}`} className="flex items-center">
                  <span className="h-2 w-2 bg-[#2d6da3] rounded-full mr-2"></span>
                  <span className="text-gray-700">{product.name}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Custom Catalog Option */}
          <FormField
            control={form.control}
            name="customCatalog"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      toggleCustomCatalog(checked as boolean);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-[#1a365d]">Request a custom catalog instead</FormLabel>
                  <p className="text-sm text-gray-500">Our team will help you identify the best products for your needs</p>
                </div>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
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
              control={form.control}
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
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Company Name" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
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
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Additional Requirements</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about your specific product requirements, quantities, or any other details that would help us prepare the right catalog for you." 
                    className="min-h-[100px] border-gray-300 focus:border-blue-400 focus:ring-blue-300"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the{" "}
                    <a href="/terms" className="text-[#2d6da3] hover:underline">
                      terms and conditions
                    </a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#1a365d] to-[#2d6da3] hover:from-[#1a365d] hover:to-[#234069] text-white"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                Submitting...
              </>
            ) : (
              'Request Catalog'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CatalogRequestForm;
