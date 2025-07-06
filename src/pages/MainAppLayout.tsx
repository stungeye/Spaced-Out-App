import { Outlet, useParams } from "react-router-dom";
import { useLearnerContext } from "@/context/LearnerContext";

function Header() {
  const { state } = useLearnerContext();
  const { learnerId } = useParams<{ learnerId: string }>();

  const learner = state.learners.find((l) => l.id === learnerId);

  return (
    <header className="p-4 bg-card shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Spaced Out</h1>
        {learner && <div className="text-lg">{learner.name}</div>}
      </div>
    </header>
  );
}

export default function MainAppLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
