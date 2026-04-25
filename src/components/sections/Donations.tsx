import { motion } from "framer-motion";
import { Sparkles, GraduationCap, Heart } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const ICONS = [Sparkles, GraduationCap, Heart];
const STYLES = [
  { color: "text-accent", bgColor: "bg-accent/10" },
  { color: "text-primary", bgColor: "bg-primary/10" },
  { color: "text-secondary", bgColor: "bg-secondary/10", featured: true },
];

const Donations = () => {
  const c = useSiteContent("donations");

  return (
    <section id="donaciones" className="py-16 md:py-20 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center mb-12"
        >
          <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">{c.eyebrow}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            {c.title}<span className="text-accent">{c.titleHighlight}</span>
          </h2>
          <p className="text-lg text-foreground">{c.description}</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {c.tiers.map((tier, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            const s = STYLES[idx % STYLES.length];
            return (
              <motion.div
                key={`${tier.title}-${idx}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative rounded-3xl bg-card p-8 shadow-soft transition-all hover:shadow-medium hover:-translate-y-2 ${
                  s.featured ? "ring-2 ring-secondary/50" : ""
                }`}
              >
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${s.bgColor} mb-6`}>
                  <Icon className={`h-8 w-8 ${s.color}`} />
                </div>
                <p className={`font-display text-4xl font-bold ${s.color} mb-2`}>{tier.amount}</p>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{tier.title}</h3>
                <p className="text-muted-foreground">{tier.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="rounded-3xl bg-card p-8 md:p-10 shadow-medium flex justify-center">
            <a
              href={c.paypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-accent hover:text-foreground text-white font-bold text-base px-10 py-6 rounded-full shadow-playful transition-all duration-300 hover:scale-105"
            >
              {c.buttonText}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Donations;
