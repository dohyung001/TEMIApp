import React, { useState, useEffect } from "react";
import { ArrowUturnLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";

// 카드 데이터 (유저가 제공한 24개 데이터)
const CARD_DATA = [
  { id: 1, emoji: "🍀", title: "자신의 직감을 믿고<br/>결정을 내리세요." }, // 줄 바꿈 적용
  {
    id: 2,
    emoji: "❤️",
    title: "특별한 인연을<br/>만날 수도있는<br/>날이네요!",
  },
  { id: 3, emoji: "😎", title: "오늘만 평소와<br/>다르게 행동해보세요" },
  { id: 4, emoji: "✨", title: "꾸준한 노력이<br/>빛을 발할 시기에요" },
  {
    id: 5,
    emoji: "🎈",
    title: "긍정적인 마음이<br/>좋은 일을 부르는<br/>날이에요",
  },
  { id: 6, emoji: "👊", title: "새로운 도전하기<br/>딱 좋은 날이에요" },
  { id: 7, emoji: "🐣", title: "서두르지 말고 천천히<br/>발전시켜나가봐요" },
  { id: 8, emoji: "🤩", title: "노력한 만큼의<br/>결과가 돌아올거예요" },
  {
    id: 9,
    emoji: "🍀",
    title: "새로운 기회가<br/>찾아올 수 있으니<br/>준비하세요",
  },
  {
    id: 10,
    emoji: "🌼",
    title: "주변사람에게<br/>좋은 영향을 받는<br/>날이에요",
  },

  { id: 11, emoji: "👉", title: "할까말까 고민될 땐<br/>무조건 하세요" },
  { id: 12, emoji: "🧗‍♀️", title: "오늘만큼은<br/>눈 딱 감고<br/>도전하세요" },
  {
    id: 13,
    emoji: "🔥",
    title: "오늘만큼은<br/>할 일을 내일로<br/>미루지 마세요",
  },
  { id: 14, emoji: "🏋️‍♀️", title: "오늘 당신의 키는<br/>자신감입니다" },
  {
    id: 15,
    emoji: "🌈",
    title: "주변사람에게<br/>좋은 영향을<br/>주게되는 날이에요",
  },
  { id: 16, emoji: "👉", title: "잘될거예요.<br/>용기를 내세요" },
  { id: 17, emoji: "💭", title: "머릿속에 있는 그 고민,<br/>당장 실행하세요" },
  { id: 18, emoji: "💗", title: "새로운 인연을<br/>만날지도 몰라요" },
  {
    id: 19,
    emoji: "🌷",
    title: "가까운 사람에게<br/>조그마한 선물을 주는게<br/>어떨까요?",
  },
  { id: 20, emoji: "🤞", title: "너무 조급해하지 마세요<br/>잘하고 있습니다" },

  { id: 21, emoji: "☀️", title: "오늘이 따뜻한 기억으로<br/>남을거예요" },
  { id: 22, emoji: "📸", title: "오늘은 사진을<br/>많이 남겨보세요" },
  { id: 23, emoji: "🎁", title: "오늘은 나를 위한<br/>선물을 주세요" },
  {
    id: 24,
    emoji: "🌠",
    title: "당신의 친절이<br/>누군가에<br/>잊지못할 하루가<br/>될것 같네요",
  },
];

/**
 * 카드 뒷면 컴포넌트
 */
const CardBack = ({ className = "", onClick, style, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`
                rounded-2xl shadow-xl 
                border-[10px] border-solid border-[#fffce7] // 연한 노란색 테두리
                flex flex-col items-center justify-center 
                p-2 transition-all duration-300 ease-in-out transform-gpu 
                aspect-[2/3] 
                ${
                  onClick
                    ? "cursor-pointer hover:scale-[1.03] hover:shadow-2xl"
                    : ""
                }
                ${className}
            `}
      //rgba(0, 69, 98, 0.9) 0%, rgba(202, 255, 214, 1) 100%)
      style={{
        background:
          "linear-gradient(168deg, rgba(215, 192, 65, 1) 0%, #e2f0ff 100%)", // Image 1의 카드 배경색
        boxShadow: "0px 0px 10px rgba(63, 63, 63, 0.345)",
        ...style,
      }}
      {...props}
    >
      {/* 네잎클로버 이모지 */}
      <span className="text-7xl text-emerald-300 opacity-90 filter drop-shadow-[0_0_8px_rgba(0,128,0,0.7)]">
        🍀
      </span>
    </div>
  );
};

// 메인 운세 게임 컴포넌트
export default function FortuneGame() {
  const [screen, setScreen] = useState("intro");
  const [selectedCard, setSelectedCard] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // 레퍼런스 페이지의 배경색과 유사하게 설정
  const mainBackgroundClass =
    "min-h-screen p-10 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 font-sans";

  const handleStart = () => setScreen("selection");

  // 이 함수는 '뒤로 가기' 버튼(좌하단)에서 사용됨. 모달에서는 닫기 기능만 수행함.
  const handleGoBack = () => {
    setIsAnimating(false);
    setSelectedCard(null);
    setTimeout(() => setScreen("intro"), 300);
  };

  const handleSelectCard = (card) => {
    setIsAnimating(true);
    setSelectedCard(card);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const CARD_WIDTH = 200; // 원본 피그마 카드 너비
  const CARD_HEIGHT = 300; // 원본 피그마 카드 높이
  const CARD_OVERLAP_PERCENT = 0.4; // 30% 겹치기 = 70% 간격
  const CARD_COUNT = 7;

  // --- 렌더링 ---
  return (
    <div className={mainBackgroundClass}>
      {/* --- 1. 인트로 화면 --- */}
      {screen === "intro" && !selectedCard && (
        <div className="text-center w-full max-w-4xl pt-20 animate-fade-in">
          <h1 className="text-7xl font-extrabold text-slate-800 mb-20 leading-tight">
            <span className="text-slate-800">오늘의 </span>
            <span className="text-blue-600">운세</span>
            <span className="text-slate-800">가 궁금하세요?</span>
          </h1>

          {/* 카드 덱 시뮬레이션: 일직선, 30% 겹침 */}
          <div
            onClick={handleStart}
            // 카드 덱 전체 크기 계산: (카드 개수 * 겹치지 않는 부분) + 카드 하나 너비
            style={{
              width: `${
                CARD_WIDTH +
                (CARD_COUNT - 1) * CARD_WIDTH * CARD_OVERLAP_PERCENT
              }px`,
              height: `${CARD_HEIGHT}px`,
            }}
            className="relative mx-auto my-16 cursor-pointer transform hover:scale-[1.02] transition-transform duration-500"
          >
            {[...Array(CARD_COUNT)].map((_, index) => (
              <CardBack
                key={index}
                className={`absolute w-[${CARD_WIDTH}px] h-[${CARD_HEIGHT}px] shadow-2xl animate-card-pulse delay-[${
                  index * 0.1
                }s]`}
                style={{
                  // 겹치지 않는 부분(30%) * index 만큼 이동
                  left: `${index * CARD_WIDTH * CARD_OVERLAP_PERCENT}px`,
                  zIndex: index + 1, // 앞에 있는 카드가 위에 옴
                }}
              />
            ))}
          </div>

          <p className="text-3xl text-slate-500 mt-20">
            카드를 터치하면 시작해요
          </p>
        </div>
      )}

      {/* --- 2. 카드 선택 화면 --- */}
      {screen === "selection" && !selectedCard && (
        <div className="text-center animate-fade-in w-full max-w-7xl pt-10">
          <h1 className="text-6xl font-extrabold text-slate-800 mb-4">
            오늘의 운세
          </h1>
          <p className="text-3xl text-blue-400 font-semibold mb-12">
            ✨ 카드를 하나 선택해주세요 ✨
          </p>

          <div className="grid grid-cols-8 gap-6 px-4">
            {CARD_DATA.map((card) => (
              <CardBack
                key={card.id}
                onClick={() => handleSelectCard(card)}
                className="w-full"
              />
            ))}
          </div>
        </div>
      )}

      {/* 뒤로 가기 버튼 (좌하단) - 선택 화면에서만 */}
      {screen === "selection" && !selectedCard && (
        <button
          onClick={handleGoBack}
          className="absolute bottom-10 left-10 z-30 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 transition-transform hover:scale-105"
          aria-label="뒤로 가기"
        >
          <ArrowUturnLeftIcon className="w-12 h-12" />
        </button>
      )}

      {/* --- 3. 결과 모달 --- */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`
                            bg-white rounded-3xl shadow-2xl p-12 text-center relative max-w-lg w-full 
                            aspect-[2/3] 
                            ${
                              isAnimating
                                ? "animate-card-open"
                                : "animate-fade-in-fast"
                            }
                            flex flex-col items-center justify-center // 가운데 정렬 유지
                        `}
            onAnimationEnd={() => setIsAnimating(false)}
          >
            <button
              onClick={() => setSelectedCard(null)} // X 버튼은 모달 닫기 (다시 카드 선택 화면으로)
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="모달 닫기"
            >
              <XMarkIcon className="w-10 h-10" />
            </button>

            <div className="text-[120px] mb-8 animate-pop-in">
              {selectedCard.emoji}
            </div>

            <p
              className="text-4xl font-extrabold text-gray-800 leading-snug tracking-tight px-4 animate-pop-in delay-200"
              dangerouslySetInnerHTML={{ __html: selectedCard.title }}
            />

            {/* '처음으로 돌아가기' 버튼 삭제됨 */}
          </div>
        </div>
      )}

      {/* 커스텀 Tailwind 애니메이션 정의 (CSS) */}
      <style jsx="true">{`
        @keyframes card-open {
          0% {
            transform: scale(0.5) rotateY(0deg);
            opacity: 0.5;
          }
          50% {
            transform: scale(0.5) rotateY(90deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(1) rotateY(0deg);
            opacity: 1;
          }
        }

        .animate-card-open {
          animation: card-open 0.5s ease-out forwards;
        }

        @keyframes pop-in {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-pop-in {
          animation: pop-in 0.3s ease-out forwards;
        }

        @keyframes card-pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02); /* 살짝 커졌다가 */
          }
          100% {
            transform: scale(1); /* 다시 원래대로 */
          }
        }

        .animate-card-pulse {
          animation: card-pulse 2.5s ease-in-out infinite; /* 2.5초마다 반복 */
        }

        .delay-\[0s\] {
          animation-delay: 0s;
        }
      `}</style>
    </div>
  );
}
// import React, { useState } from 'react';

// // (1) 아이콘 import
// import {
//   // HomeIcon, // 홈 아이콘 제거
//   ArrowUturnLeftIcon,
//   XMarkIcon,
// } from '@heroicons/react/24/solid';

// // ------------------------------------------------------------------
// // ★★★★★ 1. 수정된 부분: 카드 데이터 24개 전체 반영 ★★★★★
// // ------------------------------------------------------------------
// const CARD_DATA = [
//   // 1-10 (이전에 주신 10개 데이터)
//   { id: 1, emoji: "🍀", title: "자신의 직감을 믿고 결정을 내리세요." },
//   { id: 2, emoji: "❤️", title: "특별한 인연을 만날 수도 있는 날이네요!" },
//   { id: 3, emoji: "😎", title: "오늘만 평소와 다르게 행동해보세요" },
//   { id: 4, emoji: "✨", title: "꾸준한 노력이 빛을 발할 시기에요" },
//   { id: 5, emoji: "🎈", title: "긍정적인 마음이 좋은 일을 부르는 날이에요" },
//   { id: 6, emoji: "👊", title: "새로운 도전하기 딱 좋은 날이에요" },
//   { id: 7, emoji: "🐣", title: "서두르지 말고 천천히 발전시켜나가봐요" },
//   { id: 8, emoji: "🤩", title: "노력한 만큼의 결과가 돌아올거예요" },
//   { id: 9, emoji: "🍀", title: "새로운 기회가 찾아올 수 있으니 준비하세요" },
//   { id: 10, emoji: "🌼", title: "주변사람에게 좋은 영향을 받는 날이에요" },

//   // 11-20 (두 번째로 주신 10개 데이터)
//   { id: 11, emoji: "👉", title: "할까말까 고민될 땐 무조건 하세요" },
//   { id: 12, emoji: "🧗‍♀️", title: "오늘만큼은 눈 딱 감고 도전하세요" },
//   { id: 13, emoji: "🔥", title: "오늘만큼은 할 일을 내일로 미루지 마세요" },
//   { id: 14, emoji: "🏋️‍♀️", title: "오늘 당신의 키는 자신감입니다" },
//   { id: 15, emoji: "🌈", title: "주변사람에게 좋은 영향을 주는 날이에요" },
//   { id: 16, emoji: "👉", title: "잘될거예요. 용기를 내세요" },
//   { id: 17, emoji: "💭", title: "마음 속에 있는 그 고민, 당장 실행하세요" },
//   { id: 18, emoji: "💗", title: "새로운 인연을 만날지도 몰라요" },
//   { id: 19, emoji: "🌷", title: "가까운 사람에게 조그마한 선물을 주는게 어떨까요?" },
//   { id: 20, emoji: "🤞", title: "너무 조급해하지 마세요" },

//   // 21-24 (방금 주신 4개 데이터)
//   { id: 21, emoji: "☀️", title: "오늘이 따뜻한 기억으로 남을거예요" },
//   { id: 22, emoji: "📸", title: "오늘은 사진을 많이 남겨보세요" },
//   { id: 23, emoji: "🎁", title: "오늘은 나를 위한 선물을 주세요" },
//   { id: 24, emoji: "🌠", title: "당신의 친절이 누군가에겐 잊지못할 하루가 될거예요" },
// ];
// // ------------------------------------------------------------------

// // (3) 카드 뒷면 컴포넌트 (변경 없음)
// const CardBack = ({ className = '', ...props }) => {
//   return (
//     <div
//       className={`bg-gradient-to-b from-teal-400 to-cyan-500 rounded-lg shadow-lg
//                   border-4 border-teal-700
//                   flex flex-col items-center justify-center p-2
//                   transition-all duration-300 transform-gpu
//                   aspect-[2/3] ${className}`}
//       {...props}
//     >
//       <span className="text-7xl text-yellow-400" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
//         👑
//       </span>
//     </div>
//   );
// };

// // (4) 메인 운세 게임 컴포넌트
// export default function FortuneGame() {
//   // --- State (변경 없음) ---
//   const [screen, setScreen] = useState('intro');
//   const [selectedCard, setSelectedCard] = useState(null);

//   // --- Event Handlers (handleGoHome 제거) ---
//   const handleStart = () => setScreen('selection');

//   // const handleGoHome = () => {
//   //   setScreen('intro');
//   //   setSelectedCard(null);
//   // };

//   const handleGoBack = () => setScreen('intro');
//   const handleCloseModal = () => setSelectedCard(null);

//   const handleSelectCard = (card) => {
//     setSelectedCard(card);
//   };

//   // --- 렌더링 (변경 없음) ---
//   return (
//     <div className="relative flex flex-col items-center justify-center w-screen h-screen p-20 bg-gray-100 overflow-hidden">

//       {/* --- 네비게이션 버튼 (홈 버튼 제거됨) --- */}
//       {/* <button
//         onClick={handleGoHome}
//         className="absolute top-10 left-10 z-30 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-gray-50 transition-transform hover:scale-110"
//         aria-label="홈으로 가기"
//       >
//         <HomeIcon className="w-12 h-12" />
//       </button>
//       */}

//       {screen === 'selection' && (
//         <button
//           onClick={handleGoBack}
//           className="absolute bottom-10 left-10 z-30 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-gray-50 transition-transform hover:scale-110"
//           aria-label="뒤로 가기"
//         >
//           <ArrowUturnLeftIcon className="w-12 h-12" />
//         </button>
//       )}

//       {/* --- 1. 인트로 화면 --- */}
//       {screen === 'intro' && (
//         <div className="text-center animate-fade-in">
//           <h1 className="text-7xl font-bold text-gray-800 mb-12">
//             오늘의 <span className="text-blue-600">운세</span>가 궁금하세요?
//           </h1>

//           <div
//             onClick={handleStart}
//             className="relative w-[400px] h-[560px] mx-auto my-16 cursor-pointer"
//           >
//             <CardBack className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 transform -rotate-15 transition-all duration-300" />
//             <CardBack className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 transform -rotate-5 transition-all duration-300" />
//             <CardBack className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 z-10 transition-all duration-300 shadow-xl" />
//             <CardBack className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 transform rotate-5 transition-all duration-300" />
//             <CardBack className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 transform rotate-15 transition-all duration-300" />
//           </div>

//           <p className="text-3xl text-gray-500">카드를 터치하면 시작해요</p>
//         </div>
//       )}

//       {/* --- 2. 카드 선택 화면 --- */}
//       {screen === 'selection' && (
//         <div className="text-center animate-fade-in w-full max-w-7xl">
//           <h1 className="text-6xl font-bold text-gray-800 mb-6">오늘의 운세</h1>
//           <p className="text-3xl text-yellow-600 font-semibold mb-12">
//             ✨ 카드를 하나 선택해주세요 ✨
//           </p>

//           <div className="grid grid-cols-8 gap-8">
//             {CARD_DATA.map((card) => (
//               <CardBack
//                 key={card.id}
//                 onClick={() => handleSelectCard(card)}
//                 className="w-full cursor-pointer hover:scale-105 hover:shadow-xl"
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* --- 3. 결과 모달 (팝업) --- */}
//       {selectedCard && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast p-4">

//           <div className="bg-white rounded-3xl shadow-2xl p-12 pt-16 text-center relative max-w-2xl w-full">
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
//               aria-label="모달 닫기"
//             >
//               <XMarkIcon className="w-10 h-10" />
//             </button>

//             <div className="text-9xl mb-8">
//               {selectedCard.emoji}
//             </div>

//             <p className="text-4xl font-semibold text-gray-700 leading-relaxed">
//               {selectedCard.title}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
