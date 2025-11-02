import { useState, useEffect } from "react";
import { TemiBridge } from "../../services/temiBridge";
import MickIcon from "../../assets/icons/mick.svg?react";

export default function VoiceChatPage() {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false); // ⭐ 추가
  const [messages, setMessages] = useState([]);
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
      alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = "ko-KR";
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;

    recognitionInstance.onresult = async (event) => {
      const userText = event.results[0][0].transcript;
      console.log("사용자:", userText);

      setMessages((prev) => [...prev, { role: "user", text: userText }]);
      setIsListening(false);
      setIsThinking(true); // ⭐ 생각 중 시작

      // Gemini API 호출
      const response = await callGemini(userText);

      setIsThinking(false); // ⭐ 생각 중 끝
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);

      // 테미가 말하기
      TemiBridge.speak(response);
    };

    recognitionInstance.onerror = (event) => {
      console.error("음성 인식 오류:", event.error);
      setIsListening(false);
      setIsThinking(false); // ⭐ 에러 시에도 끝내기
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);
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
      setIsListening(true);
      recognition.start();
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-semibold mb-4"> 테미랑 대화하기</h1>
      </div>

      {/* 대화 내용 + 상태 텍스트 통합 */}
      <div className="w-[80%] mx-auto rounded-3xl shadow-[0_12px_60px_rgba(0,0,0,0.12)]">
        {/* 대화 영역 - 위쪽만 둥글게 */}
        <div className="backdrop-blur-md rounded-t-3xl p-8 min-h-[400px] max-h-[500px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-center text-xl">
              아직 대화가 없어요. 버튼을 눌러 시작하세요!
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-6 py-4 rounded-2xl text-lg shadow-[0_4px_20px_rgba(0,0,0,0.22)] ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* ⭐ 로딩 메시지 */}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-6 py-4 rounded-2xl text-lg shadow-[0_4px_20px_rgba(0,0,0,0.22)] bg-gray-100 text-gray-800">
                    <span className="animate-pulse">생각 중...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 상태 텍스트 - 아래쪽 각지게 */}
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
          disabled={isListening || isThinking} // ⭐ 생각 중에도 비활성화
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
