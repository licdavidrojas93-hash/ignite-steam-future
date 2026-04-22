import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#mision", label: "Misión" },
    { href: "#programas", label: "Programas" },
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <a href="#" className="font-display text-2xl font-bold">
          Niños <span className="text-gradient-warm">STEAM</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNav(l.href)}
              className="text-sm font-medium text-foreground/80 transition hover:text-primary"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <Button
          variant="hero"
          size="sm"
          className="hidden md:inline-flex"
          onClick={() => handleNav("#donaciones")}
        >
          Donar ahora
        </Button>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => handleNav(l.href)}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-muted"
              >
                {l.label}
              </button>
            ))}
            <Button variant="hero" className="mt-2" onClick={() => handleNav("#donaciones")}>
              Donar ahora
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
