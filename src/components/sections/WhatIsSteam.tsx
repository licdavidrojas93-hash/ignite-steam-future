import { motion } from "framer-motion";
import { Lightbulb, Microscope, Cpu, Palette, Calculator } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const ICONS_BY_LETTER: Record<string, typeof Microscope> = {
  S: Microscope,
  T: Cpu,
  E: Lightbulb,
  A: Palette,
  M: Calculator,
};

const WhatIsSteam = () => {
  const c = useSiteContent("what_is_steam");

  return (
    <section id="que-es-steam" className="py-12 md:py-16 bg-gradient-to-b from-transparent via-secondary/5 to-transparent">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <p className="text-sm font-bold uppercase tracking-widest text-secondary">{c.eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            {c.title}<span className="text-gradient-warm">{c.titleHighlight}</span>?
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">{c.description}</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {c.items.map((item, i) => {
            const Icon = ICONS_BY_LETTER[item.letter] ?? Lightbulb;
            return (
              <motion.div
                key={`${item.letter}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-2xl bg-card p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-warm/10 group-hover:bg-gradient-warm/20 transition">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-display text-3xl font-bold text-secondary/30 group-hover:text-secondary/50">
                    {item.letter}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 p-8 md:p-12 border border-primary/20"
        >
          <h3 className="font-display text-2xl md:text-3xl mb-4">{c.whyTitle}</h3>
          <p className="text-muted-foreground mb-6">{c.whyDescription}</p>
          <ul className="space-y-3 text-sm">
            {c.whyBullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className={`font-bold ${i % 2 === 0 ? "text-primary" : "text-secondary"}`}>✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatIsSteam;
