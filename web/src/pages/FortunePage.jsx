import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import CardGroupIcon from "../assets/icons/card_group.svg?react";
import { motion, AnimatePresence } from "framer-motion";
import CrownIcon from "../assets/icons/crown.svg?react";
// 카드 데이터
const CARD_DATA = [
  {
    id: 1,
    emoji: "🍀",
    title: "자신의 직감을 <br/> 믿고<br/>결정을 내리세요.",
  },
  {
    id: 2,
    emoji: "❤️",
    title: "특별한 인연을<br/>만날 수도있는<br/>날이네요!",
  },
  { id: 3, emoji: "😎", title: "오늘만<br/>평소와<br/>다르게 행동해보세요" },
  { id: 4, emoji: "✨", title: "꾸준한 노력이<br/>빛을 발할 시기에요" },
  {
    id: 5,
    emoji: "🎈",
    title: "긍정적인 마음이<br/>좋은 일을 부르는<br/>날이에요",
  },
  { id: 6, emoji: "👊", title: "새로운 도전하기<br/>딱 좋은 날이에요" },
  {
    id: 7,
    emoji: "🐣",
    title: "서두르지 말고<br/>천천히<br/>발전시켜나가봐요",
  },
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
  { id: 11, emoji: "👉", title: "할까말까<br/>고민될 땐<br/>무조건 하세요" },
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
  {
    id: 17,
    emoji: "💭",
    title: "머릿속에 있는<br/>그 고민,<br/>당장 실행하세요",
  },
  { id: 18, emoji: "💗", title: "새로운 인연을<br/>만날지도 몰라요" },
  {
    id: 19,
    emoji: "🌷",
    title: "가까운 사람에게<br/>조그마한 선물을 주는게<br/>어떨까요?",
  },
  { id: 20, emoji: "🤞", title: "너무 조급해하지 마세요<br/>잘하고 있습니다" },
  { id: 21, emoji: "☀️", title: "오늘이<br/>따뜻한 기억으로<br/>남을거예요" },
  { id: 22, emoji: "📸", title: "오늘은<br/>사진을<br/>많이 남겨보세요" },
  { id: 23, emoji: "🎁", title: "오늘은<br/>나를 위한<br/>선물을 주세요" },
  {
    id: 24,
    emoji: "🌠",
    title: "당신의 친절이<br/>누군가에<br/>잊지못할 하루가<br/>될것 같네요",
  },
];

const CardBack = ({ className = "", onClick, style, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border-[10px] border-solid border-[#FFFCE8]
        flex flex-col items-center justify-center
        p-2 transform-gpu will-change-transform cursor-pointer
        aspect-[2/3] w-[147px] h-[207px]
        ${className}
      `}
      style={{
        background:
          "linear-gradient(180deg, rgba(65, 150, 215, 0.9) 4.64%, #CAFFD6 91%)",
        boxShadow: "0px 0px 6px rgba(63, 63, 63, 0.25)",
        ...style,
      }}
      {...props}
    >
      <span className="text-8xl text-emerald-300 opacity-90 drop-shadow-lg">
        <CrownIcon />
      </span>
    </div>
  );
};

export default function FortuneGame() {
  const [screen, setScreen] = useState("intro");
  const [selectedCard, setSelectedCard] = useState(null);

  const handleStart = () => setScreen("selection");
  const handleCloseResult = () => setSelectedCard(null);
  const handleSelectCard = (card) => setSelectedCard(card);

  return (
    <div className="pt-16 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
      {/* --- 인트로 화면 --- */}
      {screen === "intro" && (
        <div className="text-center w-full max-w-4xl flex flex-col items-center animate-fade-in">
          <h1 className="text-7xl font-extrabold text-slate-800 mb-32">
            <span className="text-slate-800">오늘의 </span>
            <span className="text-blue-600">운세</span>
            <span className="text-slate-800">가 궁금하세요?</span>
          </h1>

          {/* GPU-friendly scale */}
          <motion.div
            onClick={handleStart}
            className="cursor-pointer"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
          >
            <CardGroupIcon />
          </motion.div>

          <p className="text-3xl text-slate-500 mt-20">
            카드를 터치하면 시작해요
          </p>
        </div>
      )}

      {/* --- 카드 선택 화면 --- */}
      {screen === "selection" && (
        <div className="text-center animate-fade-in w-full max-w-[75%]">
          <h1 className="text-6xl font-extrabold text-slate-800 mb-4">
            오늘의 운세
          </h1>

          <p className="text-3xl font-semibold mb-12 text-slate-800">
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

      {/* --- Flip 모달 --- */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            key="modal"
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              style={{
                perspective: "1000px",
                width: "600px",
                height: "840px", // 600 * 1.4
              }}
            >
              <motion.div
                className="relative w-full h-full"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 180 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* 뒷면 */}
                {/* 뒷면 */}
                <div
                  className="absolute w-full h-full rounded-3xl border-[10px] border-[#FFFCE8] flex items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    background:
                      "linear-gradient(180deg, rgba(65, 150, 215, 0.9) 4.64%, #CAFFD6 91%)",
                    transform: "translateZ(0)",
                  }}
                >
                  <span className="text-9xl text-emerald-300 opacity-90">
                    <CrownIcon />
                  </span>
                </div>

                {/* 앞면 */}
                <div
                  className="absolute w-full h-full bg-white rounded-3xl shadow-2xl p-9 flex flex-col items-center justify-center"
                  style={{
                    transform: "rotateY(180deg) translateZ(0)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <button
                    onClick={handleCloseResult}
                    className="absolute top-6 right-6 text-gray-400"
                  >
                    <XMarkIcon className="w-20 h-20" />
                  </button>

                  <div className="text-[200px] w-full flex items-center justify-center mb-8">
                    {selectedCard.emoji}
                  </div>

                  <p
                    className="text-6xl font-bold text-center text-gray-800 leading-snug tracking-tight px-4"
                    dangerouslySetInnerHTML={{ __html: selectedCard.title }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
