import styles from './Scenario.module.css';

interface ScenarioProps {
  scenario_name: string;
  onClick?: () => void;
  Action?: string | null; // Propriété Action avec une valeur par défaut de null
  Reaction?: string | null; // Propriété Reaction avec une valeur par défaut de null
  id: number;
}


const Scenario: React.FC<ScenarioProps> = ({ scenario_name, Action, Reaction, onClick}: ScenarioProps) => {
  Action === undefined ? Action = null : Action;
  Reaction === undefined ? Reaction = null : Reaction;
  return (
    <div className={styles.scenarioBtn} onClick={onClick}>
      <div className={styles.btnBackground}>
        <b className={styles.btnTxt}>
          {scenario_name}
        </b>
        <b className={styles.btnTxtBis}>
          {Action}
          {Reaction !== null ? (
            <span>
              <img className={styles.arrowAction} src="/assets/arrow.svg" alt="" />
              {Reaction}
            </span>
          ) : ""
          }
        </b>
      </div>
    </div>
  );
};

export default Scenario;
