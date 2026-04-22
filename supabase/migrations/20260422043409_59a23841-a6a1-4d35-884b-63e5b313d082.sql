-- Tabla de blogs/notas
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author TEXT DEFAULT 'Niños STEAM',
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Cualquier visitante puede leer publicados
CREATE POLICY "Public can read published posts"
ON public.blog_posts FOR SELECT
USING (published = true);

-- Usuarios autenticados (admin) pueden ver todos
CREATE POLICY "Authenticated can read all posts"
ON public.blog_posts FOR SELECT
TO authenticated
USING (true);

-- Solo autenticados pueden crear/actualizar/eliminar
CREATE POLICY "Authenticated can insert posts"
ON public.blog_posts FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated can update posts"
ON public.blog_posts FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated can delete posts"
ON public.blog_posts FOR DELETE
TO authenticated
USING (true);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Datos de muestra
INSERT INTO public.blog_posts (title, slug, excerpt, content, published, published_at, cover_image_url) VALUES
('Hermosillo impulsa la ciencia en niños con programa STEAM gratuito', 'hermosillo-steam-gratuito',
 'Niños STEAM lleva talleres gratuitos de ciencia, tecnología y arte a colonias y al Centro Ecológico Kino.',
 'En alianza con autoridades locales y aliados sociales, Niños STEAM ha llevado talleres gratuitos a niñas y niños de distintas colonias de Hermosillo. La iniciativa busca despertar la curiosidad científica y el pensamiento creativo desde edades tempranas, acercando la educación STEAM a quienes más la necesitan.',
 true, now(), null),
('¿Por qué la educación STEAM?', 'por-que-steam',
 'Ciencia, Tecnología, Ingeniería, Arte y Matemáticas: las habilidades del futuro empiezan jugando hoy.',
 'STEAM es mucho más que materias escolares. Es una manera de mirar el mundo: hacer preguntas, experimentar, fallar, mejorar. En Niños STEAM creemos que toda niña y niño merece la oportunidad de descubrir su capacidad para crear y resolver.',
 true, now() - interval '7 days', null);