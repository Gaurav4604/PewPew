import React, { useRef, useEffect } from "react";
import { GameEngine } from "../game/GameEngine";

interface GameProps {
  width: number;
  height: number;
}

const Game: React.FC<GameProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // If the game engine doesn't exist, create it
    if (!gameEngineRef.current) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      gameEngineRef.current = new GameEngine(ctx, width, height);
      gameEngineRef.current.start();
    } else {
      // If it exists, just call the resize method
      gameEngineRef.current.resize(width, height);
    }

    // Stop the engine on component unmount
    return () => {
      // The null check is needed in React 18 StrictMode
      if (gameEngineRef.current) {
        gameEngineRef.current.stop();
        gameEngineRef.current = null;
      }
    };
  }, [width, height]);

  const handleClick = () => {
    gameEngineRef.current?.handleClick();
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={handleClick}
      style={{ display: "block" }}
    />
  );
};

export default Game;
