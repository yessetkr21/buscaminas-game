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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 pt-4 sm:pt-8">
      {/* Título */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center py-4 sm:py-6">
        BUSCAMINAS 💣
      </h1>

      {/* Botón iniciar */}
      <button
        onClick={startGame}
        className="px-4 py-2 md:px-6 md:py-2 bg-stone-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base mb-4"
      >
        {isStarted ? "🔄 Reiniciar" : "🚀 Iniciar juego"}
      </button>

      {/* Tablero */}
      <div
        className="grid gap-1 sm:gap-2 bg-amber-50 p-3 sm:p-8 rounded-lg shadow-md"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, min(14vw, 4rem)))`,
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

      {/* Mensaje debajo del tablero */}
      {gameOver && (
        <div className="text-center text-red-900 font-bold text-lg md:text-xl mt-3 animate-bounce">
          💥 ¡Has perdido! Inténtalo de nuevo.
        </div>
      )}
      <div className="text-center text-black font-bold font-mono mt-3">
        Creado por @yessetk rodriguez
      </div>
      <div className="flex justify-center mt-1">
  <a
    href="https://github.com/yessetkr21"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="w-6 h-6 fill-white"
    >
      <path d="M173.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM252.8 8c-138.7 0-244.8 105.3-244.8 244 0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1 100-33.2 167.8-128.1 167.8-239 0-138.7-112.5-244-251.2-244zM105.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
    </svg>
    <span className="text-white">Ver en GitHub</span>
  </a>
</div>

    </div>
  );
}
