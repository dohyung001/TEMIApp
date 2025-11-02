export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="py-7 px-14 text-white font-bold flex gap-4"
    >
      {" "}
      ← 홈으로{" "}
    </button>
  );
}
