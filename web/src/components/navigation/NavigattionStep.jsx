import InfoQr from "/img/qrs/info_qr.png";

const InfoIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 시설별 아이콘 컴포넌트
const EntranceIcon = () => (
  <svg
    className="w-24 h-24"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  </svg>
);

const ExitIcon = () => (
  <svg
    className="w-24 h-24"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const RestroomIcon = () => (
  <svg
    className="w-24 h-24"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const InfoDeskIcon = () => (
  <svg
    className="w-24 h-24"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function FacilityNavigationStep() {
  const facilities = [
    {
      id: "entrance",
      name: "입구",
      icon: EntranceIcon,
      location: "입구",
      description: "전시장 입구로 안내해드립니다",
    },
    {
      id: "exit",
      name: "출구",
      icon: ExitIcon,
      location: "출구",
      description: "전시장 출구로 안내해드립니다",
    },
    {
      id: "restroom",
      name: "화장실",
      icon: RestroomIcon,
      location: "화장실",
      description: "화장실로 안내해드립니다",
    },
    {
      id: "info",
      name: "안내데스크",
      icon: InfoDeskIcon,
      location: "안내데스크",
      description: "안내데스크로 안내해드립니다",
    },
  ];

  const handleNavigate = (facility) => {
    if (window.TemiInterface) {
      window.TemiInterface.goTo(facility.location || facility.name);
      console.log(`길안내 시작: ${facility.name}`);
    }
  };

  return (
    <div className="flex w-full">
      <div className="w-full px-20 py-12 flex flex-col">
        {/* 헤더 */}
        <div className="flex flex-col w-full gap-2 pb-10 mb-8 border-b-2 border-gray-200 flex-shrink-0">
          <h1 className="text-6xl font-bold text-gray-800">편의시설 안내</h1>
          <p className="text-3xl text-gray-600 mt-2">
            원하시는 장소로 안내해드립니다
          </p>
        </div>

        {/* 시설 버튼 그리드 */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
            {facilities.map((facility) => {
              const IconComponent = facility.icon;
              return (
                <button
                  key={facility.id}
                  onClick={() => handleNavigate(facility)}
                  className="bg-white rounded-3xl p-10 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl border-2 border-gray-100 hover:border-blue-300"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-blue-600">
                      <IconComponent />
                    </div>
                    <h3 className="text-5xl font-bold text-gray-800">
                      {facility.name}
                    </h3>
                    <p className="text-2xl text-gray-600">
                      {facility.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
