// web/src/constants/boothData.js

/**
 * 부스 정보 데이터
 *
 * 파일 구조:
 * - assets/booths/booth-001.jpg
 * - assets/booths/booth-002.jpg
 * - ...
 */

export const BOOTHS = [
  {
    id: 1,
    name: "AI 혁신부스",
    category: "인공지능",
    location: "제1전시장 2홀 A-101",
    description: "최신 AI 기술을 직접 체험해보세요",
    imageFile: "booth-001.jpg", // ← 파일명만
  },
  {
    id: 2,
    name: "로봇공학 체험존",
    category: "로봇공학",
    location: "제1전시장 2홀 A-102",
    description: "협동 로봇과 함께하는 미래",
    imageFile: "booth-002.jpg",
  },
  {
    id: 3,
    name: "VR/AR 체험관",
    category: "가상현실",
    location: "제1전시장 2홀 A-103",
    description: "메타버스 속으로 떠나는 여행",
    imageFile: "booth-003.jpg",
  },
  {
    id: 4,
    name: "바이오 의료 혁신",
    category: "바이오",
    location: "제1전시장 2홀 B-101",
    description: "생명을 살리는 기술",
    imageFile: "booth-004.jpg",
  },
  {
    id: 5,
    name: "친환경 에너지",
    category: "에너지",
    location: "제1전시장 2홀 B-102",
    description: "지속가능한 미래를 위한 에너지",
    imageFile: "booth-005.jpg",
  },
  // ... 50~100개 추가
];

/**
 * 카테고리별 부스 필터
 */
export const getBoothsByCategory = (category) => {
  return BOOTHS.filter((booth) => booth.category === category);
};

/**
 * 부스 검색
 */
export const searchBooths = (query) => {
  const lowerQuery = query.toLowerCase();
  return BOOTHS.filter(
    (booth) =>
      booth.name.toLowerCase().includes(lowerQuery) ||
      booth.description.toLowerCase().includes(lowerQuery)
  );
};

/**
 * 카테고리 목록
 */
export const CATEGORIES = [
  "인공지능",
  "로봇공학",
  "가상현실",
  "바이오",
  "에너지",
  "모빌리티",
  "우주항공",
  "양자컴퓨팅",
];
