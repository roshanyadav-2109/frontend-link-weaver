
import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const EMAIL_ENDPOINT = "https://lusfthgqlkgktplplqnv.functions.supabase.co/send-form-email";

const Contact = () => {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { name, email, phone, subject, message } = form;
    if (!name || !email || !phone || !subject || !message) {
      toast.error("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          contactData: form
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error("Failed to send message: " + (data?.error || ""));
      }
    } catch (err: any) {
      toast.error("Could not send message. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d0e0f2] pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with us for any inquiries, support, or business opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
              
              <Input
                name="name"
                placeholder="Full Name *"
                value={form.name}
                onChange={handleChange}
                required
              />
              
              <Input
                name="email"
                placeholder="Email Address *"
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
                name="subject"
                placeholder="Subject *"
                value={form.subject}
                onChange={handleChange}
                required
              />
              
              <Textarea
                name="message"
                placeholder="Your Message *"
                value={form.message}
                onChange={handleChange}
                rows={6}
                required
              />
              
              <InteractiveHoverButton 
                type="submit" 
                text={submitting ? "Sending..." : "Send Message"} 
                disabled={submitting} 
              />
            </form>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Office Address</h3>
                <p className="text-gray-600">
                  Anantya Overseas<br />
                  Business District<br />
                  Mumbai, Maharashtra, India
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <p className="text-gray-600">anantyaoverseas@gmail.com</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Phone</h3>
                <p className="text-gray-600">+91 XXXXX XXXXX</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 9:00 AM - 2:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
