"use client";
import { Botpress } from "@/lib/Botpress";
import { queryClient } from "@/lib/reactQueryUtils";
import { QueryClientProvider } from "@tanstack/react-query";

export function DocWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Botpress>{children}</Botpress>
    </QueryClientProvider>
  );
}
