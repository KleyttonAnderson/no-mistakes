"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ACCENT, CARD, GRADIENT_ACCENT, GLOW_ACCENT, MUTED, TEXT } from "@/lib/colors";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

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
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setInfo("Conta criada. Verifique seu e-mail para confirmar o acesso.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 34 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg,#1e1d1c,#0f0e0d)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(236,48,19,0.25), inset 0 0 0 1px rgba(243,242,242,0.1)",
            }}
          >
            <Image src="/logo-mark.svg" alt="No Mistakes" width={30} height={30} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "0.06em", color: TEXT, textTransform: "uppercase" }}>
              Central No Mistakes
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#ff9783", letterSpacing: "0.14em" }}>
              CONSULTORIA
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ background: CARD, borderRadius: 24, padding: 24, boxShadow: "0 14px 34px rgba(0,0,0,0.4)" }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginBottom: 18 }}>
            {mode === "login" ? "Entrar" : "Criar conta"}
          </div>

          <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            E-mail
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...inputStyle, marginBottom: 16 }}
            placeholder="voce@email.com"
          />

          <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            Senha
          </div>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle, marginBottom: 20 }}
            placeholder="••••••••"
          />

          {error && (
            <div style={{ color: ACCENT, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{error}</div>
          )}
          {info && (
            <div style={{ color: "#22e08a", fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{info}</div>
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
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
          </button>

          <div
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
              setInfo(null);
            }}
            style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: MUTED, cursor: "pointer" }}
          >
            {mode === "login" ? (
              <>Não tem conta? <span style={{ color: "#ff9783", fontWeight: 700 }}>Cadastre-se</span></>
            ) : (
              <>Já tem conta? <span style={{ color: "#ff9783", fontWeight: 700 }}>Entrar</span></>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
