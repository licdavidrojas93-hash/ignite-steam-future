// Mercado Pago webhook: receives notifications, verifies payment server-side
// and updates impulsa_sponsors accordingly. Never trusts client/return URLs.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // MP sends both query params and JSON body.
    const url = new URL(req.url);
    let paymentId =
      url.searchParams.get("data.id") ||
      url.searchParams.get("id") ||
      null;
    let topic =
      url.searchParams.get("type") || url.searchParams.get("topic") || null;

    if (req.method === "POST") {
      try {
        const body = await req.json();
        paymentId = paymentId || body?.data?.id || body?.id || null;
        topic = topic || body?.type || body?.topic || null;
      } catch {
        // body may be empty
      }
    }

    if (!paymentId || (topic && topic !== "payment")) {
      // Ack other events so MP doesn't retry.
      return new Response("ok", { status: 200, headers: corsHeaders });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Read active credentials
    const { data: settings } = await admin
      .from("payment_provider_settings")
      .select("*")
      .eq("provider", "mercado_pago")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!settings) return new Response("no settings", { status: 200, headers: corsHeaders });

    const env = settings.environment === "production" ? "production" : "test";
    const accessToken =
      env === "production" ? settings.production_access_token : settings.test_access_token;
    if (!accessToken) return new Response("no token", { status: 200, headers: corsHeaders });

    // Fetch payment from MP
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!mpRes.ok) {
      console.error("MP payment fetch failed", await mpRes.text());
      return new Response("mp fetch failed", { status: 200, headers: corsHeaders });
    }
    const payment = await mpRes.json();
    const externalRef = payment.external_reference as string | undefined;
    if (!externalRef) return new Response("no ref", { status: 200, headers: corsHeaders });

    // Map status
    const mpStatus = payment.status as string;
    let payment_status = "pending";
    if (mpStatus === "approved") payment_status = "paid";
    else if (mpStatus === "rejected") payment_status = "failed";
    else if (mpStatus === "cancelled") payment_status = "cancelled";
    else if (mpStatus === "refunded" || mpStatus === "charged_back") payment_status = "refunded";

    // Idempotency: skip if same payment already recorded as paid
    const { data: existing } = await admin
      .from("impulsa_sponsors")
      .select("id, payment_status, mercado_pago_payment_id")
      .eq("id", externalRef)
      .maybeSingle();
    if (!existing) return new Response("sponsor not found", { status: 200, headers: corsHeaders });

    if (
      existing.payment_status === "paid" &&
      String(existing.mercado_pago_payment_id) === String(paymentId)
    ) {
      return new Response("ok", { status: 200, headers: corsHeaders });
    }

    const update: Record<string, unknown> = {
      payment_status,
      mercado_pago_payment_id: String(paymentId),
      mercado_pago_status_detail: payment.status_detail ?? null,
      payment_method_id: payment.payment_method_id ?? null,
      webhook_last_received_at: new Date().toISOString(),
    };
    if (payment_status === "paid") {
      update.paid_at = payment.date_approved ?? new Date().toISOString();
    }

    const { error } = await admin
      .from("impulsa_sponsors")
      .update(update)
      .eq("id", externalRef);
    if (error) console.error("update error", error);

    // TODO: trigger confirmation email when payment_status becomes 'paid'.
    return new Response("ok", { status: 200, headers: corsHeaders });
  } catch (e) {
    console.error(e);
    return new Response("error", { status: 200, headers: corsHeaders });
  }
});
