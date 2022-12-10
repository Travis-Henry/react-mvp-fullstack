import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Login from "./components/Login";

function App() {
  const [count, setCount] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  return <div className="App">{loggedIn ? <p>Logged In</p> : <Login />}</div>;
}

export default App;
