"use client";

import { useApp } from "@/lib/app-context";
import { CARD, CARD_SHADOW_SM, TEXT } from "@/lib/colors";
import { ChevronRight } from "@/components/icons";

export function Config() {
  const { openOverlay, signOut } = useApp();

  return (
    <div style={{ padding: "6px 20px 8px" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 18 }}>Configurações</div>

      <div
        onClick={() => openOverlay({ type: "planos" })}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 16, background: CARD, marginBottom: 10, cursor: "pointer", boxShadow: CARD_SHADOW_SM }}
      >
        <div style={{ fontSize: 15, color: TEXT, fontWeight: 600 }}>Planos</div>
        <ChevronRight />
      </div>

      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 16, background: CARD, marginBottom: 10, boxShadow: CARD_SHADOW_SM }}
      >
        <div style={{ fontSize: 15, color: TEXT, fontWeight: 600 }}>Modo escuro</div>
        <div
          style={{
            width: 44,
            height: 26,
            borderRadius: 999,
            background: "linear-gradient(135deg,#ec3013,#ff7a45)",
            position: "relative",
            boxShadow: "0 0 10px rgba(236,48,19,0.5)",
          }}
        >
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: 21 }} />
        </div>
      </div>

      <div
        onClick={signOut}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 16, background: CARD, marginBottom: 10, cursor: "pointer", boxShadow: CARD_SHADOW_SM }}
      >
        <div style={{ fontSize: 15, color: "#ff6b4a", fontWeight: 600 }}>Sair da conta</div>
      </div>

      <div style={{ textAlign: "left", fontSize: 12, color: "rgba(243,242,242,0.4)", marginTop: 16, paddingLeft: 4 }}>
        Central No Mistakes Consultoria · v1.0
      </div>
    </div>
  );
}
