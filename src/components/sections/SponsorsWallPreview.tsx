import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { useSponsorsWall } from "./SponsorsWall";

const SponsorsWallPreview = () => {
  const { rows, loading } = useSponsorsWall();

  return (
    <section className="py-14 bg-muted/20">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
              <Sparkles className="h-3.5 w-3.5" /> IMPULSA
            </span>
            <h3 className="mt-3 font-display text-2xl md:text-3xl font-bold">
              Muro de patrocinadores
            </h3>
            <p className="mt-2 text-muted-foreground">
              Aquí celebramos a quienes hacen posible IMPULSA por Niñ@s STEAM.
            </p>
          </div>
          <Link
            to="/impulsa#muro"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Ver muro completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <p className="mt-8 text-center text-muted-foreground">Cargando muro...</p>
        ) : rows.length === 0 ? (
          <div className="mt-8 rounded-3xl border-2 border-dashed border-border bg-card/60 p-10 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-secondary" />
            <p className="mt-3 font-display text-lg font-bold text-foreground">
              Este espacio es para ti
            </p>
            <p className="mt-2 text-muted-foreground">
              Muy pronto aparecerán aquí las personas, familias, empresas e instituciones que se sumen a IMPULSA.
            </p>
            <Link
              to="/impulsa#patrocinar"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 font-bold text-white shadow-playful transition hover:scale-105 hover:bg-accent hover:text-foreground"
            >
              Sé el primero en sumarte <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden">
            <div className="flex animate-[ticker_40s_linear_infinite] gap-4">
              {[...rows, ...rows].map((r, i) => (
                <div
                  key={`${r.id}-${i}`}
                  className="flex shrink-0 items-center gap-3 rounded-full bg-card px-5 py-3 shadow-soft ring-1 ring-border"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-semibold text-foreground whitespace-nowrap">
                    {r.public_display_name}
                  </span>
                  {r.sponsor_type && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      · {r.sponsor_type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};


export default SponsorsWallPreview;
