"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/app-context";
import { CARD, CARD_SHADOW, CARD_SHADOW_SM, GRADIENT_ACCENT, MUTED, TEXT } from "@/lib/colors";
import { fmtBRL, fmtDateShort, monthLabel } from "@/lib/format";
import { categoryFunnel, movementsForMonth, sumExpensesForMonth, sumPaymentsForMonth, activeStudents } from "@/lib/selectors";
import { ChevronLeftSmall, ChevronRightSmall, TrashIcon } from "@/components/icons";
import type { Movement } from "@/lib/selectors";

export function Financeiro() {
  const { students, expenses, categories, financeMonth, prevMonth, nextMonth, openOverlay, deletePayment, deleteExpense } =
    useApp();

  function handleDeleteMovement(m: Movement) {
    const label = m.kind === "payment" ? "este pagamento" : "este gasto";
    if (!window.confirm(`Excluir ${label} (${m.desc})? Essa ação não pode ser desfeita.`)) return;
    if (m.kind === "payment") {
      deletePayment(m.sourceId);
    } else {
      deleteExpense(m.sourceId);
    }
  }

  const finEntradas = sumPaymentsForMonth(students, financeMonth);
  const finGastos = sumExpensesForMonth(expenses, financeMonth);
  const finSaldo = finEntradas - finGastos;
  const aReceber = activeStudents(students)
    .filter((s) => s.pendente)
    .reduce((a, s) => a + s.value, 0);

  const funnel = useMemo(
    () => categoryFunnel(expenses, categories, financeMonth),
    [expenses, categories, financeMonth],
  );
  const movements = useMemo(
    () => movementsForMonth(students, expenses, categories, financeMonth),
    [students, expenses, categories, financeMonth],
  );

  return (
    <div style={{ padding: "6px 20px 8px" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 16 }}>Financeiro</div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          marginBottom: 18,
          borderRadius: 16,
          background: CARD,
          padding: "12px 0",
          boxShadow: CARD_SHADOW_SM,
        }}
      >
        <div onClick={prevMonth} style={{ cursor: "pointer", padding: "4px 10px", color: MUTED }}>
          <ChevronLeftSmall />
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 800, color: TEXT, minWidth: 130, textAlign: "center" }}>
          {monthLabel(financeMonth)}
        </div>
        <div onClick={nextMonth} style={{ cursor: "pointer", padding: "4px 10px", color: MUTED }}>
          <ChevronRightSmall />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        <FinCard label="Entradas" value={fmtBRL(finEntradas)} />
        <FinCard label="Gastos" value={fmtBRL(finGastos)} />
        <FinCard label="Saldo" value={fmtBRL(finSaldo)} />
        <FinCard label="A receber" value={fmtBRL(aReceber)} color={aReceber > 0 ? "#ff9783" : TEXT} />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
        <div
          onClick={() => openOverlay({ type: "pagamento" })}
          style={{ flex: 1, textAlign: "center", padding: 13, borderRadius: 14, background: GRADIENT_ACCENT, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 20px rgba(236,48,19,0.4)" }}
        >
          + Pagamento
        </div>
        <div
          onClick={() => openOverlay({ type: "novoGasto" })}
          style={{ flex: 1, textAlign: "center", padding: 13, borderRadius: 14, background: CARD, color: TEXT, fontSize: 13, fontWeight: 800, cursor: "pointer" }}
        >
          + Gasto
        </div>
      </div>

      {funnel.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: "rgba(243,242,242,0.55)", textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 }}>
            Gastos por categoria
          </div>
          <div style={{ borderRadius: 16, background: CARD, padding: "14px 16px", marginBottom: 22, boxShadow: CARD_SHADOW_SM }}>
            {funnel.map((cat) => (
              <div key={cat.name} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{cat.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: cat.color }}>{cat.totalFmt}</span>
                </div>
                <div style={{ height: 7, borderRadius: 999, background: "rgba(243,242,242,0.08)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 999, background: cat.color, width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: "rgba(243,242,242,0.55)", textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 }}>
        Movimentações
      </div>

      {movements.map((m) => (
        <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 16, background: CARD, marginBottom: 8, boxShadow: CARD_SHADOW_SM }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", flexShrink: 0, background: m.tagColor, boxShadow: `0 0 8px ${m.tagColor}` }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {m.desc}
              </div>
              <div style={{ fontSize: 12, color: m.tagColor, marginTop: 2, fontWeight: 700 }}>
                {fmtDateShort(m.date)} · {m.tag}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div className="tabular-nums" style={{ fontSize: 14.5, fontWeight: 700, color: TEXT }}>
              {(m.positive ? "+ " : "– ") + fmtBRL(m.value)}
            </div>
            <div
              onClick={() => handleDeleteMovement(m)}
              style={{ padding: 6, borderRadius: 8, color: "rgba(243,242,242,0.35)", cursor: "pointer" }}
            >
              <TrashIcon />
            </div>
          </div>
        </div>
      ))}

      {movements.length === 0 && (
        <div style={{ padding: 20, borderRadius: 16, background: CARD, color: "rgba(243,242,242,0.5)", fontSize: 14 }}>
          Nenhuma movimentação neste mês.
        </div>
      )}
    </div>
  );
}

function FinCard({ label, value, color = TEXT }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ borderRadius: 18, padding: 16, background: CARD, boxShadow: CARD_SHADOW }}>
      <div style={{ fontSize: 11, color: "rgba(243,242,242,0.55)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, fontWeight: 700 }}>
        {label}
      </div>
      <div className="tabular-nums" style={{ fontSize: 18, fontWeight: 800, color }}>
        {value}
      </div>
    </div>
  );
}
