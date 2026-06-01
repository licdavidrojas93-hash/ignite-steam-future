import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Copy, Eye, EyeOff, Loader2 } from "lucide-react";

const db = supabase as any;
const PROJECT_REF = import.meta.env.VITE_SUPABASE_PROJECT_ID as string;
const WEBHOOK_URL = `https://${PROJECT_REF}.supabase.co/functions/v1/mercado-pago-webhook`;
const SITE_ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

interface Row {
  id: string;
  provider: string;
  environment: "test" | "production";
  test_public_key: string | null;
  test_access_token: string | null;
  production_public_key: string | null;
  production_access_token: string | null;
  webhook_secret: string | null;
  is_active: boolean;
  notes: string | null;
  updated_at: string;
}

const mask = (v?: string | null) => {
  if (!v) return "";
  if (v.length <= 8) return "••••";
  return `${v.slice(0, 4)}••••${v.slice(-4)}`;
};

const copy = async (text: string) => {
  await navigator.clipboard.writeText(text);
  toast.success("Copiado al portapapeles");
};

const MercadoPagoAdmin = () => {
  const [row, setRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [showProd, setShowProd] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await db
      .from("payment_provider_settings")
      .select("*")
      .eq("provider", "mercado_pago")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) toast.error(error.message);
    setRow(
      data ?? {
        id: "",
        provider: "mercado_pago",
        environment: "test",
        test_public_key: "",
        test_access_token: "",
        production_public_key: "",
        production_access_token: "",
        webhook_secret: "",
        is_active: true,
        notes: "",
        updated_at: new Date().toISOString(),
      },
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const set = <K extends keyof Row>(k: K, v: Row[K]) => row && setRow({ ...row, [k]: v });

  const save = async () => {
    if (!row) return;
    setSaving(true);
    const payload = {
      provider: "mercado_pago",
      environment: row.environment,
      test_public_key: row.test_public_key,
      test_access_token: row.test_access_token,
      production_public_key: row.production_public_key,
      production_access_token: row.production_access_token,
      webhook_secret: row.webhook_secret,
      is_active: row.is_active,
      notes: row.notes,
    };
    const { error } = row.id
      ? await db.from("payment_provider_settings").update(payload).eq("id", row.id)
      : await db.from("payment_provider_settings").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Configuración guardada ✓");
    load();
  };

  const testConfig = async () => {
    if (!row) return;
    const token =
      row.environment === "production" ? row.production_access_token : row.test_access_token;
    if (!token) return toast.error(`Falta el Access Token de ${row.environment}.`);
    setTesting(true);
    try {
      const res = await fetch("https://api.mercadopago.com/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Token inválido");
      toast.success(`Token válido. Cuenta: ${data?.nickname || data?.email || "OK"}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setTesting(false);
    }
  };

  if (loading || !row) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">Mercado Pago</h3>
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2">
          <Label className="cursor-pointer">Integración activa</Label>
          <Switch checked={row.is_active} onCheckedChange={(v) => set("is_active", v)} />
        </div>
      </div>

      {/* Ambiente */}
      <div className="space-y-3 rounded-2xl bg-card p-6 shadow-soft">
        <Label className="text-base font-semibold">Ambiente activo</Label>
        <div className="flex gap-3">
          {(["test", "production"] as const).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => set("environment", e)}
              className={`rounded-xl border-2 px-5 py-2 text-sm font-medium transition ${
                row.environment === e
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {e === "test" ? "Prueba (sandbox)" : "Producción"}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Solo se usarán las credenciales del ambiente seleccionado al crear pagos.
        </p>
      </div>

      {/* Credenciales test */}
      <div className="space-y-4 rounded-2xl bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h4 className="font-display text-lg font-bold">Credenciales de prueba</h4>
          <Button size="sm" variant="ghost" onClick={() => setShowTest((s) => !s)}>
            {showTest ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showTest ? "Ocultar" : "Mostrar"}
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Public Key (prueba)</Label>
          <Input
            value={
              showTest ? row.test_public_key ?? "" : row.test_public_key ? mask(row.test_public_key) : ""
            }
            onChange={(e) => set("test_public_key", e.target.value)}
            placeholder="TEST-..."
            readOnly={!showTest && !!row.test_public_key}
          />
        </div>
        <div className="space-y-2">
          <Label>Access Token (prueba)</Label>
          <Input
            type={showTest ? "text" : "password"}
            value={showTest ? row.test_access_token ?? "" : row.test_access_token ? mask(row.test_access_token) : ""}
            onChange={(e) => set("test_access_token", e.target.value)}
            placeholder="TEST-..."
            readOnly={!showTest && !!row.test_access_token}
          />
        </div>
      </div>

      {/* Credenciales producción */}
      <div className="space-y-4 rounded-2xl bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h4 className="font-display text-lg font-bold">Credenciales de producción</h4>
          <Button size="sm" variant="ghost" onClick={() => setShowProd((s) => !s)}>
            {showProd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showProd ? "Ocultar" : "Mostrar"}
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Public Key (producción)</Label>
          <Input
            value={
              showProd
                ? row.production_public_key ?? ""
                : row.production_public_key
                ? mask(row.production_public_key)
                : ""
            }
            onChange={(e) => set("production_public_key", e.target.value)}
            placeholder="APP_USR-..."
            readOnly={!showProd && !!row.production_public_key}
          />
        </div>
        <div className="space-y-2">
          <Label>Access Token (producción)</Label>
          <Input
            type={showProd ? "text" : "password"}
            value={
              showProd
                ? row.production_access_token ?? ""
                : row.production_access_token
                ? mask(row.production_access_token)
                : ""
            }
            onChange={(e) => set("production_access_token", e.target.value)}
            placeholder="APP_USR-..."
            readOnly={!showProd && !!row.production_access_token}
          />
        </div>
      </div>

      {/* Webhook secret + notas */}
      <div className="space-y-4 rounded-2xl bg-card p-6 shadow-soft">
        <div className="space-y-2">
          <Label>Webhook secret (opcional)</Label>
          <Input
            type="password"
            value={row.webhook_secret ?? ""}
            onChange={(e) => set("webhook_secret", e.target.value)}
            placeholder="Si Mercado Pago te proporciona un secreto, pégalo aquí"
          />
        </div>
        <div className="space-y-2">
          <Label>Notas internas</Label>
          <Textarea
            rows={3}
            value={row.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Última actualización: {new Date(row.updated_at).toLocaleString("es-MX")}
        </p>
      </div>

      {/* URLs */}
      <div className="space-y-4 rounded-2xl bg-primary/5 p-6 border border-primary/20">
        <h4 className="font-display text-lg font-bold">URLs para Mercado Pago</h4>
        <p className="text-sm text-muted-foreground">
          La URL del webhook debe pegarse en{" "}
          <strong>Mercado Pago Developers → Tus integraciones → Aplicación → Webhooks / Notificaciones → Configurar notificaciones → evento <code>payment</code></strong>.
        </p>

        <UrlRow label="Webhook (notificaciones)" url={WEBHOOK_URL} />
        <UrlRow label="Retorno: éxito" url={`${SITE_ORIGIN}/impulsa/gracias`} />
        <UrlRow label="Retorno: pendiente" url={`${SITE_ORIGIN}/impulsa/pendiente`} />
        <UrlRow label="Retorno: error" url={`${SITE_ORIGIN}/impulsa/error`} />
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={testConfig} disabled={testing}>
          {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Probar configuración
        </Button>
        <Button variant="hero" onClick={save} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar configuración"}
        </Button>
      </div>
    </div>
  );
};

const UrlRow = ({ label, url }: { label: string; url: string }) => (
  <div className="space-y-1">
    <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
    <div className="flex items-center gap-2">
      <Input readOnly value={url} className="font-mono text-xs" />
      <Button size="icon" variant="outline" onClick={() => copy(url)} title="Copiar">
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default MercadoPagoAdmin;
