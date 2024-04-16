import { FunctionComponent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import axios from "axios";
import SERVER_PORT from "./../../server_config.json";

const Register: FunctionComponent = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const api_port = SERVER_PORT.SERVER_PORT;

  const onLoginBtnContainerClick = useCallback(() => {
    const data = {
      username: login,
      password: password,
    };
    axios.post("http://localhost:" + api_port + "/register", data)
      .then((response) => {
        navigate("/login");
      })
      .catch((error) => {
        console.log("http://localhost:" + api_port + "/register", error),
        window.alert('Already an account');
      });
  }, [login, password, navigate]);

  const NoImplementedYet = (text : string) => {
    window.alert('The ' + text + ' feature is not implemented yet.');
  };

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onSignInBtnContainerClick = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div className={styles.registerPage}>
      <div className={styles.form}>
        <div className={styles.registerTitle}>
          REGISTER
        </div>
        <div className={styles.registerText}>
          Create your account
        </div>
        <div className={styles.username}>
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={handleLoginChange}
            className={styles.inputText}
          />
        </div>
        <div className={styles.password}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className={styles.inputText}
          />
        </div>
        <div className={styles.registerBtn} onClick={onLoginBtnContainerClick}>
          <div className={styles.btnBackground} />
          <div className={styles.btnTxt}>
            Register
          </div>
        </div>
        <div className={styles.buttonSignIn} onClick={onSignInBtnContainerClick}>
          <div className={styles.btnBackground} />
          <div className={styles.button}>
            Sign in
          </div>
        </div>
      </div>
      <div className={styles.googleLogo} onClick={() => NoImplementedYet('"Google creation account"')}>
        <img
          className={styles.LogoButton}
          alt=""
          src="/assets/googleLogo.png"
        />
      </div>
      <div className={styles.microsoftLogo} onClick={() => NoImplementedYet('"Microsoft creation account"')}>
        <img
          className={styles.LogoButton}
          alt=""
          src="/assets/microsoftLogo.png"
        />
      </div>
      <div className={styles.appleLogo} onClick={() => NoImplementedYet('"Apple creation account"')}>
        <img
          className={styles.LogoButton}
          alt=""
          src="/assets/appleLogo.png"
        />
      </div>
      <div className={styles.facebookLogo} onClick={() => NoImplementedYet('"Facebook creation account"')}>
        <img
          className={styles.LogoButton}
          alt=""
          src="/assets/facebookLogo.png"
        />
      </div>
      <img className={styles.vectorsIconL} alt="" src="/assets/vectors_left.png" />
      <img className={styles.vectorsIconR} alt="" src="/assets/vectors_right.png" />
    </div>
  );
};

export default Register;
