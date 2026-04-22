import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-kids.jpg";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-soft pt-28 pb-20 md:pt-36 md:pb-32">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 bg-primary/20 blob animate-blob" />
      <div className="pointer-events-none absolute top-40 -right-20 h-80 w-80 bg-secondary/20 blob animate-blob" style={{ animationDelay: "2s" }} />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 bg-accent/30 blob animate-blob" style={{ animationDelay: "4s" }} />

      <div className="container relative grid gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-semibold text-primary shadow-soft">
            <Sparkles className="h-4 w-4" /> Educación STEAM gratuita en Hermosillo
          </span>

          <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
            Despertamos la <span className="text-gradient-warm">curiosidad</span> de los niños del mañana.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground lg:mx-0 mx-auto">
            En Niños STEAM acercamos ciencia, tecnología, ingeniería, arte y matemáticas a niñas y niños en escuelas, empresas y espacios públicos. Aprender jugando, crear soñando.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Button size="lg" variant="hero" onClick={() => scrollTo("donaciones")}>
              Becar a un niño STEAM <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollTo("programas")}>
              Conoce nuestros programas
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground lg:justify-start">
            <div>
              <p className="font-display text-2xl font-bold text-foreground">500+</p>
              <p>niños impactados</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">20+</p>
              <p>colonias y espacios</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">100%</p>
              <p>gratuito</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-hero opacity-30 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-medium">
            <img
              src={heroImg}
              alt="Niños y niñas felices haciendo experimentos STEAM"
              width={1600}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-card p-4 shadow-medium md:block"
          >
            <p className="font-display text-3xl font-bold text-secondary">¡Ciencia!</p>
            <p className="text-xs text-muted-foreground">para todas y todos</p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-4 -right-4 hidden rounded-full bg-accent p-5 shadow-warm md:block"
          >
            <span className="font-display text-2xl font-bold">🚀</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
