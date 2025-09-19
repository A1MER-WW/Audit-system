"use client";

import * as React from "react";
import { Toast } from "@/components/ui/toast";
import { setGlobalToast, type ToastOptions } from "@/hooks/useToast";

interface ToastState {
  open: boolean;
  title: string;
  description?: string;
  variant?: "default" | "warning" | "error" | "success" | "info";
  duration?: number;
}

export function ToastContainer() {
  const [toastState, setToastState] = React.useState<ToastState>({
    open: false,
    title: "",
    description: "",
    variant: "default",
    duration: 5000,
  });

  const showToast = React.useCallback((options: ToastOptions) => {
    setToastState({
      ...options,
      open: true,
    });
  }, []);

  const setToastOpen = React.useCallback((open: boolean) => {
    setToastState(prev => ({ ...prev, open }));
  }, []);

  // Register global toast function
  React.useEffect(() => {
    setGlobalToast(showToast);
    return () => setGlobalToast(() => {});
  }, [showToast]);

  return (
    <Toast
      open={toastState.open}
      onOpenChange={setToastOpen}
      title={toastState.title}
      description={toastState.description}
      variant={toastState.variant}
      duration={toastState.duration}
    />
  );
}