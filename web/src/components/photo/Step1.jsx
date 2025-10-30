import BigCameraIcon from "../../assets/icons/big_camera.svg?react";
import RightArrowIcon from "../../assets/icons/right_arrow.svg?react";

export default function Step1Intro({ onStart }) {
  return (
    <div className="flex flex-col items-center mt-5">
      <BigCameraIcon />
      <h1 className="text-6xl font-bold mb-8">기념 사진을 남겨보세요</h1>
      <p className="text-3xl  text-slate-600">사진을 촬영한 후에</p>
      <p className="text-3xl text-slate-600">개인 핸드폰으로 전송해 드려요</p>
      <div class="flex items-center justify-center gap-3 opacity-70 my-12">
        <div class="w-[120px] h-[3px] rounded-full bg-gradient-to-r from-transparent via-gray-500 to-[#BEDBFF]" />
        <div class="w-5 h-5 bg-[#3B82F6]/70 rounded-full" />
        <div class="w-[120px] h-[3px] rounded-full bg-gradient-to-l from-transparent via-gray-500 to-[#BEDBFF]" />
      </div>

      <button
        onClick={onStart}
        className=" flex items-center gap-4 px-32 py-8 rounded-[28px] border-2 border-transparent 
         bg-gradient-to-b from-[#3071FF] to-[#1D4ED8] 
         text-white font-semibold text-6xl
         shadow-[0_19px_42px_rgba(37,99,235,0.38)] 
         hover:opacity-90 active:scale-95 transition"
      >
        시작하기
        <RightArrowIcon />
      </button>
    </div>
  );
}
