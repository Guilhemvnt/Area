import { FunctionComponent, useCallback, useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Home.module.css";
import Scenario from '../../components/Scenario/Scenario';
import axios from "axios";
import SERVER_PORT from "./../../server_config.json";
import { Result } from "postcss";

const Home: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const api_port = SERVER_PORT.SERVER_PORT;
  const [microsoftCode, setMicrosoftCode] = useState("");
  const [microsoftUrl, setMicrosoftUrl] = useState("");

  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const microsoftConnection = async () => {
    const config = {
      headers: {
        'Authorization': localStorage.getItem("token"),
      },
    };
    await axios.get("http://localhost:" + api_port + "/authMicrosoft", config)
      .then((response) => {
        setMicrosoftCode(response.data.info.code);
        setMicrosoftUrl(response.data.info.url);
        localStorage.setItem("microsoft", "good");
      })
      .catch((error) => {
        window.alert('bad microsoft login');
        console.log(error);
      });
  };

  useEffect(() => {
    if (!isTokenValid()) {
      window.alert("please login first. If you don't already have an account, create a new account");
      navigate("/login");
    }
  }, []);

  const [isHide, setIsHide] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [scenarios, setScenarios] = useState<{ scenario_name: string, Action: string, Reaction: string, id: number;}[]>([]);

  useEffect(() => {
    const getScenariosFromAPI = async () => {
      try {
        const config = {
          headers: {
            'Authorization': localStorage.getItem("token"),
          },
        };

        const response = await axios.get('http://localhost:' + api_port + '/getScenarios', config)
        const updatedScenarios = [];

        if (response.data.result.rows && response.data.result.rows.length > 0) {
          for (const scenario of response.data.result.rows) {
            const responseComp = await axios.post('http://localhost:' + api_port + '/getComponents', {
              "id": scenario.id,
            }, config);
            const newScenario = {
              scenario_name: scenario.scenario_name,
              Action: responseComp && responseComp.data && responseComp.data.result && responseComp.data.result.rows && responseComp.data.result.rows[0] && responseComp.data.result.rows[0].link_to ? responseComp.data.result.rows[0].component_type : null,
              Reaction: responseComp && responseComp.data && responseComp.data.result && responseComp.data.result.rows && responseComp.data.result.rows[0] && responseComp.data.result.rows[0].component_type ? responseComp.data.result.rows[1].component_type : null,
              id: scenario.id
            };

            updatedScenarios.push(newScenario);
          }
          setScenarios(updatedScenarios);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des scénarios :', error);
      }
    };

    getScenariosFromAPI();

  }, []);

  const webHook = async () => {
    const config = {
      headers: {
        'Authorization': localStorage.getItem("token"),
      },
    };

    let promises = [];
    console.log("début webhook du scénario => ", scenarios);

    for (const scenario of scenarios) {
      promises.push(
        axios.post('http://localhost:' + api_port + '/doScenario', {
          "id":  scenario.id
        }, config)
        .then((response) => {
          console.log("exécution du scénario :", scenario.scenario_name, "réussie");
          console.log("response :", response);
        })
        .catch((error) => {
          console.log("Erreur lors de l'exécution du scénario :", scenario);
          console.error("error:", error);
        })
      );
    }

    try {
      await Promise.all(promises);
      console.log("Toutes les exécutions de scénarios sont terminées.");
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'exécution des scénarios :", error);
    }
  };

  let lastExecution = Date.now() - 30000;

  setInterval(() => {
    if (Date.now() - lastExecution > 30000) { // Check if 30 seconds have passed
      webHook();
      lastExecution = Date.now();
    }
  }, 1000); // Check every second

  const onButtonNewScenarioClick = () => {
    navigate('/new-scenario', { state: { scenarios } });
  }

  const onEditScenario = (scenarioToEdit: { scenario_name: string, Action: string | null, Reaction: string | null }) => {
    navigate('/scenario-board', { state: { scenarios, selectedScenario: scenarioToEdit } });
  };

  useEffect(() => {
    if (location.state && location.state.scenarios) {
      setScenarios(location.state.scenarios);
    }
  }, [location.state]);

  function onChevronClick() {
    setIsHide(!isHide);
  }

  const filteredScenarios = scenarios.filter(scenario =>
    scenario.scenario_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const openMicrosoft = () => {
    try {
      localStorage.setItem("microsoft", "finish");
      window.open(microsoftUrl, '_blank');
    } catch (e) {
      console.log("Can't open Microsoft page.", e);
    };
  };

  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    const textArea = document.createElement('textarea');
    textArea.value = microsoftCode;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    setIsCopied(true);
  };

  return (
    <div className={styles.homePage}>
      <div className={`${styles.navbar} ${isHide ? styles.navbarHide : ''}`}>
        <div className={`${styles.welcomeBtn} ${isHide ? styles.welcomeBtnHide : ''}`}>
          <div className={styles.btnBackground}>
            <b className={styles.btnTxt}>
              Welcome User1
            </b>
          </div>
        </div>
        <div className={`${styles.searchBar} ${isHide ? styles.searchBarHide : ''}`}>
          <div className={styles.searchBackground}>
            <input
              type="text"
              placeholder="Search"
              className={styles.searchTxt}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <img
              className={styles.searchIcon}
              alt=""
              src="assets/search.svg"
            />
          </div>
        </div>
        <div className={`${styles.scroll} ${isHide ? styles.scrollHide : ''}`}>
          {filteredScenarios.length === 0 ? (
          <div className={styles.NoScenarioBox}>
            <div className={styles.NoScenarioBackground}>
              <div className={styles.txtBox}>
                No scenario found.
              </div>
            </div>
          </div>
          ) : (
            filteredScenarios.map((scenario, index) => {
              return (
                <Scenario
                  key={index}
                  scenario_name={scenario.scenario_name}
                  Action={scenario.Action}
                  Reaction={scenario.Reaction}
                  onClick={() => onEditScenario(scenario)}
                  id={scenario.id}
                />
              );
            })
          )}
        </div>
        <div className={`${styles.addScenarioBtn} ${isHide ? styles.addScenarioBtnHide : ''}`} onClick={onButtonNewScenarioClick}>
          <div className={styles.btnBackground}>
            <b className={styles.btnTxt}>
              Add Scenario
            </b>
          </div>
          <img className={styles.addImage} alt="" src="assets/add.svg" />
        </div>
        <img
          className={`${styles.chevron} ${isHide ? styles.chevronHide : ''}`}
          alt=""
          src="/assets/chevron.svg"
          onClick={onChevronClick}
        />
      </div>
      <div className={`${styles.header} ${isHide ? styles.headerHide : ''}`}>
        <div className={styles.allScenarios}>
          All scenarios
        </div>
        <div className={styles.buttonAdd} onClick={onButtonNewScenarioClick}>
          <img className={styles.AddIcon} alt="" src={"/assets/add.svg"} />
        </div>
        <div className={styles.table}>
          <div className={styles.tabs}>
            <div className={styles.boardItem}>
              Board
              <div className={styles.boardSelect} />
            </div>
            <div className={styles.consoleItem}>
              Console
              <div className={styles.consoleSelect} />
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.board} ${isHide ? styles.boardHide : ''}`}>
        <div className={styles.infoBox}>
          <div className={styles.boxBackground}>
            <div className={styles.txtBox}>
              Create or select a scenario to start
            </div>
          </div>
        </div>
        <div className={styles.actionButton}>
          <div onClick={microsoftConnection} style={localStorage.getItem("microsoft") !== "start" ? {display: 'none'} : {}}>
            <label style={{cursor: 'pointer'}}>
              Click here to connect to Microsoft
            </label>
          </div>
          <div style={localStorage.getItem("microsoft") !== "good" ? {display: 'none'} : {}}>
            <label onClick={openMicrosoft} style={{cursor: 'pointer'}}>
              Click here to connect to Microsoft and use the code: {microsoftCode}
            </label>
            <div
              onClick={copyToClipboard}
              className={styles.cpyButton}
              >
              {isCopied ? 'Code copied!' : 'Copy code'}
            </div>
          </div>
          <div style={localStorage.getItem("microsoft") !== "finish" ? {display: 'none'} : {}}>
            <label>
              You are connected to Microsoft
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
