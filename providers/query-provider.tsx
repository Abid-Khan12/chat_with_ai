"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrimaryChildrenProp } from "@/types/types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 0,
    },
    mutations: {
      retry: 0,
    },
  },
});

const ReactQueryProvider = ({ children }: PrimaryChildrenProp) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
