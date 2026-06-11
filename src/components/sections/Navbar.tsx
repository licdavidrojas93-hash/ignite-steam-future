import { useState } from "react";
import { Menu, X, Home } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoSteam from "@/assets/logo-steam.png";
import { useSiteContent } from "@/hooks/useSiteContent";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const c = useSiteContent("navbar");
  const location = useLocation();
  const navigate = useNavigate();
  const isImpulsa = location.pathname.startsWith("/impulsa");

  const links = [
    { href: "#que-es-steam", label: "¿Qué es STEAM?" },
    { href: "#mision", label: "Misión" },
    { href: "#quienes-somos", label: "Quiénes Somos" },
    { href: "#programas", label: "Programas" },
    { href: "#colaboradores", label: "Colaboradores" },
    { href: "#impulsa", label: "IMPULSA" },
    { href: "#blog", label: "Blog" },
    { href: "#contacto", label: "Contacto" },
  ];

  const handleNav = (href: string) => {
    setOpen(false);
    const id = href.replace("#", "");
    // IMPULSA siempre va a la página /impulsa desde el inicio (top)
    if (id === "impulsa") {
      navigate("/impulsa");
      return;
    }
    if (location.pathname !== "/") {
      navigate(`/${href}`);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const ctaIsInternal = c.ctaUrl.startsWith("/") || c.ctaUrl.startsWith("#");

  const renderCta = (extraClass = "") => {
    const className = `bg-secondary hover:bg-accent hover:text-foreground text-white font-bold px-6 py-3 rounded-full shadow-playful transition-all duration-300 hover:scale-105 ${extraClass}`;
    if (ctaIsInternal) {
      return (
        <Button className={className} size="sm" asChild>
          <Link to={c.ctaUrl} onClick={() => setOpen(false)}>{c.ctaText}</Link>
        </Button>
      );
    }
    return (
      <Button className={className} size="sm" asChild>
        <a href={c.ctaUrl} target="_blank" rel="noopener noreferrer">
          {c.ctaText}
        </a>
      </Button>
    );
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy backdrop-blur-xl shadow-medium">
      <div className="container flex h-24 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0 transition-transform hover:scale-105">
          <img
            src={logoSteam}
            alt="Niños STEAM"
            className="h-16 md:h-20 w-auto drop-shadow-lg"
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {isImpulsa && (
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-white/90 transition hover:text-accent hover:scale-105"
            >
              <Home className="h-4 w-4" /> Inicio
            </Link>
          )}
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNav(l.href)}
              className="text-sm font-bold text-white/90 transition hover:text-accent hover:scale-105"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:inline-flex">{renderCta()}</div>

        <button
          className="lg:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-navy lg:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {isImpulsa && (
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-bold text-white hover:bg-white/10 transition"
              >
                <Home className="h-4 w-4" /> Inicio
              </Link>
            )}
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => handleNav(l.href)}
                className="rounded-xl px-4 py-3 text-left text-sm font-bold text-white hover:bg-white/10 transition"
              >
                {l.label}
              </button>
            ))}
            <div className="mt-3">{renderCta("w-full")}</div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
