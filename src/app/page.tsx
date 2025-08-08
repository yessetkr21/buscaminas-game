"use client";
import { useState } from "react";

export default function Home() {
  const size = 6; // Tablero de 6x6
  const totalCells = size * size;
  const totalMines = 6;

  const [mines, setMines] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>(
    Array(totalCells).fill(false)
  );
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const startGame = () => {
    const minePositions = new Set<number>();
    while (minePositions.size < totalMines) {
      minePositions.add(Math.floor(Math.random() * totalCells));
    }
    setMines([...minePositions]);
    setRevealed(Array(totalCells).fill(false));
    setGameOver(false);
    setIsStarted(true);
  };

  const getNeighborMineCount = (index: number) => {
    const row = Math.floor(index / size);
    const col = index % size;
    let count = 0;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < size && c >= 0 && c < size) {
          const neighborIndex = r * size + c;
          if (mines.includes(neighborIndex)) {
            count++;
          }
        }
      }
    }

    return count;
  };

  const handleClick = (index: number) => {
    if (!isStarted || gameOver || revealed[index]) return;

    if (mines.includes(index)) {
      setGameOver(true);
      setRevealed(Array(totalCells).fill(true));
      return;
    }

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col px-4">
      <div className="flex justify-center py-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
          BUSCAMINAS 💣
        </h1>
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={startGame}
          className="px-4 py-2 md:px-6 md:py-2 bg-stone-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
        >
          {isStarted ? "🔄 Reiniciar" : "🚀 Iniciar juego"}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div
          className="grid gap-1 sm:gap-2 bg-amber-50 p-3 sm:p-8 rounded-lg shadow-md"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, min(12vw, 4rem)))`,
          }}
        >
          {Array.from({ length: totalCells }, (_, index) => (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className={`flex items-center justify-center text-xs sm:text-lg font-bold rounded-lg cursor-pointer transition-colors
                ${
                  revealed[index]
                    ? "bg-white text-black border border-gray-400"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              style={{
                aspectRatio: "1 / 1",
                minWidth: "2.2rem",
                maxWidth: "4rem",
              }}
            >
              {revealed[index] || gameOver
                ? mines.includes(index)
                  ? "💣"
                  : getNeighborMineCount(index)
                : ""}
            </div>
          ))}
        </div>
      </div>

      {gameOver && (
        <div className="text-center text-red-900 font-bold text-lg md:text-xl mt-6 animate-bounce">
          💥 ¡Has perdido! Inténtalo de nuevo.
        </div>
      )}
    </div>
  );
}

