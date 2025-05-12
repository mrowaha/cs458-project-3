import { Route, Routes } from "react-router";
import { LoginPage } from "./pages/login.page";
import { BasicLayout } from "./layout/basic";
import { DashboardPage } from "./pages/dashboard.page";
import AiSurveyFormPage from "./pages/ai-survey.page";

export const SvqRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/ai-survey" element={<AiSurveyFormPage />} />
      <Route path="/auth" element={<BasicLayout />}>
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
};
