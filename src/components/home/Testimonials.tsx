
import React from 'react';

const testimonials = [
  {
    id: 1,
    quote: "Anantya Overseas has transformed how we source materials from India. Their quality assurance and logistics support are exceptional.",
    author: "Sarah Johnson",
    position: "Procurement Director",
    company: "Global Retail Inc.",
    country: "United Kingdom"
  },
  {
    id: 2,
    quote: "As a manufacturer, partnering with Anantya has helped us reach international clients we wouldn't have found otherwise. Our exports have increased by 40% since joining.",
    author: "Rajesh Mehta",
    position: "CEO",
    company: "Premium Textiles Ltd.",
    country: "India"
  },
  {
    id: 3,
    quote: "The personalized catalogue service saved us so much time. We received detailed information tailored to our needs and made informed decisions for our import strategy.",
    author: "David Rodriguez",
    position: "Supply Chain Manager",
    company: "European Markets Group",
    country: "Spain"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-brand-blue py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Stories of Trust & Success</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Hear what our clients and partners say about working with Anantya Overseas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold text-brand-blue">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.position}, {testimonial.company}</p>
                <p className="text-sm text-brand-teal">{testimonial.country}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-xl text-white mb-6">Proudly Trusted by Global Partners</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg w-32 h-16 flex items-center justify-center">
                <div className="text-white font-bold">PARTNER {i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
