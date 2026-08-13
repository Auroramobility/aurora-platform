export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      applications: {
        Row: {
          application_date: string | null;
          approved_date: string | null;
          id: string;
          rejection_reason: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: string | null;
          user_id: string;
          vehicle_id: string;
        };
        Insert: {
          application_date?: string | null;
          approved_date?: string | null;
          id?: string;
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string | null;
          user_id: string;
          vehicle_id: string;
        };
        Update: {
          application_date?: string | null;
          approved_date?: string | null;
          id?: string;
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string | null;
          user_id?: string;
          vehicle_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "applications_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      conversations: {
        Row: {
          id: string;
          customer_id: string;
          application_id: string | null;
          ownership_plan_id: string | null;
          status: string;
          created_at: string;
          updated_at: string;
          last_message_at: string | null;
        };
        Insert: {
          id?: string;
          customer_id: string;
          application_id?: string | null;
          ownership_plan_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
          last_message_at?: string | null;
        };
        Update: {
          id?: string;
          customer_id?: string;
          application_id?: string | null;
          ownership_plan_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
          last_message_at?: string | null;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          admin_read_at: string | null;
          conversation_id: string;
          created_at: string | null;
          customer_read_at: string | null;
          id: string;
          message: string;
          sender_role: string;
          sender_user_id: string | null;
        };
        Insert: {
          admin_read_at?: string | null;
          conversation_id: string;
          created_at?: string | null;
          customer_read_at?: string | null;
          id?: string;
          message: string;
          sender_role: string;
          sender_user_id?: string | null;
        };
        Update: {
          admin_read_at?: string | null;
          conversation_id?: string;
          created_at?: string | null;
          customer_read_at?: string | null;
          id?: string;
          message?: string;
          sender_role?: string;
          sender_user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      ownership_plans: {
        Row: {
          accepted_at: string | null;
          activated_at: string | null;
          application_id: string;
          created_at: string | null;
          declined_at: string | null;
          id: string;
          status: string | null;
        };
        Insert: {
          accepted_at?: string | null;
          activated_at?: string | null;
          application_id: string;
          created_at?: string | null;
          declined_at?: string | null;
          id?: string;
          status?: string | null;
        };
        Update: {
          accepted_at?: string | null;
          activated_at?: string | null;
          application_id?: string;
          created_at?: string | null;
          declined_at?: string | null;
          id?: string;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ownership_plans_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          id: string;
          payment_date: string | null;
          payment_status: string | null;
          plan_id: string;
          schedule_id: string | null;
          provider: string | null;
          provider_transaction_id: string | null;
          currency: string | null;
          metadata: Json | null;
          created_at: string | null;
          updated_at: string | null;
          transaction_reference: string | null;
          payment_type: string;
        };
        Insert: {
          amount: number;
          id?: string;
          payment_date?: string | null;
          payment_status?: string | null;
          plan_id: string;
          schedule_id?: string | null;
          provider?: string | null;
          provider_transaction_id?: string | null;
          currency?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
          transaction_reference?: string | null;
          payment_type?: string;
        };
        Update: {
          amount?: number;
          id?: string;
          payment_date?: string | null;
          payment_status?: string | null;
          plan_id?: string;
          schedule_id?: string | null;
          provider?: string | null;
          provider_transaction_id?: string | null;
          currency?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
          transaction_reference?: string | null;
          payment_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "ownership_plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_schedule_id_fkey";
            columns: ["schedule_id"];
            isOneToOne: false;
            referencedRelation: "payment_schedule";
            referencedColumns: ["id"];
          },
        ];
      };
      financing_terms: {
        Row: {
          id: string;
          plan_id: string;
          currency: string;
          vehicle_price: number | null;
          down_payment: number | null;
          amount_financed: number | null;
          annual_interest_rate: number | null;
          monthly_payment: number | null;
          term_months: number | null;
          total_financed_repayment: number | null;
          first_payment_date: string | null;
          payment_frequency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          currency?: string;
          vehicle_price?: number | null;
          down_payment?: number | null;
          amount_financed?: number | null;
          annual_interest_rate?: number | null;
          monthly_payment?: number | null;
          term_months?: number | null;
          total_financed_repayment?: number | null;
          first_payment_date?: string | null;
          payment_frequency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          currency?: string;
          vehicle_price?: number | null;
          down_payment?: number | null;
          amount_financed?: number | null;
          annual_interest_rate?: number | null;
          monthly_payment?: number | null;
          term_months?: number | null;
          total_financed_repayment?: number | null;
          first_payment_date?: string | null;
          payment_frequency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "financing_terms_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: true;
            referencedRelation: "ownership_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      payment_schedule: {
        Row: {
          id: string;
          financing_terms_id: string;
          installment_number: number;
          due_date: string;
          amount_due: number;
          amount_paid: number;
          status: string;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          financing_terms_id: string;
          installment_number: number;
          due_date: string;
          amount_due: number;
          amount_paid?: number;
          status?: string;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          financing_terms_id?: string;
          installment_number?: number;
          due_date?: string;
          amount_due?: number;
          amount_paid?: number;
          status?: string;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payment_schedule_financing_terms_id_fkey";
            columns: ["financing_terms_id"];
            isOneToOne: false;
            referencedRelation: "financing_terms";
            referencedColumns: ["id"];
          },
        ];
      };
      payment_allocations: {
        Row: {
          payment_id: string;
          schedule_id: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          payment_id: string;
          schedule_id: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          payment_id?: string;
          schedule_id?: string;
          amount?: number;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "payment_allocations_payment_id_fkey"; columns: ["payment_id"]; isOneToOne: false; referencedRelation: "payments"; referencedColumns: ["id"]; },
          { foreignKeyName: "payment_allocations_schedule_id_fkey"; columns: ["schedule_id"]; isOneToOne: false; referencedRelation: "payment_schedule"; referencedColumns: ["id"]; },
        ];
      };
      profiles: {
        Row: {
          address: string | null;
          city: string | null;
          country: string | null;
          created_at: string | null;
          currency: string | null;
          date_of_birth: string | null;
          // NOTE: added by hand alongside drivers_license etc. above —
          // see supabase/migrations/20260812010000_settings_and_payments_access.sql.
          // This file couldn't be regenerated from a live project in
          // this environment; run `supabase gen types typescript` after
          // applying that migration to confirm this matches.
          deactivated_at: string | null;
          drivers_license: string | null;
          drivers_license_back: string | null;
          drivers_license_front: string | null;
          employment_status: string | null;
          full_name: string | null;
          id: string;
          identity_verified: boolean;
          identity_verified_at: string | null;
          identity_verified_by: string | null;
          monthly_income: number | null;
          phone: string | null;
          postal_code: string | null;
          preferred_language: string | null;
          profile_photo_url: string | null;
          role: string;
          state: string | null;
          timezone: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          currency?: string | null;
          date_of_birth?: string | null;
          deactivated_at?: string | null;
          drivers_license?: string | null;
          drivers_license_back?: string | null;
          drivers_license_front?: string | null;
          employment_status?: string | null;
          full_name?: string | null;
          id?: string;
          identity_verified?: boolean;
          identity_verified_at?: string | null;
          identity_verified_by?: string | null;
          monthly_income?: number | null;
          phone?: string | null;
          postal_code?: string | null;
          preferred_language?: string | null;
          profile_photo_url?: string | null;
          role?: string;
          state?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          currency?: string | null;
          date_of_birth?: string | null;
          deactivated_at?: string | null;
          drivers_license?: string | null;
          drivers_license_back?: string | null;
          drivers_license_front?: string | null;
          employment_status?: string | null;
          full_name?: string | null;
          id?: string;
          identity_verified?: boolean;
          identity_verified_at?: string | null;
          identity_verified_by?: string | null;
          monthly_income?: number | null;
          phone?: string | null;
          postal_code?: string | null;
          preferred_language?: string | null;
          profile_photo_url?: string | null;
          role?: string;
          state?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      saved_vehicles: {
        Row: {
          created_at: string | null;
          id: string;
          user_id: string;
          vehicle_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          user_id: string;
          vehicle_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          user_id?: string;
          vehicle_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_vehicles_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      vehicle_images: {
        Row: {
          created_at: string | null;
          id: string;
          image_url: string;
          sort_order: number | null;
          vehicle_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          image_url: string;
          sort_order?: number | null;
          vehicle_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          image_url?: string;
          sort_order?: number | null;
          vehicle_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      vehicles: {
        Row: {
          acceleration: string | null;
          availability: string | null;
          battery_capacity: number | null;
          battery_health: number | null;
          brand: string;
          charging_time: string | null;
          color: string | null;
          created_at: string | null;
          description: string | null;
          drivetrain: string | null;
          featured: boolean | null;
          id: string;
          image_url: string | null;
          mileage: number | null;
          model: string;
          price: number | null;
          published: boolean | null;
          range_miles: number | null;
          top_speed: number | null;
          trim: string | null;
          updated_at: string | null;
          year: number | null;
        };
        Insert: {
          acceleration?: string | null;
          availability?: string | null;
          battery_capacity?: number | null;
          battery_health?: number | null;
          brand: string;
          charging_time?: string | null;
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          drivetrain?: string | null;
          featured?: boolean | null;
          id?: string;
          image_url?: string | null;
          mileage?: number | null;
          model: string;
          price?: number | null;
          published?: boolean | null;
          range_miles?: number | null;
          top_speed?: number | null;
          trim?: string | null;
          updated_at?: string | null;
          year?: number | null;
        };
        Update: {
          acceleration?: string | null;
          availability?: string | null;
          battery_capacity?: number | null;
          battery_health?: number | null;
          brand?: string;
          charging_time?: string | null;
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          drivetrain?: string | null;
          featured?: boolean | null;
          id?: string;
          image_url?: string | null;
          mileage?: number | null;
          model?: string;
          price?: number | null;
          published?: boolean | null;
          range_miles?: number | null;
          top_speed?: number | null;
          trim?: string | null;
          updated_at?: string | null;
          year?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      // NOTE: check_rate_limit was added by hand (supabase/migrations/
      // 20260812000000_rate_limiting.sql) because this file couldn't be
      // regenerated against the live project from this environment. Run
      // `supabase gen types typescript` after applying that migration to
      // confirm this matches, or leave as-is — the shape matches the
      // migration's function signature exactly.
      check_rate_limit: {
        Args: { p_action: string; p_max_hits: number; p_window_seconds: number };
        Returns: boolean;
      };
      activate_ownership_plan: {
        Args: { p_plan_id: string };
        Returns: boolean;
      };
      create_draft_ownership_plan: {
        Args: {
          p_application_id: string;
          p_currency: string;
          p_vehicle_price: number;
          p_down_payment: number;
          p_monthly_payment: number;
          p_term_months: number;
          p_total_financed_repayment: number;
          p_first_payment_date: string;
          p_payment_frequency?: string;
          p_annual_interest_rate?: number | null;
        };
        Returns: string;
      };
      get_or_create_conversation: {
        Args: { p_application_id?: string | null; p_ownership_plan_id?: string | null };
        Returns: string | null;
      };
      is_valid_customer_conversation: {
        Args: { p_customer_id: string; p_application_id?: string | null; p_ownership_plan_id?: string | null };
        Returns: boolean;
      };
      set_conversation_status: {
        Args: { p_conversation_id: string; p_status: string };
        Returns: boolean;
      };
      mark_conversation_read: {
        Args: { p_conversation_id: string };
        Returns: boolean;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      prepare_ownership_plan: {
        Args: { p_plan_id: string };
        Returns: boolean;
      };
      record_manual_payment: {
        Args: {
          p_plan_id: string;
          p_payment_type: string;
          p_amount: number;
          p_payment_date: string;
          p_transaction_reference: string;
          p_schedule_id?: string | null;
        };
        Returns: string;
      };
      respond_to_ownership_plan: {
        Args: {
          p_decision: string;
          p_plan_id: string;
        };
        Returns: boolean;
      };
      record_payment_allocation: {
        Args: {
          p_amount: number;
          p_payment_id: string;
          p_schedule_id: string;
        };
        Returns: boolean;
      };
      review_application: {
        Args: {
          p_application_id: string;
          p_decision: string;
          p_rejection_reason?: string | null;
        };
        Returns: boolean;
      };
      review_identity_verification: {
        Args: {
          p_user_id: string;
          p_verified: boolean;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
