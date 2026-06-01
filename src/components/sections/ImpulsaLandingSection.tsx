import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Rocket,
  HeartHandshake,
  Microscope,
  ArrowRight,
  Target,
} from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const ImpulsaLandingSection = () => {
  const c = useSiteContent("impulsa_landing");

  return (
    <section
      id="impulsa"
      className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-accent/10 relative overflow-hidden"
    >
      <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* IZQUIERDA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> {c.badge}
            </span>
            <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold leading-tight text-foreground">
              {c.title}
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">{c.subtitle}</p>

            <div className="mt-6 rounded-2xl border-l-4 border-secondary bg-card/70 backdrop-blur p-5 shadow-soft">
              <p className="font-display text-xl font-bold text-foreground">
                "{c.highlight}"
              </p>
            </div>

            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-accent/15 px-5 py-3">
              <Target className="h-5 w-5 text-accent" />
              <p className="font-semibold text-foreground">{c.goal}</p>
            </div>

            <p className="mt-5 text-muted-foreground">{c.extra}</p>
          </motion.div>

          {/* DERECHA — card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-3xl bg-card p-7 md:p-9 shadow-medium ring-1 ring-border"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold">Elige cómo impulsar</h3>
            </div>

            <div className="mt-6 space-y-3">
              {c.tiers.map((t, i) => {
                const Icon = [Microscope, HeartHandshake, Sparkles][i % 3];
                return (
                  <div
                    key={t.title}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 p-4 transition hover:border-primary/40 hover:shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <p className="font-semibold text-foreground">{t.title}</p>
                    </div>
                    <p className="font-display text-xl font-bold text-primary">{t.price}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <Link
                to="/impulsa#patrocinar"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-6 py-4 font-bold text-white shadow-playful transition hover:scale-[1.02] hover:bg-accent hover:text-foreground"
              >
                {c.primaryCta} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/impulsa"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-4 font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                {c.secondaryCta}
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">{c.microcopy}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImpulsaLandingSection;
