import React, { useState } from 'react';

// --- 1. 아이콘 컴포넌트 (사이즈 대폭 확대 32~40px) ---
const Icons = {
  // Home 아이콘 삭제됨
  BackArrow: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Send: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// --- 2. 데이터 영역 (변경 없음) ---
const questions = [
  {
    id: 1,
    question: '어떤 분야에 관심이 있으신가요?',
    subtitle: '원하는 선택지를 터치해주세요',
    options: [
      { key: '모빌리티', text: '모빌리티', detail: '(자동차, 드론)', color: 'bg-[#E3F2FD]' },
      { key: '헬스', text: '헬스', detail: null, color: 'bg-[#E8EAF6]' },
    ],
  },
  {
    id: 2,
    question: '어떤 분야에 관심이 있으신가요?',
    subtitle: '원하는 선택지를 터치해주세요',
    options: [
      { key: 'AI', text: 'AI', detail: null, color: 'bg-[#E8F5E9]' },
      { key: '반도체', text: '반도체', detail: null, color: 'bg-[#FFFDE7]' },
    ],
  },
  {
    id: 3,
    question: '어떤 분야에 관심이 있으신가요?',
    subtitle: '원하는 선택지를 터치해주세요',
    options: [
      { key: '빅데이터', text: '빅데이터', detail: null, color: 'bg-[#FCE4EC]' },
      { key: '로봇', text: '로봇', detail: null, color: 'bg-[#E0F7FA]' },
    ],
  },
  {
    id: 4,
    question: '어떤 분야에 관심이 있으신가요?',
    subtitle: '원하는 선택지를 터치해주세요',
    options: [
      { key: '에너지 및 환경', text: '에너지 및 환경', detail: null, color: 'bg-[#F1F8E9]' },
      { key: '사물인터넷', text: '사물인터넷', detail: null, color: 'bg-[#FFF3E0]' },
    ],
  },
];

const resultsData = {
  '모빌리티-AI-빅데이터-에너지 및 환경': {
    booths: [
      { id: 1, title: '태양전지 패널', category: '에너지 및 환경 기술', description: '친환경 에너지 시스템에 사용되는 태양전지 패널 체험', image: '/img/e/e-14.jpg', cardColor: 'bg-[#A9D49E]' },
      { id: 2, title: '하늘 위의 드론 위협', category: '정보통신기술(ICT)', description: '정상 비행 중인 드론이 해킹 공격을 받아 오작동하는 순간을 직접 확인하는 체험', image: '/img/e/e-16.jpg', cardColor: 'bg-[#FADD94]' },
      { id: 3, title: 'AWS DeepRacer 자율주행 체험', category: '미래 모빌리티 및 로봇', description: '미래자동차 자율주행 AI VS 인간, 운전 대결 승자는??!!', image: '', cardColor: 'bg-[#C3D1EB]' },
    ],
  },
  '모빌리티-AI-빅데이터-사물인터넷': {
    booths: [
      { id: 4, title: '디지털 숲 명상 오디세이', category: '정보통신기술(ICT)', description: '가상현실의 숲 속에서 정신과 신체의 이완을 돕는 명상 프로그램 체험', image: '/img/i/i-5.jpg', cardColor: 'bg-[#C3D1EB]' },
      { id: 5, title: '블록코딩을 활용한 드론제어', category: '미래 모빌리티 및 로봇', description: '블록코딩을 활용한 드론 실습 및 체험교육', image: '/img/m/m-2.jpg', cardColor: 'bg-[#A9D49E]' },
      { id: 6, title: '스마트 홈 해킹, 누군가 지켜보고 있다.', category: '정보통신기술(ICT)', description: '스마트홈 해킹 시연을 통해 사생활 침해 실체를 확인한다', image: '/img/i/i-10.jpg', cardColor: 'bg-[#FADD94]' },
    ],
  },
  '모빌리티-AI-로봇-에너지 및 환경': {
    booths: [
      { id: 7, title: '수소연료전지자동차', category: '에너지 및 환경 기술', description: '수소연료전지의 원리를 이해하고 미니카를 직접 만들어보는 체험', image: '/img/e/e-5.jpg', cardColor: 'bg-[#A9D49E]' },
      { id: 8, title: '태양전지 자동차경주', category: '에너지 및 환경 기술', description: '충전된 태양전지를 장착한 미니카를 이용한 트랙 경주', image: '/img/e/e-13.jpg', cardColor: 'bg-[#FADD94]' },
      { id: 9, title: '일반인 로봇 교육프로그램5', category: '미래 모빌리티 및 로봇', description: '고성능 소형 휴머노이드의 기본 원리 학습, 로봇축구 및 미션 경기 체험', image: '/img/m/m-7.jpg', cardColor: 'bg-[#C3D1EB]' },
    ],
  },
  '모빌리티-반도체-빅데이터-에너지 및 환경': {
    booths: [
      { id: 10, title: '해킹이 부른 의료 사고', category: '정보통신기술(ICT)', description: '실제 의료기기 해킹 시연으로, 사물인터넷(IoT) 기술로 연결된 의료기기는 치명적 위험을 확인', image: '/img/i/i-17.jpg', cardColor: 'bg-[#FADD94]' },
      { id: 11, title: '일반인 로봇 교육프로그램3', category: '미래 모빌리티 및 로봇', description: '로봇 키트를 활용하여 자이로 외발주행 로봇 만들기', image: '/img/m/m-5.jpg', cardColor: 'bg-[#C3D1EB]' },
      { id: 12, title: '수소자동차 통통', category: '에너지 및 환경 기술', description: '수소자동차 원리를 이해하고 직접 운전해보는 체험 프로그램', image: '/img/e/e-6.jpg', cardColor: 'bg-[#A9D49E]' },
    ],
  },
  '모빌리티-AI-로봇-사물인터넷': {
    booths: [
      { id: 13, title: '탈출하라, 사이버 보안 위기탈출', category: '정보통신기술(ICT)', description: '주변 단서를 수집하여 위협을 탈출하는 방탈출', image: '/img/i/i-15.jpg', cardColor: 'bg-[#FADD94]' },
      { id: 14, title: 'AWS DeepRacer 자율주행 체험', category: '미래 모빌리티 및 로봇', description: '미래자동차 자율주행 AI VS 인간, 운전 대결 승자는??!!', image: '', cardColor: 'bg-[#C3D1EB]' },
      { id: 15, title: '이차전지 컨소시엄', category: '에너지 및 환경 기술', description: '영상, VR 체험을 통해 이차전지를 만들 때 꼭 필요한 공정 과정을 먼저 공간', image: '/img/e/e-11.jpg', cardColor: 'bg-[#A9D49E]' },
    ],
  },
  '모빌리티-반도체-빅데이터-사물인터넷': {
    booths: [
      { id: 16, title: '일반인 로봇 교육프로그램3', category: '미래 모빌리티 및 로봇', description: '로봇 키트를 활용하여 자이로 외발주행 로봇 만들기', image: '/img/m/m-5.jpg', cardColor: 'bg-[#A9D49E]' },
      { id: 17, title: '인공위성 통신 체험관', category: '정보통신기술(ICT)', description: '메타버스 내 관제실에서 인공위성 발사부터 통신까지 과정을 직접 체험', image: '/img/i/i-13.jpg', cardColor: 'bg-[#C3D1EB]' },
      { id: 18, title: 'UAM 조종 시뮬레이터 체험', category: '미래 모빌리티 및 로봇', description: 'UAM 조종법 교육 및 시뮬레이터 탑승 조종 체험', image: '/img/m/m-11.jpg', cardColor: 'bg-[#FADD94]' },
    ],
  },
  '모빌리티-반도체-로봇-에너지 및 환경': {
    booths: [
      { id: 19, title: '반도체를 분해해보자', category: '첨단 제조 및 소재', description: '반도체를 만드는 장비 내부를 보고, 듣고, 조립해보는 VR 체험', image: '/img/a/a-8.jpg', cardColor: 'bg-[#C3D1EB]' },
      { id: 20, title: '태양전지 자동차경주', category: '에너지 및 환경 기술', description: '충전된 태양전지를 장착한 미니카를 이용한 트랙 경주', image: '/img/e/e-13.jpg', cardColor: 'bg-[#FADD94]' },
      { id: 21, title: '압전 에너지', category: '에너지 및 환경 기술', description: '발판 위를 누르면 전력이 생산되어 전광판을 보여주는 압전에너지 체험물', image: '/img/e/e-7.jpg', cardColor: 'bg-[#A9D49E]' },
    ],
  },
  '모빌리티-반도체-로봇-사물인터넷': {
    booths: [
      { id: 22, title: 'AWS DeepRacer 자율주행 체험', category: '미래 모빌리티 및 로봇', description: '미래자동차 자율주행 AI VS 인간, 운전 대결 승자는??!!', image: '', cardColor: 'bg-[#C3D1EB]' },
      { id: 23, title: '어서와, 반도체 회로제작은 처음이지?', category: '첨단 제조 및 소재', description: '반도체 관련 간단 이론 설명 및 반도체 회로제작', image: '/img/a/a-1.jpg', cardColor: 'bg-[#A9D49E]' },
      { id: 24, title: '친절한 로봇의 반란', category: '정보통신기술(ICT)', description: '해커가 손에 넣었을 때, 로봇 해킹의 실체를 보다', image: '/img/i/i-14.jpg', cardColor: 'bg-[#FADD94]' },
    ],
  },
  '헬스-AI-빅데이터-에너지 및 환경': {
    booths: [
      { id: 25, title: 'AI 드로잉 로봇 및 오목 로봇 체험', category: 'AI', description: 'AI 드로잉 로봇 및 오목 로봇을 직접 구동하여 경기를 체험', image: '/img/m/m-8.jpg', cardColor: 'bg-[#C3D1EB]' },
      { id: 26, title: '왕자님, 공주님을 찾아라!', category: '정보통신기술(ICT)', description: '이상형과 관련된 단어만 골라 핵심만 모아 신문을 자동완성!', image: '', cardColor: 'bg-[#FADD94]' },
      { id: 27, title: 'Scent Memory', category: '정보통신기술(ICT)', description: '빅데이터 프로그램의 향수 칵테일 추천', image: '', cardColor: 'bg-[#A9D49E]' },
    ],
  },
  '헬스-AI-빅데이터-사물인터넷': {
    booths: [
      { id: 28, title: "방탈출 프로그램 '교수님의 수상한 과제'", category: '정보통신기술(ICT)', description: "'여의도 6대 과제' 속 함정 위기를 직접 해결하는 방탈출", image: '/img/e/e-2.jpg', cardColor: 'bg-[#FADD94]' },
      { id: 29, title: '실감 팡팡 채팅존', category: 'AI', description: '실감미디어 학생들의 특장점을 살린 몰입감 있는 우수작품을 직접 체험', image: '/img/i/i-11.jpg', cardColor: 'bg-[#C3D1EB]' },
      { id: 30, title: '탈출하라, 사이버 보안 위기탈출', category: '정보통신기술(ICT)', description: '주변 단서를 수집하여 위협을 탈출하는 방탈출', image: '/img/i/i-15.jpg', cardColor: 'bg-[#A9D49E]' },
    ],
  },
  '헬스-AI-로봇-에너지 및 환경': {
    booths: [
      { id: 31, title: 'LED로 그리는 탄소중립', category: '에너지 및 환경 기술', description: '탄소배출권 증명 나의 LED 아트워크 조명 만들기', image: '/img/e/e-16.jpg', cardColor: 'bg-[#A9D49E]' },
      { id: 32, title: '태양광 로봇 강아지 로봇', category: 'AI', description: '태양광으로 전지만 실험 및 강아지 로봇을 통한 친환경 에너지로 체험', image: '/img/e/e-12.jpg', cardColor: 'bg-[#FADD94]' },
      { id: 33, title: '기술로 되찾는 움직임, 로봇이 전하는 회복의 미래', category: '미래 모빌리티 및 로봇', description: '로봇 재활기기를 착용, 체험하며 보행 원리와 기술적 변화를 이해', image: '/img/b/b-4.jpg', cardColor: 'bg-[#C3D1EB]' },
    ],
  },
  '헬스-AI-로봇-사물인터넷': {
    booths: [
      { id: 34, title: '친절한 로봇의 반란', category: '정보통신기술(ICT)', description: '해커가 손에 넣었을 때, 로봇 해킹의 실체를 보다', image: '/img/i/i-14.jpg', cardColor: 'bg-[#FADD94]' },
      { id: 35, title: '이동의 경계를 넘어, 게임으로 확장된 세상', category: 'AI', description: '휠체어 사용자와 일반 사용자가 직접 참여하는 주체적 게임 플레이', image: '/img/b/b-3.jpg', cardColor: 'bg-[#C3D1EB]' },
      { id: 36, title: 'AI 캐리커쳐', category: '정보통신기술(ICT)', description: '입금 후 촬영버튼만 원하는 캐리커쳐(10종) 자동 그림', image: '/img/i/i-23.jpg', cardColor: 'bg-[#A9D49E]' },
    ],
  },
  '헬스-반도체-빅데이터-에너지 및 환경': {
    booths: [
      { id: 37, title: '이동의 경계를 넘어, 게임으로 확장된 세상', category: 'AI', description: '휠체어 사용자와 일반 사용자가 직접 참여하는 주체적 게임 플레이', image: '/img/b/b-3.jpg', cardColor: 'bg-[#C3D1EB]' },
      { id: 38, title: '플러스에너지빌딩', category: '에너지 및 환경 기술', description: '건물 자체 내에서 신에너지, 고효율 설비를 적용하는 기술 체험', image: '/img/e/e-15.jpg', cardColor: 'bg-[#A9D49E]' },
      { id: 39, title: '업사이클링 카드지갑', category: '에너지 및 환경 기술', description: '친환경 소재로 만들어보는 나만의 카드지갑', image: '/img/e/e-8.jpg', cardColor: 'bg-[#FADD94]' },
    ],
  },
  '헬스-반도체-빅데이터-사물인터넷': {
    booths: [
      { id: 40, title: '기술로 되찾는 움직임, 로봇이 전하는 회복의 미래', category: '미래 모빌리티 및 로봇', description: '로봇 재활기기를 착용, 체험하며 보행 원리와 기술적 변화를 이해', image: '/img/b/b-4.jpg', cardColor: 'bg-[#C3D1EB]' },
      { id: 41, title: '보조배터리 제작 체험', category: '첨단 제조 및 소재', description: '배터리 조립 키트를 활용한 배터리 제작 체험 (사전 신청 및 현장 접수)', image: '/img/e/e-18.jpg', cardColor: 'bg-[#A9D49E]' },
      { id: 42, title: '메타버스 캠퍼스 체험', category: '정보통신기술(ICT)', description: 'AICOSS 메타버스 캠퍼스 체험', image: '/img/i/i-6.jpg', cardColor: 'bg-[#FADD94]' },
    ],
  },
  '헬스-반도체-로봇-에너지 및 환경': {
    booths: [
      { id: 43, title: '피부 위의 예술, 인체 속의 과학', category: 'AI', description: '바디페인팅 체험과 아나토마지 테이블을 통한 인체 구조 탐구', image: '/img/b/b-1.jpg', cardColor: 'bg-[#FADD94]' },
      { id: 44, title: '첨단소재워터팜: 모어가의 비밀', category: '첨단 제조 및 소재', description: '오염수가 식물성장 및 수질정화를 통해 친환경 첨단소재를 체험', image: '/img/a/a-9.jpg', cardColor: 'bg-[#A9D49E]' },
      { id: 45, title: 'Space Green 우주 농부 인증 미션', category: 'AI', description: '우주 수직농장에서 미션을 수행하고 우주 농부 인증서를 받아보세요.', image: '/img/e/e-17.jpg', cardColor: 'bg-[#C3D1EB]' },
    ],
  },
  '헬스-반도체-로봇-사물인터넷': {
    booths: [
      { id: 46, title: '일반인 로봇 교육프로그램1', category: '미래 모빌리티 및 로봇', description: '로봇 키트를 활용하여 경주 로봇을 만드는 프로그램', image: '/img/m/m-3.jpg', cardColor: 'bg-[#A9D49E]' },
      { id: 47, title: '차세대 디스플레이 공정 XR 체험', category: '첨단 제조 및 소재', description: '차세대 디스플레이 FAB에서 실제 공정 체험', image: '', cardColor: 'bg-[#C3D1EB]' },
      { id: 48, title: '키네틱LED Interactive', category: '정보통신기술(ICT)', description: '키네틱LED의 실시간 동작 감지를 이용한 게임 체험', image: '', cardColor: 'bg-[#FADD94]' },
    ],
  },
};


// --- 3. 컴포넌트 영역 ---

// 부스 카드 컴포넌트 (폰트 Large)
const BoothCard = ({ booth }) => {
  const cardBgColor = booth.cardColor || 'bg-white';
  const textColor = 'text-gray-800';

  return (
    <div className={`${cardBgColor} rounded-3xl shadow-xl overflow-hidden w-full max-w-[420px] flex flex-col transform hover:scale-105 transition-transform duration-300`}>
      <div className="m-6 mb-0 rounded-2xl overflow-hidden bg-white/50 relative h-60 flex-shrink-0">
        {booth.image ? (
          <img src={booth.image} alt={booth.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl bg-white">
            이미지 준비중입니다
          </div>
        )}
      </div>
      
      <div className="p-8 flex flex-col flex-grow items-center text-center">
        {/* 카드 제목: 2xl -> 4xl */}
        <h3 className={`text-4xl font-extrabold ${textColor} mb-2 leading-tight break-keep`}>{booth.title}</h3>
        {/* 카테고리: sm -> xl */}
        <p className="text-xl font-bold text-gray-600 mb-5">{booth.category}</p>
        {/* 설명: base -> xl */}
        <p className={`text-xl ${textColor} opacity-80 mb-10 line-clamp-3 break-keep leading-relaxed`}>{booth.description}</p>
        
        <div className="mt-auto w-full">
          {/* 버튼: lg -> 2xl */}
          <button className="w-full bg-[#2563eb] text-white py-5 px-6 rounded-2xl font-bold text-2xl hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-md">
            <Icons.Send />
            길안내 받기
          </button>
        </div>
      </div>
    </div>
  );
};

// 메인 추천 컴포넌트
const BoothRecommender = () => {
  const [step, setStep] = useState(0); 
  const [answers, setAnswers] = useState([]);

  const totalQuestions = questions.length;

  const handleStart = () => { setStep(1); setAnswers([]); };
  const handleReset = () => { setStep(0); setAnswers([]); };

  const handleAnswer = (answerKey) => {
    const newAnswers = [...answers, answerKey];
    setAnswers(newAnswers);
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  // 1. 시작 화면 (폰트 Very Large)
  const renderStartScreen = () => (
    <div className="text-center flex flex-col items-center animate-fade-in w-full max-w-6xl">
      <div className="flex items-center justify-center mb-12 gap-10">
        <span className="text-8xl font-bold text-gray-400 opacity-60">?</span>
        {/* VS: 6xl -> 8xl */}
        <span className="text-[#3b82f6] font-black text-8xl italic">vs</span>
        <span className="text-8xl font-bold text-gray-400 opacity-60">?</span>
      </div>
      
      {/* 제목: 5xl -> 7xl */}
      <h1 className="text-7xl font-extrabold text-[#1e293b] mb-6 tracking-tight">부스 추천 받기</h1>
      {/* 설명: xl -> 3xl */}
      <p className="text-3xl text-gray-500 mb-20 font-medium leading-relaxed">
        본인 취향에 맞는 부스를 <br className="md:hidden"/>
        <span className="text-[#3b82f6] font-bold">양자택일</span> 게임을 통해 추천해드려요
      </p>
      
      <div className="w-16 h-2 bg-blue-100 rounded-full mb-20"></div>

      {/* 시작 버튼: xl -> 3xl */}
      <button
        onClick={handleStart}
        className="bg-[#3b82f6] text-white font-bold py-8 px-32 rounded-[2rem] shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_30px_rgba(59,130,246,0.4)] hover:bg-blue-600 transition-all duration-300 text-3xl flex items-center gap-4"
      >
        시작하기 <Icons.ArrowRight />
      </button>
    </div>
  );

  // 2. 질문 화면 (폰트 Very Large + 위로 정렬)
  const renderQuestionScreen = () => {
    const currentQuestion = questions[step - 1];
    const [optionA, optionB] = currentQuestion.options;

    return (
      <div className="w-full max-w-[1400px] text-center flex flex-col items-center relative">
        {/* 질문: 4xl/5xl -> 7xl */}
        <h2 className="text-6xl md:text-7xl font-extrabold text-[#1e293b] mb-4 tracking-tight">{currentQuestion.question}</h2>
        {/* 서브타이틀: xl -> 3xl */}
        <p className="text-3xl text-gray-400 font-medium mb-20">{currentQuestion.subtitle}</p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 w-full mb-24 relative">
          {/* 선택지 A - 카드 크기 확대 */}
          <button
            onClick={() => handleAnswer(optionA.key)}
            className={`${optionA.color} w-full md:w-[500px] h-[400px] rounded-[3rem] shadow-sm flex flex-col items-center justify-center p-10 hover:shadow-2xl hover:scale-105 transition-all duration-300 group`}
          >
            {/* 선택지 텍스트: 5xl -> 7xl */}
            <span className="text-7xl font-extrabold text-[#1e293b] group-hover:text-blue-900 transition-colors break-keep leading-tight">{optionA.text}</span>
            {/* 상세 텍스트: 2xl -> 3xl */}
            {optionA.detail && <span className="text-3xl text-gray-500 mt-6 font-medium">{optionA.detail}</span>}
          </button>

          {/* VS Badge (중앙) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
             <div className="bg-[#7c92e6] w-28 h-20 rounded-[30px] flex items-center justify-center border-[6px] border-[#f8f9fe] shadow-lg">
                <span className="text-white font-black text-4xl italic pr-1 pt-1">VS</span>
             </div>
          </div>

          {/* 선택지 B */}
          <button
            onClick={() => handleAnswer(optionB.key)}
            className={`${optionB.color} w-full md:w-[500px] h-[400px] rounded-[3rem] shadow-sm flex flex-col items-center justify-center p-10 hover:shadow-2xl hover:scale-105 transition-all duration-300 group`}
          >
            <span className="text-7xl font-extrabold text-[#1e293b] group-hover:text-blue-900 transition-colors break-keep leading-tight">{optionB.text}</span>
            {optionB.detail && <span className="text-3xl text-gray-500 mt-6 font-medium">{optionB.detail}</span>}
          </button>
        </div>

        {/* 하단 네비게이션 영역 */}
        <div className="w-full flex justify-between items-center px-10">
           {/* 이전 버튼 */}
           <div className="w-40">
             {step > 1 && (
               <button
                 onClick={handleBack}
                 className="bg-[#3b82f6] text-white pl-6 pr-10 py-5 rounded-full font-bold text-2xl flex items-center hover:bg-blue-700 transition shadow-md w-full justify-center"
               >
                 <div className="mr-2"><Icons.BackArrow /></div>
                 이전
               </button>
             )}
           </div>

           {/* 페이지 인디케이터 */}
           <div className="flex gap-5">
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <div
                key={index}
                className={`w-5 h-5 rounded-full transition-all duration-300 ${index < step ? 'bg-[#3b82f6] scale-110' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>
          
          <div className="w-40"></div>
        </div>
      </div>
    );
  };

  // 3. 결과 화면 (폰트 Very Large)
  const renderResultScreen = () => {
    let resultKey = answers.join('-');
    const result = resultsData[resultKey];

    if (!result || !result.booths) {
      return (
        <div className="text-center flex flex-col items-center justify-center h-[500px]">
            <h2 className="text-4xl font-bold text-gray-800">결과를 찾을 수 없습니다.</h2>
            <p className="text-gray-500 mt-6 text-2xl">선택 조합: {resultKey}</p>
            <button onClick={handleReset} className="mt-10 bg-blue-500 text-white px-10 py-6 rounded-2xl font-bold text-2xl">처음으로</button>
        </div>
      );
    }

    return (
      <div className="w-full max-w-[1600px] text-center flex flex-col items-center animate-fade-in pb-16">
        {/* 결과 제목: 5xl -> 6xl */}
        <h2 className="text-6xl font-extrabold text-[#1e293b] mb-6 tracking-tight">이 부스를 추천드려요!</h2>
        <p className="text-3xl text-gray-500 font-medium mb-20">길 안내를 통해 바로 안내 받을 수 있어요</p>

        <div className="flex flex-wrap justify-center gap-12 w-full">
          {result.booths.map((booth) => (
            <BoothCard key={booth.id} booth={booth} />
          ))}
        </div>
        
        <button onClick={handleReset} className="mt-20 bg-gray-500 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:bg-gray-600 transition">
           처음으로 돌아가기
        </button>
      </div>
    );
  };

  // 메인 렌더링
  return (
    // items-center -> items-start로 변경하고 padding-top(pt-24)을 주어 전체적으로 위로 올림
    <div className="relative bg-[#EBEDF0] min-h-screen flex items-start justify-center pt-24 p-8 font-sans overflow-hidden selection:bg-blue-100">
      
      {/* Home 버튼 삭제됨 */}

      <main className="w-full flex justify-center">
        {step === 0 && renderStartScreen()}
        {step > 0 && step <= totalQuestions && renderQuestionScreen()}
        {step > totalQuestions && renderResultScreen()}
      </main>
    </div>
  );
};

export default BoothRecommender;