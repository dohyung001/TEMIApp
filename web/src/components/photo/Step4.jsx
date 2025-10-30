// web/src/components/photo/Step4.jsx
import { useRef, useEffect, useState } from "react";

export default function Step4({
  capturedPhoto,
  selectedTheme,
  onRetake,
  onChangeTheme,
  onConfirm,
}) {
  const canvasRef = useRef(null);
  const [compositePhoto, setCompositePhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (capturedPhoto && selectedTheme) {
      generateComposite();
    }
  }, [capturedPhoto, selectedTheme]);

  const generateComposite = () => {
    setIsLoading(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 16:9 비율로 변경 (1920x1080)
    canvas.width = 1920;
    canvas.height = 1080;

    const photoImage = new Image();

    photoImage.onload = () => {
      // 1. 배경 흰색
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1920, 1080);

      // 2. 사진 그리기 (좌우반전 복원) - 프레임 안쪽에 배치
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(photoImage, -1870, 100, 1820, 880); // 16:9 비율에 맞춰 조정
      ctx.restore();

      // 3. 테마 프레임 그리기
      drawThemeFrame(ctx, selectedTheme);

      // 4. 최종 이미지
      const finalImage = canvas.toDataURL("image/jpeg", 0.95);
      setCompositePhoto(finalImage);
      setIsLoading(false);
    };

    photoImage.onerror = () => {
      setIsLoading(false);
      alert("이미지 로드 실패");
    };

    photoImage.src = capturedPhoto;
  };

  // 테마별 프레임 그리기 - 16:9 비율에 맞춰 수정
  const drawThemeFrame = (ctx, theme) => {
    if (!theme || !theme.color1 || !theme.color2) return;

    // 그라데이션
    const gradient = ctx.createLinearGradient(0, 0, 1920, 0);
    gradient.addColorStop(0, theme.color1);
    gradient.addColorStop(1, theme.color2);

    // 🎨 상단 헤더 (100px)
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1920, 100);

    // 테두리
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 1920, 100);

    // 헤더 텍스트
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 60px sans-serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 10;
    ctx.fillText(`${theme.emoji} ${theme.name.toUpperCase()}`, 960, 65);
    ctx.shadowBlur = 0;

    // 🎨 하단 푸터 (100px)
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 980, 1920, 100);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 980, 1920, 100);

    // 푸터 텍스트
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px sans-serif";
    const today = new Date().toLocaleDateString("ko-KR");
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 10;
    ctx.fillText(`${today} | TEMI PHOTO BOOTH`, 960, 1040);
    ctx.shadowBlur = 0;

    // 🎨 좌우 사이드 바 (50px)
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 100, 50, 880);
    ctx.fillRect(1870, 100, 50, 880);

    // 사이드 바 테두리
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 100, 50, 880);
    ctx.strokeRect(1870, 100, 50, 880);

    // 🎨 안쪽 장식 라인
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 15]);
    ctx.strokeRect(60, 110, 1800, 860);
    ctx.setLineDash([]);

    // 🎨 모서리 장식
    const corners = [
      { x: 60, y: 110 }, // 왼쪽 위
      { x: 1860, y: 110 }, // 오른쪽 위
      { x: 60, y: 970 }, // 왼쪽 아래
      { x: 1860, y: 970 }, // 오른쪽 아래
    ];

    ctx.fillStyle = "#ffffff";
    corners.forEach((corner) => {
      ctx.beginPath();
      ctx.arc(corner.x, corner.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  if (!capturedPhoto || !selectedTheme) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-6xl font-bold mb-4">오류가 발생했습니다</h2>
        <button
          onClick={onRetake}
          className="px-12 py-6 rounded-[28px] bg-blue-600 text-white text-3xl"
        >
          다시 촬영하기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-8">
      <h2 className="text-6xl font-bold mb-4">촬영 결과를 확인하세요</h2>

      {/* 합성된 사진 미리보기 - 16:9 비율 */}
      <div className="relative w-full max-w-[1400px]">
        {isLoading ? (
          <div
            className="rounded-[32px] shadow-2xl border-8 border-white bg-gray-100 flex items-center justify-center w-full"
            style={{ aspectRatio: "16/9" }}
          >
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🎨</div>
              <p className="text-3xl text-gray-600">이미지 합성 중...</p>
            </div>
          </div>
        ) : (
          <img
            src={compositePhoto}
            alt="합성된 사진"
            className="rounded-[32px] shadow-2xl border-8 border-white w-full"
            style={{ aspectRatio: "16/9", objectFit: "cover" }}
          />
        )}
      </div>

      {/* 버튼들 */}
      <div className="flex gap-8 mt-12">
        <button
          onClick={onRetake}
          className="flex items-center justify-center gap-6 px-32 py-8 rounded-full  
                   bg-gradient-to-b from-[#9E9E9E] to-[#707070] text-white 
                  font-semibold text-5xl tracking-tight shadow-[0_12px_48px_rgba(112,112,112,0.4)]"
        >
          재촬영
        </button>
        <button
          onClick={onChangeTheme}
          className="flex items-center justify-center gap-6 px-32 py-8 rounded-full  
                   bg-gradient-to-b from-[#9E9E9E] to-[#707070] text-white 
                  font-semibold text-5xl tracking-tight shadow-[0_12px_48px_rgba(112,112,112,0.4)]"
        >
          테마 변경
        </button>

        <button
          onClick={() => onConfirm(compositePhoto)}
          className=" flex items-center gap-4 px-32 py-8 rounded-full  
         bg-gradient-to-b from-[#3071FF] to-[#1D4ED8] 
         text-white font-semibold text-5xl
         shadow-[0_19px_42px_rgba(37,99,235,0.38)] "
        >
          전송
        </button>
      </div>

      {/* 숨겨진 캔버스 */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
