export default function RoundButton({
  onClick,
  icon,
  color = "blue",
  disabled = false,
  children,
}) {
  // 색상별 배경 + 그림자 스타일 매핑
  const styleMap = {
    blue: {
      background: "linear-gradient(180deg, #2563EB 0%, #1D4ED8 100%)",
      boxShadow: "0 12px 48px rgba(37, 99, 235, 0.4)",
    },
    black: {
      background: "linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.76) 100%)",
      boxShadow: "0 12px 48px rgba(112,112,112,0.4)",
    },
    gray: {
      background: "#707070",
      boxShadow: "0 12px 48px rgba(112,112,112,0.4)",
    },
  };

  const selected = styleMap[color] || styleMap.blue;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        background: selected.background,
        boxShadow: selected.boxShadow,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      className="
        flex items-center justify-center gap-2
        text-white font-semibold rounded-full
        px-6 py-4 text-4xl
        transition-all duration-200
      "
    >
      {icon && (
        <span className="w-15 h-15 flex items-center justify-center">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}
