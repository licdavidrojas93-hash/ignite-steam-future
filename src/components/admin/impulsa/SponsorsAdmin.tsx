import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Mail, Eye, EyeOff, CheckCircle2, XCircle, Clock, Gift, Download } from "lucide-react";
import PaymentStatusBadge from "./PaymentStatusBadge";

const db = supabase as any;

interface Sponsor {
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
  payment_reference: string | null;
  mercado_pago_payment_id: string | null;
  mercado_pago_preference_id: string | null;
  email_sent: boolean;
  paid_at: string | null;
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

const FILTERS = [
  { key: "all", label: "Todos" },
  { key: "pending", label: "Pendientes" },
  { key: "paid", label: "Pagados" },
  { key: "cancelled", label: "Cancelados" },
  { key: "failed", label: "Fallidos" },
  { key: "refunded", label: "Reembolsados" },
  { key: "in_kind", label: "En especie" },
  { key: "wall_visible", label: "Visibles en muro" },
  { key: "wall_hidden", label: "No visibles en muro" },
];

const canShowOnWall = (s: Sponsor) =>
  s.public_wall_opt_in && (s.payment_status === "paid" || s.payment_status === "in_kind_confirmed");

const SponsorsAdmin = () => {
  const [rows, setRows] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<Sponsor | null>(null);
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

  const filtered = useMemo(() => {
    let r = rows;
    if (filter === "in_kind") r = r.filter((x) => x.payment_status?.startsWith("in_kind"));
    else if (filter === "wall_visible") r = r.filter((x) => x.visible_on_wall);
    else if (filter === "wall_hidden") r = r.filter((x) => !x.visible_on_wall);
    else if (filter !== "all") r = r.filter((x) => x.payment_status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((x) =>
        [
          x.sponsor_name,
          x.email,
          x.phone,
          x.city,
          x.payment_reference,
          x.mercado_pago_payment_id,
        ]
          .some((v) => (v ?? "").toLowerCase().includes(q)),
      );
    }
    return r;
  }, [rows, filter, search]);

  const patch = async (id: string, data: Partial<Sponsor>, msg = "Actualizado ✓") => {
    const { error } = await db.from("impulsa_sponsors").update(data).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(msg);
    load();
  };

  const setStatus = (s: Sponsor, status: string) => {
    const data: any = { payment_status: status };
    if (status === "paid" && !s.paid_at) data.paid_at = new Date().toISOString();
    return patch(s.id, data, `Estado: ${status}`);
  };

  const toggleWall = (s: Sponsor) => {
    const next = !s.visible_on_wall;
    if (next && !canShowOnWall(s)) {
      toast.error(
        "No se puede mostrar en el muro porque el patrocinador no ha autorizado aparecer públicamente o el pago no está confirmado.",
      );
      return;
    }
    return patch(s.id, { visible_on_wall: next }, next ? "Mostrado en muro" : "Oculto del muro");
  };

  const resendEmail = (s: Sponsor) => {
    toast.info(`Reenvío de correo a ${s.email || "—"} preparado (correo automático aún no configurado).`);
  };

  const saveDetail = async () => {
    if (!open) return;
    if (open.visible_on_wall && !canShowOnWall(open)) {
      toast.error(
        "No se puede mostrar en el muro porque el patrocinador no ha autorizado aparecer públicamente o el pago no está confirmado.",
      );
      return;
    }
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
        payment_reference: open.payment_reference,
        mercado_pago_payment_id: open.mercado_pago_payment_id,
        mercado_pago_preference_id: open.mercado_pago_preference_id,
      })
      .eq("id", open.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Patrocinio actualizado ✓");
    setOpen(null);
    load();
  };

  const exportCsv = () => {
    const headers = [
      "fecha","nombre","nombre_publico","tipo","correo","telefono","ciudad","estado",
      "modalidad","monto","moneda","estado_pago","autoriza_muro","visible_muro",
      "correo_enviado","referencia_pago","mp_payment_id","mp_preference_id","mensaje","especie","notas",
    ];
    const csv = [headers.join(",")]
      .concat(
        filtered.map((r) =>
          [
            new Date(r.created_at).toISOString(),
            r.sponsor_name, r.public_display_name, r.sponsor_type, r.email, r.phone, r.city, r.state,
            r.participation_type, r.amount, r.currency, r.payment_status,
            r.public_wall_opt_in ? "sí" : "no",
            r.visible_on_wall ? "sí" : "no",
            r.email_sent ? "sí" : "no",
            r.payment_reference, r.mercado_pago_payment_id, r.mercado_pago_preference_id,
            r.message, r.in_kind_description, r.admin_notes,
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
    a.download = `patrocinios_impulsa_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-2xl">Patrocinios IMPULSA</h3>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto w-full sm:w-72">
          <Input
            placeholder="Buscar nombre, correo, tel, ciudad, ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">Sin resultados.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-3 py-3">Fecha</th>
                <th className="px-3 py-3">Patrocinador</th>
                <th className="px-3 py-3">Contacto</th>
                <th className="px-3 py-3">Ubicación</th>
                <th className="px-3 py-3">Modalidad / Monto</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3">Muro</th>
                <th className="px-3 py-3">MP</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="px-3 py-3 whitespace-nowrap text-xs">
                    {new Date(r.created_at).toLocaleDateString("es-MX")}
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-semibold">{r.sponsor_name}</p>
                    <p className="text-xs text-muted-foreground">{r.sponsor_type || "—"}</p>
                    {r.public_display_name && (
                      <p className="text-xs text-muted-foreground">público: {r.public_display_name}</p>
                    )}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {r.email || "—"}<br />{r.phone || "—"}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {r.city || "—"}<br />{r.state || "—"}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {r.participation_type || "—"}<br />
                    <span className="font-semibold">
                      {r.amount ? `$${Number(r.amount).toLocaleString("es-MX")} ${r.currency || ""}` : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <PaymentStatusBadge status={r.payment_status} />
                    {r.email_sent && (
                      <p className="mt-1 text-[10px] text-muted-foreground">✉ enviado</p>
                    )}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {r.public_wall_opt_in ? "✅ autoriza" : "—"}<br />
                    {r.visible_on_wall ? "👁 visible" : "—"}
                  </td>
                  <td className="px-3 py-3 text-[10px]">
                    {r.mercado_pago_payment_id ? (
                      <code className="break-all">{r.mercado_pago_payment_id}</code>
                    ) : "—"}
                    {r.payment_reference && <><br /><code>{r.payment_reference}</code></>}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => setOpen(r)}>Detalle</Button>
                      {r.payment_status !== "paid" && (
                        <Button size="sm" variant="outline" onClick={() => setStatus(r, "paid")} title="Marcar pagado">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {r.payment_status !== "pending" && (
                        <Button size="sm" variant="outline" onClick={() => setStatus(r, "pending")} title="Marcar pendiente">
                          <Clock className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {r.payment_status !== "cancelled" && (
                        <Button size="sm" variant="outline" onClick={() => setStatus(r, "cancelled")} title="Cancelar">
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {r.payment_status === "in_kind_pending" && (
                        <Button size="sm" variant="outline" onClick={() => setStatus(r, "in_kind_confirmed")} title="Confirmar especie">
                          <Gift className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => toggleWall(r)} title="Mostrar/ocultar muro">
                        {r.visible_on_wall ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => resendEmail(r)} title="Reenviar correo">
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setOpen(null)}>
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-card p-6 shadow-medium"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-bold">Detalle del patrocinio</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(open.created_at).toLocaleString("es-MX")}
                </p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setOpen(null)}>×</Button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <F label="Nombre" v={open.sponsor_name} on={(v) => setOpen({ ...open, sponsor_name: v })} />
              <F label="Tipo de patrocinador" v={open.sponsor_type ?? ""} on={(v) => setOpen({ ...open, sponsor_type: v })} />
              <F label="Correo" v={open.email ?? ""} on={(v) => setOpen({ ...open, email: v })} />
              <F label="Teléfono" v={open.phone ?? ""} on={(v) => setOpen({ ...open, phone: v })} />
              <F label="Ciudad" v={open.city ?? ""} on={(v) => setOpen({ ...open, city: v })} />
              <F label="Estado" v={open.state ?? ""} on={(v) => setOpen({ ...open, state: v })} />
              <F label="Modalidad" v={open.participation_type ?? ""} on={() => {}} />
              <F label="Monto" type="number" v={String(open.amount ?? "")} on={(v) => setOpen({ ...open, amount: Number(v) })} />
              <div className="space-y-1">
                <Label className="text-xs">Estado del pago</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={open.payment_status ?? "pending"}
                  onChange={(e) => setOpen({ ...open, payment_status: e.target.value })}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <F label="Nombre público (muro)" v={open.public_display_name ?? ""} on={(v) => setOpen({ ...open, public_display_name: v })} />
              <F label="Referencia de pago" v={open.payment_reference ?? ""} on={(v) => setOpen({ ...open, payment_reference: v })} />
              <F label="MP Payment ID" v={open.mercado_pago_payment_id ?? ""} on={(v) => setOpen({ ...open, mercado_pago_payment_id: v })} />
              <F label="MP Preference ID" v={open.mercado_pago_preference_id ?? ""} on={(v) => setOpen({ ...open, mercado_pago_preference_id: v })} />
              <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/50 px-3 py-2">
                <Label className="cursor-pointer text-xs">Autoriza muro</Label>
                <Switch
                  checked={open.public_wall_opt_in}
                  onCheckedChange={(v) => setOpen({ ...open, public_wall_opt_in: v })}
                />
              </div>
              <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/50 px-3 py-2">
                <Label className="cursor-pointer text-xs">Visible en muro</Label>
                <Switch
                  checked={open.visible_on_wall}
                  onCheckedChange={(v) => setOpen({ ...open, visible_on_wall: v })}
                />
              </div>
            </div>

            {open.visible_on_wall && !canShowOnWall(open) && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-xs text-red-700">
                ⚠ No se puede mostrar en el muro porque el patrocinador no ha autorizado aparecer públicamente o el pago no está confirmado.
              </p>
            )}

            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Mensaje del patrocinador</Label>
                <Textarea rows={2} value={open.message ?? ""} onChange={(e) => setOpen({ ...open, message: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Donación en especie</Label>
                <Textarea rows={2} value={open.in_kind_description ?? ""} onChange={(e) => setOpen({ ...open, in_kind_description: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Notas internas</Label>
                <Textarea rows={2} value={open.admin_notes ?? ""} onChange={(e) => setOpen({ ...open, admin_notes: e.target.value })} />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(null)}>Cancelar</Button>
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

const F = ({
  label, v, on, type = "text",
}: { label: string; v: string; on: (v: string) => void; type?: string }) => (
  <div className="space-y-1">
    <Label className="text-xs">{label}</Label>
    <Input type={type} value={v} onChange={(e) => on(e.target.value)} />
  </div>
);

export default SponsorsAdmin;
