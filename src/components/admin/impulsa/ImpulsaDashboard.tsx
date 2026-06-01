import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, CheckCircle2, Clock, Gift, Target, Eye, Wallet } from "lucide-react";

const db = supabase as any;

interface Sponsor {
  created_at: string;
  sponsor_type: string | null;
  participation_type: string | null;
  amount: number | null;
  payment_status: string | null;
  public_wall_opt_in: boolean;
  visible_on_wall: boolean;
}

const peso = (n: number) => `$${Math.round(n).toLocaleString("es-MX")} MXN`;

const StatCard = ({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: any;
  label: string;
  value: string | number;
  hint?: string;
}) => (
  <div className="rounded-2xl bg-card p-5 shadow-soft">
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-bold">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  </div>
);

const ImpulsaDashboard = () => {
  const [rows, setRows] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.from("impulsa_sponsors")
      .select(
        "created_at,sponsor_type,participation_type,amount,payment_status,public_wall_opt_in,visible_on_wall",
      )
      .then(({ data }: any) => {
        setRows(data ?? []);
        setLoading(false);
      });
  }, []);

  const m = useMemo(() => {
    const paid = rows.filter((r) => r.payment_status === "paid");
    const pending = rows.filter((r) => r.payment_status === "pending");
    const inKind = rows.filter(
      (r) => r.payment_status === "in_kind_pending" || r.payment_status === "in_kind_confirmed",
    );
    const total = paid.reduce((s, r) => s + Number(r.amount || 0), 0);
    const experiencias = Math.floor(total / 400);
    const avance = Math.min((experiencias / 100) * 100, 100);

    const byMod = new Map<string, number>();
    paid.forEach((r) => {
      const k = r.participation_type || "Sin modalidad";
      byMod.set(k, (byMod.get(k) ?? 0) + Number(r.amount || 0));
    });

    const byType = new Map<string, number>();
    paid.forEach((r) => {
      const k = r.sponsor_type || "Sin tipo";
      byType.set(k, (byType.get(k) ?? 0) + Number(r.amount || 0));
    });

    const byMonth = new Map<string, number>();
    paid.forEach((r) => {
      const d = new Date(r.created_at);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth.set(k, (byMonth.get(k) ?? 0) + Number(r.amount || 0));
    });

    return {
      total,
      experiencias,
      avance,
      totalSponsors: rows.length,
      paidCount: paid.length,
      pendingCount: pending.length,
      inKindCount: inKind.length,
      wallVisible: rows.filter((r) => r.visible_on_wall).length,
      byMod: [...byMod.entries()].sort((a, b) => b[1] - a[1]),
      byType: [...byType.entries()].sort((a, b) => b[1] - a[1]),
      byMonth: [...byMonth.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    };
  }, [rows]);

  if (loading) return <p className="text-muted-foreground">Cargando dashboard...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-2xl">Dashboard IMPULSA</h3>
        <p className="text-sm text-muted-foreground">
          Resumen de patrocinios, ingresos y avance hacia la meta 2026.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Wallet} label="Total recaudado" value={peso(m.total)} />
        <StatCard icon={Target} label="Experiencias financiadas" value={m.experiencias} hint="≈ $400 c/u" />
        <StatCard icon={Users} label="Patrocinadores" value={m.totalSponsors} />
        <StatCard icon={CheckCircle2} label="Pagados" value={m.paidCount} />
        <StatCard icon={Clock} label="Pendientes" value={m.pendingCount} />
        <StatCard icon={Gift} label="En especie" value={m.inKindCount} />
        <StatCard icon={Eye} label="Visibles en muro" value={m.wallVisible} />
        <StatCard icon={TrendingUp} label="Avance meta" value={`${m.avance.toFixed(1)}%`} hint="meta: 100 niñ@s" />
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold">Avance hacia la meta 2026 — 100 niñas y niños</p>
          <p className="text-sm text-muted-foreground">
            {m.experiencias} / 100 experiencias
          </p>
        </div>
        <Progress value={m.avance} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BreakdownTable title="Ingresos por modalidad" rows={m.byMod} />
        <BreakdownTable title="Ingresos por tipo de patrocinador" rows={m.byType} />
        <BreakdownTable title="Ingresos por mes" rows={m.byMonth} fullWidth />
      </div>
    </div>
  );
};

const BreakdownTable = ({
  title,
  rows,
  fullWidth,
}: {
  title: string;
  rows: [string, number][];
  fullWidth?: boolean;
}) => (
  <div className={`rounded-2xl bg-card p-6 shadow-soft ${fullWidth ? "lg:col-span-2" : ""}`}>
    <p className="mb-3 font-semibold">{title}</p>
    {rows.length === 0 ? (
      <p className="text-sm text-muted-foreground">Sin datos todavía.</p>
    ) : (
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-t border-border first:border-t-0">
              <td className="py-2">{k}</td>
              <td className="py-2 text-right font-semibold">{peso(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default ImpulsaDashboard;
