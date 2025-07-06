import { Routes, Route } from "react-router-dom";
import LearnerSelectionScreen from "@/pages/LearnerSelectionScreen";
import MainAppLayout from "@/pages/MainAppLayout";
import Dashboard from "@/pages/Dashboard";
import SessionView from "@/pages/SessionView";
import SettingsPage from "@/pages/SettingsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LearnerSelectionScreen />} />
      <Route path="/:learnerId/*" element={<MainAppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="session" element={<SessionView />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
