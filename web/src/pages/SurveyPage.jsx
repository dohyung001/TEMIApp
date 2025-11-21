import React from 'react';

// ------------------------------------------------------------------
// ★★★★★ 1. QR 코드 이미지 Import ★★★★★
// ------------------------------------------------------------------
// (web/src/assets/img/ 폴더에 있는 QR 코드 이미지)
// (파일 이름이 다르면 이 경로를 수정하세요)

import qrDinoImage from '/img/qrcode_docs.google.com.png'; 
// ------------------------------------------------------------------


// (메인 컴포넌트)
export default function SurveyPage() {

  return (
    // 1. 전체 화면 컨테이너
    <div className="relative flex flex-col items-center justify-center pt-32 text-gray-800">
      
      {/* 2. 홈 버튼 (제거됨) */}

      {/* 3. 텍스트 컨텐츠 (UI 스크린샷 반영) */}
      <div className="text-center mb-12 animate-fade-in">
        <p className="text-6xl text-gray-600 mb-4">더 나은 테미를 위해</p>
        <h1 className="text-8xl font-bold mb-5">의견을 들려주세요</h1>
        <p className="text-4xl text-gray-500">거짓말 아니고 10초 걸려요!</p>
      </div>

      {/* 4. QR 코드 섹션 */}
      <div className="relative flex items-center pt-10 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
        
        <div className="relative">
          {/* Import한 다이노 QR 코드 이미지 사용 */}
          <img 
            src={qrDinoImage} 
            alt="설문조사 QR 코드" 
            className="w-80 h-80 rounded-lg shadow-xl" // 320x320px
          />
          
        </div>
      </div>
    </div>
  );
}