"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/app-context";
import { CARD, CARD_SHADOW, CARD_SHADOW_SM, MUTED, ONLINE_C, PRESENCIAL_C, TEXT } from "@/lib/colors";
import { fmtBRL, monthLabel } from "@/lib/format";
import { activeStudents, dashboardAlerts, sumExpensesForMonth, sumPaymentsForMonth } from "@/lib/selectors";
import { ChevronLeftSmall, ChevronRight, ChevronRightSmall } from "@/components/icons";

export function Dashboard() {
  const { students, expenses, financeMonth, prevMonth, nextMonth, setTab, setAlunosFilter } = useApp();

  const active = useMemo(() => activeStudents(students), [students]);
  const presencialCount = active.filter((s) => s.type === "Presencial").length;
  const onlineCount = active.filter((s) => s.type === "Online").length;

  const entradasPresencial = sumPaymentsForMonth(students, financeMonth, "Presencial");
  const entradasConsultoria = sumPaymentsForMonth(students, financeMonth, "Online");
  const entradasMes = entradasPresencial + entradasConsultoria;
  const gastosMes = sumExpensesForMonth(expenses, financeMonth);
  const saldoMes = entradasMes - gastosMes;
  const aReceber = active.filter((s) => s.pendente).reduce((a, s) => a + s.value, 0);

  const alerts = useMemo(
    () =>
      dashboardAlerts(students, (filter) => {
        setTab("alunos");
        setAlunosFilter(filter);
      }),
    [students, setTab, setAlunosFilter],
  );

  return (
    <div style={{ padding: "6px 20px 24px" }}>
      <div
        style={{
          borderRadius: 24,
          padding: 22,
          marginBottom: 16,
          background:
            "radial-gradient(120% 140% at 15% -20%,rgba(236,48,19,0.28),transparent 60%),#1c1b1a",
          boxShadow: "0 14px 34px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(243,242,242,0.06)",
        }}
      >
        <div style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, fontWeight: 700 }}>
          Alunos ativos
        </div>
        <div className="tabular-nums" style={{ fontWeight: 900, fontSize: 58, color: TEXT, lineHeight: 1 }}>
          {active.length}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "rgba(243,242,242,0.75)", background: "rgba(255,176,32,0.12)", borderRadius: 999, padding: "6px 12px 6px 8px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: PRESENCIAL_C, flexShrink: 0 }} />
            Presencial <span style={{ color: TEXT, fontWeight: 800 }}>{presencialCount}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "rgba(243,242,242,0.75)", background: "rgba(62,198,255,0.12)", borderRadius: 999, padding: "6px 12px 6px 8px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: ONLINE_C, flexShrink: 0 }} />
            Online <span style={{ color: TEXT, fontWeight: 800 }}>{onlineCount}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          marginBottom: 16,
          borderRadius: 16,
          background: CARD,
          padding: "11px 0",
          boxShadow: CARD_SHADOW_SM,
        }}
      >
        <div onClick={prevMonth} style={{ cursor: "pointer", padding: "4px 10px", color: MUTED }}>
          <ChevronLeftSmall />
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: TEXT, minWidth: 120, textAlign: "center" }}>
          {monthLabel(financeMonth)}
        </div>
        <div onClick={nextMonth} style={{ cursor: "pointer", padding: "4px 10px", color: MUTED }}>
          <ChevronRightSmall />
        </div>
      </div>

      <div style={{ fontSize: 11, color: "rgba(243,242,242,0.55)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, paddingLeft: 4, fontWeight: 700 }}>
        Receita por origem
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
        <div style={{ borderRadius: 16, padding: "13px 10px", background: CARD, boxShadow: CARD_SHADOW }}>
          <div style={{ fontSize: 10, color: PRESENCIAL_C, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 7, fontWeight: 800 }}>Presencial</div>
          <div className="tabular-nums" style={{ fontSize: 14.5, fontWeight: 800, color: TEXT }}>{fmtBRL(entradasPresencial)}</div>
        </div>
        <div style={{ borderRadius: 16, padding: "13px 10px", background: CARD, boxShadow: CARD_SHADOW }}>
          <div style={{ fontSize: 10, color: ONLINE_C, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 7, fontWeight: 800 }}>Consultoria</div>
          <div className="tabular-nums" style={{ fontSize: 14.5, fontWeight: 800, color: TEXT }}>{fmtBRL(entradasConsultoria)}</div>
        </div>
        <div style={{ borderRadius: 16, padding: "13px 10px", background: "linear-gradient(135deg,#ec3013,#ff7a45)", boxShadow: "0 8px 22px rgba(236,48,19,0.3)" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 7, fontWeight: 800 }}>Total</div>
          <div className="tabular-nums" style={{ fontSize: 14.5, fontWeight: 800, color: "#fff" }}>{fmtBRL(entradasMes)}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 22 }}>
        <div style={{ borderRadius: 16, padding: "13px 10px", background: CARD, boxShadow: CARD_SHADOW }}>
          <div style={{ fontSize: 10, color: "rgba(243,242,242,0.55)", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 7, fontWeight: 700 }}>Gastos</div>
          <div className="tabular-nums" style={{ fontSize: 14.5, fontWeight: 800, color: TEXT }}>{fmtBRL(gastosMes)}</div>
        </div>
        <div style={{ borderRadius: 16, padding: "13px 10px", background: CARD, boxShadow: CARD_SHADOW }}>
          <div style={{ fontSize: 10, color: "rgba(243,242,242,0.55)", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 7, fontWeight: 700 }}>Saldo</div>
          <div className="tabular-nums" style={{ fontSize: 14.5, fontWeight: 800, color: TEXT }}>{fmtBRL(saldoMes)}</div>
        </div>
        <div style={{ borderRadius: 16, padding: "13px 10px", background: CARD, boxShadow: CARD_SHADOW }}>
          <div style={{ fontSize: 10, color: "rgba(243,242,242,0.55)", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 7, fontWeight: 700 }}>A receber</div>
          <div className="tabular-nums" style={{ fontSize: 14.5, fontWeight: 800, color: aReceber > 0 ? "#ff9783" : TEXT }}>{fmtBRL(aReceber)}</div>
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: "rgba(243,242,242,0.55)", textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 }}>
        Precisa da sua atenção
      </div>

      {alerts.map((alert) => (
        <div
          key={alert.id}
          onClick={alert.onClick}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 16, background: CARD, marginBottom: 8, cursor: "pointer", boxShadow: CARD_SHADOW_SM }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              flexShrink: 0,
              background: alert.level === "urgent" ? "#ec3013" : "transparent",
              border: "1.5px solid #ec3013",
              boxShadow: alert.level === "urgent" ? "0 0 8px rgba(236,48,19,0.9)" : "none",
            }}
          />
          <div style={{ flex: 1, fontSize: 14.5, color: TEXT, fontWeight: 500 }}>{alert.label}</div>
          <ChevronRight />
        </div>
      ))}

      {alerts.length === 0 && (
        <div style={{ padding: 20, borderRadius: 16, background: CARD, textAlign: "left", color: "rgba(243,242,242,0.5)", fontSize: 14 }}>
          Tudo em dia. Nenhuma pendência.
        </div>
      )}
    </div>
  );
}
