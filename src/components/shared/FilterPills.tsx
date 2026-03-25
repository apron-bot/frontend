
interface FilterPillsProps {
  options: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function FilterPills({
  options,
  activeIndex,
  onSelect,
}: FilterPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar">
      {options.map((option, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={option}
            onClick={() => onSelect(index)}
            style={{
              background: isActive ? "var(--accent)" : "transparent",
              borderColor: isActive ? "var(--accent)" : "var(--border)",
              color: isActive ? "#ffffff" : "var(--foreground-muted)",
            }}
            className="font-body font-bold text-[11px] px-3 py-[5px] rounded-full border whitespace-nowrap cursor-pointer flex-shrink-0"
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
