import { createBrowserRouter } from "react-router-dom";

import PageLayout from "../layouts/PageLayout";

import HomePage from "../pages/HomePage";
import NavigationPage from "../pages/NavigationPage";
import InfoPage from "../pages/InfoPage";
import PlayPage from "../pages/PlayPage";
import PhotoPage from "../pages/PhotoPage";
import RecommendPage from "../pages/RecommendPage";
import FortunePage from "../pages/FortunePage";
import SurveyPage from "../pages/SurveyPage";
import NotFoundPage from "../pages/NotFoundPage";
import TestPage from "../pages/TestPage";
import TestSizePage from "../pages/TestSizePage";

import ChatPage from "../components/play/ChatPage";
import CustomPage from "../components/play/CustomPage";
import DancePage from "../components/play/DancePage";
import NavigattionStep2 from "../components/navigation/NavigattionStep2";
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
      { path: "/navigation/step2", element: <NavigattionStep2 /> },
      { path: "/play", element: <PlayPage /> }, // 테미랑 놀기
      { path: "/play/chat", element: <ChatPage /> },
      { path: "/play/custom", element: <CustomPage /> },
      { path: "/play/dance", element: <DancePage /> },
      { path: "/photo", element: <PhotoPage /> }, // 사진

      { path: "/info", element: <InfoPage /> }, // 행사 및 부스 안내
      { path: "/recommend", element: <RecommendPage /> }, // 부스 추천
      { path: "/fortune", element: <FortunePage /> }, // 오늘의 운세
      { path: "/survey", element: <SurveyPage /> }, // 설문조사

      { path: "/test", element: <TestPage /> }, // 테스트
      { path: "/testsize", element: <TestSizePage /> }, // 테스트 사이즈
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
