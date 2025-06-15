
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// The recipient email; change it if you want all notifications somewhere else
const RECIPIENT = "info@anantyaoverseas.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Utility: Build a plain text or HTML email body
function makeHtmlBody(type: string, payload: Record<string, any>) {
  let html = `<h2 style="color:#22446d">New form submission - ${type}</h2><table>`;
  for (const [key, value] of Object.entries(payload)) {
    html += `<tr><td style="padding:4px 8px;font-weight:600">${key}</td><td style="padding:4px 8px">${String(value)}</td></tr>`;
  }
  html += `</table>`;
  return html;
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { type, ...form } = await req.json(); // "type" should be "quote" or "catalog"
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    let subject = "New Form Submission";
    if (type === "quote") subject = "New Quote Request";
    if (type === "catalog") subject = "New Catalog Request";

    const html = makeHtmlBody(subject, form);

    const emailResp = await resend.emails.send({
      from: "Anantya Overseas <info@anantyaoverseas.com>",
      to: [RECIPIENT],
      subject,
      html,
    });

    // Optionally, include user sender in cc
    return new Response(JSON.stringify({ sent: true, result: emailResp }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (e: any) {
    console.error("[SendFormEmail]", e);
    return new Response(
      JSON.stringify({ error: e?.message || "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
