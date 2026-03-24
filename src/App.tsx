import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

const Home      = lazy(() => import("./pages/Home"));
const Genres    = lazy(() => import("./pages/Genres"));
const GenrePage = lazy(() => import("./pages/GenrePage"));
const Search    = lazy(() => import("./pages/Search"));

const BASE = import.meta.env.BASE_URL;

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={BASE}>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/genres"        element={<Genres />} />
          <Route path="/genres/:genre" element={<GenrePage />} />
          <Route path="/search"        element={<Search />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
