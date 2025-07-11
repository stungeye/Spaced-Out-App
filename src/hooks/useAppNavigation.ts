import { useNavigate, useParams } from "react-router-dom";
import { useCallback } from "react";
import type { AnyCard } from "@/lib/types";

/**
 * Unified navigation hook that encapsulates common navigation patterns
 * Provides type-safe navigation methods with learner context
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();
  const { learnerId } = useParams<{ learnerId: string }>();

  const goToDashboard = useCallback(
    (state?: Record<string, unknown>) => {
      if (!learnerId) return;
      navigate(`/${learnerId}/dashboard`, state ? { state } : undefined);
    },
    [navigate, learnerId]
  );

  const goToDashboardHandler = useCallback(() => {
    goToDashboard();
  }, [goToDashboard]);

  const goToSession = useCallback(
    (sessionData: { queue: AnyCard[]; deckName: string; deckId: string }) => {
      if (!learnerId) return;
      navigate(`/${learnerId}/session`, { state: sessionData });
    },
    [navigate, learnerId]
  );

  const goToSettings = useCallback(() => {
    if (!learnerId) return;
    navigate(`/${learnerId}/settings`);
  }, [navigate, learnerId]);

  const goToLearnerSelection = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return {
    goToDashboard,
    goToDashboardHandler,
    goToSession,
    goToSettings,
    goToLearnerSelection,
    learnerId,
  };
};
