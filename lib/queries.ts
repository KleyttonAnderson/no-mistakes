import { createClient } from "@/lib/supabase/client";
import type { Category, Expense, Plan, Student } from "@/lib/types";

export async function fetchAllData(userId: string) {
  const supabase = createClient();

  const [studentsRes, expensesRes, categoriesRes, plansRes] = await Promise.all([
    supabase
      .from("students")
      .select("*, payments(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false }),
    supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("plans")
      .select("*, plan_variants(*)")
      .eq("user_id", userId)
      .order("sort_order", { ascending: true }),
  ]);

  if (studentsRes.error) throw studentsRes.error;
  if (expensesRes.error) throw expensesRes.error;
  if (categoriesRes.error) throw categoriesRes.error;
  if (plansRes.error) throw plansRes.error;

  const students: Student[] = (studentsRes.data ?? []).map((s) => ({
    ...s,
    payments: (s.payments ?? []).sort((a: { date: string }, b: { date: string }) =>
      b.date.localeCompare(a.date),
    ),
  }));

  const expenses: Expense[] = expensesRes.data ?? [];
  const categories: Category[] = categoriesRes.data ?? [];
  const plans: Plan[] = (plansRes.data ?? []).map((p) => ({
    ...p,
    variants: (p.plan_variants ?? []).sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order,
    ),
  }));

  return { students, expenses, categories, plans };
}

export async function insertStudent(
  userId: string,
  input: {
    name: string;
    phone: string;
    type: "Online" | "Presencial";
    plan: string;
    value: number;
    start_date: string;
    next_due_date: string;
    next_training_update: string | null;
  },
) {
  const supabase = createClient();
  const { error } = await supabase.from("students").insert({
    user_id: userId,
    name: input.name,
    phone: input.phone,
    type: input.type,
    status: "Ativo",
    plan: input.plan,
    value: input.value,
    start_date: input.start_date,
    next_due_date: input.next_due_date,
    pendente: false,
    last_training_update: input.type === "Online" ? input.start_date : null,
    next_training_update: input.type === "Online" ? input.next_training_update : null,
  });
  if (error) throw error;
}

export async function registrarPagamento(input: {
  studentId: string;
  value: number;
  date: string;
  method: "PIX" | "Cartão" | "Dinheiro" | "Outro";
  nextDueDate: string;
}) {
  const supabase = createClient();
  const { error: payError } = await supabase.from("payments").insert({
    student_id: input.studentId,
    date: input.date,
    value: input.value,
    method: input.method,
    status: "Pago",
  });
  if (payError) throw payError;

  const { error: studentError } = await supabase
    .from("students")
    .update({ pendente: false, next_due_date: input.nextDueDate })
    .eq("id", input.studentId);
  if (studentError) throw studentError;
}

export async function insertExpense(
  userId: string,
  input: { description: string; value: number; date: string; category: string; recurring: boolean },
) {
  const supabase = createClient();
  const { error } = await supabase.from("expenses").insert({
    user_id: userId,
    description: input.description,
    value: input.value,
    date: input.date,
    category: input.category,
    recurring: input.recurring,
  });
  if (error) throw error;
}

export async function insertCategory(userId: string, name: string, sortOrder: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .insert({ user_id: userId, name, sort_order: sortOrder });
  if (error) throw error;
}

export async function markTreinoAtualizado(
  studentId: string,
  lastUpdate: string,
  nextUpdate: string,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("students")
    .update({ last_training_update: lastUpdate, next_training_update: nextUpdate })
    .eq("id", studentId);
  if (error) throw error;
}

export async function updatePlanVariantPrice(variantId: string, price: number) {
  const supabase = createClient();
  const { error } = await supabase.from("plan_variants").update({ price }).eq("id", variantId);
  if (error) throw error;
}

export async function deleteStudent(studentId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("students").delete().eq("id", studentId);
  if (error) throw error;
}

export async function deletePayment(paymentId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("payments").delete().eq("id", paymentId);
  if (error) throw error;
}

export async function deleteExpense(expenseId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", expenseId);
  if (error) throw error;
}

const DEFAULT_CATEGORIES = [
  "Academia",
  "Ferramentas",
  "Marketing",
  "Transporte",
  "Pessoal/Empresa",
  "Outros",
];

const DEFAULT_PLANS = [
  {
    name: "Plano Light",
    variants: [
      { name: "Mensal", price: 347, detail: null as string | null },
      {
        name: "Trimestral",
        price: 697,
        detail: "3x R$ 232,33 no cartão · R$ 697,00 à vista no PIX",
      },
      {
        name: "Semestral",
        price: 1200,
        detail: "6x R$ 200,00 no cartão · R$ 1.200,00 à vista no PIX",
      },
    ],
  },
  {
    name: "Plano Premium",
    variants: [
      { name: "Mensal", price: 516.9, detail: null as string | null },
      {
        name: "Trimestral",
        price: 1036.8,
        detail: "3x R$ 371,65 no cartão · R$ 1.036,80 à vista no PIX",
      },
      {
        name: "Semestral",
        price: 1879.6,
        detail: "6x R$ 346,82 no cartão · R$ 1.879,60 à vista no cartão",
      },
    ],
  },
  {
    name: "Plano Presencial",
    variants: [
      { name: "Mensal", price: 347, detail: null as string | null },
      { name: "Trimestral", price: 697, detail: null as string | null },
      { name: "Semestral", price: 1200, detail: null as string | null },
    ],
  },
];

export async function seedDefaultCategories(userId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("categories").insert(
    DEFAULT_CATEGORIES.map((name, i) => ({ user_id: userId, name, sort_order: i })),
  );
  if (error) throw error;
}

export async function seedDefaultPlans(userId: string) {
  const supabase = createClient();
  for (const [i, plan] of DEFAULT_PLANS.entries()) {
    const { data: planRow, error: planError } = await supabase
      .from("plans")
      .insert({ user_id: userId, name: plan.name, sort_order: i })
      .select()
      .single();
    if (planError) throw planError;
    const { error: variantsError } = await supabase.from("plan_variants").insert(
      plan.variants.map((v, vi) => ({
        plan_id: planRow.id,
        name: v.name,
        price: v.price,
        detail: v.detail,
        sort_order: vi,
      })),
    );
    if (variantsError) throw variantsError;
  }
}

export async function uploadAvatar(userId: string, studentId: string, file: File) {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${userId}/${studentId}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

  const { error: updateError } = await supabase
    .from("students")
    .update({ avatar_url: publicUrl })
    .eq("id", studentId);
  if (updateError) throw updateError;

  return publicUrl;
}
