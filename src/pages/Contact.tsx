import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock, Send, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

const EMAIL_ENDPOINT = 'https://lusfthgqlkgktplplqnv.functions.supabase.co/send-form-email';

const Contact = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          ...values,
        })
      });
      const data = await response.json();
      if (response.ok && data.sent) {
        toast.success('Message sent successfully! We will get back to you shortly.');
        form.reset();
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (err) {
      toast.error("Could not send message. Please try again.");
      console.error("Contact form error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-teal py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-fade-in">
              <Globe className="h-5 w-5 text-white mr-2" />
              <span className="text-white font-medium">Connect Globally</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in animate-delay-100">
              Let's Connect & 
              <span className="block bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                Build Together
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto animate-fade-in animate-delay-200">
              Whether you're ready to place a bulk order or just want to understand how we work, our team is here to help you succeed.
            </p>
          </div>
        </div>
      </div>
      
      <div className="py-20 -mt-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-2xl bg-white">
                <CardContent className="p-12">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-brand-blue mb-4">
                      Send Us a Message
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold">Your Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="John Doe" 
                                  className="h-12 text-lg border-2 focus:border-brand-teal"
                                  {...field} 
                                />
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
                              <FormLabel className="text-lg font-semibold">Email Address</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="you@company.com" 
                                  className="h-12 text-lg border-2 focus:border-brand-teal"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">Subject</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="What is this regarding?" 
                                className="h-12 text-lg border-2 focus:border-brand-teal"
                                {...field} 
                              />
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
                            <FormLabel className="text-lg font-semibold">Your Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please let us know how we can help you..."
                                className="min-h-[150px] text-lg border-2 focus:border-brand-teal resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-brand-teal to-brand-blue hover:from-brand-blue hover:to-brand-teal text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <Send className="mr-3 h-5 w-5" />
                        Send Message
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-brand-blue mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 group hover:bg-gray-50 p-4 rounded-xl transition-colors">
                      <div className="bg-brand-blue/10 p-3 rounded-xl group-hover:bg-brand-blue group-hover:text-white transition-colors">
                        <MapPin className="h-6 w-6 text-brand-blue group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Our Office</h4>
                        <p className="text-gray-600">
                          501, Silver Business Point, Opp. Vodafone House<br />
                          S. G. Highway, Ahmedabad, Gujarat 380054<br />
                          India
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 group hover:bg-gray-50 p-4 rounded-xl transition-colors">
                      <div className="bg-brand-teal/10 p-3 rounded-xl group-hover:bg-brand-teal group-hover:text-white transition-colors">
                        <Phone className="h-6 w-6 text-brand-teal group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Call Us</h4>
                        <p className="text-gray-600">
                          <a href="tel:+919012345678" className="hover:text-brand-teal transition-colors">+91 90123 45678</a>
                          <br />
                          <a href="tel:+912235671234" className="hover:text-brand-teal transition-colors">+91 22 3567 1234</a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 group hover:bg-gray-50 p-4 rounded-xl transition-colors">
                      <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <Mail className="h-6 w-6 text-green-600 group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Email Us</h4>
                        <p className="text-gray-600">
                          <a href="mailto:anantyaoverseas@gmail.com" className="hover:text-brand-teal transition-colors">anantyaoverseas@gmail.com</a>
                          <br />
                          <a href="mailto:anantyaoverseas@gmail.com" className="hover:text-brand-teal transition-colors">anantyaoverseas@gmail.com</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-xl bg-gradient-to-br from-brand-blue to-brand-teal text-white">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Clock className="h-6 w-6 mr-3" />
                    <h4 className="font-semibold text-xl">Business Hours</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday - Friday:</span>
                      <span>9:00 AM - 6:00 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday:</span>
                      <span>10:00 AM - 2:00 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday:</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Global Presence Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-brand-blue mb-8">
            Our Global Presence
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed">
            With offices in India and distribution partners across the globe, we're equipped to serve your business needs anywhere in the world.
          </p>
          
          <Card className="max-w-4xl mx-auto border-0 shadow-2xl">
            <CardContent className="p-12">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 h-[400px] rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-20 w-20 text-brand-teal mx-auto mb-4" />
                  <p className="text-2xl text-gray-600 font-medium">Interactive World Map</p>
                  <p className="text-gray-500 mt-2">Connecting businesses across 20+ countries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
