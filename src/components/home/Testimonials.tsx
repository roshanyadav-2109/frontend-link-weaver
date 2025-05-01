
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
    <section className="premium-blue-gradient py-16 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="url(#smallGrid)"/>
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white text-shadow-md mb-4">Stories of Trust & Success</h2>
          <p className="text-gray-100 max-w-2xl mx-auto">
            Hear what our clients and partners say about working with Anantya Overseas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="premium-glass-card p-6 h-full hover:-translate-y-1 transition-all duration-300">
              <div className="mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"<span className="font-medium">{testimonial.quote}</span>"</p>
              <div>
                <p className="font-semibold text-brand-blue">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.position}, {testimonial.company}</p>
                <p className="text-sm text-brand-teal">{testimonial.country}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-xl text-white text-shadow-md mb-6">Proudly Trusted by Global Partners</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="premium-glass-card p-4 rounded-lg w-32 h-16 flex items-center justify-center border border-white/30">
                <div className="font-bold text-white text-shadow-sm">PARTNER {i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
