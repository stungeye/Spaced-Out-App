import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useLearnerContext } from "@/context/LearnerContext";

/**
 * Custom hook to get the current learner based on URL params
 * Memoizes the learner lookup for performance
 */
export const useCurrentLearner = () => {
  const { learnerId } = useParams<{ learnerId: string }>();
  const { state } = useLearnerContext();

  const learner = useMemo(
    () => state.learners.find((l) => l.id === learnerId),
    [state.learners, learnerId]
  );

  return { learner, learnerId };
};
