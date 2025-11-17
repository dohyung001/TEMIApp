import { useState, useMemo, useEffect } from "react";
import advancedBoothData from "../../constants/advancedBoothData";
import bioHealthBoothData from "../../constants/bioHealthBoothData";
import energyBoothData from "../../constants/energyBoothData";
import ictBoothData from "../../constants/ictBoothData";
import mobilityBoothData from "../../constants/mobilityBoothData";

import SearchIcon from "../../assets/icons/search.svg?react";
import useDebounce from "../../hooks/useDebounce";
import BoothModal from "./BoothModal";
import getBoothColorClass from "../../utils/getBoothColorClass";

export default function NavigationStep2() {
  const [selected, setSelected] = useState("energy");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [boothImages, setBoothImages] = useState({});

  // 300ms debounce 적용
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const dataMap = {
    energy: energyBoothData,
    ict: ictBoothData,
    advanced: advancedBoothData,
    mobility: mobilityBoothData,
    bioHealth: bioHealthBoothData,
  };

  const data = dataMap[selected];

  // 이미지 로드
  useEffect(() => {
    const images = {};

    if (window.Temi && window.Temi.loadBoothImage) {
      // ✅ Temi 환경: Android에서 Base64로 로드
      console.log("🤖 Temi: 부스 이미지 로딩 시작");

      data.forEach((booth) => {
        if (booth.img) {
          try {
            const imageData = window.Temi.loadBoothImage(booth.img);

            if (imageData) {
              images[booth.id] = imageData.startsWith("data:")
                ? imageData
                : `data:image/jpeg;base64,${imageData}`;
            } else {
              console.error(`❌ 로드 실패: ${booth.img}`);
            }
          } catch (error) {
            console.error(`❌ 에러: ${booth.img}`, error);
          }
        }
      });
    } else {
      // ✅ 개발 환경: 일반 경로 사용
      console.log("🌐 개발 환경: 일반 경로 사용");

      data.forEach((booth) => {
        if (booth.img) {
          images[booth.id] = `/${booth.img}`;
        }
      });
    }

    console.log("📸 로드된 이미지:", images);
    setBoothImages(images);
  }, [data]);

  // 검색 필터링
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return data;

    return data.filter((booth) =>
      booth.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [data, debouncedSearchTerm]);

  // Tailwind 클래스를 완전히 작성

  // 길안내 시작
  const handleNavigate = (booth) => {
    if (window.TemiInterface) {
      window.TemiInterface.goTo(booth.location || booth.name);
      console.log(`길안내 시작: ${booth.name}`);
    }
    setSelectedBooth(null);
  };

  return (
    <div className="flex w-full h-screen">
      <aside className="flex-shrink-0">
        <div className="bg-[#D5F7FF] flex mb-7 items-center w-[330px] h-[88px] text-3xl font-semibold rounded-r-full">
          <div className="w-9 h-9 rounded-full bg-[#66E3FF] mr-9 ml-9" />
          체험 프로그램
        </div>
        <div className="flex flex-col gap-9">
          <nav
            className={`flex text-4xl font-bold items-center justify-center rounded-r-3xl cursor-pointer
                ${
                  selected === "energy"
                    ? "bg-[#1D4ED8] w-[552px] h-[120px] text-white"
                    : "bg-white w-[492px] h-[110px]"
                }`}
            onClick={() => setSelected("energy")}
          >
            💡 에너지 및 환경 기술
          </nav>
          <nav
            className={`flex text-4xl font-bold items-center justify-center rounded-r-3xl cursor-pointer
                ${
                  selected === "ict"
                    ? "bg-[#1D4ED8] w-[552px] h-[120px] text-white"
                    : "bg-white w-[492px] h-[110px]"
                }`}
            onClick={() => setSelected("ict")}
          >
            📂 정보통신기술 (ICT)
          </nav>
          <nav
            className={`flex text-4xl font-bold items-center justify-center rounded-r-3xl cursor-pointer
                ${
                  selected === "advanced"
                    ? "bg-[#1D4ED8] w-[552px] h-[120px] text-white"
                    : "bg-white w-[492px] h-[110px]"
                }`}
            onClick={() => setSelected("advanced")}
          >
            🔬 첨단 제조 및 소재
          </nav>
          <nav
            className={`flex text-4xl font-bold items-center justify-center rounded-r-3xl cursor-pointer
                ${
                  selected === "mobility"
                    ? "bg-[#1D4ED8] w-[552px] h-[120px] text-white"
                    : "bg-white w-[492px] h-[110px]"
                }`}
            onClick={() => setSelected("mobility")}
          >
            🚀 미래 모빌리티 및 로봇
          </nav>
          <nav
            className={`flex text-4xl font-bold items-center justify-center rounded-r-3xl cursor-pointer
                ${
                  selected === "bioHealth"
                    ? "bg-[#1D4ED8] w-[552px] h-[120px] text-white"
                    : "bg-white w-[492px] h-[110px]"
                }`}
            onClick={() => setSelected("bioHealth")}
          >
            🧬 바이오 헬스
          </nav>
        </div>
      </aside>

      <div className="w-full px-20 flex flex-col h-[1000px]">
        <div className="flex flex-col w-full gap-2 pb-6 border-b border-slate-800 flex-shrink-0">
          <h1 className="text-5xl font-bold text-slate-800">
            체험 부스 및 경진 대회
          </h1>
          <h2 className="text-3xl font-bold text-slate-600">
            에너지신사업, 이차전지, 에코업, 그린바이오
          </h2>
        </div>

        <div className="mt-8 flex items-center justify-between bg-white py-4 px-6 rounded-full flex-shrink-0">
          <input
            className="text-3xl outline-none w-full font-semibold"
            placeholder="찾으시는 부스를 입력해주세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide mt-8">
          <div className="grid w-full grid-cols-3 gap-4 pb-8">
            {filteredData.length > 0 ? (
              filteredData.map((booth) => (
                <div
                  key={booth.id}
                  onClick={() => setSelectedBooth(booth)}
                  className={`min-h-[120px] text-3xl font-bold justify-center items-center flex p-6 px-12 rounded-2xl cursor-pointer transition-opacity ${getBoothColorClass(
                    selected
                  )}`}
                >
                  {booth.name}
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-3xl text-slate-400 py-20">
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </div>
      </div>

      <BoothModal
        booth={selectedBooth}
        boothImage={selectedBooth ? boothImages[selectedBooth.id] : null}
        onClose={() => setSelectedBooth(null)}
        onNavigate={handleNavigate}
        category={selected}
      />
    </div>
  );
}
