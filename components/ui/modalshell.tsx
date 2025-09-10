"use client";
import { X } from "lucide-react";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  maxW?: string;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function ModalShell({
  open,
  onClose,
  maxW = "max-w-2xl",
  title,
  children,
  footer,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`w-full ${maxW} rounded-2xl bg-white shadow-xl`}>
          <div className="relative border-b border-slate-100 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100"
              aria-label="close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-3 p-6 pt-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}