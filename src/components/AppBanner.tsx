import { useState, useEffect } from "react";

const MOBILE_APP_URL =
  (import.meta.env.VITE_MOBILE_APP_URL as string) || "";

export default function AppBanner() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

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

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setVisible(false);
        localStorage.setItem("ce_banner_dismissed", "1");
      }
      setDeferredPrompt(null);
    } else if (MOBILE_APP_URL) {
      window.open(MOBILE_APP_URL, "_blank", "noopener");
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("ce_banner_dismissed", "1");
  };

  if (!visible) return null;

  return (
    <div className="w-full bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-4 py-2 gap-3 z-[9999] relative">
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
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
