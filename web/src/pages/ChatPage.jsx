import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TemiBridge } from "../services/temiBridge";
import BackButton from "../components/Button";

export default function ChatPage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");

  const handleSpeak = () => {
    if (inputText.trim()) {
      TemiBridge.speak(inputText);
      setInputText("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-500">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <BackButton onClick={() => navigate("/")} />

        <div className="text-center mb-12 mt-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🤖 테미랑 대화하기
          </h1>
          <p className="text-2xl text-white/90">
            테미에게 말할 내용을 입력하세요
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-3xl p-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSpeak()}
                placeholder="테미에게 할 말을 입력하세요..."
                className="flex-1 px-6 py-4 text-2xl rounded-2xl bg-white/30 border-2 border-white/40 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/50"
              />
              <button
                onClick={handleSpeak}
                className="px-8 py-4 bg-white text-green-600 font-bold text-2xl rounded-2xl hover:bg-green-50 transition-all"
              >
                🗣️ 말하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
