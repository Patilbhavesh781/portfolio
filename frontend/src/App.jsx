import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useTheme } from "./context/ThemeContext";
import ScrollToTop from "./components/common/ScrollToTop";
import api from "./services/api";

const App = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const lastPathRef = useRef(location.pathname);
  const lastPathStartMsRef = useRef(Date.now());

  const getSessionId = () => {
    const existing = sessionStorage.getItem("visitorSessionId");
    if (existing) return existing;
    const generated = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem("visitorSessionId", generated);
    return generated;
  };

  const sendPageView = (path, durationSec) => {
    const payload = {
      sessionId: getSessionId(),
      path,
      durationSec,
    };
    api.post("/stats/track", payload).catch(() => {});
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith("/admin");
    const alreadyTracked = sessionStorage.getItem("visitorTracked") === "1";

    if (isAdminRoute || alreadyTracked) {
      return;
    }

    api.post("/stats/visit").catch(() => {});
    sessionStorage.setItem("visitorTracked", "1");
  }, [location.pathname]);

  useEffect(() => {
    const previousPath = lastPathRef.current;
    const now = Date.now();
    const durationSec = Math.max(
      0,
      Math.round((now - lastPathStartMsRef.current) / 1000)
    );

    if (previousPath !== location.pathname && !previousPath.startsWith("/admin")) {
      sendPageView(previousPath, durationSec);
    }

    lastPathRef.current = location.pathname;
    lastPathStartMsRef.current = now;
  }, [location.pathname]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const path = lastPathRef.current;
      if (path.startsWith("/admin")) return;

      const durationSec = Math.max(
        0,
        Math.round((Date.now() - lastPathStartMsRef.current) / 1000)
      );
      const payload = JSON.stringify({
        sessionId: getSessionId(),
        path,
        durationSec,
      });
      const base = (api.defaults.baseURL || "").replace(/\/+$/, "");
      const url = `${base}/stats/track`;
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
};

export default App;
