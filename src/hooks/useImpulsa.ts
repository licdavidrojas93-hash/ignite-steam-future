import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ImpulsaSection {
  id: string;
  section_key: string;
  section_name: string;
  page_location: string | null;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  cta_primary_label: string | null;
  cta_primary_url: string | null;
  cta_secondary_label: string | null;
  cta_secondary_url: string | null;
  metadata: Record<string, unknown>;
  is_active: boolean;
  sort_order: number;
}

export interface ImpulsaTier {
  id: string;
  tier_key: string;
  title: string;
  description: string | null;
  amount: number | null;
  currency: string;
  cta_label: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface ImpulsaContact {
  id: string;
  website_url: string | null;
  instagram_url: string | null;
  contact_email: string | null;
  whatsapp_number: string | null;
  whatsapp_message: string | null;
  is_active: boolean;
}

export function useImpulsaSections() {
  const [data, setData] = useState<ImpulsaSection[] | null>(null);
  useEffect(() => {
    let active = true;
    (supabase as any)
      .from("impulsa_content_sections")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }: any) => {
        if (active) setData((data as ImpulsaSection[]) ?? []);
      });
    return () => {
      active = false;
    };
  }, []);
  return data;
}

export function useImpulsaTiers(activeOnly = true) {
  const [data, setData] = useState<ImpulsaTier[] | null>(null);
  useEffect(() => {
    let active = true;
    let q = (supabase as any)
      .from("impulsa_donation_tiers")
      .select("*")
      .order("sort_order", { ascending: true });
    if (activeOnly) q = q.eq("is_active", true);
    q.then(({ data }: any) => {
      if (active) setData((data as ImpulsaTier[]) ?? []);
    });
    return () => {
      active = false;
    };
  }, [activeOnly]);
  return data;
}

export function useImpulsaContact() {
  const [data, setData] = useState<ImpulsaContact | null>(null);
  useEffect(() => {
    let active = true;
    (supabase as any)
      .from("impulsa_contact_settings")
      .select("*")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }: any) => {
        if (active) setData((data as ImpulsaContact) ?? null);
      });
    return () => {
      active = false;
    };
  }, []);
  return data;
}
