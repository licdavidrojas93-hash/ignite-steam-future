import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Save, Trash2, ChevronUp, ChevronDown, Upload, Eye, EyeOff } from "lucide-react";

const db = supabase as any;

interface Update {
  id: string;
  title: string | null;
  description: string | null;
  media_url: string | null;
  update_type: string | null;
  is_public: boolean;
  sort_order: number;
  created_at: string;
}

interface Settings {
  id: string;
  goal_amount: number | null;
  goal_currency: string | null;
  beneficiaries_override: number | null;
  experiences_override: number | null;
  steam_days_override: number | null;
  show_goal_progress: boolean;
  show_total_raised: boolean;
  show_sponsors_count: boolean;
  show_beneficiaries: boolean;
  show_experiences: boolean;
  show_steam_days: boolean;
}

const TYPES = [
  { v: "avance", l: "Avance" },
  { v: "historia", l: "Historia de impacto" },
  { v: "evidencia", l: "Evidencia" },
  { v: "steam_day", l: "STEAM Day" },
];

const ImpactAdmin = () => {
  const [rows, setRows] = useState<Update[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [stats, setStats] = useState<{ total_raised: number; sponsors_count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: u }, { data: s }, { data: st }] = await Promise.all([
      db.from("impulsa_impact_updates").select("*").order("sort_order", { ascending: true }),
      db.from("impulsa_impact_settings").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
      db.rpc("get_impulsa_public_stats"),
    ]);
    setRows(u ?? []);
    setSettings(s);
    setStats(Array.isArray(st) ? st[0] : st);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (id: string, patch: Partial<Update>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const save = async (r: Update) => {
    const { error } = await db
      .from("impulsa_impact_updates")
      .update({
        title: r.title,
        description: r.description,
        media_url: r.media_url,
        update_type: r.update_type,
        is_public: r.is_public,
        sort_order: r.sort_order,
      })
      .eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Publicación guardada ✓");
  };

  const add = async () => {
    const { error } = await db.from("impulsa_impact_updates").insert({
      title: "Nueva publicación",
      update_type: "avance",
      sort_order: rows.length + 1,
    });
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (r: Update) => {
    if (!confirm(`¿Eliminar "${r.title}"?`)) return;
    const { error } = await db.from("impulsa_impact_updates").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Eliminada");
    load();
  };

  const move = async (r: Update, dir: -1 | 1) => {
    const next = r.sort_order + dir;
    await db.from("impulsa_impact_updates").update({ sort_order: next }).eq("id", r.id);
    load();
  };

  const handleUpload = async (r: Update, file: File) => {
    setUploadingId(r.id);
    const path = `${r.id}-${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    const { error } = await supabase.storage.from("impulsa-impact").upload(path, file, { upsert: true });
    if (error) {
      setUploadingId(null);
      return toast.error(error.message);
    }
    const { data } = supabase.storage.from("impulsa-impact").getPublicUrl(path);
    update(r.id, { media_url: data.publicUrl });
    await db.from("impulsa_impact_updates").update({ media_url: data.publicUrl }).eq("id", r.id);
    setUploadingId(null);
    toast.success("Archivo subido ✓");
  };

  const saveSettings = async () => {
    if (!settings) return;
    const payload = {
      goal_amount: settings.goal_amount,
      goal_currency: settings.goal_currency,
      beneficiaries_override: settings.beneficiaries_override,
      experiences_override: settings.experiences_override,
      steam_days_override: settings.steam_days_override,
      show_goal_progress: settings.show_goal_progress,
      show_total_raised: settings.show_total_raised,
      show_sponsors_count: settings.show_sponsors_count,
      show_beneficiaries: settings.show_beneficiaries,
      show_experiences: settings.show_experiences,
      show_steam_days: settings.show_steam_days,
    };
    const { error } = settings.id
      ? await db.from("impulsa_impact_settings").update(payload).eq("id", settings.id)
      : await db.from("impulsa_impact_settings").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Configuración guardada ✓");
    load();
  };

  const setS = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    settings && setSettings({ ...settings, [k]: v });

  if (loading || !settings) return <p className="text-muted-foreground">Cargando...</p>;

  const pct = settings.goal_amount && settings.goal_amount > 0
    ? Math.min(100, Math.round((Number(stats?.total_raised || 0) / Number(settings.goal_amount)) * 100))
    : 0;

  return (
    <div className="space-y-8">
      {/* Métricas actuales */}
      <div className="rounded-2xl bg-card p-6 shadow-soft">
        <h3 className="font-display text-2xl mb-4">Métricas públicas (en vivo)</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground">Total recaudado</p>
            <p className="font-display text-2xl font-bold">
              ${Number(stats?.total_raised || 0).toLocaleString("es-MX")} {settings.goal_currency}
            </p>
          </div>
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground">Patrocinadores confirmados</p>
            <p className="font-display text-2xl font-bold">{stats?.sponsors_count || 0}</p>
          </div>
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground">Avance de meta</p>
            <p className="font-display text-2xl font-bold">{pct}%</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background">
              <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Configuración */}
      <div className="space-y-4 rounded-2xl bg-card p-6 shadow-soft">
        <h3 className="font-display text-2xl">Configuración de transparencia</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Meta económica</Label>
            <Input type="number" value={settings.goal_amount ?? 0}
              onChange={(e) => setS("goal_amount", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Moneda</Label>
            <Input value={settings.goal_currency ?? "MXN"}
              onChange={(e) => setS("goal_currency", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Beneficiados (override manual)</Label>
            <Input type="number" value={settings.beneficiaries_override ?? ""}
              onChange={(e) => setS("beneficiaries_override", e.target.value ? Number(e.target.value) : null)} />
          </div>
          <div className="space-y-2">
            <Label>Experiencias financiadas (override)</Label>
            <Input type="number" value={settings.experiences_override ?? ""}
              onChange={(e) => setS("experiences_override", e.target.value ? Number(e.target.value) : null)} />
          </div>
          <div className="space-y-2">
            <Label>STEAM Days realizados</Label>
            <Input type="number" value={settings.steam_days_override ?? ""}
              onChange={(e) => setS("steam_days_override", e.target.value ? Number(e.target.value) : null)} />
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          {([
            ["show_goal_progress", "Mostrar avance de meta"],
            ["show_total_raised", "Mostrar total recaudado"],
            ["show_sponsors_count", "Mostrar # patrocinadores"],
            ["show_beneficiaries", "Mostrar # beneficiados"],
            ["show_experiences", "Mostrar # experiencias"],
            ["show_steam_days", "Mostrar # STEAM Days"],
          ] as const).map(([k, l]) => (
            <div key={k} className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
              <Label className="cursor-pointer text-xs">{l}</Label>
              <Switch checked={settings[k] as boolean} onCheckedChange={(v) => setS(k, v as any)} />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button variant="hero" onClick={saveSettings}>
            <Save className="h-4 w-4" /> Guardar configuración
          </Button>
        </div>
      </div>

      {/* Publicaciones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">Avances, historias y evidencia</h3>
          <Button variant="hero" onClick={add}>
            <Plus className="h-4 w-4" /> Nueva publicación
          </Button>
        </div>

        {rows.length === 0 && <p className="text-muted-foreground">Sin publicaciones aún.</p>}

        {rows.map((r) => (
          <div key={r.id} className="space-y-3 rounded-2xl bg-card p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString("es-MX")} · orden: {r.sort_order}
              </p>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" onClick={() => move(r, -1)}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => move(r, 1)}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
                  <Label className="cursor-pointer text-xs">
                    {r.is_public ? <Eye className="inline h-3 w-3" /> : <EyeOff className="inline h-3 w-3" />} Pública
                  </Label>
                  <Switch checked={r.is_public} onCheckedChange={(v) => update(r.id, { is_public: v })} />
                </div>
                <Button size="icon" variant="outline" onClick={() => remove(r)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={r.title ?? ""} onChange={(e) => update(r.id, { title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={r.update_type ?? "avance"}
                  onChange={(e) => update(r.id, { update_type: e.target.value })}
                >
                  {TYPES.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea rows={3} value={r.description ?? ""}
                onChange={(e) => update(r.id, { description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>URL de medio (foto o video)</Label>
              <div className="flex items-center gap-2">
                <Input value={r.media_url ?? ""}
                  onChange={(e) => update(r.id, { media_url: e.target.value })}
                  placeholder="https://..." />
                <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted">
                  <Upload className="h-4 w-4" />
                  {uploadingId === r.id ? "Subiendo..." : "Subir"}
                  <input type="file" className="hidden" accept="image/*,video/*"
                    onChange={(e) => e.target.files?.[0] && handleUpload(r, e.target.files[0])} />
                </label>
              </div>
              {r.media_url && (
                r.media_url.match(/\.(mp4|webm|mov)$/i) ? (
                  <video src={r.media_url} controls className="mt-2 max-h-48 rounded-lg" />
                ) : (
                  <img src={r.media_url} alt={r.title ?? ""} className="mt-2 max-h-48 rounded-lg object-cover" />
                )
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="hero" onClick={() => save(r)}>
                <Save className="h-4 w-4" /> Guardar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactAdmin;
