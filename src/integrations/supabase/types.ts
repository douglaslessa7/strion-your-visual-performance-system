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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assistant_conversations: {
        Row: {
          created_at: string
          id: string
          messages: Json
          mode: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          mode?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          mode?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_execution: {
        Row: {
          completed_tasks: Json
          created_at: string
          date: string
          execution_score: number
          id: string
          user_id: string
        }
        Insert: {
          completed_tasks?: Json
          created_at?: string
          date?: string
          execution_score?: number
          id?: string
          user_id: string
        }
        Update: {
          completed_tasks?: Json
          created_at?: string
          date?: string
          execution_score?: number
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      index_history: {
        Row: {
          created_at: string
          date: string
          execution_component: number
          id: string
          index_value: number
          metadata: Json | null
          structural_component: number
          user_id: string
          visual_component: number
        }
        Insert: {
          created_at?: string
          date?: string
          execution_component?: number
          id?: string
          index_value: number
          metadata?: Json | null
          structural_component?: number
          user_id: string
          visual_component?: number
        }
        Update: {
          created_at?: string
          date?: string
          execution_component?: number
          id?: string
          index_value?: number
          metadata?: Json | null
          structural_component?: number
          user_id?: string
          visual_component?: number
        }
        Relationships: []
      }
      photo_sets: {
        Row: {
          body_back_url: string | null
          body_front_url: string | null
          body_side_alt_url: string | null
          body_side_url: string | null
          checkpoint_day: number
          created_at: string
          id: string
          metadata: Json | null
          selfie_front_url: string | null
          selfie_side_alt_url: string | null
          selfie_side_url: string | null
          user_id: string
        }
        Insert: {
          body_back_url?: string | null
          body_front_url?: string | null
          body_side_alt_url?: string | null
          body_side_url?: string | null
          checkpoint_day?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          selfie_front_url?: string | null
          selfie_side_alt_url?: string | null
          selfie_side_url?: string | null
          user_id: string
        }
        Update: {
          body_back_url?: string | null
          body_front_url?: string | null
          body_side_alt_url?: string | null
          body_side_url?: string | null
          checkpoint_day?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          selfie_front_url?: string | null
          selfie_side_alt_url?: string | null
          selfie_side_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          current_index: number | null
          current_phase: string | null
          current_week: number | null
          display_name: string | null
          id: string
          max_potential: number | null
          onboarding_completed: boolean
          protocol_start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_index?: number | null
          current_phase?: string | null
          current_week?: number | null
          display_name?: string | null
          id: string
          max_potential?: number | null
          onboarding_completed?: boolean
          protocol_start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_index?: number | null
          current_phase?: string | null
          current_week?: number | null
          display_name?: string | null
          id?: string
          max_potential?: number | null
          onboarding_completed?: boolean
          protocol_start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      protocol_assignments: {
        Row: {
          created_at: string
          id: string
          phase: string
          tasks: Json
          updated_at: string
          user_id: string
          week: number
        }
        Insert: {
          created_at?: string
          id?: string
          phase?: string
          tasks?: Json
          updated_at?: string
          user_id: string
          week?: number
        }
        Update: {
          created_at?: string
          id?: string
          phase?: string
          tasks?: Json
          updated_at?: string
          user_id?: string
          week?: number
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          checkpoint_day: number
          created_at: string
          id: string
          responses: Json
          user_id: string
        }
        Insert: {
          checkpoint_day?: number
          created_at?: string
          id?: string
          responses?: Json
          user_id: string
        }
        Update: {
          checkpoint_day?: number
          created_at?: string
          id?: string
          responses?: Json
          user_id?: string
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
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
