import { useNavigate } from "react-router-dom";
import { TemiBridge } from "../services/temiBridge";
import DanceIcon from "../assets/icons/dance.svg?react";
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

export default function HomePage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "info",
      icon: <InfoIcon />,
      title: "행사 안내",
      path: "/info",
    },
    {
      id: "chat",
      icon: <DanceIcon />,
      title: "노래 맞춰 <br/>춤 추기",
      path: "/dance",
    },
    {
      id: "fortune",
      icon: <FortuneIcon />,
      title: "오늘의 운세",
      path: "/fortune",
    },
    {
      id: "recommend",
      icon: <StarIcon />,
      title: "부스<br />추천 받기",
      path: "/recommend",
    },
    {
      id: "photo",
      icon: <CameraIcon />,
      title: "사진촬영<br /> & 전송",
      path: "/photo",
    },
    {
      id: "survey",
      icon: <SurveyIcon />,
      title: "의견<br />남기기",
      path: "/survey",
    },
  ];

  const handleMenuClick = (path, title) => {
    TemiBridge.speak(`${title} 화면으로 이동합니다`);
    navigate(path);
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 px-20 flex flex-col h-full">
      {/* 상단 헤더 - 높이 축소 */}
      <div className="flex items-center justify-center px-8 py-2 text-5xl text-slate-800 flex-shrink-0">
        <BlueRobotIcon />
        <p> &nbsp;안녕하세요, </p>
        <h4 className="font-bold">&nbsp;TEMI</h4>
        <p>예요.</p>
      </div>

      {/* 메인 컨텐츠 - flex-1로 남은 공간 모두 차지 */}
      <div className="flex-1 flex flex-col pt-16 relative min-h-0">
        {/* 말풍선 */}
        <div className="absolute -top-8 left-0 z-10">
          <SpeechBubble icon={<LocationIcon />}>
            로봇이 직접 안내해드려요!
          </SpeechBubble>
        </div>

        {/* 그리드 컨테이너 - 높이 확보 */}
        <div className="grid grid-cols-4 gap-6 h-[800px] ">
          {/* 길 안내 (큰 카드) */}
          <div className="col-span-1 row-span-2 pr-3">
            <button
              onClick={() => handleMenuClick("/navigation", "길 안내")}
              className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 flex flex-col items-center justify-center text-white shadow-[0_12px_48px_rgba(37,99,235,0.35)] border-2 border-blue-500 hover:scale-[1.02] transition-transform"
            >
              <div className="text-8xl mb-6">
                <NavIcon />
              </div>
              <h2 className="text-5xl font-bold mb-3 leading-tight">
                부스 정보
                <br />& 길 안내
              </h2>
              <p className="text-blue-100 text-2xl">
                체험부스 정보를 보고 길을 <br />
                안내 받을 수 있어요
              </p>
            </button>
          </div>

          {/* 나머지 메뉴들 */}
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path, item.title)}
              className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center justify-center text-slate-800 hover:scale-[1.02] transition-transform"
            >
              <div className="mb-4">{item.icon}</div>
              <h3
                className="text-5xl font-bold text-center text-slate-800"
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
            </button>
          ))}
        </div>

        {/* 하단 안내 - 높이 축소 */}
        <div className="flex mt-4 items-center justify-end">
          <div className="w-6 h-6 rounded-full bg-slate-400 text-gray-200 flex items-center justify-center text-sm font-bold mr-1">
            i
          </div>
          <p className="flex text-end text-2xl text-slate-500 ">
            본 서비스는 we-meet 수업의 프로젝트 결과물로 제작되었습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
