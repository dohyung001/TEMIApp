// web/src/components/dance/DancePlayPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TemiBridge } from "../../services/temiBridge";
import AlbumCover from "./AlbumCover";
import PlayIcon from "../../assets/icons/play.svg?react";
import PauseIcon from "../../assets/icons/pause.svg?react";
import AudioIcon from "../../assets/icons/audio_img.svg?react";

const DancePlayPage = () => {
  const { songId } = useParams();
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);
  const danceIntervalRef = useRef(null);

  const songsData = [
    {
      id: 1,
      title: "Blue Valentine",
      artist: "NMIXX(엔믹스)",
      coverFile: "blue.png",
      audioFile: "blue.mp3",
    },
    {
      id: 2,
      title: "Go!",
      artist: "CORTIS(코르티스)",
      coverFile: "go.png",
      audioFile: "go.mp3",
    },
    {
      id: 3,
      title: "Golden",
      artist: "HUNTRX(헌트릭스)",
      coverFile: "golden.png",
      audioFile: "golden.mp3",
    },
  ];

  useEffect(() => {
    const song = songsData.find((s) => s.id === parseInt(songId));

    if (!song) {
      navigate("/dance");
      return;
    }

    loadSong(song);
  }, [songId, navigate]);

  const loadSong = async (song) => {
    try {
      if (window.Temi) {
        console.log("🤖 Temi: 노래 에셋 로딩 시작");

        const coverData = window.Temi.loadImageAsBase64(song.coverFile);
        const audioPath = window.Temi.getAudioPath(song.audioFile);

        setCurrentSong({
          ...song,
          cover: coverData.startsWith("data:")
            ? coverData
            : `data:image/png;base64,${coverData}`,
          audio: audioPath,
        });

        console.log("✅ Temi: 노래 에셋 로딩 완료");
      } else {
        console.log("🌐 개발 환경: 일반 경로 사용");

        setCurrentSong({
          ...song,
          cover: `/songs/${song.coverFile}`,
          audio: `/songs/${song.audioFile}`,
        });
      }
    } catch (error) {
      console.error("❌ 에셋 로드 실패:", error);
      navigate("/dance");
    }
  };

  // 춤 동작 제어
  useEffect(() => {
    if (!isPlaying) {
      if (danceIntervalRef.current) {
        clearInterval(danceIntervalRef.current);
        danceIntervalRef.current = null;
      }
      if (TemiBridge.isNativeAvailable()) {
        TemiBridge.tiltHead(0);
        TemiBridge.stopMovement();
      }
      return;
    }

    let danceStep = 0;

    danceIntervalRef.current = setInterval(() => {
      if (TemiBridge.isNativeAvailable()) {
        switch (danceStep % 8) {
          case 0:
            TemiBridge.tiltHead(45);
            TemiBridge.turnBy(45, 2.0);
            break;
          case 1:
            TemiBridge.tiltHead(-20);
            TemiBridge.turnBy(-90, 2.5);
            break;
          case 2:
            TemiBridge.tiltHead(0);
            TemiBridge.turnBy(45, 2.0);
            break;
          case 3:
            TemiBridge.tiltHead(55);
            TemiBridge.turnBy(180, 3.0);
            break;
          case 4:
            TemiBridge.tiltHead(-25);
            TemiBridge.turnBy(-45, 2.0);
            break;
          case 5:
            TemiBridge.tiltHead(40);
            TemiBridge.turnBy(90, 2.5);
            break;
          case 6:
            TemiBridge.tiltHead(0);
            TemiBridge.turnBy(-90, 2.0);
            break;
          case 7:
            TemiBridge.tiltHead(50);
            TemiBridge.turnBy(45, 2.0);
            break;
        }
        danceStep++;
      }
    }, 800);

    return () => {
      if (danceIntervalRef.current) {
        clearInterval(danceIntervalRef.current);
        danceIntervalRef.current = null;
      }
      if (TemiBridge.isNativeAvailable()) {
        TemiBridge.stopMovement();
      }
    };
  }, [isPlaying]);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (TemiBridge.isNativeAvailable()) {
        TemiBridge.stopMovement();
        TemiBridge.tiltHead(0);
      }
      console.log("🛑 DancePlayPage 정리");
    };
  }, []);

  const handleTogglePlay = () => {
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
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      TemiBridge.speak("처음부터 다시 재생합니다");
    }
  };

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.onended = () => {
        setIsPlaying(false);
        if (TemiBridge.isNativeAvailable()) {
          TemiBridge.constraintBeWith();
        }
      };
    }
  }, [currentSong]);

  if (!currentSong) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-4xl text-gray-500">노래 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <div className="px-41">
        <h1 className="text-6xl font-bold text-slate-800 text-center mb-12">
          춤추기
        </h1>

        {/* 앨범 커버 + 오디오 아이콘 */}
        <div className="flex relative items-center justify-center mb-8">
          <AudioIcon className="absolute -top-28 left-16 z-0" />
          <div className="relative z-10">
            <AlbumCover
              src={currentSong.cover}
              alt={currentSong.title}
              size="480px"
            />
          </div>
        </div>

        {/* 노래 정보 */}
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold text-slate-800 mb-2">
            {currentSong.title}
          </h2>
          <p className="text-3xl text-gray-500">{currentSong.artist}</p>
        </div>

        {/* 재생 컨트롤 */}
        <div className="flex items-center justify-center gap-6 relative">
          {/* 처음으로 버튼 */}
          {isPlaying && (
            <button
              onClick={handleRestart}
              className="w-32 h-32 rounded-full flex items-center justify-center absolute right-80"
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
            <button
              onClick={handleTogglePlay}
              className="w-[126px] h-[126px] text-white rounded-full flex items-center justify-center bg-slate-700 shadow-2xl"
            >
              <PauseIcon />
            </button>
          ) : (
            <button
              onClick={handleTogglePlay}
              className="w-[126px] h-[126px] text-white rounded-full flex items-center justify-center bg-black shadow-2xl"
            >
              <PlayIcon />
            </button>
          )}
        </div>

        <audio ref={audioRef} src={currentSong.audio} preload="auto" />
      </div>
    </div>
  );
};

export default DancePlayPage;
