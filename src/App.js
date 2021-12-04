import "./App.css";
import { useContext, useEffect } from "react";
import { UserContext } from "./utils/UserProvider";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import RequireAuth from "./components/RequireAuth";

function App() {
  const { loadUser } = useContext(UserContext);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <Router>
      <Routes>
        {/*Homepage, different depnding on whether user is authenticated*/}
        <Route path="/" element={<Home />} />{" "}
        {/*Profile - user has to be authenticated*/}
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />{" "}
      </Routes>
    </Router>
  );
}

export default App;
