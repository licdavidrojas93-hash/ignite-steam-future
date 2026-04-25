import { motion } from "framer-motion";
import { Users, Heart } from "lucide-react";
import nitziaPhoto from "@/assets/team/nitzia-gradias.jpg";
import inspirador1 from "@/assets/team/inspirador-1.jpg";
import inspirador2 from "@/assets/team/inspirador-2.jpg";
import inspirador3 from "@/assets/team/inspirador-3.jpg";
import inspirador4 from "@/assets/team/inspirador-4.jpg";
import inspirador5 from "@/assets/team/inspirador-5.jpg";
import inspirador6 from "@/assets/team/inspirador-6.jpg";

const Team = () => {
  const inspiradores = [
    { name: "Inspirador 1", role: "Maestro STEAM", photo: inspirador1 },
    { name: "Inspirador 2", role: "Maestro STEAM", photo: inspirador2 },
    { name: "Inspirador 3", role: "Maestro STEAM", photo: inspirador3 },
    { name: "Inspirador 4", role: "Maestro STEAM", photo: inspirador4 },
    { name: "Inspirador 5", role: "Maestro STEAM", photo: inspirador5 },
    { name: "Inspirador 6", role: "Maestro STEAM", photo: inspirador6 },
  ];

  return (
    <section id="quienes-somos" className="py-16 md:py-20">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-secondary" />
            <p className="text-sm font-bold uppercase tracking-widest text-secondary">Nuestro equipo</p>
          </div>
          <h2 className="font-display text-4xl md:text-5xl">
            Quiénes <span className="text-gradient-warm">somos</span>
          </h2>
        </motion.div>

        {/* Fundadora */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-8 md:p-12 border border-primary/20"
        >
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="order-2 md:order-1">
              <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Fundadora</p>
              <h3 className="font-display text-3xl md:text-4xl mb-4">Nitzía Gradias</h3>
              <p className="text-muted-foreground mb-6">
                Nitzía es una apasionada educadora con más de X años de experiencia en educación STEAM. 
                Fundó Niños STEAM con la visión de democratizar el acceso a la ciencia y tecnología 
                para todos los niños y niñas, sin importar su origen socioeconómico.
              </p>
              <p className="text-muted-foreground">
                Su compromiso con la educación inclusiva y de calidad ha llevado a Niños STEAM a impactar 
                la vida de cientos de niños en toda la región.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-2xl rounded-full" />
                <div className="relative overflow-hidden rounded-3xl shadow-medium aspect-square">
                  <img
                    src={nitziaPhoto}
                    alt="Nitzía Gradias - Fundadora"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Inspiradores */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Users className="h-5 w-5 text-primary" />
              <p className="text-sm font-bold uppercase tracking-widest text-primary">Nuestro motor</p>
            </div>
            <h3 className="font-display text-3xl md:text-4xl">
              Los <span className="text-gradient-warm">Inspiradores</span>
            </h3>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Nuestros maestros STEAM son profesionales dedicados que transforman la curiosidad 
              en conocimiento, guiando a cada niño en su viaje de aprendizaje.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inspiradores.map((person, idx) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group rounded-2xl bg-card p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-square mb-4">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h4 className="font-display text-xl font-bold">{person.name}</h4>
                <p className="text-sm text-primary">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
