import { createBrowserRouter } from "react-router-dom";

import PageLayout from "../layouts/PageLayout";

import HomePage from "../pages/HomePage";
import NavigationPage from "../pages/NavigationPage";
import InfoPage from "../pages/InfoPage";
import ChatPage from "../pages/ChatPage";
import PhotoPage from "../pages/PhotoPage";
import RecommendPage from "../pages/RecommendPage";
import FortunePage from "../pages/FortunePage";
import SurveyPage from "../pages/SurveyPage";
import NotFoundPage from "../pages/NotFoundPage";
import TestPage from "../pages/TestPage";
const router = createBrowserRouter([
  // 홈 (HomeLayout)
  {
    path: "/",
    element: <HomePage />,
  },
  // 나머지 페이지들 (PageLayout)
  {
    element: <PageLayout />,
    children: [
      { path: "/navigation", element: <NavigationPage /> }, // 길 안내
      { path: "/info", element: <InfoPage /> }, // 행사 및 부스 안내
      { path: "/chat", element: <ChatPage /> }, // 테미랑 대화
      { path: "/photo", element: <PhotoPage /> }, // 사진

      { path: "/recommend", element: <RecommendPage /> }, // 부스 추천
      { path: "/fortune", element: <FortunePage /> }, // 오늘의 운세
      { path: "/survey", element: <SurveyPage /> }, // 설문조사
      { path: "/test", element: <TestPage /> }, // 설문조사
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
