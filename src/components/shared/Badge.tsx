import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color: string;
  bg: string;
  className?: string;
}

export default function Badge({ children, color, bg, className = "" }: BadgeProps) {
  return (
    <span
      style={{
        color,
        background: bg,
      }}
      className={`font-body font-bold text-[10px] px-2 py-[3px] rounded-full inline-flex items-center ${className}`}
    >
      {children}
    </span>
  );
}
