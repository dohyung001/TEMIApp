// web/src/components/VoiceChatDisplay.jsx

/**
 * 음성 채팅 디스플레이 컴포넌트
 * - 현재 대화 쌍만 표시 (사용자 + 테미)
 * - 듣기/생각/말하기 상태 표시
 */
export default function VoiceChatDisplay({
  currentStep,
  currentUserMessage,
  currentAssistantMessage,
}) {
  // 아무것도 없을 때 (idle)
  if (currentStep === "idle") {
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
      {/* 사용자 메시지 (생각 중, 말하는 중에 표시) */}
      {currentUserMessage && (
        <div className="bg-blue-500 text-white px-8 py-4 rounded-3xl rounded-br-sm shadow-lg max-w-[700px]">
          <p className="text-2xl font-medium">{currentUserMessage}</p>
        </div>
      )}

      {/* 테미 응답 (말하는 중에 표시) */}
      {currentAssistantMessage && (
        <div className="bg-white/90 text-slate-800 px-8 py-4 rounded-3xl rounded-bl-sm shadow-lg max-w-[700px]">
          <p className="text-2xl font-medium">🤖 {currentAssistantMessage}</p>
        </div>
      )}

      {/* 듣는 중 */}
      {currentStep === "listening" && (
        <div className="flex items-center gap-4 bg-white/90 backdrop-blur px-8 py-4 rounded-full shadow-lg animate-pulse">
          <div className="relative">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
          </div>
          <p className="text-2xl font-semibold text-slate-800">
            듣고 있어요...
          </p>
        </div>
      )}

      {/* 생각 중 */}
      {currentStep === "thinking" && (
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

      {/* 말하는 중 */}
      {currentStep === "speaking" && (
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
