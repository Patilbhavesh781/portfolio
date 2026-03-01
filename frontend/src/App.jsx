import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useTheme } from "./context/ThemeContext";
import ScrollToTop from "./components/common/ScrollToTop";

const App = () => {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
};

export default App;
