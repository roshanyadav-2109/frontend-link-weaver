
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// The recipient email
const RECIPIENT = "info@anantyaoverseas.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Utility: Build a plain text or HTML email body
function makeHtmlBody(type: string, payload: Record<string, any>) {
  let html = `<h2 style="color:#22446d">New form submission - ${type}</h2>`;
  
  if (type === "General Application") {
    // Special formatting for job applications
    html += `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#22446d;margin-top:0;">Applicant Information</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Full Name:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.fullName}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Email:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.email}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Phone:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.phone}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Location:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.currentLocation}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Experience:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.experience}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Department Interest:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.interestedDepartment}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Current Role:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.currentRole}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Resume:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.resume}</td></tr>
        </table>
        <h4 style="color:#22446d;margin-top:20px;">Cover Letter:</h4>
        <div style="background:white;padding:15px;border-radius:4px;border-left:4px solid #22446d;">
          ${payload.coverLetter.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
  } else if (type === "New Quote Request") {
    // Special formatting for quote requests
    html += `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#22446d;margin-top:0;">Quote Request Details</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Customer Name:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.name}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Email:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.email}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Phone:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.phone}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Company:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.company || 'Not provided'}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Product:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.product_name}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Quantity:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.quantity} ${payload.unit || ''}</td></tr>
        </table>
        ${payload.additional_details ? `
          <h4 style="color:#22446d;margin-top:20px;">Additional Details:</h4>
          <div style="background:white;padding:15px;border-radius:4px;border-left:4px solid #22446d;">
            ${payload.additional_details.replace(/\n/g, '<br>')}
          </div>
        ` : ''}
      </div>
    `;
  } else if (type === "New Catalog Request") {
    // Special formatting for catalog requests
    html += `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#22446d;margin-top:0;">Catalog Request Details</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Customer Name:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.name}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Email:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.email}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Company:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.company}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Phone:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.phone}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Country:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.country}</td></tr>
          <tr><td style="padding:8px;font-weight:600;border-bottom:1px solid #ddd;">Custom Catalog:</td><td style="padding:8px;border-bottom:1px solid #ddd;">${payload.customCatalog ? 'Yes' : 'No'}</td></tr>
        </table>
        ${payload.selectedProductNames ? `
          <h4 style="color:#22446d;margin-top:20px;">Selected Products:</h4>
          <div style="background:white;padding:15px;border-radius:4px;border-left:4px solid #22446d;">
            ${payload.selectedProductNames}
          </div>
        ` : ''}
        ${payload.message ? `
          <h4 style="color:#22446d;margin-top:20px;">Additional Requirements:</h4>
          <div style="background:white;padding:15px;border-radius:4px;border-left:4px solid #22446d;">
            ${payload.message.replace(/\n/g, '<br>')}
          </div>
        ` : ''}
      </div>
    `;
  } else {
    // Regular table format for other forms
    html += `<table style="border-collapse:collapse;width:100%;margin:20px 0;">`;
    for (const [key, value] of Object.entries(payload)) {
      if (key !== 'type' && key !== 'applicationData') {
        html += `<tr><td style="padding:8px;font-weight:600;border:1px solid #ddd;background:#f8f9fa;">${key}</td><td style="padding:8px;border:1px solid #ddd;">${String(value)}</td></tr>`;
      }
    }
    html += `</table>`;
  }
  
  return html;
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const requestData = await req.json();
    console.log('Received form data:', requestData);
    
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    let subject = "New Form Submission";
    let emailData = requestData;
    
    // Handle different form types
    if (requestData.type === "quote") {
      subject = "New Quote Request";
      const { type, ...quoteData } = requestData;
      emailData = quoteData;
    } else if (requestData.type === "catalog") {
      subject = "New Catalog Request";
      const { type, ...catalogData } = requestData;
      emailData = catalogData;
    } else if (requestData.type === "application") {
      subject = "New General Job Application";
      emailData = requestData.applicationData;
    }

    const html = makeHtmlBody(subject, emailData);
    console.log('Sending email with subject:', subject);

    const emailResp = await resend.emails.send({
      from: "Anantya Overseas <info@anantyaoverseas.com>",
      to: [RECIPIENT],
      subject,
      html,
    });

    console.log('Email sent successfully:', emailResp);

    return new Response(JSON.stringify({ sent: true, result: emailResp }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (e: any) {
    console.error("[SendFormEmail] Error:", e);
    return new Response(
      JSON.stringify({ error: e?.message || "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
