import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Rocket,
  HeartHandshake,
  Microscope,
  Users,
  ArrowRight,
  Target,
  CheckCircle2,
  Eye,
  Camera,
  Handshake,
  Award,
  MessageCircle,
  Globe,
  Mail,
  Instagram,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ImpulsaSponsorForm from "@/components/sections/ImpulsaSponsorForm";
import SponsorsWall from "@/components/sections/SponsorsWall";
import ImpactSection from "@/components/sections/ImpactSection";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useImpulsaContact } from "@/hooks/useImpulsa";

const Impulsa = () => {
  const c = useSiteContent("impulsa_page");
  const dbContact = useImpulsaContact();

  const contactWhatsapp = dbContact?.whatsapp_number || c.contactWhatsapp;
  const contactEmail = dbContact?.contact_email || c.contactEmail;
  const contactInstagram = dbContact?.instagram_url || c.contactInstagram;
  const contactWebsite = dbContact?.website_url || c.contactWebsite;
  const waDigits = contactWhatsapp.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${waDigits.startsWith("52") ? waDigits : `52${waDigits}`}${
    dbContact?.whatsapp_message ? `?text=${encodeURIComponent(dbContact.whatsapp_message)}` : ""
  }`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-4xl text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" /> IMPULSA por Niñ@s STEAM
              </span>
              <h1 className="mt-6 font-display text-4xl md:text-6xl font-bold leading-tight text-foreground">
                {c.heroTitle}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground">{c.heroSubtitle}</p>
              <p className="mt-4 text-base text-muted-foreground/80">{c.heroExtra}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href="#patrocinar"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-4 font-bold text-white shadow-playful transition hover:scale-105 hover:bg-accent hover:text-foreground"
                >
                  {c.heroPrimaryCta} <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#transparencia"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-7 py-4 font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
                >
                  {c.heroSecondaryCta}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* QUÉ ES */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {c.whatTitle}
              </h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                {c.whatText}
              </p>

              <div className="mt-10 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:p-10 ring-1 ring-primary/20">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">{c.missionTitle}</h3>
                </div>
                <p className="mt-4 text-foreground">{c.missionText}</p>
              </div>
            </div>
          </div>
        </section>

        {/* META */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Target className="mx-auto h-10 w-10 text-secondary" />
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">{c.goalTitle}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{c.goalText}</p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {c.goalStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl bg-card p-6 text-center shadow-soft"
                >
                  <p className="font-display text-4xl font-bold text-primary">{s.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>

            <p className="mt-8 text-center text-muted-foreground">{c.goalExtra}</p>
          </div>
        </section>

        {/* STEAM DAY */}
        <section className="py-20">
          <div className="container max-w-5xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold">{c.steamDayTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{c.steamDayText}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {c.steamDayItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-soft"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* BENEFICIARIOS */}
        <section className="py-16 bg-gradient-to-br from-accent/10 to-primary/5">
          <div className="container max-w-4xl">
            <div className="flex items-start gap-4">
              <Users className="h-10 w-10 shrink-0 text-accent" />
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold">
                  {c.beneficiariesTitle}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">{c.beneficiariesText}</p>
              </div>
            </div>
          </div>
        </section>

        {/* MODALIDADES */}
        <section id="patrocinar" className="py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold">{c.tiersTitle}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{c.tiersText}</p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {c.tiers.map((t, i) => {
                const Icon = [Microscope, HeartHandshake, Sparkles][i % 3];
                const featured = i === 1;
                return (
                  <motion.div
                    key={t.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative rounded-3xl bg-card p-8 shadow-soft transition hover:-translate-y-2 hover:shadow-medium ${
                      featured ? "ring-2 ring-secondary" : ""
                    }`}
                  >
                    {featured && (
                      <span className="absolute -top-3 right-6 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white">
                        Popular
                      </span>
                    )}
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold">{t.title}</h3>
                    <p className="mt-3 font-display text-4xl font-bold text-secondary">
                      {t.price}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                      {t.cta} <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            <p className="mt-8 text-center text-muted-foreground">{c.tiersExtra}</p>
          </div>
        </section>

        {/* FORMULARIO DE PATROCINIO */}
        <ImpulsaSponsorForm />

        {/* MURO DE PATROCINADORES */}
        <SponsorsWall />

        {/* TRANSPARENCIA E IMPACTO (DINÁMICO) */}
        <ImpactSection />




        {/* ENABLES */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-4xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold">{c.enablesTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{c.enablesText}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {c.enablesChips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-soft ring-1 ring-border"
                >
                  <Sparkles className="h-3.5 w-3.5 text-accent" /> {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* USO DEL RECURSO */}
        <section className="py-20">
          <div className="container max-w-4xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold">{c.useTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{c.useText}</p>
            <ul className="mt-8 space-y-3">
              {c.useItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* TRANSPARENCIA */}
        <section
          id="transparencia"
          className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10"
        >
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Eye className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">
                {c.transparencyTitle}
              </h2>
              <p className="mt-4 text-lg font-semibold text-foreground">
                {c.transparencySubtitle}
              </p>
              <p className="mt-3 text-muted-foreground">{c.transparencyText}</p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {c.transparencyCards.map((card, i) => {
                const Icon = [Eye, Camera, Handshake][i % 3];
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-3xl bg-card p-7 shadow-soft"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold">{card.title}</h3>
                    <ul className="mt-4 space-y-2">
                      {card.items.map((it) => (
                        <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-card/70 p-6 text-center text-muted-foreground backdrop-blur ring-1 ring-border">
              {c.transparencyFinal}
            </div>
          </div>
        </section>

        {/* RECONOCIMIENTO */}
        <section className="py-20">
          <div className="container max-w-4xl text-center">
            <Award className="mx-auto h-10 w-10 text-accent" />
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">
              {c.recognitionTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {c.recognitionText}
            </p>
            <a
              href={c.recognitionWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-bold text-foreground shadow-playful transition hover:scale-105"
            >
              <Handshake className="h-5 w-5" /> {c.recognitionCta}
            </a>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
          <div className="container max-w-4xl text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
              {c.finalTitle}
            </h2>
            <p className="mt-5 text-lg opacity-90">{c.finalSubtitle}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="#patrocinar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-primary transition hover:scale-105"
              >
                {c.finalPrimaryCta} <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/70 px-7 py-4 font-bold transition hover:bg-white/10"
              >
                <MessageCircle className="h-5 w-5" /> {c.finalWhatsappCta}
              </a>
            </div>

            <div className="mt-10 grid gap-3 text-sm opacity-90 sm:grid-cols-2">
              <a
                href={contactWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 hover:underline"
              >
                <Globe className="h-4 w-4" /> {contactWebsite}
              </a>
              {contactInstagram && (
                <a
                  href={contactInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 hover:underline"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              )}
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center justify-center gap-2 hover:underline"
              >
                <Mail className="h-4 w-4" /> {contactEmail}
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 hover:underline"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp: {contactWhatsapp}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Impulsa;

