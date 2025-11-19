// web/src/components/pages/DancePage.jsx
// 테미 로봇이 음악에 맞춰 춤을 추는 페이지
// 상태 관리 + 비즈니스 로직 + 렌더링 조합

import React, { useState, useRef, useEffect } from "react";
import { TemiBridge } from "../../services/temiBridge";
import Step1 from "./dance/Step1";
import Step2 from "./dance/Step2";

const DancePage = () => {
  // ========== State 관리 ==========

  // 노래 목록 (앨범 커버 이미지 + 오디오 파일)
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "Blue",
      artist: "NMIXX(엔믹스)",
      coverFile: "blue.png", // ✅ 이미지 파일명
      audioFile: "blue.mp3", // ✅ 오디오 파일명
      cover: null, // Base64 이미지 데이터 (로딩 후)
      audio: null, // 오디오 파일 경로 (로딩 후)
    },
    {
      id: 2,
      title: "Go",
      artist: "CORTIS(코르티스)",
      coverFile: "go.png",
      audioFile: "go.mp3",
      cover: null,
      audio: null,
    },
    {
      id: 3,
      title: "Golden",
      artist: "HUNTRX(헌트릭스)",
      coverFile: "golden.png",
      audioFile: "golden.mp3",
      cover: null,
      audio: null,
    },
  ]);

  // 현재 선택된 노래
  const [currentSong, setCurrentSong] = useState(null);

  // 음악 재생 상태
  const [isPlaying, setIsPlaying] = useState(false);

  // HTML5 Audio 태그 참조
  const audioRef = useRef(null);

  // 춤 동작 interval 참조 (cleanup을 위해)
  const danceIntervalRef = useRef(null);

  // ========== 초기화 ==========

  // 컴포넌트 마운트 시 이미지 + 오디오 로드
  useEffect(() => {
    loadAssets();
  }, []);

  // 컴포넌트 언마운트 시 정리 (페이지 벗어날 때)
  useEffect(() => {
    return () => {
      // 춤 동작 interval 정리
      if (danceIntervalRef.current) {
        clearInterval(danceIntervalRef.current);
        danceIntervalRef.current = null;
      }
      // 음악 정지
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      // 테미 춤 동작 중지 + 고개 원위치
      if (TemiBridge.isNativeAvailable()) {
        TemiBridge.tiltHead(0);
      }
      console.log("🛑 DancePage 정리: 음악 및 춤 중단");
    };
  }, []);

  /**
   * 이미지와 오디오 파일을 로드하는 함수
   * - Temi 환경: Android 네이티브 함수로 Base64/경로 가져오기
   * - 웹 환경: 일반 상대 경로 사용
   */
  const loadAssets = async () => {
    try {
      if (window.Temi) {
        // ✅ Temi 환경: Android에서 각 노래별로 로드
        console.log("🤖 Temi: 노래 에셋 로딩 시작");

        const loadedSongs = songs.map((song) => {
          const coverData = window.Temi.loadImageAsBase64(song.coverFile);
          const audioPath = window.Temi.getAudioPath(song.audioFile);

          return {
            ...song,
            cover: coverData.startsWith("data:")
              ? coverData
              : `data:image/png;base64,${coverData}`,
            audio: audioPath,
          };
        });

        setSongs(loadedSongs);
        console.log("✅ Temi: 노래 에셋 로딩 완료");
      } else {
        // ✅ 개발 환경: 일반 경로
        console.log("🌐 개발 환경: 일반 경로 사용");

        const loadedSongs = songs.map((song) => ({
          ...song,
          cover: `/songs/${song.coverFile}`,
          audio: `/songs/${song.audioFile}`,
        }));

        setSongs(loadedSongs);
      }
    } catch (error) {
      console.error("❌ 에셋 로드 실패:", error);
    }
  };

  // ========== 이벤트 핸들러 ==========

  /**
   * 노래 선택 함수
   * - 현재 재생중인 음악 정지
   * - 선택한 노래로 변경
   */
  const handleSelectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  /**
   * 재생/일시정지 토글 함수
   * - 재생 시: 테미 음성 안내 + 춤 동작 시작
   * - 일시정지 시: 테미 음성 안내
   */
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
      startDanceMovement();
    }
    setIsPlaying(!isPlaying);
  };

  /**
   * 노래 처음부터 다시 재생
   * - 재생 위치를 0으로 리셋
   */
  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      TemiBridge.speak("처음부터 다시 재생합니다");
    }
  };

  // ========== 테미 로봇 제어 ==========

  /**
   * 테미 춤 동작 함수

   */ const startDanceMovement = () => {
    // 기존 interval 정리
    if (danceIntervalRef.current) {
      clearInterval(danceIntervalRef.current);
    }

    let danceStep = 0; // 춤 동작 단계

    // 500ms마다 다양한 춤 동작 반복
    danceIntervalRef.current = setInterval(() => {
      if (isPlaying && TemiBridge.isNativeAvailable()) {
        switch (danceStep % 8) {
          case 0:
            // 1. 고개 위로 + 오른쪽으로 45도 회전
            TemiBridge.tiltHead(45);
            TemiBridge.turnBy(45, 2.0);
            break;

          case 1:
            // 2. 고개 아래로 + 왼쪽으로 90도 회전
            TemiBridge.tiltHead(-20);
            TemiBridge.turnBy(-90, 2.5);
            break;

          case 2:
            // 3. 고개 정면 + 오른쪽으로 45도
            TemiBridge.tiltHead(0);
            TemiBridge.turnBy(45, 2.0);
            break;

          case 3:
            // 4. 고개 위로 + 제자리에서 회전
            TemiBridge.tiltHead(55);
            TemiBridge.turnBy(180, 3.0);
            break;

          case 4:
            // 5. 고개 아래로 + 왼쪽으로 회전
            TemiBridge.tiltHead(-25);
            TemiBridge.turnBy(-45, 2.0);
            break;

          case 5:
            // 6. 고개 위로 + 오른쪽으로
            TemiBridge.tiltHead(40);
            TemiBridge.turnBy(90, 2.5);
            break;

          case 6:
            // 7. 고개 정면 + 왼쪽으로
            TemiBridge.tiltHead(0);
            TemiBridge.turnBy(-90, 2.0);
            break;

          case 7:
            // 8. 고개 위로 + 오른쪽으로
            TemiBridge.tiltHead(50);
            TemiBridge.turnBy(45, 2.0);
            break;
        }

        danceStep++;
      }
    }, 800); // 800ms마다 동작 변경

    // 음악 이벤트 리스너 등록
    if (audioRef.current) {
      // 일시정지 시: 춤 동작 중지 + 고개 원위치
      audioRef.current.onpause = () => {
        if (danceIntervalRef.current) {
          clearInterval(danceIntervalRef.current);
          danceIntervalRef.current = null;
        }
        TemiBridge.tiltHead(0);
        TemiBridge.stopMovement();
      };

      // 음악 종료 시: 춤 동작 중지 + 고개 원위치 + 재생 상태 변경
      audioRef.current.onended = () => {
        if (danceIntervalRef.current) {
          clearInterval(danceIntervalRef.current);
          danceIntervalRef.current = null;
        }
        TemiBridge.tiltHead(0);
        TemiBridge.stopMovement();
        setIsPlaying(false);
      };
    }
  };

  // ========== 렌더링 ==========

  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <div className="px-41">
        {/* 페이지 제목 */}
        <h1 className="text-6xl font-bold text-slate-800 text-center mb-12">
          춤추기
        </h1>

        {/* 조건부 렌더링: 노래 선택 전 vs 선택 후 */}
        {!currentSong ? (
          // Step1: 노래 선택 화면
          <Step1 songs={songs} onSelectSong={handleSelectSong} />
        ) : (
          // Step2: 재생 화면
          <Step2
            currentSong={currentSong}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onRestart={handleRestart}
          />
        )}

        {/* HTML5 Audio 태그 (숨김) - 선택된 노래가 있을 때만 렌더링 */}
        {currentSong && (
          <audio ref={audioRef} src={currentSong.audio} preload="auto" />
        )}
      </div>
    </div>
  );
};

export default DancePage;
