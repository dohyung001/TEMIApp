import { useState, useEffect } from "react";
import { TemiBridge } from "../../services/temiBridge";
import MickIcon from "../../assets/icons/mick.svg?react";

export default function VoiceChatPage() {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "안녕하세요! TEMI입니다. 궁금하신 점을 말씀해주세요.",
    },
  ]);
  const [recognition, setRecognition] = useState(null);

  const TEMI_SYSTEM_PROMPT = `당신은 테미(Temi)라는 친근한 안내 로봇입니다.

  # 행사 정보:
  - 행사명: 2025 CO-SHOW (코쇼)
  - 일시: 2025년 11월 26일(수) ~ 11월 29일(토) 4일간
  - 장소: 부산 BEXCO 제1전시장 2홀, 3A홀
  - 주최: 교육부, 한국연구재단
  - 주관: 첨단분야 혁신융합대학 사업단 협의회
  - 후원: 부산광역시
  - 참여대상: 초·중·고등학생 및 대학생, 전국민 누구나
  - 입장료: 무료
  
  # 행사 내용:
  - 18개 첨단 분야가 한자리에 모이는 종합 전시회
  - 첨단분야 혁신융합대학의 다양한 경진대회
  - 첨단교육과정 기반 체험교육 프로그램
  - COSS 앱으로 프로그램 확인 가능
  
  # BEXCO 안내:
  - 정식명칭: 부산전시컨벤션센터
  - 위치: 부산 해운대구 APEC로 55
  - 규모: 대한민국 대표 전시컨벤션센터
  - 주요 시설: 제1전시장, 제2전시장, 컨벤션홀
  
  # 편의시설 (일반적인 BEXCO 정보):
  - 화장실: 각 전시장 층마다 위치
  - 식당/카페: 각 층 및 지하 푸드코트
  - 주차장: 지하 및 지상 주차장 운영
  - 대중교통: 센텀시티역 도보 5분
  
  # 테미의 말투:
  - "~해요", "~이에요" 친근한 존댓말
  - 2-3문장으로 간결하게 답변
  - 이모지 사용 가능 (😊, 💡, 🎓, 🎉 등)
  - 모르는 건 솔직히 "잘 모르겠어요"라고 답변`;

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("❌ SpeechRecognition API 없음");
      if (window.Temi) {
        TemiBridge.showToast("음성 인식을 지원하지 않는 환경입니다");
      } else {
        alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
      }
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = "ko-KR";
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;

    recognitionInstance.onstart = () => {
      console.log("🎤 음성 인식 시작됨");
    };

    recognitionInstance.onsoundstart = () => {
      console.log("🔊 소리 감지됨");
    };

    recognitionInstance.onspeechstart = () => {
      console.log("🗣️ 음성 감지됨");
    };

    recognitionInstance.onresult = async (event) => {
      const userText = event.results[0][0].transcript;
      console.log("✅ 인식 완료:", userText);

      setMessages((prev) => [...prev, { role: "user", text: userText }]);
      setIsListening(false);
      setIsThinking(true);

      const response = await callGemini(userText);

      setIsThinking(false);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);

      TemiBridge.speak(response);
    };

    recognitionInstance.onerror = (event) => {
      console.error("❌ 음성 인식 오류:", event.error);

      // ✅✅✅ Temi 환경에서 특정 에러는 무시
      if (window.Temi) {
        if (event.error === "audio-capture" || event.error === "not-allowed") {
          console.warn("⚠️ Temi 환경: 권한 관련 에러 무시하고 계속 진행");
          setIsListening(false);
          return; // 에러 메시지 표시 안함
        }

        // no-speech 에러만 사용자에게 알림
        if (event.error === "no-speech") {
          TemiBridge.showToast("음성이 감지되지 않았어요. 다시 시도해주세요!");
          setIsListening(false);
          setIsThinking(false);
          return;
        }
      }

      // 브라우저 환경에서는 모든 에러 표시
      let errorMessage = "음성 인식 오류가 발생했어요";

      switch (event.error) {
        case "no-speech":
          errorMessage = "음성이 감지되지 않았어요. 다시 시도해주세요!";
          break;
        case "audio-capture":
          errorMessage = "마이크에 접근할 수 없어요. 권한을 확인해주세요!";
          break;
        case "not-allowed":
          errorMessage = "마이크 권한이 거부되었어요!";
          break;
        case "network":
          errorMessage = "네트워크 오류가 발생했어요!";
          break;
      }

      if (window.Temi) {
        TemiBridge.showToast(errorMessage);
      } else {
        alert(errorMessage);
      }

      setIsListening(false);
      setIsThinking(false);
    };

    recognitionInstance.onend = () => {
      console.log("🛑 음성 인식 종료됨");
      setIsListening(false);
    };

    // ✅✅✅ Temi 환경에서는 권한 체크 완전히 스킵
    if (window.Temi) {
      console.log("🤖 Temi 환경: recognition 객체 바로 생성 (권한 체크 스킵)");
      setRecognition(recognitionInstance);
    } else {
      // 브라우저 환경에서만 권한 체크
      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(() => {
            console.log("✅ 브라우저: 마이크 권한 있음");
            setRecognition(recognitionInstance);
          })
          .catch((err) => {
            console.error("❌ 브라우저: 마이크 권한 없음:", err);
            alert(
              "마이크 권한이 필요합니다!\n브라우저 설정에서 권한을 허용해주세요."
            );
          });
      } else {
        console.warn("⚠️ MediaDevices API 없음");
        alert("마이크 권한 확인이 불가능한 환경입니다.");
      }
    }
  }, []);

  const callGemini = async (userMessage) => {
    try {
      const API_KEY = "AIzaSyCiGTJ3lA_R6K9N-eFmY_vASkg8mFR-7FE";

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": API_KEY,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: TEMI_SYSTEM_PROMPT }],
            },
            contents: [
              {
                parts: [{ text: userMessage }],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        console.error("Gemini API 오류:", data.error);
        return "앗, 다시 말씀해주세요! 😅";
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API 오류:", error);
      return "죄송해요, 오류가 발생했어요!";
    }
  };

  const startListening = () => {
    if (recognition) {
      console.log("🎤 음성 인식 시작 시도...");
      setIsListening(true);
      try {
        recognition.start();
      } catch (error) {
        console.error("❌ 시작 실패:", error);
        setIsListening(false);

        // ✅ Temi 환경에서 "already started" 에러는 무시
        if (window.Temi && error.message.includes("already started")) {
          console.warn("⚠️ Temi 환경: 이미 시작됨 에러 무시");
          return;
        }

        if (window.Temi) {
          TemiBridge.showToast("음성 인식을 시작할 수 없어요");
        } else {
          alert("음성 인식을 시작할 수 없어요: " + error.message);
        }
      }
    } else {
      console.error("❌ recognition 객체가 없음");

      if (window.Temi) {
        TemiBridge.showToast("음성 인식이 초기화되지 않았어요");
      } else {
        alert("음성 인식이 초기화되지 않았어요!");
      }
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-semibold mb-4">테미랑 대화하기</h1>
      </div>

      {/* 대화 내용 + 상태 텍스트 통합 */}
      <div className="w-[80%] mx-auto rounded-3xl shadow-[0_12px_60px_rgba(0,0,0,0.12)]">
        {/* 대화 영역 */}
        <div className="backdrop-blur-md rounded-t-3xl p-8 h-[700px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-6 py-4 rounded-2xl text-2xl shadow-[0_4px_20px_rgba(0,0,0,0.22)] ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-6 py-4 rounded-2xl text-2xl shadow-[0_4px_20px_rgba(0,0,0,0.22)] bg-gray-100 text-gray-800">
                  <span className="animate-pulse">생각 중...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 상태 텍스트 */}
        <div className="rounded-b-3xl border-gray-200 px-8 py-4">
          <p className="text-xl text-slate-600 text-center">
            {isListening
              ? "듣고 있어요!"
              : isThinking
              ? "생각 중이에요..."
              : "아래 마이크 버튼을 누르고 말씀해주세요"}
          </p>
        </div>
      </div>

      {/* 마이크 버튼 */}
      <div className="flex justify-center mt-4">
        <button
          onClick={startListening}
          disabled={isListening || isThinking}
          className={`rounded-full p-10 shadow-2xl transition-all duration-100
            ${
              isListening
                ? "bg-gradient-to-b from-[#2563EB] to-[#0037AF]"
                : isThinking
                ? "bg-gradient-to-b from-gray-400 to-gray-600 cursor-not-allowed"
                : "bg-gradient-to-b from-[#3071FF] to-[#1D4ED8] hover:scale-105"
            }`}
        >
          <MickIcon
            className={`w-14 h-14 ${
              isListening ? "animate-bounce" : isThinking ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
