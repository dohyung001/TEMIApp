import React, { useState } from "react";
// import { HomeIcon } from '@heroicons/react/24/solid'; // 홈 아이콘 제거

// ------------------------------------------------------------------
// ★★★ 지도 이미지 import (수정된 부분) ★★★
// ------------------------------------------------------------------
import mapImage from "/img/map.png";
import infoData from "../constants/infoData.js";

export default function MapAndSchedulePage() {
  // 'schedule' (경진대회 정보) 뷰를 기본값으로 설정 (제공된 이미지 2번 기준)
  const [activeView, setActiveView] = useState("schedule");

  // 사이드바 버튼의 공통/활성/비활성 스타일
  const commonButtonStyle =
    "flex text-4xl font-bold items-center justify-center rounded-r-3xl cursor-pointer transition-all duration-200";
  const activeButtonStyle = "bg-[#1D4ED8] text-white w-[380px] h-[120px]";
  const inactiveButtonStyle =
    "bg-white text-gray-700 w-[330px] h-[110px] hover:bg-gray-50";

  return (
    // 전체 페이지 컨테이너 (배경색, 패딩)
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 메인 레이아웃 (사이드바 + 컨텐츠) */}
      <div className="flex w-full h-full pt-0">
        {/* 1. 사이드바 네비게이션 */}
        <div className="flex-shrink-0 pt-10 pb-10">
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
              {/* NavigationStep2와 시각적 통일을 위해 텍스트 조정 */}
              <span className="mr-4"></span>
              경진대회 정보
            </button>
          </nav>
        </div>

        {/* 2. 메인 컨텐츠 영역 */}
        <main className="flex-grow flex flex-col overflow-hidden min-w-0 p-4 mr-32 ml-12 mt-10 mb-20">
          {/* 2-1. 지도 탭 */}
          {activeView === "map" && (
            <div className="w-full h-600 overflow-auto rounded-xl">
              <img
                src={mapImage}
                alt="행사 지도"
                className="w-full h-full min-w-[800px] rounded-xl"
              />
            </div>
          )}

          {/* 2-2. 경진대회 정보 탭 */}
          {activeView === "schedule" && (
            <div className="w-full h-full flex flex-col">
              {/* 헤더 */}
              <div className="grid grid-cols-[1.5fr_2.5fr_6fr] gap-4 text-3xl font-bold text-gray-800 border-b-2 border-gray-300 py-5 mb-10 shrink-0">
                <div className="text-center">운영</div>
                <div className="text-center">컨소시엄명</div>
                <div className="text-left pl-6">경진대회명</div>
              </div>

              {/* 리스트 (스크롤 영역) */}
              <div className="flex-1 overflow-y-auto pr-3 pb-10 custom-scrollbar">
                <div className="space-y-4">
                  {infoData.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1.5fr_2.5fr_6fr] gap-4 items-center text-2xl font-medium h-[100px]"
                    >
                      {/* 운영 */}
                      <div className="text-center bg-gray-50 py-5 rounded-2xl shadow-sm truncate px-2 h-full flex items-center justify-center">
                        {item.host}
                      </div>

                      {/* 컨소시엄명 */}
                      <div className="text-center bg-gray-50 py-5 rounded-2xl shadow-sm truncate px-2 h-full flex items-center justify-center">
                        {item.field}
                      </div>

                      {/* 경진대회명 버튼 */}
                      <button className="bg-[#AFC3F9] text-gray-900 px-8 rounded-2xl text-left font-semibold shadow-sm truncate w-full h-full hover:bg-[#9bb3f5] transition-colors flex items-center">
                        {item.title}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
