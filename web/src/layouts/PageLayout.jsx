// web/src/layouts/PageLayout.jsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HomeButton from "../components/HomeButton";
import SpeechButton from "../components/SpeechButton";
import VoiceChatOverlay from "../components/VoiceChatOverlay";
import TailIcon from "../assets/icons/tail.svg?react";
export default function PageLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  // 음성 채팅 오버레이 상태
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <div className="w-[1920px] h-[1200px] flex flex-col bg-gradient-to-br from-gray-100 to-gray-200 relative">
      {/* 상단 컨트롤 영역 */}
      <div className="h-[140px] flex items-center justify-between px-10 flex-shrink-0">
        {/* 홈 버튼 */}
        <div className="w-[120px]">{!isHome && <HomeButton />}</div>

        <div className="flex gap-4">
          {/* 중앙: 안내 메시지 */}
          <div className="flex-1 flex items-center justify-center px-8">
            <div className="relative bg-[#829AC1] backdrop-blur rounded-3xl px-8 py-4">
              <p className="text-4xl text-white">
                버튼을 누르면 저와 대화할 수 있어요
              </p>

              {/* TailIcon 꼬리 */}
              <TailIcon
                className="
        absolute 
        -right-12 
        top-1/2 
        -translate-y-4
         
        w-[80px] 
        h-[40px]
      "
              />
            </div>
          </div>

          {/* 스피치 버튼 */}
          <div className="w-[120px] flex justify-end">
            <div
              onClick={() => setIsOverlayOpen(true)}
              className="cursor-pointer"
            >
              <SpeechButton />
            </div>
          </div>
        </div>
      </div>

      {/* 페이지 컨텐츠 */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>

      {/* 음성 채팅 오버레이 */}
      <VoiceChatOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
      />
    </div>
  );
}
