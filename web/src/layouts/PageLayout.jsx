// web/src/layouts/PageLayout.jsx

import { Outlet } from "react-router-dom";
import HomeButton from "../components/HomeButton";

export default function PageLayout() {
  return (
    <div className="w-[1920px] h-[1200px] flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
      {/* 홈 버튼 - 고정 높이 */}
      <HomeButton />

      {/* 페이지 컨텐츠 - 남은 공간 전체 차지 */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
