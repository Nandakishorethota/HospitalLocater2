import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import FindHospitals from "./pages/FindHospitals.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/hospitals" element={<FindHospitals />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
