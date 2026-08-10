"use client";

import { useApp } from "@/lib/app-context";
import { CARD, TEXT } from "@/lib/colors";
import { BackIcon } from "@/components/icons";

export function OverlayHeader({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  const { closeOverlay } = useApp();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
      <div
        onClick={closeOverlay}
        style={{ cursor: "pointer", padding: 8, borderRadius: 12, background: CARD, color: "rgba(243,242,242,0.8)" }}
      >
        <BackIcon />
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, flex: 1 }}>{title}</div>
      {right}
    </div>
  );
}
