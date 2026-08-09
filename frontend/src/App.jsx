import { useState } from "react";
import { useEffect } from "react";
import { pickRounds, calculateScore, formatDate } from "./game";

function MemoryWall({ photos }) {
  const wallPhotos = photos.slice(0, 20);

  return (
    <div className="memory-container">
      <div
        className={`memory-wall ${wallPhotos.length > 0 ? "scrolling" : ""}`}
      >
        <div className="wall-set">
          {wallPhotos.map((photo, index) => (
            <img
              key={index}
              src={`http://127.0.0.1:5000/images?path=${encodeURIComponent(photo.path)}`}
              alt=""
            />
          ))}
        </div>

        <div className="wall-set">
          {wallPhotos.map((photo, index) => (
            <img
              key={index}
              src={`http://127.0.0.1:5000/images?path=${encodeURIComponent(photo.path)}`}
              alt=""
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreenFade({ children }) {
  return <div className="screen-fade">{children}</div>;
}

function App() {
  const [screen, setScreen] = useState("start");
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [lastScore, setLastScore] = useState(0);
  const [lastActual, setLastActual] = useState("");
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/cache")
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data);
        setRounds(pickRounds(data));
      });
  }, []);

  function handleSubmit() {
    const actual = rounds[currentRound].timestamp;
    const score = calculateScore(guess, actual);
    setLastScore(score);
    setLastActual(actual);
    setTotalScore(totalScore + score);
    setScreen("result");
  }

  function handleNext() {
    if (currentRound + 1 >= 5) {
      setScreen("end");
    } else {
      setCurrentRound(currentRound + 1);
      setGuess("");
      setScreen("round");
    }
  }

  function handleRestart() {
    fetch("http://127.0.0.1:5000/cache")
      .then((res) => res.json())
      .then((data) => setRounds(pickRounds(data)));
    setCurrentRound(0);
    setTotalScore(0);
    setGuess("");
    setScreen("start");
  }

  return (
    <>
      {(screen === "start" || screen === "end") && (
        <MemoryWall photos={photos} />
      )}

      <div key={screen} className="page">
        <div className="card">
          {screen === "start" && (
            <div>
              <h1>Photo Guesser!</h1>
              <p>{photos.length} Memories to Guess...</p>
              <button onClick={() => setScreen("round")}>Play</button>
            </div>
          )}

          {screen === "round" && rounds.length > 0 && (
            <div className="card">
              <h2>Round {currentRound + 1} of 5</h2>
              <img
                src={`http://127.0.0.1:5000/images?path=${encodeURIComponent(rounds[currentRound].path)}`}
                alt="memory"
                style={{ maxWidth: "500px" }}
              />
              <div>
                <label>Your guess:</label>
                <input
                  type="datetime-local"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                />
              </div>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          )}

          {screen === "result" && (
            <div className="card">
              <h2>Round {currentRound + 1} Result</h2>
              <p>Your guess: {formatDate(guess)}</p>
              <p>Actual: {formatDate(lastActual)}</p>
              <p>Score: {Math.round(lastScore)} / 1000</p>
              <p>
                Total: {Math.round(totalScore)} / {(currentRound + 1) * 1000}
              </p>
              <button onClick={handleNext}>
                {currentRound + 1 >= 5 ? "See Final Score" : "Next Round"}
              </button>
            </div>
          )}

          {screen === "end" && (
            <>
              <div className="card">
                <h2>Game Over</h2>
                <p>Final Score: {Math.round(totalScore)} / 5000</p>
                <button onClick={handleRestart}>Play Again</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
