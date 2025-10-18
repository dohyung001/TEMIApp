// src/pages/NotFoundPage.jsx
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-white mb-8">페이지를 찾을 수 없습니다</p>
        <Button onClick={() => navigate("/")}>홈으로</Button>
      </div>
    </div>
  );
}

// App.jsx에 추가
