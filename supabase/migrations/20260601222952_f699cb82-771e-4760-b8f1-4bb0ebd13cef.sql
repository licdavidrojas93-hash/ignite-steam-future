CREATE TABLE public.payment_provider_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  provider text NOT NULL DEFAULT 'mercado_pago',
  environment text NOT NULL DEFAULT 'test',
  test_public_key text,
  test_access_token text,
  production_public_key text,
  production_access_token text,
  webhook_secret text,
  is_active boolean NOT NULL DEFAULT true,
  notes text
);

-- Private table: NO anon access. Only authenticated admins + service_role (edge functions).
-- TODO: migrate access tokens to Supabase Vault / Secrets in future iteration.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_provider_settings TO authenticated;
GRANT ALL ON public.payment_provider_settings TO service_role;

ALTER TABLE public.payment_provider_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read payment settings"
  ON public.payment_provider_settings FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated can insert payment settings"
  ON public.payment_provider_settings FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update payment settings"
  ON public.payment_provider_settings FOR UPDATE
  TO authenticated USING (true);

CREATE POLICY "Authenticated can delete payment settings"
  ON public.payment_provider_settings FOR DELETE
  TO authenticated USING (true);

CREATE TRIGGER payment_provider_settings_updated_at
  BEFORE UPDATE ON public.payment_provider_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.payment_provider_settings (provider, environment, is_active)
VALUES ('mercado_pago', 'test', true);