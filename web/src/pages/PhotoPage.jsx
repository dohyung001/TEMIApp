// web/src/pages/PhotoPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TemiBridge } from "../services/temiBridge";

import Step1 from "../components/photo/Step1";
import Step2 from "../components/photo/Step2";
import Step3 from "../components/photo/Step3";
import Step4 from "../components/photo/Step4";
import Step5 from "../components/photo/Step5";

export default function PhotoPage() {
  const navigate = useNavigate();

  // 상태 관리
  const [currentStep, setCurrentStep] = useState(1);
  const [capturedPhoto, setCapturedPhoto] = useState(null); // 원본 사진
  const [selectedThemeId, setSelectedThemeId] = useState(null); // 선택된 테마 ID
  const [finalPhoto, setFinalPhoto] = useState(null); // 최종 합성 사진
  const [qrCode, setQrCode] = useState(null); // QR 코드 URL

  // 테마 목록 (4개)
  const themes = [
    {
      id: "coss",
    },
    {
      id: "clover",
    },
    {
      id: "tuffy",
    },
    { id: "gromit" },
    { id: "rico" },
  ];

  // ===== 핸들러 =====

  // Step1 → Step2: 시작 버튼
  const handleStart = () => {
    TemiBridge.speak("사진을 촬영해주세요");
    setCurrentStep(2);
  };

  // Step2 → Step3: 사진 촬영 완료
  const handleCapture = (photoSrc) => {
    setCapturedPhoto(photoSrc);
    TemiBridge.speak("사진이 촬영되었습니다");
    setCurrentStep(3);
  };

  // Step3: 재촬영 (Step2로 돌아가기)
  const handleRetake = () => {
    setCapturedPhoto(null);
    setSelectedThemeId(null);
    setFinalPhoto(null);
    TemiBridge.speak("다시 촬영해주세요");
    setCurrentStep(2);
  };

  // Step3 → Step4: 테마 선택하기 버튼
  const handleGoToThemeSelect = () => {
    TemiBridge.speak("마음에 드는 테마를 선택해주세요");
    setCurrentStep(4);
  };

  // Step3 → Step5: 바로 전송 (테마 없이)
  const handleDirectSend = () => {
    setFinalPhoto(capturedPhoto); // 원본 사진을 그대로 사용
    setSelectedThemeId(null);
    TemiBridge.speak("QR 코드를 스캔해주세요");
    generateQRCode(capturedPhoto);
    setCurrentStep(5);
  };

  // Step4: 테마 선택 완료 → Step5
  const handleThemeConfirm = (themeId, compositePhoto) => {
    setSelectedThemeId(themeId);
    setFinalPhoto(compositePhoto);
    TemiBridge.speak("QR 코드를 스캔해주세요");
    generateQRCode(compositePhoto);
    setCurrentStep(5);
  };

  // Step4: 테마 선택 취소 (Step3로 돌아가기)
  const handleCancelThemeSelect = () => {
    setSelectedThemeId(null);
    setFinalPhoto(null);
    setCurrentStep(3);
  };

  // QR 코드 생성
  const generateQRCode = (photoData) => {
    // 실제로는 서버에 업로드 후 URL을 받아야 함
    // 여기서는 임시로 타임스탬프 기반 URL 생성
    const timestamp = Date.now();
    const url = `https://temi-photo.com/view/${timestamp}`;
    setQrCode(url);

    // TODO: 실제 구현 시
    // 1. photoData를 서버에 업로드
    // 2. 서버에서 반환한 URL로 QR 생성
    console.log("사진 데이터 업로드 예정:", photoData);
  };

  // Step5: 처음으로 (전체 리셋)
  const handleReset = () => {
    setCurrentStep(1);
    setCapturedPhoto(null);
    setSelectedThemeId(null);
    setFinalPhoto(null);
    setQrCode(null);
    TemiBridge.speak("처음부터 다시 시작합니다");
  };

  // Step5: 홈으로
  const handleGoHome = () => {
    handleReset(); // 상태 초기화
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center ">
      {/* Step 1: 시작 화면 */}
      {currentStep === 1 && <Step1 onStart={handleStart} />}

      {/* Step 2: 사진 촬영 */}
      {currentStep === 2 && <Step2 onCapture={handleCapture} />}

      {/* Step 3: 사진 확인 (재촬영 / 테마 선택 / 바로 전송) */}
      {currentStep === 3 && (
        <Step3
          capturedPhoto={capturedPhoto}
          onRetake={handleRetake}
          onGoToThemeSelect={handleGoToThemeSelect}
          onDirectSend={handleDirectSend}
        />
      )}

      {/* Step 4: 테마 선택 (4개 미리보기) */}
      {currentStep === 4 && (
        <Step4
          capturedPhoto={capturedPhoto}
          themes={themes}
          onConfirm={handleThemeConfirm}
          onCancel={handleCancelThemeSelect}
        />
      )}

      {/* Step 5: QR 코드 표시 */}
      {currentStep === 5 && (
        <Step5
          qrCode={qrCode}
          finalPhoto={finalPhoto}
          selectedTheme={themes.find((t) => t.id === selectedThemeId)}
          onReset={handleReset}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
}
