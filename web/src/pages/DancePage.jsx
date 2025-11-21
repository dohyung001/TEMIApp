// web/src/pages/DancePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlbumCover from "../components/dance/AlbumCover";

const DancePage = () => {
  const navigate = useNavigate();

  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "Blue Valentine",
      artist: "NMIXX(엔믹스)",
      coverFile: "blue.png",
      audioFile: "blue.mp3",
      cover: null,
    },
    {
      id: 2,
      title: "Go!",
      artist: "CORTIS(코르티스)",
      coverFile: "go.png",
      audioFile: "go.mp3",
      cover: null,
    },
    {
      id: 3,
      title: "Golden",
      artist: "HUNTRX(헌트릭스)",
      coverFile: "golden.png",
      audioFile: "golden.mp3",
      cover: null,
    },
  ]);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      if (window.Temi) {
        console.log("🤖 Temi: 앨범 이미지 로딩 시작");

        const loadedSongs = songs.map((song) => {
          const coverData = window.Temi.loadImageAsBase64(song.coverFile);

          return {
            ...song,
            cover: coverData.startsWith("data:")
              ? coverData
              : `data:image/png;base64,${coverData}`,
          };
        });

        setSongs(loadedSongs);
        console.log("✅ Temi: 앨범 이미지 로딩 완료");
      } else {
        console.log("🌐 개발 환경: 일반 경로 사용");

        const loadedSongs = songs.map((song) => ({
          ...song,
          cover: `/songs/${song.coverFile}`,
        }));

        setSongs(loadedSongs);
      }
    } catch (error) {
      console.error("❌ 이미지 로드 실패:", error);
    }
  };

  const handleSelectSong = (song) => {
    navigate(`/dance/${song.id}`);
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <div className="px-41">
        <h1 className="text-6xl font-bold text-slate-800 text-center mb-12">
          춤추기
        </h1>

        {/* 설명 텍스트 */}
        <p className="text-4xl text-gray-500 text-center mb-12">
          노래 하이라이트에 맞춰서 테미가 춤을 춰요
        </p>

        {/* 노래 목록 그리드 */}
        <div className="grid grid-cols-3 gap-6">
          {songs.map((song) => (
            <button
              key={song.id}
              onClick={() => handleSelectSong(song)}
              className="rounded-[50px] w-[480px] h-[480px] p-6 transition-all duration-300 border-2 border-slate-200 shadow-2xl flex flex-col justify-center items-center"
            >
              {/* 앨범 커버 */}
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
    </div>
  );
};

export default DancePage;
