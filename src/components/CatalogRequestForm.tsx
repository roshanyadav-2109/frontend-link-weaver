
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { useAuth } from "@/hooks/useAuth";

interface CatalogFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  product_category: string;
  specific_products: string;
  business_type: string;
  additional_requirements: string;
}

export default function CatalogRequestForm() {
  const { user } = useAuth();
  const [form, setForm] = useState<CatalogFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    product_category: "",
    specific_products: "",
    business_type: "",
    additional_requirements: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { name, email, phone, product_category } = form;
    if (!name || !email || !phone || !product_category) {
      toast.error("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      const catalogData = {
        user_id: user?.id || null,
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company || null,
        product_category: form.product_category,
        specific_products: form.specific_products || null,
        business_type: form.business_type || null,
        additional_requirements: form.additional_requirements || null,
        status: 'pending'
      };

      const { error } = await supabase
        .from('catalog_requests')
        .insert(catalogData);

      if (error) {
        console.error('Error submitting catalog request:', error);
        toast.error("Failed to submit catalog request. Please try again.");
        return;
      }

      toast.success("Catalog request submitted successfully! We will send you the catalog soon.");
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        product_category: "",
        specific_products: "",
        business_type: "",
        additional_requirements: "",
      });
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-2">Request Product Catalog</h2>
      
      <Input
        name="name"
        placeholder="Full Name *"
        value={form.name}
        onChange={handleChange}
        required
      />
      
      <Input
        name="email"
        placeholder="Email *"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      
      <Input
        name="phone"
        placeholder="Phone Number *"
        value={form.phone}
        onChange={handleChange}
        required
      />
      
      <Input
        name="company"
        placeholder="Company Name"
        value={form.company}
        onChange={handleChange}
      />
      
      <select
        name="product_category"
        value={form.product_category}
        onChange={handleChange}
        required
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Select Product Category *</option>
        <option value="electronics">Electronics</option>
        <option value="textiles">Textiles</option>
        <option value="machinery">Machinery</option>
        <option value="chemicals">Chemicals</option>
        <option value="food-products">Food Products</option>
        <option value="automotive">Automotive</option>
        <option value="home-garden">Home & Garden</option>
        <option value="sports-recreation">Sports & Recreation</option>
        <option value="others">Others</option>
      </select>
      
      <Input
        name="specific_products"
        placeholder="Specific Products of Interest"
        value={form.specific_products}
        onChange={handleChange}
      />
      
      <select
        name="business_type"
        value={form.business_type}
        onChange={handleChange}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Select Business Type</option>
        <option value="retailer">Retailer</option>
        <option value="wholesaler">Wholesaler</option>
        <option value="distributor">Distributor</option>
        <option value="manufacturer">Manufacturer</option>
        <option value="startup">Startup</option>
        <option value="individual">Individual</option>
      </select>
      
      <Textarea
        name="additional_requirements"
        placeholder="Additional Requirements or Notes"
        value={form.additional_requirements}
        onChange={handleChange}
        rows={4}
      />
      
      <InteractiveHoverButton 
        type="submit" 
        text={submitting ? "Submitting..." : "Request Catalog"} 
        disabled={submitting} 
      />
    </form>
  );
}
