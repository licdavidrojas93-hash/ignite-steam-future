import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(6);
      setPosts((data as Post[]) ?? []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section id="blog" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-art">Notas y novedades</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            Lo último de <span className="text-gradient-warm">Niños STEAM</span>
          </h2>
        </div>

        {loading ? (
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">Pronto publicaremos novedades.</p>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-medium"
              >
                <div className="aspect-video overflow-hidden bg-gradient-hero">
                  {p.cover_image_url && (
                    <img
                      src={p.cover_image_url}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {p.published_at && (
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(p.published_at).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  <h3 className="mt-3 font-display text-xl leading-snug">{p.title}</h3>
                  {p.excerpt && <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>}
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Leer nota <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
