
import React from 'react';
import { motion } from 'framer-motion';

const AboutUs: React.FC = () => {
  return (
    <div className="pt-24 bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a365d] to-[#2d5a8c] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">About Anantya Overseas</h1>
            <p className="text-lg md:text-xl text-white/90">
              A premier import-export company connecting quality Indian manufacturers with global markets since 2010.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-6">Our Story</h2>
              <p className="text-gray-700 mb-6">
                Founded in 2010 by a team of international trade experts, Anantya Overseas began with a mission to showcase India's manufacturing excellence to the world. What started as a small export venture has now grown into a comprehensive import-export company with a presence in over 30 countries.
              </p>
              <p className="text-gray-700 mb-6">
                Our journey has been defined by our unwavering commitment to quality, relationships built on trust, and an in-depth understanding of international markets and trade regulations. We've helped hundreds of manufacturers find new markets and thousands of businesses source reliable products.
              </p>
              <p className="text-gray-700">
                Today, we continue to expand our horizons while staying true to our core values of integrity, excellence, and customer-centricity.
              </p>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80" 
                alt="Anantya Overseas team" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-premium border border-blue-100">
              <div className="h-16 w-16 bg-[#1a365d] rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1a365d] mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To be the most trusted bridge between Indian manufacturers and global markets, facilitating seamless international trade and contributing to India's export growth story.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-premium border border-blue-100">
              <div className="h-16 w-16 bg-[#2d6da3] rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#2d6da3] mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To provide comprehensive import-export solutions that connect quality-conscious buyers with reliable suppliers, ensure regulatory compliance, and optimize supply chain efficiency through technology and expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-12 text-center">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Integrity",
                description: "We conduct business with honesty, transparency, and ethical standards, building trust with clients and partners worldwide."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: "Excellence",
                description: "We strive for excellence in every aspect of our operations, from product selection to logistics management and customer service."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Partnership",
                description: "We believe in building long-term relationships with our clients, suppliers, and stakeholders based on mutual respect and benefit."
              },
            ].map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
              >
                <div className="mb-4 text-[#2d6da3] mx-auto flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-12 text-center">Leadership Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                position: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
                bio: "With over 25 years of experience in international trade, Rajesh leads the company's strategic vision and global expansion."
              },
              {
                name: "Priya Sharma",
                position: "Director of Operations",
                image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
                bio: "Priya oversees the company's day-to-day operations, ensuring seamless coordination between departments and partners."
              },
              {
                name: "Amit Patel",
                position: "Head of International Relations",
                image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80",
                bio: "Amit manages our relationships with international clients and partners across 30+ countries."
              },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
                <div className="h-64 overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1a365d] mb-1">{member.name}</h3>
                  <p className="text-[#2d6da3] font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-12 text-center">Key Milestones</h2>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#1a365d] before:to-[#2d6da3] before:via-[#1a365d]">
            {[
              {
                year: "2010",
                title: "Company Founded",
                description: "Anantya Overseas was established with a focus on textile exports."
              },
              {
                year: "2013",
                title: "Expansion to Europe",
                description: "Opened our first international office in London, UK."
              },
              {
                year: "2015",
                title: "Product Portfolio Growth",
                description: "Expanded from textiles to include handicrafts, food products, and leather goods."
              },
              {
                year: "2018",
                title: "Digital Transformation",
                description: "Launched our digital platform to streamline order management and logistics."
              },
              {
                year: "2020",
                title: "10-Year Anniversary & Global Reach",
                description: "Celebrated 10 years with presence in 30+ countries and 500+ partner manufacturers."
              },
              {
                year: "2023",
                title: "Sustainability Initiative",
                description: "Launched our eco-friendly product lines and carbon-neutral shipping options."
              },
            ].map((milestone, index) => (
              <div key={index} className="relative flex items-center md:justify-between">
                <div className="absolute left-0 md:left-1/2 ml-3.5 md:ml-0 md:-translate-x-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-[#1a365d] border-4 border-white shadow-md z-10"></div>
                
                <div className="ml-12 md:ml-0 md:max-w-[45%] md:pr-10 md:text-right md:order-1 order-2">
                  <div className="text-[#2d6da3] mb-1 font-bold">{milestone.year}</div>
                  <div className="font-bold text-gray-800 mb-1">{milestone.title}</div>
                  <div className="text-sm text-gray-600">{milestone.description}</div>
                </div>
                
                <div className="hidden md:block md:max-w-[45%] md:pl-10 order-1 md:order-2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Video */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-8 text-center">Our Global Impact</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-center mb-12">
            Watch this short film about how Anantya Overseas is connecting Indian manufacturers with international markets and making a difference in the global trade landscape.
          </p>
          
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-premium">
            <div className="aspect-w-16 aspect-h-9 relative bg-gray-100">
              <video 
                className="w-full h-full object-cover" 
                controls
                poster="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1740"
              >
                <source src="https://cdn.coverr.co/videos/coverr-aerial-view-of-a-cargo-ship-2581/1080p.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* CTA with improved HEARTFELT text highlight */}
      <section className="py-16 bg-gradient-to-r from-[#1a365d] to-[#2d5a8c] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Explore Global Opportunities?</h2>
          <p className="text-lg text-white max-w-2xl mx-auto mb-8">
            Whether you're looking to export your products or source quality goods from India, our team is ready to assist you with a <span className="font-bold px-2 py-1 rounded bg-white text-[#1a365d]">HEARTFELT</span> commitment to your success.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/contact" className="bg-white text-[#1a365d] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Contact Us
            </a>
            <a href="/catalog-request" className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
              Request Catalog
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
