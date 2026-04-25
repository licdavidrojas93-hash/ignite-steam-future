import { Instagram, Facebook, Mail, Globe, Phone, MapPin, MessageCircle } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const Footer = () => {
  const c = useSiteContent("footer");

  return (
    <footer id="contacto" className="bg-navy text-white relative overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 bg-secondary/10 blob animate-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 bg-accent/10 blob animate-blob" style={{ animationDelay: "3s" }} />

      <div className="container py-16 relative">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-display text-3xl font-bold">
              Niños <span className="text-accent">STEAM</span>
            </p>
            <p className="mt-3 text-sm text-white/80">{c.brandTagline}</p>
          </div>

          <div>
            <p className="font-display text-lg font-bold text-accent">{c.socialTitle}</p>
            <div className="mt-4 flex gap-3">
              {c.instagramUrl && (
                <a
                  href={c.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-secondary hover:scale-110"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {c.facebookUrl && (
                <a
                  href={c.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-accent hover:text-foreground hover:scale-110"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {c.whatsappUrl && (
                <a
                  href={c.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-secondary hover:scale-110"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
            </div>
            {c.socialHandle && <p className="mt-6 text-xs text-white/70">{c.socialHandle}</p>}
          </div>

          <div>
            <p className="font-display text-lg font-bold text-accent">{c.contactTitle}</p>
            <ul className="mt-4 space-y-3 text-sm text-white/90">
              {c.email && (
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <a href={`mailto:${c.email}`} className="hover:text-accent transition break-all">
                    {c.email}
                  </a>
                </li>
              )}
              {c.phone && (
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:text-accent transition">
                    {c.phone}
                  </a>
                </li>
              )}
              {c.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <span>{c.address}</span>
                </li>
              )}
              {c.website && (
                <li className="flex items-start gap-2">
                  <Globe className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <span>{c.website}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/70 md:flex-row">
          <p>© {new Date().getFullYear()} {c.copyright}</p>
          <a href="/admin/login" className="hover:text-accent transition">Admin</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
