import WhiteCameraIcon from "../../assets/icons/white_camera.svg?react";
import FrameIcon from "../../assets/icons/frame.svg?react";
import RoundButton from "../RoundButton";
export default function Step3({
  capturedPhoto,
  onRetake,
  onGoToThemeSelect,
  onDirectSend,
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screenp-8">
      {/* 메인 컨테이너 - 파란 테두리 박스 */}
      <div className="bg-white border-[6px] border-blue-400 rounded-3xl shadow-2xl p-2 mb-4 max-w-4xl">
        {/* 촬영된 사진 미리보기 */}
        <div className="bg-gray-600 rounded-2xl overflow-hidden  shadow-xl">
          <img
            src={capturedPhoto}
            alt="촬영된 사진"
            className="w-full h-auto"
            style={{ maxHeight: "80%", objectFit: "contain" }}
          />
        </div>
      </div>
      {/* 버튼 영역 */}
      <div className="flex justify-center gap-6">
        {/* 재촬영 버튼 */}
        <RoundButton icon={<WhiteCameraIcon />} onClick={onRetake} color="gray">
          재촬영
        </RoundButton>
        {/* 프레임 고르기 버튼 */}
        <RoundButton
          icon={<FrameIcon />}
          onClick={onGoToThemeSelect}
          color="black"
        >
          프레임 고르기
        </RoundButton>

        {/* 전송 버튼 */}
        <RoundButton onClick={onDirectSend} color="blue">
          저장하기
        </RoundButton>
      </div>
    </div>
  );
}
