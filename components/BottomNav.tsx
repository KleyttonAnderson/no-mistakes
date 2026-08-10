"use client";

import { useApp } from "@/lib/app-context";
import { ACCENT, MUTED } from "@/lib/colors";
import { AlunosIcon, ConfigIcon, DashboardIcon, FinanceiroIcon } from "@/components/icons";
import type { Tab } from "@/lib/types";

const TAB_PILL = "rgba(236,48,19,0.16)";

const ITEMS: { tab: Tab; label: string; Icon: (p: { color: string }) => React.JSX.Element }[] = [
  { tab: "dashboard", label: "Dashboard", Icon: DashboardIcon },
  { tab: "alunos", label: "Alunos", Icon: AlunosIcon },
  { tab: "financeiro", label: "Financeiro", Icon: FinanceiroIcon },
  { tab: "config", label: "Config", Icon: ConfigIcon },
];

export function BottomNav() {
  const { tab, setTab } = useApp();

  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        margin: "0 16px 14px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "10px 10px",
        borderRadius: 24,
        background: "rgba(28,27,26,0.92)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 14px 34px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(243,242,242,0.08)",
        zIndex: 30,
        paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
      }}
    >
      {ITEMS.map(({ tab: t, label, Icon }) => {
        const active = tab === t;
        return (
          <div
            key={t}
            onClick={() => setTab(t)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: 14,
              background: active ? TAB_PILL : "transparent",
            }}
          >
            <Icon color={active ? ACCENT : MUTED} />
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.01em", color: active ? ACCENT : MUTED }}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
