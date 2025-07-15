import React, { useRef, useEffect } from "react";
import { GameEngine } from "../game/GameEngine";

interface GameProps {
  width: number;
  height: number;
}

const Game: React.FC<GameProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameEngine = new GameEngine(ctx, width, height);
    gameEngine.start();

    // Cleanup on component unmount
    return () => {
      gameEngine.stop();
    };
  }, [width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default Game;
