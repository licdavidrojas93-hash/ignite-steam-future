
-- ============ impulsa_content_sections ============
CREATE TABLE public.impulsa_content_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  section_key text UNIQUE NOT NULL,
  section_name text NOT NULL,
  page_location text,
  eyebrow text,
  title text,
  subtitle text,
  body text,
  cta_primary_label text,
  cta_primary_url text,
  cta_secondary_label text,
  cta_secondary_url text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

GRANT SELECT ON public.impulsa_content_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impulsa_content_sections TO authenticated;
GRANT ALL ON public.impulsa_content_sections TO service_role;

ALTER TABLE public.impulsa_content_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read impulsa sections"
  ON public.impulsa_content_sections FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert impulsa sections"
  ON public.impulsa_content_sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update impulsa sections"
  ON public.impulsa_content_sections FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete impulsa sections"
  ON public.impulsa_content_sections FOR DELETE TO authenticated USING (true);

CREATE TRIGGER trg_impulsa_sections_updated_at
  BEFORE UPDATE ON public.impulsa_content_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ impulsa_donation_tiers ============
CREATE TABLE public.impulsa_donation_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  tier_key text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  amount numeric,
  currency text NOT NULL DEFAULT 'MXN',
  cta_label text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

GRANT SELECT ON public.impulsa_donation_tiers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impulsa_donation_tiers TO authenticated;
GRANT ALL ON public.impulsa_donation_tiers TO service_role;

ALTER TABLE public.impulsa_donation_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read impulsa tiers"
  ON public.impulsa_donation_tiers FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert impulsa tiers"
  ON public.impulsa_donation_tiers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update impulsa tiers"
  ON public.impulsa_donation_tiers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete impulsa tiers"
  ON public.impulsa_donation_tiers FOR DELETE TO authenticated USING (true);

CREATE TRIGGER trg_impulsa_tiers_updated_at
  BEFORE UPDATE ON public.impulsa_donation_tiers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ impulsa_contact_settings ============
CREATE TABLE public.impulsa_contact_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_url text,
  instagram_url text,
  contact_email text,
  whatsapp_number text,
  whatsapp_message text,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.impulsa_contact_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impulsa_contact_settings TO authenticated;
GRANT ALL ON public.impulsa_contact_settings TO service_role;

ALTER TABLE public.impulsa_contact_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read impulsa contact"
  ON public.impulsa_contact_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert impulsa contact"
  ON public.impulsa_contact_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update impulsa contact"
  ON public.impulsa_contact_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete impulsa contact"
  ON public.impulsa_contact_settings FOR DELETE TO authenticated USING (true);

CREATE TRIGGER trg_impulsa_contact_updated_at
  BEFORE UPDATE ON public.impulsa_contact_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ Seed inicial ============
INSERT INTO public.impulsa_donation_tiers (tier_key, title, description, amount, currency, cta_label, sort_order) VALUES
  ('steam_day_1', 'Impulsa 1 STEAM Day', 'Patrocina una experiencia STEAM para un grupo de niñas y niños.', 400, 'MXN', 'Patrocina una experiencia', 1),
  ('steam_day_2', 'Impulsa 2 STEAM Days', 'Duplica el impacto y abre dos oportunidades de aprendizaje.', 800, 'MXN', 'Abre dos oportunidades', 2),
  ('steam_day_3', 'Impulsa 3 STEAM Days', 'Impulsa a más talento joven en Hermosillo.', 1200, 'MXN', 'Impulsa más talento', 3);

INSERT INTO public.impulsa_contact_settings (website_url, instagram_url, contact_email, whatsapp_number, whatsapp_message) VALUES
  ('https://ninossteam.org', 'https://instagram.com/ninossteam', 'hola@ninossteam.org', '526623299771', 'Hola, quiero apoyar IMPULSA por Niñ@s STEAM');

INSERT INTO public.impulsa_content_sections (section_key, section_name, page_location, eyebrow, title, subtitle, body, cta_primary_label, cta_primary_url, cta_secondary_label, cta_secondary_url, sort_order) VALUES
  ('landing_impulsa', 'IMPULSA (landing principal)', 'home', 'IMPULSA', 'IMPULSA por Niñ@s STEAM', 'Una iniciativa para acercar experiencias STEAM a más niñas, niños y jóvenes de Hermosillo.', 'Tu apoyo nos permite abrir más oportunidades de aprendizaje creativo y científico.', 'Quiero patrocinar', '/impulsa#patrocinar', 'Conoce más', '/impulsa', 1),
  ('impulsa_hero', 'Hero de /impulsa', 'impulsa', 'IMPULSA por Niñ@s STEAM', 'Impulsa el talento STEAM de Hermosillo', 'Cada aportación abre un STEAM Day: una experiencia transformadora para niñas, niños y jóvenes.', NULL, 'Quiero patrocinar', '#patrocinar', 'Conoce el impacto', '#impacto', 1),
  ('impulsa_mission', 'Misión IMPULSA', 'impulsa', 'Misión', 'Por qué IMPULSA', NULL, 'Creemos que la curiosidad cambia vidas. IMPULSA convierte tu apoyo en experiencias STEAM reales para más niñas y niños.', NULL, NULL, NULL, NULL, 2),
  ('impulsa_meta_2026', 'Meta 2026', 'impulsa', 'Meta 2026', 'Nuestra meta para 2026', 'Lo que queremos lograr juntos el próximo año.', NULL, NULL, NULL, NULL, NULL, 3),
  ('impulsa_steam_day', 'STEAM Day', 'impulsa', 'STEAM Day', '¿Qué es un STEAM Day?', 'Una jornada completa de experiencias STEAM para grupos de niñas y niños.', NULL, NULL, NULL, NULL, NULL, 4),
  ('impulsa_transparency', 'Transparencia', 'impulsa', 'Transparencia', 'Tu apoyo, claro y rastreable', 'Reportamos el uso de cada peso y cuántas niñas y niños son impactados.', NULL, NULL, NULL, NULL, NULL, 5),
  ('impulsa_recognition', 'Reconocimiento', 'impulsa', 'Reconocimiento', 'Reconocemos a nuestros patrocinadores', 'Aliados y empresas que hacen posible IMPULSA.', NULL, NULL, NULL, NULL, NULL, 6),
  ('impulsa_final_cta', 'CTA Final', 'impulsa', 'Súmate', '¿Listo para impulsar el futuro?', 'Cada aportación abre una puerta. Súmate hoy.', NULL, 'Patrocinar ahora', '#patrocinar', 'Hablar por WhatsApp', 'https://wa.me/526623299771', 7);
