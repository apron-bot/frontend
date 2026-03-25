
interface ProgressBarProps {
  percent: number;
  color?: string;
}

export default function ProgressBar({
  percent,
  color = "var(--accent)",
}: ProgressBarProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full h-2 bg-background-tertiary rounded-full overflow-hidden">
      <div
        style={{
          width: `${clampedPercent}%`,
          background: color,
          height: "100%",
          borderRadius: 9999,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}
