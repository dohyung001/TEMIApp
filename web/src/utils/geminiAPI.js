// web/src/utils/geminiAPI.js

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

/**
 * Gemini API를 호출하여 응답을 받는 함수
 * @param {string} userMessage - 사용자 메시지
 * @returns {Promise<string>} AI 응답 텍스트
 */
export async function callGeminiAPI(userMessage) {
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

    // API 오류 처리
    if (data.error) {
      console.error("Gemini API 오류:", data.error);
      return "앗, 다시 말씀해주세요! 😅";
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API 오류:", error);
    return "죄송해요, 오류가 발생했어요!";
  }
}
