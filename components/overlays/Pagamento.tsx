"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import { CARD, GLOW_ACCENT, GRADIENT_ACCENT, MUTED, TEXT, methodColor } from "@/lib/colors";
import { OverlayHeader } from "@/components/overlays/OverlayHeader";
import type { PaymentMethod } from "@/lib/types";

const METHODS: PaymentMethod[] = ["PIX", "Cartão", "Dinheiro", "Outro"];

export function Pagamento({ studentId }: { studentId?: string }) {
  const { students, today, registrarPagamento } = useApp();
  const activeStudents = useMemo(() => students.filter((s) => s.status === "Ativo"), [students]);
  const lockedStudent = studentId ? students.find((s) => s.id === studentId) : undefined;

  const [selectedId, setSelectedId] = useState(studentId ?? activeStudents[0]?.id ?? "");
  const currentStudent = lockedStudent ?? students.find((s) => s.id === selectedId);

  const [valor, setValor] = useState(currentStudent ? String(currentStudent.value) : "");
  const [data, setData] = useState(today);
  const [forma, setForma] = useState<PaymentMethod>("PIX");
  const [submitting, setSubmitting] = useState(false);

  function handleSelectChange(id: string) {
    setSelectedId(id);
    const st = students.find((s) => s.id === id);
    if (st) setValor(String(st.value));
  }

  async function handleSubmit() {
    const id = lockedStudent?.id ?? selectedId;
    if (!id || !valor) return;
    setSubmitting(true);
    try {
      await registrarPagamento({ studentId: id, value: Number(valor), date: data, method: forma });
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: CARD,
    border: "none",
    borderRadius: 14,
    padding: "13px 14px",
    color: TEXT,
    fontSize: 15,
    marginBottom: 18,
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "20px 20px 30px", flex: 1, display: "flex", flexDirection: "column" }}>
      <OverlayHeader title="Registrar pagamento" />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
        Aluno
      </div>
      {lockedStudent ? (
        <div style={{ borderRadius: 14, background: CARD, padding: "13px 14px", color: TEXT, fontSize: 15, fontWeight: 700, marginBottom: 18 }}>
          {lockedStudent.name}
        </div>
      ) : (
        <select value={selectedId} onChange={(e) => handleSelectChange(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }}>
          {activeStudents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      )}

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
        Valor
      </div>
      <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} style={inputStyle} />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
        Data
      </div>
      <input type="date" value={data} onChange={(e) => setData(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
        Forma de pagamento
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 28 }}>
        {METHODS.map((m) => {
          const active = forma === m;
          const c = methodColor(m);
          return (
            <div
              key={m}
              onClick={() => setForma(m)}
              style={{ textAlign: "center", padding: "12px 4px", borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: "pointer", background: active ? c : "rgba(243,242,242,0.06)", color: active ? "#141312" : c }}
            >
              {m}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />
      <div
        onClick={submitting ? undefined : handleSubmit}
        style={{ textAlign: "center", padding: 16, borderRadius: 16, background: GRADIENT_ACCENT, color: "#fff", fontSize: 14.5, fontWeight: 800, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1, boxShadow: GLOW_ACCENT }}
      >
        {submitting ? "Salvando..." : "Confirmar pagamento"}
      </div>
    </div>
  );
}
