import { useQuery } from "@tanstack/react-query";

import { fetchContentBundle } from "./client";

export const contentQueryKey = ["content", "v1"] as const;

export function useContent() {
  return useQuery({
    queryKey: contentQueryKey,
    queryFn: fetchContentBundle,
    staleTime: 5 * 60 * 1000,
    gcTime: 1000 * 60 * 60 * 24 * 14,
    retry: 2,
    structuralSharing: false,
  });
}
