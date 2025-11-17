// web/src/App.jsx

import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import router from "./routes";

function App() {
  // body의 overflow 제거
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div
      style={{
        width: "1920px",
        height: "1200px",
        transformOrigin: "top left",
        transform: "scale(0.6667)",
        //overflow: "hidden",
      }}
    >
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
