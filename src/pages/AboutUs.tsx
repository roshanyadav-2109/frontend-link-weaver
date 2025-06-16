
import React from 'react';
import { Award, Globe, Users, TrendingUp } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { icon: <Globe className="h-8 w-8" />, number: "50+", label: "Countries Served" },
    { icon: <Users className="h-8 w-8" />, number: "1000+", label: "Happy Clients" },
    { icon: <Award className="h-8 w-8" />, number: "15+", label: "Years Experience" },
    { icon: <TrendingUp className="h-8 w-8" />, number: "$50M+", label: "Trade Volume" }
  ];

  const boardMembers = [
    {
      name: "Rajesh Kumar",
      position: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      bio: "With over 20 years in international trade, Rajesh has built strong relationships with manufacturers and buyers across the globe."
    },
    {
      name: "Priya Sharma",
      position: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c9ad?auto=format&fit=crop&w=400&q=80",
      bio: "Priya ensures seamless operations and quality control across all our export processes, maintaining our high standards."
    },
    {
      name: "Michael Johnson",
      position: "International Relations",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Michael manages our global partnerships and helps expand our reach to new international markets."
    },
    {
      name: "Anita Patel",
      position: "Quality Assurance",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
      bio: "Anita leads our quality assurance team, ensuring every product meets international standards and client expectations."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-teal py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Anantya Overseas</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Bridging continents through quality exports and trusted partnerships. 
              We're your gateway to authentic Indian products and global trade excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-brand-blue mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2008, Anantya Overseas began as a vision to connect India's rich 
                  manufacturing heritage with global markets. What started as a small export 
                  business has grown into a trusted bridge between quality Indian manufacturers 
                  and discerning international buyers.
                </p>
                <p>
                  Our journey has been marked by unwavering commitment to quality, transparency, 
                  and building lasting relationships. We believe that every product tells a story, 
                  and we're proud to be the storytellers who bring Indian craftsmanship and 
                  innovation to the world stage.
                </p>
                <p>
                  Today, we serve over 1000 clients across 50+ countries, facilitating trade 
                  worth millions of dollars annually while maintaining the personal touch and 
                  attention to detail that has defined us from the beginning.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80" 
                alt="Our team at work" 
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-brand-teal text-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-blue mb-4">Our Impact in Numbers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These numbers represent more than statistics—they represent relationships built, 
              trust earned, and dreams fulfilled across continents.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-center text-brand-teal mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-brand-blue mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-blue mb-4">Our Mission & Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-semibold text-brand-blue mb-3">Global Excellence</h3>
              <p className="text-gray-600">
                We strive to set the highest standards in international trade, ensuring every 
                transaction reflects our commitment to excellence and professionalism.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-brand-teal/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-brand-teal" />
              </div>
              <h3 className="text-xl font-semibold text-brand-blue mb-3">Trust & Transparency</h3>
              <p className="text-gray-600">
                Building lasting relationships through honest communication, transparent processes, 
                and unwavering integrity in every business interaction.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-semibold text-brand-blue mb-3">Quality Assurance</h3>
              <p className="text-gray-600">
                Every product undergoes rigorous quality checks to ensure it meets international 
                standards and exceeds client expectations consistently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-blue mb-4">Meet Our Leadership Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our experienced leadership team brings together decades of expertise in international 
              trade, quality management, and global business development.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {boardMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6 text-center">
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full border-4 border-brand-blue/10"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-brand-blue mb-1">{member.name}</h3>
                  <p className="text-brand-teal font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-teal py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Global Trade Journey?
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of satisfied clients who trust Anantya Overseas for their 
            international trade needs. Let's explore opportunities together.
          </p>
          <div className="space-x-4">
            <button className="bg-white text-brand-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Us Today
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-brand-blue transition-colors">
              View Our Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
