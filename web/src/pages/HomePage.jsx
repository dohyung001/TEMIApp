import { useNavigate } from "react-router-dom";
import { TemiBridge } from "../services/TemiBridge";
import RobotIcon from "../assets/icons/robot.svg?react";
import BlueRobotIcon from "../assets/icons/blue_robot.svg?react";
import CameraIcon from "../assets/icons/camera.svg?react";
import FortuneIcon from "../assets/icons/fortune.svg?react";
import InfoIcon from "../assets/icons/info.svg?react";
import NavIcon from "../assets/icons/nav.svg?react";
import StarIcon from "../assets/icons/star.svg?react";
import SurveyIcon from "../assets/icons/survey.svg?react";
import LocationIcon from "../assets/icons/location.svg?react";
import GlobalIcon from "../assets/icons/global.svg?react";
import SpeechBubble from "../components/SpeechBubble";
import LangBUtton from "../components/LangButton";

export default function HomePage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "navigation",
      icon: <NavIcon />,
      title: "길 안내",
      path: "/navigation",
    },
    {
      id: "booth",
      icon: <InfoIcon />,
      title: "행사 및<br />부스 안내",
      path: "/booth",
    },
    {
      id: "chat",
      icon: <RobotIcon />,
      title: "테미랑 <br /> 대화하기",
      path: "/chat",
    },
    {
      id: "photo",
      icon: <CameraIcon />,
      title: "사진촬영<br /> & 전송",
      path: "/photo",
    },
    {
      id: "recommend",
      icon: <StarIcon />,
      title: "부스 추천 받기",
      path: "/favorite",
    },
    {
      id: "fortune",
      icon: <FortuneIcon />,
      title: "오늘의 운세",
      path: "/schedule",
    },
    { id: "survey", icon: <SurveyIcon />, title: "설문조사", path: "/survey" },
  ];

  const handleMenuClick = (path, title) => {
    TemiBridge.speak(`${title} 화면으로 이동합니다`);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-40 flex flex-col relative">
      {/* 상단 컨트롤러 */}
      <div className="flex justify-end">
        <LangBUtton icon={<GlobalIcon />}> Language</LangBUtton>
      </div>
      {/* 상단 헤더 */}
      <div className="flex items-center justify-center px-8 py-4 text-5xl text-slate-800">
        <BlueRobotIcon />
        <p> &nbsp;안녕하세요, </p>
        <h4 className="font-bold">&nbsp;TEMI</h4>
        <p>예요.</p>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col justify-center mt-14">
        {/* 그리드 컨테이너 */}
        <div className="grid grid-cols-4 gap-6 flex-1 relative">
          {/* 말풍선  */}
          <div className="absolute top-[-100px] left-0 z-10">
            <SpeechBubble icon={<LocationIcon />}>
              로봇이 직접 안내해드려요!
            </SpeechBubble>
          </div>

          {/* 길 안내 (큰 카드) */}
          <div className="col-span-1 row-span-2 pr-3">
            <button
              onClick={() => handleMenuClick("/navigation", "길 안내")}
              className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 flex flex-col items-center justify-center text-white shadow-[0_12px_48px_rgba(37,99,235,0.35)] border-2 border-blue-500"
            >
              <div className="text-8xl mb-6">
                <NavIcon />
              </div>
              <h2 className="text-5xl font-bold mb-2">길 안내</h2>
              <p className="text-blue-100 text-2xl">목적지를 말씀해주세요</p>
            </button>
          </div>

          {/* 나머지 메뉴들 */}
          {menuItems.slice(1).map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path, item.title)}
              className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center justify-center text-slate-800"
            >
              <div className="mb-4">{item.icon}</div>
              <h3
                className="text-5xl font-bold text-center text-slate-800"
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
            </button>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-3xl">
            터치하거나 음성으로 명령해주세요
          </p>
        </div>
      </div>
    </div>
  );
}
