import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import SectionEditor from "./SectionEditor";
import ImageUploader from "./ImageUploader";

// Bloque reutilizable: label + input
const Field = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input {...props} />
  </div>
);
const Area = ({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Textarea rows={3} {...props} />
  </div>
);

const SECTIONS = [
  { key: "hero", label: "Hero" },
  { key: "what_is_steam", label: "Qué es STEAM" },
  { key: "mission", label: "Misión" },
  { key: "team", label: "Equipo" },
  { key: "programs", label: "Programas" },
  { key: "collaborators", label: "Colaboradores" },
  { key: "donations", label: "Donaciones" },
  { key: "impulsa_landing", label: "IMPULSA (landing)" },
  { key: "impulsa_page", label: "IMPULSA (página)" },
  { key: "navbar", label: "Menú" },
  { key: "footer", label: "Footer" },
] as const;

const SiteContentEditor = () => {
  const [tab, setTab] = useState<(typeof SECTIONS)[number]["key"]>("hero");

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
      <TabsList className="mb-6 flex h-auto flex-wrap justify-start gap-1">
        {SECTIONS.map((s) => (
          <TabsTrigger key={s.key} value={s.key}>
            {s.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* HERO */}
      <TabsContent value="hero">
        <SectionEditor sectionKey="hero" title="Sección Hero (portada)">
          {(v, set) => (
            <>
              <Field label="Etiqueta superior" value={v.badge} onChange={(e) => set("badge", e.target.value)} />
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Título (parte 1)" value={v.titlePart1} onChange={(e) => set("titlePart1", e.target.value)} />
                <Field label="Texto resaltado" value={v.titleHighlight} onChange={(e) => set("titleHighlight", e.target.value)} />
                <Field label="Título (parte 2)" value={v.titlePart2} onChange={(e) => set("titlePart2", e.target.value)} />
              </div>
              <Area label="Descripción" value={v.description} onChange={(e) => set("description", e.target.value)} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Botón principal" value={v.ctaPrimary} onChange={(e) => set("ctaPrimary", e.target.value)} />
                <Field label="Botón secundario" value={v.ctaSecondary} onChange={(e) => set("ctaSecondary", e.target.value)} />
              </div>
              <p className="pt-2 font-semibold text-sm">Estadísticas</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Stat 1 — número" value={v.stat1Number} onChange={(e) => set("stat1Number", e.target.value)} />
                <Field label="Stat 1 — etiqueta" value={v.stat1Label} onChange={(e) => set("stat1Label", e.target.value)} />
                <Field label="Stat 2 — número" value={v.stat2Number} onChange={(e) => set("stat2Number", e.target.value)} />
                <Field label="Stat 2 — etiqueta" value={v.stat2Label} onChange={(e) => set("stat2Label", e.target.value)} />
                <Field label="Stat 3 — número" value={v.stat3Number} onChange={(e) => set("stat3Number", e.target.value)} />
                <Field label="Stat 3 — etiqueta" value={v.stat3Label} onChange={(e) => set("stat3Label", e.target.value)} />
              </div>
              <p className="pt-2 font-semibold text-sm">Insignia flotante</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Texto principal" value={v.badgeFloating1} onChange={(e) => set("badgeFloating1", e.target.value)} />
                <Field label="Subtexto" value={v.badgeFloating1Sub} onChange={(e) => set("badgeFloating1Sub", e.target.value)} />
              </div>
            </>
          )}
        </SectionEditor>
      </TabsContent>

      {/* QUE ES STEAM */}
      <TabsContent value="what_is_steam">
        <SectionEditor sectionKey="what_is_steam" title="¿Qué es STEAM?">
          {(v, set) => (
            <>
              <Field label="Etiqueta superior" value={v.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Título" value={v.title} onChange={(e) => set("title", e.target.value)} />
                <Field label="Resaltado" value={v.titleHighlight} onChange={(e) => set("titleHighlight", e.target.value)} />
              </div>
              <Area label="Descripción" value={v.description} onChange={(e) => set("description", e.target.value)} />

              <p className="pt-2 font-semibold text-sm">Letras STEAM</p>
              {v.items.map((item, i) => (
                <div key={i} className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-3">
                  <Field label="Letra" value={item.letter} onChange={(e) => {
                    const next = [...v.items]; next[i] = { ...item, letter: e.target.value }; set("items", next);
                  }} />
                  <Field label="Título" value={item.title} onChange={(e) => {
                    const next = [...v.items]; next[i] = { ...item, title: e.target.value }; set("items", next);
                  }} />
                  <Field label="Descripción" value={item.description} onChange={(e) => {
                    const next = [...v.items]; next[i] = { ...item, description: e.target.value }; set("items", next);
                  }} />
                </div>
              ))}

              <p className="pt-2 font-semibold text-sm">Bloque "¿Por qué STEAM importa?"</p>
              <Field label="Título" value={v.whyTitle} onChange={(e) => set("whyTitle", e.target.value)} />
              <Area label="Descripción" value={v.whyDescription} onChange={(e) => set("whyDescription", e.target.value)} />
              <Label>Beneficios (uno por línea)</Label>
              <Textarea
                rows={5}
                value={v.whyBullets.join("\n")}
                onChange={(e) => set("whyBullets", e.target.value.split("\n").filter(Boolean))}
              />
            </>
          )}
        </SectionEditor>
      </TabsContent>

      {/* MISION */}
      <TabsContent value="mission">
        <SectionEditor sectionKey="mission" title="Misión">
          {(v, set) => (
            <>
              <Field label="Etiqueta" value={v.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Título" value={v.title} onChange={(e) => set("title", e.target.value)} />
                <Field label="Resaltado" value={v.titleHighlight} onChange={(e) => set("titleHighlight", e.target.value)} />
              </div>
              <Area label="Descripción" value={v.description} onChange={(e) => set("description", e.target.value)} />
              <p className="pt-2 font-semibold text-sm">Tarjetas (3)</p>
              {v.items.map((it, i) => (
                <div key={i} className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-2">
                  <Field label="Título" value={it.title} onChange={(e) => {
                    const next = [...v.items]; next[i] = { ...it, title: e.target.value }; set("items", next);
                  }} />
                  <Field label="Texto" value={it.text} onChange={(e) => {
                    const next = [...v.items]; next[i] = { ...it, text: e.target.value }; set("items", next);
                  }} />
                </div>
              ))}
            </>
          )}
        </SectionEditor>
      </TabsContent>

      {/* TEAM */}
      <TabsContent value="team">
        <SectionEditor sectionKey="team" title="Equipo">
          {(v, set) => (
            <>
              <Field label="Etiqueta superior" value={v.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Título" value={v.title} onChange={(e) => set("title", e.target.value)} />
                <Field label="Resaltado" value={v.titleHighlight} onChange={(e) => set("titleHighlight", e.target.value)} />
              </div>

              <p className="pt-2 font-semibold text-sm">Fundadora</p>
              <Field label="Etiqueta" value={v.founderEyebrow} onChange={(e) => set("founderEyebrow", e.target.value)} />
              <Field label="Nombre" value={v.founderName} onChange={(e) => set("founderName", e.target.value)} />
              <Area label="Biografía (párrafo 1)" value={v.founderBio1} onChange={(e) => set("founderBio1", e.target.value)} />
              <Area label="Biografía (párrafo 2)" value={v.founderBio2} onChange={(e) => set("founderBio2", e.target.value)} />
              <ImageUploader label="Foto de la fundadora" folder="team" value={v.founderPhoto} onChange={(url) => set("founderPhoto", url)} />

              <p className="pt-4 font-semibold text-sm">Inspiradores</p>
              <Field label="Etiqueta superior" value={v.inspiradoresEyebrow} onChange={(e) => set("inspiradoresEyebrow", e.target.value)} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Título" value={v.inspiradoresTitle} onChange={(e) => set("inspiradoresTitle", e.target.value)} />
                <Field label="Resaltado" value={v.inspiradoresTitleHighlight} onChange={(e) => set("inspiradoresTitleHighlight", e.target.value)} />
              </div>
              <Area label="Descripción" value={v.inspiradoresDescription} onChange={(e) => set("inspiradoresDescription", e.target.value)} />

              {v.inspiradores.map((p, i) => (
                <div key={i} className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Inspirador #{i + 1}</p>
                    <Button type="button" size="icon" variant="ghost" onClick={() => {
                      const next = v.inspiradores.filter((_, k) => k !== i); set("inspiradores", next);
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Nombre" value={p.name} onChange={(e) => {
                      const next = [...v.inspiradores]; next[i] = { ...p, name: e.target.value }; set("inspiradores", next);
                    }} />
                    <Field label="Rol" value={p.role} onChange={(e) => {
                      const next = [...v.inspiradores]; next[i] = { ...p, role: e.target.value }; set("inspiradores", next);
                    }} />
                  </div>
                  <ImageUploader label="Foto" folder="team" value={p.photo} onChange={(url) => {
                    const next = [...v.inspiradores]; next[i] = { ...p, photo: url }; set("inspiradores", next);
                  }} />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => {
                set("inspiradores", [...v.inspiradores, { name: "Nuevo", role: "Maestro STEAM", photo: "" }]);
              }}>
                <Plus className="h-4 w-4" /> Agregar inspirador
              </Button>
            </>
          )}
        </SectionEditor>
      </TabsContent>

      {/* PROGRAMS */}
      <TabsContent value="programs">
        <SectionEditor sectionKey="programs" title="Programas">
          {(v, set) => (
            <>
              <Field label="Etiqueta" value={v.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Título" value={v.title} onChange={(e) => set("title", e.target.value)} />
                <Field label="Resaltado" value={v.titleHighlight} onChange={(e) => set("titleHighlight", e.target.value)} />
              </div>
              <Area label="Descripción" value={v.description} onChange={(e) => set("description", e.target.value)} />

              {v.programs.map((p, i) => (
                <div key={i} className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Programa #{i + 1}</p>
                    <Button type="button" size="icon" variant="ghost" onClick={() => {
                      set("programs", v.programs.filter((_, k) => k !== i));
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Field label="Etiqueta (Escuelas, Empresas...)" value={p.tag} onChange={(e) => {
                    const next = [...v.programs]; next[i] = { ...p, tag: e.target.value }; set("programs", next);
                  }} />
                  <Field label="Título" value={p.title} onChange={(e) => {
                    const next = [...v.programs]; next[i] = { ...p, title: e.target.value }; set("programs", next);
                  }} />
                  <Area label="Descripción" value={p.text} onChange={(e) => {
                    const next = [...v.programs]; next[i] = { ...p, text: e.target.value }; set("programs", next);
                  }} />
                  <ImageUploader label="Imagen" folder="programs" value={p.image} onChange={(url) => {
                    const next = [...v.programs]; next[i] = { ...p, image: url }; set("programs", next);
                  }} />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => {
                set("programs", [...v.programs, { tag: "Nuevo", title: "Nuevo programa", text: "", image: "" }]);
              }}>
                <Plus className="h-4 w-4" /> Agregar programa
              </Button>
            </>
          )}
        </SectionEditor>
      </TabsContent>

      {/* COLLABORATORS */}
      <TabsContent value="collaborators">
        <SectionEditor sectionKey="collaborators" title="Colaboradores">
          {(v, set) => (
            <>
              <Field label="Etiqueta" value={v.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Título" value={v.title} onChange={(e) => set("title", e.target.value)} />
                <Field label="Resaltado" value={v.titleHighlight} onChange={(e) => set("titleHighlight", e.target.value)} />
              </div>
              <Area label="Descripción" value={v.description} onChange={(e) => set("description", e.target.value)} />

              {v.groups.map((g, i) => (
                <div key={i} className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Grupo #{i + 1}</p>
                    <Button type="button" size="icon" variant="ghost" onClick={() => {
                      set("groups", v.groups.filter((_, k) => k !== i));
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Categoría" value={g.category} onChange={(e) => {
                      const next = [...v.groups]; next[i] = { ...g, category: e.target.value }; set("groups", next);
                    }} />
                    <Field label="Emoji" value={g.icon} onChange={(e) => {
                      const next = [...v.groups]; next[i] = { ...g, icon: e.target.value }; set("groups", next);
                    }} />
                  </div>
                  <Label>Organizaciones (una por línea)</Label>
                  <Textarea
                    rows={4}
                    value={g.organizations.join("\n")}
                    onChange={(e) => {
                      const next = [...v.groups];
                      next[i] = { ...g, organizations: e.target.value.split("\n").filter(Boolean) };
                      set("groups", next);
                    }}
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => {
                set("groups", [...v.groups, { category: "Nuevo grupo", icon: "🏢", organizations: [] }]);
              }}>
                <Plus className="h-4 w-4" /> Agregar grupo
              </Button>

              <p className="pt-4 font-semibold text-sm">Llamada a la acción</p>
              <Field label="Título" value={v.ctaTitle} onChange={(e) => set("ctaTitle", e.target.value)} />
              <Area label="Descripción" value={v.ctaDescription} onChange={(e) => set("ctaDescription", e.target.value)} />
              <Field label="Texto del botón" value={v.ctaButton} onChange={(e) => set("ctaButton", e.target.value)} />
            </>
          )}
        </SectionEditor>
      </TabsContent>

      {/* DONATIONS */}
      <TabsContent value="donations">
        <SectionEditor sectionKey="donations" title="Donaciones">
          {(v, set) => (
            <>
              <Field label="Etiqueta" value={v.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Título" value={v.title} onChange={(e) => set("title", e.target.value)} />
                <Field label="Resaltado" value={v.titleHighlight} onChange={(e) => set("titleHighlight", e.target.value)} />
              </div>
              <Area label="Descripción" value={v.description} onChange={(e) => set("description", e.target.value)} />

              {v.tiers.map((t, i) => (
                <div key={i} className="space-y-3 rounded-lg border border-border p-4">
                  <p className="text-sm font-semibold">Nivel #{i + 1}</p>
                  <Field label="Monto" value={t.amount} onChange={(e) => {
                    const next = [...v.tiers]; next[i] = { ...t, amount: e.target.value }; set("tiers", next);
                  }} />
                  <Field label="Título" value={t.title} onChange={(e) => {
                    const next = [...v.tiers]; next[i] = { ...t, title: e.target.value }; set("tiers", next);
                  }} />
                  <Area label="Descripción" value={t.description} onChange={(e) => {
                    const next = [...v.tiers]; next[i] = { ...t, description: e.target.value }; set("tiers", next);
                  }} />
                </div>
              ))}

              <Field label="Texto del botón" value={v.buttonText} onChange={(e) => set("buttonText", e.target.value)} />
              <Field label="URL de PayPal" type="url" value={v.paypalUrl} onChange={(e) => set("paypalUrl", e.target.value)} />
            </>
          )}
        </SectionEditor>
      </TabsContent>

      {/* NAVBAR */}
      <TabsContent value="navbar">
        <SectionEditor sectionKey="navbar" title="Menú de navegación">
          {(v, set) => (
            <>
              <Field label="Texto del botón Donar" value={v.ctaText} onChange={(e) => set("ctaText", e.target.value)} />
              <Field label="URL del botón Donar" type="url" value={v.ctaUrl} onChange={(e) => set("ctaUrl", e.target.value)} />
            </>
          )}
        </SectionEditor>
      </TabsContent>

      {/* FOOTER */}
      <TabsContent value="footer">
        <SectionEditor sectionKey="footer" title="Pie de página">
          {(v, set) => (
            <>
              <Area label="Frase de la marca" value={v.brandTagline} onChange={(e) => set("brandTagline", e.target.value)} />

              <p className="pt-2 font-semibold text-sm">Redes sociales</p>
              <Field label="Título de la sección" value={v.socialTitle} onChange={(e) => set("socialTitle", e.target.value)} />
              <Field label="Handle / usuario" value={v.socialHandle} onChange={(e) => set("socialHandle", e.target.value)} />
              <Field label="URL de Instagram" type="url" value={v.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} />
              <Field label="URL de Facebook" type="url" value={v.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} />
              <Field
                label="URL de WhatsApp (ej: https://wa.me/52XXXXXXXXXX)"
                type="url"
                value={v.whatsappUrl}
                onChange={(e) => set("whatsappUrl", e.target.value)}
              />

              <p className="pt-2 font-semibold text-sm">Datos de contacto</p>
              <Field label="Título de la sección" value={v.contactTitle} onChange={(e) => set("contactTitle", e.target.value)} />
              <Field label="Email" type="email" value={v.email} onChange={(e) => set("email", e.target.value)} />
              <Field label="Teléfono" value={v.phone} onChange={(e) => set("phone", e.target.value)} />
              <Field label="Sitio web" value={v.website} onChange={(e) => set("website", e.target.value)} />
              <Area label="Dirección" value={v.address} onChange={(e) => set("address", e.target.value)} />
              <Field label="Texto de copyright" value={v.copyright} onChange={(e) => set("copyright", e.target.value)} />
            </>
          )}
        </SectionEditor>
      </TabsContent>

      {/* IMPULSA LANDING */}
      <TabsContent value="impulsa_landing">
        <SectionEditor sectionKey="impulsa_landing" title="IMPULSA — sección en landing">
          {(v, set) => (
            <>
              <Field label="Badge" value={v.badge} onChange={(e) => set("badge", e.target.value)} />
              <Field label="Título" value={v.title} onChange={(e) => set("title", e.target.value)} />
              <Area label="Subtítulo" value={v.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
              <Area label="Frase destacada" value={v.highlight} onChange={(e) => set("highlight", e.target.value)} />
              <Field label="Meta visual" value={v.goal} onChange={(e) => set("goal", e.target.value)} />
              <Area label="Texto adicional" value={v.extra} onChange={(e) => set("extra", e.target.value)} />

              <p className="pt-2 font-semibold text-sm">Modalidades (3)</p>
              {v.tiers.map((t, i) => (
                <div key={i} className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-3">
                  <Field label="Título" value={t.title} onChange={(e) => {
                    const next = [...v.tiers]; next[i] = { ...t, title: e.target.value }; set("tiers", next);
                  }} />
                  <Field label="Precio" value={t.price} onChange={(e) => {
                    const next = [...v.tiers]; next[i] = { ...t, price: e.target.value }; set("tiers", next);
                  }} />
                  <Field label="CTA" value={t.cta} onChange={(e) => {
                    const next = [...v.tiers]; next[i] = { ...t, cta: e.target.value }; set("tiers", next);
                  }} />
                </div>
              ))}

              <Field label="Botón principal" value={v.primaryCta} onChange={(e) => set("primaryCta", e.target.value)} />
              <Field label="Botón secundario" value={v.secondaryCta} onChange={(e) => set("secondaryCta", e.target.value)} />
              <Area label="Microcopy" value={v.microcopy} onChange={(e) => set("microcopy", e.target.value)} />
            </>
          )}
        </SectionEditor>
      </TabsContent>

      {/* IMPULSA PAGE */}
      <TabsContent value="impulsa_page">
        <SectionEditor sectionKey="impulsa_page" title="IMPULSA — página /impulsa">
          {(v, set) => (
            <>
              <p className="pt-2 font-semibold text-sm">Hero</p>
              <Field label="Título" value={v.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
              <Area label="Subtítulo" value={v.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} />
              <Area label="Texto complementario" value={v.heroExtra} onChange={(e) => set("heroExtra", e.target.value)} />
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Botón principal" value={v.heroPrimaryCta} onChange={(e) => set("heroPrimaryCta", e.target.value)} />
                <Field label="Botón secundario" value={v.heroSecondaryCta} onChange={(e) => set("heroSecondaryCta", e.target.value)} />
              </div>

              <p className="pt-4 font-semibold text-sm">¿Qué es IMPULSA? + Misión</p>
              <Field label="Título sección" value={v.whatTitle} onChange={(e) => set("whatTitle", e.target.value)} />
              <Area label="Texto" value={v.whatText} onChange={(e) => set("whatText", e.target.value)} />
              <Field label="Título misión" value={v.missionTitle} onChange={(e) => set("missionTitle", e.target.value)} />
              <Area label="Texto misión" value={v.missionText} onChange={(e) => set("missionText", e.target.value)} />

              <p className="pt-4 font-semibold text-sm">Meta 2026</p>
              <Field label="Título" value={v.goalTitle} onChange={(e) => set("goalTitle", e.target.value)} />
              <Area label="Texto" value={v.goalText} onChange={(e) => set("goalText", e.target.value)} />
              {v.goalStats.map((s, i) => (
                <div key={i} className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-2">
                  <Field label={`Stat ${i + 1} — valor`} value={s.value} onChange={(e) => {
                    const next = [...v.goalStats]; next[i] = { ...s, value: e.target.value }; set("goalStats", next);
                  }} />
                  <Field label={`Stat ${i + 1} — etiqueta`} value={s.label} onChange={(e) => {
                    const next = [...v.goalStats]; next[i] = { ...s, label: e.target.value }; set("goalStats", next);
                  }} />
                </div>
              ))}
              <Area label="Texto adicional" value={v.goalExtra} onChange={(e) => set("goalExtra", e.target.value)} />

              <p className="pt-4 font-semibold text-sm">STEAM Day</p>
              <Field label="Título" value={v.steamDayTitle} onChange={(e) => set("steamDayTitle", e.target.value)} />
              <Area label="Texto" value={v.steamDayText} onChange={(e) => set("steamDayText", e.target.value)} />
              <Label>Items (uno por línea)</Label>
              <Textarea rows={6} value={v.steamDayItems.join("\n")} onChange={(e) => set("steamDayItems", e.target.value.split("\n").filter(Boolean))} />

              <p className="pt-4 font-semibold text-sm">Beneficiarios</p>
              <Field label="Título" value={v.beneficiariesTitle} onChange={(e) => set("beneficiariesTitle", e.target.value)} />
              <Area label="Texto" value={v.beneficiariesText} onChange={(e) => set("beneficiariesText", e.target.value)} />

              <p className="pt-4 font-semibold text-sm">Modalidades de participación</p>
              <Field label="Título" value={v.tiersTitle} onChange={(e) => set("tiersTitle", e.target.value)} />
              <Area label="Texto" value={v.tiersText} onChange={(e) => set("tiersText", e.target.value)} />
              {v.tiers.map((t, i) => (
                <div key={i} className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-3">
                  <Field label="Título" value={t.title} onChange={(e) => {
                    const next = [...v.tiers]; next[i] = { ...t, title: e.target.value }; set("tiers", next);
                  }} />
                  <Field label="Precio" value={t.price} onChange={(e) => {
                    const next = [...v.tiers]; next[i] = { ...t, price: e.target.value }; set("tiers", next);
                  }} />
                  <Field label="CTA" value={t.cta} onChange={(e) => {
                    const next = [...v.tiers]; next[i] = { ...t, cta: e.target.value }; set("tiers", next);
                  }} />
                </div>
              ))}
              <Area label="Texto adicional" value={v.tiersExtra} onChange={(e) => set("tiersExtra", e.target.value)} />

              <p className="pt-4 font-semibold text-sm">¿Qué hace posible tu aportación?</p>
              <Field label="Título" value={v.enablesTitle} onChange={(e) => set("enablesTitle", e.target.value)} />
              <Area label="Texto" value={v.enablesText} onChange={(e) => set("enablesText", e.target.value)} />
              <Label>Chips (uno por línea)</Label>
              <Textarea rows={6} value={v.enablesChips.join("\n")} onChange={(e) => set("enablesChips", e.target.value.split("\n").filter(Boolean))} />

              <p className="pt-4 font-semibold text-sm">¿En qué se utilizará el recurso?</p>
              <Field label="Título" value={v.useTitle} onChange={(e) => set("useTitle", e.target.value)} />
              <Area label="Texto" value={v.useText} onChange={(e) => set("useText", e.target.value)} />
              <Label>Items (uno por línea)</Label>
              <Textarea rows={5} value={v.useItems.join("\n")} onChange={(e) => set("useItems", e.target.value.split("\n").filter(Boolean))} />

              <p className="pt-4 font-semibold text-sm">Transparencia</p>
              <Field label="Título" value={v.transparencyTitle} onChange={(e) => set("transparencyTitle", e.target.value)} />
              <Area label="Subtítulo" value={v.transparencySubtitle} onChange={(e) => set("transparencySubtitle", e.target.value)} />
              <Area label="Texto" value={v.transparencyText} onChange={(e) => set("transparencyText", e.target.value)} />
              {v.transparencyCards.map((card, i) => (
                <div key={i} className="space-y-2 rounded-lg border border-border p-4">
                  <Field label={`Card ${i + 1} — Título`} value={card.title} onChange={(e) => {
                    const next = [...v.transparencyCards]; next[i] = { ...card, title: e.target.value }; set("transparencyCards", next);
                  }} />
                  <Label>Items (uno por línea)</Label>
                  <Textarea rows={4} value={card.items.join("\n")} onChange={(e) => {
                    const next = [...v.transparencyCards];
                    next[i] = { ...card, items: e.target.value.split("\n").filter(Boolean) };
                    set("transparencyCards", next);
                  }} />
                </div>
              ))}
              <Area label="Texto final" value={v.transparencyFinal} onChange={(e) => set("transparencyFinal", e.target.value)} />

              <p className="pt-4 font-semibold text-sm">Reconocimiento</p>
              <Field label="Título" value={v.recognitionTitle} onChange={(e) => set("recognitionTitle", e.target.value)} />
              <Area label="Texto" value={v.recognitionText} onChange={(e) => set("recognitionText", e.target.value)} />
              <Field label="Texto del botón" value={v.recognitionCta} onChange={(e) => set("recognitionCta", e.target.value)} />
              <Field label="URL WhatsApp empresa aliada" type="url" value={v.recognitionWhatsapp} onChange={(e) => set("recognitionWhatsapp", e.target.value)} />

              <p className="pt-4 font-semibold text-sm">CTA Final + Contacto</p>
              <Area label="Título final" value={v.finalTitle} onChange={(e) => set("finalTitle", e.target.value)} />
              <Area label="Subtítulo final" value={v.finalSubtitle} onChange={(e) => set("finalSubtitle", e.target.value)} />
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Botón principal" value={v.finalPrimaryCta} onChange={(e) => set("finalPrimaryCta", e.target.value)} />
                <Field label="Botón WhatsApp" value={v.finalWhatsappCta} onChange={(e) => set("finalWhatsappCta", e.target.value)} />
                <Field label="Sitio web" value={v.contactWebsite} onChange={(e) => set("contactWebsite", e.target.value)} />
                <Field label="URL Instagram" value={v.contactInstagram} onChange={(e) => set("contactInstagram", e.target.value)} />
                <Field label="Email" value={v.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
                <Field label="WhatsApp (ej: 662 329 9771)" value={v.contactWhatsapp} onChange={(e) => set("contactWhatsapp", e.target.value)} />
              </div>
            </>
          )}
        </SectionEditor>
      </TabsContent>
    </Tabs>
  );
};

export default SiteContentEditor;
