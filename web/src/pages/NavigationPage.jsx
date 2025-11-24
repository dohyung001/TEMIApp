import { useNavigate } from "react-router-dom";
import NavigateIcon from "../assets/icons/navigate.svg?react";
import AngleButton from "../components/AngleButton";
import Divider from "../components/Divider";

export default function NavigationPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center pt-20">
      <NavigateIcon />

      <h1 className="text-6xl font-bold mt-12 mb-8">길 찾기</h1>

      <p className="text-3xl text-slate-600">원하는 목적지를 선택하면</p>

      <p className="text-3xl text-slate-600">
        테미가 <span className="text-[#1D4ED8] font-bold">직접</span> 목적지로
        안내해드려요
      </p>

      <Divider />
      <div className="flex gap-4">
        <AngleButton onClick={() => navigate("/navigation/step1")}>
          편의 시설
        </AngleButton>
        <AngleButton onClick={() => navigate("/navigation/step2")}>
          체험 부스
        </AngleButton>
      </div>
    </div>
  );
}
