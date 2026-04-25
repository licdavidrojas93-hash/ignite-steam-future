import { motion } from "framer-motion";
import { Lightbulb, Heart, Users } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const ICONS = [Lightbulb, Users, Heart];
const COLORS = ["text-secondary bg-secondary/10", "text-primary bg-primary/10", "text-art bg-art/10"];

const Mission = () => {
  const c = useSiteContent("mission");

  return (
    <section id="mision" className="py-12 md:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-widest text-primary">{c.eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            {c.title}<span className="text-gradient-warm">{c.titleHighlight}</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">{c.description}</p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {c.items.map((it, i) => {
            const Icon = ICONS[i % ICONS.length];
            const color = COLORS[i % COLORS.length];
            return (
              <motion.div
                key={`${it.title}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-3xl bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-medium"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-display text-2xl">{it.title}</h3>
                <p className="mt-3 text-muted-foreground">{it.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Mission;
