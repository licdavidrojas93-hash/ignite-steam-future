
-- email_settings
CREATE TABLE public.email_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  provider text NOT NULL DEFAULT 'resend',
  from_email text,
  from_name text,
  api_key text,
  reply_to text,
  is_active boolean NOT NULL DEFAULT true,
  notes text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_settings TO authenticated;
GRANT ALL ON public.email_settings TO service_role;
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read email settings" ON public.email_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert email settings" ON public.email_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update email settings" ON public.email_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete email settings" ON public.email_settings FOR DELETE TO authenticated USING (true);
CREATE TRIGGER trg_email_settings_updated BEFORE UPDATE ON public.email_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- email_templates
CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  template_key text NOT NULL UNIQUE,
  subject text,
  body text,
  is_active boolean NOT NULL DEFAULT true
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read email templates" ON public.email_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert email templates" ON public.email_templates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update email templates" ON public.email_templates FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete email templates" ON public.email_templates FOR DELETE TO authenticated USING (true);
CREATE TRIGGER trg_email_templates_updated BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.email_templates (template_key, subject, body) VALUES (
  'sponsor_thank_you',
  'Gracias por impulsar una experiencia STEAM',
  E'Hola, [nombre]:\n\nGracias por sumarte a IMPULSA por Niñ@s STEAM.\n\nCon tu participación estás ayudando a abrir oportunidades para que niñas y niños de Hermosillo vivan experiencias educativas basadas en ciencia, tecnología, ingeniería, arte y matemáticas.\n\nModalidad registrada:\n[modalidad]\n\nAportación:\n[monto]\n\nSi autorizaste aparecer en el Muro de Patrocinadores, tu nombre público podrá mostrarse como agradecimiento en nuestro sitio web.\n\nMás adelante compartiremos avances de la campaña, evidencia de los STEAM Days realizados e historias de impacto.\n\nGracias por abrir una oportunidad e inspirar un futuro.\n\nNiñ@s STEAM'
);

-- Vista pública del muro
CREATE OR REPLACE VIEW public.public_impulsa_sponsors_wall
WITH (security_invoker = true) AS
SELECT
  id,
  public_display_name,
  sponsor_type,
  message,
  created_at
FROM public.impulsa_sponsors
WHERE public_wall_opt_in = true
  AND visible_on_wall = true
  AND payment_status IN ('paid', 'in_kind_confirmed')
  AND public_display_name IS NOT NULL
  AND length(trim(public_display_name)) > 0;

-- Política pública en sponsors limitada al muro
CREATE POLICY "Public can read sponsors wall rows"
ON public.impulsa_sponsors
FOR SELECT
TO anon
USING (
  public_wall_opt_in = true
  AND visible_on_wall = true
  AND payment_status IN ('paid', 'in_kind_confirmed')
);

GRANT SELECT ON public.public_impulsa_sponsors_wall TO anon, authenticated;
GRANT SELECT (id, public_display_name, sponsor_type, message, created_at, public_wall_opt_in, visible_on_wall, payment_status)
  ON public.impulsa_sponsors TO anon;
