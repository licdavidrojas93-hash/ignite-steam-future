import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const db = supabase as any;

interface Row {
  id: string;
  sponsor_name: string;
  sponsor_type: string | null;
  payment_status: string | null;
  public_wall_opt_in: boolean;
  visible_on_wall: boolean;
  public_display_name: string | null;
  message: string | null;
  created_at: string;
  amount: number | null;
  email_sent: boolean;
}

const canShowOnWall = (r: Row) =>
  r.public_wall_opt_in && (r.payment_status === "paid" || r.payment_status === "in_kind_confirmed");

const WallAdmin = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVis, setFilterVis] = useState<"all" | "visible" | "hidden" | "eligible">("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [editing, setEditing] = useState<Row | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await db
      .from("impulsa_sponsors")
      .select(
        "id,sponsor_name,sponsor_type,payment_status,public_wall_opt_in,visible_on_wall,public_display_name,message,created_at,amount,email_sent",
      )
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const types = useMemo(
    () => Array.from(new Set(rows.map((r) => r.sponsor_type).filter(Boolean))) as string[],
    [rows],
  );

  const filtered = useMemo(() => {
    let r = rows;
    if (filterVis === "visible") r = r.filter((x) => x.visible_on_wall);
    else if (filterVis === "hidden") r = r.filter((x) => !x.visible_on_wall);
    else if (filterVis === "eligible") r = r.filter(canShowOnWall);
    if (filterType !== "all") r = r.filter((x) => x.sponsor_type === filterType);
    return r;
  }, [rows, filterVis, filterType]);

  const toggleVisible = async (r: Row) => {
    const next = !r.visible_on_wall;
    if (next && !canShowOnWall(r)) {
      toast.error("No autorizado o pago no confirmado.");
      return;
    }
    const { error } = await db.from("impulsa_sponsors").update({ visible_on_wall: next }).eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success(next ? "Mostrado en muro ✓" : "Ocultado del muro");
    load();
  };

  const toggleOptIn = async (r: Row) => {
    const next = !r.public_wall_opt_in;
    const patch: any = { public_wall_opt_in: next };
    if (!next) patch.visible_on_wall = false;
    const { error } = await db.from("impulsa_sponsors").update(patch).eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Autorización actualizada");
    load();
  };

  const saveEdit = async () => {
    if (!editing) return;
    const { error } = await db
      .from("impulsa_sponsors")
      .update({
        public_display_name: editing.public_display_name,
        message: editing.message,
      })
      .eq("id", editing.id);
    if (error) return toast.error(error.message);
    toast.success("Datos públicos actualizados ✓");
    setEditing(null);
    load();
  };

  if (loading) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-2xl">Muro de patrocinadores</h3>
        <p className="text-xs text-muted-foreground">
          Total: {rows.length} · Visibles: {rows.filter((r) => r.visible_on_wall).length} · Elegibles:{" "}
          {rows.filter(canShowOnWall).length}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "visible", "hidden", "eligible"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilterVis(k)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filterVis === k
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {k === "all"
              ? "Todos"
              : k === "visible"
              ? "Visibles"
              : k === "hidden"
              ? "No visibles"
              : "Elegibles (autorizado + pagado)"}
          </button>
        ))}
        <select
          className="ml-auto rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Todos los tipos</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">Sin resultados.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-3 py-3">Patrocinador</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Estado pago</th>
                <th className="px-3 py-3">Autoriza</th>
                <th className="px-3 py-3">Visible</th>
                <th className="px-3 py-3">Nombre público</th>
                <th className="px-3 py-3">Mensaje</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="px-3 py-3">
                    <p className="font-semibold">{r.sponsor_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("es-MX")}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-xs">{r.sponsor_type || "—"}</td>
                  <td className="px-3 py-3 text-xs">{r.payment_status || "—"}</td>
                  <td className="px-3 py-3">
                    <Button size="sm" variant="ghost" onClick={() => toggleOptIn(r)}>
                      {r.public_wall_opt_in ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </Button>
                  </td>
                  <td className="px-3 py-3">
                    <Button size="sm" variant="ghost" onClick={() => toggleVisible(r)}>
                      {r.visible_on_wall ? (
                        <Eye className="h-4 w-4 text-primary" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </td>
                  <td className="px-3 py-3 text-xs">{r.public_display_name || "—"}</td>
                  <td className="px-3 py-3 text-xs max-w-xs truncate">{r.message || "—"}</td>
                  <td className="px-3 py-3">
                    <Button size="sm" variant="outline" onClick={() => setEditing(r)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-lg space-y-4 rounded-3xl bg-card p-6 shadow-medium"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl font-bold">Datos públicos</h3>
            <div className="space-y-2">
              <Label>Nombre público en el muro</Label>
              <Input
                value={editing.public_display_name ?? ""}
                onChange={(e) => setEditing({ ...editing, public_display_name: e.target.value })}
                placeholder="Familia Pérez · ACME S.A."
              />
            </div>
            <div className="space-y-2">
              <Label>Mensaje público</Label>
              <Textarea
                rows={4}
                value={editing.message ?? ""}
                onChange={(e) => setEditing({ ...editing, message: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button variant="hero" onClick={saveEdit}>
                <Save className="h-4 w-4" /> Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WallAdmin;
