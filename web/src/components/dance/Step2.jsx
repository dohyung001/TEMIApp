// web/src/components/dance/Step2.jsx
// 재생 화면 - 앨범 커버 + 재생 컨트롤

import React from "react";
import AlbumCover from "./AlbumCover";
import PlayIcon from "../../assets/icons/play.svg?react";
import PauseIcon from "../../assets/icons/pause.svg?react";
/**
 * Step2: 재생 화면
 * @param {Object} currentSong - 현재 재생중인 노래 객체
 * @param {Boolean} isPlaying - 재생 상태
 * @param {Function} onTogglePlay - 재생/일시정지 토글 함수
 * @param {Function} onRestart - 노래 처음부터 다시 재생 함수
 */
export default function Step2({
  currentSong,
  isPlaying,
  onTogglePlay,
  onRestart,
}) {
  return (
    <div>
      {/* 앨범 커버 이미지 (320x320px) */}
      <div className="flex justify-center mb-8">
        <AlbumCover
          src={currentSong.cover}
          alt={currentSong.title}
          size="320px"
        />
      </div>

      {/* 노래 정보 */}
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold text-slate-800 mb-2">
          {currentSong.title}
        </h2>
        <p className="text-3xl text-gray-500">{currentSong.artist}</p>
      </div>

      {/* 재생 컨트롤 버튼 */}
      <div className="flex items-center justify-center gap-6 relative">
        {/* 재생 중일 때만 이전 버튼 표시 (처음으로 돌아가기) */}
        {isPlaying && (
          <button
            onClick={onRestart}
            className="w-32 h-32 rounded-full flex items-center justify-center absolute left-80"
          >
            <svg
              className="w-16 h-16 text-slate-700"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>
        )}

        {/* 재생/일시정지 버튼 */}
        {isPlaying ? (
          // 일시정지 버튼 (재생 중)
          <button
            onClick={onTogglePlay}
            className="w-[126px] h-[126px] text-white rounded-full flex items-center justify-center bg-slate-700  shadow-2xl"
          >
            <PauseIcon />
          </button>
        ) : (
          // 재생 버튼 (재생 전)
          <button
            onClick={onTogglePlay}
            className="w-[126px] h-[126px] text-white rounded-full flex items-center justify-center bg-black shadow-2xl"
          >
            <PlayIcon />
          </button>
        )}
      </div>
    </div>
  );
}
