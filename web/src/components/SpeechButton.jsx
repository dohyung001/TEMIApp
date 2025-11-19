import RobotIcon from "../assets/icons/white_robot.svg?react";

export default function SpeechButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#1D4ED8] flex  items-center justify-center shadow-lg rounded-full w-28 h-28"
    >
      <RobotIcon className="-mt-1" />
    </button>
  );
}
