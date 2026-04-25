import { motion } from "framer-motion";
import { Sparkles, GraduationCap, Heart } from "lucide-react";

const tiers = [
  {
    icon: Sparkles,
    amount: "$200 MXN",
    title: "Material de un taller",
    description: "Apoyas a un grupo de niños con los materiales necesarios para una sesión STEAM.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: GraduationCap,
    amount: "$500 MXN",
    title: "Beca un mes a un niño",
    description: "Patrocinas un mes completo de talleres STEAM para un niño o niña.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Heart,
    amount: "$1,500 MXN",
    title: "Beca un trimestre completo",
    description: "Cambias la vida de un niño con tres meses de aprendizaje STEAM continuo.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    featured: true,
  },
];

const Donations = () => {
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
          <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Becar a un niño STEAM</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Tu donativo abre <span className="text-accent">un futuro</span>
          </h2>
          <p className="text-lg text-foreground">
            Con tu apoyo financiamos materiales, talleres y becas para que más niñas y niños 
            descubran su pasión por la ciencia y el arte. Cada peso suma. Cada beca cambia una vida.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-3xl bg-card p-8 shadow-soft transition-all hover:shadow-medium hover:-translate-y-2 ${
                tier.featured ? "ring-2 ring-secondary/50" : ""
              }`}
            >
              <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${tier.bgColor} mb-6`}>
                <tier.icon className={`h-8 w-8 ${tier.color}`} />
              </div>
              
              <p className={`font-display text-4xl font-bold ${tier.color} mb-2`}>
                {tier.amount}
              </p>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {tier.title}
              </h3>
              <p className="text-muted-foreground">
                {tier.description}
              </p>
            </motion.div>
          ))}
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
              href="https://www.paypal.com/donate/?hosted_button_id=NUN5PLXX6JAUS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-accent hover:text-foreground text-white font-bold text-base px-10 py-6 rounded-full shadow-playful transition-all duration-300 hover:scale-105"
            >
              Donar ahora 💙
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Donations;