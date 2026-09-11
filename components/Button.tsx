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

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
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
