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
      careers: {
        Row: {
          apply_link: string | null
          created_at: string | null
          department: string
          description: string
          id: string
          location: string
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          apply_link?: string | null
          created_at?: string | null
          department: string
          description: string
          id?: string
          location: string
          status?: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          apply_link?: string | null
          created_at?: string | null
          department?: string
          description?: string
          id?: string
          location?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          annual_import_volume: string | null
          business_type: string | null
          created_at: string | null
          id: string
          import_experience: boolean | null
          industry_sector: string | null
          preferred_payment_terms: string[] | null
          required_certifications: string[] | null
          target_markets: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          annual_import_volume?: string | null
          business_type?: string | null
          created_at?: string | null
          id?: string
          import_experience?: boolean | null
          industry_sector?: string | null
          preferred_payment_terms?: string[] | null
          required_certifications?: string[] | null
          target_markets?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          annual_import_volume?: string | null
          business_type?: string | null
          created_at?: string | null
          id?: string
          import_experience?: boolean | null
          industry_sector?: string | null
          preferred_payment_terms?: string[] | null
          required_certifications?: string[] | null
          target_markets?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturer_partnerships: {
        Row: {
          additional_info: string | null
          address: string | null
          annual_turnover: string | null
          certifications: string | null
          city: string | null
          company_name: string
          country: string | null
          created_at: string
          email: string
          export_experience: string | null
          gstin: string
          id: string
          manufacturing_capacity: string | null
          phone: string
          previous_deals: string | null
          product_category: string | null
          representative_name: string
          state: string | null
          status: string
          target_markets: string | null
          updated_at: string
          years_in_business: number | null
        }
        Insert: {
          additional_info?: string | null
          address?: string | null
          annual_turnover?: string | null
          certifications?: string | null
          city?: string | null
          company_name: string
          country?: string | null
          created_at?: string
          email: string
          export_experience?: string | null
          gstin: string
          id?: string
          manufacturing_capacity?: string | null
          phone: string
          previous_deals?: string | null
          product_category?: string | null
          representative_name: string
          state?: string | null
          status?: string
          target_markets?: string | null
          updated_at?: string
          years_in_business?: number | null
        }
        Update: {
          additional_info?: string | null
          address?: string | null
          annual_turnover?: string | null
          certifications?: string | null
          city?: string | null
          company_name?: string
          country?: string | null
          created_at?: string
          email?: string
          export_experience?: string | null
          gstin?: string
          id?: string
          manufacturing_capacity?: string | null
          phone?: string
          previous_deals?: string | null
          product_category?: string | null
          representative_name?: string
          state?: string | null
          status?: string
          target_markets?: string | null
          updated_at?: string
          years_in_business?: number | null
        }
        Relationships: []
      }
      manufacturers: {
        Row: {
          annual_turnover: string | null
          business_type: string | null
          certifications: string[] | null
          created_at: string | null
          export_countries: string[] | null
          export_experience: boolean | null
          id: string
          manufacturing_capacity: string | null
          product_categories: string[] | null
          quality_certifications: string[] | null
          updated_at: string | null
          user_id: string | null
          years_in_business: number | null
        }
        Insert: {
          annual_turnover?: string | null
          business_type?: string | null
          certifications?: string[] | null
          created_at?: string | null
          export_countries?: string[] | null
          export_experience?: boolean | null
          id?: string
          manufacturing_capacity?: string | null
          product_categories?: string[] | null
          quality_certifications?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          years_in_business?: number | null
        }
        Update: {
          annual_turnover?: string | null
          business_type?: string | null
          certifications?: string[] | null
          created_at?: string | null
          export_countries?: string[] | null
          export_experience?: boolean | null
          id?: string
          manufacturing_capacity?: string | null
          product_categories?: string[] | null
          quality_certifications?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          years_in_business?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "manufacturers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_quote_id: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_quote_id?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_quote_id?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_quote_id_fkey"
            columns: ["related_quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_inquiries: {
        Row: {
          admin_notes: string | null
          compliance_requirements: string | null
          created_at: string | null
          customization_requirements: string | null
          frequency_of_orders: string | null
          id: string
          inquiry_type: string | null
          product_id: string | null
          sample_requirements: string | null
          specifications: Json | null
          status: string | null
          target_price_range: string | null
          technical_requirements: string | null
          testing_requirements: string | null
          updated_at: string | null
          user_id: string | null
          volume_requirements: string | null
        }
        Insert: {
          admin_notes?: string | null
          compliance_requirements?: string | null
          created_at?: string | null
          customization_requirements?: string | null
          frequency_of_orders?: string | null
          id?: string
          inquiry_type?: string | null
          product_id?: string | null
          sample_requirements?: string | null
          specifications?: Json | null
          status?: string | null
          target_price_range?: string | null
          technical_requirements?: string | null
          testing_requirements?: string | null
          updated_at?: string | null
          user_id?: string | null
          volume_requirements?: string | null
        }
        Update: {
          admin_notes?: string | null
          compliance_requirements?: string | null
          created_at?: string | null
          customization_requirements?: string | null
          frequency_of_orders?: string | null
          id?: string
          inquiry_type?: string | null
          product_id?: string | null
          sample_requirements?: string | null
          specifications?: Json | null
          status?: string | null
          target_price_range?: string | null
          technical_requirements?: string | null
          testing_requirements?: string | null
          updated_at?: string | null
          user_id?: string | null
          volume_requirements?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_inquiries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_inquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string
          price: string
          status: string | null
          subcategory: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name: string
          price: string
          status?: string | null
          subcategory: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          price?: string
          status?: string | null
          subcategory?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          email: string
          full_name: string | null
          gstin: string | null
          id: string
          is_admin: boolean | null
          phone: string | null
          updated_at: string
          user_type: string | null
          verification_status: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          gstin?: string | null
          id: string
          is_admin?: boolean | null
          phone?: string | null
          updated_at?: string
          user_type?: string | null
          verification_status?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          gstin?: string | null
          id?: string
          is_admin?: boolean | null
          phone?: string | null
          updated_at?: string
          user_type?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          additional_details: string | null
          admin_response: string | null
          attachments: string[] | null
          company: string | null
          created_at: string
          delivery_address: string | null
          delivery_country: string | null
          delivery_timeline: string | null
          email: string
          estimated_budget: string | null
          id: string
          name: string
          packaging_requirements: string | null
          payment_terms: string | null
          phone: string
          priority_level: string | null
          product_id: string | null
          product_name: string
          quality_standards: string | null
          quantity: string
          sample_required: boolean | null
          shipping_terms: string | null
          status: string | null
          unit: string
          user_id: string
        }
        Insert: {
          additional_details?: string | null
          admin_response?: string | null
          attachments?: string[] | null
          company?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_country?: string | null
          delivery_timeline?: string | null
          email: string
          estimated_budget?: string | null
          id?: string
          name: string
          packaging_requirements?: string | null
          payment_terms?: string | null
          phone: string
          priority_level?: string | null
          product_id?: string | null
          product_name: string
          quality_standards?: string | null
          quantity: string
          sample_required?: boolean | null
          shipping_terms?: string | null
          status?: string | null
          unit: string
          user_id: string
        }
        Update: {
          additional_details?: string | null
          admin_response?: string | null
          attachments?: string[] | null
          company?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_country?: string | null
          delivery_timeline?: string | null
          email?: string
          estimated_budget?: string | null
          id?: string
          name?: string
          packaging_requirements?: string | null
          payment_terms?: string | null
          phone?: string
          priority_level?: string | null
          product_id?: string | null
          product_name?: string
          quality_standards?: string | null
          quantity?: string
          sample_required?: boolean | null
          shipping_terms?: string | null
          status?: string | null
          unit?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
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
