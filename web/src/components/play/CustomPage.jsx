// web/src/components/pages/CustomPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TemiBridge } from "../../services/temiBridge";

const CustomPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    speed: "normal",
    voice: "soft",
    character: "theme1",
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem("temiCustomSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // 실시간 적용 함수
  const applySettingsImmediately = (newSettings) => {
    try {
      localStorage.setItem("temiCustomSettings", JSON.stringify(newSettings));

      if (TemiBridge.isNativeAvailable()) {
        TemiBridge.setCustomization(newSettings);
      }

      // 캐릭터별 인사 메시지
      const testMessages = {
        theme1: "프로페셔널 모드로 설정되었습니다.",
        theme2: "친근한 모드로 설정되었습니다!",
        theme3: "귀여운 모드로 설정되었습니다!",
      };

      TemiBridge.speak(testMessages[newSettings.character]);
    } catch (error) {
      console.error("설정 적용 실패:", error);
    }
  };

  const handleSpeedChange = (speed) => {
    const newSettings = { ...settings, speed };
    setSettings(newSettings);
    applySettingsImmediately(newSettings);
  };

  const handleVoiceChange = (voice) => {
    const newSettings = { ...settings, voice };
    setSettings(newSettings);
    applySettingsImmediately(newSettings);
  };

  const handleCharacterChange = (character) => {
    const newSettings = { ...settings, character };
    setSettings(newSettings);
    applySettingsImmediately(newSettings);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full ">
        {/* 헤더 */}
        <h1 className="text-5xl font-bold text-slate-800 text-center mb-12">
          테미 커스터마이징
        </h1>

        {/* 속도 설정 */}
        <div className="pb-12 mb-12 grid grid-cols-[auto_1fr_1fr_1fr] gap-6 items-center border-b border-black/20">
          {/* 속도 제목 - 왼쪽 */}
          <h2 className="text-3xl font-semibold w-40 text-center">속도</h2>

          {/* 버튼들 */}
          {[
            { value: "slow", label: "느리게" },
            { value: "normal", label: "보통" },
            { value: "fast", label: "빠르게" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleSpeedChange(value)}
              className={`
                p-8 rounded-3xl text-2xl font-bold transition-all duration-300 transform shadow-2xl
                ${
                  settings.speed === value
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 목소리 설정 */}
        <div className="pb-12 mb-12 grid grid-cols-[auto_1fr_1fr_1fr] gap-6 items-center border-b border-black/20">
          {/* 목소리 제목 - 왼쪽 */}
          <h2 className="text-3xl font-semibold w-40 text-center">목소리</h2>

          {/* 버튼들 */}
          {[
            { value: "low", label: "낮은 톤" },
            { value: "high", label: "높은 톤" },
            { value: "soft", label: "부드러운 톤" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleVoiceChange(value)}
              className={`
                p-8 rounded-3xl text-2xl font-bold transition-all duration-300 transform shadow-2xl
                ${
                  settings.voice === value
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 캐릭터 설정 */}
        <div className="pb-12 mb-12 grid grid-cols-[auto_1fr_1fr_1fr] gap-6 items-center border-b border-black/20">
          {/* 캐릭터 제목 - 왼쪽 */}
          <h2 className="text-3xl font-semibold w-40 text-center">캐릭터</h2>

          {/* 버튼들 */}
          {[
            { value: "theme1", label: "프로페셔널", desc: "정중하고 전문적" },
            { value: "theme2", label: "친근한", desc: "친구같이 편안" },
            { value: "theme3", label: "귀여운", desc: "사랑스럽고 발랄" },
          ].map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => handleCharacterChange(value)}
              className={`
                p-8 rounded-3xl text-2xl font-bold transition-all duration-300 transform shadow-2xl
                ${
                  settings.character === value
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-700"
                }
              `}
            >
              <div className="mb-2">{label}</div>
              <div
                className={`text-sm font-normal ${
                  settings.character === value
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                {desc}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomPage;
