import { useNavigate } from "react-router-dom";
import BackButton from "../components/Button";

export default function PhotoPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-rose-500">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <BackButton onClick={() => navigate("/")} />

        <div className="text-center mb-12 mt-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            📷 사진촬영 & 전송
          </h1>
          <p className="text-2xl text-white/90">준비 중입니다</p>
        </div>
      </div>
    </div>
  );
}
