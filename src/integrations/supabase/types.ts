export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_settings: {
        Row: {
          api_key: string | null
          created_at: string
          from_email: string | null
          from_name: string | null
          id: string
          is_active: boolean
          notes: string | null
          provider: string
          reply_to: string | null
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          from_email?: string | null
          from_name?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          provider?: string
          reply_to?: string | null
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          created_at?: string
          from_email?: string | null
          from_name?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          provider?: string
          reply_to?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_active: boolean
          subject: string | null
          template_key: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          subject?: string | null
          template_key: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          subject?: string | null
          template_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      impulsa_contact_settings: {
        Row: {
          contact_email: string | null
          id: string
          instagram_url: string | null
          is_active: boolean
          updated_at: string
          website_url: string | null
          whatsapp_message: string | null
          whatsapp_number: string | null
        }
        Insert: {
          contact_email?: string | null
          id?: string
          instagram_url?: string | null
          is_active?: boolean
          updated_at?: string
          website_url?: string | null
          whatsapp_message?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          contact_email?: string | null
          id?: string
          instagram_url?: string | null
          is_active?: boolean
          updated_at?: string
          website_url?: string | null
          whatsapp_message?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      impulsa_content_sections: {
        Row: {
          body: string | null
          created_at: string
          cta_primary_label: string | null
          cta_primary_url: string | null
          cta_secondary_label: string | null
          cta_secondary_url: string | null
          eyebrow: string | null
          id: string
          is_active: boolean
          metadata: Json
          page_location: string | null
          section_key: string
          section_name: string
          sort_order: number
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          cta_primary_label?: string | null
          cta_primary_url?: string | null
          cta_secondary_label?: string | null
          cta_secondary_url?: string | null
          eyebrow?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          page_location?: string | null
          section_key: string
          section_name: string
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          cta_primary_label?: string | null
          cta_primary_url?: string | null
          cta_secondary_label?: string | null
          cta_secondary_url?: string | null
          eyebrow?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          page_location?: string | null
          section_key?: string
          section_name?: string
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      impulsa_donation_tiers: {
        Row: {
          amount: number | null
          created_at: string
          cta_label: string | null
          currency: string
          description: string | null
          id: string
          is_active: boolean
          sort_order: number
          tier_key: string
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          cta_label?: string | null
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          tier_key: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          cta_label?: string | null
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          tier_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      impulsa_form_fields: {
        Row: {
          created_at: string
          field_key: string
          field_type: string | null
          helper_text: string | null
          id: string
          is_active: boolean | null
          is_required: boolean | null
          label: string
          options: Json | null
          placeholder: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_key: string
          field_type?: string | null
          helper_text?: string | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          label: string
          options?: Json | null
          placeholder?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_key?: string
          field_type?: string | null
          helper_text?: string | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          label?: string
          options?: Json | null
          placeholder?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      impulsa_impact_settings: {
        Row: {
          beneficiaries_override: number | null
          experiences_override: number | null
          goal_amount: number | null
          goal_currency: string | null
          id: string
          show_beneficiaries: boolean
          show_experiences: boolean
          show_goal_progress: boolean
          show_sponsors_count: boolean
          show_steam_days: boolean
          show_total_raised: boolean
          steam_days_override: number | null
          updated_at: string
        }
        Insert: {
          beneficiaries_override?: number | null
          experiences_override?: number | null
          goal_amount?: number | null
          goal_currency?: string | null
          id?: string
          show_beneficiaries?: boolean
          show_experiences?: boolean
          show_goal_progress?: boolean
          show_sponsors_count?: boolean
          show_steam_days?: boolean
          show_total_raised?: boolean
          steam_days_override?: number | null
          updated_at?: string
        }
        Update: {
          beneficiaries_override?: number | null
          experiences_override?: number | null
          goal_amount?: number | null
          goal_currency?: string | null
          id?: string
          show_beneficiaries?: boolean
          show_experiences?: boolean
          show_goal_progress?: boolean
          show_sponsors_count?: boolean
          show_steam_days?: boolean
          show_total_raised?: boolean
          steam_days_override?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      impulsa_impact_updates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          media_url: string | null
          sort_order: number
          title: string | null
          update_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          media_url?: string | null
          sort_order?: number
          title?: string | null
          update_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          media_url?: string | null
          sort_order?: number
          title?: string | null
          update_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      impulsa_sponsors: {
        Row: {
          admin_notes: string | null
          amount: number | null
          checkout_url: string | null
          city: string | null
          created_at: string
          currency: string | null
          email: string | null
          email_sent: boolean | null
          email_sent_at: string | null
          id: string
          in_kind_description: string | null
          mercado_pago_payment_id: string | null
          mercado_pago_preference_id: string | null
          mercado_pago_status_detail: string | null
          message: string | null
          paid_at: string | null
          participation_type: string | null
          payment_method_id: string | null
          payment_provider: string | null
          payment_reference: string | null
          payment_status: string | null
          phone: string | null
          public_display_name: string | null
          public_wall_opt_in: boolean | null
          sponsor_name: string
          sponsor_type: string | null
          state: string | null
          terms_accepted: boolean | null
          updated_at: string
          visible_on_wall: boolean | null
          webhook_last_received_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount?: number | null
          checkout_url?: string | null
          city?: string | null
          created_at?: string
          currency?: string | null
          email?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          in_kind_description?: string | null
          mercado_pago_payment_id?: string | null
          mercado_pago_preference_id?: string | null
          mercado_pago_status_detail?: string | null
          message?: string | null
          paid_at?: string | null
          participation_type?: string | null
          payment_method_id?: string | null
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          phone?: string | null
          public_display_name?: string | null
          public_wall_opt_in?: boolean | null
          sponsor_name: string
          sponsor_type?: string | null
          state?: string | null
          terms_accepted?: boolean | null
          updated_at?: string
          visible_on_wall?: boolean | null
          webhook_last_received_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number | null
          checkout_url?: string | null
          city?: string | null
          created_at?: string
          currency?: string | null
          email?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          in_kind_description?: string | null
          mercado_pago_payment_id?: string | null
          mercado_pago_preference_id?: string | null
          mercado_pago_status_detail?: string | null
          message?: string | null
          paid_at?: string | null
          participation_type?: string | null
          payment_method_id?: string | null
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          phone?: string | null
          public_display_name?: string | null
          public_wall_opt_in?: boolean | null
          sponsor_name?: string
          sponsor_type?: string | null
          state?: string | null
          terms_accepted?: boolean | null
          updated_at?: string
          visible_on_wall?: boolean | null
          webhook_last_received_at?: string | null
        }
        Relationships: []
      }
      payment_provider_settings: {
        Row: {
          created_at: string
          environment: string
          id: string
          is_active: boolean
          notes: string | null
          production_access_token: string | null
          production_public_key: string | null
          provider: string
          site_url: string
          test_access_token: string | null
          test_public_key: string | null
          updated_at: string
          webhook_secret: string | null
        }
        Insert: {
          created_at?: string
          environment?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          production_access_token?: string | null
          production_public_key?: string | null
          provider?: string
          site_url?: string
          test_access_token?: string | null
          test_public_key?: string | null
          updated_at?: string
          webhook_secret?: string | null
        }
        Update: {
          created_at?: string
          environment?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          production_access_token?: string | null
          production_public_key?: string | null
          provider?: string
          site_url?: string
          test_access_token?: string | null
          test_public_key?: string | null
          updated_at?: string
          webhook_secret?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          data: Json
          section_key: string
          updated_at: string
        }
        Insert: {
          data?: Json
          section_key: string
          updated_at?: string
        }
        Update: {
          data?: Json
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_impulsa_sponsors_wall: {
        Row: {
          created_at: string | null
          id: string | null
          message: string | null
          public_display_name: string | null
          sponsor_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          message?: string | null
          public_display_name?: string | null
          sponsor_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          message?: string | null
          public_display_name?: string | null
          sponsor_type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_impulsa_public_stats: {
        Args: never
        Returns: {
          sponsors_count: number
          total_raised: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
