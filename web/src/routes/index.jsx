import { createBrowserRouter } from "react-router-dom";

import PageLayout from "../layouts/PageLayout";

import HomePage from "../pages/HomePage";
import NavigationPage from "../pages/NavigationPage";
import InfoPage from "../pages/InfoPage";
import PhotoPage from "../pages/PhotoPage";
import RecommendPage from "../pages/RecommendPage";
import FortunePage from "../pages/FortunePage";
import SurveyPage from "../pages/SurveyPage";
import NotFoundPage from "../pages/NotFoundPage";
import TestPage from "../pages/TestPage";
import TestSizePage from "../pages/TestSizePage";

import DancePage from "../pages/DancePage";
import DancePlayPage from "../components/dance/DancePlayPage";
import NavigattionStep2 from "../components/navigation/NavigattionStep2";
import NavigattionStep from "../components/navigation/NavigattionStep";
const router = createBrowserRouter([
  // 나머지 페이지들 (PageLayout)
  {
    path: "/",
    element: <PageLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/navigation", element: <NavigationPage /> }, // 길 안내
      { path: "/navigation/step2", element: <NavigattionStep2 /> },
      { path: "/navigation/step1", element: <NavigattionStep /> },

      { path: "/dance", element: <DancePage /> },
      { path: "/dance/:songId", element: <DancePlayPage /> },
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
