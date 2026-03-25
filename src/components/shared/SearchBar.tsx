
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        height: 40,
        background: "var(--background-secondary)",
        border: "1px solid var(--border)",
        padding: "0 16px",
        color: "var(--foreground)",
        outline: "none",
      }}
      className="rounded-full font-body text-[13px] placeholder:text-foreground-hint"
    />
  );
}
