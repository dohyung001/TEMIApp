// web/src/components/VoiceChatDisplay.jsx
import ChatBubble from "./ChatBubble";

/**
 * 음성 채팅 디스플레이 컴포넌트
 * - 최근 메시지 2개만 표시 (사용자 + 테미)
 * @param {array} messages - 전체 메시지 배열
 * @param {boolean} isListening - 듣는 중 상태
 * @param {boolean} isThinking - 생각 중 상태
 * @param {boolean} isSpeaking - 테미가 말하는 중 상태
 */
export default function VoiceChatDisplay({
  messages,
  isListening,
  isThinking,
  isSpeaking,
}) {
  // 마지막 2개 메시지만 표시 (사용자 메시지 + 테미 응답)
  const recentMessages = messages.slice(-2);

  // 아무 메시지도 없으면 안내 표시
  if (messages.length === 0 && !isListening && !isThinking && !isSpeaking) {
    return (
      <div className="flex items-center justify-center">
        <div className="bg-blue-500/10 backdrop-blur rounded-full px-8 py-4 border-2 border-blue-400/30">
          <p className="text-xl text-slate-700">
            💬 궁금한 것이 있으면 물어보세요!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* 최근 메시지 표시 */}
      {recentMessages.map((msg, idx) => (
        <ChatBubble key={idx} text={msg.text} role={msg.role} />
      ))}

      {/* 듣는 중 표시 */}
      {isListening && (
        <div className="flex items-center gap-4 bg-white/90 backdrop-blur px-8 py-4 rounded-full shadow-lg">
          <div className="relative">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
          </div>
          <p className="text-2xl font-semibold text-slate-800">
            듣고 있어요...
          </p>
        </div>
      )}

      {/* 생각 중 표시 */}
      {isThinking && (
        <div className="flex items-center gap-4 bg-white/90 backdrop-blur px-8 py-4 rounded-full shadow-lg">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <p className="text-2xl font-semibold text-slate-800">생각 중...</p>
        </div>
      )}

      {/* ✅ 말하는 중 표시 */}
      {isSpeaking && (
        <div className="flex items-center gap-4 bg-white/90 backdrop-blur px-8 py-4 rounded-full shadow-lg">
          <div className="flex gap-1">
            <div className="w-2 h-6 bg-green-500 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-8 bg-green-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-6 bg-green-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-8 bg-green-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.3s" }}
            ></div>
          </div>
          <p className="text-2xl font-semibold text-slate-800">말하는 중...</p>
        </div>
      )}
    </div>
  );
}
