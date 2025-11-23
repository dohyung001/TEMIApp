import React, { useState } from "react";

import MapQr from "/img/qrs/map_qr.png";
import mapImage from "/img/map.png";
import infoData from "../constants/infoData.js";

// ✅ 지능형 로봇 QR 코드 import
import aiDroneRobotQr from "/img/qrs/ai_drone_robot.png";
import roboShowQr from "/img/qrs/robo_show.png";
import racingRobotQr from "/img/qrs/racing_robot.png";
import billiardRobotQr from "/img/qrs/billiard_robot.png";
import spiderRobotQr from "/img/qrs/spider_robot.png";
import gyroMedicalRobotQr from "/img/qrs/gyro_medical_robot.png";
import cleaningRobotQr from "/img/qrs/cleaning_robot.png";
import humanoidRobotQr from "/img/qrs/humanoid_robot.png";

const InfoIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function MapAndSchedulePage() {
  const [activeView, setActiveView] = useState("map");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const commonButtonStyle =
    "flex text-4xl font-bold items-center justify-center rounded-r-3xl transition-all duration-200";
  const activeButtonStyle = "bg-[#1D4ED8] text-white w-[380px] h-[120px]";
  const inactiveButtonStyle =
    "bg-white text-gray-700 w-[330px] h-[110px] hover:bg-gray-50";

  // ✅ 체험 부스 데이터
  const experienceBooths = [
    {
      id: 1,
      title: "AI 드론·오목 로봇 체험",
      qrImage: aiDroneRobotQr,
      icon: "🤖",
    },
    {
      id: 2,
      title: "ROBO SHOW",
      qrImage: roboShowQr,
      icon: "🎭",
    },
    {
      id: 3,
      title: "경주로봇 만들기",
      qrImage: racingRobotQr,
      icon: "🏎️",
    },
    {
      id: 4,
      title: "로봇 당구 체험",
      qrImage: billiardRobotQr,
      icon: "🎱",
    },
    {
      id: 5,
      title: "스파이더 로봇 만들기",
      qrImage: spiderRobotQr,
      icon: "🕷️",
    },
    {
      id: 6,
      title: "자이로 의료로봇 만들기",
      qrImage: gyroMedicalRobotQr,
      icon: "⚕️",
    },
    {
      id: 7,
      title: "청소로봇 만들기",
      qrImage: cleaningRobotQr,
      icon: "🧹",
    },
    {
      id: 8,
      title: "휴머노이드 로봇 교육",
      qrImage: humanoidRobotQr,
      icon: "🦾",
    },
  ];

  return (
    <>
      {/* 지도 확대 모달 */}
      {isMapModalOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMapModalOpen(false)}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold text-gray-700 hover:bg-gray-100 transition-colors z-10"
              >
                ✕
              </button>

              <img
                src={mapImage}
                alt="행사 지도 확대"
                className="rounded-2xl shadow-2xl max-w-full max-h-[85vh] object-contain"
              />
            </div>
          </div>
        </>
      )}

      {/* 메인 페이지 */}
      <div className="relative overflow-hidden">
        <div className="flex w-full h-full pt-0">
          {/* 1. 사이드바 네비게이션 */}
          <div className="flex-shrink-0">
            <nav className="flex flex-col gap-6">
              <button
                onClick={() => setActiveView("map")}
                className={`${commonButtonStyle} ${
                  activeView === "map" ? activeButtonStyle : inactiveButtonStyle
                }`}
              >
                <span className="mr-4"></span>
                지도
              </button>
              <button
                onClick={() => setActiveView("schedule")}
                className={`${commonButtonStyle} ${
                  activeView === "schedule"
                    ? activeButtonStyle
                    : inactiveButtonStyle
                }`}
              >
                <span className="mr-4"></span>
                경진대회 정보
              </button>
              <button
                onClick={() => setActiveView("experience")}
                className={`${commonButtonStyle} ${
                  activeView === "experience"
                    ? activeButtonStyle
                    : inactiveButtonStyle
                }`}
              >
                <span className="mr-4"></span>
                로봇 체험 부스
              </button>
            </nav>
          </div>

          {/* 2. 메인 컨텐츠 영역 */}
          <main className="flex-grow flex flex-col p-4 mr-32 ml-12 mb-20">
            {/* 2-1. 지도 탭 */}
            {activeView === "map" && (
              <div className="w-full relative">
                <div
                  onClick={() => setIsMapModalOpen(true)}
                  className="cursor-pointer group relative"
                >
                  <img
                    src={mapImage}
                    alt="행사 지도"
                    className="w-full h-full min-w-[900px] rounded-xl transition-all group-hover:brightness-95 group-hover:shadow-xl"
                  />
                </div>

                <div className="absolute -left-48 -bottom-20 flex items-end gap-4">
                  <img
                    src={MapQr}
                    alt="지도 QR 코드"
                    className="w-44 h-44 rounded-xl shadow-lg bg-white p-2"
                  />

                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg mb-2 max-w-[400px]">
                    <div className="flex items-start gap-3">
                      <InfoIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xl font-semibold text-gray-800 mb-1">
                          휴대폰으로 확인하기
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                          QR 코드를 스캔하면 휴대폰으로
                          <br />
                          지도를 확인할 수 있어요!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2-2. 경진대회 정보 탭 */}
            {activeView === "schedule" && (
              <div className="w-full h-[1000px] flex flex-col">
                <div className="grid grid-cols-[1.5fr_2.5fr_6fr] gap-4 text-3xl font-bold text-gray-700 border-b-2 border-gray-300 pb-5 mb-10 shrink-0">
                  <div className="text-center">운영</div>
                  <div className="text-center">컨소시엄명</div>
                  <div className="text-left pl-6">경진대회명</div>
                </div>

                <div className="flex-1 overflow-y-auto pr-3 pb-10 custom-scrollbar min-h-0">
                  <div className="space-y-4">
                    {infoData.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[1.5fr_2.5fr_6fr] gap-4 items-center text-2xl font-medium h-[100px]"
                      >
                        <div className="text-center bg-gray-50 py-5 rounded-2xl shadow-sm truncate px-2 h-full flex items-center justify-center">
                          {item.host}
                        </div>

                        <div className="text-center bg-gray-50 py-5 rounded-2xl shadow-sm truncate px-2 h-full flex items-center justify-center">
                          {item.field}
                        </div>

                        <button className="bg-[#AFC3F9] text-gray-900 px-8 rounded-2xl text-left font-semibold shadow-sm w-full h-full hover:bg-[#9bb3f5] transition-colors flex items-center">
                          {item.title}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ✅ 2-3. 로봇 체험 부스 탭 - 개선된 디자인 */}
            {activeView === "experience" && (
              <div className="w-full h-[1000px] flex flex-col">
                {/* 헤더 */}
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-gray-800 mb-3">
                    🤖 지능형 로봇 체험 부스
                  </h2>
                  <p className="text-2xl text-gray-600">
                    QR 코드를 스캔하고 체험 부스 줄서기를 해보세요!
                  </p>
                </div>

                {/* QR 카드 그리드 - 깔끔한 디자인 */}
                <div className="flex-1 overflow-y-auto pr-3 pb-10 custom-scrollbar min-h-0">
                  <div className="grid grid-cols-4 gap-6">
                    {experienceBooths.map((booth) => (
                      <div
                        key={booth.id}
                        className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-gray-100 flex flex-col items-center"
                      >
                        {/* 아이콘 + 제목 */}
                        <div className="text-center mb-4">
                          <div className="text-5xl mb-3">{booth.icon}</div>
                          <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                            {booth.title}
                          </h3>
                        </div>

                        {/* QR 코드 */}
                        <div className="bg-gray-50 rounded-xl p-3 border-2 border-dashed border-blue-300">
                          <img
                            src={booth.qrImage}
                            alt={`${booth.title} QR`}
                            className="w-36 h-36"
                          />
                        </div>

                        {/* 간단한 안내 텍스트 */}
                        <p className="text-base text-gray-500 mt-4 text-center">
                          QR 스캔으로 줄서기
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
