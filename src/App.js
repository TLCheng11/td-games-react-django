import "./App.css";
import HomePage from "./pages/HomePage";
import TicTacToe from "./pages/TicTacToe";

import ReactDOM from "react-dom/client";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [currentUser, setCurrentUser] = useState([])
  const [users, setUsers] = useState([])
  
  const usersList = {}
  if (users.length > 0) {
    users.forEach(user => {
      usersList[user.username] = user.password
    })
  }
  
  // packages for all states and functions to carry down to children
  const loginFormPackage = {currentUser, setCurrentUser}

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage loginFormPackage={loginFormPackage} />}></Route>
        <Route path="/tictactoe" element={<TicTacToe />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
