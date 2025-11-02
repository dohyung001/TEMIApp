import { useState, useEffect } from "react";
import { composeImageWithTheme } from "../../utils/imageComposer";
import RoundButton from "../RoundButton";
import WhiteCameraIcon from "../../assets/icons/white_camera.svg?react";

export default function Step4({ capturedPhoto, themes, onConfirm, onCancel }) {
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [composedPreviews, setComposedPreviews] = useState({});
  const [composing, setComposing] = useState(false);
  const [loadingPreviews, setLoadingPreviews] = useState(true);

  // 컴포넌트 마운트 시 모든 테마의 미리보기 생성
  useEffect(() => {
    generateAllPreviews();
  }, []);

  const generateAllPreviews = async () => {
    setLoadingPreviews(true);
    const previews = {};

    for (const theme of themes) {
      try {
        const composedImage = await composeImageWithTheme(capturedPhoto, theme);
        previews[theme.id] = composedImage;
      } catch (error) {
        console.error(`테마 ${theme.id} 미리보기 생성 실패:`, error);
      }
    }

    setComposedPreviews(previews);
    setLoadingPreviews(false);
  };

  const handleThemeClick = (themeId) => {
    setSelectedThemeId(themeId);
  };

  const handleSend = () => {
    if (!selectedThemeId || !composedPreviews[selectedThemeId]) return;

    // 이미 합성된 이미지를 사용
    const composedPhoto = composedPreviews[selectedThemeId];
    onConfirm(selectedThemeId, composedPhoto);
  };

  // 로딩 중
  if (loadingPreviews) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-20 h-20 border-8 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-3xl font-bold text-gray-800">
          테마 미리보기 생성 중...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {/* 3개 프레임 미리보기 (합성된 이미지) */}
      <div className="flex gap-8 mb-12">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeClick(theme.id)}
            disabled={composing}
            className={`
              relative
              
              transition-all
              
              ${composing ? "opacity-50 cursor-not-allowed" : ""}
            `}
            style={{
              boxShadow:
                selectedThemeId === theme.id
                  ? "0 0 0 8px #3B82F6" // 선택 시 파란 테두리
                  : "0 0 16.9px 0 #000000", // 피그마 섀도우
            }}
          >
            {/* 합성된 사진 미리보기 */}
            <div className="w-full h-full overflow-hidden">
              {composedPreviews[theme.id] ? (
                <img
                  src={composedPreviews[theme.id]}
                  alt={theme.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                  <span className="text-white text-2xl">로딩 실패</span>
                </div>
              )}
            </div>

            {/* 선택 표시 (체크마크) */}
            {selectedThemeId === theme.id && (
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow-lg">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-8">
        {/* 재촬영 버튼 */}
        <RoundButton
          icon={<WhiteCameraIcon />}
          disabled={composing}
          onClick={onCancel}
          color="gray"
        >
          재촬영
        </RoundButton>
        {/* 전송 버튼 */}
        <RoundButton
          icon={<WhiteCameraIcon />}
          disabled={!selectedThemeId || composing}
          onClick={handleSend}
          color="blue"
        >
          저장하기
        </RoundButton>
      </div>
    </div>
  );
}
