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
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("temiCustomSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSpeedChange = (speed) => {
    setSettings((prev) => ({ ...prev, speed }));
  };

  const handleVoiceChange = (voice) => {
    setSettings((prev) => ({ ...prev, voice }));
  };

  const handleCharacterChange = (character) => {
    setSettings((prev) => ({ ...prev, character }));
  };

  // 적용 버튼 클릭 시 메시지만 수정
  const applySettings = async () => {
    setIsApplying(true);

    try {
      localStorage.setItem("temiCustomSettings", JSON.stringify(settings));

      if (TemiBridge.isNativeAvailable()) {
        TemiBridge.setCustomization(settings);
      }

      // 캐릭터별 인사 메시지
      const testMessages = {
        theme1: "프로페셔널 모드로 설정되었습니다. 정중하게 모시겠습니다.",
        theme2: "친근한 모드로 설정되었습니다. 편하게 대화해요!",
        theme3: "귀여운 모드로 설정되었습니다. 만나서 반가워요!",
      };

      TemiBridge.speak(testMessages[settings.character]);
      TemiBridge.showToast("캐릭터가 적용되었습니다!");
    } catch (error) {
      console.error("설정 적용 실패:", error);
      TemiBridge.showToast("설정 적용에 실패했습니다.");
    } finally {
      setIsApplying(false);
    }
  };

  const resetSettings = () => {
    const defaultSettings = {
      speed: "normal",
      voice: "soft",
      character: "theme1",
    };
    setSettings(defaultSettings);
    localStorage.removeItem("temiCustomSettings");
    TemiBridge.showToast("설정이 초기화되었습니다.");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-10">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={goBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-4xl font-bold text-gray-800">
            테미 커스터마이징 하기
          </h1>
          <div className="w-8" /> {/* 균형을 위한 공간 */}
        </div>

        {/* 속도 설정 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">속도</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "slow", label: "느리게", emoji: "🐢" },
              { value: "normal", label: "보통", emoji: "🚶" },
              { value: "fast", label: "빠르게", emoji: "🏃" },
            ].map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => handleSpeedChange(value)}
                className={`
                  p-6 rounded-2xl text-xl font-semibold transition-all duration-300 transform
                  ${
                    settings.speed === value
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                  }
                `}
              >
                <div className="text-4xl mb-2">{emoji}</div>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 목소리 설정 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">목소리</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "low", label: "낮은 톤", emoji: "🎸" },
              { value: "high", label: "높은 톤", emoji: "🎵" },
              { value: "soft", label: "부드러운 톤", emoji: "🎼" },
            ].map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => handleVoiceChange(value)}
                className={`
                  p-6 rounded-2xl text-xl font-semibold transition-all duration-300 transform
                  ${
                    settings.voice === value
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                  }
                `}
              >
                <div className="text-4xl mb-2">{emoji}</div>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 캐릭터 설정 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">캐릭터</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                value: "theme1",
                label: "프로페셔널",
                emoji: "🤖",
                desc: "정중하고 전문적이에요",
              },
              {
                value: "theme2",
                label: "친근한",
                emoji: "🎨",
                desc: "친구같이 편안해요",
              },
              {
                value: "theme3",
                label: "귀여운",
                emoji: "✨",
                desc: "사랑스럽고 발랄해요",
              },
            ].map(({ value, label, emoji, desc }) => (
              <button
                key={value}
                onClick={() => handleCharacterChange(value)}
                className={`
                  p-6 rounded-2xl transition-all duration-300 transform text-center
                  ${
                    settings.character === value
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-2xl scale-105"
                      : "bg-gray-50 hover:bg-gray-100 hover:scale-102 border-2 border-gray-200"
                  }
                `}
              >
                <div className="text-6xl mb-3">{emoji}</div>
                <div className="text-xl font-bold mb-2">{label}</div>
                <div
                  className={`text-sm ${
                    settings.character === value
                      ? "text-purple-100"
                      : "text-gray-500"
                  }`}
                >
                  {desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 미리보기 */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl">
          <p className="text-center text-lg font-semibold text-purple-800">
            현재 설정:{" "}
            <span className="text-indigo-600">
              {settings.speed === "slow"
                ? "느린"
                : settings.speed === "normal"
                ? "보통"
                : "빠른"}{" "}
              속도
            </span>{" "}
            +{" "}
            <span className="text-indigo-600">
              {settings.voice === "low"
                ? "낮은"
                : settings.voice === "high"
                ? "높은"
                : "부드러운"}{" "}
              목소리
            </span>{" "}
            +{" "}
            <span className="text-indigo-600">
              {settings.character === "theme1"
                ? "프로페셔널"
                : settings.character === "theme2"
                ? "친근한"
                : "귀여운"}{" "}
              테마
            </span>
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={resetSettings}
            disabled={isApplying}
            className="flex-1 py-5 px-8 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          >
            초기화
          </button>
          <button
            onClick={applySettings}
            disabled={isApplying}
            className="flex-1 py-5 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-xl"
          >
            {isApplying ? "적용 중..." : "적용하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPage;
