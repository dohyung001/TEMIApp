// web/src/components/ChatBubble.jsx

/**
 * 대화 말풍선 컴포넌트
 * @param {string} text - 표시할 텍스트
 * @param {string} role - 발화자 역할 ("user" | "assistant")
 */
export default function ChatBubble({ text, role }) {
  const isUser = role === "user";

  return (
    <div
      className={`px-8 py-4 rounded-3xl shadow-lg max-w-[700px] ${
        isUser
          ? "bg-blue-500 text-white rounded-br-sm"
          : "bg-white/90 text-slate-800 rounded-bl-sm"
      }`}
    >
      <p className="text-2xl font-medium">
        {!isUser && "🤖 "}
        {text}
      </p>
    </div>
  );
}
