import React, { useState } from 'react';
// import { HomeIcon } from '@heroicons/react/24/solid'; // 홈 아이콘 제거

// 사용자가 업로드한 경진대회 정보 테이블 이미지를 import 합니다.
//import scheduleTableImage from '/img/info.png';

// ------------------------------------------------------------------
// ★★★ 지도 이미지 import (수정된 부분) ★★★
// ------------------------------------------------------------------
import mapImage from '/img/map.png';
//import infoData from '../../constants/infoData.js';

const infoData = [
    { id: 1, host: '강원대', field: '데이터보안 활용융합', title: 'COSS 시큐어 코딩 경진대회 2025' },
    { id: 2, host: '강원대', field: '데이터보안 활용융합', title: '2025 해킹 공격 방어 대회 SecureX Challenge' },
    { id: 3, host: '건국대', field: '실감미디어', title: '2025 실감미디어 경진대회' },
    { id: 4, host: '고려대', field: '에너지신사업', title: '에너지신사업 아이디어 경진대회' },
    { id: 5, host: '고려대(세종)', field: '에코업', title: '에코업 ZERO WASTE 혁신기술 아이디어 경진대회' },
    { id: 6, host: '국민대', field: '차세대통신', title: 'NCCOSS(Next-gen Communication COSS) 경진대회' },
    { id: 7, host: '국민대', field: '미래자동차', title: 'AutoRace 2025' },
    { id: 8, host: '국민대', field: '미래자동차', title: 'AutoHack 2025' },
    { id: 9, host: '단국대', field: '바이오헬스', title: '(NEXT-U) 차세대 디스플레이 Championship 2025' },
    { id: 10, host: '상명대', field: '지능형로봇', title: '4족보행 로봇 경진대회' },
    { id: 11, host: '서울과기대', field: '반도체소부장', title: '반도체 웨이퍼 이송 로봇 경진대회' },
    { id: 12, host: '서울대', field: '빅데이터', title: '2025 DATA VENTURE 문제 해결 챌린지' },
    { id: 13, host: '서울대', field: '차세대반도체', title: '2025 COSS 차세대반도체 Microcontroller(MCU) 응용 경진대회' },
    { id: 14, host: '세종대', field: '사물인터넷', title: 'IoT & AI Innovation 챌린지' },
    { id: 15, host: '전남대', field: '인공지능', title: '인공지능 모델 개발 대회 AIM(AI Model) Challenge' },
    { id: 16, host: '중앙대', field: '첨단소재나노융합', title: '적층제조 융합 설계 경진대회: Folding Chair' },
    { id: 17, host: '충남대', field: '그린바이오', title: '2025 그린바이오 공공기술 아이디어 경진대회' },
    { id: 18, host: '충북대', field: '이차전지', title: '2025 COSS BATTERY CHAMPIONSHIP (이차전지 설계 및 제작 경진대회)' },
    { id: 19, host: '한국항공대', field: '항공드론', title: '드론 3종 챔피언 올림픽 경진대회' },
    { id: 20, host: '한양대ERICA', field: '지능형로봇', title: '2025 SHARE Challenge' },
];

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

                    {/* 2-2. '경진대회 정보' 탭 선택 시 (테이블 리스트로 변경) */}
                    {activeView === 'schedule' && (
                        <div className="w-full h-full flex flex-col">
                            {/* 헤더 (고정) */}
                            <div className="grid grid-cols-[120px_150px_1fr] text-3xl font-bold text-gray-800 border-b-2 border-gray-300 py-3 mb-2 flex-shrink-0">
                                <div className="text-center">운영</div>
                                <div className="text-center">컨소시엄명</div>
                                <div className="text-left pl-6">경진대회명</div>
                            </div>

                            {/* 리스트 (스크롤 영역) */}
                            <div className="flex-1 overflow-y-auto pr-2"> {/* pr-2는 스크롤바와 컨텐츠 사이의 간격 */}
                                <div className="space-y-2">
                                    {infoData.map((item) => (
                                        <div
                                            key={item.id}
                                            className="grid grid-cols-[120px_150px_1fr] items-center text-2xl font-medium"
                                        >
                                            <div className="text-center py-3 bg-gray-50 rounded-l-lg">{item.host}</div>
                                            <div className="text-center py-3">{item.field}</div>
                                            <button
                                                className="bg-indigo-100/70 text-gray-800 hover:bg-indigo-200/90 py-3 px-6 rounded-r-lg font-semibold text-left transition-colors duration-150 shadow-sm"
                                                onClick={() => console.log(`경진대회 클릭: ${item.title}`)}
                                            >
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