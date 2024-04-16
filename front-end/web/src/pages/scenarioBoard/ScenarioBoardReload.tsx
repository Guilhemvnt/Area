import { FunctionComponent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ScenarioBoardReload: FunctionComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const scenarios = location.state && location.state.scenarios;
  const mySelectedScenario = location.state && location.state.selectedScenario;

  useEffect(() => {
    if (!isTokenValid()) {
      window.alert("Veuillez d'abord vous connecter. Si vous n'avez pas encore de compte, veuillez en créer un.");
      navigate("/login");
    } else {
      navigate('/scenario-board', { state: { scenarios, selectedScenario: mySelectedScenario } });
    }
  }, [navigate, scenarios, mySelectedScenario]);

  return null;
};

export default ScenarioBoardReload;
