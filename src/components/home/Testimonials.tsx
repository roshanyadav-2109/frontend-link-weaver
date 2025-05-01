
import React from 'react';

const testimonials = [
  {
    id: 1,
    quote: "LinkWeaver has transformed how we source materials. We've found reliable manufacturers and streamlined our procurement process.",
    author: "Sarah Johnson",
    position: "Procurement Director",
    company: "TechBuild Industries"
  },
  {
    id: 2,
    quote: "As a manufacturer, LinkWeaver has helped us connect with clients we wouldn't have reached otherwise. Our sales have increased by 30% since joining.",
    author: "Michael Chen",
    position: "Sales Manager",
    company: "Precision Components Co."
  },
  {
    id: 3,
    quote: "The catalog request feature saved us so much time. We received detailed information quickly and made informed decisions for our project.",
    author: "David Rodriguez",
    position: "Project Manager",
    company: "Global Construction Group"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-brand-blue py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover how LinkWeaver is helping businesses connect and grow
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
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-xl text-white mb-6">Trusted by Companies Worldwide</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg w-32 h-16 flex items-center justify-center">
                <div className="text-white font-bold">LOGO {i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
