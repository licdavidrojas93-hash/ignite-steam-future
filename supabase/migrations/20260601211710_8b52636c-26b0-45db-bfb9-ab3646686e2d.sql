
-- ============ impulsa_sponsors ============
CREATE TABLE public.impulsa_sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  sponsor_name text NOT NULL,
  sponsor_type text,
  phone text,
  email text,
  city text,
  state text,
  participation_type text,
  amount numeric,
  currency text DEFAULT 'MXN',
  in_kind_description text,
  public_wall_opt_in boolean DEFAULT false,
  public_display_name text,
  message text,
  terms_accepted boolean DEFAULT false,
  payment_status text DEFAULT 'pending',
  payment_provider text DEFAULT 'mercado_pago',
  payment_reference text,
  mercado_pago_payment_id text,
  mercado_pago_preference_id text,
  mercado_pago_status_detail text,
  payment_method_id text,
  checkout_url text,
  paid_at timestamptz,
  webhook_last_received_at timestamptz,
  email_sent boolean DEFAULT false,
  email_sent_at timestamptz,
  admin_notes text,
  visible_on_wall boolean DEFAULT false
);

GRANT INSERT ON public.impulsa_sponsors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impulsa_sponsors TO authenticated;
GRANT ALL ON public.impulsa_sponsors TO service_role;

ALTER TABLE public.impulsa_sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert sponsors"
  ON public.impulsa_sponsors FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can read sponsors"
  ON public.impulsa_sponsors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update sponsors"
  ON public.impulsa_sponsors FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can delete sponsors"
  ON public.impulsa_sponsors FOR DELETE
  TO authenticated
  USING (true);

CREATE TRIGGER trg_impulsa_sponsors_updated
BEFORE UPDATE ON public.impulsa_sponsors
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ impulsa_form_fields ============
CREATE TABLE public.impulsa_form_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  field_key text UNIQUE NOT NULL,
  label text NOT NULL,
  placeholder text,
  helper_text text,
  field_type text,
  is_required boolean DEFAULT false,
  is_active boolean DEFAULT true,
  options jsonb,
  sort_order integer DEFAULT 0
);

GRANT SELECT ON public.impulsa_form_fields TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impulsa_form_fields TO authenticated;
GRANT ALL ON public.impulsa_form_fields TO service_role;

ALTER TABLE public.impulsa_form_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read form fields"
  ON public.impulsa_form_fields FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert form fields"
  ON public.impulsa_form_fields FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update form fields"
  ON public.impulsa_form_fields FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can delete form fields"
  ON public.impulsa_form_fields FOR DELETE
  TO authenticated
  USING (true);

CREATE TRIGGER trg_impulsa_form_fields_updated
BEFORE UPDATE ON public.impulsa_form_fields
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ seed default form fields ============
INSERT INTO public.impulsa_form_fields (field_key, label, placeholder, helper_text, field_type, is_required, sort_order, options) VALUES
  ('modalidad', 'Modalidad de patrocinio', NULL, 'Elige cómo quieres apoyar.', 'select_tier', true, 10, NULL),
  ('monto', 'Monto', '0', 'Se llena automáticamente según la modalidad.', 'number', true, 20, NULL),
  ('sponsor_name', 'Nombre del patrocinador', 'Nombre de persona, familia, empresa o institución', NULL, 'text', true, 30, NULL),
  ('sponsor_type', 'Tipo de patrocinador', NULL, NULL, 'select', false, 40,
    '["Persona","Familia","Empresa","Institución","Organización","Grupo de amigos","Donador en especie"]'::jsonb),
  ('phone', 'Teléfono', '662 000 0000', NULL, 'tel', false, 50, NULL),
  ('email', 'Correo electrónico', 'tu@correo.com', 'Te enviaremos confirmación a este correo.', 'email', true, 60, NULL),
  ('city', 'Ciudad', 'Hermosillo', NULL, 'text', false, 70, NULL),
  ('state', 'Estado', 'Sonora', NULL, 'text', false, 80, NULL),
  ('public_wall_opt_in', '¿Desea aparecer en el muro de patrocinadores?', NULL,
    'Autorizo que mi nombre, empresa o institución aparezca en el Muro de Patrocinadores de IMPULSA por Niñ@s STEAM.',
    'checkbox', false, 90, NULL),
  ('public_display_name', 'Nombre público para mostrar', 'Ej. Familia López, RoacShop, Empresa Aliada, Anónimo',
    'Así aparecerás públicamente en el muro de patrocinadores.', 'text', false, 100, NULL),
  ('message', 'Mensaje opcional', 'Puedes dejar un mensaje de apoyo para las niñas y niños participantes.', NULL, 'textarea', false, 110, NULL),
  ('in_kind_description', 'Describe la aportación en especie',
    'Ej. materiales, kits, transporte, refrigerios, equipo, mentoría, etc.', NULL, 'textarea', false, 120, NULL),
  ('terms_accepted', 'Aceptación de aviso', NULL,
    'Confirmo que los datos proporcionados podrán ser utilizados para dar seguimiento a mi participación en IMPULSA por Niñ@s STEAM.',
    'checkbox', true, 130, NULL);
