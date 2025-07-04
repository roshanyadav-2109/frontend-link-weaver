
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  product_name: string;
  quantity: string;
  details: string;
}

export default function RequestQuoteForm() {
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    product_name: "",
    quantity: "",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const { name, email, product_name, phone } = form;
    if (!name || !email || !product_name || !phone) {
      toast.error("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('quote_requests')
        .insert({
          user_id: user?.id || 'anonymous',
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company || null,
          product_name: form.product_name,
          quantity: form.quantity || '1',
          unit: 'units',
          additional_details: form.details || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Quote request submitted successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        product_name: "",
        quantity: "",
        details: "",
      });
    } catch (err: any) {
      toast.error("Failed to submit quote request. Please try again.");
      console.error('Quote request error:', err);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-2">Request a Quote</h2>
      
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
      
      <Input
        name="product_name"
        placeholder="Product/Service *"
        value={form.product_name}
        onChange={handleChange}
        required
      />
      
      <Input
        name="quantity"
        placeholder="Quantity"
        value={form.quantity}
        onChange={handleChange}
      />
      
      <Textarea
        name="details"
        placeholder="Additional Details"
        value={form.details}
        onChange={handleChange}
        rows={4}
      />
      
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Request"
        )}
      </Button>
    </form>
  );
}
