import { FunctionComponent, useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ScenarioBoard.module.css";
import Scenario from '../../components/Scenario/Scenario';
import DropdownMenu from '../../components/DropdownMenu/DropdownMenu'
import Action from '../../components/Action/Action';
import Reaction from '../../components/Reaction/Reaction';
import axios from "axios";
import SERVER_PORT from "./../../server_config.json";

const ScenarioBoard: FunctionComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const api_port = SERVER_PORT.SERVER_PORT;

  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  useEffect(() => {
    if (!isTokenValid()) {
      window.alert("please login first. If you don't already have an account, create a new account");
      navigate("/login");
    }
  }, []);

  const [scenarios, setScenarios] = useState<{ scenario_name: string, Action: string | null, Reaction: string | null, id: number;}[]>(location.state && location.state.scenarios || []);
  const selectedScenario = location.state && location.state.selectedScenario;
  const [isHide, setIsHide] = useState<boolean>(false);
  const saveOfScenarios = scenarios;
  const [searchText, setSearchText] = useState('');
  const [selectedAction, setSelectedAction] = useState<string | null>(selectedScenario?.Action)
  const [selectedREAction, setSelectedREAction] = useState<string | null>(selectedScenario?.Reaction)
  const [isActionActive, setIsActionActive] = useState(selectedAction == null ? true : false);
  const [actionSelected, setActionSelected] = useState(isActionActive);
  const [isREActionActive, setIsREActionActive] = useState(selectedREAction == null ? true : false);
  const [nameScenario, setNameScenario] = useState("");

  const saveScenario = async () => {
    const newName = nameScenario == "" ? selectedScenario.scenario_name : nameScenario;
    // here add removeScenario api
    const updatedScenarios = scenarios;

    // const updatedScenarios = scenarios.filter((scenario) => {
    //   return (
    //     scenario.scenario_name !== selectedScenario.scenario_name ||
    //     scenario.Action !== selectedScenario.Action ||
    //     scenario.Reaction !== selectedScenario.Reaction
    //     );
    //   });

    const scenarioNameExists = updatedScenarios.some(scenario => scenario.scenario_name === newName);
    if (selectedREAction === null) {
      window.alert("Select an action and a reaction before saving your scenario.");
    } else if (!scenarioNameExists) {
      const config = {
        headers: {
          'Authorization': localStorage.getItem("token"),
        },
      };
      try {
        let response = await axios.post('http://localhost:' + api_port + '/addScenario', {
          scenario_name: newName,
          scenario_description: "description",
        }, config);

        const myID = response.data.scenario.id;

        response = await axios.post('http://localhost:' + api_port + '/addComponent', {
          "scenario_id":  myID,
          "component_name": "test compo",
          "component_type": selectedREAction,
          "link_to": selectedAction
        }, config);

        // uncomment this when doScenario is repaired

        // response = await axios.post('http://localhost:' + api_port + '/doScenario', {
        //   "id":  myID,
        // }, config);

        response = await axios.post('http://localhost:' + api_port + '/getComponents', {
          "id":  myID,
        }, config);

        setSelectedAction(response.data.result.rows[0].link_to);
        setSelectedREAction(response.data.result.rows[0].component_type);

        const newScenario = { scenario_name: newName, Action: selectedAction, Reaction: selectedREAction, id:myID};
        setScenarios([newScenario, ...scenarios]);

        navigate('/home', { state: { scenarios: [newScenario, ...scenarios] } });
      } catch (error) {
        window.alert("Already a scenario named '" + newName + "' please change the name of your scenario.");
        console.error(error);
      }
    } else {
      window.alert("Already a scenario named '" + newName + "' please change the name of your scenario.");
    }
  }

  const NoImplementedYet = (text : string) => {
    window.alert('The ' + text + ' feature is not implemented yet.');
  };

  const deleteScenario = () => {
    const result = window.confirm(`You are going to delete ${nameScenario == "" ? selectedScenario.scenario_name : nameScenario}. \n\n are you sure ?`);
    if (result) {
      //here add removeScenario
      const updatedScenarios = scenarios;

      // const updatedScenarios = scenarios.filter((scenario) => {
      //   return (
      //     scenario.scenario_name !== selectedScenario.scenario_name ||
      //     scenario.Action !== selectedScenario.Action ||
      //     scenario.Reaction !== selectedScenario.Reaction
      //     );
      //   });

      setScenarios([...updatedScenarios]);
      navigate('/home', { state: { scenarios: [...updatedScenarios] } });
    }
  }

  const cancelScenario = () => {
    const result = window.confirm(`You will undo the changes. \n\n are you sure ?`);
    if (result) {
      setScenarios(saveOfScenarios);
      navigate('/home', { state: {scenarios}});
    }
  }

  const onButtonNewScenarioClick = () => {
    navigate('/new-scenario', { state: { scenarios } });
  };

  const onChevronClick = () => {
    setIsHide(!isHide);
  };

  const filteredScenarios = scenarios.filter(scenario =>
    scenario.scenario_name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleOptionClickAction = (option: string) => {
      setSelectedAction(option);
      setIsActionActive(false);
      setActionSelected(!actionSelected);
    };

    const handleShowDropdownAction = async () => {
      setSelectedAction(null);
      setIsActionActive(true);
      setActionSelected(!actionSelected);
      setSelectedREAction(null);
      setIsREActionActive(true);

      try {
        const config = {
          headers: {
            'Authorization': localStorage.getItem("token"),
          },
        };
        let responseComp = await axios.post('http://localhost:' + api_port + '/getComponents', {
          "id":  selectedScenario.id,
        }, config);
        let response = await axios.delete("http://localhost:' + api_port + '/delComponent", {
          headers: {
            'Authorization': localStorage.getItem("token"),
          },
          data: {
            "scenario_id": selectedScenario.id,
            "component_id": responseComp.data.result[0].id,
          },
        })
      } catch (e) {
        console.error(e);
      }

    };

    const handleOptionClickREAction = (option: string) => {
      setSelectedREAction(option);
    setIsREActionActive(false);
  };

  const handleShowDropdownREAction = () => {
    setSelectedREAction(null);
    setIsREActionActive(true);
  };

  const onEditScenario = (scenarioToEdit: { scenario_name: string, Action: string | null, Reaction: string | null }) => {
    navigate('/scenario-board-reload', { state: { scenarios, selectedScenario: scenarioToEdit } });
  };

  return (
    <div className={styles.NewScenarioPage}>
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
            filteredScenarios.map((scenario, index) => (
              <Scenario
                key={index}
                scenario_name={scenario.scenario_name}
                Action={scenario.Action}
                Reaction={scenario.Reaction}
                onClick={() => onEditScenario(scenario)}
                id={scenario.id}
              />
            ))
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
          <span>
            Edit
          </span>
          <input
            type="text"
            className={styles.TitleScenario}
            placeholder={selectedScenario?.scenario_name}
            value={nameScenario}
            onChange={(e) => setNameScenario(e.target.value)}
          />
        </div>
        <div className={styles.buttonDelete} onClick={() => NoImplementedYet('"Remember me"')}> {/* onClick={deleteScenario}> */}
          <img className={styles.DelIcon} alt="" src={"/assets/trash.png"} />
        </div>
        <div className={styles.buttonCancel} onClick={cancelScenario}>
          <img className={styles.cancelIcon} alt="" src={"/assets/add.svg"} />
        </div>
        <div className={styles.buttonAdd} onClick={saveScenario}>
          <img className={styles.AddIcon} alt="" src={"/assets/checkmark.svg"} />
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
              Create your scenario
            </div>
          </div>
        </div>
        <div className={styles.actionButton}>
          {isActionActive ? (
            <div className="actionButton">
              <DropdownMenu
                buttonText="Action"
                options={Action()}
                onOptionClick={handleOptionClickAction}
              />
            </div>
            ) : (
              <div className={styles.selected}>
                {selectedAction}
                <button onClick={handleShowDropdownAction} className={styles.unselect}>
                  Unselect
                </button>
              </div>
            )
          }
        </div>
        <img
          className={`${styles.arrowAction} ${actionSelected ? styles.hideArrowAction : ''}`}
          src="/assets/arrow.svg"
          alt=""
        />
        <div className={`${styles.reActionButton} ${actionSelected ? styles.hideReActionButton : ''}`}>
          {isREActionActive ? (
            <div className="actionButton">
              <DropdownMenu
                buttonText="REAction"
                options={Reaction()}
                onOptionClick={handleOptionClickREAction}
              />
            </div>
            ) : (
              <div className={styles.selected}>
                {selectedREAction}
                <button onClick={handleShowDropdownREAction} className={styles.unselect}>
                  Unselect
                </button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default ScenarioBoard;
