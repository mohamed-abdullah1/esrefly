"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/react-query";

export default function ReactQueryProviders(props: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
      {/* {process.env.NEXT_PUBLIC_ENV === "development" && ( */}
      <ReactQueryDevtools />
      {/* )} */}
    </QueryClientProvider>
  );
}
