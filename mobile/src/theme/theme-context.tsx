import React from "react";
import { useColorScheme } from "react-native";

import { AppColors, brand, themes, ThemeMode } from "./colors";
import { useStoredValue } from "@/utils/storage";

export type ThemePreference = "system" | ThemeMode;
export type UnitPreference = "imperial" | "metric";

type ThemeContextValue = {
  colors: AppColors;
  brand: typeof brand;
  mode: ThemeMode;
  themePreference: ThemePreference;
  setThemePreference: (value: ThemePreference) => void;
  unitPreference: UnitPreference;
  setUnitPreference: (value: UnitPreference) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themePreference, setThemePreference] = useStoredValue<ThemePreference>(
    "settings.theme",
    "dark"
  );
  const [unitPreference, setUnitPreference] = useStoredValue<UnitPreference>(
    "settings.units",
    "imperial"
  );

  const mode: ThemeMode =
    themePreference === "system" ? (systemScheme === "light" ? "light" : "dark") : themePreference;

  const value = React.useMemo(
    () => ({
      colors: themes[mode],
      brand,
      mode,
      themePreference,
      setThemePreference,
      unitPreference,
      setUnitPreference,
    }),
    [mode, setThemePreference, setUnitPreference, themePreference, unitPreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const value = React.use(ThemeContext);
  if (!value) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }
  return value;
}
