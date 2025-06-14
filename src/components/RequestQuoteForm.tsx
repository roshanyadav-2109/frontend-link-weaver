
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

interface FormData {
  name: string;
  email: string;
  product_name: string;
  quantity: string;
  details: string;
}

export default function RequestQuoteForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
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
    const { name, email, product_name } = form;
    if (!name || !email || !product_name) {
      toast.error("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }
    const { error } = await supabase.from("quote_requests").insert([
      {
        name: form.name,
        email: form.email,
        product_name: form.product_name,
        quantity: form.quantity,
        additional_details: form.details,
        status: "pending",
        phone: "(not provided)",
        unit: "units",
        user_id: "guest"
      },
    ]);
    if (error) {
      toast.error("Could not submit quote request.");
    } else {
      toast.success("Quote request submitted!");
      setForm({
        name: "",
        email: "",
        product_name: "",
        quantity: "",
        details: "",
      });
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-2">Request a Quote</h2>
      <Input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <Input
        name="email"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <Input
        name="product_name"
        placeholder="Product/Service"
        value={form.product_name}
        onChange={handleChange}
        required
      />
      <Input
        name="quantity"
        placeholder="Quantity (optional)"
        value={form.quantity}
        onChange={handleChange}
      />
      <Textarea
        name="details"
        placeholder="Details (optional)"
        value={form.details}
        onChange={handleChange}
        rows={4}
      />
      <InteractiveHoverButton type="submit" text={submitting ? "Submitting..." : "Submit Request"} disabled={submitting} />
    </form>
  );
}
