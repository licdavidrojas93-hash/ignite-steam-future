import { motion } from "framer-motion";
import { Lightbulb, Microscope, Cpu, Palette, Calculator } from "lucide-react";

const steamElements = [
  {
    icon: Microscope,
    letter: "S",
    title: "Ciencia",
    description: "Exploramos fenómenos naturales a través del método científico y la experimentación.",
  },
  {
    icon: Cpu,
    letter: "T",
    title: "Tecnología",
    description: "Aprendemos a usar herramientas digitales y programación para resolver problemas.",
  },
  {
    icon: Lightbulb,
    letter: "E",
    title: "Ingeniería",
    description: "Diseñamos y construimos soluciones creativas usando lógica y razonamiento.",
  },
  {
    icon: Palette,
    letter: "A",
    title: "Arte",
    description: "Expresamos ideas y emociones, integrando creatividad con todas las disciplinas.",
  },
  {
    icon: Calculator,
    letter: "M",
    title: "Matemáticas",
    description: "Usamos números y conceptos para entender patrones en la naturaleza.",
  },
];

const WhatIsSteam = () => {
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
          <p className="text-sm font-bold uppercase tracking-widest text-secondary">Educación integral</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            ¿Qué es <span className="text-gradient-warm">STEAM</span>?
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            STEAM es un enfoque educativo que integra ciencia, tecnología, ingeniería, arte y matemáticas. 
            Estas disciplinas no trabajan solas: juntas crean pensadores críticos y creativos.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {steamElements.map((item, i) => (
            <motion.div
              key={item.letter}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-2xl bg-card p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-warm/10 group-hover:bg-gradient-warm/20 transition">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="font-display text-3xl font-bold text-secondary/30 group-hover:text-secondary/50">
                  {item.letter}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 p-8 md:p-12 border border-primary/20"
        >
          <h3 className="font-display text-2xl md:text-3xl mb-4">
            ¿Por qué STEAM importa?
          </h3>
          <p className="text-muted-foreground mb-6">
            En un mundo que cambia rápidamente, los niños y niñas necesitan más que solo memorizar información. 
            Necesitan aprender a pensar, crear, colaborar y resolver problemas del mundo real. 
            STEAM desarrolla estas habilidades desde la curiosidad y el juego.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="font-bold text-primary">✓</span>
              <span>Fomenta el pensamiento crítico y la resolución de problemas</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-secondary">✓</span>
              <span>Estimula la creatividad e innovación</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">✓</span>
              <span>Prepara para carreras del futuro</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-secondary">✓</span>
              <span>Promueve el trabajo en equipo y la comunicación</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatIsSteam;