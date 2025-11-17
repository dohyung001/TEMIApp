import { useState, useEffect } from "react";
import SmallNavigateIcon from "../../assets/icons/small_navigate.svg?react";
import getBoothColorClass from "../../utils/getBoothColorClass";
import { TemiBridge } from "../../services/temiBridge";

export default function BoothModal({ booth, boothImage, onClose, category }) {
  const [canNavigate, setCanNavigate] = useState(false);

  useEffect(() => {
    if (booth) {
      // Temi에 저장된 위치 목록 가져오기
      const locations = TemiBridge.getLocations();

      // booth.location이 Temi 위치 목록에 있는지 확인
      const locationExists = locations.includes(booth.location);
      setCanNavigate(locationExists);
    }
  }, [booth]);

  if (!booth) return null;

  const colorClass = getBoothColorClass(category);

  const handleNavigate = () => {
    if (canNavigate && booth.location) {
      // Temi에 저장된 위치로 이동
      TemiBridge.goTo(booth.location);
      TemiBridge.speak(`${booth.name}로 안내를 시작합니다`);
      onClose(); // 모달 닫기
    } else {
      // 위치가 없을 경우
      TemiBridge.showToast("저장된 위치를 찾을 수 없습니다");
      TemiBridge.speak("죄송합니다. 해당 위치가 등록되어 있지 않습니다");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`${colorClass} rounded-3xl p-8 w-[1000px] max-h-[85vh] relative pt-20`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 인라인 스타일 */}
        <style>{`
          .ios-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .ios-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .ios-scroll::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
          }
          .ios-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
          }
          .ios-scroll::-webkit-scrollbar-button {
            display: none;
          }
        `}</style>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-4xl font-bold text-slate-600 hover:text-slate-800 z-10"
        >
          ✕
        </button>

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div
          className="overflow-y-auto pr-2 ios-scroll"
          style={{
            maxHeight: "calc(85vh - 160px)",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
          }}
        >
          {/* 부스 이미지 */}
          <div className="rounded-2xl p-4 mb-6 bg-white">
            {boothImage ? (
              <img
                src={boothImage}
                alt={booth.name}
                className="w-full h-[400px] object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-2xl">
                이미지 준비중
              </div>
            )}
          </div>

          {/* 부스 정보 */}
          <div className="space-y-6">
            {/* 제목 */}
            <h2 className="text-5xl font-bold text-slate-800">{booth.name}</h2>

            {/* 기본 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-60 rounded-xl p-4">
                <p className="text-xl text-gray-600 mb-1">분야</p>
                <p className="text-2xl font-semibold text-slate-800">
                  {booth.subCategory || booth.category}
                </p>
              </div>
              <div className="bg-white bg-opacity-60 rounded-xl p-4">
                <p className="text-xl text-gray-600 mb-1">참가 대상</p>
                <p className="text-2xl font-semibold text-slate-800">
                  {booth.target || "누구나"}
                </p>
              </div>
              <div className="bg-white bg-opacity-60 rounded-xl p-4">
                <p className="text-xl text-gray-600 mb-1">운영 일정</p>
                <p className="text-2xl font-semibold text-slate-800">
                  {booth.date || "11.26-11.29"}
                </p>
              </div>
              <div className="bg-white bg-opacity-60 rounded-xl p-4">
                <p className="text-xl text-gray-600 mb-1">소요 시간</p>
                <p className="text-2xl font-semibold text-slate-800">
                  약 {booth.duration || 10}분
                </p>
              </div>
            </div>

            {/* 접수 방법 */}
            <div className="bg-white bg-opacity-60 rounded-xl p-4">
              <p className="text-xl text-gray-600 mb-1">접수 방법</p>
              <p className="text-2xl font-semibold text-blue-600">
                {booth.registration || "현장접수"}
              </p>
            </div>

            {/* 프로그램 설명 */}
            <div className="bg-white bg-opacity-60 rounded-xl p-5">
              <h3 className="text-3xl font-bold text-slate-800 mb-3">
                프로그램 소개
              </h3>
              <p className="text-2xl text-slate-700 leading-relaxed">
                {booth.description}
              </p>
            </div>

            {/* 상세 내용 */}
            {booth.details && (
              <div className="bg-white bg-opacity-60 rounded-xl p-5">
                <h3 className="text-3xl font-bold text-slate-800 mb-3">
                  상세 내용
                </h3>
                <p className="text-2xl text-slate-700 leading-relaxed whitespace-pre-line">
                  {booth.details}
                </p>
              </div>
            )}

            {/* 위치 정보 */}
            <div className="bg-white bg-opacity-60 rounded-xl p-4 mb-4">
              <p className="text-xl text-gray-600 mb-1">위치</p>
              <p className="text-2xl font-semibold text-orange-600">
                {booth.location || "전시장 내"}
              </p>
            </div>
            {/* 길안내 버튼 */}
            <button
              onClick={handleNavigate}
              disabled={!canNavigate}
              className={`w-full text-white text-3xl font-bold py-5 rounded-full flex items-center justify-center gap-3 transition-colors mt-6 ${
                canNavigate
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <SmallNavigateIcon className="w-10 h-10" />
              {canNavigate ? "길안내 받기" : "위치 정보 없음"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
