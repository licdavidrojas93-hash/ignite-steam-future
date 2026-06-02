
-- =========================================================
-- 1. Infraestructura de roles
-- =========================================================
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed: todos los usuarios existentes hoy son admins (panel privado)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
ON CONFLICT DO NOTHING;

-- =========================================================
-- 2. blog_posts -> admin-only writes + admin read drafts
-- =========================================================
DROP POLICY IF EXISTS "Authenticated can read all posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated can insert posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated can update posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated can delete posts" ON public.blog_posts;

CREATE POLICY "Admins read all posts" ON public.blog_posts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert posts" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update posts" ON public.blog_posts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete posts" ON public.blog_posts
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 3. email_settings -> admin-only (incluye lectura: api_key)
-- =========================================================
DROP POLICY IF EXISTS "Authenticated can read email settings" ON public.email_settings;
DROP POLICY IF EXISTS "Authenticated can insert email settings" ON public.email_settings;
DROP POLICY IF EXISTS "Authenticated can update email settings" ON public.email_settings;
DROP POLICY IF EXISTS "Authenticated can delete email settings" ON public.email_settings;

CREATE POLICY "Admins read email settings" ON public.email_settings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert email settings" ON public.email_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update email settings" ON public.email_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete email settings" ON public.email_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 4. email_templates -> admin-only
-- =========================================================
DROP POLICY IF EXISTS "Authenticated can read email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Authenticated can insert email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Authenticated can update email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Authenticated can delete email templates" ON public.email_templates;

CREATE POLICY "Admins read email templates" ON public.email_templates
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert email templates" ON public.email_templates
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update email templates" ON public.email_templates
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete email templates" ON public.email_templates
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 5. impulsa_contact_settings -> public read, admin write
-- =========================================================
DROP POLICY IF EXISTS "Authenticated can insert impulsa contact" ON public.impulsa_contact_settings;
DROP POLICY IF EXISTS "Authenticated can update impulsa contact" ON public.impulsa_contact_settings;
DROP POLICY IF EXISTS "Authenticated can delete impulsa contact" ON public.impulsa_contact_settings;

CREATE POLICY "Admins insert impulsa contact" ON public.impulsa_contact_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update impulsa contact" ON public.impulsa_contact_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete impulsa contact" ON public.impulsa_contact_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 6. impulsa_content_sections -> public read, admin write
-- =========================================================
DROP POLICY IF EXISTS "Authenticated can insert impulsa sections" ON public.impulsa_content_sections;
DROP POLICY IF EXISTS "Authenticated can update impulsa sections" ON public.impulsa_content_sections;
DROP POLICY IF EXISTS "Authenticated can delete impulsa sections" ON public.impulsa_content_sections;

CREATE POLICY "Admins insert impulsa sections" ON public.impulsa_content_sections
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update impulsa sections" ON public.impulsa_content_sections
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete impulsa sections" ON public.impulsa_content_sections
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 7. impulsa_donation_tiers -> public read, admin write
-- =========================================================
DROP POLICY IF EXISTS "Authenticated can insert impulsa tiers" ON public.impulsa_donation_tiers;
DROP POLICY IF EXISTS "Authenticated can update impulsa tiers" ON public.impulsa_donation_tiers;
DROP POLICY IF EXISTS "Authenticated can delete impulsa tiers" ON public.impulsa_donation_tiers;

CREATE POLICY "Admins insert impulsa tiers" ON public.impulsa_donation_tiers
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update impulsa tiers" ON public.impulsa_donation_tiers
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete impulsa tiers" ON public.impulsa_donation_tiers
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 8. impulsa_form_fields -> public read, admin write
-- =========================================================
DROP POLICY IF EXISTS "Authenticated can insert form fields" ON public.impulsa_form_fields;
DROP POLICY IF EXISTS "Authenticated can update form fields" ON public.impulsa_form_fields;
DROP POLICY IF EXISTS "Authenticated can delete form fields" ON public.impulsa_form_fields;

CREATE POLICY "Admins insert form fields" ON public.impulsa_form_fields
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update form fields" ON public.impulsa_form_fields
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete form fields" ON public.impulsa_form_fields
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 9. impulsa_impact_settings -> public read, admin write
-- =========================================================
DROP POLICY IF EXISTS "Authenticated can insert impact settings" ON public.impulsa_impact_settings;
DROP POLICY IF EXISTS "Authenticated can update impact settings" ON public.impulsa_impact_settings;
DROP POLICY IF EXISTS "Authenticated can delete impact settings" ON public.impulsa_impact_settings;

CREATE POLICY "Admins insert impact settings" ON public.impulsa_impact_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update impact settings" ON public.impulsa_impact_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete impact settings" ON public.impulsa_impact_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 10. impulsa_impact_updates -> public read (públicos), admin write
-- =========================================================
DROP POLICY IF EXISTS "Authenticated can insert impact updates" ON public.impulsa_impact_updates;
DROP POLICY IF EXISTS "Authenticated can update impact updates" ON public.impulsa_impact_updates;
DROP POLICY IF EXISTS "Authenticated can delete impact updates" ON public.impulsa_impact_updates;

CREATE POLICY "Admins insert impact updates" ON public.impulsa_impact_updates
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update impact updates" ON public.impulsa_impact_updates
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete impact updates" ON public.impulsa_impact_updates
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 11. impulsa_sponsors -> public insert OK, admin read/update/delete
-- =========================================================
DROP POLICY IF EXISTS "Authenticated can read sponsors" ON public.impulsa_sponsors;
DROP POLICY IF EXISTS "Authenticated can update sponsors" ON public.impulsa_sponsors;
DROP POLICY IF EXISTS "Authenticated can delete sponsors" ON public.impulsa_sponsors;

CREATE POLICY "Admins read sponsors" ON public.impulsa_sponsors
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update sponsors" ON public.impulsa_sponsors
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete sponsors" ON public.impulsa_sponsors
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 12. payment_provider_settings -> admin-only (tokens MP)
-- =========================================================
DROP POLICY IF EXISTS "Authenticated can read payment settings" ON public.payment_provider_settings;
DROP POLICY IF EXISTS "Authenticated can insert payment settings" ON public.payment_provider_settings;
DROP POLICY IF EXISTS "Authenticated can update payment settings" ON public.payment_provider_settings;
DROP POLICY IF EXISTS "Authenticated can delete payment settings" ON public.payment_provider_settings;

CREATE POLICY "Admins read payment settings" ON public.payment_provider_settings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert payment settings" ON public.payment_provider_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update payment settings" ON public.payment_provider_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete payment settings" ON public.payment_provider_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 13. site_content -> public read, admin write
-- =========================================================
DROP POLICY IF EXISTS "Authenticated can insert content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated can update content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated can delete content" ON public.site_content;

CREATE POLICY "Admins insert content" ON public.site_content
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update content" ON public.site_content
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete content" ON public.site_content
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
