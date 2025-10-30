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
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [finalPhoto, setFinalPhoto] = useState(null);
  const [email, setEmail] = useState("");
  const [sendMethod, setSendMethod] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  // 테마 목록 (3개)
  const themes = [
    {
      id: "christmas",
      name: "크리스마스",
      emoji: "🎄",
      color1: "#ef4444",
      color2: "#22c55e",
      gradient: "from-red-500 to-green-500",
      bgColor: "bg-gradient-to-br from-red-50 to-green-50",
      textColor: "text-red-600",
    },
    {
      id: "birthday",
      name: "생일 축하",
      emoji: "🎂",
      color1: "#ec4899",
      color2: "#a855f7",
      gradient: "from-pink-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-pink-50 to-purple-50",
      textColor: "text-pink-600",
    },
    {
      id: "graduation",
      name: "졸업 축하",
      emoji: "🎓",
      color1: "#3b82f6",
      color2: "#4f46e5",
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      textColor: "text-blue-600",
    },
  ];

  // 핸들러
  const handleStart = () => {
    TemiBridge.speak("테마를 선택해주세요");
    setCurrentStep(2);
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    TemiBridge.speak(`${theme.name} 테마가 선택되었습니다`);
    setCurrentStep(3);
  };

  const handleCapture = (photoSrc) => {
    setCapturedPhoto(photoSrc);
    TemiBridge.speak("사진이 촬영되었습니다");
    setCurrentStep(4);
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setFinalPhoto(null);
    setCurrentStep(3);
  };

  const handleChangeTheme = () => {
    setCapturedPhoto(null);
    setFinalPhoto(null);
    setCurrentStep(2);
  };

  const handleConfirm = (compositePhoto) => {
    setFinalPhoto(compositePhoto);
    TemiBridge.speak("전송 방법을 선택해주세요");
    setCurrentStep(5);
  };

  const handleQRGenerate = () => {
    const url = `https://temi-photo.com/${Date.now()}`;
    setQrCode(url);
    setSendMethod("qr");
    TemiBridge.speak("QR 코드가 생성되었습니다");
  };

  const handleEmailSend = () => {
    if (!email.trim()) {
      TemiBridge.speak("이메일 주소를 입력해주세요");
      return;
    }
    setSendMethod("email");
    TemiBridge.speak("이메일이 전송되었습니다");
    console.log("이메일 전송:", email, finalPhoto);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedTheme(null);
    setCapturedPhoto(null);
    setFinalPhoto(null);
    setEmail("");
    setSendMethod(null);
    setQrCode(null);
  };

  return (
    <div className="flex items-center justify-center">
      {currentStep === 1 && <Step1 onStart={handleStart} />}

      {currentStep === 2 && (
        <Step2 themes={themes} onSelectTheme={handleThemeSelect} />
      )}

      {currentStep === 3 && (
        <Step3
          selectedTheme={selectedTheme}
          onCapture={handleCapture}
          onBack={handleChangeTheme}
        />
      )}

      {currentStep === 4 && (
        <Step4
          capturedPhoto={capturedPhoto}
          selectedTheme={selectedTheme}
          onRetake={handleRetake}
          onChangeTheme={handleChangeTheme}
          onConfirm={handleConfirm}
        />
      )}

      {currentStep === 5 && (
        <Step5
          email={email}
          sendMethod={sendMethod}
          qrCode={qrCode}
          onEmailChange={setEmail}
          onQRGenerate={handleQRGenerate}
          onEmailSend={handleEmailSend}
          onReset={handleReset}
          onGoHome={() => navigate("/")}
        />
      )}
    </div>
  );
}
