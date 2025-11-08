// web/src/components/pages/DancePage.jsx

import React, { useState, useRef, useEffect } from "react";
import { TemiBridge } from "../../services/temiBridge";

const DancePage = () => {
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "FAMOUS",
      artist: "ALL DAY PROJECT",
      cover: null, // 나중에 로드
      audio: "songs/famous.mp3",
    },
    {
      id: 2,
      title: "GO!",
      artist: "Unknown Artist",
      cover: null,
      audio: "songs/famous.mp3",
    },
  ]);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // ✅ 컴포넌트 마운트 시 이미지 로드
  useEffect(() => {
    loadCovers();
  }, []);

  const loadCovers = async () => {
    try {
      // ✅ Temi 환경: Android에서 이미지 로드
      if (window.Temi && window.Temi.loadImageAsBase64) {
        const coverData = window.Temi.loadImageAsBase64("famous-cover.jpg");

        if (coverData) {
          setSongs((prevSongs) =>
            prevSongs.map((song) => ({
              ...song,
              cover: coverData.startsWith("data:")
                ? coverData
                : `data:image/jpeg;base64,${coverData}`,
            }))
          );
        }
      }
      // ✅ 개발 환경: 일반 경로
      else {
        setSongs((prevSongs) =>
          prevSongs.map((song) => ({
            ...song,
            cover: "songs/famous-cover.jpg",
          }))
        );
      }
    } catch (error) {
      console.error("이미지 로드 실패:", error);
    }
  };

  const selectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const togglePlay = () => {
    if (!currentSong || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      TemiBridge.speak("음악을 일시정지합니다");
    } else {
      audioRef.current.play().catch((error) => {
        console.error("재생 실패:", error);
        TemiBridge.showToast("음악 재생에 실패했습니다");
      });
      TemiBridge.speak(`${currentSong.title}을 재생합니다`);
      startDanceMovement();
    }
    setIsPlaying(!isPlaying);
  };

  const startDanceMovement = () => {
    const danceInterval = setInterval(() => {
      if (isPlaying && TemiBridge.isNativeAvailable()) {
        TemiBridge.tiltBy(20, 3.0);
        setTimeout(() => {
          if (isPlaying) TemiBridge.tiltBy(-40, 3.0);
        }, 300);
        setTimeout(() => {
          if (isPlaying) TemiBridge.tiltBy(20, 3.0);
        }, 600);
      }
    }, 1000);

    if (audioRef.current) {
      audioRef.current.onpause = () => {
        clearInterval(danceInterval);
        TemiBridge.tiltHead(0);
      };
      audioRef.current.onended = () => {
        clearInterval(danceInterval);
        TemiBridge.tiltHead(0);
        setIsPlaying(false);
      };
    }
  };

  const goToPrevious = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const prevIndex =
      currentIndex - 1 < 0 ? songs.length - 1 : currentIndex - 1;
    selectSong(songs[prevIndex]);
  };

  const goToNext = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    selectSong(songs[nextIndex]);
  };

  // ✅ 이미지 fallback 컴포넌트
  const AlbumCover = ({ src, alt, size = "200px" }) => {
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

    return (
      <img
        src={src}
        alt={alt}
        style={{ width: size, height: size }}
        className="object-cover"
        onError={(e) => {
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
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full">
        <h1 className="text-5xl font-bold text-slate-800 text-center mb-12">
          춤추기
        </h1>

        {!currentSong ? (
          <div>
            <p className="text-2xl text-gray-500 text-center mb-8">
              노래 하이라이트에 맞춰서 테미가 춤을 춰요
            </p>

            <div className="grid grid-cols-2 gap-6">
              {songs.map((song) => (
                <button
                  key={song.id}
                  onClick={() => selectSong(song)}
                  className="rounded-[50px] p-6 transition-all duration-300 transform border-2 border-slate-200 shadow-2xl flex flex-col justify-center items-center"
                >
                  <div className="aspect-square rounded-xl mb-4 overflow-hidden">
                    <AlbumCover src={song.cover} alt={song.title} />
                  </div>
                  <h3 className="text-5xl font-bold mb-1">{song.title}</h3>
                  <p className="text-2xl text-gray-500">{song.artist}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="flex justify-center mb-8">
              <div className="w-80 h-80 rounded-3xl shadow-2xl overflow-hidden bg-slate-200">
                <AlbumCover
                  src={currentSong.cover}
                  alt={currentSong.title}
                  size="320px"
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-slate-800 mb-2">
                {currentSong.title}
              </h2>
              <p className="text-xl text-gray-600">{currentSong.artist}</p>
            </div>

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={goToPrevious}
                className="w-16 h-16 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all"
              >
                <svg
                  className="w-8 h-8 text-slate-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>

              <button
                onClick={togglePlay}
                className="w-24 h-24 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-110"
              >
                {isPlaying ? (
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-12 h-12 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={goToNext}
                className="w-16 h-16 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all"
              >
                <svg
                  className="w-8 h-8 text-slate-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                }
                setIsPlaying(false);
                setCurrentSong(null);
                TemiBridge.tiltHead(0);
              }}
              className="mt-8 w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl text-lg font-semibold text-slate-700 transition-all"
            >
              노래 목록으로 돌아가기
            </button>
          </div>
        )}

        {currentSong && (
          <audio ref={audioRef} src={currentSong.audio} preload="auto" />
        )}
      </div>
    </div>
  );
};

export default DancePage;
