import { categoryColor, methodColor } from "@/lib/colors";
import { daysUntil, fmtBRL, monthKey } from "@/lib/format";
import type { Category, Expense, Student } from "@/lib/types";

export function activeStudents(students: Student[]) {
  return students.filter((s) => s.status === "Ativo");
}

export function sumPaymentsForMonth(
  students: Student[],
  monthKeyValue: string,
  typeFilter?: "Online" | "Presencial",
) {
  return students
    .filter((s) => !typeFilter || s.type === typeFilter)
    .reduce(
      (sum, s) =>
        sum +
        s.payments
          .filter((p) => monthKey(p.date) === monthKeyValue)
          .reduce((a, p) => a + p.value, 0),
      0,
    );
}

export function sumExpensesForMonth(expenses: Expense[], monthKeyValue: string) {
  return expenses
    .filter((e) => monthKey(e.date) === monthKeyValue)
    .reduce((a, e) => a + e.value, 0);
}

export function receivable(students: Student[]) {
  return activeStudents(students)
    .filter((s) => s.pendente)
    .reduce((a, s) => a + s.value, 0);
}

export interface CategoryFunnelItem {
  name: string;
  total: number;
  totalFmt: string;
  color: string;
  pct: number;
}

export function categoryFunnel(
  expenses: Expense[],
  categories: Category[],
  monthKeyValue: string,
): CategoryFunnelItem[] {
  const names = categories.map((c) => c.name);
  const raw = names
    .map((name) => ({
      name,
      total: expenses
        .filter((e) => monthKey(e.date) === monthKeyValue && e.category === name)
        .reduce((a, e) => a + e.value, 0),
      color: categoryColor(names, name),
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
  const max = raw.length ? raw[0].total : 1;
  return raw.map((c) => ({
    ...c,
    totalFmt: fmtBRL(c.total),
    pct: Math.round((c.total / max) * 100),
  }));
}

export interface Movement {
  id: string;
  date: string;
  desc: string;
  tag: string;
  tagColor: string;
  value: number;
  positive: boolean;
}

export function movementsForMonth(
  students: Student[],
  expenses: Expense[],
  categories: Category[],
  monthKeyValue: string,
): Movement[] {
  const names = categories.map((c) => c.name);
  const movements: Movement[] = [];
  students.forEach((s) =>
    s.payments
      .filter((p) => monthKey(p.date) === monthKeyValue)
      .forEach((p) =>
        movements.push({
          id: s.id + p.date + p.id,
          date: p.date,
          desc: s.name,
          tag: p.method,
          tagColor: methodColor(p.method),
          value: p.value,
          positive: true,
        }),
      ),
  );
  expenses
    .filter((e) => monthKey(e.date) === monthKeyValue)
    .forEach((e) =>
      movements.push({
        id: "e" + e.id,
        date: e.date,
        desc: e.description,
        tag: e.category,
        tagColor: categoryColor(names, e.category),
        value: e.value,
        positive: false,
      }),
    );
  movements.sort((a, b) => b.date.localeCompare(a.date));
  return movements;
}

export interface DashboardAlert {
  id: string;
  label: string;
  level: "urgent" | "soon";
  onClick: () => void;
}

export function dashboardAlerts(
  students: Student[],
  goToAlunos: (filter: "Todos" | "Online") => void,
): DashboardAlert[] {
  const active = activeStudents(students);
  const pl = (n: number, suf: string) => (n > 1 ? suf : "");

  const atrasados = active.filter((s) => s.pendente && daysUntil(s.next_due_date) < 0);
  const venceBreve = active.filter(
    (s) => s.pendente && daysUntil(s.next_due_date) >= 0 && daysUntil(s.next_due_date) <= 7,
  );
  const treinoAtrasado = active.filter(
    (s) => s.type === "Online" && daysUntil(s.next_training_update) < 0,
  );
  const treinoBreve = active.filter(
    (s) =>
      s.type === "Online" &&
      daysUntil(s.next_training_update) >= 0 &&
      daysUntil(s.next_training_update) <= 7,
  );

  const alerts: DashboardAlert[] = [];
  if (atrasados.length)
    alerts.push({
      id: "atrasados",
      level: "urgent",
      label: `${atrasados.length} pagamento${pl(atrasados.length, "s")} atrasado${pl(atrasados.length, "s")}`,
      onClick: () => goToAlunos("Todos"),
    });
  if (venceBreve.length)
    alerts.push({
      id: "venceBreve",
      level: "soon",
      label: `${venceBreve.length} pagamento${pl(venceBreve.length, "s")} vence${pl(venceBreve.length, "m")} nos próximos 7 dias`,
      onClick: () => goToAlunos("Todos"),
    });
  if (treinoAtrasado.length)
    alerts.push({
      id: "treinoAtrasado",
      level: "urgent",
      label: `${treinoAtrasado.length} treino${pl(treinoAtrasado.length, "s")} atrasado${pl(treinoAtrasado.length, "s")}`,
      onClick: () => goToAlunos("Online"),
    });
  if (treinoBreve.length)
    alerts.push({
      id: "treinoBreve",
      level: "soon",
      label: `${treinoBreve.length} treino${pl(treinoBreve.length, "s")} para atualizar em breve`,
      onClick: () => goToAlunos("Online"),
    });

  return alerts;
}
