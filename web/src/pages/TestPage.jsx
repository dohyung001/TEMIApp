import { useState, useEffect } from "react";
import { TemiBridge } from "../services/temiBridge";

export default function TestPage() {
  const [locations, setLocations] = useState([]);
  const [status, setStatus] = useState("준비됨");
  const [inputText, setInputText] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [isNative, setIsNative] = useState(false);
  const [battery, setBattery] = useState({ level: 0, isCharging: false });
  const [robotInfo, setRobotInfo] = useState({ serialNumber: "", version: "" });

  useEffect(() => {
    setIsNative(TemiBridge.isNativeAvailable());
    loadLocations();
    loadRobotInfo();

    const handleLocationStatus = (data) => {
      setStatus(`${data.location}: ${data.status}`);
    };

    TemiBridge.on("locationStatus", handleLocationStatus);

    return () => {
      TemiBridge.off("locationStatus", handleLocationStatus);
    };
  }, []);

  const loadLocations = () => {
    const locs = TemiBridge.getLocations();
    setLocations(locs);
  };

  const loadRobotInfo = () => {
    setBattery(TemiBridge.getBatteryLevel());
    setRobotInfo(TemiBridge.getRobotInfo());
  };

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

  const handleSaveLocation = () => {
    if (newLocation.trim()) {
      const success = TemiBridge.saveLocation(newLocation);
      if (success) {
        setStatus(`"${newLocation}" 위치 저장 완료`);
        setNewLocation("");
        loadLocations();
      } else {
        setStatus(`위치 저장 실패`);
      }
    }
  };

  const handleDeleteLocation = (location) => {
    const success = TemiBridge.deleteLocation(location);
    if (success) {
      setStatus(`"${location}" 위치 삭제 완료`);
      loadLocations();
    }
  };

  return (
    <div className=" text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">🧪 Temi SDK 테스트</h1>
            <div className="flex items-center gap-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold ${
                  isNative ? "bg-green-500" : "bg-yellow-500 text-black"
                }`}
              >
                {isNative ? "🟢 네이티브 모드" : "🟡 개발 모드"}
              </span>
              <button
                onClick={loadRobotInfo}
                className="px-4 py-2 bg-blue-500 rounded-lg text-sm hover:bg-blue-600"
              >
                🔄 새로고침
              </button>
            </div>
          </div>
          <div className="mt-4 text-gray-400 space-y-1">
            <p>📊 상태: {status}</p>
            <p>
              🔋 배터리: {battery.level}% {battery.isCharging ? "⚡충전중" : ""}
            </p>
            <p>📱 시리얼: {robotInfo.serialNumber}</p>
            <p>📦 버전: {robotInfo.version}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 음성 (Speech) */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">🗣️ 음성 출력</h2>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSpeak()}
                placeholder="말할 내용"
                className="flex-1 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-white"
              />
              <button
                onClick={handleSpeak}
                className="px-6 py-2 bg-blue-500 rounded-lg font-bold hover:bg-blue-600"
              >
                말하기
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => TemiBridge.speak("안녕하세요")}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                안녕하세요
              </button>
              <button
                onClick={() => TemiBridge.speak("테미입니다")}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                테미입니다
              </button>
              <button
                onClick={() => TemiBridge.speak("도와드릴까요?")}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                도와드릴까요?
              </button>
              <button
                onClick={() => TemiBridge.speak("감사합니다")}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                감사합니다
              </button>
            </div>
          </div>
        </div>

        {/* 이동 제어 (Movement) */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">🎮 이동 제어</h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                TemiBridge.followMe();
                setStatus("따라오기 모드 활성화");
              }}
              className="px-4 py-3 bg-blue-500 rounded-lg font-bold hover:bg-blue-600"
            >
              👣 따라오기
            </button>
            <button
              onClick={() => {
                TemiBridge.stopMovement();
                setStatus("이동 정지");
              }}
              className="px-4 py-3 bg-red-500 rounded-lg font-bold hover:bg-red-600"
            >
              ⛔ 정지
            </button>
            <button
              onClick={() => {
                TemiBridge.constraintBeWith();
                setStatus("거리 제한 따라오기 활성화");
              }}
              className="px-4 py-3 bg-gray-700 rounded-lg col-span-2 hover:bg-gray-600"
            >
              📏 거리 제한 따라오기
            </button>
          </div>
        </div>

        {/* 머리 제어 (Head Control) */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">🎭 머리 제어</h2>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => TemiBridge.tiltHead(-25)}
                className="px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                ↓ 아래
              </button>
              <button
                onClick={() => TemiBridge.tiltHead(0)}
                className="px-4 py-3 bg-blue-500 rounded-lg font-bold hover:bg-blue-600"
              >
                → 정면
              </button>
              <button
                onClick={() => TemiBridge.tiltHead(55)}
                className="px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                ↑ 위
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => TemiBridge.tiltBy(-10, 0.5)}
                className="px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600"
              >
                ↓ 10도 아래로
              </button>
              <button
                onClick={() => TemiBridge.tiltBy(10, 0.5)}
                className="px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600"
              >
                ↑ 10도 위로
              </button>
            </div>
          </div>
        </div>

        {/* 회전 (Rotation) */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">🔄 회전</h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => TemiBridge.turnBy(-90, 1.0)}
              className="px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              ← 왼쪽 90°
            </button>
            <button
              onClick={() => TemiBridge.turnBy(90, 1.0)}
              className="px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              → 오른쪽 90°
            </button>
            <button
              onClick={() => TemiBridge.turnBy(-45, 1.0)}
              className="px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              ↶ 왼쪽 45°
            </button>
            <button
              onClick={() => TemiBridge.turnBy(45, 1.0)}
              className="px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              ↷ 오른쪽 45°
            </button>
            <button
              onClick={() => TemiBridge.turnBy(180, 1.0)}
              className="px-4 py-3 bg-gray-700 rounded-lg col-span-2 hover:bg-gray-600"
            >
              ↻ 180° 회전
            </button>
          </div>
        </div>

        {/* 위치 관리 (Navigation) */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">📍 위치 관리</h2>

          {/* 위치 저장 */}
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSaveLocation()}
              placeholder="새 위치 이름"
              className="flex-1 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-white"
            />
            <button
              onClick={handleSaveLocation}
              className="px-6 py-2 bg-green-500 rounded-lg font-bold hover:bg-green-600"
            >
              💾 현재 위치 저장
            </button>
            <button
              onClick={loadLocations}
              className="px-6 py-2 bg-blue-500 rounded-lg font-bold hover:bg-blue-600"
            >
              🔄 새로고침
            </button>
          </div>

          {/* 저장된 위치들 */}
          {locations.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {locations.map((loc) => (
                <div
                  key={loc}
                  className="bg-gray-700 rounded-lg p-3 flex items-center justify-between hover:bg-gray-600"
                >
                  <button
                    onClick={() => handleGoTo(loc)}
                    className="flex-1 text-left font-semibold"
                  >
                    📍 {loc}
                  </button>
                  <button
                    onClick={() => handleDeleteLocation(loc)}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              저장된 위치가 없습니다
            </p>
          )}
        </div>

        {/* 조이스틱 (Joystick) */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">🕹️ 조이스틱</h2>

          <div className="grid grid-cols-3 gap-2">
            <div></div>
            <button
              onMouseDown={() => TemiBridge.skidJoy(0, 1.0)}
              onMouseUp={() => TemiBridge.stopMovement()}
              onMouseLeave={() => TemiBridge.stopMovement()}
              className="px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 active:bg-blue-500"
            >
              ⬆️
            </button>
            <div></div>

            <button
              onMouseDown={() => TemiBridge.skidJoy(-1.0, 0)}
              onMouseUp={() => TemiBridge.stopMovement()}
              onMouseLeave={() => TemiBridge.stopMovement()}
              className="px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 active:bg-blue-500"
            >
              ⬅️
            </button>
            <button
              onClick={() => TemiBridge.stopMovement()}
              className="px-4 py-3 bg-red-500 rounded-lg font-bold hover:bg-red-600"
            >
              ⏹️
            </button>
            <button
              onMouseDown={() => TemiBridge.skidJoy(1.0, 0)}
              onMouseUp={() => TemiBridge.stopMovement()}
              onMouseLeave={() => TemiBridge.stopMovement()}
              className="px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 active:bg-blue-500"
            >
              ➡️
            </button>

            <div></div>
            <button
              onMouseDown={() => TemiBridge.skidJoy(0, -1.0)}
              onMouseUp={() => TemiBridge.stopMovement()}
              onMouseLeave={() => TemiBridge.stopMovement()}
              className="px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 active:bg-blue-500"
            >
              ⬇️
            </button>
            <div></div>
          </div>
        </div>

        {/* 유틸리티 */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">🛠️ 유틸리티</h2>

          <div className="space-y-2">
            <button
              onClick={() => TemiBridge.showToast("테스트 토스트 메시지")}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg text-left hover:bg-gray-600"
            >
              💬 토스트 표시
            </button>
            <button
              onClick={loadLocations}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg text-left hover:bg-gray-600"
            >
              🔄 위치 목록 새로고침
            </button>
            <button
              onClick={loadRobotInfo}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg text-left hover:bg-gray-600"
            >
              📊 로봇 정보 업데이트
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
