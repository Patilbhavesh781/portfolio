import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useTheme } from "./context/ThemeContext";

const App = () => {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return <AppRoutes />;
};

export default App;
