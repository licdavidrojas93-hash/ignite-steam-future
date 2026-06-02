import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Circle, Loader2, RefreshCw } from "lucide-react";

const db = supabase as any;

type Status = "pass" | "fail" | "warn" | "manual" | "pending";

interface Check {
  key: string;
  label: string;
  status: Status;
  detail?: string;
  manualHint?: string;
}

const StatusIcon = ({ s }: { s: Status }) => {
  if (s === "pass") return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
  if (s === "fail") return <XCircle className="h-5 w-5 text-destructive" />;
  if (s === "warn") return <XCircle className="h-5 w-5 text-amber-500" />;
  if (s === "pending") return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  return <Circle className="h-5 w-5 text-muted-foreground" />;
};

const MANUAL_CHECKS: Check[] = [
  {
    key: "checkout_opens",
    label: "Checkout de Mercado Pago abre correctamente",
    status: "manual",
    manualHint: "Prueba: llena el formulario y verifica que te redirija al sandbox de MP.",
  },
  {
    key: "return_url",
    label: "URL de retorno funciona (/impulsa/gracias)",
    status: "manual",
    manualHint: "Completa un pago de prueba y verifica que vuelvas a /impulsa/gracias.",
  },
  {
    key: "webhook_received",
    label: "Webhook recibe evento de Mercado Pago",
    status: "manual",
    manualHint: "Revisa los logs de la edge function 'mercado-pago-webhook' tras un pago.",
  },
  {
    key: "payment_updates",
    label: "El estado del patrocinio se actualiza tras pago",
    status: "manual",
    manualHint: "Verifica en Patrocinios que pasa a 'paid' tras un pago aprobado.",
  },
  {
    key: "email_sent",
    label: "Correo automático se envía al confirmar pago",
    status: "manual",
    manualHint: "Tras pago confirmado, revisa la bandeja del correo del patrocinador.",
  },
  {
    key: "wall_moderation",
    label: "Muro requiere aprobación del admin",
    status: "manual",
    manualHint: "Confirma que un patrocinio pagado no aparece en el muro hasta marcarlo visible.",
  },
];

const SUGGESTED_TESTS = [
  { label: "Patrocinio de $400 aprobado (CARD VISA 4509…)", detail: "Usa tarjeta de prueba aprobada." },
  { label: "Patrocinio de $800 rechazado", detail: "Usa tarjeta de prueba con rechazo." },
  { label: "Patrocinio de $1,200 pendiente", detail: "Usa flujo OXXO/efectivo en sandbox." },
  { label: "Donación en especie", detail: "Marca opción 'en especie' en el formulario." },
  { label: "Aprobar 1 patrocinio en muro", detail: "Desde Muro de patrocinadores." },
  { label: "Exportar CSV de patrocinios", detail: "Desde Patrocinios IMPULSA → Exportar CSV." },
  { label: "Reenviar correo de agradecimiento", detail: "Desde el detalle del patrocinio." },
  { label: "Cambiar ambiente test → producción", detail: "Desde Mercado Pago Admin." },
];

const IntegrationTests = () => {
  const [checks, setChecks] = useState<Check[]>([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    const out: Check[] = [];

    // Mercado Pago config
    const { data: mp } = await db
      .from("payment_provider_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    out.push({
      key: "mp_configured",
      label: "Mercado Pago configurado",
      status: mp ? "pass" : "fail",
      detail: mp ? `Ambiente activo: ${mp.environment}` : "No hay configuración guardada.",
    });
    out.push({
      key: "mp_test_env",
      label: "Ambiente test activo",
      status: mp?.environment === "test" ? "pass" : "warn",
      detail: mp?.environment === "test" ? "OK" : `Ambiente actual: ${mp?.environment || "—"}`,
    });
    out.push({
      key: "mp_test_creds",
      label: "Credenciales test guardadas",
      status: mp?.test_access_token && mp?.test_public_key ? "pass" : "fail",
      detail: mp?.test_access_token ? "Access token + public key presentes" : "Faltan credenciales test",
    });
    out.push({
      key: "mp_prod_creds",
      label: "Credenciales de producción guardadas",
      status: mp?.production_access_token && mp?.production_public_key ? "pass" : "warn",
      detail: mp?.production_access_token ? "Listas" : "Pendientes (solo si lanzas a producción)",
    });
    out.push({
      key: "mp_site_url",
      label: "Dominio del sitio configurado",
      status: mp?.site_url ? "pass" : "warn",
      detail: mp?.site_url || "Usando default",
    });

    // Formulario
    const { count: fieldsCount } = await db
      .from("impulsa_form_fields")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);
    out.push({
      key: "form_active",
      label: "Formulario público con campos activos",
      status: (fieldsCount ?? 0) > 0 ? "pass" : "fail",
      detail: `${fieldsCount ?? 0} campos activos`,
    });

    // Modalidades
    const { count: tiersCount } = await db
      .from("impulsa_donation_tiers")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);
    out.push({
      key: "tiers_active",
      label: "Modalidades de patrocinio configuradas",
      status: (tiersCount ?? 0) > 0 ? "pass" : "fail",
      detail: `${tiersCount ?? 0} modalidades activas`,
    });

    // Correo
    const { data: emailSet } = await db
      .from("email_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    out.push({
      key: "email_configured",
      label: "Proveedor de correo configurado",
      status: emailSet?.api_key && emailSet?.from_email ? "pass" : "fail",
      detail: emailSet ? `Proveedor: ${emailSet.provider}` : "Falta configurar correo",
    });

    const { count: tplCount } = await db
      .from("email_templates")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);
    out.push({
      key: "email_templates",
      label: "Plantillas de correo activas",
      status: (tplCount ?? 0) > 0 ? "pass" : "fail",
      detail: `${tplCount ?? 0} plantillas activas`,
    });

    // Patrocinios
    const { count: sponsorsTotal } = await db
      .from("impulsa_sponsors")
      .select("*", { count: "exact", head: true });
    const { count: paidCount } = await db
      .from("impulsa_sponsors")
      .select("*", { count: "exact", head: true })
      .in("payment_status", ["paid", "in_kind_confirmed"]);
    out.push({
      key: "sponsors_received",
      label: "Patrocinios recibidos en la base",
      status: (sponsorsTotal ?? 0) > 0 ? "pass" : "manual",
      detail: `${sponsorsTotal ?? 0} total · ${paidCount ?? 0} pagados/confirmados`,
    });

    // Reportes / estadísticas
    const { data: stats } = await db.rpc("get_impulsa_public_stats");
    const s = Array.isArray(stats) ? stats[0] : stats;
    out.push({
      key: "stats_alive",
      label: "Estadísticas públicas responden",
      status: s ? "pass" : "fail",
      detail: s ? `Recaudado: $${Number(s.total_raised).toLocaleString("es-MX")} · ${s.sponsors_count} patrocinadores` : "No respondió",
    });

    setChecks([...out, ...MANUAL_CHECKS]);
    setRunning(false);
  };

  useEffect(() => {
    run();
  }, []);

  const counts = checks.reduce(
    (acc, c) => ((acc[c.status] = (acc[c.status] || 0) + 1), acc),
    {} as Record<Status, number>,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-2xl">Pruebas de integración</h3>
        <Button variant="outline" onClick={run} disabled={running}>
          <RefreshCw className={`h-4 w-4 ${running ? "animate-spin" : ""}`} /> Volver a verificar
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-emerald-500/10 p-3 text-center">
          <p className="text-xs text-muted-foreground">OK</p>
          <p className="font-display text-2xl font-bold text-emerald-600">{counts.pass || 0}</p>
        </div>
        <div className="rounded-xl bg-destructive/10 p-3 text-center">
          <p className="text-xs text-muted-foreground">Fallan</p>
          <p className="font-display text-2xl font-bold text-destructive">{counts.fail || 0}</p>
        </div>
        <div className="rounded-xl bg-amber-500/10 p-3 text-center">
          <p className="text-xs text-muted-foreground">Atención</p>
          <p className="font-display text-2xl font-bold text-amber-600">{counts.warn || 0}</p>
        </div>
        <div className="rounded-xl bg-muted/40 p-3 text-center">
          <p className="text-xs text-muted-foreground">Manuales</p>
          <p className="font-display text-2xl font-bold">{counts.manual || 0}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
        <ul className="divide-y divide-border">
          {checks.map((c) => (
            <li key={c.key} className="flex items-start gap-3 px-4 py-3">
              <div className="mt-0.5"><StatusIcon s={c.status} /></div>
              <div className="flex-1">
                <p className="font-medium">{c.label}</p>
                {c.detail && <p className="text-xs text-muted-foreground">{c.detail}</p>}
                {c.status === "manual" && c.manualHint && (
                  <p className="text-xs text-muted-foreground italic mt-1">{c.manualHint}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-soft">
        <h4 className="font-display text-xl mb-4">Pruebas manuales sugeridas</h4>
        <ol className="list-decimal pl-5 space-y-2">
          {SUGGESTED_TESTS.map((t) => (
            <li key={t.label}>
              <p className="font-medium">{t.label}</p>
              <p className="text-xs text-muted-foreground">{t.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6">
        <h4 className="font-display text-xl mb-2">Notas de seguridad</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>El público no puede leer <code>payment_provider_settings</code> ni <code>email_settings</code> (RLS solo authenticated).</li>
          <li>El público solo ve los patrocinios autorizados y visibles en el muro.</li>
          <li>El frontend no puede marcar pagos como <code>paid</code>: solo el webhook (vía service role) o un admin autenticado lo hace.</li>
          <li>Los Access Tokens de Mercado Pago se leen únicamente desde la edge function (backend), nunca expuestos al frontend.</li>
        </ul>
      </div>
    </div>
  );
};

export default IntegrationTests;
