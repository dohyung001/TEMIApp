import { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import WhiteCameraIcon from "../../assets/icons/white_camera.svg?react";

export default function Step3({ selectedTheme, onCapture, onBack }) {
  const webcamRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoConstraints = {
    width: 1920,
    height: 1080,
    facingMode: "user",
  };

  const handleCapture = useCallback(() => {
    if (isCapturing) return;
    setIsCapturing(true);
    setCountdown(3);

    let current = 3;
    const timer = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdown(current);
      } else {
        clearInterval(timer);
        setCountdown(null);
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          onCapture(imageSrc);
        }
        setIsCapturing(false);
      }
    }, 1000);
  }, [onCapture, isCapturing]);

  return (
    <div className="flex flex-col items-center relative min-h-screen">
      {/* 안내 문구 */}
      <div className="w-full text-center mb-4">
        <h2 className="text-3xl text-slate-600 font-medium">
          카메라 버튼을 누른 후 3초 후에 사진이 촬영됩니다
        </h2>
      </div>

      {/* 카메라 프리뷰 */}
      <div className="relative w-full max-w-[1600px]">
        <div
          className="relative rounded-[24px] overflow-hidden shadow-2xl border-8 border-white w-full"
          style={{ aspectRatio: "16/9" }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
            style={{
              transform: "rotateY(180deg)",
              WebkitTransform: "rotateY(180deg)",
            }}
          />

          {/* 테마 표시 */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 px-10 py-3 rounded-full z-10">
            <span className="text-white text-4xl font-semibold">
              {selectedTheme?.emoji} {selectedTheme?.name}
            </span>
          </div>

          {/* 카운트다운 오버레이 */}
          {countdown !== null && (
            <div
              key={countdown}
              className="absolute inset-0 flex items-center justify-center  z-20"
            >
              <span className="text-white text-[200px] font-bold animate-scaleFade">
                {countdown}
              </span>
            </div>
          )}
        </div>

        {/* 촬영 버튼 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className={`rounded-full bg-gradient-to-b from-[#3071FF] to-[#1D4ED8] 
              shadow-2xl p-10 border-8 border-white 
              transition-transform hover:scale-105 active:scale-95
              ${isCapturing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <WhiteCameraIcon className="w-14 h-14" />
          </button>
        </div>

        {/* 백 버튼 (카메라 프리뷰 바깥 왼쪽) */}
        <button
          onClick={onBack}
          className="
            absolute 
            -left-40 top-1/2 -translate-y-1/2
            bg-white/80 hover:bg-white 
            text-slate-700 font-bold 
            rounded-full shadow-xl 
            p-6 text-4xl
            z-30
          "
        >
          {"<"}
        </button>
      </div>
    </div>
  );
}
