"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACCENT, CARD, GRADIENT_ACCENT, GLOW_ACCENT, MUTED, TEXT } from "@/lib/colors";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: CARD,
    border: "none",
    borderRadius: 14,
    padding: "13px 14px",
    color: TEXT,
    fontSize: 15,
    width: "100%",
    boxSizing: "border-box",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("As senhas não são iguais.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível redefinir a senha. O link pode ter expirado — solicite um novo.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        background: "#080807",
        backgroundImage:
          "radial-gradient(circle at 20% 0%,rgba(236,48,19,0.10),transparent 55%),radial-gradient(circle at 80% 100%,rgba(124,108,255,0.08),transparent 55%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 360 }}>
        <form
          onSubmit={handleSubmit}
          style={{ background: CARD, borderRadius: 24, padding: 24, boxShadow: "0 14px 34px rgba(0,0,0,0.4)" }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginBottom: 18 }}>Nova senha</div>

          {done ? (
            <div style={{ color: "#22e08a", fontSize: 14, fontWeight: 600 }}>
              Senha atualizada! Redirecionando...
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Nova senha
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, marginBottom: 16 }}
                placeholder="••••••••"
              />

              <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Confirmar nova senha
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                style={{ ...inputStyle, marginBottom: 20 }}
                placeholder="••••••••"
              />

              {error && (
                <div style={{ color: ACCENT, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: 15,
                  borderRadius: 16,
                  background: GRADIENT_ACCENT,
                  color: "#fff",
                  fontSize: 14.5,
                  fontWeight: 800,
                  border: "none",
                  cursor: loading ? "default" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: GLOW_ACCENT,
                }}
              >
                {loading ? "Salvando..." : "Salvar nova senha"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
