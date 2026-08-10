export const BG_APP = "#141312";
export const BG_OUTER = "#080807";
export const CARD = "#1c1b1a";
export const TEXT = "#f3f2f2";
export const MUTED = "rgba(243,242,242,0.6)";
export const SUBTLE = "rgba(243,242,242,0.55)";
export const FAINT = "rgba(243,242,242,0.4)";
export const DIVIDER = "rgba(243,242,242,0.08)";

export const ACCENT = "#ec3013";
export const ACCENT_LIGHT = "#ff9783";
export const GRADIENT_ACCENT = "linear-gradient(135deg,#ec3013,#ff7a45)";
export const GLOW_ACCENT = "0 10px 26px rgba(236,48,19,0.45)";

export const ONLINE_C = "#3ec6ff";
export const PRESENCIAL_C = "#ffb020";
export const ATIVO_C = "#22e08a";
export const INATIVO_C = "rgba(243,242,242,0.35)";

export const METHOD_COLORS: Record<string, string> = {
  PIX: "#22e08a",
  Cartão: "#7c6cff",
  Dinheiro: "#ffb020",
  Outro: "#ff6b4a",
};

export const CAT_PALETTE = [
  "#3ec6ff",
  "#7c6cff",
  "#ff5fa8",
  "#ffb020",
  "#22e08a",
  "#ff6b4a",
  "#e6cf3e",
  "#4ad6c0",
];

export const CARD_SHADOW = "0 8px 22px rgba(0,0,0,0.3)";
export const CARD_SHADOW_SM = "0 6px 18px rgba(0,0,0,0.28)";

export function methodColor(m: string) {
  return METHOD_COLORS[m] ?? FAINT;
}

export function categoryColor(categories: string[], name: string) {
  const idx = categories.indexOf(name);
  return CAT_PALETTE[(idx < 0 ? 0 : idx) % CAT_PALETTE.length];
}
