"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import { CARD, CARD_SHADOW_SM, GLOW_ACCENT, GRADIENT_ACCENT, MUTED, TEXT } from "@/lib/colors";
import { fmtDateShort } from "@/lib/format";
import { OverlayHeader } from "@/components/overlays/OverlayHeader";
import { LoadChart } from "@/components/LoadChart";
import { TrashIcon } from "@/components/icons";

export function Progressao({ studentId, workoutItemId }: { studentId: string; workoutItemId: string }) {
  const { students, today, updateWorkoutItem, registrarCarga, deleteLoadLog } = useApp();
  const st = students.find((s) => s.id === studentId);
  const item = st?.workout_items.find((w) => w.id === workoutItemId);

  const [editing, setEditing] = useState(false);
  const [series, setSeries] = useState(item ? String(item.sets) : "");
  const [reps, setReps] = useState(item?.reps ?? "");

  const [peso, setPeso] = useState("");
  const [data, setData] = useState(today);
  const [repsLog, setRepsLog] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const history = useMemo(
    () => (item ? st!.load_logs.filter((l) => l.exercise_id === item.exercise_id).sort((a, b) => b.date.localeCompare(a.date)) : []),
    [st, item],
  );

  const chartPoints = useMemo(() => [...history].reverse().map((l) => ({ date: l.date, weight: l.weight })), [history]);

  if (!st || !item) return null;

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

  async function saveEdit() {
    await updateWorkoutItem(studentId, workoutItemId, {
      sets: Number(series) || 1,
      reps: reps || "-",
      targetWeight: item!.target_weight,
    });
    setEditing(false);
  }

  async function handleLog() {
    if (!peso) return;
    setSubmitting(true);
    try {
      await registrarCarga({
        studentId,
        exerciseId: item!.exercise_id,
        workoutItemId,
        date: data,
        weight: Number(peso),
        reps: repsLog ? Number(repsLog) : null,
        sets: null,
      });
      setPeso("");
      setRepsLog("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: "20px 20px 30px" }}>
      <OverlayHeader title={item.exercise_name} />

      <div style={{ borderRadius: 18, background: CARD, padding: 16, marginBottom: 16, boxShadow: CARD_SHADOW_SM }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: MUTED, textTransform: "uppercase", marginBottom: 12 }}>
          Progressão de carga
        </div>
        <LoadChart points={chartPoints} />
      </div>

      <div style={{ borderRadius: 18, background: CARD, padding: "4px 16px", marginBottom: 16, boxShadow: CARD_SHADOW_SM }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, paddingBottom: editing ? 8 : 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: MUTED, textTransform: "uppercase" }}>Prescrição</div>
          <div onClick={() => (editing ? saveEdit() : setEditing(true))} style={{ fontSize: 11.5, fontWeight: 800, color: "#ff9783", cursor: "pointer" }}>
            {editing ? "Salvar" : "Editar"}
          </div>
        </div>
        {editing ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, paddingBottom: 14 }}>
            <input type="number" value={series} onChange={(e) => setSeries(e.target.value)} placeholder="Séries" style={inputStyle} />
            <input type="text" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="Repetições" style={inputStyle} />
          </div>
        ) : (
          <div style={{ paddingBottom: 14, color: TEXT, fontSize: 14.5, fontWeight: 700 }}>
            {item.sets}x {item.reps}
          </div>
        )}
      </div>

      <div style={{ borderRadius: 18, background: CARD, padding: 16, marginBottom: 16, boxShadow: CARD_SHADOW_SM }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: MUTED, textTransform: "uppercase", marginBottom: 12 }}>
          Registrar carga de hoje
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Peso (kg)</div>
            <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Reps feitas</div>
            <input type="number" value={repsLog} onChange={(e) => setRepsLog(e.target.value)} placeholder="Opcional" style={inputStyle} />
          </div>
        </div>
        <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Data</div>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} style={{ ...inputStyle, colorScheme: "dark", marginBottom: 14 }} />
        <div
          onClick={submitting ? undefined : handleLog}
          style={{ textAlign: "center", padding: 14, borderRadius: 14, background: GRADIENT_ACCENT, color: "#fff", fontSize: 14, fontWeight: 800, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1, boxShadow: GLOW_ACCENT }}
        >
          {submitting ? "Salvando..." : "Registrar"}
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: MUTED, textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 }}>
        Histórico
      </div>
      {history.map((log) => (
        <div key={log.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderRadius: 14, background: CARD, marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>
              {log.weight.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kg
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
              {fmtDateShort(log.date)}
              {log.reps != null && ` · ${log.reps} reps`}
            </div>
          </div>
          <div onClick={() => deleteLoadLog(log.id)} style={{ cursor: "pointer", padding: 6, color: "rgba(243,242,242,0.4)" }}>
            <TrashIcon />
          </div>
        </div>
      ))}
      {history.length === 0 && (
        <div style={{ padding: 16, borderRadius: 14, background: CARD, color: "rgba(243,242,242,0.5)", fontSize: 13.5 }}>
          Nenhum registro ainda.
        </div>
      )}
    </div>
  );
}
