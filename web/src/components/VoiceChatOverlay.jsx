// web/src/components/VoiceChatOverlay.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { TemiBridge } from "../services/temiBridge";
import { callGeminiAPI } from "../utils/geminiAPI";

export default function VoiceChatOverlay({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState("idle");
  const [messages, setMessages] = useState([]);

  const isRecognitionActiveRef = useRef(false);
  const ttsTimeoutRef = useRef(null);
  const listeningTimeoutRef = useRef(null);
  const currentStepRef = useRef("idle");
  const chatContainerRef = useRef(null);

  /**
   * 음성 인식 시작
   */
  const startListening = useCallback(() => {
    console.log("🎤 [startListening] 시도");

    if (isRecognitionActiveRef.current) {
      console.log("⚠️ [startListening] 이미 인식 세션 활성화됨, 무시");
      return;
    }

    if (currentStepRef.current !== "idle") {
      console.log(
        `⚠️ [startListening] 현재 ${currentStepRef.current} 단계, 무시`
      );
      return;
    }

    console.log("✅ [startListening] 음성 인식 시작");

    isRecognitionActiveRef.current = true;
    currentStepRef.current = "listening";
    setCurrentStep("listening");

    try {
      TemiBridge.startSpeechRecognition();
      console.log("✅ TemiBridge.startSpeechRecognition() 호출 성공");

      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
      }

      listeningTimeoutRef.current = setTimeout(() => {
        console.log("⏰ [Timeout] 10초 동안 음성 감지 안됨, 자동 종료");

        isRecognitionActiveRef.current = false;
        currentStepRef.current = "idle";
        setCurrentStep("idle");

        TemiBridge.stopSpeechRecognition();
        TemiBridge.showToast("음성이 감지되지 않아 대화가 종료되었습니다");
      }, 10000);
    } catch (error) {
      console.error("❌ [startListening] 실패:", error);

      isRecognitionActiveRef.current = false;
      currentStepRef.current = "idle";
      setCurrentStep("idle");

      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
      }

      TemiBridge.showToast(`음성 인식 시작 실패: ${error.message || error}`);
    }
  }, []);

  /**
   * 오버레이 열릴 때 초기화 + 첫 듣기 시작
   */
  useEffect(() => {
    if (isOpen) {
      console.log("🟢 [Overlay] 오픈 - 초기화 및 듣기 시작");

      setMessages([]);
      setCurrentStep("idle");

      setTimeout(() => {
        startListening();
      }, 500);
    } else {
      console.log("🔴 [Overlay] 닫힘 - 정리");

      if (ttsTimeoutRef.current) {
        clearTimeout(ttsTimeoutRef.current);
      }
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
      }

      try {
        TemiBridge.stopSpeechRecognition();
      } catch (e) {
        console.warn("stopSpeechRecognition 실패 (무시):", e);
      }

      isRecognitionActiveRef.current = false;
      currentStepRef.current = "idle";
      setCurrentStep("idle");
    }
  }, [isOpen, startListening]);

  /**
   * 음성 인식 콜백 등록
   */
  useEffect(() => {
    if (!isOpen) return;

    console.log("🎤 [Overlay] 음성 인식 콜백 등록");

    window.onSpeechReady = () => {
      console.log("✅ [onSpeechReady] 음성 인식 준비 완료");
      TemiBridge.showToast("듣고 있어요! 말씀해주세요 🎤");
    };

    window.onSpeechStart = () => {
      console.log("🗣️ [onSpeechStart] 음성 감지 시작!");

      if (listeningTimeoutRef.current) {
        console.log("✅ 타임아웃 취소 (음성 감지됨)");
        clearTimeout(listeningTimeoutRef.current);
        listeningTimeoutRef.current = null;
      }

      TemiBridge.showToast("음성이 감지되었어요!");
    };

    window.onSpeechEnd = () => {
      console.log("🛑 [onSpeechEnd] 음성 입력 종료");

      isRecognitionActiveRef.current = false;

      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
        listeningTimeoutRef.current = null;
      }
    };

    window.onSpeechResult = async (text) => {
      console.log("✅ [onSpeechResult] 인식 결과:", text);

      isRecognitionActiveRef.current = false;
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
        listeningTimeoutRef.current = null;
      }

      setMessages((prev) => [...prev, { role: "user", text }]);
      currentStepRef.current = "thinking";
      setCurrentStep("thinking");

      try {
        const response = await callGeminiAPI(text);
        console.log("💡 [AI 응답]:", response);

        setMessages((prev) => [...prev, { role: "assistant", text: response }]);
        currentStepRef.current = "speaking";
        setCurrentStep("speaking");

        TemiBridge.speak(response);

        const estimatedDuration = response.length * 100;

        if (ttsTimeoutRef.current) {
          clearTimeout(ttsTimeoutRef.current);
        }

        ttsTimeoutRef.current = setTimeout(() => {
          console.log("🔄 [TTS완료] 다시 듣기");

          currentStepRef.current = "idle";
          setCurrentStep("idle");

          setTimeout(() => {
            startListening();
          }, 500);
        }, estimatedDuration + 1000);
      } catch (error) {
        console.error("❌ [Gemini API] 오류:", error);
        TemiBridge.showToast("AI 응답 생성 실패");

        currentStepRef.current = "idle";
        setCurrentStep("idle");

        setTimeout(() => {
          startListening();
        }, 2000);
      }
    };

    window.onSpeechError = (error) => {
      console.error("❌ [onSpeechError] 오류:", error);

      isRecognitionActiveRef.current = false;
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
        listeningTimeoutRef.current = null;
      }

      currentStepRef.current = "idle";
      setCurrentStep("idle");

      let errorMessage = "음성 인식 오류가 발생했어요";

      switch (error) {
        case "no_speech":
          errorMessage = "음성이 감지되지 않았어요";
          break;
        case "no_match":
          errorMessage = "음성을 인식하지 못했어요";
          break;
        case "no_permission":
          errorMessage = "마이크 권한이 필요해요";
          break;
        case "network":
        case "network_timeout":
          errorMessage = "네트워크 오류가 발생했어요";
          break;
        case "busy":
          errorMessage = "음성 인식이 사용 중이에요";
          break;
        case "audio":
          errorMessage = "오디오 캡처 오류가 발생했어요";
          break;
        case "not_available":
          errorMessage = "음성 인식 서비스를 사용할 수 없어요";
          break;
      }

      console.log(`📢 [오류] ${errorMessage}`);
      TemiBridge.showToast(errorMessage);

      if (error !== "no_permission" && error !== "not_available") {
        console.log("🔄 2초 후 재시도");
        setTimeout(() => {
          startListening();
        }, 2000);
      } else {
        console.log("🔴 치명적 오류 - 재시도 안함");
      }
    };

    return () => {
      console.log("🧹 [Overlay] 콜백 해제");

      if (ttsTimeoutRef.current) clearTimeout(ttsTimeoutRef.current);
      if (listeningTimeoutRef.current)
        clearTimeout(listeningTimeoutRef.current);

      isRecognitionActiveRef.current = false;
      currentStepRef.current = "idle";

      window.onSpeechReady = null;
      window.onSpeechStart = null;
      window.onSpeechEnd = null;
      window.onSpeechResult = null;
      window.onSpeechError = null;
    };
  }, [isOpen, startListening]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <>
      {/* 반투명 배경 */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* 모달 컨텐츠 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div
          className="w-[1200px] h-[900px] bg-white rounded-3xl shadow-2xl flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 - text-4xl → text-5xl */}
          <div className="flex items-center justify-between px-8 py-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-3xl">
            <h1 className="text-5xl font-bold text-white">
              💬 테미랑 대화하기
            </h1>
            {/* 닫기 버튼 - text-3xl → text-4xl */}
            <button
              onClick={onClose}
              className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-4xl font-bold transition-colors"
            >
              ✕
            </button>
          </div>

          {/* 채팅 영역 */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-8 py-6 bg-gray-50"
          >
            <div className="space-y-4">
              {/* 빈 상태 메시지 - text-2xl → text-3xl */}
              {messages.length === 0 && currentStep === "idle" && (
                <div className="text-center text-slate-400 text-3xl py-20">
                  듣기를 시작합니다...
                </div>
              )}

              {/* 채팅 메시지 - text-2xl → text-3xl */}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-6 py-4 rounded-3xl shadow-md text-3xl ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : "bg-white text-slate-800 rounded-bl-sm border border-gray-200"
                    }`}
                  >
                    {msg.role === "assistant" && "🤖 "}
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 상태 표시 + 재시작 버튼 - text-xl → text-2xl */}
          <div className="px-8 py-6 border-t-2 border-gray-200 bg-white rounded-b-3xl">
            <div className="flex items-center justify-between">
              {/* 상태 표시 */}
              <div className="flex-1">
                {currentStep === "listening" && (
                  <div className="flex items-center gap-4 bg-red-50 px-6 py-3 rounded-full">
                    <div className="relative">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                    <p className="text-2xl font-semibold text-red-700">
                      듣고 있어요...
                    </p>
                  </div>
                )}

                {currentStep === "thinking" && (
                  <div className="flex items-center gap-4 bg-blue-50 px-6 py-3 rounded-full">
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
                    <p className="text-2xl font-semibold text-blue-700">
                      생각 중...
                    </p>
                  </div>
                )}

                {currentStep === "speaking" && (
                  <div className="flex items-center gap-4 bg-green-50 px-6 py-3 rounded-full">
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
                    <p className="text-2xl font-semibold text-green-700">
                      말하는 중...
                    </p>
                  </div>
                )}

                {currentStep === "idle" && (
                  <div className="flex items-center gap-4 bg-gray-100 px-6 py-3 rounded-full">
                    <p className="text-2xl text-slate-600">대기 중...</p>
                  </div>
                )}
              </div>

              {/* 재시작 버튼 - text-xl → text-2xl */}
              {currentStep === "idle" && (
                <button
                  onClick={startListening}
                  className="ml-4 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-bold text-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-3"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                  다시 말하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
