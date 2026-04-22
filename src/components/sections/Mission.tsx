import { motion } from "framer-motion";
import { Lightbulb, Heart, Users } from "lucide-react";

const items = [
  {
    icon: Lightbulb,
    title: "Despertar curiosidad",
    text: "Acercamos a niñas y niños a la ciencia, el arte y la tecnología desde la experiencia y el juego.",
    color: "text-secondary bg-secondary/10",
  },
  {
    icon: Users,
    title: "Reducir brechas",
    text: "Llevamos educación STEAM a comunidades donde la oportunidad es difícil de alcanzar.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Heart,
    title: "Formar talento",
    text: "Cultivamos pensamiento crítico, creatividad y trabajo en equipo: las habilidades del futuro.",
    color: "text-art bg-art/10",
  },
];

const Mission = () => {
  return (
    <section id="mision" className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Quiénes somos</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            Educación STEAM para <span className="text-gradient-warm">cada niña y niño</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Somos una iniciativa social que cree que toda infancia merece descubrir lo increíble que es crear, experimentar y soñar con ciencia.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-3xl bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-medium"
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${it.color}`}>
                <it.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-display text-2xl">{it.title}</h3>
              <p className="mt-3 text-muted-foreground">{it.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mission;
