"use client";
import React from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string };

export default function LabeledTextArea({ label, className = "", ...props }: Props) {
  return (
    <label className="space-y-2 block">
      <span className="text-sm text-slate-600">{label}</span>
      <textarea
        {...props}
        className={
          "w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none ring-indigo-200 focus:ring " +
          className
        }
      />
    </label>
  );
}