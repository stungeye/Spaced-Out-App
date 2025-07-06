import { Routes, Route } from "react-router-dom";
import LearnerSelectionScreen from "@/pages/LearnerSelectionScreen";
import MainAppLayout from "@/pages/MainAppLayout";
import Dashboard from "@/pages/Dashboard";
import SessionView from "@/pages/SessionView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LearnerSelectionScreen />} />
      <Route path="/:learnerId/*" element={<MainAppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="session" element={<SessionView />} />
        {/* Other nested routes like settings will go here */}
      </Route>
    </Routes>
  );
}

export default App;
