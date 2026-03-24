import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Genres from "./pages/Genres";
import GenrePage from "./pages/GenrePage";
import Search from "./pages/Search";

const BASE = import.meta.env.BASE_URL;

export default function App() {
  return (
    <BrowserRouter basename={BASE}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/genres/:genre" element={<GenrePage />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}
