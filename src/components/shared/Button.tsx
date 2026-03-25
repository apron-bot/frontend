import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  if (variant === "secondary") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={{
          background: "var(--background-secondary)",
          borderColor: "var(--border)",
          color: "var(--foreground-muted)",
        }}
        className={`border rounded-full font-body font-bold text-[12px] px-4 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "var(--accent)",
        color: "#ffffff",
      }}
      className={`rounded-full font-body font-bold text-[12px] px-6 py-3 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
