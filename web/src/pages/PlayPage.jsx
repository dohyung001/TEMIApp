import { useNavigate } from "react-router-dom";
import DanceIcon from "../assets/icons/dance.svg?react";
import CustomIcon from "../assets/icons/custom.svg?react";
import ChatIcon from "../assets/icons/chat.svg?react";

export default function PlayPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-12">뭐하고 놀까요?</h1>

      {/* 버튼 3개를 균등 분배하는 grid */}
      <div className="grid grid-cols-3 gap-8 ">
        <button
          onClick={() => navigate("/play/chat")}
          className="flex flex-col items-center justify-center bg-white rounded-2xl py-12 px-8 shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
        >
          <ChatIcon className="mb-6" />
          <h1 className="text-[#1D4ED8] font-bold text-4xl mb-2">
            테미랑 대화하기
          </h1>
          <p className="text-slate-600 text-3xl">테미와 음성으로</p>
          <p className="text-slate-600 text-3xl">대화해요</p>
        </button>

        <button
          onClick={() => navigate("/play/custom")}
          className="flex flex-col items-center justify-center bg-white rounded-2xl py-12 px-8 shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
        >
          <CustomIcon className="mb-6" />
          <h1 className="text-[#1D4ED8] font-bold text-4xl mb-2">
            커스터마이징
          </h1>
          <p className="text-slate-600 text-3xl">테미를 개인의 취향대로</p>
          <p className="text-slate-600 text-3xl">커스터마이징 해보세요</p>
        </button>

        <button
          onClick={() => navigate("/play/dance")}
          className="flex flex-col items-center justify-center bg-white rounded-2xl py-12 px-8 shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
        >
          <DanceIcon className="mb-6" />
          <h1 className="text-[#1D4ED8] font-bold text-4xl mb-2">춤추기</h1>
          <p className="text-slate-600 text-3xl">노래에 맞춰서</p>
          <p className="text-slate-600 text-3xl">테미가 춤을 춰요!</p>
        </button>
      </div>
    </div>
  );
}
