// web/src/pages/TestPage.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TestPage() {
  const navigate = useNavigate();
  const [screenInfo, setScreenInfo] = useState({});

  useEffect(() => {
    const updateInfo = () => {
      setScreenInfo({
        // Window 크기
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,

        // Screen 크기
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,

        // Available 크기 (툴바 제외)
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,

        // Device Pixel Ratio
        devicePixelRatio: window.devicePixelRatio,

        // 실제 물리적 해상도
        physicalWidth: Math.round(
          window.screen.width * window.devicePixelRatio
        ),
        physicalHeight: Math.round(
          window.screen.height * window.devicePixelRatio
        ),

        // Orientation
        orientation: window.screen.orientation?.type || "unknown",

        // User Agent
        userAgent: navigator.userAgent,
      });
    };

    updateInfo();
    window.addEventListener("resize", updateInfo);
    window.addEventListener("orientationchange", updateInfo);

    return () => {
      window.removeEventListener("resize", updateInfo);
      window.removeEventListener("orientationchange", updateInfo);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/")}
          className="px-8 py-4 bg-white hover:bg-gray-100 rounded-2xl shadow-lg text-2xl font-bold text-gray-700 transition-all"
        >
          ← 홈으로
        </button>
        <h1 className="text-5xl font-bold text-indigo-900">
          📱 화면 해상도 테스트
        </h1>
        <div className="w-32"></div>
      </div>

      {/* 메인 정보 카드 */}
      <div className="max-w-6xl mx-auto">
        {/* 큰 해상도 표시 */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 text-center">
          <h2 className="text-3xl font-semibold text-gray-600 mb-6">
            현재 화면 해상도
          </h2>
          <div className="text-9xl font-bold text-indigo-600 mb-4">
            {screenInfo.windowWidth} × {screenInfo.windowHeight}
          </div>
          <p className="text-3xl text-gray-500">(Window Inner Size)</p>
        </div>

        {/* 상세 정보 그리드 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Screen Size */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              🖥️ Screen Size
            </h3>
            <div className="space-y-3">
              <InfoRow label="Width" value={screenInfo.screenWidth} />
              <InfoRow label="Height" value={screenInfo.screenHeight} />
            </div>
          </div>

          {/* Available Size */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              📐 Available Size
            </h3>
            <div className="space-y-3">
              <InfoRow label="Width" value={screenInfo.availWidth} />
              <InfoRow label="Height" value={screenInfo.availHeight} />
            </div>
          </div>

          {/* Physical Resolution */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              💎 Physical Resolution
            </h3>
            <div className="space-y-3">
              <InfoRow label="Width" value={screenInfo.physicalWidth} />
              <InfoRow label="Height" value={screenInfo.physicalHeight} />
              <InfoRow label="DPR" value={screenInfo.devicePixelRatio} />
            </div>
          </div>

          {/* Other Info */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              ℹ️ Other Info
            </h3>
            <div className="space-y-3">
              <InfoRow label="Orientation" value={screenInfo.orientation} />
              <InfoRow
                label="Aspect Ratio"
                value={`${(
                  screenInfo.windowWidth / screenInfo.windowHeight
                ).toFixed(2)} : 1`}
              />
            </div>
          </div>
        </div>

        {/* 비교 테이블 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-3xl font-bold text-gray-700 mb-6 text-center">
            📊 예상 해상도 비교
          </h3>
          <table className="w-full text-2xl">
            <thead>
              <tr className="bg-indigo-100">
                <th className="py-4 px-6 text-left">해상도</th>
                <th className="py-4 px-6 text-center">매칭 여부</th>
                <th className="py-4 px-6 text-right">차이</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow
                resolution="1920 × 1200"
                current={`${screenInfo.windowWidth} × ${screenInfo.windowHeight}`}
              />
              <ComparisonRow
                resolution="1280 × 800"
                current={`${screenInfo.windowWidth} × ${screenInfo.windowHeight}`}
              />
              <ComparisonRow
                resolution="1920 × 1080"
                current={`${screenInfo.windowWidth} × ${screenInfo.windowHeight}`}
              />
              <ComparisonRow
                resolution="1280 × 720"
                current={`${screenInfo.windowWidth} × ${screenInfo.windowHeight}`}
              />
            </tbody>
          </table>
        </div>

        {/* User Agent */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            🔍 User Agent
          </h3>
          <p className="text-lg text-gray-600 break-all font-mono">
            {screenInfo.userAgent}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200">
      <span className="text-xl text-gray-600 font-medium">{label}:</span>
      <span className="text-2xl font-bold text-indigo-600">{value}</span>
    </div>
  );
}

function ComparisonRow({ resolution, current }) {
  const [width, height] = resolution.split(" × ").map(Number);
  const [currentW, currentH] = current.split(" × ").map(Number);

  const isMatch = width === currentW && height === currentH;
  const diff = Math.abs(width - currentW + (height - currentH));

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-4 px-6 font-semibold">{resolution}</td>
      <td className="py-4 px-6 text-center">
        {isMatch ? (
          <span className="text-4xl">✅</span>
        ) : (
          <span className="text-4xl">❌</span>
        )}
      </td>
      <td className="py-4 px-6 text-right text-gray-600">
        {isMatch ? (
          <span className="text-green-600 font-bold">정확히 일치!</span>
        ) : (
          `±${diff}px`
        )}
      </td>
    </tr>
  );
}
