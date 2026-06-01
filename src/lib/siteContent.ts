// Tipos y valores por defecto del contenido editable del sitio.
// Cada sección es una clave en la tabla `site_content`. Si la BD no tiene
// datos para una sección, se usa el default de aquí (sitio nunca queda vacío).

export interface HeroContent {
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  stat3Number: string;
  stat3Label: string;
  badgeFloating1: string;
  badgeFloating1Sub: string;
}

export interface SteamItem {
  letter: string;
  title: string;
  description: string;
}

export interface WhatIsSteamContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  items: SteamItem[];
  whyTitle: string;
  whyDescription: string;
  whyBullets: string[];
}

export interface MissionItem {
  title: string;
  text: string;
}
export interface MissionContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  items: MissionItem[];
}

export interface InspiradorPerson {
  name: string;
  role: string;
  photo: string;
}
export interface TeamContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  founderEyebrow: string;
  founderName: string;
  founderBio1: string;
  founderBio2: string;
  founderPhoto: string;
  inspiradoresEyebrow: string;
  inspiradoresTitle: string;
  inspiradoresTitleHighlight: string;
  inspiradoresDescription: string;
  inspiradores: InspiradorPerson[];
}

export interface ProgramItem {
  tag: string;
  title: string;
  text: string;
  image: string;
}
export interface ProgramsContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  programs: ProgramItem[];
}

export interface CollaboratorGroup {
  category: string;
  icon: string;
  organizations: string[];
}
export interface CollaboratorsContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  groups: CollaboratorGroup[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
}

export interface DonationTier {
  amount: string;
  title: string;
  description: string;
}
export interface DonationsContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  tiers: DonationTier[];
  buttonText: string;
  paypalUrl: string;
}

export interface FooterContent {
  brandTagline: string;
  socialTitle: string;
  socialHandle: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl: string;
  contactTitle: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  copyright: string;
}

export interface NavbarContent {
  ctaText: string;
  ctaUrl: string;
}

// ===== IMPULSA =====
export interface ImpulsaTier {
  title: string;
  price: string;
  cta: string;
}
export interface ImpulsaLandingContent {
  badge: string;
  title: string;
  subtitle: string;
  highlight: string;
  goal: string;
  extra: string;
  tiers: ImpulsaTier[];
  primaryCta: string;
  secondaryCta: string;
  microcopy: string;
}

export interface ImpulsaStat { value: string; label: string }
export interface ImpulsaTransparencyCard { title: string; items: string[] }

export interface ImpulsaPageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroExtra: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  whatTitle: string;
  whatText: string;
  missionTitle: string;
  missionText: string;
  goalTitle: string;
  goalText: string;
  goalStats: ImpulsaStat[];
  goalExtra: string;
  steamDayTitle: string;
  steamDayText: string;
  steamDayItems: string[];
  beneficiariesTitle: string;
  beneficiariesText: string;
  tiersTitle: string;
  tiersText: string;
  tiers: ImpulsaTier[];
  tiersExtra: string;
  enablesTitle: string;
  enablesText: string;
  enablesChips: string[];
  useTitle: string;
  useText: string;
  useItems: string[];
  transparencyTitle: string;
  transparencySubtitle: string;
  transparencyText: string;
  transparencyCards: ImpulsaTransparencyCard[];
  transparencyFinal: string;
  recognitionTitle: string;
  recognitionText: string;
  recognitionCta: string;
  recognitionWhatsapp: string;
  finalTitle: string;
  finalSubtitle: string;
  finalPrimaryCta: string;
  finalWhatsappCta: string;
  contactWebsite: string;
  contactInstagram: string;
  contactEmail: string;
  contactWhatsapp: string;
}

export type SiteContentMap = {
  hero: HeroContent;
  what_is_steam: WhatIsSteamContent;
  mission: MissionContent;
  team: TeamContent;
  programs: ProgramsContent;
  collaborators: CollaboratorsContent;
  donations: DonationsContent;
  footer: FooterContent;
  navbar: NavbarContent;
  impulsa_landing: ImpulsaLandingContent;
  impulsa_page: ImpulsaPageContent;
};

export type SectionKey = keyof SiteContentMap;

// ============================================================
// DEFAULTS — texto e imágenes actuales del sitio
// ============================================================

export const DEFAULTS: SiteContentMap = {
  hero: {
    badge: "Educación STEAM para todos",
    titlePart1: "Despertamos la ",
    titleHighlight: "curiosidad",
    titlePart2: " de los niños del mañana.",
    description:
      "En Niños STEAM acercamos ciencia, tecnología, ingeniería, arte y matemáticas a niñas y niños en escuelas, empresas y espacios públicos. Aprender jugando, crear soñando.",
    ctaPrimary: "Becar a un niño STEAM",
    ctaSecondary: "Conoce nuestros programas",
    stat1Number: "500+",
    stat1Label: "niños impactados",
    stat2Number: "20+",
    stat2Label: "colonias y espacios",
    stat3Number: "700+",
    stat3Label: "horas de talleres",
    badgeFloating1: "¡Ciencia!",
    badgeFloating1Sub: "para todas y todos",
  },
  what_is_steam: {
    eyebrow: "Educación integral",
    title: "¿Qué es ",
    titleHighlight: "STEAM",
    description:
      "STEAM es un enfoque educativo que integra ciencia, tecnología, ingeniería, arte y matemáticas. Estas disciplinas no trabajan solas: juntas crean pensadores críticos y creativos.",
    items: [
      { letter: "S", title: "Ciencia", description: "Exploramos fenómenos naturales a través del método científico y la experimentación." },
      { letter: "T", title: "Tecnología", description: "Aprendemos a usar herramientas digitales y programación para resolver problemas." },
      { letter: "E", title: "Ingeniería", description: "Diseñamos y construimos soluciones creativas usando lógica y razonamiento." },
      { letter: "A", title: "Arte", description: "Expresamos ideas y emociones, integrando creatividad con todas las disciplinas." },
      { letter: "M", title: "Matemáticas", description: "Usamos números y conceptos para entender patrones en la naturaleza." },
    ],
    whyTitle: "¿Por qué STEAM importa?",
    whyDescription:
      "En un mundo que cambia rápidamente, los niños y niñas necesitan más que solo memorizar información. Necesitan aprender a pensar, crear, colaborar y resolver problemas del mundo real. STEAM desarrolla estas habilidades desde la curiosidad y el juego.",
    whyBullets: [
      "Fomenta el pensamiento crítico y la resolución de problemas",
      "Estimula la creatividad e innovación",
      "Prepara para carreras del futuro",
      "Promueve el trabajo en equipo y la comunicación",
    ],
  },
  mission: {
    eyebrow: "Quiénes somos",
    title: "Educación STEAM para ",
    titleHighlight: "cada niña y niño",
    description:
      "Somos una iniciativa social que cree que toda infancia merece descubrir lo increíble que es crear, experimentar y soñar con ciencia.",
    items: [
      { title: "Despertar curiosidad", text: "Acercamos a niñas y niños a la ciencia, el arte y la tecnología desde la experiencia y el juego." },
      { title: "Reducir brechas", text: "Llevamos educación STEAM a comunidades donde la oportunidad es difícil de alcanzar." },
      { title: "Formar talento", text: "Cultivamos pensamiento crítico, creatividad y trabajo en equipo: las habilidades del futuro." },
    ],
  },
  team: {
    eyebrow: "Nuestro equipo",
    title: "Quiénes ",
    titleHighlight: "somos",
    founderEyebrow: "Fundadora",
    founderName: "Nitzía Gradias",
    founderBio1:
      "Nitzía es una apasionada educadora con más de X años de experiencia en educación STEAM. Fundó Niños STEAM con la visión de democratizar el acceso a la ciencia y tecnología para todos los niños y niñas, sin importar su origen socioeconómico.",
    founderBio2:
      "Su compromiso con la educación inclusiva y de calidad ha llevado a Niños STEAM a impactar la vida de cientos de niños en toda la región.",
    founderPhoto: "",
    inspiradoresEyebrow: "Nuestro motor",
    inspiradoresTitle: "Los ",
    inspiradoresTitleHighlight: "Inspiradores",
    inspiradoresDescription:
      "Nuestros maestros STEAM son profesionales dedicados que transforman la curiosidad en conocimiento, guiando a cada niño en su viaje de aprendizaje.",
    inspiradores: [
      { name: "Inspirador 1", role: "Maestro STEAM", photo: "" },
      { name: "Inspirador 2", role: "Maestro STEAM", photo: "" },
      { name: "Inspirador 3", role: "Maestro STEAM", photo: "" },
      { name: "Inspirador 4", role: "Maestro STEAM", photo: "" },
      { name: "Inspirador 5", role: "Maestro STEAM", photo: "" },
      { name: "Inspirador 6", role: "Maestro STEAM", photo: "" },
    ],
  },
  programs: {
    eyebrow: "Dónde trabajamos",
    title: "Programas con ",
    titleHighlight: "impacto real",
    description:
      "Nos sumamos a escuelas, empresas y autoridades para que la educación STEAM llegue a quienes más la necesitan.",
    programs: [
      { tag: "Escuelas", title: "Talleres STEAM en escuelas", text: "Llevamos sesiones prácticas y materiales a planteles públicos y privados, complementando el currículo con experiencias memorables.", image: "" },
      { tag: "Empresas", title: "Programas para hijos de trabajadores", text: "Diseñamos programas para empresas comprometidas con sus colaboradores y sus familias. Beneficio social con impacto medible.", image: "" },
      { tag: "Comunidad", title: "Espacios públicos y apoyo social", text: "Activaciones gratuitas en colonias, parques y centros comunitarios, con participación de gobiernos locales y aliados sociales.", image: "" },
    ],
  },
  collaborators: {
    eyebrow: "Nuestros aliados",
    title: "Quiénes han ",
    titleHighlight: "confiado en nosotros",
    description:
      "Trabajamos con instituciones, empresas y gobiernos que comparten nuestra visión de una educación accesible, integral y transformadora para todos los niños y niñas.",
    groups: [
      { category: "Colegios", icon: "🏫", organizations: ["Colegio Marista", "Escuela Primaria Benito Juárez", "Instituto Tecnológico", "Colegio Independencia"] },
      { category: "Empresas", icon: "🏢", organizations: ["Sonora Tech Solutions", "Desarrollo Integral Hermosillo", "Innovación Empresarial SA", "Industria Local 2024"] },
      { category: "Instituciones", icon: "🏛️", organizations: ["Ayuntamiento de Hermosillo", "IMEC (Instituto Mexicano de Educación en Ciencia)", "Secretaría de Educación Estatal", "Comisión de Ciencia"] },
    ],
    ctaTitle: "¿Tu institución también quiere colaborar?",
    ctaDescription:
      "Creemos en la fuerza de la colaboración. Si compartes nuestra misión de llevar educación STEAM a más niños y niñas, nos encantaría trabajar contigo.",
    ctaButton: "Contáctanos",
  },
  donations: {
    eyebrow: "Becar a un niño STEAM",
    title: "Tu donativo abre ",
    titleHighlight: "un futuro",
    description:
      "Con tu apoyo financiamos materiales, talleres y becas para que más niñas y niños descubran su pasión por la ciencia y el arte. Cada peso suma. Cada beca cambia una vida.",
    tiers: [
      { amount: "$200 MXN", title: "Material de un taller", description: "Apoyas a un grupo de niños con los materiales necesarios para una sesión STEAM." },
      { amount: "$500 MXN", title: "Beca un mes a un niño", description: "Patrocinas un mes completo de talleres STEAM para un niño o niña." },
      { amount: "$1,500 MXN", title: "Beca un trimestre completo", description: "Cambias la vida de un niño con tres meses de aprendizaje STEAM continuo." },
    ],
    buttonText: "Donar ahora 💙",
    paypalUrl: "https://www.paypal.com/donate/?hosted_button_id=NUN5PLXX6JAUS",
  },
  footer: {
    brandTagline:
      "Educación en ciencia, tecnología, ingeniería, arte y matemáticas para niñas y niños en toda la región.",
    socialTitle: "Síguenos",
    socialHandle: "@ninos.steam",
    instagramUrl: "https://www.instagram.com/ninos.steam/",
    facebookUrl: "https://www.facebook.com/ninoss.steam/",
    whatsappUrl: "",
    contactTitle: "Contacto",
    email: "contacto@ninos-steam.org",
    phone: "",
    website: "www.ninossteam.com",
    address: "",
    copyright: "Niños STEAM. Todos los derechos reservados.",
  },
  navbar: {
    ctaText: "Donar ahora",
    ctaUrl: "https://www.paypal.com/donate/?hosted_button_id=NUN5PLXX6JAUS",
  },
};

// Merge profundo simple: BD pisa defaults pero conserva campos faltantes
export function mergeContent<K extends SectionKey>(
  key: K,
  dbData: unknown,
): SiteContentMap[K] {
  const def = DEFAULTS[key];
  if (!dbData || typeof dbData !== "object") return def;
  return { ...def, ...(dbData as object) } as SiteContentMap[K];
}
