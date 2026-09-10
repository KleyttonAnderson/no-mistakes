"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { ATIVO_C, CARD, GLOW_ACCENT, GRADIENT_ACCENT, INATIVO_C, MUTED, ONLINE_C, PRESENCIAL_C, TEXT } from "@/lib/colors";
import { OverlayHeader } from "@/components/overlays/OverlayHeader";
import type { StudentStatus, StudentType } from "@/lib/types";

export function EditarAluno({ studentId }: { studentId: string }) {
  const { students, updateStudent, today } = useApp();
  const st = students.find((s) => s.id === studentId);

  const [nome, setNome] = useState(st?.name ?? "");
  const [telefone, setTelefone] = useState(st?.phone ?? "");
  const [tipo, setTipo] = useState<StudentType>(st?.type ?? "Online");
  const [status, setStatus] = useState<StudentStatus>(st?.status ?? "Ativo");
  const [plano, setPlano] = useState(st?.plan ?? "");
  const [valor, setValor] = useState(String(st?.value ?? ""));
  const [dataInicio, setDataInicio] = useState(st?.start_date ?? today);
  const [proximoVencimento, setProximoVencimento] = useState(st?.next_due_date ?? today);
  const [ultimaAtualizacaoTreino, setUltimaAtualizacaoTreino] = useState(st?.last_training_update ?? today);
  const [proximaAtualizacaoTreino, setProximaAtualizacaoTreino] = useState(st?.next_training_update ?? today);
  const [submitting, setSubmitting] = useState(false);

  if (!st) return null;

  async function handleSubmit() {
    if (!nome) return;
    setSubmitting(true);
    try {
      await updateStudent(studentId, {
        name: nome,
        phone: telefone,
        type: tipo,
        status,
        plan: plano,
        value: Number(valor) || 0,
        startDate: dataInicio,
        nextDueDate: proximoVencimento,
        lastTrainingUpdate: tipo === "Online" ? ultimaAtualizacaoTreino : null,
        nextTrainingUpdate: tipo === "Online" ? proximaAtualizacaoTreino : null,
      });
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
    marginBottom: 14,
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "20px 20px 30px", flex: 1, display: "flex", flexDirection: "column" }}>
      <OverlayHeader title="Editar aluno" />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Nome</div>
      <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Telefone</div>
      <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 90000-0000" style={inputStyle} />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Tipo</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {(["Online", "Presencial"] as StudentType[]).map((t) => {
          const c = t === "Online" ? ONLINE_C : PRESENCIAL_C;
          const active = tipo === t;
          return (
            <div
              key={t}
              onClick={() => setTipo(t)}
              style={{ textAlign: "center", padding: "12px 4px", borderRadius: 12, fontSize: 13.5, fontWeight: 800, cursor: "pointer", background: active ? c : "rgba(243,242,242,0.06)", color: active ? "#141312" : c }}
            >
              {t}
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Status</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {(["Ativo", "Inativo"] as StudentStatus[]).map((s) => {
          const c = s === "Ativo" ? ATIVO_C : INATIVO_C;
          const active = status === s;
          return (
            <div
              key={s}
              onClick={() => setStatus(s)}
              style={{ textAlign: "center", padding: "12px 4px", borderRadius: 12, fontSize: 13.5, fontWeight: 800, cursor: "pointer", background: active ? c : "rgba(243,242,242,0.06)", color: active ? "#141312" : c }}
            >
              {s}
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Plano</div>
      <input type="text" value={plano} onChange={(e) => setPlano(e.target.value)} style={inputStyle} />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Valor</div>
      <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} style={inputStyle} />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Data de início</div>
      <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Próximo vencimento</div>
      <input type="date" value={proximoVencimento} onChange={(e) => setProximoVencimento(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />

      {tipo === "Online" && (
        <>
          <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            Última atualização de treino
          </div>
          <input
            type="date"
            value={ultimaAtualizacaoTreino ?? ""}
            onChange={(e) => setUltimaAtualizacaoTreino(e.target.value)}
            style={{ ...inputStyle, colorScheme: "dark" }}
          />

          <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            Próxima atualização de treino
          </div>
          <input
            type="date"
            value={proximaAtualizacaoTreino ?? ""}
            onChange={(e) => setProximaAtualizacaoTreino(e.target.value)}
            style={{ ...inputStyle, colorScheme: "dark" }}
          />
        </>
      )}

      <div style={{ flex: 1, minHeight: 10 }} />
      <div
        onClick={submitting ? undefined : handleSubmit}
        style={{ textAlign: "center", padding: 16, borderRadius: 16, background: GRADIENT_ACCENT, color: "#fff", fontSize: 14.5, fontWeight: 800, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1, marginTop: 6, boxShadow: GLOW_ACCENT }}
      >
        {submitting ? "Salvando..." : "Salvar alterações"}
      </div>
    </div>
  );
}
