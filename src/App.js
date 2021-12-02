import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";

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
      {/* <header className="App-header">
        Testing with the backend....
        <p>The current time is {currentTime}.</p>
        Hello this a good test.
        <button onClick={refreshTime}>Refresh the time!</button>
      </header> */}
      <LandingPage />
    </div>
  );
}

export default App;
