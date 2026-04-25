import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { DEFAULTS, mergeContent, type SectionKey, type SiteContentMap } from "@/lib/siteContent";

interface Props<K extends SectionKey> {
  sectionKey: K;
  title: string;
  children: (
    value: SiteContentMap[K],
    update: <F extends keyof SiteContentMap[K]>(field: F, val: SiteContentMap[K][F]) => void,
  ) => ReactNode;
}

/**
 * Cargador/guardador genérico de una sección.
 * Hace upsert sobre site_content (section_key + data jsonb).
 */
function SectionEditor<K extends SectionKey>({ sectionKey, title, children }: Props<K>) {
  const [value, setValue] = useState<SiteContentMap[K]>(DEFAULTS[sectionKey]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_content")
      .select("data")
      .eq("section_key", sectionKey)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (data?.data) setValue(mergeContent(sectionKey, data.data));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [sectionKey]);

  const update = <F extends keyof SiteContentMap[K]>(field: F, val: SiteContentMap[K][F]) => {
    setValue((prev) => ({ ...prev, [field]: val }));
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_content")
      .upsert([{ section_key: sectionKey, data: value as unknown as Record<string, unknown> }]);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Cambios guardados ✓");
  };

  if (loading) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">{title}</h3>
        <Button variant="hero" onClick={save} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar"}
        </Button>
      </div>
      <div className="space-y-4 rounded-2xl bg-card p-6 shadow-soft">{children(value, update)}</div>
    </div>
  );
}

export default SectionEditor;
