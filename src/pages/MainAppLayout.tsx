import { Outlet, useParams, Link } from "react-router-dom";
import { useLearnerContext } from "@/context/LearnerContext";

function Header() {
  const { state } = useLearnerContext();
  const { learnerId } = useParams<{ learnerId: string }>();

  const learner = state.learners.find((l) => l.id === learnerId);

  return (
    <header className="p-4 bg-card shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to={`/${learnerId}/dashboard`}>Spaced Out</Link>
        </h1>
        <div className="flex items-center gap-4">
          {learner && <div className="text-lg">{learner.name}</div>}
          <Link
            to={`/${learnerId}/settings`}
            className="text-lg hover:underline"
          >
            Settings
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function MainAppLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow p-4">
        <Outlet />
      </main>
    </div>
  );
}
