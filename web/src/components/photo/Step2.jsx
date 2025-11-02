import { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import WhiteCameraIcon from "../../assets/icons/white_camera.svg?react";

export default function Step2({ onCapture }) {
  const webcamRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoConstraints = {
    width: 1400, // 7:6 비율
    height: 1200,
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

        // 스크린샷 촬영
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          // 좌우 반전 해제
          flipImageHorizontally(imageSrc).then((flippedImage) => {
            onCapture(flippedImage);
          });
        }
        setIsCapturing(false);
      }
    }, 1000);
  }, [onCapture, isCapturing]);

  // 이미지 좌우 반전 해제 함수
  const flipImageHorizontally = (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        // 좌우 반전 (거울 효과 제거)
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0);

        // base64로 변환
        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };
      img.src = imageSrc;
    });
  };

  return (
    <div className="flex flex-col items-center relative min-h-screen">
      {/* 안내 문구 */}
      <div className="w-full text-center mb-4">
        <h2 className="text-3xl text-slate-600 font-medium">
          카메라 버튼을 누른 후 3초 후에 사진이 촬영됩니다
        </h2>
      </div>

      {/* 카메라 프리뷰 */}
      <div className="relative w-full max-w-[1400px]">
        <div
          className="relative rounded-[24px] overflow-hidden shadow-2xl border-8 border-white w-full"
          style={{ aspectRatio: "7/6" }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
            style={{
              transform: "rotateY(180deg)", // 미리보기만 반전 (사용자가 보기 편하게)
              WebkitTransform: "rotateY(180deg)",
            }}
          />

          {/* 카운트다운 오버레이 */}
          {countdown !== null && (
            <div
              key={countdown}
              className="absolute inset-0 flex items-center justify-center z-20"
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
      </div>
    </div>
  );
}
