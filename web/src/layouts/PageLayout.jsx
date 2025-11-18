// web/src/layouts/PageLayout.jsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HomeButton from "../components/HomeButton";
import SpeechButton from "../components/SpeechButton";
import VoiceChatDisplay from "../components/VoiceChatDisplay";
import useVoiceChat from "../hooks/useVoiceChat";

export default function PageLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  // 음성 채팅 활성화 상태
  const [isChatActive, setIsChatActive] = useState(false);

  // 음성 채팅 훅 사용
  const {
    isListening,
    isThinking,
    isSpeaking,
    messages,
    startListening,
    clearMessages,
  } = useVoiceChat(isChatActive);

  /**
   * 스피치 버튼 클릭 핸들러
   * - 채팅 비활성화 상태: 활성화 + 첫 음성 인식 시작
   * - 채팅 활성화 상태: 비활성화 + 메시지 초기화
   */
  const handleSpeechClick = () => {
    if (!isChatActive) {
      // 활성화
      setIsChatActive(true);
      setTimeout(() => {
        startListening();
      }, 300);
    } else {
      // 비활성화
      setIsChatActive(false);
      clearMessages();
    }
  };

  return (
    <div className="w-[1920px] h-[1200px] flex flex-col bg-gradient-to-br from-gray-100 to-gray-200 relative">
      {/* 상단 컨트롤 영역 */}
      <div className="h-[140px] flex items-center justify-between px-10 flex-shrink-0">
        {/* 홈 버튼 */}
        <div className="w-[120px]">{!isHome && <HomeButton />}</div>

        {/* 중앙: 음성 채팅 디스플레이 */}
        <div className="flex-1 px-8">
          <VoiceChatDisplay
            messages={messages}
            isListening={isListening}
            isThinking={isThinking}
            isSpeaking={isSpeaking}
          />
        </div>

        {/* 스피치 버튼 (ON/OFF) */}
        <div className="w-[120px] flex justify-end">
          <div onClick={handleSpeechClick} className="relative">
            <SpeechButton />
            {/* 활성화 상태 표시 */}
            {isChatActive && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 페이지 컨텐츠 */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
