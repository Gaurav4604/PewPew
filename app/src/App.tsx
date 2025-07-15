import React from "react";
import Game from "./components/Game";

const App: React.FC = () => {
  return (
    <div className="App">
      <Game width={800} height={600} />
    </div>
  );
};

export default App;
