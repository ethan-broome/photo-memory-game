export function pickRounds(cache) {
  return cache.sort(() => Math.random() - 0.5).slice(0, 5);
}

export function calculateScore(guess, actual) {
  const cleanActual = actual.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");

  const guessDate = new Date(guess);
  const actualDate = new Date(cleanActual);

  const diffMinutes = Math.abs(actualDate - guessDate) / (1000 * 60);
  const score = Math.max(
    100,
    1000 *
      Math.exp(
        (-Math.log(1000 / 100) * Math.pow(diffMinutes, 0.5)) /
          Math.pow(60 * 24 * 365, 0.5),
      ),
  );

  return score;
}

export function formatDate(dateString) {
  const clean = dateString.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
  const date = new Date(clean);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
