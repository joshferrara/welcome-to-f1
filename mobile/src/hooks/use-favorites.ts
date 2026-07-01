import React from "react";

import { useStoredValue } from "@/utils/storage";

export type FavoriteKind = "drivers" | "teams" | "races" | "topics" | "champions";

export type FavoritesState = Record<FavoriteKind, string[]>;

const emptyFavorites: FavoritesState = {
  drivers: [],
  teams: [],
  races: [],
  topics: [],
  champions: [],
};

export function useFavorites() {
  const [favorites, setFavorites] = useStoredValue<FavoritesState>("favorites.v1", emptyFavorites);

  const isFavorite = React.useCallback(
    (kind: FavoriteKind, id: string) => favorites[kind]?.includes(id) ?? false,
    [favorites]
  );

  const toggleFavorite = React.useCallback(
    (kind: FavoriteKind, id: string) => {
      const current = favorites[kind] ?? [];
      const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
      setFavorites({ ...favorites, [kind]: next });
    },
    [favorites, setFavorites]
  );

  return { favorites, isFavorite, toggleFavorite };
}
