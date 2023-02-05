export function loadScore() {
  const savedScore = localStorage.getItem("score");
  return savedScore != null ? savedScore : 0;
}

export function saveScore(score) {
  localStorage.setItem(
    "score",
    parseInt(score)
  );
}
