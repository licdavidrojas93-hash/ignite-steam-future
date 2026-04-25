import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULTS,
  mergeContent,
  type SectionKey,
  type SiteContentMap,
} from "@/lib/siteContent";

/**
 * Lee el contenido de una sección desde la BD.
 * Si no hay fila aún, devuelve los valores por defecto (el sitio nunca se ve vacío).
 */
export function useSiteContent<K extends SectionKey>(key: K): SiteContentMap[K] {
  const [content, setContent] = useState<SiteContentMap[K]>(DEFAULTS[key]);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_content")
      .select("data")
      .eq("section_key", key)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (data?.data) setContent(mergeContent(key, data.data));
      });
    return () => {
      active = false;
    };
  }, [key]);

  return content;
}
