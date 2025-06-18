
import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Globe, Users, TrendingUp, Target, Shield, Lightbulb, Heart, CheckCircle, ExternalLink } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { icon: <Globe className="h-8 w-8" />, number: "50+", label: "Countries Served" },
    { icon: <Users className="h-8 w-8" />, number: "1000+", label: "Happy Clients" },
    { icon: <Award className="h-8 w-8" />, number: "5+", label: "Years Experience" },
    { icon: <TrendingUp className="h-8 w-8" />, number: "$10M+", label: "Trade Volume" }
  ];

  const founders = [
    {
      name: "Roshan Kumar Singh",
      title: "Co-Founder, IIT Madras Sophomore",
      image: "/lovable-uploads/34e1ecf2-d4dd-4ffd-a1e8-016f95906c3d.png",
      linkedin: "https://www.linkedin.com/in/roshan-kumar-singh-3461002ba/"
    },
    {
      name: "Tejash Mishra",
      title: "Co-Founder, IIT Madras Sophomore", 
      image: "/lovable-uploads/94293c2c-2a95-4774-97ef-bd748e5229b7.png",
      linkedin: "https://www.linkedin.com/in/tejashmishra/"
    },
    {
      name: "Vishakh Agarwal",
      title: "Co-Founder, Karo Startup, SWE at HPE Compute, President JITSIE IIT Madras",
      image: "/lovable-uploads/8bf8cf03-6d46-4fd6-9227-dc3d4c91e44b.png",
      linkedin: "https://www.linkedin.com/in/vishakh-agarwal/"
    }
  ];

  const services = [
    {
      title: "Global Sourcing",
      description: "We leverage our extensive international network to source products at the most competitive rates, ensuring maximum value for our clients across diverse industries and markets.",
      icon: <Globe className="h-8 w-8" />
    },
    {
      title: "B2B Wholesale Solutions", 
      description: "Our comprehensive wholesale services cater to distributors and retailers, providing bulk procurement solutions that enhance profitability and operational efficiency.",
      icon: <Users className="h-8 w-8" />
    },
    {
      title: "Startup Support",
      description: "We understand the unique challenges faced by emerging businesses and provide tailored procurement solutions that help startups reduce costs and accelerate growth.",
      icon: <TrendingUp className="h-8 w-8" />
    }
  ];

  const values = [
    {
      title: "Excellence",
      description: "We strive for excellence in every aspect of our operations, from sourcing to delivery, ensuring exceptional value for our clients.",
      icon: <Award className="h-6 w-6" />
    },
    {
      title: "Trust",
      description: "Building lasting relationships through transparency, reliability, and unwavering commitment to our clients' success.",
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "Innovation", 
      description: "Continuously evolving our strategies and solutions to meet the dynamic needs of the global marketplace.",
      icon: <Lightbulb className="h-6 w-6" />
    },
    {
      title: "Global Reach",
      description: "Connecting markets worldwide through our extensive network and deep understanding of international trade.",
      icon: <Globe className="h-6 w-6" />
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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-blue via-brand-blue to-brand-teal py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              About <span className="text-brand-teal">Anantya</span> Overseas
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed opacity-90">
              Connecting global markets through innovative sourcing solutions and strategic partnerships. 
              We empower businesses worldwide with competitive procurement services and comprehensive trade facilitation.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-brand-blue/10 to-brand-teal/10 p-6 rounded-2xl mb-4 group-hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center text-brand-blue mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-brand-blue mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium text-sm md:text-base">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-brand-blue to-brand-teal mx-auto"></div>
            </div>
            <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
              <p className="text-xl mb-6">
                Anantya Overseas was founded with a vision to revolutionize global trade by making high-quality products 
                accessible to businesses of all sizes. Born from the entrepreneurial spirit of three visionary co-founders, 
                our company emerged from a shared belief that innovative sourcing solutions could transform how businesses 
                access international markets.
              </p>
              <p className="text-lg mb-6">
                What started as an ambitious idea among young entrepreneurs has evolved into a trusted partner for wholesalers, 
                distributors, and startups seeking competitive procurement solutions. Our journey reflects our commitment to 
                bridging global markets while supporting the growth of emerging businesses through cost-effective sourcing strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Vision & Future</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-brand-blue to-brand-teal mb-8"></div>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  At Anantya Overseas, we envision a world where geographical boundaries don't limit business opportunities. 
                  Our long-term vision is to become the leading global facilitator of cost-effective procurement solutions, 
                  empowering businesses of all sizes to access international markets seamlessly.
                </p>
                <p className="text-lg">
                  We are committed to continuous innovation in our sourcing strategies, expanding our global network, and 
                  developing cutting-edge solutions that address the evolving needs of modern businesses. Our future roadmap 
                  includes strategic partnerships, technological advancement, and sustainable growth initiatives that benefit 
                  our clients and communities worldwide.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-brand-blue/10 to-brand-teal/10 rounded-3xl p-8">
                <div className="flex items-center justify-center">
                  <Target className="h-32 w-32 text-brand-blue" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">What We Do</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-blue to-brand-teal mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="bg-gradient-to-br from-brand-blue/10 to-brand-teal/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-brand-blue">{service.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Founders</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Three visionary entrepreneurs united by a shared commitment to transforming global trade
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-blue to-brand-teal mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {founders.map((founder, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="relative mb-6">
                    <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-brand-blue/10 to-brand-teal/10 p-1">
                      <img 
                        src={founder.image} 
                        alt={founder.name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{founder.name}</h3>
                    <p className="text-brand-blue font-medium mb-4 leading-snug">{founder.title}</p>
                    <a 
                      href={founder.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-teal transition-colors font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-blue to-brand-teal mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="bg-gradient-to-br from-brand-blue/10 to-brand-teal/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-brand-blue">{value.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose Anantya Overseas</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-blue to-brand-teal mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-brand-teal mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative bg-gradient-to-br from-brand-blue via-brand-blue to-brand-teal py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Global Trade Journey?
          </h2>
          <p className="text-white/90 text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Join thousands of satisfied clients who trust Anantya Overseas for their 
            international trade needs. Let's explore opportunities together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="bg-white text-brand-blue px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Contact Us Today
            </Link>
            <Link 
              to="/categories"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-brand-blue transition-all duration-300 transform hover:scale-105"
            >
              View Our Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
