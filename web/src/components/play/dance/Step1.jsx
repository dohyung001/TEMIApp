// web/src/components/dance/Step1.jsx
// 노래 선택 화면 - 노래 목록을 그리드로 표시

import React from "react";
import AlbumCover from "./AlbumCover";

/**
 * Step1: 노래 선택 화면
 * @param {Array} songs - 노래 목록 배열
 * @param {Function} onSelectSong - 노래 선택 시 호출되는 콜백 함수
 */
export default function Step1({ songs, onSelectSong }) {
  return (
    <div>
      {/* 설명 텍스트 */}
      <p className="text-4xl text-gray-500 text-center mb-12">
        노래 하이라이트에 맞춰서 테미가 춤을 춰요
      </p>

      {/* 노래 목록 그리드 (2열) */}
      <div className="grid grid-cols-3 gap-6">
        {songs.map((song) => (
          <button
            key={song.id}
            onClick={() => onSelectSong(song)}
            className="rounded-[50px] w-[480px] h-[480px] p-6 transition-all duration-300 border-2 border-slate-200 shadow-2xl flex flex-col justify-center items-center"
          >
            {/* 앨범 커버 이미지 (244x244px) */}
            <div className="aspect-square w-[260px] h-[260px] rounded-xl mb-4 overflow-hidden">
              <AlbumCover src={song.cover} alt={song.title} />
            </div>
            {/* 노래 제목 */}
            <h3 className="text-5xl font-bold mb-1">{song.title}</h3>
            {/* 아티스트명 */}
            <p className="text-4xl text-gray-500">{song.artist}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
