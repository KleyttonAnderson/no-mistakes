"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { CARD, CARD_SHADOW_SM, TEXT } from "@/lib/colors";
import { fmtBRL } from "@/lib/format";
import { OverlayHeader } from "@/components/overlays/OverlayHeader";

export function Planos() {
  const { plans, updatePlanPrice } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  function startEdit(variantId: string, price: number) {
    setEditingId(variantId);
    setDraft(String(price));
  }

  async function commitEdit() {
    if (editingId) {
      await updatePlanPrice(editingId, Number(draft) || 0);
    }
    setEditingId(null);
  }

  return (
    <div style={{ padding: "20px 20px 30px" }}>
      <OverlayHeader title="Planos" />

      {plans.map((g) => (
        <div key={g.id} style={{ marginBottom: 16, borderRadius: 18, background: CARD, padding: "4px 16px", boxShadow: CARD_SHADOW_SM }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.03em", color: "#ff9783", paddingTop: 14, paddingBottom: 2 }}>
            {g.name}
          </div>
          {g.variants.map((v, vi) => {
            const editing = editingId === v.id;
            return (
              <div key={v.id} style={{ padding: "12px 0", borderBottom: vi === g.variants.length - 1 ? "none" : "1px solid rgba(243,242,242,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: TEXT, fontSize: 14.5, fontWeight: 600 }}>{v.name}</span>
                  {editing ? (
                    <input
                      type="number"
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                      style={{ background: "#141312", border: "2px solid #ec3013", borderRadius: 10, padding: "6px 10px", color: "#fff", fontSize: 14.5, width: 90, textAlign: "right" }}
                    />
                  ) : (
                    <span
                      onClick={() => startEdit(v.id, v.price)}
                      className="tabular-nums"
                      style={{ color: TEXT, fontSize: 14.5, fontWeight: 800, cursor: "pointer" }}
                    >
                      {fmtBRL(v.price)}
                    </span>
                  )}
                </div>
                {v.detail && <div style={{ fontSize: 12, color: "rgba(243,242,242,0.5)", marginTop: 4 }}>{v.detail}</div>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
