import { Instagram, Facebook, Mail, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contacto" className="bg-navy text-white relative overflow-hidden">
      {/* Decorative blobs sutiles */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 bg-secondary/10 blob animate-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 bg-accent/10 blob animate-blob" style={{ animationDelay: "3s" }} />

      <div className="container py-16 relative">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-display text-3xl font-bold">
              Niños <span className="text-accent">STEAM</span>
            </p>
            <p className="mt-3 text-sm text-white/80">
              Educación en ciencia, tecnología, ingeniería, arte y matemáticas para niñas y niños en toda la región.
            </p>
          </div>

          <div>
            <p className="font-display text-lg font-bold text-accent">Síguenos</p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.instagram.com/ninos.steam/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-secondary hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/ninoss.steam/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-accent hover:text-foreground hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-6 text-xs text-white/70">@ninos.steam</p>
          </div>

          <div>
            <p className="font-display text-lg font-bold text-accent">Contacto</p>
            <ul className="mt-4 space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <a href="mailto:contacto@ninos-steam.org" className="hover:text-accent transition">
                  contacto@ninos-steam.org
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span>www.ninos-steam.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/70 md:flex-row">
          <p>© {new Date().getFullYear()} Niños STEAM. Todos los derechos reservados.</p>
          <a href="/admin/login" className="hover:text-accent transition">Admin</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;