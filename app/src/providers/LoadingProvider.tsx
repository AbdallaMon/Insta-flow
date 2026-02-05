"use client";

import React, { createContext, useContext, useState } from "react";
import { Setter } from "@/shared/types/general";

// ============================================================================
// TYPES
// ============================================================================

interface LoadingContextValue {
  loading: boolean;
  setLoading: Setter<boolean>;
}

// ============================================================================
// CONTEXT
// ============================================================================

const LoadingContext = createContext<LoadingContextValue | undefined>(
  undefined,
);

// ============================================================================
// PROVIDER
// ============================================================================

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  const value: LoadingContextValue = {
    loading,
    setLoading,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}
