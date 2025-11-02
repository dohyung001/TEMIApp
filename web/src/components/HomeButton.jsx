import GoHomeIcon from "../assets/icons/go_home.svg?react";

import { useNavigate } from "react-router-dom";

export default function HomeButton() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };
  return (
    <button onClick={handleClick}>
      <GoHomeIcon />
    </button>
  );
}
