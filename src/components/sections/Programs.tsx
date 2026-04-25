import { motion } from "framer-motion";
import schools from "@/assets/program-schools.jpg";
import companies from "@/assets/program-companies.jpg";
import community from "@/assets/program-community.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const FALLBACK_IMAGES = [schools, companies, community];

const Programs = () => {
  const c = useSiteContent("programs");

  return (
    <section id="programas" className="bg-gradient-soft py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-secondary">{c.eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            {c.title}<span className="text-gradient-warm">{c.titleHighlight}</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">{c.description}</p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {c.programs.map((p, i) => (
            <motion.article
              key={`${p.title}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group overflow-hidden rounded-3xl bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-medium"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                  alt={p.title}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-7">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">{p.tag}</span>
                <h3 className="mt-2 font-display text-2xl">{p.title}</h3>
                <p className="mt-3 text-muted-foreground">{p.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
