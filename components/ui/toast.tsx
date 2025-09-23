"use client";

import * as React from "react";
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: "default" | "warning" | "error" | "success" | "info";
  duration?: number;
}

const variantStyles = {
  default: "bg-white border-gray-200 text-gray-900",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
  error: "bg-red-50 border-red-200 text-red-900",
  success: "bg-green-50 border-green-200 text-green-900",
  info: "bg-blue-50 border-blue-200 text-blue-900",
};

const iconMap = {
  default: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
  info: Info,
};

const iconStyles = {
  default: "text-gray-500",
  warning: "text-yellow-500",
  error: "text-red-500",
  success: "text-green-500",
  info: "text-blue-500",
};

export function Toast({
  open,
  onOpenChange,
  title,
  description,
  variant = "default",
  duration = 5000,
}: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const Icon = iconMap[variant];

  const handleClose = React.useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onOpenChange(false), 300); // Wait for animation
  }, [onOpenChange]);

  React.useEffect(() => {
    if (open) {
      setIsVisible(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [open, duration, handleClose]);

  if (!open && !isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 z-50 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />
      
      {/* Toast */}
      <div
        className={cn(
          "fixed top-4 right-4 z-50 w-full max-w-md transform transition-all duration-300 ease-out",
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <div
          className={cn(
            "rounded-lg border p-4 shadow-lg backdrop-blur-sm",
            variantStyles[variant]
          )}
        >
          <div className="flex items-start gap-3">
            <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", iconStyles[variant])} />
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold">{title}</h3>
              {description && (
                <p className="mt-1 text-sm opacity-90">{description}</p>
              )}
            </div>

            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 hover:bg-black/5 rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}