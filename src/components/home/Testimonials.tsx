
import React from 'react';
import { TestimonialsSection } from '@/components/ui/testimonials-with-marquee';

const testimonials = [
  {
    author: {
      name: "Sarah Johnson",
      handle: "Procurement Director",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Anantya Overseas has transformed how we source materials from India. Their quality assurance and logistics support are exceptional."
  },
  {
    author: {
      name: "Rajesh Mehta",
      handle: "CEO",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "As a manufacturer, partnering with Anantya has helped us reach international clients we wouldn't have found otherwise. Our exports have increased by 40% since joining."
  },
  {
    author: {
      name: "David Rodriguez",
      handle: "Supply Chain Manager",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    text: "The personalized catalogue service saved us so much time. We received detailed information tailored to our needs and made informed decisions for our import strategy."
  },
  {
    author: {
      name: "Maria Chen",
      handle: "Operations Director",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Outstanding service quality and reliable delivery times. Anantya Overseas has become our preferred partner for all Indian sourcing needs."
  },
  {
    author: {
      name: "Ahmed Hassan",
      handle: "Import Manager",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Their deep understanding of international trade regulations and customs procedures has saved us countless hours and potential complications."
  }
];

const Testimonials: React.FC = () => {
  return (
    <TestimonialsSection
      title="Stories of Trust & Success"
      description="Hear what our clients and partners say about working with Anantya Overseas"
      testimonials={testimonials}
      className="bg-gray-50"
    />
  );
};

export default Testimonials;

