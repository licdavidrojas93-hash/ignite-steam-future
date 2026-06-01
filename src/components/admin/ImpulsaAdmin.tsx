import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Save, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { ImpulsaSection, ImpulsaTier, ImpulsaContact } from "@/hooks/useImpulsa";
import ImpulsaDashboard from "./impulsa/ImpulsaDashboard";
import SponsorsAdmin from "./impulsa/SponsorsAdmin";
import MercadoPagoAdmin from "./impulsa/MercadoPagoAdmin";

// Cast helper for tables not yet in generated types
const db = supabase as any;

const Field = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input {...props} />
  </div>
);
const Area = ({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Textarea rows={3} {...props} />
  </div>
);

// ---------------- SECCIONES ----------------
const SectionsManager = () => {
  const [rows, setRows] = useState<ImpulsaSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await db
      .from("impulsa_content_sections")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (id: string, patch: Partial<ImpulsaSection>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const save = async (row: ImpulsaSection) => {
    setSavingId(row.id);
    const { error } = await db
      .from("impulsa_content_sections")
      .update({
        section_name: row.section_name,
        page_location: row.page_location,
        eyebrow: row.eyebrow,
        title: row.title,
        subtitle: row.subtitle,
        body: row.body,
        cta_primary_label: row.cta_primary_label,
        cta_primary_url: row.cta_primary_url,
        cta_secondary_label: row.cta_secondary_label,
        cta_secondary_url: row.cta_secondary_url,
        is_active: row.is_active,
        sort_order: row.sort_order,
      })
      .eq("id", row.id);
    setSavingId(null);
    if (error) return toast.error(error.message);
    toast.success("Sección guardada ✓");
  };

  const remove = async (row: ImpulsaSection) => {
    if (!confirm(`¿Eliminar la sección "${row.section_name}"?`)) return;
    const { error } = await db.from("impulsa_content_sections").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Sección eliminada");
    load();
  };

  const add = async () => {
    const section_key = prompt("Clave única de la nueva sección (ej. impulsa_extra)");
    if (!section_key) return;
    const { error } = await db.from("impulsa_content_sections").insert({
      section_key,
      section_name: section_key,
      page_location: "impulsa",
      sort_order: rows.length + 1,
    });
    if (error) return toast.error(error.message);
    toast.success("Sección creada");
    load();
  };

  const move = async (row: ImpulsaSection, dir: -1 | 1) => {
    const next = row.sort_order + dir;
    update(row.id, { sort_order: next });
    await db.from("impulsa_content_sections").update({ sort_order: next }).eq("id", row.id);
    load();
  };

  if (loading) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">Secciones editables</h3>
        <Button variant="hero" onClick={add}>
          <Plus className="h-4 w-4" /> Nueva sección
        </Button>
      </div>

      {rows.map((row) => (
        <div key={row.id} className="space-y-4 rounded-2xl bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-lg font-bold">{row.section_name}</p>
              <p className="text-xs text-muted-foreground">
                clave: <code>{row.section_key}</code> · ubicación: {row.page_location || "—"} · orden: {row.sort_order}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" onClick={() => move(row, -1)} title="Subir">
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => move(row, 1)} title="Bajar">
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
                <Label className="cursor-pointer text-xs">Activa</Label>
                <Switch
                  checked={row.is_active}
                  onCheckedChange={(v) => update(row.id, { is_active: v })}
                />
              </div>
              <Button size="icon" variant="outline" onClick={() => remove(row)} title="Eliminar">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Nombre interno"
              value={row.section_name ?? ""}
              onChange={(e) => update(row.id, { section_name: e.target.value })}
            />
            <Field
              label="Ubicación (home / impulsa)"
              value={row.page_location ?? ""}
              onChange={(e) => update(row.id, { page_location: e.target.value })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Eyebrow (etiqueta superior)"
              value={row.eyebrow ?? ""}
              onChange={(e) => update(row.id, { eyebrow: e.target.value })}
            />
            <Field
              label="Título"
              value={row.title ?? ""}
              onChange={(e) => update(row.id, { title: e.target.value })}
            />
          </div>
          <Area
            label="Subtítulo / frase destacada"
            value={row.subtitle ?? ""}
            onChange={(e) => update(row.id, { subtitle: e.target.value })}
          />
          <Area
            label="Cuerpo / microcopy"
            rows={4}
            value={row.body ?? ""}
            onChange={(e) => update(row.id, { body: e.target.value })}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Botón principal — texto"
              value={row.cta_primary_label ?? ""}
              onChange={(e) => update(row.id, { cta_primary_label: e.target.value })}
            />
            <Field
              label="Botón principal — URL"
              value={row.cta_primary_url ?? ""}
              onChange={(e) => update(row.id, { cta_primary_url: e.target.value })}
            />
            <Field
              label="Botón secundario — texto"
              value={row.cta_secondary_label ?? ""}
              onChange={(e) => update(row.id, { cta_secondary_label: e.target.value })}
            />
            <Field
              label="Botón secundario — URL"
              value={row.cta_secondary_url ?? ""}
              onChange={(e) => update(row.id, { cta_secondary_url: e.target.value })}
            />
          </div>

          <div className="flex justify-end">
            <Button variant="hero" onClick={() => save(row)} disabled={savingId === row.id}>
              <Save className="h-4 w-4" /> {savingId === row.id ? "Guardando..." : "Guardar sección"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------------- TIERS ----------------
const TiersManager = () => {
  const [rows, setRows] = useState<ImpulsaTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await db
      .from("impulsa_donation_tiers")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const update = (id: string, patch: Partial<ImpulsaTier>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const save = async (row: ImpulsaTier) => {
    setSavingId(row.id);
    const { error } = await db
      .from("impulsa_donation_tiers")
      .update({
        title: row.title,
        description: row.description,
        amount: row.amount,
        currency: row.currency,
        cta_label: row.cta_label,
        sort_order: row.sort_order,
        is_active: row.is_active,
      })
      .eq("id", row.id);
    setSavingId(null);
    if (error) return toast.error(error.message);
    toast.success("Nivel guardado ✓");
  };

  const add = async () => {
    const tier_key = prompt("Clave única del nuevo nivel (ej. steam_day_5)");
    if (!tier_key) return;
    const { error } = await db.from("impulsa_donation_tiers").insert({
      tier_key,
      title: "Nuevo nivel",
      amount: 0,
      currency: "MXN",
      sort_order: rows.length + 1,
    });
    if (error) return toast.error(error.message);
    toast.success("Nivel creado");
    load();
  };

  const remove = async (row: ImpulsaTier) => {
    if (!confirm(`¿Eliminar el nivel "${row.title}"?`)) return;
    const { error } = await db.from("impulsa_donation_tiers").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Nivel eliminado");
    load();
  };

  if (loading) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">Niveles de patrocinio</h3>
        <Button variant="hero" onClick={add}>
          <Plus className="h-4 w-4" /> Nuevo nivel
        </Button>
      </div>

      {rows.map((row) => (
        <div key={row.id} className="space-y-4 rounded-2xl bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              clave: <code>{row.tier_key}</code> · orden: {row.sort_order}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
                <Label className="cursor-pointer text-xs">Activo</Label>
                <Switch
                  checked={row.is_active}
                  onCheckedChange={(v) => update(row.id, { is_active: v })}
                />
              </div>
              <Button size="icon" variant="outline" onClick={() => remove(row)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Título"
              value={row.title ?? ""}
              onChange={(e) => update(row.id, { title: e.target.value })}
            />
            <Field
              label="Etiqueta del botón"
              value={row.cta_label ?? ""}
              onChange={(e) => update(row.id, { cta_label: e.target.value })}
            />
            <Field
              label="Monto"
              type="number"
              value={row.amount ?? 0}
              onChange={(e) => update(row.id, { amount: Number(e.target.value) })}
            />
            <Field
              label="Moneda"
              value={row.currency ?? "MXN"}
              onChange={(e) => update(row.id, { currency: e.target.value })}
            />
            <Field
              label="Orden"
              type="number"
              value={row.sort_order ?? 0}
              onChange={(e) => update(row.id, { sort_order: Number(e.target.value) })}
            />
          </div>
          <Area
            label="Descripción"
            value={row.description ?? ""}
            onChange={(e) => update(row.id, { description: e.target.value })}
          />
          <div className="flex justify-end">
            <Button variant="hero" onClick={() => save(row)} disabled={savingId === row.id}>
              <Save className="h-4 w-4" /> {savingId === row.id ? "Guardando..." : "Guardar nivel"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------------- CONTACTO ----------------
const ContactManager = () => {
  const [row, setRow] = useState<ImpulsaContact | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    db.from("impulsa_contact_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }: any) => {
        setRow(
          data ?? {
            id: "",
            website_url: "",
            instagram_url: "",
            contact_email: "",
            whatsapp_number: "",
            whatsapp_message: "",
            is_active: true,
          },
        );
        setLoading(false);
      });
  }, []);

  const save = async () => {
    if (!row) return;
    setSaving(true);
    const payload = {
      website_url: row.website_url,
      instagram_url: row.instagram_url,
      contact_email: row.contact_email,
      whatsapp_number: row.whatsapp_number,
      whatsapp_message: row.whatsapp_message,
      is_active: row.is_active,
    };
    const { error } = row.id
      ? await db.from("impulsa_contact_settings").update(payload).eq("id", row.id)
      : await db.from("impulsa_contact_settings").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Contacto guardado ✓");
  };

  if (loading || !row) return <p className="text-muted-foreground">Cargando...</p>;

  const set = <K extends keyof ImpulsaContact>(k: K, v: ImpulsaContact[K]) =>
    setRow({ ...row, [k]: v });

  return (
    <div className="space-y-6">
      <h3 className="font-display text-2xl">Datos de contacto</h3>
      <div className="space-y-4 rounded-2xl bg-card p-6 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Sitio web"
            value={row.website_url ?? ""}
            onChange={(e) => set("website_url", e.target.value)}
          />
          <Field
            label="Instagram (URL)"
            value={row.instagram_url ?? ""}
            onChange={(e) => set("instagram_url", e.target.value)}
          />
          <Field
            label="Correo de contacto"
            type="email"
            value={row.contact_email ?? ""}
            onChange={(e) => set("contact_email", e.target.value)}
          />
          <Field
            label="WhatsApp (solo dígitos con código país, ej. 526623299771)"
            value={row.whatsapp_number ?? ""}
            onChange={(e) => set("whatsapp_number", e.target.value)}
          />
        </div>
        <Area
          label="Mensaje pre-llenado de WhatsApp"
          value={row.whatsapp_message ?? ""}
          onChange={(e) => set("whatsapp_message", e.target.value)}
        />
        <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
          <Label className="cursor-pointer">Activo (visible en el sitio)</Label>
          <Switch checked={row.is_active} onCheckedChange={(v) => set("is_active", v)} />
        </div>
        <div className="flex justify-end">
          <Button variant="hero" onClick={save} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar contacto"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ---------------- FORM FIELDS ----------------
interface FormFieldRow {
  id: string;
  field_key: string;
  label: string;
  placeholder: string | null;
  helper_text: string | null;
  field_type: string | null;
  is_required: boolean;
  is_active: boolean;
  options: unknown;
  sort_order: number;
}

const FormFieldsManager = () => {
  const [rows, setRows] = useState<FormFieldRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await db
      .from("impulsa_form_fields")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const update = (id: string, patch: Partial<FormFieldRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const save = async (row: FormFieldRow) => {
    setSavingId(row.id);
    let parsedOptions: unknown = row.options;
    if (typeof row.options === "string") {
      try {
        parsedOptions = JSON.parse(row.options || "null");
      } catch {
        setSavingId(null);
        return toast.error("Opciones: JSON inválido (usa formato como [\"A\",\"B\"]).");
      }
    }
    const { error } = await db
      .from("impulsa_form_fields")
      .update({
        label: row.label,
        placeholder: row.placeholder,
        helper_text: row.helper_text,
        field_type: row.field_type,
        is_required: row.is_required,
        is_active: row.is_active,
        options: parsedOptions,
        sort_order: row.sort_order,
      })
      .eq("id", row.id);
    setSavingId(null);
    if (error) return toast.error(error.message);
    toast.success("Campo guardado ✓");
  };

  if (loading) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <div className="space-y-6">
      <h3 className="font-display text-2xl">Formulario de patrocinio</h3>
      <p className="text-sm text-muted-foreground">
        Edita las etiquetas, textos de ayuda, obligatoriedad y opciones de cada campo del formulario público.
      </p>

      {rows.map((row) => (
        <div key={row.id} className="space-y-4 rounded-2xl bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              clave: <code>{row.field_key}</code> · tipo: {row.field_type || "—"}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
                <Label className="cursor-pointer text-xs">Obligatorio</Label>
                <Switch
                  checked={row.is_required}
                  onCheckedChange={(v) => update(row.id, { is_required: v })}
                />
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
                <Label className="cursor-pointer text-xs">Activo</Label>
                <Switch
                  checked={row.is_active}
                  onCheckedChange={(v) => update(row.id, { is_active: v })}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Etiqueta (label)"
              value={row.label ?? ""}
              onChange={(e) => update(row.id, { label: e.target.value })}
            />
            <Field
              label="Placeholder"
              value={row.placeholder ?? ""}
              onChange={(e) => update(row.id, { placeholder: e.target.value })}
            />
            <Field
              label="Orden"
              type="number"
              value={row.sort_order ?? 0}
              onChange={(e) => update(row.id, { sort_order: Number(e.target.value) })}
            />
            <Field
              label="Tipo (text, email, select, textarea, checkbox...)"
              value={row.field_type ?? ""}
              onChange={(e) => update(row.id, { field_type: e.target.value })}
            />
          </div>
          <Area
            label="Texto de ayuda"
            value={row.helper_text ?? ""}
            onChange={(e) => update(row.id, { helper_text: e.target.value })}
          />
          <Area
            label={'Opciones del select (JSON, ej. ["Persona","Empresa"])'}
            value={
              typeof row.options === "string"
                ? row.options
                : row.options
                ? JSON.stringify(row.options)
                : ""
            }
            onChange={(e) => update(row.id, { options: e.target.value })}
          />
          <div className="flex justify-end">
            <Button variant="hero" onClick={() => save(row)} disabled={savingId === row.id}>
              <Save className="h-4 w-4" /> {savingId === row.id ? "Guardando..." : "Guardar campo"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------------- SPONSORS LIST ----------------
interface SponsorRow {
  id: string;
  created_at: string;
  sponsor_name: string;
  sponsor_type: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  participation_type: string | null;
  amount: number | null;
  currency: string | null;
  payment_status: string | null;
  public_wall_opt_in: boolean;
  public_display_name: string | null;
  message: string | null;
  in_kind_description: string | null;
  admin_notes: string | null;
  visible_on_wall: boolean;
}

const STATUSES = [
  "pending",
  "paid",
  "failed",
  "cancelled",
  "refunded",
  "in_kind_pending",
  "in_kind_confirmed",
];

const SponsorsManager = () => {
  const [rows, setRows] = useState<SponsorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<SponsorRow | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await db
      .from("impulsa_sponsors")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const exportCsv = () => {
    const headers = [
      "fecha",
      "nombre",
      "tipo",
      "correo",
      "telefono",
      "ciudad",
      "estado",
      "modalidad",
      "monto",
      "moneda",
      "estado_pago",
      "muro",
      "nombre_publico",
      "mensaje",
      "especie",
      "notas",
    ];
    const csv = [headers.join(",")]
      .concat(
        rows.map((r) =>
          [
            new Date(r.created_at).toISOString(),
            r.sponsor_name,
            r.sponsor_type,
            r.email,
            r.phone,
            r.city,
            r.state,
            r.participation_type,
            r.amount,
            r.currency,
            r.payment_status,
            r.public_wall_opt_in ? "sí" : "no",
            r.public_display_name,
            r.message,
            r.in_kind_description,
            r.admin_notes,
          ]
            .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
            .join(","),
        ),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patrocinios_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveDetail = async () => {
    if (!open) return;
    setSaving(true);
    const { error } = await db
      .from("impulsa_sponsors")
      .update({
        sponsor_name: open.sponsor_name,
        sponsor_type: open.sponsor_type,
        email: open.email,
        phone: open.phone,
        city: open.city,
        state: open.state,
        amount: open.amount,
        payment_status: open.payment_status,
        public_wall_opt_in: open.public_wall_opt_in,
        public_display_name: open.public_display_name,
        message: open.message,
        in_kind_description: open.in_kind_description,
        admin_notes: open.admin_notes,
        visible_on_wall: open.visible_on_wall,
      })
      .eq("id", open.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Patrocinio actualizado ✓");
    setOpen(null);
    load();
  };

  if (loading) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">Patrocinios recibidos</h3>
        <Button variant="outline" onClick={exportCsv}>
          Exportar CSV
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground">Aún no hay registros.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Patrocinador</th>
                <th className="px-4 py-3">Modalidad</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Muro</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString("es-MX")}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{r.sponsor_name}</p>
                    <p className="text-xs text-muted-foreground">{r.sponsor_type || "—"}</p>
                  </td>
                  <td className="px-4 py-3">{r.participation_type || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.amount ? `$${Number(r.amount).toLocaleString("es-MX")} ${r.currency || ""}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted/60 px-2 py-1 text-xs">
                      {r.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {r.email || "—"}
                    <br />
                    {r.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {r.public_wall_opt_in ? `sí · ${r.public_display_name || ""}` : "no"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => setOpen(r)}>
                      Detalle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl bg-card p-6 shadow-medium"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-xl font-bold">Detalle del patrocinio</h3>
              <Button size="icon" variant="ghost" onClick={() => setOpen(null)}>
                ×
              </Button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field
                label="Nombre"
                value={open.sponsor_name ?? ""}
                onChange={(e) => setOpen({ ...open, sponsor_name: e.target.value })}
              />
              <Field
                label="Tipo"
                value={open.sponsor_type ?? ""}
                onChange={(e) => setOpen({ ...open, sponsor_type: e.target.value })}
              />
              <Field
                label="Correo"
                value={open.email ?? ""}
                onChange={(e) => setOpen({ ...open, email: e.target.value })}
              />
              <Field
                label="Teléfono"
                value={open.phone ?? ""}
                onChange={(e) => setOpen({ ...open, phone: e.target.value })}
              />
              <Field
                label="Ciudad"
                value={open.city ?? ""}
                onChange={(e) => setOpen({ ...open, city: e.target.value })}
              />
              <Field
                label="Estado"
                value={open.state ?? ""}
                onChange={(e) => setOpen({ ...open, state: e.target.value })}
              />
              <Field
                label="Monto"
                type="number"
                value={open.amount ?? 0}
                onChange={(e) => setOpen({ ...open, amount: Number(e.target.value) })}
              />
              <div className="space-y-2">
                <Label>Estado del pago</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={open.payment_status ?? "pending"}
                  onChange={(e) => setOpen({ ...open, payment_status: e.target.value })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Nombre público (muro)"
                value={open.public_display_name ?? ""}
                onChange={(e) => setOpen({ ...open, public_display_name: e.target.value })}
              />
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
                <Label className="cursor-pointer text-xs">Autoriza muro</Label>
                <Switch
                  checked={open.public_wall_opt_in}
                  onCheckedChange={(v) => setOpen({ ...open, public_wall_opt_in: v })}
                />
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
                <Label className="cursor-pointer text-xs">Visible en muro</Label>
                <Switch
                  checked={open.visible_on_wall}
                  onCheckedChange={(v) => setOpen({ ...open, visible_on_wall: v })}
                />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <Area
                label="Mensaje del patrocinador"
                value={open.message ?? ""}
                onChange={(e) => setOpen({ ...open, message: e.target.value })}
              />
              <Area
                label="Donación en especie"
                value={open.in_kind_description ?? ""}
                onChange={(e) => setOpen({ ...open, in_kind_description: e.target.value })}
              />
              <Area
                label="Notas internas"
                value={open.admin_notes ?? ""}
                onChange={(e) => setOpen({ ...open, admin_notes: e.target.value })}
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(null)}>
                Cancelar
              </Button>
              <Button variant="hero" onClick={saveDetail} disabled={saving}>
                <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------- WRAPPER ----------------
type TabKey = "dashboard" | "sponsors" | "sections" | "tiers" | "form" | "contact" | "mp";

const ImpulsaAdmin = () => {
  const [tab, setTab] = useState<TabKey>("dashboard");
  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
      <TabsList className="mb-6 flex-wrap">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="sponsors">Patrocinios IMPULSA</TabsTrigger>
        <TabsTrigger value="sections">Secciones</TabsTrigger>
        <TabsTrigger value="tiers">Modalidades</TabsTrigger>
        <TabsTrigger value="form">Formulario</TabsTrigger>
        <TabsTrigger value="contact">Contacto</TabsTrigger>
        <TabsTrigger value="mp">Mercado Pago</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard"><ImpulsaDashboard /></TabsContent>
      <TabsContent value="sponsors"><SponsorsAdmin /></TabsContent>
      <TabsContent value="sections"><SectionsManager /></TabsContent>
      <TabsContent value="tiers"><TiersManager /></TabsContent>
      <TabsContent value="form"><FormFieldsManager /></TabsContent>
      <TabsContent value="contact"><ContactManager /></TabsContent>
      <TabsContent value="mp"><MercadoPagoAdmin /></TabsContent>
    </Tabs>
  );
};

export default ImpulsaAdmin;
