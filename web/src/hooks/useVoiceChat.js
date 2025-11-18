// web/src/hooks/useVoiceChat.js
import { useState, useEffect, useCallback, useRef } from "react";
import { TemiBridge } from "../services/temiBridge";
import { callGeminiAPI } from "../utils/geminiAPI";

/**
 * 음성 채팅 기능을 관리하는 커스텀 훅
 * @param {boolean} isActive - 음성 채팅 활성화 여부
 * @returns {object} 음성 채팅 상태 및 제어 함수들
 */
export default function useVoiceChat(isActive) {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // ✅ 테미가 말하는 중
  const [messages, setMessages] = useState([]);

  // ✅ TTS 완료 감지를 위한 ref
  const isSpeakingRef = useRef(false);

  /**
   * 음성 인식 시작 함수
   */
  const startListening = useCallback(() => {
    console.log("🎤 음성 인식 시작");

    if (isListening) {
      console.log("⚠️ 이미 음성 인식 중");
      return;
    }

    setIsListening(true);
    TemiBridge.startSpeechRecognition();
  }, [isListening]);

  /**
   * 음성 인식 콜백 등록
   */
  useEffect(() => {
    if (!isActive) return;

    console.log("🎤 음성 인식 콜백 등록");

    // 음성 인식 준비 완료
    window.onSpeechReady = () => {
      console.log("✅ 음성 인식 준비 완료");
    };

    // 음성 감지 시작
    window.onSpeechStart = () => {
      console.log("🗣️ 음성 감지 시작");
    };

    // 음성 입력 종료
    window.onSpeechEnd = () => {
      console.log("🛑 음성 입력 종료");
    };

    // 음성 인식 결과 처리
    window.onSpeechResult = async (text) => {
      console.log("✅ 인식 결과:", text);

      // 사용자 메시지 추가
      setMessages((prev) => [...prev, { role: "user", text }]);
      setIsListening(false);
      setIsThinking(true);

      // Gemini API 호출
      const response = await callGeminiAPI(text);

      // 응답 메시지 추가
      setIsThinking(false);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);

      // ✅ 테미가 응답 말하기
      setIsSpeaking(true);
      isSpeakingRef.current = true;

      TemiBridge.speak(response);

      // ✅ TTS 완료 예상 시간 계산 (대략 1글자당 100ms)
      const estimatedDuration = response.length * 100;

      setTimeout(() => {
        console.log("🎤 TTS 완료, 자동으로 다시 듣기 시작");
        setIsSpeaking(false);
        isSpeakingRef.current = false;

        // ✅ 채팅이 여전히 활성화 상태면 자동으로 다시 듣기 시작
        if (isActive) {
          startListening();
        }
      }, estimatedDuration + 500); // 여유시간 500ms 추가
    };

    // 음성 인식 오류 처리
    window.onSpeechError = (error) => {
      console.error("❌ 음성 인식 오류:", error);

      let errorMessage = "음성 인식 오류가 발생했어요";

      switch (error) {
        case "no_speech":
          errorMessage = "음성이 감지되지 않았어요. 다시 시도해주세요!";
          break;
        case "no_match":
          errorMessage = "음성을 인식하지 못했어요. 다시 시도해주세요!";
          break;
        case "no_permission":
          errorMessage = "마이크 권한이 필요해요!";
          break;
        case "network":
        case "network_timeout":
          errorMessage = "네트워크 오류가 발생했어요!";
          break;
        case "busy":
          errorMessage =
            "음성 인식이 사용 중이에요. 잠시 후 다시 시도해주세요!";
          break;
      }

      if (window.Temi) {
        TemiBridge.showToast(errorMessage);
      } else {
        alert(errorMessage);
      }

      setIsListening(false);
      setIsThinking(false);
      setIsSpeaking(false);

      // ✅ 오류 후에도 다시 듣기 시작 (no_speech 제외)
      if (error !== "no_speech" && isActive) {
        setTimeout(() => {
          startListening();
        }, 1000);
      }
    };

    // cleanup
    return () => {
      console.log("🧹 음성 인식 콜백 해제");
      window.onSpeechReady = null;
      window.onSpeechStart = null;
      window.onSpeechEnd = null;
      window.onSpeechResult = null;
      window.onSpeechError = null;
    };
  }, [isActive, startListening]);

  /**
   * 대화 내역 초기화
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setIsListening(false);
    setIsThinking(false);
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isThinking,
    isSpeaking, // ✅ 테미가 말하는 중 상태 추가
    messages,
    startListening,
    clearMessages,
  };
}
