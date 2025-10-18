export default function SpeechBubble({
  children,
  icon,
  bgColor = "bg-slate-800",
  textColor = "text-white",
  className = "",
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* 말풍선 본체 */}
      <div
        className={`${bgColor} ${textColor} pl-10 pr-12 py-6 rounded-2xl shadow-xl flex items-center gap-3 w-auto`}
      >
        {icon && <div>{icon}</div>}
        <span className="text-3xl font-medium whitespace-nowrap">
          {children}
        </span>
      </div>

      {/* 꼬리 */}
      <div className="absolute left-6 -bottom-4">
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[20px] border-t-slate-800" />
      </div>
    </div>
  );
}
