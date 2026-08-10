"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import * as queries from "@/lib/queries";
import { addMonthsISO, monthKey, shiftMonthKey, todayISO } from "@/lib/format";
import type {
  AlunosFilter,
  Category,
  Expense,
  OverlayState,
  Plan,
  Student,
  Tab,
} from "@/lib/types";

interface AppContextValue {
  userId: string;
  students: Student[];
  expenses: Expense[];
  categories: Category[];
  plans: Plan[];
  loading: boolean;
  refreshing: boolean;
  today: string;

  tab: Tab;
  setTab: (t: Tab) => void;
  financeMonth: string;
  prevMonth: () => void;
  nextMonth: () => void;
  alunosFilter: AlunosFilter;
  setAlunosFilter: (f: AlunosFilter) => void;

  overlay: OverlayState;
  openOverlay: (o: OverlayState) => void;
  closeOverlay: () => void;

  toast: string | null;
  flashToast: (msg: string) => void;

  refresh: () => Promise<void>;
  signOut: () => Promise<void>;

  registrarPagamento: (input: {
    studentId: string;
    value: number;
    date: string;
    method: "PIX" | "Cartão" | "Dinheiro" | "Outro";
  }) => Promise<void>;
  novoGasto: (input: {
    description: string;
    value: number;
    date: string;
    category: string;
    recurring: boolean;
  }) => Promise<void>;
  novoAluno: (input: {
    name: string;
    phone: string;
    type: "Online" | "Presencial";
    plan: string;
    value: number;
    startDate: string;
    nextDueDate: string;
    nextTrainingUpdate: string | null;
  }) => Promise<void>;
  marcarTreino: (studentId: string) => Promise<void>;
  updatePlanPrice: (variantId: string, price: number) => Promise<void>;
  addCategoria: (name: string) => Promise<string>;
  uploadAvatar: (studentId: string, file: File) => Promise<void>;
  deleteStudent: (studentId: string) => Promise<void>;
  deletePayment: (paymentId: string) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const today = useMemo(() => todayISO(), []);

  const [students, setStudents] = useState<Student[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [tab, setTab] = useState<Tab>("dashboard");
  const [financeMonth, setFinanceMonth] = useState(() => monthKey(todayISO()));
  const [alunosFilter, setAlunosFilter] = useState<AlunosFilter>("Todos");
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const [toast, setToast] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      let data = await queries.fetchAllData(userId);

      const needsSeed = data.plans.length === 0 || data.categories.length === 0;
      if (needsSeed) {
        if (data.plans.length === 0) await queries.seedDefaultPlans(userId);
        if (data.categories.length === 0) await queries.seedDefaultCategories(userId);
        data = await queries.fetchAllData(userId);
      }

      setStudents(data.students);
      setExpenses(data.expenses);
      setCategories(data.categories);
      setPlans(data.plans);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }, []);

  const openOverlay = useCallback((o: OverlayState) => setOverlay(o), []);
  const closeOverlay = useCallback(() => setOverlay(null), []);
  const prevMonth = useCallback(() => setFinanceMonth((m) => shiftMonthKey(m, -1)), []);
  const nextMonth = useCallback(() => setFinanceMonth((m) => shiftMonthKey(m, 1)), []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }, [router]);

  const registrarPagamento = useCallback(
    async (input: {
      studentId: string;
      value: number;
      date: string;
      method: "PIX" | "Cartão" | "Dinheiro" | "Outro";
    }) => {
      await queries.registrarPagamento({
        ...input,
        nextDueDate: addMonthsISO(input.date, 1),
      });
      await refresh();
      setOverlay(null);
      flashToast("Pagamento registrado");
    },
    [refresh, flashToast],
  );

  const novoGasto = useCallback(
    async (input: {
      description: string;
      value: number;
      date: string;
      category: string;
      recurring: boolean;
    }) => {
      await queries.insertExpense(userId, input);
      await refresh();
      setOverlay(null);
      flashToast("Gasto adicionado");
    },
    [userId, refresh, flashToast],
  );

  const novoAluno = useCallback(
    async (input: {
      name: string;
      phone: string;
      type: "Online" | "Presencial";
      plan: string;
      value: number;
      startDate: string;
      nextDueDate: string;
      nextTrainingUpdate: string | null;
    }) => {
      await queries.insertStudent(userId, {
        name: input.name,
        phone: input.phone,
        type: input.type,
        plan: input.plan,
        value: input.value,
        start_date: input.startDate,
        next_due_date: input.nextDueDate,
        next_training_update: input.nextTrainingUpdate,
      });
      await refresh();
      setOverlay(null);
      setTab("alunos");
      flashToast("Aluno cadastrado");
    },
    [userId, refresh, flashToast],
  );

  const marcarTreino = useCallback(
    async (studentId: string) => {
      await queries.markTreinoAtualizado(studentId, today, addMonthsISO(today, 1));
      await refresh();
      flashToast("Treino atualizado");
    },
    [today, refresh, flashToast],
  );

  const updatePlanPrice = useCallback(
    async (variantId: string, price: number) => {
      await queries.updatePlanVariantPrice(variantId, price);
      await refresh();
    },
    [refresh],
  );

  const addCategoria = useCallback(
    async (name: string) => {
      await queries.insertCategory(userId, name, categories.length);
      await refresh();
      return name;
    },
    [userId, categories.length, refresh],
  );

  const uploadAvatar = useCallback(
    async (studentId: string, file: File) => {
      await queries.uploadAvatar(userId, studentId, file);
      await refresh();
    },
    [userId, refresh],
  );

  const deleteStudent = useCallback(
    async (studentId: string) => {
      await queries.deleteStudent(studentId);
      await refresh();
      setOverlay(null);
      flashToast("Aluno excluído");
    },
    [refresh, flashToast],
  );

  const deletePayment = useCallback(
    async (paymentId: string) => {
      await queries.deletePayment(paymentId);
      await refresh();
      flashToast("Pagamento excluído");
    },
    [refresh, flashToast],
  );

  const deleteExpense = useCallback(
    async (expenseId: string) => {
      await queries.deleteExpense(expenseId);
      await refresh();
      flashToast("Gasto excluído");
    },
    [refresh, flashToast],
  );

  const value: AppContextValue = {
    userId,
    students,
    expenses,
    categories,
    plans,
    loading,
    refreshing,
    today,
    tab,
    setTab,
    financeMonth,
    prevMonth,
    nextMonth,
    alunosFilter,
    setAlunosFilter,
    overlay,
    openOverlay,
    closeOverlay,
    toast,
    flashToast,
    refresh,
    signOut,
    registrarPagamento,
    novoGasto,
    novoAluno,
    marcarTreino,
    updatePlanPrice,
    addCategoria,
    uploadAvatar,
    deleteStudent,
    deletePayment,
    deleteExpense,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
