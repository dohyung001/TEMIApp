import { Outlet } from "react-router-dom";
import HomeButton from "../components/HomeButton";

export default function PageLayout() {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 `}
    >
      {/* 홈 버튼 */}
      <HomeButton />
      {/* 페이지 컨텐츠 */}
      <Outlet />
    </div>
  );
}
