import React, { useState, useEffect } from "react";
import { TemiBridge } from "../services/temiBridge";
import AngleButton from "../components/AngleButton";
import RightArrowIcon from "../assets/icons/right_arrow.svg?react";
import VsIcon from "../assets/icons/vs.svg?react";
import QuestionIcon from "../assets/icons/question.svg?react";
import VsIcon2 from "../assets/icons/vs2.svg?react";
import LineIcon from "../assets/icons/line.svg?react";

// ✅ constants import
import advancedBoothData from "../constants/advancedBoothData";
import bioHealthBoothData from "../constants/bioHealthBoothData";
import energyBoothData from "../constants/energyBoothData";
import ictBoothData from "../constants/ictBoothData";
import mobilityBoothData from "../constants/mobilityBoothData";

const Icons = {
  BackArrow: () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Send: () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 2L11 13"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const questions = [
  {
    id: 1,
    question: "어떤 분야에 관심이 있으신가요?",
    subtitle: "원하는 선택지를 터치해주세요",
    options: [
      {
        key: "모빌리티",
        text: "모빌리티",
        detail: "(자동차, 드론)",
        color: "bg-[#E3F2FD]",
      },
      { key: "헬스", text: "헬스", detail: null, color: "bg-[#E8EAF6]" },
    ],
  },
  {
    id: 2,
    question: "어떤 분야에 관심이 있으신가요?",
    subtitle: "원하는 선택지를 터치해주세요",
    options: [
      { key: "AI", text: "AI", detail: null, color: "bg-[#E8F5E9]" },
      { key: "반도체", text: "반도체", detail: null, color: "bg-[#FFFDE7]" },
    ],
  },
  {
    id: 3,
    question: "어떤 분야에 관심이 있으신가요?",
    subtitle: "원하는 선택지를 터치해주세요",
    options: [
      {
        key: "빅데이터",
        text: "빅데이터",
        detail: null,
        color: "bg-[#FCE4EC]",
      },
      { key: "로봇", text: "로봇", detail: null, color: "bg-[#E0F7FA]" },
    ],
  },
  {
    id: 4,
    question: "어떤 분야에 관심이 있으신가요?",
    subtitle: "원하는 선택지를 터치해주세요",
    options: [
      {
        key: "에너지 및 환경",
        text: "에너지 및 환경",
        detail: null,
        color: "bg-[#F1F8E9]",
      },
      {
        key: "사물인터넷",
        text: "사물인터넷",
        detail: null,
        color: "bg-[#FFF3E0]",
      },
    ],
  },
];

const resultsData = {
  "모빌리티-AI-빅데이터-에너지 및 환경": {
    boothIds: ["e-14", "i-16", "m-9"],
    cardColors: ["bg-[#A9D49E]", "bg-[#FADD94]", "bg-[#C3D1EB]"],
  },
  "모빌리티-AI-빅데이터-사물인터넷": {
    boothIds: ["i-5", "m-2", "i-10"],
    cardColors: ["bg-[#C3D1EB]", "bg-[#A9D49E]", "bg-[#FADD94]"],
  },
  "모빌리티-AI-로봇-에너지 및 환경": {
    boothIds: ["e-5", "e-13", "m-7"],
    cardColors: ["bg-[#A9D49E]", "bg-[#FADD94]", "bg-[#C3D1EB]"],
  },
  "모빌리티-반도체-빅데이터-에너지 및 환경": {
    boothIds: ["i-17", "m-5", "e-6"],
    cardColors: ["bg-[#FADD94]", "bg-[#C3D1EB]", "bg-[#A9D49E]"],
  },
  "모빌리티-AI-로봇-사물인터넷": {
    boothIds: ["i-15", "m-9", "e-11"],
    cardColors: ["bg-[#FADD94]", "bg-[#C3D1EB]", "bg-[#A9D49E]"],
  },
  "모빌리티-반도체-빅데이터-사물인터넷": {
    boothIds: ["m-5", "i-13", "m-11"],
    cardColors: ["bg-[#A9D49E]", "bg-[#C3D1EB]", "bg-[#FADD94]"],
  },
  "모빌리티-반도체-로봇-에너지 및 환경": {
    boothIds: ["a-8", "e-13", "e-7"],
    cardColors: ["bg-[#C3D1EB]", "bg-[#FADD94]", "bg-[#A9D49E]"],
  },
  "모빌리티-반도체-로봇-사물인터넷": {
    boothIds: ["m-9", "a-1", "i-14"],
    cardColors: ["bg-[#C3D1EB]", "bg-[#A9D49E]", "bg-[#FADD94]"],
  },
  "헬스-AI-빅데이터-에너지 및 환경": {
    boothIds: ["m-8", "i-12", "i-22"],
    cardColors: ["bg-[#C3D1EB]", "bg-[#FADD94]", "bg-[#A9D49E]"],
  },
  "헬스-AI-빅데이터-사물인터넷": {
    boothIds: ["e-2", "i-11", "i-15"],
    cardColors: ["bg-[#FADD94]", "bg-[#C3D1EB]", "bg-[#A9D49E]"],
  },
  "헬스-AI-로봇-에너지 및 환경": {
    boothIds: ["e-16", "e-12", "b-4"],
    cardColors: ["bg-[#A9D49E]", "bg-[#FADD94]", "bg-[#C3D1EB]"],
  },
  "헬스-AI-로봇-사물인터넷": {
    boothIds: ["i-14", "b-3", "i-21"],
    cardColors: ["bg-[#FADD94]", "bg-[#C3D1EB]", "bg-[#A9D49E]"],
  },
  "헬스-반도체-빅데이터-에너지 및 환경": {
    boothIds: ["b-3", "e-15", "e-8"],
    cardColors: ["bg-[#C3D1EB]", "bg-[#A9D49E]", "bg-[#FADD94]"],
  },
  "헬스-반도체-빅데이터-사물인터넷": {
    boothIds: ["b-4", "e-18", "i-6"],
    cardColors: ["bg-[#C3D1EB]", "bg-[#A9D49E]", "bg-[#FADD94]"],
  },
  "헬스-반도체-로봇-에너지 및 환경": {
    boothIds: ["b-1", "a-9", "e-17"],
    cardColors: ["bg-[#FADD94]", "bg-[#A9D49E]", "bg-[#C3D1EB]"],
  },
  "헬스-반도체-로봇-사물인터넷": {
    boothIds: ["m-3", "a-5", "i-2"],
    cardColors: ["bg-[#A9D49E]", "bg-[#C3D1EB]", "bg-[#FADD94]"],
  },
};

const BoothCard = ({ booth, boothImage, cardColor }) => {
  const textColor = "text-gray-800";

  const handleNavigate = () => {
    if (booth.location) {
      // Temi에 저장된 위치 목록 가져오기
      const locations = TemiBridge.getLocations();
      const locationExists = locations.includes(booth.location);

      if (locationExists) {
        TemiBridge.goTo(booth.location);
        TemiBridge.speak(`${booth.name}로 안내를 시작합니다`);
      } else {
        TemiBridge.showToast("저장된 위치를 찾을 수 없습니다");
        TemiBridge.speak("죄송합니다. 해당 위치가 등록되어 있지 않습니다");
      }
    } else {
      TemiBridge.showToast("위치 정보가 없습니다");
      TemiBridge.speak("죄송합니다. 해당 부스의 위치 정보가 없습니다");
    }
  };

  return (
    <div
      className={`w-[440px] ${cardColor} rounded-3xl shadow-xl overflow-hidden flex flex-col transform transition-transform duration-300`}
    >
      <div className="m-6 mb-0 rounded-2xl overflow-hidden relative h-60 flex-shrink-0">
        {boothImage ? (
          <img
            src={boothImage}
            alt={booth.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl bg-white">
            이미지 준비중입니다
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-grow items-center text-center">
        <h3
          className={`text-4xl font-extrabold ${textColor} mb-2 leading-tight break-keep`}
        >
          {booth.name}
        </h3>
        <p className="text-xl font-bold text-gray-600 mb-5">
          {booth.subCategory || booth.category}
        </p>
        <p
          className={`text-xl ${textColor} opacity-80 mb-10 line-clamp-3 break-keep leading-relaxed`}
        >
          {booth.description}
        </p>

        <div className="mt-auto w-full">
          <button
            onClick={handleNavigate}
            className="w-full bg-[#2563eb] text-white py-5 px-6 rounded-2xl font-bold text-2xl transition flex items-center justify-center gap-3 shadow-md"
          >
            <Icons.Send />
            길안내 받기
          </button>
        </div>
      </div>
    </div>
  );
};

const BoothRecommender = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [boothImages, setBoothImages] = useState({});

  const totalQuestions = questions.length;

  const allBooths = [
    ...energyBoothData,
    ...ictBoothData,
    ...advancedBoothData,
    ...mobilityBoothData,
    ...bioHealthBoothData,
  ];

  useEffect(() => {
    const images = {};

    if (window.Temi && window.Temi.loadBoothImage) {
      console.log("🤖 Temi: 부스 이미지 로딩 시작");

      allBooths.forEach((booth) => {
        if (booth.img) {
          try {
            const imageData = window.Temi.loadBoothImage(booth.img);

            if (imageData) {
              images[booth.id] = imageData.startsWith("data:")
                ? imageData
                : `data:image/jpeg;base64,${imageData}`;
            }
          } catch (error) {
            console.error(`❌ 에러: ${booth.img}`, error);
          }
        }
      });
    } else {
      console.log("🌐 개발 환경: 일반 경로 사용");

      allBooths.forEach((booth) => {
        if (booth.img) {
          images[booth.id] = `/${booth.img}`;
        }
      });
    }

    console.log("📸 로드된 이미지:", images);
    setBoothImages(images);
  }, []);

  const handleStart = () => {
    setStep(1);
    setAnswers([]);
  };
  const handleReset = () => {
    setStep(0);
    setAnswers([]);
  };

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

  const renderStartScreen = () => (
    <div className="text-center flex flex-col items-center animate-fade-in w-full max-w-6xl">
      <div className="flex items-center justify-center mb-12 gap-10">
        <QuestionIcon className="w-24 h-24 text-gray-400 opacity-60" />
        <VsIcon />
        <QuestionIcon className="w-24 h-24 text-gray-400 opacity-60" />
      </div>

      <h1 className="text-7xl font-extrabold text-[#1e293b] mb-10 tracking-tight">
        부스 추천 받기
      </h1>

      <p className="text-4xl text-gray-500 mb-16 font-medium leading-normal">
        본인 취향에 맞는 부스를 <br />
        <span className="text-[#3b82f6] font-bold">양자택일</span> 게임을 통해
        추천해드려요
      </p>

      <div className="mb-20">
        <LineIcon />
      </div>

      <AngleButton onClick={handleStart} icon={<RightArrowIcon />}>
        시작하기
      </AngleButton>
    </div>
  );

  const renderQuestionScreen = () => {
    const currentQuestion = questions[step - 1];
    const [optionA, optionB] = currentQuestion.options;

    return (
      <div className="w-full max-w-[1600px] text-center flex flex-col relative">
        <h2 className="text-6xl md:text-7xl font-extrabold text-[#1e293b] mb-4 tracking-tight">
          {currentQuestion.question}
        </h2>
        <p className="text-3xl text-gray-400 font-medium mb-20">
          {currentQuestion.subtitle}
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-40 w-full mb-24 relative">
          <button
            onClick={() => handleAnswer(optionA.key)}
            className={`${optionA.color} w-full md:w-[600px] h-[400px] rounded-[3rem] shadow-sm flex flex-col items-center justify-center p-10 transition-all duration-300 group`}
          >
            <span className="text-7xl font-extrabold text-[#1e293b] transition-colors break-keep leading-tight">
              {optionA.text}
            </span>
            {optionA.detail && (
              <span className="text-3xl text-gray-500 mt-6 font-medium">
                {optionA.detail}
              </span>
            )}
          </button>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <VsIcon2 className="w-20 h-20 md:w-28 md:h-28 drop-shadow-xl" />
          </div>

          <button
            onClick={() => handleAnswer(optionB.key)}
            className={`${optionB.color} w-full md:w-[600px] h-[400px] rounded-[3rem] shadow-sm flex flex-col items-center justify-center p-10 transition-all duration-300 group`}
          >
            <span className="text-7xl font-extrabold text-[#1e293b] transition-colors break-keep leading-tight">
              {optionB.text}
            </span>
            {optionB.detail && (
              <span className="text-3xl text-gray-500 mt-6 font-medium">
                {optionB.detail}
              </span>
            )}
          </button>
        </div>

        <div className="w-full flex justify-between items-center px-10">
          <div className="w-40">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="bg-[#3b82f6] text-white pl-6 pr-10 py-5 rounded-full font-bold text-2xl flex items-center transition shadow-md w-full justify-center"
              >
                <div className="mr-2">
                  <Icons.BackArrow />
                </div>
                이전
              </button>
            )}
          </div>

          <div className="flex gap-5">
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <div
                key={index}
                className={`w-5 h-5 rounded-full transition-all duration-300 ${
                  index < step ? "bg-[#3b82f6] scale-110" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>

          <div className="w-40"></div>
        </div>
      </div>
    );
  };

  const renderResultScreen = () => {
    const resultKey = answers.join("-");
    const result = resultsData[resultKey];

    if (!result || !result.boothIds) {
      return (
        <div className="text-center flex flex-col items-center justify-center h-[500px]">
          <h2 className="text-4xl font-bold text-gray-800">
            결과를 찾을 수 없습니다.
          </h2>
          <p className="text-gray-500 mt-6 text-2xl">선택 조합: {resultKey}</p>
          <button
            onClick={handleReset}
            className="mt-10 bg-blue-500 text-white px-10 py-6 rounded-2xl font-bold text-2xl"
          >
            처음으로
          </button>
        </div>
      );
    }

    const recommendedBooths = result.boothIds
      .map((boothId) => allBooths.find((booth) => booth.id === boothId))
      .filter(Boolean);

    return (
      <div className="w-full max-w-[1600px] text-center flex flex-col items-center animate-fade-in pb-16">
        <h2 className="text-6xl font-extrabold text-[#1e293b] mb-6 tracking-tight">
          이 부스를 추천드려요!
        </h2>
        <p className="text-3xl text-gray-500 font-medium mb-20">
          길 안내를 통해 바로 안내 받을 수 있어요
        </p>

        <div className="flex justify-center gap-16 w-full">
          {recommendedBooths.map((booth, index) => (
            <BoothCard
              key={booth.id}
              booth={booth}
              boothImage={boothImages[booth.id]}
              cardColor={result.cardColors[index]}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex items-start justify-center pt-16 p-8 font-sans">
      <main className="w-full flex justify-center">
        {step === 0 && renderStartScreen()}
        {step > 0 && step <= totalQuestions && renderQuestionScreen()}
        {step > totalQuestions && renderResultScreen()}
      </main>
    </div>
  );
};

export default BoothRecommender;
