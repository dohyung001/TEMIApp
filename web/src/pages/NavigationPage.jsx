import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TemiBridge } from "../services/temiBridge";
import BackButton from "../components/Button";

export default function NavigationPage() {
  const navigate = useNavigate();
  const [locations] = useState(TemiBridge.getLocations());

  const handleGoTo = (location) => {
    TemiBridge.speak(`${location}으로 안내하겠습니다. 따라오세요!`);
    TemiBridge.goTo(location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-500">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <BackButton onClick={() => navigate("/")} />

        <div className="text-center mb-12 mt-8">
          <h1 className="text-5xl font-bold text-white mb-4">✈️ 길 안내</h1>
          <p className="text-2xl text-white/90">
            가고 싶은 장소를 선택하거나 말씀해주세요
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => handleGoTo(location)}
              className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-3xl p-8 hover:bg-white/30 hover:scale-105 transition-all"
            >
              <div className="text-6xl mb-4">📍</div>
              <h3 className="text-2xl font-bold text-white">{location}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
