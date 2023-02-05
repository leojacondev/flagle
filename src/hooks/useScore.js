import { useCallback, useState } from "react";
import { loadScore, saveScore } from "../save_local";

export function useScore() { 
  console.log("Chamada função useScore")
  const actualScore = loadScore()
  const [score, setScore] = useState(actualScore);

  const addPoint = useCallback(() => {
      console.log("Chamado Addpoint!")
      let updatedScore = parseInt(actualScore);
      updatedScore++;
      setScore(updatedScore)
      saveScore(updatedScore)
    },
    [score]
  );

  return [score, addPoint];
}
