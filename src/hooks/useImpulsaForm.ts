import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ImpulsaFormField {
  id: string;
  field_key: string;
  label: string;
  placeholder: string | null;
  helper_text: string | null;
  field_type: string | null;
  is_required: boolean;
  is_active: boolean;
  options: unknown;
  sort_order: number;
}

export function useImpulsaFormFields(activeOnly = true) {
  const [data, setData] = useState<ImpulsaFormField[] | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    let active = true;
    let q = (supabase as any)
      .from("impulsa_form_fields")
      .select("*")
      .order("sort_order", { ascending: true });
    if (activeOnly) q = q.eq("is_active", true);
    q.then(({ data }: any) => {
      if (active) setData((data as ImpulsaFormField[]) ?? []);
    });
    return () => {
      active = false;
    };
  }, [activeOnly, reloadKey]);
  return { data, reload: () => setReloadKey((k) => k + 1) };
}

export function fieldByKey(fields: ImpulsaFormField[] | null, key: string) {
  return fields?.find((f) => f.field_key === key);
}
