// frontend/app.js

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from "./userContext";
import Home from "./components/Home";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import DodajPaketnik from "./components/DodajPaketnik";
import Zgodovina from "./components/Zgodovina"; // Prilagodite pot

function App() {
  const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
  const updateUserData = (userInfo) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

  return (
      <BrowserRouter>
        <UserContext.Provider value={{
          user: user,
          setUserContext: updateUserData
        }}>
          <div className="App">
            <Header title="My application"></Header>
            <Routes>
              <Route path="/" exact element={<Home />}></Route>
              <Route path="/login" exact element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/logout" element={<Logout />}></Route>
              <Route path="/dodaj-paketnik" element={<DodajPaketnik />}></Route>
              <Route path="/zgodovina/:mailboxId" element={<Zgodovina />} /> {/* Prilagodite pot do Zgodovina komponente */}
            </Routes>
          </div>
        </UserContext.Provider>
      </BrowserRouter>
  );
}

export default App;
