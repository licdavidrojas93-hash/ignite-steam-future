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

// ---------------- WRAPPER ----------------
const ImpulsaAdmin = () => {
  const [tab, setTab] = useState<"sections" | "tiers" | "contact">("sections");
  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
      <TabsList className="mb-6">
        <TabsTrigger value="sections">Secciones</TabsTrigger>
        <TabsTrigger value="tiers">Niveles de patrocinio</TabsTrigger>
        <TabsTrigger value="contact">Contacto</TabsTrigger>
      </TabsList>
      <TabsContent value="sections">
        <SectionsManager />
      </TabsContent>
      <TabsContent value="tiers">
        <TiersManager />
      </TabsContent>
      <TabsContent value="contact">
        <ContactManager />
      </TabsContent>
    </Tabs>
  );
};

export default ImpulsaAdmin;
