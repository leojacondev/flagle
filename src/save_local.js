export function loadScore() {
  const savedScore = localStorage.getItem("score");
  return savedScore != null ? savedScore : 0;
}

export function saveScore(score) {
  const lastScore = loadScore();
  localStorage.setItem(
    "score",
    parseInt(score)
  );
}
