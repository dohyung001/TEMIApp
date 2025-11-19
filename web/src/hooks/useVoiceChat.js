    // web/src/hooks/useVoiceChat.js
    import { useState, useEffect, useCallback, useRef } from "react";
    import { TemiBridge } from "../services/temiBridge";
    import { callGeminiAPI } from "../utils/geminiAPI";

    /**
     * 음성 채팅 기능을 관리하는 커스텀 훅
     * 듣기 → 생각 → 말하기 → 듣기 순환
     */
    export default function useVoiceChat(isActive) {
    // 현재 단계: 'listening' | 'thinking' | 'speaking' | 'idle'
    const [currentStep, setCurrentStep] = useState("idle");

    // 현재 대화 쌍 (사용자 메시지 + 테미 응답)
    const [currentUserMessage, setCurrentUserMessage] = useState("");
    const [currentAssistantMessage, setCurrentAssistantMessage] = useState("");

    // ref로 상태 추적 (즉각 반영)
    const isRecognitionActiveRef = useRef(false);
    const ttsTimeoutRef = useRef(null);
    const listeningTimeoutRef = useRef(null); // ✅ 듣기 타임아웃 추가
    const currentStepRef = useRef("idle");
    const onAutoStopCallback = useRef(null); // ✅ 자동 종료 콜백

    /**
     * 음성 인식 시작 함수 (안전한 버전)
     */
    const startListening = useCallback(() => {
        console.log("🎤 [startListening] 시도");

        // ✅ 이미 활성화되어 있으면 무시
        if (isRecognitionActiveRef.current) {
        console.log("⚠️ [startListening] 이미 인식 세션 활성화됨, 무시");
        return;
        }

        // ✅ 다른 단계 진행 중이면 무시
        if (currentStepRef.current !== "idle") {
        console.log(
            `⚠️ [startListening] 현재 ${currentStepRef.current} 단계, 무시`
        );
        return;
        }

        console.log("✅ [startListening] 음성 인식 시작");

        // ✅ 이전 메시지 클리어 (새로운 순환 시작)
        setCurrentUserMessage("");
        setCurrentAssistantMessage("");

        isRecognitionActiveRef.current = true;
        currentStepRef.current = "listening";
        setCurrentStep("listening");

        try {
        TemiBridge.startSpeechRecognition();

        // ✅ 8초 타임아웃 설정
        if (listeningTimeoutRef.current) {
            clearTimeout(listeningTimeoutRef.current);
        }

        listeningTimeoutRef.current = setTimeout(() => {
            console.log("⏰ [Timeout] 8초 동안 음성 감지 안됨, 자동 종료");

            isRecognitionActiveRef.current = false;
            currentStepRef.current = "idle";
            setCurrentStep("idle");
            setCurrentUserMessage("");
            setCurrentAssistantMessage("");

            // ✅ 음성 인식 중지
            TemiBridge.stopSpeechRecognition();

            // ✅ 자동 종료 콜백 호출 (PageLayout에서 isChatActive를 false로)
            if (onAutoStopCallback.current) {
            onAutoStopCallback.current();
            }

            TemiBridge.showToast("음성이 감지되지 않아 대화가 종료되었습니다");
        }, 8000);
        } catch (error) {
        console.error("❌ [startListening] 실패:", error);
        isRecognitionActiveRef.current = false;
        currentStepRef.current = "idle";
        setCurrentStep("idle");

        // 타임아웃 정리
        if (listeningTimeoutRef.current) {
            clearTimeout(listeningTimeoutRef.current);
        }
        }
    }, []);

    /**
     * 음성 인식 콜백 등록
     */
    useEffect(() => {
        if (!isActive) {
        // 비활성화 시 모든 상태 초기화
        if (ttsTimeoutRef.current) {
            clearTimeout(ttsTimeoutRef.current);
        }
        if (listeningTimeoutRef.current) {
            clearTimeout(listeningTimeoutRef.current);
        }
        isRecognitionActiveRef.current = false;
        currentStepRef.current = "idle";
        setCurrentStep("idle");
        setCurrentUserMessage("");
        setCurrentAssistantMessage("");
        return;
        }

        console.log("🎤 [useEffect] 음성 인식 콜백 등록");

        // ===== 음성 인식 준비 완료 =====
        window.onSpeechReady = () => {
        console.log("✅ [onSpeechReady] 음성 인식 준비 완료");
        };

        // ===== 음성 감지 시작 =====
        window.onSpeechStart = () => {
        console.log("🗣️ [onSpeechStart] 음성 감지 시작");

        // ✅ 음성 감지되면 타임아웃 취소
        if (listeningTimeoutRef.current) {
            console.log("✅ [onSpeechStart] 타임아웃 취소");
            clearTimeout(listeningTimeoutRef.current);
            listeningTimeoutRef.current = null;
        }
        };

        // ===== 음성 입력 종료 =====
        window.onSpeechEnd = () => {
        console.log("🛑 [onSpeechEnd] 음성 입력 종료");

        // ✅ 세션 종료 표시 (즉시)
        isRecognitionActiveRef.current = false;

        // ✅ 타임아웃 정리
        if (listeningTimeoutRef.current) {
            clearTimeout(listeningTimeoutRef.current);
            listeningTimeoutRef.current = null;
        }
        };

        // ===== 음성 인식 결과 처리 =====
        window.onSpeechResult = async (text) => {
        console.log("✅ [onSpeechResult] 인식 결과:", text);

        // ✅ 즉시 세션 종료 + 타임아웃 정리
        isRecognitionActiveRef.current = false;
        if (listeningTimeoutRef.current) {
            clearTimeout(listeningTimeoutRef.current);
            listeningTimeoutRef.current = null;
        }

        // 1️⃣ 사용자 메시지 표시 + 생각 단계로 전환
        setCurrentUserMessage(text);
        currentStepRef.current = "thinking";
        setCurrentStep("thinking");

        // 2️⃣ Gemini API 호출
        const response = await callGeminiAPI(text);
        console.log("💡 [onSpeechResult] AI 응답:", response);

        // 3️⃣ 테미 응답 표시 + 말하기 단계로 전환
        setCurrentAssistantMessage(response);
        currentStepRef.current = "speaking";
        setCurrentStep("speaking");

        // 4️⃣ TTS 실행
        TemiBridge.speak(response);

        // 5️⃣ TTS 완료 대기 후 다시 듣기
        const estimatedDuration = response.length * 100;

        if (ttsTimeoutRef.current) {
            clearTimeout(ttsTimeoutRef.current);
        }

        ttsTimeoutRef.current = setTimeout(() => {
            console.log("🔄 [TTS완료] 다시 듣기 시작");

            currentStepRef.current = "idle";
            setCurrentStep("idle");

            // ✅ 여전히 활성화 상태면 다음 순환 시작
            if (isActive) {
            setTimeout(() => {
                startListening();
            }, 500); // ✅ 안전을 위한 500ms 딜레이
            }
        }, estimatedDuration + 1000); // ✅ 여유시간 1초
        };

        // ===== 음성 인식 오류 처리 =====
        window.onSpeechError = (error) => {
        console.error("❌ [onSpeechError] 오류:", error);

        // ✅ 즉시 세션 종료 + 타임아웃 정리
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
        }

        console.log(`📢 [onSpeechError] ${errorMessage}`);

        if (window.Temi) {
            TemiBridge.showToast(errorMessage);
        } else {
            console.log(`[개발모드] ${errorMessage}`);
        }

        // ✅ no_speech, busy 오류면 자동 종료
        if (error === "no_speech" || error === "busy") {
            console.log("🔴 [onSpeechError] 자동 종료");
            if (onAutoStopCallback.current) {
            onAutoStopCallback.current();
            }
            return;
        }

        // ✅ 다른 오류는 재시도
        if (isActive) {
            console.log("🔄 [onSpeechError] 2초 후 재시도");
            setTimeout(() => {
            startListening();
            }, 2000);
        }
        };

        // cleanup
        return () => {
        console.log("🧹 [cleanup] 음성 인식 콜백 해제");

        if (ttsTimeoutRef.current) {
            clearTimeout(ttsTimeoutRef.current);
        }

        if (listeningTimeoutRef.current) {
            clearTimeout(listeningTimeoutRef.current);
        }

        isRecognitionActiveRef.current = false;
        currentStepRef.current = "idle";

        window.onSpeechReady = null;
        window.onSpeechStart = null;
        window.onSpeechEnd = null;
        window.onSpeechResult = null;
        window.onSpeechError = null;
        };
    }, [isActive, startListening]);

    /**
     * 상태 초기화
     */
    const reset = useCallback(() => {
        if (ttsTimeoutRef.current) {
        clearTimeout(ttsTimeoutRef.current);
        }

        if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
        }

        isRecognitionActiveRef.current = false;
        currentStepRef.current = "idle";
        setCurrentStep("idle");
        setCurrentUserMessage("");
        setCurrentAssistantMessage("");
    }, []);

    /**
     * 자동 종료 콜백 등록
     */
    const setOnAutoStop = useCallback((callback) => {
        onAutoStopCallback.current = callback;
    }, []);

    return {
        currentStep,
        currentUserMessage,
        currentAssistantMessage,
        startListening,
        reset,
        setOnAutoStop, // ✅ 추가
    };
    }
