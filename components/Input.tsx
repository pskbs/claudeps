import type { InputHTMLAttributes } from "react";

export default function Input({
  label,
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="block text-sm text-coral-500 font-soft">
      {label && <span className="mb-1 block">{label}</span>}
      <input
        className={`w-full rounded-2xl border border-peach-200 bg-cream-50 px-4 py-3 text-base text-stone-700 outline-none transition focus:border-coral-300 focus:ring-2 focus:ring-coral-100 ${className}`}
        {...rest}
      />
    </label>
  );
}
