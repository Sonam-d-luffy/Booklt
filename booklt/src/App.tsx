import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Post from "./Pages/Post";
import AdminLogin from "./Pages/AdminLogin";
import Promo from "./Pages/Promo";
import Book from "./Pages/Book";
import Details from "./Pages/Details";
import YourBookings from "./Pages/YourBookings";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/post" element={<Post />} />
        <Route path="/promo" element={<Promo />} />
        <Route path="/book" element={<Book />} />
        <Route path="/:expId/details" element={<Details />} />
        <Route path="/yourBookings/:userId" element={<YourBookings />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
