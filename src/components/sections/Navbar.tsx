import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSteam from "@/assets/logo-steam.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#que-es-steam", label: "¿Qué es STEAM?" },
    { href: "#mision", label: "Misión" },
    { href: "#quienes-somos", label: "Quiénes Somos" },
    { href: "#programas", label: "Programas" },
    { href: "#colaboradores", label: "Colaboradores" },
    { href: "#donaciones", label: "Donar" },
    { href: "#blog", label: "Blog" },
    { href: "#contacto", label: "Contacto" },
  ];

  const handleNav = (href: string) => {
    setOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy backdrop-blur-xl shadow-medium">
      <div className="container flex h-24 items-center justify-between">
        <a href="#" className="flex items-center gap-2 shrink-0 transition-transform hover:scale-105">
          <img 
            src={logoSteam} 
            alt="Niños STEAM" 
            className="h-16 md:h-20 w-auto drop-shadow-lg"
          />
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
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

        <Button
          className="hidden md:inline-flex bg-secondary hover:bg-accent hover:text-foreground text-white font-bold px-6 py-3 rounded-full shadow-playful transition-all duration-300 hover:scale-105"
          size="sm"
          asChild
        >
          <a href="https://www.paypal.com/donate/?hosted_button_id=NUN5PLXX6JAUS" target="_blank" rel="noopener noreferrer">
            Donar ahora
          </a>
        </Button>

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
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => handleNav(l.href)}
                className="rounded-xl px-4 py-3 text-left text-sm font-bold text-white hover:bg-white/10 transition"
              >
                {l.label}
              </button>
            ))}
            <Button
              className="mt-3 bg-secondary hover:bg-accent hover:text-foreground text-white font-bold rounded-full"
              asChild
            >
              <a href="https://www.paypal.com/donate/?hosted_button_id=NUN5PLXX6JAUS" target="_blank" rel="noopener noreferrer">
                Donar ahora
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;