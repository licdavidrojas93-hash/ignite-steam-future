// Create Mercado Pago Checkout Pro preference for a sponsor.
// Public function (verify_jwt=false): the only required input is sponsor_id (just created in the form).
// All MP credentials are read SERVER-SIDE from payment_provider_settings via service_role.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface Body {
  sponsor_id?: string;
  origin?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as Body;
    const sponsorId = body.sponsor_id?.trim();
    if (!sponsorId) {
      return json({ error: "sponsor_id requerido" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. Read sponsor
    const { data: sponsor, error: spErr } = await admin
      .from("impulsa_sponsors")
      .select("*")
      .eq("id", sponsorId)
      .maybeSingle();
    if (spErr || !sponsor) return json({ error: "Patrocinio no encontrado" }, 404);
    if (!sponsor.amount || Number(sponsor.amount) <= 0) {
      return json({ error: "El patrocinio no tiene un monto válido" }, 400);
    }

    // 2. Read MP credentials
    const { data: settings, error: stErr } = await admin
      .from("payment_provider_settings")
      .select("*")
      .eq("provider", "mercado_pago")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (stErr || !settings) return json({ error: "Mercado Pago no está configurado" }, 500);

    const env = settings.environment === "production" ? "production" : "test";
    const accessToken =
      env === "production" ? settings.production_access_token : settings.test_access_token;
    if (!accessToken) {
      return json({ error: `Falta Access Token de ${env}` }, 500);
    }

    // 3. Build URLs — prefer the production site_url configured in admin,
    // fallback to the request origin, then to the canonical domain.
    const siteUrl =
      (settings.site_url as string | null)?.replace(/\/$/, "") ||
      body.origin?.replace(/\/$/, "") ||
      req.headers.get("origin")?.replace(/\/$/, "") ||
      "https://ninossteam.com";
    const projectRef = Deno.env.get("SUPABASE_URL")!
      .replace("https://", "")
      .split(".")[0];
    const notificationUrl = `https://${projectRef}.supabase.co/functions/v1/mercado-pago-webhook`;

    // 4. Create preference
    const preferencePayload = {
      items: [
        {
          title: "IMPULSA por Niñ@s STEAM",
          description: sponsor.participation_type || "Patrocinio",
          quantity: 1,
          unit_price: Number(sponsor.amount),
          currency_id: sponsor.currency || "MXN",
        },
      ],
      payer: sponsor.email ? { email: sponsor.email } : undefined,
      external_reference: sponsor.id,
      back_urls: {
        success: `${siteUrl}/impulsa/gracias`,
        pending: `${siteUrl}/impulsa/pendiente`,
        failure: `${siteUrl}/impulsa/error`,
      },
      auto_return: "approved",
      notification_url: notificationUrl,
      statement_descriptor: "NINOS STEAM",
      metadata: { sponsor_id: sponsor.id },
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferencePayload),
    });
    const mpJson = await mpRes.json();
    if (!mpRes.ok) {
      console.error("MP error", mpJson);
      return json({ error: mpJson?.message || "No se pudo crear la preferencia" }, 502);
    }

    const checkoutUrl = env === "production" ? mpJson.init_point : mpJson.sandbox_init_point;

    // 5. Persist
    await admin
      .from("impulsa_sponsors")
      .update({
        mercado_pago_preference_id: mpJson.id,
        checkout_url: checkoutUrl,
        payment_provider: "mercado_pago",
        payment_status: "pending",
      })
      .eq("id", sponsor.id);

    return json({ checkout_url: checkoutUrl, preference_id: mpJson.id });
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
