// web/src/utils/geminiAPI.js
import allBooths, { findBoothByName } from "../constants/allBooths";
import {
  generateBoothSummary,
  generateBoothDetail,
  findBoothInMessage,
} from "./boothSummary";
import axios from "axios";
// ========== 기본 시스템 프롬프트 (벡스코 + 테미 정보) ==========
const BASE_SYSTEM_PROMPT = `당신은 테미(Temi)라는 친근한 안내 로봇입니다.

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

# 편의시설:
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
- "홈화면에 있는 버튼들을 눌러서 사용하실 수 있어요"
- "원하시는 기능을 선택해주세요"
- 구체적인 버튼 이름을 안내해주세요

# 테미의 말투:
- "~해요", "~이에요" 친근한 존댓말
- 2문장이하로 간결하게 답변 (가능하면 짧게)
- 이모지 사용 불가능
- 안내용 로봇이 실제로 말하는 것처럼 대답할 것(불필요한 이모티콘이나 특수문자 절대 제외)
- 모르는 건 솔직히 "잘 모르겠어요"라고 답변
- 기능 사용을 권유할 때는 "홈 화면의 ○○○ 버튼을 눌러주세요" 형식으로 안내`;

// ========== 부스 요약 정보 (한 번만 생성) ==========
const BOOTH_SUMMARY = generateBoothSummary(allBooths);

/**
 * 사용자 메시지 분석하여 동적 프롬프트 생성
 * @param {string} userMessage - 사용자 메시지
 * @returns {string} - 최적화된 시스템 프롬프트
 */
function buildDynamicPrompt(userMessage) {
  // 특정 부스에 대한 질문인지 확인
  const mentionedBooth = findBoothInMessage(userMessage, allBooths);

  if (mentionedBooth) {
    // 특정 부스 질문 → 해당 부스 상세 정보 추가
    const boothDetail = generateBoothDetail(mentionedBooth);
    return `${BASE_SYSTEM_PROMPT}\n\n${boothDetail}`;
  }

  // 카테고리 키워드 확인
  const categoryKeywords = {
    AI: "인공지능",
    인공지능: "인공지능",
    빅데이터: "빅데이터",
    데이터: "빅데이터",
    사물인터넷: "사물인터넷",
    IoT: "사물인터넷",
    실감미디어: "실감미디어",
    VR: "실감미디어",
    메타버스: "실감미디어",
    로봇: "지능형로봇",
    드론: "항공드론",
    자동차: "미래자동차",
    에너지: "에너지신사업",
    친환경: "에너지신사업",
    수소: "에너지신사업",
    배터리: "이차전지",
    바이오: "바이오헬스",
    헬스: "바이오헬스",
    반도체: "차세대반도체",
  };

  // 메시지에서 카테고리 키워드 찾기
  let detectedCategory = null;
  for (const [keyword, category] of Object.entries(categoryKeywords)) {
    if (userMessage.includes(keyword)) {
      detectedCategory = category;
      break;
    }
  }

  // 카테고리별 질문이면 해당 카테고리 부스만 추가
  if (detectedCategory) {
    const categoryBooths = allBooths.filter(
      (booth) => booth.subCategory === detectedCategory
    );

    if (categoryBooths.length > 0) {
      let categoryInfo = `\n\n# ${detectedCategory} 부스 목록:\n`;
      categoryBooths.forEach((booth) => {
        categoryInfo += `- ${booth.name}: ${booth.description}\n`;
      });
      return `${BASE_SYSTEM_PROMPT}${categoryInfo}`;
    }
  }

  // 일반 질문 → 기본 프롬프트 + 부스 요약만
  return `${BASE_SYSTEM_PROMPT}\n\n${BOOTH_SUMMARY}`;
}

/**
 * Gemini API 호출
 * @param {string} userMessage - 사용자 메시지
 * @returns {Promise<string>} - AI 응답 텍스트
 */ export async function callGeminiAPI(userMessage) {
  try {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
      console.error("❌ Gemini API 키가 설정되지 않았습니다");
      return "죄송해요, 설정 오류가 발생했어요!";
    }

    // 🎯 동적 프롬프트 생성
    const dynamicPrompt = buildDynamicPrompt(userMessage);
    console.log("📊 프롬프트 길이:", dynamicPrompt.length, "글자");

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent",
      {
        systemInstruction: {
          parts: [{ text: dynamicPrompt }],
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
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // axios는 자동으로 JSON 파싱
    const data = response.data;

    if (data.error) {
      console.error("❌ Gemini API 오류:", data.error);
      return "앗, 다시 말씀해주세요!";
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    console.error("❌ 응답 형식 오류:", data);
    return "죄송해요, 응답을 처리할 수 없어요!";
  } catch (error) {
    // axios 에러 처리
    if (error.response) {
      console.error(
        "❌ Gemini API 오류:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("❌ 네트워크 오류:", error.message);
    } else {
      console.error("❌ 요청 오류:", error.message);
    }
    return "죄송해요, 오류가 발생했어요!";
  }
}
