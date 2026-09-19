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
      checkins: {
        Row: {
          anonymous_session_id: string | null
          checked_in_at: string
          created_at: string
          distance_at_checkin: number | null
          id: string
          neighborhood: string | null
          resource_category: string | null
          resource_id: string | null
          resource_slug: string | null
          source: string
          status: string
          user_id: string | null
          verification_method: string
        }
        Insert: {
          anonymous_session_id?: string | null
          checked_in_at?: string
          created_at?: string
          distance_at_checkin?: number | null
          id?: string
          neighborhood?: string | null
          resource_category?: string | null
          resource_id?: string | null
          resource_slug?: string | null
          source?: string
          status: string
          user_id?: string | null
          verification_method: string
        }
        Update: {
          anonymous_session_id?: string | null
          checked_in_at?: string
          created_at?: string
          distance_at_checkin?: number | null
          id?: string
          neighborhood?: string | null
          resource_category?: string | null
          resource_id?: string | null
          resource_slug?: string | null
          source?: string
          status?: string
          user_id?: string | null
          verification_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkins_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      community_reports: {
        Row: {
          anonymous_session_id: string | null
          corroborations: number
          created_at: string
          detail: string | null
          id: string
          kind: string
          neighborhood: string | null
          status: string
          title: string
          user_id: string | null
          zip: string | null
        }
        Insert: {
          anonymous_session_id?: string | null
          corroborations?: number
          created_at?: string
          detail?: string | null
          id?: string
          kind: string
          neighborhood?: string | null
          status?: string
          title: string
          user_id?: string | null
          zip?: string | null
        }
        Update: {
          anonymous_session_id?: string | null
          corroborations?: number
          created_at?: string
          detail?: string | null
          id?: string
          kind?: string
          neighborhood?: string | null
          status?: string
          title?: string
          user_id?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      engagement_events: {
        Row: {
          anonymous_session_id: string | null
          created_at: string
          event_type: string
          id: string
          neighborhood: string | null
          resource_category: string | null
          resource_id: string | null
          resource_slug: string | null
          user_id: string | null
        }
        Insert: {
          anonymous_session_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          neighborhood?: string | null
          resource_category?: string | null
          resource_id?: string | null
          resource_slug?: string | null
          user_id?: string | null
        }
        Update: {
          anonymous_session_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          neighborhood?: string | null
          resource_category?: string | null
          resource_id?: string | null
          resource_slug?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_events_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          accessibility_information: string | null
          active: boolean
          address: string | null
          address_verified: boolean
          category: string
          city: string | null
          coordinate_accuracy: string | null
          coordinate_precision: string
          coordinate_source: string | null
          created_at: string
          description: string | null
          eligibility: string | null
          fallback_latitude: number | null
          fallback_longitude: number | null
          hours: string | null
          id: string
          is_official: boolean
          last_geocoded_at: string | null
          last_verified_at: string | null
          latitude: number | null
          longitude: number | null
          manual_review_status: string
          name: string
          neighborhood: string | null
          phone: string | null
          phone_source: string | null
          phone_verified: boolean
          phone_verified_at: string | null
          routable_latitude: number | null
          routable_longitude: number | null
          slug: string | null
          source_name: string | null
          source_type: string | null
          source_url: string | null
          state: string | null
          subcategory: string | null
          transportation_information: string | null
          updated_at: string
          website_url: string | null
          zip: string | null
        }
        Insert: {
          accessibility_information?: string | null
          active?: boolean
          address?: string | null
          address_verified?: boolean
          category: string
          city?: string | null
          coordinate_accuracy?: string | null
          coordinate_precision?: string
          coordinate_source?: string | null
          created_at?: string
          description?: string | null
          eligibility?: string | null
          fallback_latitude?: number | null
          fallback_longitude?: number | null
          hours?: string | null
          id?: string
          is_official?: boolean
          last_geocoded_at?: string | null
          last_verified_at?: string | null
          latitude?: number | null
          longitude?: number | null
          manual_review_status?: string
          name: string
          neighborhood?: string | null
          phone?: string | null
          phone_source?: string | null
          phone_verified?: boolean
          phone_verified_at?: string | null
          routable_latitude?: number | null
          routable_longitude?: number | null
          slug?: string | null
          source_name?: string | null
          source_type?: string | null
          source_url?: string | null
          state?: string | null
          subcategory?: string | null
          transportation_information?: string | null
          updated_at?: string
          website_url?: string | null
          zip?: string | null
        }
        Update: {
          accessibility_information?: string | null
          active?: boolean
          address?: string | null
          address_verified?: boolean
          category?: string
          city?: string | null
          coordinate_accuracy?: string | null
          coordinate_precision?: string
          coordinate_source?: string | null
          created_at?: string
          description?: string | null
          eligibility?: string | null
          fallback_latitude?: number | null
          fallback_longitude?: number | null
          hours?: string | null
          id?: string
          is_official?: boolean
          last_geocoded_at?: string | null
          last_verified_at?: string | null
          latitude?: number | null
          longitude?: number | null
          manual_review_status?: string
          name?: string
          neighborhood?: string | null
          phone?: string | null
          phone_source?: string | null
          phone_verified?: boolean
          phone_verified_at?: string | null
          routable_latitude?: number | null
          routable_longitude?: number | null
          slug?: string | null
          source_name?: string | null
          source_type?: string | null
          source_url?: string | null
          state?: string | null
          subcategory?: string | null
          transportation_information?: string | null
          updated_at?: string
          website_url?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      saved_locations: {
        Row: {
          area_kind: string
          created_at: string
          id: string
          label: string
          neighborhood: string | null
          updated_at: string
          user_id: string
          zip: string | null
        }
        Insert: {
          area_kind?: string
          created_at?: string
          id?: string
          label: string
          neighborhood?: string | null
          updated_at?: string
          user_id?: string
          zip?: string | null
        }
        Update: {
          area_kind?: string
          created_at?: string
          id?: string
          label?: string
          neighborhood?: string | null
          updated_at?: string
          user_id?: string
          zip?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          accessibility_preferences: Json
          alert_radius_miles: number | null
          created_at: string
          interests: string[]
          neighborhood: string | null
          transportation_preferences: string[]
          updated_at: string
          user_id: string
          zip: string | null
        }
        Insert: {
          accessibility_preferences?: Json
          alert_radius_miles?: number | null
          created_at?: string
          interests?: string[]
          neighborhood?: string | null
          transportation_preferences?: string[]
          updated_at?: string
          user_id?: string
          zip?: string | null
        }
        Update: {
          accessibility_preferences?: Json
          alert_radius_miles?: number | null
          created_at?: string
          interests?: string[]
          neighborhood?: string | null
          transportation_preferences?: string[]
          updated_at?: string
          user_id?: string
          zip?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      impact_by_category: {
        Args: never
        Returns: {
          category: string
          checkins: number
          views: number
        }[]
      }
      impact_totals: {
        Args: never
        Returns: {
          get_there_clicks: number
          resource_views: number
          self_reported_checkins: number
          verified_checkins: number
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
    Enums: {},
  },
} as const
