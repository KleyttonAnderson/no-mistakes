import type { PaymentMethod, StudentStatus, StudentType } from "@/lib/database.types";

export type { PaymentMethod, StudentStatus, StudentType };

export interface Payment {
  id: string;
  student_id: string;
  date: string;
  value: number;
  method: PaymentMethod;
  status: string;
}

export interface Student {
  id: string;
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
  payments: Payment[];
}

export interface Expense {
  id: string;
  description: string;
  value: number;
  date: string;
  category: string;
  recurring: boolean;
}

export interface Category {
  id: string;
  name: string;
  sort_order: number;
}

export interface PlanVariant {
  id: string;
  plan_id: string;
  name: string;
  price: number;
  detail: string | null;
  sort_order: number;
}

export interface Plan {
  id: string;
  name: string;
  sort_order: number;
  variants: PlanVariant[];
}

export type Tab = "dashboard" | "alunos" | "financeiro" | "config";

export type OverlayState =
  | { type: "ficha"; studentId: string }
  | { type: "pagamento"; studentId?: string }
  | { type: "novoGasto" }
  | { type: "novoAluno" }
  | { type: "planos" }
  | null;

export type AlunosFilter = "Todos" | "Online" | "Presencial" | "Ativos" | "Inativos";
