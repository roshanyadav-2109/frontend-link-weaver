
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { useAuth } from "@/hooks/useAuth";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  product_name: string;
  quantity: string;
  unit: string;
  additional_details: string;
}

export default function RequestQuoteForm() {
  const { user } = useAuth();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    product_name: "",
    quantity: "",
    unit: "units",
    additional_details: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { name, email, phone, product_name } = form;
    if (!name || !email || !phone || !product_name) {
      toast.error("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      const quoteData = {
        user_id: user?.id || null,
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company || null,
        product_name: form.product_name,
        quantity: form.quantity,
        unit: form.unit,
        additional_details: form.additional_details || null,
        status: 'pending'
      };

      const { error } = await supabase
        .from('quote_requests')
        .insert(quoteData);

      if (error) {
        console.error('Error submitting quote request:', error);
        toast.error("Failed to submit quote request. Please try again.");
        return;
      }

      toast.success("Quote request submitted successfully! We will get back to you soon.");
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        product_name: "",
        quantity: "",
        unit: "units",
        additional_details: "",
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
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
        />
        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="units">Units</option>
          <option value="kg">Kilograms</option>
          <option value="meters">Meters</option>
          <option value="liters">Liters</option>
          <option value="pieces">Pieces</option>
          <option value="tons">Tons</option>
          <option value="boxes">Boxes</option>
          <option value="containers">Containers</option>
        </select>
      </div>
      
      <Textarea
        name="additional_details"
        placeholder="Additional Details"
        value={form.additional_details}
        onChange={handleChange}
        rows={4}
      />
      
      <InteractiveHoverButton 
        type="submit" 
        text={submitting ? "Submitting..." : "Submit Request"} 
        disabled={submitting} 
      />
    </form>
  );
}
