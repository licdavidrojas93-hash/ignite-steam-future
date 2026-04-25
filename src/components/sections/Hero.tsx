import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-kids.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const Hero = () => {
  const c = useSiteContent("hero");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-hero-blue pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 bg-accent/15 blob animate-blob" />
      <div className="pointer-events-none absolute bottom-20 -right-40 h-[30rem] w-[30rem] bg-art/10 blob animate-blob" style={{ animationDelay: "3s" }} />

      <div className="container relative grid gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-bold text-primary shadow-soft">
            <Sparkles className="h-5 w-5 text-accent" /> {c.badge}
          </span>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.1] text-white md:text-6xl lg:text-7xl">
            {c.titlePart1}<span className="text-gradient-playful">{c.titleHighlight}</span>{c.titlePart2}
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/95 lg:mx-0 mx-auto font-medium">
            {c.description}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Button
              size="lg"
              className="bg-secondary hover:bg-accent hover:text-foreground text-white font-bold text-base px-8 py-6 rounded-full shadow-playful transition-all duration-300 hover:scale-105"
              onClick={() => scrollTo("donaciones")}
            >
              {c.ctaPrimary} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/95 hover:bg-accent border-2 border-white text-primary hover:text-foreground font-bold text-base px-8 py-6 rounded-full transition-all duration-300 hover:scale-105"
              onClick={() => scrollTo("programas")}
            >
              {c.ctaSecondary}
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl lg:max-w-none">
            <div className="flex flex-col items-center lg:items-start gap-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/90 shadow-lg">
                <Users className="h-6 w-6 text-foreground" />
              </div>
              <p className="font-display text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{c.stat1Number}</p>
              <p className="text-white/90 font-semibold text-sm text-center lg:text-left">{c.stat1Label}</p>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <p className="font-display text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{c.stat2Number}</p>
              <p className="text-white/90 font-semibold text-sm text-center lg:text-left">{c.stat2Label}</p>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <p className="font-display text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{c.stat3Number}</p>
              <p className="text-white/90 font-semibold text-sm text-center lg:text-left">{c.stat3Label}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-playful border-4 border-white/30">
            <img
              src={heroImg}
              alt="Niños y niñas felices haciendo experimentos STEAM"
              width={1600}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 hidden rounded-3xl bg-white p-5 shadow-playful md:block border-4 border-accent"
          >
            <p className="font-display text-4xl font-bold text-secondary">{c.badgeFloating1}</p>
            <p className="text-sm font-bold text-muted-foreground">{c.badgeFloating1Sub}</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 hidden rounded-full bg-accent p-6 shadow-playful md:block border-4 border-white"
          >
            <span className="font-display text-4xl">🚀</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
