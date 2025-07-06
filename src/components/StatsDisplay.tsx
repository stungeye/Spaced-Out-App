import React from "react";

interface StatsDisplayProps {
  correct: number;
  incorrect: number;
  streak: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  correct,
  incorrect,
  streak,
}) => {
  return (
    <div className="flex justify-around p-4 bg-gray-100 rounded-lg">
      <div className="text-center">
        <p className="text-2xl font-bold text-green-500">{correct}</p>
        <p className="text-sm text-gray-600">Correct</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-red-500">{incorrect}</p>
        <p className="text-sm text-gray-600">Incorrect</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-blue-500">{streak}</p>
        <p className="text-sm text-gray-600">Streak</p>
      </div>
    </div>
  );
};

export default StatsDisplay;
