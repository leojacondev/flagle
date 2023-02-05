import { useCallback, useState } from "react";

export function useGuesses() { 
  const [guesses, setGuesses] = useState([]);

  const addGuess = useCallback(newGuess => {
      const newGuesses = [...guesses, newGuess];
      setGuesses(newGuesses);
    },
    [guesses]
  );

  return [guesses, addGuess];
}
