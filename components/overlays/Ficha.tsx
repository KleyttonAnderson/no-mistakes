"use client";

import { useApp } from "@/lib/app-context";
import { ATIVO_C, CARD, CARD_SHADOW_SM, GRADIENT_ACCENT, GLOW_ACCENT, INATIVO_C, ONLINE_C, PRESENCIAL_C, TEXT, methodColor } from "@/lib/colors";
import { fmtBRL, fmtDateShort } from "@/lib/format";
import { paymentStatus, tagStyle, treinoStatus } from "@/lib/status";
import { Avatar } from "@/components/Avatar";
import { BackIcon } from "@/components/icons";

export function Ficha({ studentId }: { studentId: string }) {
  const { students, openOverlay, marcarTreino } = useApp();
  const st = students.find((s) => s.id === studentId);
  if (!st) return null;

  const ps = paymentStatus(st);
  const ts = treinoStatus(st);
  const tsTag = ts ? tagStyle(ts.level) : null;
  const typeColor = st.type === "Online" ? ONLINE_C : PRESENCIAL_C;
  const statusDotColor = st.status === "Ativo" ? ATIVO_C : INATIVO_C;

  return (
    <div style={{ padding: "20px 20px 90px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div
          onClick={() => openOverlay(null)}
          style={{ cursor: "pointer", padding: 8, borderRadius: 12, background: CARD, color: "rgba(243,242,242,0.8)" }}
        >
          <BackIcon />
        </div>
        <Avatar studentId={st.id} avatarUrl={st.avatar_url} name={st.name} size={40} />
        <div style={{ fontSize: 19, fontWeight: 800, color: TEXT, flex: 1 }}>{st.name}</div>
        <div style={{ fontSize: 10.5, fontWeight: 800, padding: "4px 10px", borderRadius: 999, color: statusDotColor, background: "rgba(243,242,242,0.08)" }}>
          {st.status}
        </div>
      </div>

      <Section title="Informações">
        <Row label="Telefone" value={st.phone || "—"} />
        <Row label="Tipo" value={st.type} valueColor={typeColor} valueWeight={800} last />
      </Section>

      <Section title="Plano">
        <Row label="Plano" value={st.plan} />
        <Row label="Valor" value={fmtBRL(st.value)} />
        <Row label="Início" value={fmtDateShort(st.start_date)} />
        <Row label="Próximo vencimento" value={fmtDateShort(st.next_due_date)} valueColor={tagStyle(ps.level === "off" ? "off" : ps.level).color} valueWeight={800} last />
      </Section>

      {st.type === "Online" && (
        <Section title="Treino">
          <Row label="Última atualização" value={fmtDateShort(st.last_training_update)} />
          <Row label="Próxima atualização" value={fmtDateShort(st.next_training_update)} valueColor={tsTag?.color} valueWeight={800} noBorder />
          <div
            onClick={() => marcarTreino(st.id)}
            style={{ textAlign: "center", padding: "12px 14px", borderRadius: 12, background: "rgba(243,242,242,0.06)", color: TEXT, fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 4, marginBottom: 4 }}
          >
            Marcar treino como atualizado
          </div>
        </Section>
      )}

      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: "rgba(243,242,242,0.5)", textTransform: "uppercase", margin: "6px 0 8px 4px" }}>
        Pagamentos
      </div>
      {st.payments.map((p) => (
        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderRadius: 14, background: CARD, marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{fmtDateShort(p.date)}</div>
            <div style={{ fontSize: 12, color: methodColor(p.method), marginTop: 2, fontWeight: 700 }}>
              {p.method} · {p.status}
            </div>
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: TEXT }}>{fmtBRL(p.value)}</div>
        </div>
      ))}
      {st.payments.length === 0 && (
        <div style={{ padding: 16, borderRadius: 14, background: CARD, color: "rgba(243,242,242,0.5)", fontSize: 13.5 }}>
          Nenhum pagamento registrado ainda.
        </div>
      )}

      <div
        onClick={() => openOverlay({ type: "pagamento", studentId: st.id })}
        style={{ marginTop: 12, textAlign: "center", padding: 16, borderRadius: 16, background: GRADIENT_ACCENT, color: "#fff", fontSize: 14.5, fontWeight: 800, cursor: "pointer", boxShadow: GLOW_ACCENT }}
      >
        Registrar pagamento
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 18, background: CARD, padding: "4px 16px", marginBottom: 14, boxShadow: CARD_SHADOW_SM }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: "rgba(243,242,242,0.5)", textTransform: "uppercase", paddingTop: 12 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  valueColor = TEXT,
  valueWeight = 600,
  last = false,
  noBorder = false,
}: {
  label: string;
  value: string;
  valueColor?: string;
  valueWeight?: number;
  last?: boolean;
  noBorder?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: last || noBorder ? "none" : "1px solid rgba(243,242,242,0.08)",
        marginBottom: noBorder ? 12 : 0,
      }}
    >
      <span style={{ color: "rgba(243,242,242,0.55)", fontSize: 14 }}>{label}</span>
      <span style={{ color: valueColor, fontSize: 14, fontWeight: valueWeight }}>{value}</span>
    </div>
  );
}
