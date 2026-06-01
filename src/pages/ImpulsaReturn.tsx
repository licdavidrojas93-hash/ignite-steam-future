import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, AlertTriangle, MessageCircle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useImpulsaContact } from "@/hooks/useImpulsa";

type Variant = "success" | "pending" | "error";

const VARIANTS: Record<Variant, {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  defaultTitle: string;
  defaultBody: string;
  contentKey: "impulsa_return_success" | "impulsa_return_pending" | "impulsa_return_error";
}> = {
  success: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    defaultTitle: "¡Gracias por abrir una oportunidad!",
    defaultBody:
      "Estamos confirmando tu pago y te enviaremos un correo cuando quede registrado.",
    contentKey: "impulsa_return_success",
  },
  pending: {
    icon: Clock,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    defaultTitle: "Tu pago está pendiente",
    defaultBody: "Tu pago está pendiente de confirmación. Te avisaremos cuando se confirme.",
    contentKey: "impulsa_return_pending",
  },
  error: {
    icon: AlertTriangle,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    defaultTitle: "No pudimos confirmar el pago",
    defaultBody:
      "Puedes intentar nuevamente o contactarnos por WhatsApp para ayudarte a completar tu patrocinio.",
    contentKey: "impulsa_return_error",
  },
};

const ImpulsaReturn = ({ variant }: { variant: Variant }) => {
  const v = VARIANTS[variant];
  const Icon = v.icon;
  const [params] = useSearchParams();
  const content = useSiteContent(v.contentKey as any) as any;
  const contact = useImpulsaContact();

  const title = content?.title || v.defaultTitle;
  const body = content?.body || v.defaultBody;
  const waDigits = (contact?.whatsapp_number || "").replace(/\D/g, "");
  const whatsappLink = waDigits
    ? `https://wa.me/${waDigits.startsWith("52") ? waDigits : `52${waDigits}`}`
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-2xl">
          <div className="rounded-3xl bg-card p-10 md:p-12 shadow-medium text-center">
            <div className={`mx-auto grid h-20 w-20 place-items-center rounded-full ${v.iconBg}`}>
              <Icon className={`h-10 w-10 ${v.iconColor}`} />
            </div>
            <h1 className="mt-6 font-display text-3xl md:text-4xl font-bold">{title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{body}</p>

            {params.get("payment_id") && (
              <p className="mt-4 text-xs text-muted-foreground">
                Referencia: <code>{params.get("payment_id")}</code>
              </p>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="hero">
                <Link to="/impulsa">
                  <ArrowLeft className="h-4 w-4" /> Volver a IMPULSA
                </Link>
              </Button>
              {whatsappLink && (
                <Button asChild variant="outline">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" /> Contactar por WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ImpulsaReturn;
