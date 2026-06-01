import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Loader2, Send, CreditCard, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useImpulsaTiers, type ImpulsaTier } from "@/hooks/useImpulsa";
import { useImpulsaFormFields, fieldByKey } from "@/hooks/useImpulsaForm";

const OTHER_KEY = "__other__";
const IN_KIND_KEY = "__in_kind__";

const schema = z.object({
  sponsor_name: z.string().trim().min(2, "Indica un nombre").max(120),
  email: z.string().trim().email("Correo inválido").max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
  city: z.string().trim().max(80).optional(),
  state: z.string().trim().max(80).optional(),
  public_display_name: z.string().trim().max(120).optional(),
  message: z.string().trim().max(800).optional(),
  in_kind_description: z.string().trim().max(800).optional(),
});

const ImpulsaSponsorForm = () => {
  const tiers = useImpulsaTiers(true) ?? [];
  const { data: fields } = useImpulsaFormFields(true);

  const [selectedTier, setSelectedTier] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorType, setSponsorType] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [wallOptIn, setWallOptIn] = useState(false);
  const [publicName, setPublicName] = useState("");
  const [message, setMessage] = useState("");
  const [inKindDesc, setInKindDesc] = useState("");
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | "money" | "in_kind">(null);

  const currentTier: ImpulsaTier | undefined = useMemo(
    () => tiers.find((t) => t.tier_key === selectedTier),
    [tiers, selectedTier],
  );
  const isOther = selectedTier === OTHER_KEY;
  const isInKind = selectedTier === IN_KIND_KEY;

  // Pre-fill amount from tier
  useEffect(() => {
    if (currentTier) setAmount(String(currentTier.amount ?? ""));
    else if (isInKind) setAmount("");
    else if (isOther) setAmount("");
  }, [currentTier, isOther, isInKind]);

  // Listen for tier selection from cards (custom event)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ tier_key?: string }>).detail;
      if (detail?.tier_key) {
        setSelectedTier(detail.tier_key);
        document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("impulsa:select-tier", handler);
    return () => window.removeEventListener("impulsa:select-tier", handler);
  }, []);

  // Helpers to read editable field config (with fallbacks)
  const fcfg = (key: string, fallbackLabel: string) =>
    fieldByKey(fields, key) ?? ({
      label: fallbackLabel,
      placeholder: null,
      helper_text: null,
      is_required: false,
      is_active: true,
    } as any);

  const sponsorTypeCfg = fcfg("sponsor_type", "Tipo de patrocinador");
  const sponsorTypeOptions: string[] = Array.isArray(sponsorTypeCfg?.options)
    ? (sponsorTypeCfg.options as string[])
    : ["Persona", "Familia", "Empresa", "Institución", "Organización", "Grupo de amigos", "Donador en especie"];

  const reset = () => {
    setSelectedTier("");
    setAmount("");
    setSponsorName("");
    setSponsorType("");
    setPhone("");
    setEmail("");
    setCity("");
    setStateField("");
    setWallOptIn(false);
    setPublicName("");
    setMessage("");
    setInKindDesc("");
    setTerms(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTier) return toast.error("Elige una modalidad de patrocinio.");
    if (!terms) return toast.error("Debes aceptar el aviso para continuar.");

    const parsed = schema.safeParse({
      sponsor_name: sponsorName,
      email,
      phone,
      city,
      state: stateField,
      public_display_name: publicName,
      message,
      in_kind_description: inKindDesc,
    });
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0]?.message ?? "Revisa los datos.");
    }

    let participation_type = "";
    let numericAmount: number | null = null;

    if (isInKind) {
      participation_type = "in_kind";
      if (!inKindDesc.trim()) return toast.error("Describe tu aportación en especie.");
    } else if (isOther) {
      participation_type = "other";
      const n = Number(amount);
      if (!n || n < 1) return toast.error("Indica un monto válido.");
      numericAmount = n;
    } else {
      participation_type = selectedTier;
      numericAmount = currentTier?.amount ?? Number(amount) ?? null;
    }

    const payment_status = isInKind ? "in_kind_pending" : "pending";

    setSubmitting(true);
    const payload = {
      sponsor_name: sponsorName.trim(),
      sponsor_type: sponsorType || null,
      phone: phone.trim() || null,
      email: email.trim() || null,
      city: city.trim() || null,
      state: stateField.trim() || null,
      participation_type,
      amount: numericAmount,
      currency: currentTier?.currency || "MXN",
      in_kind_description: isInKind ? inKindDesc.trim() : null,
      public_wall_opt_in: wallOptIn,
      public_display_name: wallOptIn ? (publicName.trim() || sponsorName.trim()) : null,
      message: message.trim() || null,
      terms_accepted: terms,
      payment_status,
    };

    const { error } = await (supabase as any).from("impulsa_sponsors").insert(payload);
    setSubmitting(false);
    if (error) return toast.error(error.message);

    setDone(isInKind ? "in_kind" : "money");
    reset();
  };

  const ctaMoney = "Continuar a pago";
  const ctaInKind = "Enviar información";

  if (done) {
    const isMoney = done === "money";
    return (
      <section id="formulario" className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container max-w-2xl">
          <div className="rounded-3xl bg-card p-10 shadow-medium text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mt-6 font-display text-2xl md:text-3xl font-bold">
              {isMoney ? "¡Gracias por sumarte!" : "¡Gracias por tu interés!"}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {isMoney
                ? "Tu registro fue creado correctamente. El pago se conectará en la siguiente etapa."
                : "Gracias por tu interés en aportar en especie. Nos pondremos en contacto contigo para coordinar los detalles."}
            </p>
            <Button className="mt-8" variant="hero" onClick={() => setDone(null)}>
              Registrar otro patrocinio
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="formulario"
      className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
    >
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Quiero patrocinar IMPULSA
          </h2>
          <p className="mt-3 text-muted-foreground">
            Completa este breve formulario para registrar tu aportación.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-card p-6 md:p-10 shadow-soft">
          {/* Modalidad — cards */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              {fcfg("modalidad", "Modalidad de patrocinio").label} <span className="text-destructive">*</span>
            </Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {tiers.map((t) => {
                const active = selectedTier === t.tier_key;
                return (
                  <button
                    type="button"
                    key={t.tier_key}
                    onClick={() => setSelectedTier(t.tier_key)}
                    className={`text-left rounded-2xl border-2 p-4 transition ${
                      active
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <p className="font-display text-base font-bold">{t.title}</p>
                    {t.amount ? (
                      <p className="mt-1 font-display text-xl font-bold text-secondary">
                        ${Number(t.amount).toLocaleString("es-MX")} {t.currency}
                      </p>
                    ) : null}
                    {t.description ? (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{t.description}</p>
                    ) : null}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setSelectedTier(OTHER_KEY)}
                className={`text-left rounded-2xl border-2 p-4 transition ${
                  isOther ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/40"
                }`}
              >
                <p className="font-display text-base font-bold">Otra aportación</p>
                <p className="mt-1 text-xs text-muted-foreground">Define el monto que prefieras.</p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTier(IN_KIND_KEY)}
                className={`text-left rounded-2xl border-2 p-4 transition ${
                  isInKind ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/40"
                }`}
              >
                <p className="font-display text-base font-bold">Donación en especie</p>
                <p className="mt-1 text-xs text-muted-foreground">Materiales, kits, mentoría, etc.</p>
              </button>
            </div>
          </div>

          {/* Monto */}
          {!isInKind && (
            <div className="space-y-2">
              <Label>
                {fcfg("monto", "Monto").label}
                {isOther && <span className="text-destructive"> *</span>}
              </Label>
              <Input
                type="number"
                min={1}
                value={amount}
                disabled={!isOther && !!currentTier}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
              {fcfg("monto", "").helper_text && (
                <p className="text-xs text-muted-foreground">{fcfg("monto", "").helper_text}</p>
              )}
            </div>
          )}

          {/* Donación en especie */}
          {isInKind && (
            <div className="space-y-2">
              <Label>
                {fcfg("in_kind_description", "Describe la aportación en especie").label}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={3}
                value={inKindDesc}
                onChange={(e) => setInKindDesc(e.target.value)}
                placeholder={
                  fcfg("in_kind_description", "").placeholder ||
                  "Ej. materiales, kits, transporte, refrigerios, equipo, mentoría, etc."
                }
              />
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>
                {fcfg("sponsor_name", "Nombre del patrocinador").label}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder={
                  fcfg("sponsor_name", "").placeholder ||
                  "Nombre de persona, familia, empresa o institución"
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{sponsorTypeCfg.label}</Label>
              <Select value={sponsorType} onValueChange={setSponsorType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  {sponsorTypeOptions.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{fcfg("phone", "Teléfono").label}</Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={fcfg("phone", "").placeholder || "662 000 0000"}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>
                {fcfg("email", "Correo electrónico").label}
                {fcfg("email", "").is_required && <span className="text-destructive"> *</span>}
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={fcfg("email", "").placeholder || "tu@correo.com"}
                required={fcfg("email", "").is_required}
              />
            </div>

            <div className="space-y-2">
              <Label>{fcfg("city", "Ciudad").label}</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={fcfg("city", "").placeholder || "Hermosillo"}
              />
            </div>

            <div className="space-y-2">
              <Label>{fcfg("state", "Estado").label}</Label>
              <Input
                value={stateField}
                onChange={(e) => setStateField(e.target.value)}
                placeholder={fcfg("state", "").placeholder || "Sonora"}
              />
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-muted/40 p-4">
            <Checkbox
              id="wall"
              checked={wallOptIn}
              onCheckedChange={(v) => setWallOptIn(Boolean(v))}
            />
            <Label htmlFor="wall" className="cursor-pointer text-sm leading-relaxed">
              {fcfg("public_wall_opt_in", "").helper_text ||
                "Autorizo que mi nombre, empresa o institución aparezca en el Muro de Patrocinadores de IMPULSA por Niñ@s STEAM."}
            </Label>
          </div>

          {wallOptIn && (
            <div className="space-y-2">
              <Label>{fcfg("public_display_name", "Nombre público para mostrar").label}</Label>
              <Input
                value={publicName}
                onChange={(e) => setPublicName(e.target.value)}
                placeholder={
                  fcfg("public_display_name", "").placeholder ||
                  "Ej. Familia López, RoacShop, Empresa Aliada, Anónimo"
                }
              />
              <p className="text-xs text-muted-foreground">
                {fcfg("public_display_name", "").helper_text ||
                  "Así aparecerás públicamente en el muro de patrocinadores."}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>{fcfg("message", "Mensaje opcional").label}</Label>
            <Textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                fcfg("message", "").placeholder ||
                "Puedes dejar un mensaje de apoyo para las niñas y niños participantes."
              }
            />
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-border p-4">
            <Checkbox
              id="terms"
              checked={terms}
              onCheckedChange={(v) => setTerms(Boolean(v))}
            />
            <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
              {fcfg("terms_accepted", "").helper_text ||
                "Confirmo que los datos proporcionados podrán ser utilizados para dar seguimiento a mi participación en IMPULSA por Niñ@s STEAM."}
              <span className="text-destructive"> *</span>
            </Label>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : isInKind ? (
              <>
                <Send className="h-4 w-4" /> {ctaInKind}
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" /> {ctaMoney}
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ImpulsaSponsorForm;
