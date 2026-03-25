import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      style={{
        background: "var(--background-card)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        padding: "14px",
      }}
      className={className}
    >
      {children}
    </div>
  );
}
