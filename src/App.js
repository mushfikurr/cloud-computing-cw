import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    refreshTime();
  }, []);

  const refreshTime = () => {
    fetch("/time")
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        Testing with the backend....
        <p>The current time is {currentTime}.</p>
        <button onClick={refreshTime}>Refresh the time!</button>
      </header>
    </div>
  );
}

export default App;
