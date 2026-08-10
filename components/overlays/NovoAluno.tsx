"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import { CARD, GLOW_ACCENT, GRADIENT_ACCENT, MUTED, ONLINE_C, PRESENCIAL_C, TEXT } from "@/lib/colors";
import { addMonthsISO } from "@/lib/format";
import { OverlayHeader } from "@/components/overlays/OverlayHeader";
import type { StudentType } from "@/lib/types";

export function NovoAluno() {
  const { plans, today, novoAluno } = useApp();

  const flatOptions = useMemo(
    () =>
      plans.flatMap((p) =>
        p.variants.map((v) => ({ key: `${p.name}|${v.name}`, label: `${p.name} — ${v.name}`, price: v.price })),
      ),
    [plans],
  );

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipo, setTipo] = useState<StudentType>("Online");
  const [planoKey, setPlanoKey] = useState(flatOptions[0]?.key ?? "");
  const [valor, setValor] = useState(String(flatOptions[0]?.price ?? ""));
  const [dataInicio, setDataInicio] = useState(today);
  const [proximoVencimento, setProximoVencimento] = useState(addMonthsISO(today, 1));
  const [proximaAtualizacaoTreino, setProximaAtualizacaoTreino] = useState(addMonthsISO(today, 1));
  const [submitting, setSubmitting] = useState(false);

  function handlePlanoChange(key: string) {
    setPlanoKey(key);
    const opt = flatOptions.find((o) => o.key === key);
    if (opt) setValor(String(opt.price));
  }

  async function handleSubmit() {
    if (!nome) return;
    setSubmitting(true);
    try {
      await novoAluno({
        name: nome,
        phone: telefone,
        type: tipo,
        plan: planoKey.replace("|", " · "),
        value: Number(valor) || 0,
        startDate: dataInicio,
        nextDueDate: proximoVencimento,
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
      <OverlayHeader title="Novo aluno" />

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

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Plano</div>
      <select value={planoKey} onChange={(e) => handlePlanoChange(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }}>
        {flatOptions.map((p) => (
          <option key={p.key} value={p.key}>
            {p.label}
          </option>
        ))}
      </select>

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Valor</div>
      <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} style={inputStyle} />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Data de início</div>
      <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Próximo vencimento</div>
      <input type="date" value={proximoVencimento} onChange={(e) => setProximoVencimento(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />

      {tipo === "Online" && (
        <>
          <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            Próxima atualização de treino
          </div>
          <input
            type="date"
            value={proximaAtualizacaoTreino}
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
        {submitting ? "Salvando..." : "Cadastrar aluno"}
      </div>
    </div>
  );
}
