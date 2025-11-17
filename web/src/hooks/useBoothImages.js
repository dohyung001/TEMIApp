// web/src/hooks/useBoothImages.js

import { useState, useEffect } from "react";

/**
 * 부스 이미지를 지연 로딩하는 Hook
 * @param {Array} booths - 부스 데이터 배열 (imageFile 속성 필수)
 * @returns {Object} { booths: 이미지가 로드된 부스 배열, loading: 로딩 상태 }
 */
export const useBoothImages = (booths) => {
  const [loadedBooths, setLoadedBooths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = () => {
      // ✅ Temi 환경: Android에서 이미지 로드
      if (window.Temi && window.Temi.loadBoothImage) {
        console.log("🤖 Temi: 부스 이미지 로딩 시작");

        const boothsWithImages = booths.map((booth) => {
          try {
            const imageData = window.Temi.loadBoothImage(booth.imageFile);

            if (imageData) {
              return {
                ...booth,
                image: imageData.startsWith("data:")
                  ? imageData
                  : `data:image/jpeg;base64,${imageData}`,
              };
            } else {
              console.error(`❌ 로드 실패: ${booth.imageFile}`);
              return { ...booth, image: null };
            }
          } catch (error) {
            console.error(`❌ 에러: ${booth.imageFile}`, error);
            return { ...booth, image: null };
          }
        });

        setLoadedBooths(boothsWithImages);
      }
      // ✅ 개발 환경: 일반 경로
      else {
        console.log("🌐 개발 환경: 일반 경로 사용");

        setLoadedBooths(
          booths.map((booth) => ({
            ...booth,
            image: `/booths/${booth.imageFile}`,
          }))
        );
      }

      setLoading(false);
    };

    loadImages();
  }, [booths]);

  return { booths: loadedBooths, loading };
};
