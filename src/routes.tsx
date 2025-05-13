import { Route, Routes } from "react-router";
import { LoginPage } from "./pages/login.page";
import { BasicLayout } from "./layout/basic";
import { DashboardPage } from "./pages/dashboard.page";
import AiSurveyFormPage from "./pages/ai-survey.page";
import CreateSurveyPage from "./pages/create-survey.page";
import SurveyEditor from "./pages/create-survey.page";

export const SvqRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BasicLayout />}>
        <Route index element={<LoginPage />} />
      </Route> 
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/ai-survey" element={<AiSurveyFormPage />} />
      <Route path="/create-survey" element={<CreateSurveyPage />} />
      <Route path="/dashboard" element={<SurveyEditor />} />
    </Routes>
  );
};
