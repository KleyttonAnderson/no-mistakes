export type StudentType = "Online" | "Presencial";
export type StudentStatus = "Ativo" | "Inativo";
export type PaymentMethod = "PIX" | "Cartão" | "Dinheiro" | "Outro";

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string | null;
          type: StudentType;
          status: StudentStatus;
          avatar_url: string | null;
          plan: string;
          value: number;
          start_date: string;
          next_due_date: string;
          pendente: boolean;
          last_training_update: string | null;
          next_training_update: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["students"]["Row"],
          "id" | "created_at" | "avatar_url"
        > & { id?: string; avatar_url?: string | null };
        Update: Partial<Database["public"]["Tables"]["students"]["Row"]>;
      };
      payments: {
        Row: {
          id: string;
          student_id: string;
          date: string;
          value: number;
          method: PaymentMethod;
          status: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["payments"]["Row"],
          "id" | "created_at" | "status"
        > & { id?: string; status?: string };
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          description: string;
          value: number;
          date: string;
          category: string;
          recurring: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["expenses"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["expenses"]["Row"]>;
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["categories"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
      };
      plans: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["plans"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["plans"]["Row"]>;
      };
      plan_variants: {
        Row: {
          id: string;
          plan_id: string;
          name: string;
          price: number;
          detail: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["plan_variants"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["plan_variants"]["Row"]>;
      };
      exercises: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          muscle_group: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["exercises"]["Row"],
          "id" | "created_at" | "muscle_group"
        > & { id?: string; muscle_group?: string | null };
        Update: Partial<Database["public"]["Tables"]["exercises"]["Row"]>;
      };
      workout_items: {
        Row: {
          id: string;
          student_id: string;
          exercise_id: string;
          sets: number;
          reps: string;
          target_weight: number | null;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["workout_items"]["Row"],
          "id" | "created_at" | "target_weight"
        > & { id?: string; target_weight?: number | null };
        Update: Partial<Database["public"]["Tables"]["workout_items"]["Row"]>;
      };
      load_logs: {
        Row: {
          id: string;
          student_id: string;
          exercise_id: string;
          date: string;
          weight: number;
          reps: number | null;
          sets: number | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["load_logs"]["Row"],
          "id" | "created_at" | "reps" | "sets"
        > & { id?: string; reps?: number | null; sets?: number | null };
        Update: Partial<Database["public"]["Tables"]["load_logs"]["Row"]>;
      };
    };
  };
}
