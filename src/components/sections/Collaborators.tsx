import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const Collaborators = () => {
  const c = useSiteContent("collaborators");

  return (
    <section id="colaboradores" className="py-12 md:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Users className="h-5 w-5 text-secondary" />
            <p className="text-sm font-bold uppercase tracking-widest text-secondary">{c.eyebrow}</p>
          </div>
          <h2 className="font-display text-4xl md:text-5xl">
            {c.title}<span className="text-gradient-warm">{c.titleHighlight}</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">{c.description}</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {c.groups.map((group, groupIdx) => (
            <motion.div
              key={`${group.category}-${groupIdx}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: groupIdx * 0.15 }}
              className="rounded-3xl bg-card p-8 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{group.icon}</span>
                <h3 className="font-display text-2xl text-primary">{group.category}</h3>
              </div>

              <ul className="space-y-3">
                {group.organizations.map((org, idx) => (
                  <motion.li
                    key={`${org}-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: groupIdx * 0.15 + idx * 0.05 }}
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition"
                  >
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    <span className="text-sm">{org}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 rounded-3xl bg-gradient-to-r from-primary/15 via-secondary/15 to-accent/15 p-10 md:p-14 border border-primary/20 text-center"
        >
          <h3 className="font-display text-2xl md:text-3xl mb-4">{c.ctaTitle}</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">{c.ctaDescription}</p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-warm text-white font-semibold hover:shadow-lg transition transform hover:scale-105"
          >
            {c.ctaButton}
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Collaborators;
