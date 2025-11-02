export default function AngleButton({ children, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 px-32 py-8 rounded-[28px] border-2 border-transparent 
         bg-gradient-to-b from-[#3071FF] to-[#1D4ED8] 
         text-white font-semibold text-6xl
         shadow-[0_19px_42px_rgba(37,99,235,0.38)] "
    >
      {children}
      {icon && <span className="flex items-center">{icon}</span>}
    </button>
  );
}
