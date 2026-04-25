import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  /** Subcarpeta lógica dentro del bucket (ej: "team", "programs", "hero") */
  folder?: string;
}

const ImageUploader = ({ value, onChange, label, folder = "general" }: Props) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen es demasiado grande (máx 5MB)");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("site-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Imagen subida");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}
      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-white hover:bg-foreground"
              aria-label="Quitar"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 text-xs text-muted-foreground">
            Sin imagen
          </div>
        )}
        <div className="flex-1 space-y-2">
          <Input
            type="url"
            placeholder="https://… (o sube una imagen)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <div>
            <input ref={fileInput} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
            >
              <Upload className="mr-1 h-3.5 w-3.5" />
              {uploading ? "Subiendo..." : "Subir imagen"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
