import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import "./App.css";
import nameData from "./assets/names.json";

// 1. PASTE YOUR NAMES HERE
const INITIAL_NAMES = [...new Set(nameData.names)];

function App() {
  const [candidates, setCandidates] = useState(INITIAL_NAMES);
  const [winners, setWinners] = useState([]);
  const [currentDisplay, setCurrentDisplay] = useState("WAITING FOR INPUT...");
  const [isScanning, setIsScanning] = useState(false);

  const intervalRef = useRef(null);

  const startDecryption = () => {
    if (winners.length >= 3 || candidates.length === 0) return;

    setIsScanning(true);
    let duration = 3000; // 3 seconds of "hacking"

    // The "Matrix" cycling effect
    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      setCurrentDisplay(candidates[randomIndex]);
    }, 50); // Speed of text change

    // Stop after 3 seconds
    setTimeout(() => {
      clearInterval(intervalRef.current);
      finalizeWinner();
    }, duration);
  };

  const finalizeWinner = () => {
    // eslint-disable-next-line react-hooks/purity
    const winningIndex = Math.floor(Math.random() * candidates.length);
    const winnerName = candidates[winningIndex];

    setCurrentDisplay(winnerName);
    setWinners((prev) => [...prev, winnerName]);

    setCandidates((prev) => prev.filter((_, i) => i !== winningIndex));
    setIsScanning(false);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#0f0", "#0ff", "#000"], // Cyber colors
    });
  };

  return (
    <div className="container">
      <div className="scan-line"></div>

      <h1 className="title">AOU FCS // Tech Fusion CLub</h1>

      <div className="scanner-box">
        <div className="display-name">
          {isScanning ? (
            <span style={{ opacity: 0.7 }}>{currentDisplay}</span>
          ) : (
            <span>{currentDisplay}</span>
          )}
        </div>
      </div>

      <div className="winners-list">
        {winners.map((name, index) => (
          <div key={index} className="winner-card">
            <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
              WINNER_0{index + 1}
            </div>
            <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{name}</div>
          </div>
        ))}

        {/* Empty slots placeholders */}
        {[...Array(3 - winners.length)].map((_, i) => (
          <div
            key={`empty-${i}`}
            className="winner-card"
            style={{ borderStyle: "dashed", opacity: 0.3 }}
          >
            DETECTING...
          </div>
        ))}
      </div>

      <button
        className="btn-hack"
        onClick={startDecryption}
        disabled={isScanning || winners.length >= 3}
      >
        {winners.length >= 3
          ? "Congratulations!"
          : isScanning
            ? "Hmm, Let's see..."
            : "WHO'S THE LUCKY ONE?"}
      </button>
    </div>
  );
}

export default App;
