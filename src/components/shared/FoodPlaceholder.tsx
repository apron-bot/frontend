
interface FoodPlaceholderProps {
  emoji: string;
  size?: number;
  bgColor: string;
  className?: string;
}

export default function FoodPlaceholder({
  emoji,
  size = 72,
  bgColor,
  className = "",
}: FoodPlaceholderProps) {
  const emojiSize = Math.round((28 / 72) * size);

  return (
    <div
      style={{
        width: size,
        height: size,
        background: bgColor,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: emojiSize,
        flexShrink: 0,
      }}
      className={className}
    >
      {emoji}
    </div>
  );
}
