export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white font-bold text-xl hover:bg-white/30 hover:scale-105 transition-all flex items-center gap-2"
    >
      ← 홈으로
    </button>
  );
}
