"use client";

import * as React from "react";

interface ToastState {
  open: boolean;
  title: string;
  description?: string;
  variant?: "default" | "warning" | "error" | "success" | "info";
  duration?: number;
}

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "warning" | "error" | "success" | "info";
  duration?: number;
}

interface ToastContextType {
  toast: (options: ToastOptions) => void;
  toastState: ToastState;
  setToastOpen: (open: boolean) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// สำหรับใช้แบบ standalone โดยไม่ต้องมี Provider
let globalToastCallback: ((options: ToastOptions) => void) | null = null;

export function setGlobalToast(callback: (options: ToastOptions) => void) {
  globalToastCallback = callback;
}

export function showToast(options: ToastOptions) {
  if (globalToastCallback) {
    globalToastCallback(options);
  } else {
    // Fallback to alert if no toast provider
    alert(options.title + (options.description ? '\n\n' + options.description : ''));
  }
}