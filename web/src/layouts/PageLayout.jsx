import { useNavigate } from "react-router-dom";
import BackButton from "../components/Button";
import { Outlet } from "react-router-dom";

export default function PageLayout() {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen bg-gradient-to-br `}>
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <BackButton onClick={() => navigate("/")} />

        {/* 페이지 컨텐츠 */}
        <Outlet />
      </div>
    </div>
  );
}
