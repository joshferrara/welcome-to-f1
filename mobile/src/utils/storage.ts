import "expo-sqlite/localStorage/install";

import { useCallback, useSyncExternalStore } from "react";

type Listener = () => void;
type CacheEntry = {
  raw: string | null;
  value: unknown;
};

const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, CacheEntry>();

function notify(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      const cached = cache.get(key);
      if (cached && cached.raw === raw) return cached.value as T;

      const value = raw ? (JSON.parse(raw) as T) : fallback;
      cache.set(key, { raw, value });
      return value;
    } catch {
      cache.set(key, { raw: null, value: fallback });
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    const raw = JSON.stringify(value);
    localStorage.setItem(key, raw);
    cache.set(key, { raw, value });
    notify(key);
  },
  remove(key: string) {
    localStorage.removeItem(key);
    cache.delete(key);
    notify(key);
  },
  subscribe(key: string, listener: Listener) {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }
    listeners.get(key)?.add(listener);
    return () => listeners.get(key)?.delete(listener);
  },
};

export function useStoredValue<T>(key: string, fallback: T): [T, (value: T) => void] {
  const value = useSyncExternalStore(
    (callback) => storage.subscribe(key, callback),
    () => storage.get(key, fallback),
    () => fallback
  );

  const setValue = useCallback((nextValue: T) => storage.set(key, nextValue), [key]);

  return [value, setValue];
}
