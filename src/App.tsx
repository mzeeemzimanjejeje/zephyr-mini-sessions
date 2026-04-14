import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppBanner from "./components/AppBanner";
import ErrorBoundary from "./components/ErrorBoundary";

const Home           = lazy(() => import("./pages/Home"));
const Genres         = lazy(() => import("./pages/Genres"));
const GenrePage      = lazy(() => import("./pages/GenrePage"));
const Search         = lazy(() => import("./pages/Search"));
const DetailPage     = lazy(() => import("./pages/DetailPage"));
const Downloads      = lazy(() => import("./pages/Downloads"));
const DownloadDetail = lazy(() => import("./pages/DownloadDetail"));

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
    <ErrorBoundary>
      <BrowserRouter basename={BASE}>
        <AppBanner />
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"                    element={<Home />} />
            <Route path="/title/:id"           element={<DetailPage />} />
            <Route path="/genres"              element={<Genres />} />
            <Route path="/genres/:genre"       element={<GenrePage />} />
            <Route path="/search"              element={<Search />} />
            <Route path="/downloads"           element={<Downloads />} />
            <Route path="/downloads/:slug"     element={<DownloadDetail />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
