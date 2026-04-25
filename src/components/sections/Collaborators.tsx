import { motion } from "framer-motion";
import { Users } from "lucide-react";

const clients = [
  {
    category: "Colegios",
    icon: "🏫",
    organizations: [
      "Colegio Marista",
      "Escuela Primaria Benito Juárez",
      "Instituto Tecnológico",
      "Colegio Independencia",
    ],
  },
  {
    category: "Empresas",
    icon: "🏢",
    organizations: [
      "Sonora Tech Solutions",
      "Desarrollo Integral Hermosillo",
      "Innovación Empresarial SA",
      "Industria Local 2024",
    ],
  },
  {
    category: "Instituciones",
    icon: "🏛️",
    organizations: [
      "Ayuntamiento de Hermosillo",
      "IMEC (Instituto Mexicano de Educación en Ciencia)",
      "Secretaría de Educación Estatal",
      "Comisión de Ciencia",
    ],
  },
];

const Collaborators = () => {
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
            <p className="text-sm font-bold uppercase tracking-widest text-secondary">Nuestros aliados</p>
          </div>
          <h2 className="font-display text-4xl md:text-5xl">
            Quiénes han <span className="text-gradient-warm">confiado en nosotros</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Trabajamos con instituciones, empresas y gobiernos que comparten nuestra visión de 
            una educación accesible, integral y transformadora para todos los niños y niñas.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {clients.map((group, groupIdx) => (
            <motion.div
              key={group.category}
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
                    key={org}
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
          <h3 className="font-display text-2xl md:text-3xl mb-4">
            ¿Tu institución también quiere colaborar?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Creemos en la fuerza de la colaboración. Si compartes nuestra misión de llevar educación 
            STEAM a más niños y niñas, nos encantaría trabajar contigo.
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-warm text-white font-semibold hover:shadow-lg transition transform hover:scale-105"
          >
            Contáctanos
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Collaborators;