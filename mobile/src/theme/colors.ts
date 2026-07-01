export type ThemeMode = "light" | "dark";

export const brand = {
  f1Red: "#E10600",
  f1RedDark: "#B00500",
  amber: "#F59E0B",
  gold: "#FFD700",
  cyan: "#00D2FF",
  softTyre: "#FF3333",
  mediumTyre: "#FFC61E",
  hardTyre: "#FFFFFF",
  interTyre: "#43B02A",
  wetTyre: "#0071C5",
};

export const themes = {
  dark: {
    mode: "dark" as const,
    background: "#0B0A09",
    secondaryBackground: "#12110F",
    card: "#181614",
    cardHover: "#1E1C19",
    elevated: "#201E1B",
    text: "#F5F3F0",
    secondaryText: "#A8A49E",
    tertiaryText: "#736E67",
    border: "rgba(255,245,230,0.08)",
    strongBorder: "rgba(255,245,230,0.16)",
    glass: "rgba(22,20,18,0.82)",
    inverseText: "#111111",
    muted: "#2A2621",
    success: "#43B02A",
    warning: "#F59E0B",
    danger: "#E10600",
  },
  light: {
    mode: "light" as const,
    background: "#FAF9F7",
    secondaryBackground: "#F2F0EC",
    card: "#FFFFFE",
    cardHover: "#F8F6F3",
    elevated: "#FFFFFE",
    text: "#1C1917",
    secondaryText: "#6B6560",
    tertiaryText: "#9A948E",
    border: "rgba(28,25,23,0.09)",
    strongBorder: "rgba(28,25,23,0.16)",
    glass: "rgba(250,249,247,0.84)",
    inverseText: "#FFFFFF",
    muted: "#E7E1DA",
    success: "#2F8F22",
    warning: "#B96D00",
    danger: "#B00500",
  },
};

export type AppColors = (typeof themes)[ThemeMode];
