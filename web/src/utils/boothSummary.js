// web/src/utils/boothSummary.js

/**
 * 부스 정보를 짧은 요약으로 변환
 * @param {Object} booth - 부스 객체
 * @returns {string} - 한줄 요약
 */
export function summarizeBooth(booth) {
  return `${booth.name} (${booth.subCategory}, ${booth.description.substring(0, 30)}...)`;
}

/**
 * 전체 부스 목록을 카테고리별 요약 텍스트로 변환
 * @param {Array} allBooths - 전체 부스 배열
 * @returns {string} - 프롬프트에 사용할 요약 텍스트
 */
export function generateBoothSummary(allBooths) {
  // 카테고리별로 그룹화
  const grouped = allBooths.reduce((acc, booth) => {
    const category = booth.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(booth);
    return acc;
  }, {});

  // 카테고리별 요약 생성
  let summary = "# 체험 부스 목록 (간단 안내):\n\n";
  
  Object.entries(grouped).forEach(([category, booths]) => {
    summary += `## ${category}\n`;
    booths.forEach((booth) => {
      summary += `- ${booth.name} (${booth.subCategory})\n`;
    });
    summary += "\n";
  });

  summary += '※ 특정 부스에 대해 더 자세히 알고 싶으시면 "○○○ 부스에 대해 알려줘" 라고 물어보세요!\n';
  
  return summary;
}

/**
 * 특정 부스의 상세 정보 텍스트 생성
 * @param {Object} booth - 부스 객체
 * @returns {string} - 상세 정보 텍스트
 */
export function generateBoothDetail(booth) {
  return `
# ${booth.name} 상세 정보

📍 위치: ${booth.location}
🏷️ 분야: ${booth.subCategory}
👥 대상: ${booth.target}
📅 일정: ${booth.date}
⏰ 시간: ${booth.time}
⏱️ 소요시간: 약 ${booth.duration}분
📝 접수: ${booth.registration}

📖 설명:
${booth.description}

📋 상세 내용:
${booth.details || '상세 내용이 제공되지 않았습니다.'}
`;
}

/**
 * 사용자 메시지에서 부스 이름 추출 (간단 버전)
 * @param {string} message - 사용자 메시지
 * @param {Array} allBooths - 전체 부스 배열
 * @returns {Object|null} - 찾은 부스 또는 null
 */
export function findBoothInMessage(message, allBooths) {
  // "○○○ 부스" 또는 "○○○에 대해" 같은 패턴 찾기
  for (const booth of allBooths) {
    if (message.includes(booth.name)) {
      return booth;
    }
  }
  return null;
}
