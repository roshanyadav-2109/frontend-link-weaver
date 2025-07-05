
import React from 'react';
import { Mail, Phone, MapPin, ArrowRight, Users, Globe, Award, Zap } from 'lucide-react';

const AboutUs: React.FC = () => {
  const founders = [
    {
      name: "Tejash Mishra",
      title: "Co-Founder, IIT Madras Sophomore",
      image: "/lovable-uploads/94293c2c-2a95-4774-97ef-bd748e5229b7.png",
      linkedin: "https://www.linkedin.com/in/tejashmishra/"
    },
    {
      name: "Roshan Kumar Singh", 
      title: "Co-Founder, IIT Madras Sophomore",
      image: "/lovable-uploads/34e1ecf2-d4dd-4ffd-a1e8-016f95906c3d.png",
      linkedin: "https://www.linkedin.com/in/roshan-kumar-singh-3461002ba/"
    },
    {
      name: "Vishakh Agarwal",
      title: "Co-Founder,Founding Board Member at Karo Startup , SWE at HPE Compute, President JITSIE IIT Madras", 
      image: "/lovable-uploads/8bf8cf03-6d46-4fd6-9227-dc3d4c91e44b.png",
      linkedin: "https://www.linkedin.com/in/vishakh-agarwal/"
    }
  ];

  const values = [
    {
      title: "Excellence",
      description: "We strive for excellence in every aspect of our operations, from sourcing to delivery, ensuring exceptional value for our clients.",
      icon: <Award className="h-12 w-12 text-brand-blue" />
    },
    {
      title: "Trust", 
      description: "Building lasting relationships through transparency, reliability, and unwavering commitment to our clients' success.",
      icon: <Users className="h-12 w-12 text-brand-blue" />
    },
    {
      title: "Innovation",
      description: "Continuously evolving our strategies and solutions to meet the dynamic needs of the global marketplace.",
      icon: <Zap className="h-12 w-12 text-brand-blue" />
    },
    {
      title: "Global Reach",
      description: "Connecting markets worldwide through our extensive network and deep understanding of international trade.",
      icon: <Globe className="h-12 w-12 text-brand-blue" />
    }
  ];

  const services = [
    {
      title: "Global Sourcing",
      description: "We leverage our extensive international network to source products at the most competitive rates, ensuring maximum value for our clients across diverse industries and markets."
    },
    {
      title: "B2B Wholesale Solutions", 
      description: "Our comprehensive wholesale services cater to distributors and retailers, providing bulk procurement solutions that enhance profitability and operational efficiency."
    },
    {
      title: "Startup Support",
      description: "We understand the unique challenges faced by emerging businesses and provide tailored procurement solutions that help startups reduce costs and accelerate growth."
    }
  ];

  const whyChooseUs = [
    {
      title: "Competitive Pricing",
      description: "Our strategic sourcing methodology ensures you receive the most competitive rates in the market without compromising on quality."
    },
    {
      title: "Regulatory Compliance",
      description: "Fully registered with the Government of India and maintaining all required certifications for seamless business operations."
    },
    {
      title: "Dedicated Support", 
      description: "Our team provides personalized attention to understand your unique requirements and deliver tailored solutions."
    },
    {
      title: "Quality Assurance",
      description: "Rigorous quality control processes and partnerships with trusted suppliers ensure consistent product excellence."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-blue to-brand-teal text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Anantya Overseas</h1>
            <p className="text-xl md:text-2xl leading-relaxed">
              Connecting global markets through innovative sourcing solutions and strategic partnerships. 
              We empower businesses worldwide with competitive procurement services and comprehensive trade facilitation.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    Anantya Overseas was founded with a vision to revolutionize global trade by making high-quality 
                    products accessible to businesses of all sizes. Born from the entrepreneurial spirit of three 
                    visionary co-founders, our company emerged from a shared belief that innovative sourcing solutions 
                    could transform how businesses access international markets.
                  </p>
                  <p>
                    What started as an ambitious idea among young entrepreneurs has evolved into a trusted partner 
                    for wholesalers, distributors, and startups seeking competitive procurement solutions. Our journey 
                    reflects our commitment to bridging global markets while supporting the growth of emerging businesses 
                    through cost-effective sourcing strategies.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-brand-blue to-brand-teal p-8 rounded-2xl shadow-2xl">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Founded on Innovation</h3>
                    <p className="text-white/90 text-lg">
                      Three visionary minds came together to create a platform that bridges 
                      global markets and empowers businesses worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="lg:order-2">
                <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Vision & Future</h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    At Anantya Overseas, we envision a world where geographical boundaries don't limit business 
                    opportunities. Our long-term vision is to become the leading global facilitator of cost-effective 
                    procurement solutions, empowering businesses of all sizes to access international markets seamlessly.
                  </p>
                  <p>
                    We are committed to continuous innovation in our sourcing strategies, expanding our global network, 
                    and developing cutting-edge solutions that address the evolving needs of modern businesses. Our future 
                    roadmap includes strategic partnerships, technological advancement, and sustainable growth initiatives 
                    that benefit our clients and communities worldwide.
                  </p>
                </div>
              </div>
              <div className="lg:order-1">
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-8 rounded-2xl shadow-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-blue mb-2">50+</div>
                      <div className="text-gray-600">Global Partners</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-teal mb-2">100+</div>
                      <div className="text-gray-600">Happy Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-blue mb-2">24/7</div>
                      <div className="text-gray-600">Support</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-teal mb-2">15+</div>
                      <div className="text-gray-600">Countries</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">What We Do</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide comprehensive sourcing and procurement solutions that help businesses thrive in the global marketplace.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 group">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-teal rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ArrowRight className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Founders</h2>
              <p className="text-xl text-gray-600">
                Three visionary entrepreneurs united by a shared commitment to transforming global trade
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {founders.map((founder, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={founder.image} 
                      alt={founder.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{founder.name}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{founder.title}</p>
                    <a 
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-brand-blue hover:text-brand-teal transition-colors font-semibold"
                    >
                      Connect on LinkedIn
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Core Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These values guide every decision we make and every relationship we build.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center group">
                  <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Why Choose Anantya Overseas</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We combine expertise, innovation, and dedication to deliver exceptional results for our clients.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
