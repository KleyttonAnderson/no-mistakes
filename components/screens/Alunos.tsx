"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/app-context";
import { ATIVO_C, CARD, CARD_SHADOW_SM, GRADIENT_ACCENT, INATIVO_C, MUTED, ONLINE_C, PRESENCIAL_C, TEXT } from "@/lib/colors";
import { fmtBRL, fmtDateShort } from "@/lib/format";
import { paymentStatus, tagStyle, treinoStatus } from "@/lib/status";
import { Avatar } from "@/components/Avatar";
import { PlusIcon } from "@/components/icons";
import type { AlunosFilter } from "@/lib/types";

const FILTERS: { label: AlunosFilter; dot: string | null }[] = [
  { label: "Todos", dot: null },
  { label: "Online", dot: ONLINE_C },
  { label: "Presencial", dot: PRESENCIAL_C },
  { label: "Ativos", dot: ATIVO_C },
  { label: "Inativos", dot: INATIVO_C },
];

export function Alunos() {
  const { students, alunosFilter, setAlunosFilter, openOverlay } = useApp();

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (alunosFilter === "Todos") return true;
      if (alunosFilter === "Online") return s.type === "Online";
      if (alunosFilter === "Presencial") return s.type === "Presencial";
      if (alunosFilter === "Ativos") return s.status === "Ativo";
      if (alunosFilter === "Inativos") return s.status === "Inativo";
      return true;
    });
  }, [students, alunosFilter]);

  return (
    <div style={{ padding: "6px 20px 8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: TEXT }}>Alunos</div>
        <div
          onClick={() => openOverlay({ type: "novoAluno" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: GRADIENT_ACCENT,
            color: "#fff",
            padding: "9px 16px",
            borderRadius: 999,
            fontSize: 12.5,
            fontWeight: 800,
            letterSpacing: "0.02em",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(236,48,19,0.4)",
          }}
        >
          <PlusIcon />
          Novo
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 2 }}>
        {FILTERS.map((f) => {
          const active = f.label === alunosFilter;
          return (
            <div
              key={f.label}
              onClick={() => setAlunosFilter(f.label)}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 14px",
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                background: active ? "#ec3013" : "rgba(243,242,242,0.08)",
                color: active ? "#fff" : MUTED,
              }}
            >
              {f.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: f.dot }} />}
              {f.label}
            </div>
          );
        })}
      </div>

      {filtered.map((st) => {
        const ps = paymentStatus(st);
        const ts = treinoStatus(st);
        const psTag = tagStyle(ps.level);
        const tsTag = ts ? tagStyle(ts.level) : null;
        const typeColor = st.type === "Online" ? ONLINE_C : PRESENCIAL_C;

        return (
          <div
            key={st.id}
            onClick={() => openOverlay({ type: "ficha", studentId: st.id })}
            style={{ padding: 16, borderRadius: 18, background: CARD, marginBottom: 10, cursor: "pointer", boxShadow: CARD_SHADOW_SM }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <Avatar
                  studentId={st.id}
                  avatarUrl={st.avatar_url}
                  name={st.name}
                  statusDotColor={st.status === "Ativo" ? ATIVO_C : INATIVO_C}
                />
                <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {st.name}
                </span>
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.02em", padding: "4px 10px", borderRadius: 999, flexShrink: 0, background: psTag.bg, color: psTag.color, border: `1.5px solid ${psTag.border}` }}>
                {ps.label}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 46 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.02em", color: typeColor, background: st.type === "Online" ? "rgba(62,198,255,0.14)" : "rgba(255,176,32,0.14)", borderRadius: 999, padding: "3px 9px" }}>
                {st.type}
              </span>
              <span style={{ fontSize: 13, color: "rgba(243,242,242,0.55)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {st.plan} · {fmtBRL(st.value)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 9, marginLeft: 46 }}>
              <div style={{ fontSize: 12.5, color: "rgba(243,242,242,0.4)" }}>
                Próximo pagamento {fmtDateShort(st.next_due_date)}
              </div>
              {ts && tsTag && (
                <div style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: tsTag.bg, color: tsTag.color, border: `1.5px solid ${tsTag.border}` }}>
                  {ts.label}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ padding: 20, borderRadius: 16, background: CARD, color: "rgba(243,242,242,0.5)", fontSize: 14 }}>
          Nenhum aluno encontrado.
        </div>
      )}
    </div>
  );
}
