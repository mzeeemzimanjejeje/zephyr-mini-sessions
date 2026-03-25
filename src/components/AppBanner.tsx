import { useState, useEffect, useRef } from "react";

const APP_URL =
  (import.meta.env.VITE_MOBILE_APP_URL as string) ||
  "https://movie-site.courtneytech.xyz";

export default function AppBanner() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showGuide, setShowGuide] = useState(false);
  const guideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem("ce_banner_dismissed") === "1") return;
    setVisible(true);

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (guideRef.current && !guideRef.current.contains(e.target as Node)) {
        setShowGuide(false);
      }
    };
    if (showGuide) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showGuide]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setVisible(false);
        localStorage.setItem("ce_banner_dismissed", "1");
      }
      setDeferredPrompt(null);
    } else {
      setShowGuide((v) => !v);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("ce_banner_dismissed", "1");
  };

  if (!visible) return null;

  return (
    <div className="relative w-full z-[9999]">
      <div className="w-full bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-4 py-2 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center">
            <span className="text-white text-xs font-black tracking-tight">CE</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-none mb-0.5 truncate">
              Courtney ENT
            </p>
            <p className="text-gray-400 text-xs leading-none truncate">
              Stream movies &amp; series on your phone — free
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstall}
            className="bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors whitespace-nowrap"
          >
            {deferredPrompt ? "Install App" : "Get App"}
          </button>
          <button
            onClick={handleDismiss}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1"
            aria-label="Dismiss"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {showGuide && (
        <div
          ref={guideRef}
          className="absolute right-4 top-full mt-2 w-72 bg-[#1f1f1f] border border-[#333] rounded-xl shadow-2xl p-4 z-[10000]"
        >
          <p className="text-white text-sm font-semibold mb-3">Install the app</p>

          <div className="mb-4">
            <p className="text-red-400 text-xs font-bold uppercase tracking-wide mb-1.5">Android</p>
            <ol className="text-gray-300 text-xs space-y-1.5 list-none">
              <li className="flex gap-2"><span className="text-red-500 font-bold">1.</span>Open this site in <strong>Chrome</strong></li>
              <li className="flex gap-2"><span className="text-red-500 font-bold">2.</span>Tap the <strong>⋮ menu</strong> (top right)</li>
              <li className="flex gap-2"><span className="text-red-500 font-bold">3.</span>Tap <strong>"Add to Home screen"</strong></li>
              <li className="flex gap-2"><span className="text-red-500 font-bold">4.</span>Tap <strong>Install</strong></li>
            </ol>
          </div>

          <div className="mb-4">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1.5">iPhone / iPad</p>
            <ol className="text-gray-300 text-xs space-y-1.5 list-none">
              <li className="flex gap-2"><span className="text-gray-500 font-bold">1.</span>Open this site in <strong>Safari</strong></li>
              <li className="flex gap-2"><span className="text-gray-500 font-bold">2.</span>Tap the <strong>Share button</strong> <span className="text-gray-400">(box with arrow)</span></li>
              <li className="flex gap-2"><span className="text-gray-500 font-bold">3.</span>Tap <strong>"Add to Home Screen"</strong></li>
            </ol>
          </div>

          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded-lg transition-colors"
            onClick={() => setShowGuide(false)}
          >
            Open App →
          </a>
        </div>
      )}
    </div>
  );
}
