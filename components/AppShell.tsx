"use client";

import Image from "next/image";
import { useApp } from "@/lib/app-context";
import { BottomNav } from "@/components/BottomNav";
import { TEXT } from "@/lib/colors";
import { Dashboard } from "@/components/screens/Dashboard";
import { Alunos } from "@/components/screens/Alunos";
import { Financeiro } from "@/components/screens/Financeiro";
import { Config } from "@/components/screens/Config";
import { OverlayHost } from "@/components/overlays/OverlayHost";

export function AppShell() {
  const { tab, toast, loading } = useApp();

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        background: "#080807",
        backgroundImage:
          "radial-gradient(circle at 20% 0%,rgba(236,48,19,0.10),transparent 55%),radial-gradient(circle at 80% 100%,rgba(124,108,255,0.08),transparent 55%)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          minHeight: "100dvh",
          background: "#141312",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 0 1px rgba(243,242,242,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "calc(16px + env(safe-area-inset-top)) 20px 14px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: "linear-gradient(135deg,#1e1d1c,#0f0e0d)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(236,48,19,0.25), inset 0 0 0 1px rgba(243,242,242,0.1)",
              flexShrink: 0,
            }}
          >
            <Image src="/logo-mark.svg" alt="" width={19} height={19} />
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: "0.06em",
              color: TEXT,
              textTransform: "uppercase",
              lineHeight: 1.15,
            }}
          >
            CENTRAL NO MISTAKES
            <br />
            <span style={{ fontSize: 9.5, fontWeight: 700, color: "#ff9783", letterSpacing: "0.14em" }}>
              CONSULTORIA
            </span>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "rgba(243,242,242,0.5)", fontSize: 14 }}>
                Carregando...
              </div>
            ) : (
              <>
                {tab === "dashboard" && <Dashboard />}
                {tab === "alunos" && <Alunos />}
                {tab === "financeiro" && <Financeiro />}
                {tab === "config" && <Config />}
              </>
            )}
          </div>
          <BottomNav />
          <OverlayHost />
          {toast && (
            <div
              style={{
                position: "absolute",
                bottom: 100,
                left: 20,
                right: 20,
                background: "#f3f2f2",
                color: "#141312",
                fontSize: 13,
                fontWeight: 800,
                padding: "14px 18px",
                borderRadius: 16,
                boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
                zIndex: 70,
              }}
            >
              {toast}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
