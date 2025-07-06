import { useLearnerContext } from "@/context/LearnerContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LearnerSelectionScreen() {
  const { state, dispatch } = useLearnerContext();
  const [newLearnerName, setNewLearnerName] = useState("");
  const navigate = useNavigate();

  const handleAddLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLearnerName.trim()) {
      const newLearner = {
        name: newLearnerName.trim(),
        sessionIndex: 0,
        decks: [],
      };
      dispatch({ type: "ADD_LEARNER", payload: newLearner });
      setNewLearnerName("");
    }
  };

  const selectLearner = (learnerId: string) => {
    dispatch({ type: "SET_ACTIVE_LEARNER", payload: learnerId });
    navigate(`/${learnerId}/dashboard`);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold tracking-tight">Spaced Out</h1>
        <p className="text-muted-foreground">Select a learner to begin.</p>
      </div>
      <div className="mb-8 bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Who is learning?</h2>
        <ul className="space-y-2">
          {state.learners.map((learner) => (
            <li key={learner.id}>
              <Button
                variant="outline"
                onClick={() => selectLearner(learner.id)}
                className="w-full text-left justify-start p-6 text-lg"
              >
                {learner.name}
              </Button>
            </li>
          ))}
        </ul>
        {state.learners.length === 0 && (
          <p className="text-sm text-center text-muted-foreground py-4">
            No learners have been created yet.
          </p>
        )}
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Create New Learner</h2>
        <form onSubmit={handleAddLearner} className="flex gap-2">
          <input
            type="text"
            value={newLearnerName}
            onChange={(e) => setNewLearnerName(e.target.value)}
            placeholder="Enter learner's name"
            className="p-2 border rounded flex-grow bg-transparent"
          />
          <Button type="submit">Create</Button>
        </form>
      </div>
    </div>
  );
}
