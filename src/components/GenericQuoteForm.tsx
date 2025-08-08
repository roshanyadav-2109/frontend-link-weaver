
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Base Schema: Defines fields present in BOTH forms.
const baseSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "A valid phone number is required"),
  company: z.string().min(2, "Company name is required"),
  product_name: z.string().min(1, "Product name is required"),
  quantity: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Quantity must be a number" }).positive("Quantity must be a positive number")
  ),
  unit: z.string().min(1, "Unit is required (e.g., pcs, kg, etc.)"),
  priority_level: z.string({ required_error: "Please select a priority level." }),
  sample_required: z.boolean().default(false).optional(),
  additional_details: z.string().max(500, "Details cannot exceed 500 characters.").optional(),
  delivery_country: z.string().min(2, "Delivery country is required"),
  delivery_address: z.string().min(5, "A valid delivery address is required"),
});

// Advanced Schema: Extends the base schema with advanced fields.
const advancedSchema = baseSchema.extend({
  specifications: z.object({
    color: z.string().optional(),
    size: z.string().optional(),
    material: z.string().optional(),
    finish: z.string().optional(),
  }),
  customization_requirements: z.string().optional(),
  technical_requirements: z.string().optional(),
  quality_standards: z.string().optional(),
  sample_requirements: z.string().optional(),
  testing_requirements: z.string().optional(),
  compliance_requirements: z.string().optional(),
  estimated_budget: z.string().optional(),
  delivery_timeline: z.date().optional(),
  payment_terms: z.string().optional(),
});

const getSchema = (isAdvanced: boolean) => isAdvanced ? advancedSchema : baseSchema;
type QuoteFormData = z.infer<typeof advancedSchema>;

interface GenericQuoteFormProps {
  isAdvanced: boolean;
  onSubmit: (data: QuoteFormData) => void;
  isLoading: boolean;
  productId?: string;
  productName?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const GenericQuoteForm: React.FC<GenericQuoteFormProps> = ({ 
  isAdvanced, 
  onSubmit, 
  isLoading,
  productId,
  productName = "",
  onSuccess,
  onClose 
}) => {
  const form = useForm<QuoteFormData>({
    resolver: zodResolver(getSchema(isAdvanced)),
    defaultValues: {
      name: "", email: "", phone: "", company: "", product_name: productName, unit: "",
      sample_required: false, additional_details: "", delivery_country: "", delivery_address: "",
      specifications: { color: "", size: "", material: "", finish: "" },
      customization_requirements: "", technical_requirements: "", quality_standards: "",
      sample_requirements: "", testing_requirements: "", compliance_requirements: "",
      estimated_budget: "", payment_terms: "",
    },
  });

  const handleSubmit = (data: QuoteFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
    console.log('Form submitted:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField control={form.control} name="name" render={({ field }) => ( 
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem> 
          )} />
          
          <FormField control={form.control} name="email" render={({ field }) => ( 
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem> 
          )} />
          
          <FormField control={form.control} name="phone" render={({ field }) => ( 
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 234 567 890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem> 
          )} />
          
          <FormField control={form.control} name="company" render={({ field }) => ( 
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem> 
          )} />
          
          <FormField control={form.control} name="product_name" render={({ field }) => ( 
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Custom Widget" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem> 
          )} />
          
          <FormField control={form.control} name="quantity" render={({ field }) => ( 
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem> 
          )} />
          
          <FormField control={form.control} name="unit" render={({ field }) => ( 
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input placeholder="e.g., pcs, kg, meters" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem> 
          )} />

          {isAdvanced && (
            <>
              <FormField control={form.control} name="specifications.material" render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Material</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Stainless Steel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem> 
              )} />
              
              <FormField control={form.control} name="technical_requirements" render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Technical Requirements</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe technical details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem> 
              )} />
              
              <FormField control={form.control} name="delivery_timeline" render={({ field }) => ( 
                <FormItem className="flex flex-col">
                  <FormLabel>Target Delivery Timeline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar 
                        mode="single" 
                        selected={field.value} 
                        onSelect={field.onChange} 
                        disabled={(date) => date < new Date()} 
                        initialFocus 
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem> 
              )} />
            </>
          )}

          <FormField control={form.control} name="delivery_country" render={({ field }) => ( 
            <FormItem>
              <FormLabel>Delivery Country</FormLabel>
              <FormControl>
                <Input placeholder="e.g., United States" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem> 
          )} />
          
          <FormField control={form.control} name="delivery_address" render={({ field }) => ( 
            <FormItem className="md:col-span-2">
              <FormLabel>Delivery Address</FormLabel>
              <FormControl>
                <Textarea placeholder="123 Main St, Anytown, USA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem> 
          )} />
          
          <FormField control={form.control} name="additional_details" render={({ field }) => ( 
            <FormItem className="md:col-span-2">
              <FormLabel>Additional Details</FormLabel>
              <FormControl>
                <Textarea placeholder="Any other relevant information..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem> 
          )} />
          
          <div className="md:col-span-2 flex items-center space-x-2">
             <FormField control={form.control} name="sample_required" render={({ field }) => ( 
               <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                 <FormControl>
                   <Checkbox 
                     checked={Boolean(field.value)} 
                     onCheckedChange={(checked) => field.onChange(Boolean(checked))} 
                   />
                 </FormControl>
                 <div className="space-y-1 leading-none">
                   <FormLabel>Sample Required?</FormLabel>
                 </div>
               </FormItem> 
             )} />
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Quote Request'}
        </Button>
      </form>
    </Form>
  );
};

export default GenericQuoteForm;
