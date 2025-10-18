export default function LangBUtton({ onClick, children, icon }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-3 bg-white flex items-center text-3xl gap-4 shadow-lg rounded-2xl text-slate-800 w-auto"
    >
      <div>{icon}</div>
      {children}
    </button>
  );
}
