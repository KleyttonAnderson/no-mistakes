"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { ACCENT_LIGHT, CARD, CARD_SHADOW_SM, GLOW_ACCENT, GRADIENT_ACCENT, MUTED, TEXT } from "@/lib/colors";
import { fmtDateShort } from "@/lib/format";
import { OverlayHeader } from "@/components/overlays/OverlayHeader";
import { ChevronRight, TrashIcon } from "@/components/icons";

export function Treino({ studentId }: { studentId: string }) {
  const { students, openOverlay, addWorkoutItem, deleteWorkoutItem } = useApp();
  const st = students.find((s) => s.id === studentId);

  const [adding, setAdding] = useState(false);
  const [nome, setNome] = useState("");
  const [series, setSeries] = useState("3");
  const [reps, setReps] = useState("10-12");
  const [carga, setCarga] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!st) return null;

  const inputStyle: React.CSSProperties = {
    background: "#141312",
    border: "none",
    borderRadius: 12,
    padding: "11px 12px",
    color: TEXT,
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
  };

  async function handleAdd() {
    if (!nome.trim()) return;
    setSubmitting(true);
    try {
      await addWorkoutItem({
        studentId,
        exerciseName: nome,
        sets: Number(series) || 1,
        reps: reps || "-",
        targetWeight: carga ? Number(carga) : null,
      });
      setNome("");
      setSeries("3");
      setReps("10-12");
      setCarga("");
      setAdding(false);
    } finally {
      setSubmitting(false);
    }
  }

  function handleDelete(itemId: string, name: string) {
    if (window.confirm(`Remover "${name}" do treino de ${st!.name}?`)) {
      deleteWorkoutItem(studentId, itemId);
    }
  }

  return (
    <div style={{ padding: "20px 20px 30px" }}>
      <OverlayHeader title={`Treino de ${st.name}`} />

      {st.last_training_update && (
        <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 16 }}>
          Última atualização: <span style={{ color: TEXT, fontWeight: 700 }}>{fmtDateShort(st.last_training_update)}</span>
        </div>
      )}

      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: MUTED, textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 }}>
        Exercícios
      </div>

      {st.workout_items.map((item) => (
        <div
          key={item.id}
          style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 16, background: CARD, padding: "13px 14px", marginBottom: 8, boxShadow: CARD_SHADOW_SM }}
        >
          <div
            onClick={() => openOverlay({ type: "progressao", studentId, workoutItemId: item.id })}
            style={{ flex: 1, cursor: "pointer" }}
          >
            <div style={{ fontSize: 14.5, fontWeight: 700, color: TEXT, marginBottom: 3 }}>{item.exercise_name}</div>
            <div style={{ fontSize: 12.5, color: MUTED }}>
              {item.sets}x {item.reps}
              {item.target_weight != null && (
                <>
                  {" · "}
                  <span style={{ color: ACCENT_LIGHT, fontWeight: 800 }}>
                    {item.target_weight.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kg
                  </span>
                </>
              )}
            </div>
          </div>
          <div onClick={() => handleDelete(item.id, item.exercise_name)} style={{ cursor: "pointer", padding: 6, color: "rgba(243,242,242,0.4)" }}>
            <TrashIcon />
          </div>
          <div onClick={() => openOverlay({ type: "progressao", studentId, workoutItemId: item.id })} style={{ cursor: "pointer" }}>
            <ChevronRight />
          </div>
        </div>
      ))}

      {st.workout_items.length === 0 && !adding && (
        <div style={{ padding: 16, borderRadius: 14, background: CARD, color: "rgba(243,242,242,0.5)", fontSize: 13.5, marginBottom: 8 }}>
          Nenhum exercício no treino ainda.
        </div>
      )}

      {adding ? (
        <div style={{ borderRadius: 16, background: CARD, padding: 14, marginTop: 10, boxShadow: CARD_SHADOW_SM }}>
          <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Exercício</div>
          <input type="text" autoFocus value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Agachamento livre" style={{ ...inputStyle, marginBottom: 10 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Séries</div>
              <input type="number" value={series} onChange={(e) => setSeries(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Repetições</div>
              <input type="text" value={reps} onChange={(e) => setReps(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Carga inicial (kg)</div>
          <input type="number" value={carga} onChange={(e) => setCarga(e.target.value)} placeholder="Opcional" style={{ ...inputStyle, marginBottom: 14 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <div
              onClick={() => setAdding(false)}
              style={{ flex: 1, textAlign: "center", padding: 13, borderRadius: 12, background: "rgba(243,242,242,0.06)", color: TEXT, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
            >
              Cancelar
            </div>
            <div
              onClick={submitting ? undefined : handleAdd}
              style={{ flex: 1, textAlign: "center", padding: 13, borderRadius: 12, background: GRADIENT_ACCENT, color: "#fff", fontSize: 13.5, fontWeight: 800, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1, boxShadow: GLOW_ACCENT }}
            >
              {submitting ? "Salvando..." : "Adicionar"}
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setAdding(true)}
          style={{ textAlign: "center", padding: 14, borderRadius: 16, background: "rgba(243,242,242,0.06)", color: TEXT, fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginTop: 10 }}
        >
          + Adicionar exercício
        </div>
      )}
    </div>
  );
}
