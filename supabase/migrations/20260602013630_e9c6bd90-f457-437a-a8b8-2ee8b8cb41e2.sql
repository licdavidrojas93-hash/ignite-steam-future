
-- Impact updates (avances, historias, evidencia)
CREATE TABLE public.impulsa_impact_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  title text,
  description text,
  media_url text,
  update_type text DEFAULT 'avance',
  is_public boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

GRANT SELECT ON public.impulsa_impact_updates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impulsa_impact_updates TO authenticated;
GRANT ALL ON public.impulsa_impact_updates TO service_role;

ALTER TABLE public.impulsa_impact_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read public impact updates"
  ON public.impulsa_impact_updates FOR SELECT TO anon, authenticated
  USING (is_public = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert impact updates"
  ON public.impulsa_impact_updates FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update impact updates"
  ON public.impulsa_impact_updates FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Authenticated can delete impact updates"
  ON public.impulsa_impact_updates FOR DELETE TO authenticated
  USING (true);

CREATE TRIGGER set_impulsa_impact_updates_updated_at
  BEFORE UPDATE ON public.impulsa_impact_updates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Impact settings (single row: meta y overrides manuales)
CREATE TABLE public.impulsa_impact_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_amount numeric DEFAULT 100000,
  goal_currency text DEFAULT 'MXN',
  beneficiaries_override integer,
  experiences_override integer,
  steam_days_override integer,
  show_goal_progress boolean NOT NULL DEFAULT true,
  show_total_raised boolean NOT NULL DEFAULT true,
  show_sponsors_count boolean NOT NULL DEFAULT true,
  show_beneficiaries boolean NOT NULL DEFAULT true,
  show_experiences boolean NOT NULL DEFAULT true,
  show_steam_days boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.impulsa_impact_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impulsa_impact_settings TO authenticated;
GRANT ALL ON public.impulsa_impact_settings TO service_role;

ALTER TABLE public.impulsa_impact_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read impact settings"
  ON public.impulsa_impact_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert impact settings"
  ON public.impulsa_impact_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update impact settings"
  ON public.impulsa_impact_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete impact settings"
  ON public.impulsa_impact_settings FOR DELETE TO authenticated USING (true);

CREATE TRIGGER set_impulsa_impact_settings_updated_at
  BEFORE UPDATE ON public.impulsa_impact_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.impulsa_impact_settings (goal_amount, goal_currency) VALUES (100000, 'MXN');

-- Public stats view (aggregated, anon-safe)
CREATE OR REPLACE VIEW public.impulsa_public_stats AS
SELECT
  COALESCE(SUM(CASE WHEN payment_status IN ('paid','in_kind_confirmed') THEN amount ELSE 0 END), 0)::numeric AS total_raised,
  COUNT(*) FILTER (WHERE payment_status IN ('paid','in_kind_confirmed'))::int AS sponsors_count
FROM public.impulsa_sponsors;

GRANT SELECT ON public.impulsa_public_stats TO anon, authenticated;

-- Storage bucket para evidencia
INSERT INTO storage.buckets (id, name, public) VALUES ('impulsa-impact', 'impulsa-impact', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read impulsa-impact"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'impulsa-impact');

CREATE POLICY "Authenticated can upload impulsa-impact"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'impulsa-impact');

CREATE POLICY "Authenticated can update impulsa-impact"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'impulsa-impact');

CREATE POLICY "Authenticated can delete impulsa-impact"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'impulsa-impact');
