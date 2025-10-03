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
      cars: {
        Row: {
          id: string
          make: string
          model: string
          year_min: number
          year_max: number
          price_min: number | null
          price_max: number | null
          currency: string
          category: string
          fuel_type: string
          description_en: string | null
          description_zh: string | null
          pros_en: string[] | null
          pros_zh: string[] | null
          cons_en: string[] | null
          cons_zh: string[] | null
          features: string[] | null
          image_url: string | null
          reliability_score: number | null
          fuel_economy: number | null
          safety_rating: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          make: string
          model: string
          year_min: number
          year_max: number
          price_min?: number | null
          price_max?: number | null
          currency?: string
          category: string
          fuel_type: string
          description_en?: string | null
          description_zh?: string | null
          pros_en?: string[] | null
          pros_zh?: string[] | null
          cons_en?: string[] | null
          cons_zh?: string[] | null
          features?: string[] | null
          image_url?: string | null
          reliability_score?: number | null
          fuel_economy?: number | null
          safety_rating?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          make?: string
          model?: string
          year_min?: number
          year_max?: number
          price_min?: number | null
          price_max?: number | null
          currency?: string
          category?: string
          fuel_type?: string
          description_en?: string | null
          description_zh?: string | null
          pros_en?: string[] | null
          pros_zh?: string[] | null
          cons_en?: string[] | null
          cons_zh?: string[] | null
          features?: string[] | null
          image_url?: string | null
          reliability_score?: number | null
          fuel_economy?: number | null
          safety_rating?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          user_id: string | null
          title: string | null
          summary: string | null
          language: string
          session_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title?: string | null
          summary?: string | null
          language: string
          session_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string | null
          summary?: string | null
          language?: string
          session_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          type: string
          content: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          type: string
          content: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          type?: string
          content?: string
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          }
        ]
      }
      next_steps: {
        Row: {
          id: string
          conversation_id: string
          message_id: string
          title_en: string
          title_zh: string
          description_en: string | null
          description_zh: string | null
          priority: string
          action_type: string
          url: string | null
          metadata: Json | null
          is_completed: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          message_id: string
          title_en: string
          title_zh: string
          description_en?: string | null
          description_zh?: string | null
          priority: string
          action_type: string
          url?: string | null
          metadata?: Json | null
          is_completed?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          message_id?: string
          title_en?: string
          title_zh?: string
          description_en?: string | null
          description_zh?: string | null
          priority?: string
          action_type?: string
          url?: string | null
          metadata?: Json | null
          is_completed?: boolean | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "next_steps_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "next_steps_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          }
        ]
      }
      recommendations: {
        Row: {
          id: string
          conversation_id: string
          message_id: string
          car_id: string
          match_score: number
          reasoning_en: string | null
          reasoning_zh: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          message_id: string
          car_id: string
          match_score: number
          reasoning_en?: string | null
          reasoning_zh?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          message_id?: string
          car_id?: string
          match_score?: number
          reasoning_en?: string | null
          reasoning_zh?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string | null
          name: string | null
          language: string
          session_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          name?: string | null
          language?: string
          session_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          language?: string
          session_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      popular_cars: {
        Row: {
          id: string
          make: string
          model: string
          year_min: number
          year_max: number
          price_min: number | null
          price_max: number | null
          currency: string
          category: string
          fuel_type: string
          description_en: string | null
          description_zh: string | null
          pros_en: string[] | null
          pros_zh: string[] | null
          cons_en: string[] | null
          cons_zh: string[] | null
          features: string[] | null
          image_url: string | null
          reliability_score: number | null
          fuel_economy: number | null
          safety_rating: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Relationships: []
      }
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

