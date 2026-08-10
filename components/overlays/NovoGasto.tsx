"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { CARD, GLOW_ACCENT, GRADIENT_ACCENT, MUTED, TEXT, categoryColor } from "@/lib/colors";
import { OverlayHeader } from "@/components/overlays/OverlayHeader";

export function NovoGasto() {
  const { categories, today, novoGasto, addCategoria } = useApp();
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(today);
  const [categoria, setCategoria] = useState(categories[0]?.name ?? "");
  const [recorrente, setRecorrente] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const names = categories.map((c) => c.name);

  async function confirmNewCategory() {
    const name = newCategoryName.trim();
    if (!name || names.includes(name)) {
      setAddingCategory(false);
      return;
    }
    await addCategoria(name);
    setCategoria(name);
    setAddingCategory(false);
    setNewCategoryName("");
  }

  async function handleSubmit() {
    if (!descricao || !valor) return;
    setSubmitting(true);
    try {
      await novoGasto({ description: descricao, value: Number(valor), date: data, category: categoria, recurring: recorrente });
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
      <OverlayHeader title="Novo gasto" />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Descrição</div>
      <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: MFIT" style={inputStyle} />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Valor</div>
      <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} style={inputStyle} />

      <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Data</div>
      <input type="date" value={data} onChange={(e) => setData(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Categoria</div>
        <div onClick={() => setAddingCategory((v) => !v)} style={{ fontSize: 11, fontWeight: 800, color: "#ff9783", cursor: "pointer", letterSpacing: "0.03em" }}>
          {addingCategory ? "Cancelar" : "+ Nova categoria"}
        </div>
      </div>
      {addingCategory && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nome da categoria"
            style={{ flex: 1, background: CARD, border: "2px solid #ec3013", borderRadius: 14, padding: "11px 12px", color: TEXT, fontSize: 14 }}
          />
          <div onClick={confirmNewCategory} style={{ padding: "11px 18px", borderRadius: 14, background: GRADIENT_ACCENT, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
            OK
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
        {categories.map((c) => {
          const active = categoria === c.name;
          const col = categoryColor(names, c.name);
          return (
            <div
              key={c.id}
              onClick={() => setCategoria(c.name)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 13px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer", background: active ? col : "rgba(243,242,242,0.06)", color: active ? "#141312" : TEXT }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: col }} />
              {c.name}
            </div>
          );
        })}
      </div>

      <div
        onClick={() => setRecorrente((v) => !v)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 14, background: CARD, padding: 14, marginBottom: 28, cursor: "pointer" }}
      >
        <div style={{ fontSize: 14, color: TEXT, fontWeight: 600 }}>Recorrente mensal</div>
        <div style={{ width: 44, height: 26, borderRadius: 999, background: recorrente ? GRADIENT_ACCENT : "rgba(243,242,242,0.14)", position: "relative" }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: recorrente ? 21 : 3, transition: "left 0.15s" }} />
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div
        onClick={submitting ? undefined : handleSubmit}
        style={{ textAlign: "center", padding: 16, borderRadius: 16, background: GRADIENT_ACCENT, color: "#fff", fontSize: 14.5, fontWeight: 800, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1, boxShadow: GLOW_ACCENT }}
      >
        {submitting ? "Salvando..." : "Salvar gasto"}
      </div>
    </div>
  );
}
