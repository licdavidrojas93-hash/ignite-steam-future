-- Tabla flexible key/value para contenido del sitio
CREATE TABLE public.site_content (
  section_key TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Lectura pública (el sitio necesita mostrar el contenido a todos)
CREATE POLICY "Public can read site content"
ON public.site_content FOR SELECT
TO public USING (true);

-- Solo admins autenticados pueden modificar
CREATE POLICY "Authenticated can insert content"
ON public.site_content FOR INSERT
TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update content"
ON public.site_content FOR UPDATE
TO authenticated USING (true);

CREATE POLICY "Authenticated can delete content"
ON public.site_content FOR DELETE
TO authenticated USING (true);

-- Trigger updated_at (reusa la función existente set_updated_at)
CREATE TRIGGER set_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Bucket público para imágenes del sitio
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true);

-- Lectura pública de imágenes
CREATE POLICY "Public can view site images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

-- Solo admins autenticados pueden subir/modificar/borrar
CREATE POLICY "Authenticated can upload site images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Authenticated can update site images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated can delete site images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-images');