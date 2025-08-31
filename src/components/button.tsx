// components/Button.tsx
interface ButtonProps {
  text: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  text,
  onClick,
  type = "button",
  className = ""
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${className}`}
    >
      {text}
    </button>
  );
}
