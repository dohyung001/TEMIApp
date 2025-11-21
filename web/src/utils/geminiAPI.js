// web/src/utils/geminiAPI.js
import axios from "axios";

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

# 테미가 제공하는 기능 (화면의 버튼들):
1. 체험 부스 및 길안내
   - 전시장 내 다양한 체험 부스 위치 안내
   - 원하는 장소까지 테미가 직접 안내해드려요
   
2. 지도 및 경진대회
   - CO-SHOW 전시장 지도 확인
   - 경진대회 일정 및 정보 제공
   
3. 노래맞춰 춤 추기
   - 테미가 신나는 음악에 맞춰 춤을 춰요
   - 여러 노래 중에서 골라서 감상할 수 있어요
   
4. 부스 추천 받기
   - 관심사에 맞는 체험 부스를 추천해드려요
   - AI가 맞춤형 추천을 제공해요
   
5. 사진 촬영 및 전송
   - 테미와 함께 기념사진 촬영
   - 3가지 테마(COSS, 클로버, 로봇) 중 선택 가능
   - QR 코드로 사진을 바로 받아갈 수 있어요
   
6. 외견 보기
   - CO-SHOW 관련 문서 및 자료 열람

# 사용자가 기능에 대해 물어보면:
- "화면에 있는 버튼들을 눌러서 사용하실 수 있어요"
- "원하시는 기능을 선택해주세요"
- 구체적인 버튼 이름을 안내해주세요

# 테미의 말투:
- "~해요", "~이에요" 친근한 존댓말
- 2-3문장으로 간결하게 답변(가능하면 짧게)
- 이모지 사용 불가능
- 안내용 로봇이 실제로 말하는 것 처럼 대답할 것
- 모르는 건 솔직히 "잘 모르겠어요"라고 답변
- 기능 사용을 권유할 때는 "화면의 ○○○ 버튼을 눌러주세요" 형식으로 안내`;

// Axios 인스턴스 생성
const geminiAPI = axios.create({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Gemini API를 호출하여 응답을 받는 함수
 * @param {string} userMessage - 사용자 메시지
 * @returns {Promise<string>} AI 응답 텍스트
 */
export async function callGeminiAPI(userMessage) {
  try {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
      console.error("❌ Gemini API 키가 설정되지 않았습니다");
      return "죄송해요, 설정 오류가 발생했어요!";
    }

    const response = await geminiAPI.post(
      "/models/gemini-2.0-flash-exp:generateContent",
      {
        systemInstruction: {
          parts: [{ text: TEMI_SYSTEM_PROMPT }],
        },
        contents: [
          {
            parts: [{ text: userMessage }],
          },
        ],
      },
      {
        params: {
          key: API_KEY,
        },
      }
    );

    // 응답 검증
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    }

    console.error("❌ Gemini API 응답 형식 오류:", response.data);
    return "죄송해요, 응답을 처리할 수 없어요!";
  } catch (error) {
    // Axios 에러 처리
    if (error.response) {
      // 서버 응답 오류 (4xx, 5xx)
      console.error("❌ Gemini API 오류:", {
        status: error.response.status,
        data: error.response.data,
      });

      if (error.response.status === 403) {
        return "죄송해요, API 키 문제가 있어요!";
      } else if (error.response.status === 429) {
        return "죄송해요, 요청이 너무 많아요. 잠시 후 다시 시도해주세요!";
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답 없음
      console.error("❌ 네트워크 오류:", error.request);
      return "죄송해요, 네트워크 오류가 발생했어요!";
    } else {
      // 요청 설정 중 오류
      console.error("❌ 요청 설정 오류:", error.message);
    }

    return "죄송해요, 오류가 발생했어요!";
  }
}
