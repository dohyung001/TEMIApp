import React, { useState } from 'react';

// (1) 아이콘 import
import {
  // HomeIcon, // 홈 아이콘 제거
  ArrowUturnLeftIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

// ------------------------------------------------------------------
// ★★★★★ 1. 수정된 부분: 카드 데이터 24개 전체 반영 ★★★★★
// ------------------------------------------------------------------
const CARD_DATA = [
  // 1-10 (이전에 주신 10개 데이터)
  { id: 1, emoji: "🍀", title: "자신의 직감을 믿고 결정을 내리세요." },
  { id: 2, emoji: "❤️", title: "특별한 인연을 만날 수도 있는 날이네요!" },
  { id: 3, emoji: "😎", title: "오늘만 평소와 다르게 행동해보세요" },
  { id: 4, emoji: "✨", title: "꾸준한 노력이 빛을 발할 시기에요" },
  { id: 5, emoji: "🎈", title: "긍정적인 마음이 좋은 일을 부르는 날이에요" },
  { id: 6, emoji: "👊", title: "새로운 도전하기 딱 좋은 날이에요" },
  { id: 7, emoji: "🐣", title: "서두르지 말고 천천히 발전시켜나가봐요" },
  { id: 8, emoji: "🤩", title: "노력한 만큼의 결과가 돌아올거예요" },
  { id: 9, emoji: "🍀", title: "새로운 기회가 찾아올 수 있으니 준비하세요" },
  { id: 10, emoji: "🌼", title: "주변사람에게 좋은 영향을 받는 날이에요" },
  
  // 11-20 (두 번째로 주신 10개 데이터)
  { id: 11, emoji: "👉", title: "할까말까 고민될 땐 무조건 하세요" },
  { id: 12, emoji: "🧗‍♀️", title: "오늘만큼은 눈 딱 감고 도전하세요" },
  { id: 13, emoji: "🔥", title: "오늘만큼은 할 일을 내일로 미루지 마세요" },
  { id: 14, emoji: "🏋️‍♀️", title: "오늘 당신의 키는 자신감입니다" },
  { id: 15, emoji: "🌈", title: "주변사람에게 좋은 영향을 주는 날이에요" },
  { id: 16, emoji: "👉", title: "잘될거예요. 용기를 내세요" },
  { id: 17, emoji: "💭", title: "마음 속에 있는 그 고민, 당장 실행하세요" },
  { id: 18, emoji: "💗", title: "새로운 인연을 만날지도 몰라요" },
  { id: 19, emoji: "🌷", title: "가까운 사람에게 조그마한 선물을 주는게 어떨까요?" },
  { id: 20, emoji: "🤞", title: "너무 조급해하지 마세요" },

  // 21-24 (방금 주신 4개 데이터)
  { id: 21, emoji: "☀️", title: "오늘이 따뜻한 기억으로 남을거예요" },
  { id: 22, emoji: "📸", title: "오늘은 사진을 많이 남겨보세요" },
  { id: 23, emoji: "🎁", title: "오늘은 나를 위한 선물을 주세요" },
  { id: 24, emoji: "🌠", title: "당신의 친절이 누군가에겐 잊지못할 하루가 될거예요" },
];
// ------------------------------------------------------------------

// (3) 카드 뒷면 컴포넌트 (변경 없음)
const CardBack = ({ className = '', ...props }) => {
  return (
    <div
      className={`bg-gradient-to-b from-teal-400 to-cyan-500 rounded-lg shadow-lg 
                  border-4 border-teal-700 
                  flex flex-col items-center justify-center p-2
                  transition-all duration-300 transform-gpu 
                  aspect-[2/3] ${className}`}
      {...props}
    >
      <span className="text-7xl text-yellow-400" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
        👑
      </span>
    </div>
  );
};

// (4) 메인 운세 게임 컴포넌트
export default function FortuneGame() {
  // --- State (변경 없음) ---
  const [screen, setScreen] = useState('intro');
  const [selectedCard, setSelectedCard] = useState(null); 

  // --- Event Handlers (handleGoHome 제거) ---
  const handleStart = () => setScreen('selection');

  // const handleGoHome = () => {
  //   setScreen('intro');
  //   setSelectedCard(null);
  // };

  const handleGoBack = () => setScreen('intro');
  const handleCloseModal = () => setSelectedCard(null);

  const handleSelectCard = (card) => {
    setSelectedCard(card);
  };

  // --- 렌더링 (변경 없음) ---
  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen p-20 bg-gray-100 overflow-hidden">
      
      {/* --- 네비게이션 버튼 (홈 버튼 제거됨) --- */}
      {/* <button
        onClick={handleGoHome}
        className="absolute top-10 left-10 z-30 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-gray-50 transition-transform hover:scale-110"
        aria-label="홈으로 가기"
      >
        <HomeIcon className="w-12 h-12" />
      </button> 
      */}

      {screen === 'selection' && (
        <button
          onClick={handleGoBack}
          className="absolute bottom-10 left-10 z-30 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-gray-50 transition-transform hover:scale-110"
          aria-label="뒤로 가기"
        >
          <ArrowUturnLeftIcon className="w-12 h-12" />
        </button>
      )}

      {/* --- 1. 인트로 화면 --- */}
      {screen === 'intro' && (
        <div className="text-center animate-fade-in">
          <h1 className="text-7xl font-bold text-gray-800 mb-12">
            오늘의 <span className="text-blue-600">운세</span>가 궁금하세요?
          </h1>
          
          <div
            onClick={handleStart}
            className="relative w-[400px] h-[560px] mx-auto my-16 cursor-pointer"
          >
            <CardBack className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 transform -rotate-15 transition-all duration-300" />
            <CardBack className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 transform -rotate-5 transition-all duration-300" />
            <CardBack className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 z-10 transition-all duration-300 shadow-xl" />
            <CardBack className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 transform rotate-5 transition-all duration-300" />
            <CardBack className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 transform rotate-15 transition-all duration-300" />
          </div>
          
          <p className="text-3xl text-gray-500">카드를 터치하면 시작해요</p>
        </div>
      )}

      {/* --- 2. 카드 선택 화면 --- */}
      {screen === 'selection' && (
        <div className="text-center animate-fade-in w-full max-w-7xl">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">오늘의 운세</h1>
          <p className="text-3xl text-yellow-600 font-semibold mb-12">
            ✨ 카드를 하나 선택해주세요 ✨
          </p>
          
          <div className="grid grid-cols-8 gap-8">
            {CARD_DATA.map((card) => (
              <CardBack
                key={card.id}
                onClick={() => handleSelectCard(card)} 
                className="w-full cursor-pointer hover:scale-105 hover:shadow-xl" 
              />
            ))}
          </div>
        </div>
      )}

      {/* --- 3. 결과 모달 (팝업) --- */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast p-4">
          
          <div className="bg-white rounded-3xl shadow-2xl p-12 pt-16 text-center relative max-w-2xl w-full">
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="모달 닫기"
            >
              <XMarkIcon className="w-10 h-10" />
            </button>
            
            <div className="text-9xl mb-8">
              {selectedCard.emoji}
            </div>
            
            <p className="text-4xl font-semibold text-gray-700 leading-relaxed">
              {selectedCard.title}
            </p> 
          </div>
        </div>
      )}
    </div>
  );
}