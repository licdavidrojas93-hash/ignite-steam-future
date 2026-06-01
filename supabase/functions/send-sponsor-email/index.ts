// Send a transactional email to an IMPULSA sponsor.
// Supports Resend, SendGrid or any provider via "smtp" (Brevo-compatible JSON API).
// Reads credentials from public.email_settings; template from public.email_templates.
// Public function (verify_jwt=false): callable from webhook AND from admin panel.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface Body {
  sponsor_id?: string;
  template_key?: string;
  test_to?: string;        // si viene, manda preview a este correo y no marca email_sent
  override_subject?: string;
  override_body?: string;
  force?: boolean;         // permitir reenvío aunque email_sent=true
}

const fmtMoney = (amount: number | null | undefined, currency: string | null | undefined) =>
  amount != null
    ? new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: currency || "MXN",
        maximumFractionDigits: 0,
      }).format(Number(amount))
    : "—";

const renderTemplate = (tpl: string, vars: Record<string, string>) =>
  tpl.replace(/\[(\w+)\]/g, (_, k) => vars[k] ?? `[${k}]`);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as Body;
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. Settings
    const { data: settings, error: setErr } = await admin
      .from("email_settings")
      .select("*")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (setErr || !settings) return json({ error: "Correo no configurado" }, 500);
    if (!settings.api_key) return json({ error: "Falta API key del proveedor" }, 500);
    if (!settings.from_email) return json({ error: "Falta remitente (from_email)" }, 500);

    // 2. Template
    const templateKey = body.template_key || "sponsor_thank_you";
    const { data: template } = await admin
      .from("email_templates")
      .select("*")
      .eq("template_key", templateKey)
      .maybeSingle();

    const subjectTpl = body.override_subject ?? template?.subject ?? "Gracias por tu apoyo";
    const bodyTpl = body.override_body ?? template?.body ?? "Gracias por tu apoyo.";

    // 3. Sponsor data (opcional si es prueba)
    let recipient = body.test_to || "";
    let vars: Record<string, string> = {
      nombre: "Patrocinador",
      modalidad: "—",
      monto: "—",
      tipo: "—",
    };
    let sponsor: any = null;

    if (body.sponsor_id) {
      const { data, error } = await admin
        .from("impulsa_sponsors")
        .select("*")
        .eq("id", body.sponsor_id)
        .maybeSingle();
      if (error || !data) return json({ error: "Patrocinador no encontrado" }, 404);
      sponsor = data;
      recipient = recipient || sponsor.email || "";
      vars = {
        nombre: sponsor.sponsor_name || "Patrocinador",
        modalidad: sponsor.participation_type || "—",
        monto:
          sponsor.payment_status === "in_kind_confirmed" && sponsor.in_kind_description
            ? sponsor.in_kind_description
            : fmtMoney(sponsor.amount, sponsor.currency),
        tipo: sponsor.sponsor_type || "—",
      };

      // No reenviar si ya se envió, salvo force o test_to
      if (!body.force && !body.test_to && sponsor.email_sent) {
        return json({ ok: true, skipped: "already_sent" });
      }
    }

    if (!recipient) return json({ error: "Sin destinatario" }, 400);

    const subject = renderTemplate(subjectTpl, vars);
    const text = renderTemplate(bodyTpl, vars);
    const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#111;white-space:pre-line">${text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</div>`;

    // 4. Send via provider
    const provider = (settings.provider || "resend").toLowerCase();
    const fromHeader = settings.from_name
      ? `${settings.from_name} <${settings.from_email}>`
      : settings.from_email;

    let providerRes: Response;
    if (provider === "resend") {
      providerRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.api_key}`,
        },
        body: JSON.stringify({
          from: fromHeader,
          to: [recipient],
          subject,
          html,
          text,
          reply_to: settings.reply_to || undefined,
        }),
      });
    } else if (provider === "sendgrid") {
      providerRes = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.api_key}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: recipient }] }],
          from: { email: settings.from_email, name: settings.from_name || undefined },
          reply_to: settings.reply_to ? { email: settings.reply_to } : undefined,
          subject,
          content: [
            { type: "text/plain", value: text },
            { type: "text/html", value: html },
          ],
        }),
      });
    } else if (provider === "brevo" || provider === "smtp") {
      providerRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": settings.api_key,
        },
        body: JSON.stringify({
          sender: { email: settings.from_email, name: settings.from_name || undefined },
          to: [{ email: recipient }],
          replyTo: settings.reply_to ? { email: settings.reply_to } : undefined,
          subject,
          htmlContent: html,
          textContent: text,
        }),
      });
    } else {
      return json({ error: `Proveedor no soportado: ${provider}` }, 400);
    }

    if (!providerRes.ok) {
      const errTxt = await providerRes.text();
      console.error("Provider error", providerRes.status, errTxt);
      return json({ error: `Falló envío (${providerRes.status})`, detail: errTxt }, 502);
    }

    // 5. Marcar email_sent salvo en pruebas
    if (sponsor && !body.test_to) {
      await admin
        .from("impulsa_sponsors")
        .update({ email_sent: true, email_sent_at: new Date().toISOString() })
        .eq("id", sponsor.id);
    }

    return json({ ok: true, to: recipient });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
