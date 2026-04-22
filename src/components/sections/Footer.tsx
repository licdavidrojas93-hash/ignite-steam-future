import { Instagram, Facebook, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contacto" className="bg-foreground text-background">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-display text-3xl font-bold">
              Niños <span className="text-accent">STEAM</span>
            </p>
            <p className="mt-3 text-sm opacity-80">
              Educación en ciencia, tecnología, ingeniería, arte y matemáticas para niñas y niños de Hermosillo y más allá.
            </p>
          </div>

          <div>
            <p className="font-display text-lg font-bold">Síguenos</p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.instagram.com/ninos.steam/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-background/10 transition hover:bg-art hover:text-art-foreground"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/ninoss.steam/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-background/10 transition hover:bg-primary"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-6 text-xs opacity-70">@ninos.steam</p>
          </div>

          <div>
            <p className="font-display text-lg font-bold">Contacto</p>
            <ul className="mt-4 space-y-3 text-sm opacity-90">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <a href="mailto:contacto@ninos-steam.org" className="hover:underline">
                  contacto@ninos-steam.org
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                Hermosillo, Sonora, México
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-background/10 pt-6 text-xs opacity-70 md:flex-row">
          <p>© {new Date().getFullYear()} Niños STEAM. Todos los derechos reservados.</p>
          <a href="/admin/login" className="hover:underline">Admin</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
