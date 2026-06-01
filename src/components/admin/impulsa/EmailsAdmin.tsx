import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Mail, Eye, EyeOff } from "lucide-react";

const db = supabase as any;

interface Settings {
  id: string;
  provider: string;
  from_email: string | null;
  from_name: string | null;
  api_key: string | null;
  reply_to: string | null;
  is_active: boolean;
  notes: string | null;
  updated_at: string;
}

interface Template {
  id: string;
  template_key: string;
  subject: string | null;
  body: string | null;
  is_active: boolean;
}

const PROVIDERS = [
  { id: "resend", label: "Resend" },
  { id: "sendgrid", label: "SendGrid" },
  { id: "brevo", label: "Brevo / SMTP" },
];

const mask = (v?: string | null) => {
  if (!v) return "";
  if (v.length <= 8) return "••••";
  return `${v.slice(0, 4)}••••${v.slice(-4)}`;
};

const EmailsAdmin = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [testTo, setTestTo] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: s }, { data: t }] = await Promise.all([
      db
        .from("email_settings")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      db.from("email_templates").select("*").order("template_key"),
    ]);
    setSettings(
      s ?? {
        id: "",
        provider: "resend",
        from_email: "",
        from_name: "",
        api_key: "",
        reply_to: "",
        is_active: true,
        notes: "",
        updated_at: new Date().toISOString(),
      },
    );
    setTemplates(t ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setS = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    settings && setSettings({ ...settings, [k]: v });

  const saveSettings = async () => {
    if (!settings) return;
    if (!settings.from_email) return toast.error("El correo remitente es obligatorio");
    setSaving(true);
    const payload = {
      provider: settings.provider,
      from_email: settings.from_email,
      from_name: settings.from_name,
      api_key: settings.api_key,
      reply_to: settings.reply_to,
      is_active: settings.is_active,
      notes: settings.notes,
    };
    const { error } = settings.id
      ? await db.from("email_settings").update(payload).eq("id", settings.id)
      : await db.from("email_settings").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Configuración de correo guardada ✓");
    setShowKey(false);
    load();
  };

  const saveTemplate = async (tpl: Template) => {
    const { error } = await db
      .from("email_templates")
      .update({ subject: tpl.subject, body: tpl.body, is_active: tpl.is_active })
      .eq("id", tpl.id);
    if (error) return toast.error(error.message);
    toast.success(`Plantilla "${tpl.template_key}" guardada ✓`);
  };

  const sendTest = async (tpl: Template) => {
    if (!testTo.trim()) return toast.error("Indica un correo de prueba");
    setSendingTest(true);
    const { data, error } = await supabase.functions.invoke("send-sponsor-email", {
      body: {
        template_key: tpl.template_key,
        test_to: testTo.trim(),
        override_subject: tpl.subject,
        override_body: tpl.body,
      },
    });
    setSendingTest(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || "Falló envío");
      return;
    }
    toast.success(`Correo de prueba enviado a ${testTo}`);
  };

  if (loading || !settings) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <div className="space-y-8">
      {/* Proveedor */}
      <div className="space-y-5 rounded-2xl bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">Configuración de correo</h3>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2">
            <Label className="cursor-pointer">Activo</Label>
            <Switch checked={settings.is_active} onCheckedChange={(v) => setS("is_active", v)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Proveedor</Label>
          <div className="flex flex-wrap gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setS("provider", p.id)}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition ${
                  settings.provider === p.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Correo remitente *</Label>
            <Input
              type="email"
              value={settings.from_email ?? ""}
              onChange={(e) => setS("from_email", e.target.value)}
              placeholder="hola@ninossteam.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Nombre remitente</Label>
            <Input
              value={settings.from_name ?? ""}
              onChange={(e) => setS("from_name", e.target.value)}
              placeholder="Niñ@s STEAM"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label>API Key</Label>
              <Button size="sm" variant="ghost" onClick={() => setShowKey((s) => !s)}>
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showKey ? "Ocultar" : "Mostrar"}
              </Button>
            </div>
            <Input
              type={showKey ? "text" : "password"}
              value={showKey ? settings.api_key ?? "" : settings.api_key ? mask(settings.api_key) : ""}
              onChange={(e) => setS("api_key", e.target.value)}
              placeholder="re_xxx / SG.xxx / xkeysib-xxx"
              readOnly={!showKey && !!settings.api_key}
            />
            <p className="text-xs text-muted-foreground">
              La API Key nunca se muestra completa después de guardarla. Solo se utiliza desde el servidor.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Reply-to (opcional)</Label>
            <Input
              type="email"
              value={settings.reply_to ?? ""}
              onChange={(e) => setS("reply_to", e.target.value)}
              placeholder="contacto@ninossteam.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Notas internas</Label>
            <Textarea
              rows={2}
              value={settings.notes ?? ""}
              onChange={(e) => setS("notes", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="hero" onClick={saveSettings} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar configuración"}
          </Button>
        </div>
      </div>

      {/* Plantillas */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h3 className="font-display text-2xl">Plantillas</h3>
          <div className="flex items-end gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Correo de prueba</Label>
              <Input
                type="email"
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
                placeholder="tu@correo.com"
                className="w-64"
              />
            </div>
          </div>
        </div>

        {templates.length === 0 && (
          <p className="text-muted-foreground">No hay plantillas configuradas.</p>
        )}

        {templates.map((tpl) => (
          <div key={tpl.id} className="space-y-3 rounded-2xl bg-card p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display text-lg font-bold">{tpl.template_key}</p>
                <p className="text-xs text-muted-foreground">
                  Variables: <code>[nombre]</code> <code>[modalidad]</code> <code>[monto]</code>{" "}
                  <code>[tipo]</code>
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
                <Label className="cursor-pointer text-xs">Activa</Label>
                <Switch
                  checked={tpl.is_active}
                  onCheckedChange={(v) =>
                    setTemplates((arr) => arr.map((x) => (x.id === tpl.id ? { ...x, is_active: v } : x)))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Asunto</Label>
              <Input
                value={tpl.subject ?? ""}
                onChange={(e) =>
                  setTemplates((arr) =>
                    arr.map((x) => (x.id === tpl.id ? { ...x, subject: e.target.value } : x)),
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Cuerpo</Label>
              <Textarea
                rows={12}
                value={tpl.body ?? ""}
                onChange={(e) =>
                  setTemplates((arr) =>
                    arr.map((x) => (x.id === tpl.id ? { ...x, body: e.target.value } : x)),
                  )
                }
              />
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => sendTest(tpl)}
                disabled={sendingTest || !testTo.trim()}
              >
                <Mail className="h-4 w-4" /> Enviar prueba
              </Button>
              <Button variant="hero" onClick={() => saveTemplate(tpl)}>
                <Save className="h-4 w-4" /> Guardar plantilla
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailsAdmin;
