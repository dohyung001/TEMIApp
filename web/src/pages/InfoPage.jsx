import React, { useState } from 'react';
// import { HomeIcon } from '@heroicons/react/24/solid'; // 홈 아이콘 제거

// 사용자가 업로드한 경진대회 정보 테이블 이미지를 import 합니다.
import scheduleTableImage from '/img/info.png';

// ------------------------------------------------------------------
// ★★★ 지도 이미지 import (수정된 부분) ★★★
// ------------------------------------------------------------------
import mapImage from '/img/map.png';


export default function MapAndSchedulePage() {
    // 'schedule' (경진대회 정보) 뷰를 기본값으로 설정 (제공된 이미지 2번 기준)
    const [activeView, setActiveView] = useState('schedule');

    // 사이드바 버튼의 공통/활성/비활성 스타일
    const commonButtonStyle = "flex text-4xl font-bold items-center justify-center rounded-r-3xl cursor-pointer transition-all duration-200";
    const activeButtonStyle = "bg-[#1D4ED8] text-white w-[380px] h-[120px]";
    const inactiveButtonStyle = "bg-white text-gray-700 w-[330px] h-[110px] hover:bg-gray-50";

    return (
        // 전체 페이지 컨테이너 (배경색, 패딩)
        <div className="relative w-screen h-screen overflow-hidden">

            {/* 메인 레이아웃 (사이드바 + 컨텐츠) */}
            <div className="flex w-full h-full pt-0">

                {/* 1. 사이드바 네비게이션 */}
                <div className="flex-shrink-0 pt-10 pb-10">

                    <nav className="flex flex-col gap-9">
                        <button
                            onClick={() => setActiveView('map')}
                            className={`${commonButtonStyle} ${activeView === 'map' ? activeButtonStyle : inactiveButtonStyle}`}
                        >
                            <span className="mr-4"></span> 
                            지도
                        </button>
                        <button
                            onClick={() => setActiveView('schedule')}
                            className={`${commonButtonStyle} ${activeView === 'schedule' ? activeButtonStyle : inactiveButtonStyle}`}
                        >
                            {/* NavigationStep2와 시각적 통일을 위해 텍스트 조정 */}
                            <span className="mr-4"></span> 
                            경진대회 정보
                        </button>
                    </nav>
                </div>

                {/* 2. 메인 컨텐츠 영역 */}
                {/* 지도와 스케줄 모두 스크롤이 필요하므로 p-0으로 설정하고 overflow-auto 유지 */}
                <main
                    className="flex-grow ml-20 bg-white rounded-2xl shadow-lg overflow-hidden p-10"
                >
                    {/* ---------------------------------------------------- */}
                    {/* ★★★ 2-1. '지도' 탭 선택 시 (수정된 부분) ★★★ */}
                    {/* ---------------------------------------------------- */}
                    {activeView === 'map' && (
                        // 컨텐츠 카드 내에서 이미지가 스크롤되도록 설정
                        <div className="w-full h-full overflow-auto">
                            <img
                                src={mapImage}
                                alt="행사 지도"
                                // 이미지 원본 크기가 크므로 가로 스크롤을 위해 최소 너비를 줌
                                className="w-full h-auto min-w-[1500px]"
                            />
                        </div>
                    )}

                    {/* 2-2. '경진대회 정보' 탭 선택 시 (테이블 이미지) */}
                    {activeView === 'schedule' && (
                        // 컨텐츠 카드 내에서 이미지가 스크롤되도록 설정
                        <div className="w-full h-full overflow-auto">
                            <img
                                src={scheduleTableImage}
                                alt="경진대회 정보"
                                // 이미지가 찌그러지지 않고 원본 비율을 유지하며,
                                // 내용이 많으므로 가로 스크롤이 가능하도록 최소 너비를 줌
                                className="w-full h-auto min-w-[1000px]"
                            />
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
}