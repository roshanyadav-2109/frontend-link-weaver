
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequestData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  productName: string;
  quantity: string;
  unit: string;
  additionalDetails?: string;
}

interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface CatalogRequestData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  interestedCategories: string[];
  businessType: string;
  additionalInfo?: string;
}

interface ApplicationData {
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  experience: string;
  interestedDepartment: string;
  currentRole: string;
  coverLetter: string;
  resume?: string;
}

interface ManufacturerPartnershipData {
  representativeName: string;
  email: string;
  phone: string;
  companyName: string;
  gstin: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  productCategory?: string;
  yearsInBusiness?: number;
  annualTurnover?: string;
  manufacturingCapacity?: string;
  exportExperience?: string;
  certifications?: string;
  targetMarkets?: string;
  previousDeals?: string;
  additionalInfo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { type } = requestData;

    let emailResponse;

    switch (type) {
      case "quote":
        emailResponse = await handleQuoteRequest(requestData.quoteData);
        break;
      case "contact":
        emailResponse = await handleContactForm(requestData.contactData);
        break;
      case "catalog":
        emailResponse = await handleCatalogRequest(requestData.catalogData);
        break;
      case "application":
        emailResponse = await handleJobApplication(requestData.applicationData);
        break;
      case "partnership":
        emailResponse = await handleManufacturerPartnership(requestData.partnershipData);
        break;
      default:
        throw new Error("Invalid request type");
    }

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-form-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function handleQuoteRequest(data: QuoteRequestData) {
  const adminEmail = await resend.emails.send({
    from: "Anantya Overseas <noreply@anantya-overseas.com>",
    to: ["anantyaoverseas@gmail.com"],
    subject: `New Quote Request from ${data.name}`,
    html: `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
      <p><strong>Product:</strong> ${data.productName}</p>
      <p><strong>Quantity:</strong> ${data.quantity} ${data.unit}</p>
      ${data.additionalDetails ? `<p><strong>Additional Details:</strong> ${data.additionalDetails}</p>` : ''}
      <p><em>Please respond to this quote request through the admin panel.</em></p>
    `,
  });

  const userEmail = await resend.emails.send({
    from: "Anantya Overseas <noreply@anantya-overseas.com>",
    to: [data.email],
    subject: "Quote Request Received - Anantya Overseas",
    html: `
      <h2>Thank you for your quote request!</h2>
      <p>Dear ${data.name},</p>
      <p>We have received your quote request for <strong>${data.productName}</strong> and will get back to you within 24 hours.</p>
      <p><strong>Request Details:</strong></p>
      <ul>
        <li>Product: ${data.productName}</li>
        <li>Quantity: ${data.quantity} ${data.unit}</li>
      </ul>
      <p>Our team will review your requirements and provide you with the best possible quote.</p>
      <p>Best regards,<br>Anantya Overseas Team</p>
    `,
  });

  return { adminEmail, userEmail };
}

async function handleContactForm(data: ContactData) {
  const adminEmail = await resend.emails.send({
    from: "Anantya Overseas <noreply@anantya-overseas.com>",
    to: ["anantyaoverseas@gmail.com"],
    subject: `Contact Form: ${data.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    `,
  });

  const userEmail = await resend.emails.send({
    from: "Anantya Overseas <noreply@anantya-overseas.com>",
    to: [data.email],
    subject: "Message Received - Anantya Overseas",
    html: `
      <h2>Thank you for contacting us!</h2>
      <p>Dear ${data.name},</p>
      <p>We have received your message and will respond to you shortly.</p>
      <p><strong>Your Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <p>Best regards,<br>Anantya Overseas Team</p>
    `,
  });

  return { adminEmail, userEmail };
}

async function handleCatalogRequest(data: CatalogRequestData) {
  const adminEmail = await resend.emails.send({
    from: "Anantya Overseas <noreply@anantya-overseas.com>",
    to: ["anantyaoverseas@gmail.com"],
    subject: `Catalog Request from ${data.name}`,
    html: `
      <h2>New Catalog Request</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
      <p><strong>Business Type:</strong> ${data.businessType}</p>
      <p><strong>Interested Categories:</strong> ${data.interestedCategories.join(', ')}</p>
      ${data.additionalInfo ? `<p><strong>Additional Info:</strong> ${data.additionalInfo}</p>` : ''}
    `,
  });

  const userEmail = await resend.emails.send({
    from: "Anantya Overseas <noreply@anantya-overseas.com>",
    to: [data.email],
    subject: "Catalog Request Received - Anantya Overseas",
    html: `
      <h2>Thank you for your catalog request!</h2>
      <p>Dear ${data.name},</p>
      <p>We have received your catalog request and will send you the relevant catalogs within 24 hours.</p>
      <p><strong>Requested Categories:</strong> ${data.interestedCategories.join(', ')}</p>
      <p>Best regards,<br>Anantya Overseas Team</p>
    `,
  });

  return { adminEmail, userEmail };
}

async function handleJobApplication(data: ApplicationData) {
  const adminEmail = await resend.emails.send({
    from: "Anantya Overseas <noreply@anantya-overseas.com>",
    to: ["anantyaoverseas@gmail.com"],
    subject: `Job Application from ${data.fullName}`,
    html: `
      <h2>New Job Application</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Location:</strong> ${data.currentLocation}</p>
      <p><strong>Experience:</strong> ${data.experience}</p>
      <p><strong>Interested Department:</strong> ${data.interestedDepartment}</p>
      <p><strong>Current Role:</strong> ${data.currentRole}</p>
      <p><strong>Cover Letter:</strong></p>
      <p>${data.coverLetter.replace(/\n/g, '<br>')}</p>
      ${data.resume ? `<p><strong>Resume:</strong> <a href="${data.resume}">View Resume</a></p>` : ''}
    `,
  });

  const userEmail = await resend.emails.send({
    from: "Anantya Overseas <noreply@anantya-overseas.com>",
    to: [data.email],
    subject: "Application Received - Anantya Overseas",
    html: `
      <h2>Thank you for your application!</h2>
      <p>Dear ${data.fullName},</p>
      <p>We have received your job application for the ${data.interestedDepartment} department.</p>
      <p>Our HR team will review your application and get back to you if your profile matches our requirements.</p>
      <p>Best regards,<br>Anantya Overseas HR Team</p>
    `,
  });

  return { adminEmail, userEmail };
}

async function handleManufacturerPartnership(data: ManufacturerPartnershipData) {
  const adminEmail = await resend.emails.send({
    from: "Anantya Overseas <noreply@anantya-overseas.com>",
    to: ["anantyaoverseas@gmail.com"],
    subject: `Manufacturer Partnership Request from ${data.companyName}`,
    html: `
      <h2>New Manufacturer Partnership Request</h2>
      <p><strong>Company:</strong> ${data.companyName}</p>
      <p><strong>Representative:</strong> ${data.representativeName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>GSTIN:</strong> ${data.gstin}</p>
      ${data.address ? `<p><strong>Address:</strong> ${data.address}, ${data.city}, ${data.state}, ${data.country}</p>` : ''}
      ${data.productCategory ? `<p><strong>Product Category:</strong> ${data.productCategory}</p>` : ''}
      ${data.yearsInBusiness ? `<p><strong>Years in Business:</strong> ${data.yearsInBusiness}</p>` : ''}
      ${data.annualTurnover ? `<p><strong>Annual Turnover:</strong> ${data.annualTurnover}</p>` : ''}
      ${data.manufacturingCapacity ? `<p><strong>Manufacturing Capacity:</strong> ${data.manufacturingCapacity}</p>` : ''}
      ${data.exportExperience ? `<p><strong>Export Experience:</strong> ${data.exportExperience}</p>` : ''}
      ${data.certifications ? `<p><strong>Certifications:</strong> ${data.certifications}</p>` : ''}
      ${data.targetMarkets ? `<p><strong>Target Markets:</strong> ${data.targetMarkets}</p>` : ''}
      ${data.previousDeals ? `<p><strong>Previous Deals:</strong> ${data.previousDeals}</p>` : ''}
      ${data.additionalInfo ? `<p><strong>Additional Info:</strong> ${data.additionalInfo}</p>` : ''}
    `,
  });

  const userEmail = await resend.emails.send({
    from: "Anantya Overseas <noreply@anantya-overseas.com>",
    to: [data.email],
    subject: "Partnership Request Received - Anantya Overseas",
    html: `
      <h2>Thank you for your partnership interest!</h2>
      <p>Dear ${data.representativeName},</p>
      <p>We have received your manufacturer partnership request for ${data.companyName}.</p>
      <p>Our business development team will review your application and contact you within 48 hours to discuss potential collaboration opportunities.</p>
      <p>Best regards,<br>Anantya Overseas Business Development Team</p>
    `,
  });

  return { adminEmail, userEmail };
}

serve(handler);
