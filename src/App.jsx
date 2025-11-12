import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UserDetails from "./pages/UserDetails";

const App = () => {
  const [users, setUsers] = useState([]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home users={users} setUsers={setUsers} />} />
        <Route 
          path="/user/:id" 
          element={<UserDetails users={users} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
