import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Sparkles, Star, Heart, Rocket } from "lucide-react";

const db = supabase as any;

export interface WallSponsor {
  id: string;
  public_display_name: string | null;
  sponsor_type: string | null;
  message: string | null;
  created_at: string;
}

export const useSponsorsWall = () => {
  const [rows, setRows] = useState<WallSponsor[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    db.from("public_impulsa_sponsors_wall")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }: any) => {
        setRows(data ?? []);
        setLoading(false);
      });
  }, []);
  return { rows, loading };
};

const ICONS = [Star, Heart, Sparkles, Rocket];

const monthLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("es-MX", { month: "long", year: "numeric" });

const SponsorsWall = () => {
  const { rows, loading } = useSponsorsWall();

  return (
    <section id="muro" className="py-20 bg-gradient-to-br from-accent/5 via-background to-primary/5">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Sparkles className="mx-auto h-10 w-10 text-secondary" />
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">Muro de Patrocinadores</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Personas, familias, empresas e instituciones que están abriendo oportunidades para niñas y
            niños de Hermosillo.
          </p>
        </div>

        {loading ? (
          <p className="mt-10 text-center text-muted-foreground">Cargando muro...</p>
        ) : rows.length === 0 ? (
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl bg-card p-8 text-center shadow-soft">
            <p className="text-muted-foreground">
              Muy pronto aparecerán aquí las personas, familias y empresas que se sumen a IMPULSA por
              Niñ@s STEAM.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((r, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border/60"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-lg font-bold leading-tight">
                        {r.public_display_name}
                      </p>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {r.sponsor_type || "Patrocinador"} · {monthLabel(r.created_at)}
                      </p>
                    </div>
                  </div>
                  {r.message && (
                    <p className="mt-4 text-sm text-foreground/80 italic">"{r.message}"</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SponsorsWall;
