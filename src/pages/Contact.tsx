import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success('Message sent successfully! We will get back to you shortly.');
    form.reset();
  }

  return (
    <div>
      <div className="bg-brand-blue py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            Let's Connect!
          </h1>
          <p className="mt-4 text-lg text-white/80 text-center max-w-3xl mx-auto">
            Whether you're ready to place a bulk order or just want to understand how we work, our team is here to help.
          </p>
        </div>
      </div>
      
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-brand-blue mb-6">
                Send Us a Message
              </h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="What is this regarding?" {...field} />
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
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please let us know how we can help you..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-brand-teal hover:bg-brand-teal/90">
                    Send Message
                  </Button>
                </form>
              </Form>
            </div>
            
            <div className="lg:pl-10">
              <h2 className="text-2xl font-bold text-brand-blue mb-6">
                Contact Information
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-brand-blue/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Our Office</h3>
                    <p className="text-gray-600 mt-1">
                      123 Export Avenue, Business District<br />
                      Mumbai, 400001<br />
                      India
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-brand-blue/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Call Us</h3>
                    <p className="text-gray-600 mt-1">
                      <a href="tel:+919012345678" className="hover:text-brand-teal">+91 90123 45678</a>
                      <br />
                      <a href="tel:+912235671234" className="hover:text-brand-teal">+91 22 3567 1234</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-brand-blue/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email Us</h3>
                    <p className="text-gray-600 mt-1">
                      <a href="mailto:info@anantyaoverseas.com" className="hover:text-brand-teal">info@anantyaoverseas.com</a>
                      <br />
                      <a href="mailto:sales@anantyaoverseas.com" className="hover:text-brand-teal">sales@anantyaoverseas.com</a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="font-semibold text-lg mb-4">Business Hours</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    <span className="font-medium">Monday - Friday:</span> 9:00 AM - 6:00 PM IST
                  </p>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Saturday:</span> 10:00 AM - 2:00 PM IST
                  </p>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Sunday:</span> Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-brand-blue mb-6">
            Our Global Presence
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-8">
            With offices in India and distribution partners across the globe, we're equipped to serve your business needs anywhere in the world.
          </p>
          
          {/* Placeholder for a map or global presence visualization */}
          <div className="bg-gray-200 h-[400px] rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Interactive Map Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
