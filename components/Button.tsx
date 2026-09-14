import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const base =
  "inline-flex items-center justify-center rounded-full px-6 py-3 font-soft font-medium transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-coral-400 text-white shadow-soft hover:bg-coral-500",
  secondary: "bg-peach-100 text-coral-500 hover:bg-peach-200",
  ghost: "bg-transparent text-coral-500 hover:bg-peach-100",
};

type Variant = keyof typeof variants;

export function ButtonSpinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-4 w-4 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  loading?: boolean;
}) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && <ButtonSpinner className="mr-2" />}
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
