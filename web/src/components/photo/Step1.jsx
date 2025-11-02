import BigCameraIcon from "../../assets/icons/big_camera.svg?react";
import RightArrowIcon from "../../assets/icons/right_arrow.svg?react";
import AngleButton from "../AngleButton";
import Divider from "../Divider";

export default function Step1Intro({ onStart }) {
  return (
    <div className="flex flex-col items-center mt-5">
      <BigCameraIcon />
      <h1 className="text-6xl font-bold mb-8">기념 사진을 남겨보세요</h1>
      <p className="text-3xl  text-slate-600">사진을 촬영한 후에</p>
      <p className="text-3xl text-slate-600">개인 핸드폰으로 전송해 드려요</p>
      <Divider />

      <AngleButton onClick={onStart} icon={<RightArrowIcon />}>
        시작하기
      </AngleButton>
    </div>
  );
}
