export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      canna_id_audit_logs: {
        Row: {
          id: string
          credential_id: string
          credential_number: string
          action_type: string
          previous_status: string | null
          new_status: string | null
          action_by: string
          action_reason: string | null
          verification_location: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          credential_id: string
          credential_number: string
          action_type: string
          previous_status?: string | null
          new_status?: string | null
          action_by: string
          action_reason?: string | null
          verification_location?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          credential_id?: string
          credential_number?: string
          action_type?: string
          previous_status?: string | null
          new_status?: string | null
          action_by?: string
          action_reason?: string | null
          verification_location?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "canna_id_audit_logs_credential_id_fkey"
            columns: ["credential_id"]
            referencedRelation: "canna_id_credentials"
            referencedColumns: ["id"]
          }
        ]
      }
      canna_id_credentials: {
        Row: {
          id: string
          credential_number: string
          full_name: string
          date_of_birth: string
          gender: string
          national_id_number: string
          jurisdiction: string
          region: string | null
          eligibility_status: boolean
          status: string
          issued_at: string
          expires_at: string
          issuing_authority: string
          verification_token: string
          qr_code_data: string | null
          notes: string | null
          verification_count: number
          last_verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          credential_number: string
          full_name: string
          date_of_birth: string
          gender: string
          national_id_number: string
          jurisdiction: string
          region?: string | null
          eligibility_status?: boolean
          status?: string
          issued_at: string
          expires_at: string
          issuing_authority: string
          verification_token: string
          qr_code_data?: string | null
          notes?: string | null
          verification_count?: number
          last_verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          credential_number?: string
          full_name?: string
          date_of_birth?: string
          gender?: string
          national_id_number?: string
          jurisdiction?: string
          region?: string | null
          eligibility_status?: boolean
          status?: string
          issued_at?: string
          expires_at?: string
          issuing_authority?: string
          verification_token?: string
          qr_code_data?: string | null
          notes?: string | null
          verification_count?: number
          last_verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          user_role: string
          full_name: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          postal_code: string
          country: string
          date_of_birth: string
          gender: string
          national_id: string
          license_number: string
          license_type: string
          license_expiry: string
          company_name: string
          company_type: string
          company_license: string
          company_address: string
          company_phone: string
          tax_id: string
          avatar_url: string
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_role?: string
          full_name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          date_of_birth?: string
          gender?: string
          national_id?: string
          license_number?: string
          license_type?: string
          license_expiry?: string
          company_name?: string
          company_type?: string
          company_license?: string
          company_address?: string
          company_phone?: string
          tax_id?: string
          avatar_url?: string
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_role?: string
          full_name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          date_of_birth?: string
          gender?: string
          national_id?: string
          license_number?: string
          license_type?: string
          license_expiry?: string
          company_name?: string
          company_type?: string
          company_license?: string
          company_address?: string
          company_phone?: string
          tax_id?: string
          avatar_url?: string
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price_monthly: number
          price_annual: number
          stripe_price_id_monthly: string | null
          stripe_price_id_annual: string | null
          stripe_product_id: string | null
          features: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price_monthly: number
          price_annual: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_annual?: string | null
          stripe_product_id?: string | null
          features?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price_monthly?: number
          price_annual?: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_annual?: string | null
          stripe_product_id?: string | null
          features?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: string
          billing_cycle: string
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: string
          billing_cycle?: string
          current_period_start: string
          current_period_end: string
          cancel_at_period_end?: boolean
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: string
          billing_cycle?: string
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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