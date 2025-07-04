
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { type } = requestData;

    let emailResponse;

    switch (type) {
      case "contact":
        emailResponse = await handleContactForm(requestData.contactData);
        break;
      case "application":
        emailResponse = await handleJobApplication(requestData.applicationData);
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid request type" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
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

serve(handler);
