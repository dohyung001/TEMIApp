import { useState, useEffect } from "react";
import { TemiBridge } from "../services/temiBridge";

function App() {
  const [locations, setLocations] = useState([]);
  const [status, setStatus] = useState("준비됨");
  const [inputText, setInputText] = useState("");
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    // 네이티브 환경 체크
    setIsNative(TemiBridge.isNativeAvailable());

    // 저장된 위치 가져오기
    const locs = TemiBridge.getLocations();
    setLocations(locs);

    // 위치 상태 리스너
    const handleLocationStatus = (data) => {
      setStatus(`${data.location}: ${data.status}`);
    };

    TemiBridge.on("locationStatus", handleLocationStatus);

    return () => {
      TemiBridge.off("locationStatus", handleLocationStatus);
    };
  }, []);

  const handleSpeak = () => {
    if (inputText.trim()) {
      TemiBridge.speak(inputText);
      setInputText("");
    }
  };

  const handleGoTo = (location) => {
    TemiBridge.goTo(location);
    setStatus(`${location}으로 이동 중...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              🤖 Temi Controller
            </h1>
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isNative
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-black"
                }`}
              >
                {isNative ? "🟢 Temi 연결됨" : "🟡 개발 모드"}
              </span>
              <span className="text-white/80">상태: {status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* 음성 출력 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🗣️ 음성 출력
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSpeak()}
              placeholder="말할 내용을 입력하세요"
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              onClick={handleSpeak}
              className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all hover:scale-105"
            >
              말하기
            </button>
          </div>
        </div>

        {/* 위치 이동 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            📍 위치 이동
          </h2>
          {locations.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleGoTo(loc)}
                  className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all hover:scale-105 border border-white/30"
                >
                  📍 {loc}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-white/70">저장된 위치가 없습니다</p>
          )}
        </div>

        {/* 이동 제어 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🎮 이동 제어
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => TemiBridge.followMe()}
              className="flex-1 px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all hover:scale-105"
            >
              👣 따라오기
            </button>
            <button
              onClick={() => TemiBridge.stopMovement()}
              className="flex-1 px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all hover:scale-105"
            >
              ⛔ 정지
            </button>
          </div>
        </div>

        {/* 머리 제어 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🎭 머리 각도
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => TemiBridge.tiltHead(-25)}
              className="flex-1 px-6 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all hover:scale-105"
            >
              ↓ 아래로
            </button>
            <button
              onClick={() => TemiBridge.tiltHead(0)}
              className="flex-1 px-6 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all hover:scale-105"
            >
              → 정면
            </button>
            <button
              onClick={() => TemiBridge.tiltHead(55)}
              className="flex-1 px-6 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all hover:scale-105"
            >
              ↑ 위로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
