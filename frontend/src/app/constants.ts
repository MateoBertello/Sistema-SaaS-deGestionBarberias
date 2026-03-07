export const GOLD = "#C9A84C";
export const GOLD_LIGHT = "#E2C77A";
export const GOLD_DIM = "rgba(201,168,76,0.15)";
export const BG = "#0A0A0A";
export const SURFACE = "#141414";
export const SURFACE2 = "#1A1A1A";
export const SURFACE3 = "#222222";
export const BORDER = "#282828";
export const BORDER2 = "#1E1E1E";
export const FONT_BODY = "'Plus Jakarta Sans', sans-serif";
export const FONT_DISPLAY = "'Cormorant Garamond', serif";

export const getTheme = (isDark: boolean) => isDark ? {
  BG: "#0A0A0A", SURFACE: "#141414", SURFACE2: "#1A1A1A",
  BORDER: "#282828", TEXT: "#F0EFE9", TEXT2: "#71717A", GOLD: "#C9A84C",
  FONT_DISPLAY: "'Cormorant Garamond', serif",
} : {
  BG: "#F5F4F0", SURFACE: "#FFFFFF", SURFACE2: "#EFEEE9",
  BORDER: "#DDDBD4", TEXT: "#0A0A0A", TEXT2: "#6B7280", GOLD: "#B8902E",
  FONT_DISPLAY: "'Cormorant Garamond', serif",
};

export function applyTheme(isDark: boolean) {
  const r = document.body.style;
  if (isDark) {
    r.setProperty("--bg",       "#0A0A0A");
    r.setProperty("--surface",  "#141414");
    r.setProperty("--surface2", "#1A1A1A");
    r.setProperty("--border",   "#282828");
    r.setProperty("--text",     "#F0EFE9");
    r.setProperty("--text2",    "#71717A");
    r.setProperty("--gold",     "#C9A84C");
  } else {
    r.setProperty("--bg",       "#F5F4F0");
    r.setProperty("--surface",  "#FFFFFF");
    r.setProperty("--surface2", "#EFEEE9");
    r.setProperty("--border",   "#DDDBD4");
    r.setProperty("--text",     "#0A0A0A");
    r.setProperty("--text2",    "#6B7280");
    r.setProperty("--gold",     "#B8902E");
  }
}