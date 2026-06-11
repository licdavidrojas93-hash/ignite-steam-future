import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, Sparkles, HeartHandshake, Calendar, Camera, BookOpen } from "lucide-react";

const db = supabase as any;

interface Update {
  id: string;
  title: string | null;
  description: string | null;
  media_url: string | null;
  update_type: string | null;
  created_at: string;
}

interface Settings {
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

const TYPE_ICONS: Record<string, any> = {
  avance: TrendingUp,
  historia: BookOpen,
  evidencia: Camera,
  steam_day: Calendar,
};

const TYPE_LABEL: Record<string, string> = {
  avance: "Avance",
  historia: "Historia de impacto",
  evidencia: "Evidencia",
  steam_day: "STEAM Day",
};

const ImpactSection = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [stats, setStats] = useState<{ total_raised: number; sponsors_count: number } | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: u }, { data: s }, { data: st }] = await Promise.all([
        db.from("impulsa_impact_updates").select("*").eq("is_public", true).order("sort_order", { ascending: true }),
        db.from("impulsa_impact_settings").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
        db.rpc("get_impulsa_public_stats"),
      ]);
      setUpdates(u ?? []);
      setSettings(s);
      setStats(Array.isArray(st) ? st[0] : st);
    })();
  }, []);

  if (!settings) return null;

  const raised = Number(stats?.total_raised || 0);
  const goal = Number(settings.goal_amount || 0);
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  const currency = settings.goal_currency || "MXN";

  const metrics = [
    settings.show_total_raised && {
      icon: HeartHandshake,
      value: `$${raised.toLocaleString("es-MX")}`,
      label: `Recaudado en ${currency}`,
    },
    settings.show_sponsors_count && {
      icon: Sparkles,
      value: String(stats?.sponsors_count ?? 0),
      label: "Patrocinadores",
    },
    settings.show_beneficiaries && settings.beneficiaries_override != null && {
      icon: Users,
      value: String(settings.beneficiaries_override),
      label: "Niñas y niños beneficiados",
    },
    settings.show_experiences && settings.experiences_override != null && {
      icon: TrendingUp,
      value: String(settings.experiences_override),
      label: "Experiencias financiadas",
    },
    settings.show_steam_days && settings.steam_days_override != null && {
      icon: Calendar,
      value: String(settings.steam_days_override),
      label: "STEAM Days realizados",
    },
  ].filter(Boolean) as { icon: any; value: string; label: string }[];

  const hasContent = metrics.length > 0 || updates.length > 0 || (settings.show_goal_progress && goal > 0);
  if (!hasContent) return null;

  return (
    <section id="impacto" className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary">
            <TrendingUp className="h-3.5 w-3.5" /> Transparencia e impacto
          </span>
          <h2 className="mt-4 font-display text-3xl md:text-4xl font-bold">Avance de la campaña</h2>
          <p className="mt-3 text-muted-foreground">
            Datos reales y actualizados en vivo. Así avanza IMPULSA por Niñ@s STEAM.
          </p>
        </div>

        {/* Barra de progreso de meta */}
        {settings.show_goal_progress && goal > 0 && (
          <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-card p-6 shadow-soft">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Meta</p>
                <p className="font-display text-2xl font-bold">
                  ${raised.toLocaleString("es-MX")} <span className="text-muted-foreground text-lg">/ ${goal.toLocaleString("es-MX")} {currency}</span>
                </p>
              </div>
              <p className="font-display text-3xl font-bold text-primary">{pct}%</p>
            </div>
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-secondary"
              />
            </div>
          </div>
        )}

        {/* Métricas */}
        {metrics.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="w-full sm:w-56 rounded-2xl bg-card p-5 text-center shadow-soft"
              >
                <m.icon className="mx-auto h-7 w-7 text-primary" />
                <p className="mt-3 font-display text-2xl font-bold">{m.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Publicaciones */}
        {updates.length > 0 && (
          <div className="mt-14">
            <h3 className="font-display text-2xl font-bold mb-6">Avances, historias y evidencia</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {updates.map((u, i) => {
                const Icon = TYPE_ICONS[u.update_type || "avance"] || TrendingUp;
                const isVideo = u.media_url?.match(/\.(mp4|webm|mov)$/i);
                return (
                  <motion.article
                    key={u.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="overflow-hidden rounded-2xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-medium"
                  >
                    {u.media_url && (
                      <div className="aspect-video bg-muted">
                        {isVideo ? (
                          <video src={u.media_url} controls className="h-full w-full object-cover" />
                        ) : (
                          <img src={u.media_url} alt={u.title ?? ""} className="h-full w-full object-cover" loading="lazy" />
                        )}
                      </div>
                    )}
                    <div className="p-5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        <Icon className="h-3 w-3" /> {TYPE_LABEL[u.update_type || "avance"] || "Avance"}
                      </span>
                      {u.title && <h4 className="mt-3 font-display text-lg font-bold">{u.title}</h4>}
                      {u.description && (
                        <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{u.description}</p>
                      )}
                      <p className="mt-3 text-xs text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImpactSection;
