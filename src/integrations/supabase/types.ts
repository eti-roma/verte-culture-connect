export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number | null
          tags: string[] | null
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      culture_parameters: {
        Row: {
          conductivity: number | null
          culture_name: string
          humidity: number | null
          id: string
          light_intensity: number | null
          ph_level: number | null
          recorded_at: string
          temperature: number | null
          user_id: string | null
        }
        Insert: {
          conductivity?: number | null
          culture_name: string
          humidity?: number | null
          id?: string
          light_intensity?: number | null
          ph_level?: number | null
          recorded_at?: string
          temperature?: number | null
          user_id?: string | null
        }
        Update: {
          conductivity?: number | null
          culture_name?: string
          humidity?: number | null
          id?: string
          light_intensity?: number | null
          ph_level?: number | null
          recorded_at?: string
          temperature?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      diseases_pests: {
        Row: {
          causes: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          prevention_tips: string[] | null
          severity_level: number | null
          symptoms: string[] | null
          treatments: string[] | null
          type: string
        }
        Insert: {
          causes?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          prevention_tips?: string[] | null
          severity_level?: number | null
          symptoms?: string[] | null
          treatments?: string[] | null
          type: string
        }
        Update: {
          causes?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          prevention_tips?: string[] | null
          severity_level?: number | null
          symptoms?: string[] | null
          treatments?: string[] | null
          type?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_analyses: {
        Row: {
          analysis_result: Json | null
          created_at: string
          health_score: number | null
          id: string
          image_url: string
          issues_detected: string[] | null
          recommendations: string[] | null
          user_id: string | null
        }
        Insert: {
          analysis_result?: Json | null
          created_at?: string
          health_score?: number | null
          id?: string
          image_url: string
          issues_detected?: string[] | null
          recommendations?: string[] | null
          user_id?: string | null
        }
        Update: {
          analysis_result?: Json | null
          created_at?: string
          health_score?: number | null
          id?: string
          image_url?: string
          issues_detected?: string[] | null
          recommendations?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      problem_reports: {
        Row: {
          created_at: string
          description: string
          disease_pest_id: string | null
          expert_response: string | null
          id: string
          image_url: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          disease_pest_id?: string | null
          expert_response?: string | null
          id?: string
          image_url?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          disease_pest_id?: string | null
          expert_response?: string | null
          id?: string
          image_url?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problem_reports_disease_pest_id_fkey"
            columns: ["disease_pest_id"]
            isOneToOne: false
            referencedRelation: "diseases_pests"
            referencedColumns: ["id"]
          },
        ]
      }
      producers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          description: string | null
          email: string | null
          equipment: string[] | null
          experience_years: number | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          rating: number | null
          region: string | null
          speciality: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          equipment?: string[] | null
          experience_years?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          rating?: number | null
          region?: string | null
          speciality?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          equipment?: string[] | null
          experience_years?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          rating?: number | null
          region?: string | null
          speciality?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      training_modules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_resources: {
        Row: {
          content: string | null
          created_at: string
          id: string
          section_id: string | null
          title: string
          type: string
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          section_id?: string | null
          title: string
          type: string
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          section_id?: string | null
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_resources_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "training_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      training_sections: {
        Row: {
          content: string | null
          created_at: string
          id: string
          module_id: string | null
          order_index: number
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          module_id?: string | null
          order_index?: number
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          module_id?: string | null
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_sections_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
