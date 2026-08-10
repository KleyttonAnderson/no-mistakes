import { ACCENT, ACCENT_LIGHT, ATIVO_C, FAINT } from "@/lib/colors";
import { daysUntil } from "@/lib/format";
import type { Student } from "@/lib/types";

export type Severity = "urgent" | "soon" | "calm";

export function severity(d: number): Severity {
  return d < 0 ? "urgent" : d <= 7 ? "soon" : "calm";
}

export function paymentStatus(st: Student): { label: string; level: Severity | "off" } {
  if (st.status === "Inativo") return { label: "Inativo", level: "off" };
  if (!st.pendente) return { label: "Em dia", level: "calm" };
  const lvl = severity(daysUntil(st.next_due_date));
  return {
    label: lvl === "urgent" ? "Atrasado" : lvl === "soon" ? "Vence em breve" : "Em dia",
    level: lvl,
  };
}

export function treinoStatus(
  st: Student,
): { label: string; level: Severity } | null {
  if (st.type !== "Online") return null;
  const lvl = severity(daysUntil(st.next_training_update));
  return {
    label:
      lvl === "urgent"
        ? "Treino atrasado"
        : lvl === "soon"
          ? "Atualizar em breve"
          : "Atualizado",
    level: lvl,
  };
}

export function tagStyle(level: Severity | "off") {
  if (level === "urgent")
    return {
      bg: ACCENT,
      color: "#fff",
      border: ACCENT,
      glow: "0 0 8px rgba(236,48,19,0.9)",
    };
  if (level === "soon")
    return {
      bg: "rgba(236,48,19,0.12)",
      color: ACCENT_LIGHT,
      border: "transparent",
      glow: "none",
    };
  if (level === "off")
    return { bg: "rgba(243,242,242,0.06)", color: FAINT, border: "transparent", glow: "none" };
  return {
    bg: "rgba(34,224,138,0.12)",
    color: ATIVO_C,
    border: "transparent",
    glow: "none",
  };
}
