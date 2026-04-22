import { motion } from "framer-motion";
import { Heart, GraduationCap, Sparkles } from "lucide-react";

/**
 * Sección de Donaciones.
 *
 * 👉 Para integrar tu botón de pago (PayPal, Mercado Pago, Stripe, Conekta, etc.):
 * Reemplaza el contenido del div con id="donation-button-slot" más abajo
 * con el código HTML/JS que te entregue tu proveedor de pagos.
 */

const Donations = () => {
  return (
    <section id="donaciones" className="relative overflow-hidden py-20 md:py-28">
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-95" />
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 bg-accent/30 blob animate-blob" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 bg-secondary/30 blob animate-blob" style={{ animationDelay: "3s" }} />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center text-primary-foreground">
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full bg-card/20 px-4 py-2 text-sm font-semibold backdrop-blur"
          >
            <Heart className="h-4 w-4 fill-current" /> Becar a un niño STEAM
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-5 font-display text-4xl md:text-6xl"
          >
            Tu donativo abre <span className="text-accent">un futuro</span>
          </motion.h2>

          <p className="mt-6 text-lg opacity-95">
            Con tu apoyo financiamos materiales, talleres y becas para que más niñas y niños descubran su pasión por la ciencia y el arte. Cada peso suma. Cada beca cambia una vida.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: Sparkles, title: "$200 MXN", text: "Material de un taller" },
              { icon: GraduationCap, title: "$500 MXN", text: "Beca un mes a un niño" },
              { icon: Heart, title: "$1,500 MXN", text: "Beca un trimestre completo" },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl bg-card/15 p-6 backdrop-blur-md ring-1 ring-card/30"
              >
                <c.icon className="mx-auto h-7 w-7 text-accent" />
                <p className="mt-3 font-display text-3xl font-bold">{c.title}</p>
                <p className="text-sm opacity-90">{c.text}</p>
              </motion.div>
            ))}
          </div>

          {/* === BOTÓN DE PAGO ===
              Reemplaza el contenido de este bloque con tu propio código HTML.
              Por ejemplo:
              <form action="https://www.paypal.com/donate" method="post" target="_top">
                <input type="hidden" name="business" value="TU_CORREO" />
                ...
              </form>
          */}
          <div className="mt-12 flex flex-col items-center">
            <div
              id="donation-button-slot"
              className="rounded-2xl bg-card p-8 text-card-foreground shadow-medium"
            >
              <p className="font-display text-xl font-bold">Aquí va tu botón de donación</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Reemplaza el contenido de <code className="rounded bg-muted px-1.5 py-0.5 text-xs">#donation-button-slot</code> en{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Donations.tsx</code> con tu código HTML de pago.
              </p>
            </div>
            <p className="mt-6 text-sm opacity-80">
              ¿Quieres donar otra cantidad o aliarte como empresa? Escríbenos a{" "}
              <a href="mailto:contacto@ninos-steam.org" className="underline">contacto@ninos-steam.org</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donations;
