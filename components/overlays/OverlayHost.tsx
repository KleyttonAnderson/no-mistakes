"use client";

import { useApp } from "@/lib/app-context";
import { Ficha } from "@/components/overlays/Ficha";
import { Pagamento } from "@/components/overlays/Pagamento";
import { NovoGasto } from "@/components/overlays/NovoGasto";
import { NovoAluno } from "@/components/overlays/NovoAluno";
import { Planos } from "@/components/overlays/Planos";

export function OverlayHost() {
  const { overlay } = useApp();
  if (!overlay) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#141312",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {overlay.type === "ficha" && <Ficha studentId={overlay.studentId} />}
      {overlay.type === "pagamento" && <Pagamento studentId={overlay.studentId} />}
      {overlay.type === "novoGasto" && <NovoGasto />}
      {overlay.type === "novoAluno" && <NovoAluno />}
      {overlay.type === "planos" && <Planos />}
    </div>
  );
}
