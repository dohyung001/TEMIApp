import GoHomeIcon from "../assets/icons/home.svg?react";

import { useNavigate } from "react-router-dom";

export default function HomeButton() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };
  return (
    <button
      onClick={handleClick}
      className=" w-[98px] h-[98px] rounded-[20px] flex items-center justify-center bg-[#00083FA0] shadow-[0px_4px_24px_0px_#00000012]"
    >
      <GoHomeIcon />
    </button>
  );
}
