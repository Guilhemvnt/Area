import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";

import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Welcome from "./pages/welcome/Welcome";
import Home from "./pages/home/Home";
import NewScenario from "./pages/newScenario/NewScenario";
import ScenarioBoard from "./pages/scenarioBoard/ScenarioBoard";
import ScenarioBoardReload from "./pages/scenarioBoard/ScenarioBoardReload";
import DownloadAPK from "./pages/apk/DownloadAPK";
import { useEffect } from "react";
import './App.css';

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
      case "/register":
        title = "";
        metaDescription = "";
        break;
      case "/login":
        title = "";
        metaDescription = "";
        break;
      case "/home":
        title = "";
        metaDescription = "";
        break;
      case "/new-scenario":
        title = "";
        metaDescription = "";
        break;
      case "/scenario-board":
        title = "";
        metaDescription = "";
        break;
      case "/scenario-board-reload":
        title = "";
        metaDescription = "";
        break;
      case "/client.apk":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag: HTMLMetaElement | null = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  useEffect(() => {
    // Ajoutez un gestionnaire d'événement pour l'événement beforeunload
    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("token");
    });

    // Assurez-vous de retirer le gestionnaire d'événement lorsque le composant est démonté
    return () => {
      window.removeEventListener("beforeunload", () => {
        localStorage.removeItem("token");
      });
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/new-scenario" element={<NewScenario />} />
      <Route path="/scenario-board" element={<ScenarioBoard />} />
      <Route path="/scenario-board-reload" element={<ScenarioBoardReload />} />
      <Route path="/client.apk" element={<DownloadAPK />} />
    </Routes>
  );
}

export default App;
