import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "destructive";
  size?: "sm" | "default";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "default",
  className = "",
  onClick,
  disabled = false,
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200";

  const sizeStyles = size === "sm" 
    ? "px-3 py-1 text-xs" 
    : "px-5 py-2.5 text-sm";

  const variants = {
    primary:
      "bg-accent text-white hover:bg-accent-hover",
    secondary:
      "bg-foreground text-background hover:opacity-90",
    outline:
      "border border-border text-foreground hover:bg-accent/10",
    destructive:
      "bg-red-500 text-white hover:bg-red-600",
  };

  const combinedClassName = `${baseStyles} ${sizeStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClassName} disabled={disabled} type={type}>
      {children}
    </button>
  );
}
