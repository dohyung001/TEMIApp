// web/src/components/dance/AlbumCover.jsx
// 앨범 커버 이미지 컴포넌트 - 이미지 로드 실패 시 fallback 표시

import React from "react";

/**
 * 앨범 커버 이미지 컴포넌트
 * @param {string} src - 이미지 소스 (Base64 또는 URL)
 * @param {string} alt - 대체 텍스트
 * @param {string} size - 이미지 크기 (기본값: 244px)
 * 
 * 이미지 로드 실패 시 음표 아이콘이 있는 그라데이션 배경 표시
 */
export default function AlbumCover({ src, alt, size = "244px" }) {
  // 이미지가 없을 때 - fallback UI
  if (!src) {
    return (
      <div
        className="bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          className="w-20 h-20 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
      </div>
    );
  }

  // 이미지가 있을 때
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: size, height: size }}
      className="object-cover"
      onError={(e) => {
        // 이미지 로드 실패 시 fallback 처리
        e.target.style.display = "none";
        const fallback = document.createElement("div");
        fallback.className =
          "w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center";
        fallback.innerHTML = `
          <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        `;
        e.target.parentElement.appendChild(fallback);
      }}
    />
  );
}
