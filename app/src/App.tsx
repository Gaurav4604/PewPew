import React, { useState, useEffect } from "react";
import Game from "./components/Game";
import "./styles.css";

const App: React.FC = () => {
  // State to hold the current dimensions of the game area
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Effect to handle window resize events
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="App">
      <Game width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default App;
