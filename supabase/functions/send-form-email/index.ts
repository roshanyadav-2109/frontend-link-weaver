
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FormEmailRequest {
  type: 'contact' | 'quote' | 'catalog' | 'manufacturer_partnership';
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  product_name?: string;
  quantity?: string;
  additional_details?: string;
  company?: string;
  product_category?: string;
  specific_products?: string;
  business_type?: string;
  additional_requirements?: string;
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: FormEmailRequest = await req.json();
    console.log('Received form email request:', requestData);

    let emailContent = '';
    let subject = '';
    let recipientEmail = 'anantyaoverseas@gmail.com';

    switch (requestData.type) {
      case 'contact':
        subject = `Contact Form: ${requestData.subject || 'New Message'}`;
        emailContent = `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${requestData.name}</p>
          <p><strong>Email:</strong> ${requestData.email}</p>
          <p><strong>Phone:</strong> ${requestData.phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${requestData.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${requestData.message}</p>
        `;
        break;

      case 'quote':
        subject = `Quote Request: ${requestData.product_name}`;
        emailContent = `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${requestData.name}</p>
          <p><strong>Email:</strong> ${requestData.email}</p>
          <p><strong>Phone:</strong> ${requestData.phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${requestData.company || 'Not provided'}</p>
          <p><strong>Product:</strong> ${requestData.product_name}</p>
          <p><strong>Quantity:</strong> ${requestData.quantity || 'Not specified'}</p>
          <p><strong>Additional Details:</strong></p>
          <p>${requestData.additional_details || 'None provided'}</p>
        `;
        break;

      case 'catalog':
        subject = `Catalog Request: ${requestData.product_category}`;
        emailContent = `
          <h2>New Catalog Request</h2>
          <p><strong>Name:</strong> ${requestData.name}</p>
          <p><strong>Email:</strong> ${requestData.email}</p>
          <p><strong>Phone:</strong> ${requestData.phone}</p>
          <p><strong>Company:</strong> ${requestData.company}</p>
          <p><strong>Product Category:</strong> ${requestData.product_category}</p>
          <p><strong>Specific Products:</strong> ${requestData.specific_products}</p>
          <p><strong>Business Type:</strong> ${requestData.business_type}</p>
          <p><strong>Additional Requirements:</strong></p>
          <p>${requestData.additional_requirements}</p>
        `;
        break;

      case 'manufacturer_partnership':
        const partnershipData = requestData.data || requestData;
        subject = `Manufacturer Partnership Application: ${partnershipData.companyName || partnershipData.company_name}`;
        emailContent = `
          <h2>New Manufacturer Partnership Application</h2>
          <p><strong>GSTIN:</strong> ${partnershipData.gstin}</p>
          <p><strong>Company Name:</strong> ${partnershipData.companyName || partnershipData.company_name}</p>
          <p><strong>Representative:</strong> ${partnershipData.representativeName || partnershipData.representative_name}</p>
          <p><strong>Email:</strong> ${partnershipData.email}</p>
          <p><strong>Phone:</strong> ${partnershipData.phone}</p>
          <p><strong>Address:</strong> ${partnershipData.address || 'Not provided'}</p>
          <p><strong>City:</strong> ${partnershipData.city || 'Not provided'}</p>
          <p><strong>State:</strong> ${partnershipData.state || 'Not provided'}</p>
          <p><strong>Country:</strong> ${partnershipData.country || 'Not provided'}</p>
          <p><strong>Product Category:</strong> ${partnershipData.productCategory || partnershipData.product_category || 'Not specified'}</p>
          <p><strong>Years in Business:</strong> ${partnershipData.yearsInBusiness || partnershipData.years_in_business || 'Not specified'}</p>
          <p><strong>Annual Turnover:</strong> ${partnershipData.annualTurnover || partnershipData.annual_turnover || 'Not specified'}</p>
          <p><strong>Manufacturing Capacity:</strong> ${partnershipData.manufacturingCapacity || partnershipData.manufacturing_capacity || 'Not specified'}</p>
          <p><strong>Export Experience:</strong> ${partnershipData.exportExperience || partnershipData.export_experience || 'Not specified'}</p>
          <p><strong>Certifications:</strong> ${partnershipData.certifications || 'None provided'}</p>
          <p><strong>Previous Deals:</strong> ${partnershipData.previousDeals || partnershipData.previous_deals || 'None provided'}</p>
          <p><strong>Target Markets:</strong> ${partnershipData.targetMarkets || partnershipData.target_markets || 'Not specified'}</p>
          <p><strong>Additional Info:</strong></p>
          <p>${partnershipData.additionalInfo || partnershipData.additional_info || 'None provided'}</p>
        `;
        break;

      default:
        throw new Error('Invalid form type');
    }

    const emailResponse = await resend.emails.send({
      from: "Anantya Overseas <noreply@anantyaoverseas.com>",
      to: [recipientEmail],
      subject: subject,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      sent: true,
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-form-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        sent: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
