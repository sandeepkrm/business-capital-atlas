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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string
          page: string | null
          status: string
          visitor_email: string | null
          visitor_name: string | null
          visitor_token: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string
          page?: string | null
          status?: string
          visitor_email?: string | null
          visitor_name?: string | null
          visitor_token: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string
          page?: string | null
          status?: string
          visitor_email?: string | null
          visitor_name?: string | null
          visitor_token?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_knowledge: {
        Row: {
          active: boolean
          content: string
          created_at: string
          id: string
          kind: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          content?: string
          created_at?: string
          id?: string
          kind?: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          content?: string
          created_at?: string
          id?: string
          kind?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_pages: {
        Row: {
          author: string | null
          body: string
          category: string | null
          created_at: string
          excerpt: string | null
          eyebrow: string | null
          hero_image_url: string | null
          id: string
          kind: string
          published: boolean
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          body?: string
          category?: string | null
          created_at?: string
          excerpt?: string | null
          eyebrow?: string | null
          hero_image_url?: string | null
          id?: string
          kind?: string
          published?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          body?: string
          category?: string | null
          created_at?: string
          excerpt?: string | null
          eyebrow?: string | null
          hero_image_url?: string | null
          id?: string
          kind?: string
          published?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          amount: string | null
          business_type: string | null
          company: string | null
          consent: boolean
          created_at: string
          email: string
          full_name: string
          funding_purpose: string | null
          id: string
          message: string | null
          phone: string | null
          source_page: string | null
          status: string
          time_trading: string | null
          turnover: string | null
        }
        Insert: {
          amount?: string | null
          business_type?: string | null
          company?: string | null
          consent?: boolean
          created_at?: string
          email: string
          full_name: string
          funding_purpose?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          source_page?: string | null
          status?: string
          time_trading?: string | null
          turnover?: string | null
        }
        Update: {
          amount?: string | null
          business_type?: string | null
          company?: string | null
          consent?: boolean
          created_at?: string
          email?: string
          full_name?: string
          funding_purpose?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          source_page?: string | null
          status?: string
          time_trading?: string | null
          turnover?: string | null
        }
        Relationships: []
      }
      lenders: {
        Row: {
          apply_url: string | null
          checked_at: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          logo_url: string | null
          max_amount: string | null
          min_amount: string | null
          name: string
          products: string[]
          rate_from: string | null
          relationship: string
          sort_order: number
          source_url: string | null
          speed: string | null
          term: string | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          apply_url?: string | null
          checked_at?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          logo_url?: string | null
          max_amount?: string | null
          min_amount?: string | null
          name: string
          products?: string[]
          rate_from?: string | null
          relationship?: string
          sort_order?: number
          source_url?: string | null
          speed?: string | null
          term?: string | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          apply_url?: string | null
          checked_at?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          logo_url?: string | null
          max_amount?: string | null
          min_amount?: string | null
          name?: string
          products?: string[]
          rate_from?: string | null
          relationship?: string
          sort_order?: number
          source_url?: string | null
          speed?: string | null
          term?: string | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      nav_items: {
        Row: {
          href: string
          id: string
          label: string
          menu: string
          section: string | null
          sort_order: number
          visible: boolean
        }
        Insert: {
          href: string
          id?: string
          label: string
          menu: string
          section?: string | null
          sort_order?: number
          visible?: boolean
        }
        Update: {
          href?: string
          id?: string
          label?: string
          menu?: string
          section?: string | null
          sort_order?: number
          visible?: boolean
        }
        Relationships: []
      }
      partner_applications: {
        Row: {
          company: string
          consent: boolean
          created_at: string
          email: string
          fca_number: string | null
          full_name: string
          id: string
          message: string | null
          partner_type: string | null
          phone: string | null
          status: string
          website: string | null
        }
        Insert: {
          company: string
          consent?: boolean
          created_at?: string
          email: string
          fca_number?: string | null
          full_name: string
          id?: string
          message?: string | null
          partner_type?: string | null
          phone?: string | null
          status?: string
          website?: string | null
        }
        Update: {
          company?: string
          consent?: boolean
          created_at?: string
          email?: string
          fca_number?: string | null
          full_name?: string
          id?: string
          message?: string | null
          partner_type?: string | null
          phone?: string | null
          status?: string
          website?: string | null
        }
        Relationships: []
      }
      seo_overrides: {
        Row: {
          description: string | null
          noindex: boolean
          og_image_url: string | null
          path: string
          title: string | null
          updated_at: string
        }
        Insert: {
          description?: string | null
          noindex?: boolean
          og_image_url?: string | null
          path: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          description?: string | null
          noindex?: boolean
          og_image_url?: string | null
          path?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          company_history: string | null
          company_name: string | null
          company_number: string | null
          company_services: string | null
          email: string | null
          fca_number: string | null
          fca_status: string | null
          id: number
          phone: string | null
          principal_firm: string | null
          registered_address: string | null
          social: Json
          trading_name: string | null
          updated_at: string
        }
        Insert: {
          company_history?: string | null
          company_name?: string | null
          company_number?: string | null
          company_services?: string | null
          email?: string | null
          fca_number?: string | null
          fca_status?: string | null
          id?: number
          phone?: string | null
          principal_firm?: string | null
          registered_address?: string | null
          social?: Json
          trading_name?: string | null
          updated_at?: string
        }
        Update: {
          company_history?: string | null
          company_name?: string | null
          company_number?: string | null
          company_services?: string | null
          email?: string | null
          fca_number?: string | null
          fca_status?: string | null
          id?: number
          phone?: string | null
          principal_firm?: string | null
          registered_address?: string | null
          social?: Json
          trading_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_flow_settings: {
        Row: {
          ai_enabled: boolean
          handover_message: string
          id: number
          knowledge_kinds: string[]
          team_message: string
          updated_at: string
        }
        Insert: {
          ai_enabled?: boolean
          handover_message?: string
          id?: number
          knowledge_kinds?: string[]
          team_message?: string
          updated_at?: string
        }
        Update: {
          ai_enabled?: boolean
          handover_message?: string
          id?: number
          knowledge_kinds?: string[]
          team_message?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const
