import { FunctionComponent, useCallback, useState} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import SERVER_PORT from "./../../server_config.json";

function parseJwt (token : any) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

const Login: FunctionComponent = () => {
  const navigate = useNavigate();
  const [google_log, setGoogle_log] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const api_port = SERVER_PORT.SERVER_PORT;

  const onGoogleBtnContainerClick = useCallback(() => {
    const data = {
      email: google_log,
      password : "",
    };
    axios.post("http://localhost:" + api_port + "/google_login", data)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        console.log("FROM THERE");
        navigate("/home");
      })
      .catch((error) => {
        window.alert('bad login or password');
      });
  }, [google_log, "", navigate]);

  const onLoginBtnContainerClick = useCallback(() => {
    const data = {
      username: login,
      password: password,
    };
    axios.post("http://localhost:" + api_port + "/login", data)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("microsoft", "start");
        navigate("/home");
      })
      .catch((error) => {
        window.alert('bad login or password');
      });
  }, [login, password, navigate]);

  const onCreateBtnContainerClick = useCallback(() => {
    navigate("/register");
  }, [navigate]);

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const NoImplementedYet = (text : string) => {
    window.alert('The ' + text + ' feature is not implemented yet.');
  };

  return (
    <div className={styles.loginPageStyle}>
      <div className={styles.form}>
        <div className={styles.signInTitle}>
          Sign in
        </div>
        <div className={styles.signInText}>
          Sign in and start managing your workflows!
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
        <div className={styles.sectionForgot}>
          <input type="checkbox" className={styles.checkbox} onClick={() => NoImplementedYet('"Remember me"')}/>
          <div className={styles.rememberMe}>
            Remember me
          </div>
          <div>
            <button className={styles.forgotPassword} onClick={() => NoImplementedYet('"Forgot Password"')}>
              Forgot password?
            </button>
          </div>
        </div>
        <div className={styles.loginBtn} onClick={onLoginBtnContainerClick}>
          <div className={styles.BtnBackground} />
          <div className={styles.LoginBtnTxt}>
            login
          </div>
        </div>
        <div className={styles.passwordBtn} onClick={onCreateBtnContainerClick}>
          <div className={styles.BtnBackground} />
          <div className={styles.createAnAccount}>
            Create an account
          </div>
        </div>
      </div>
      <div className={styles.googleLogo}>
        <GoogleOAuthProvider clientId="787640326246-jkhqvsrc3adog9s5onf8mf5hj2832dap.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const info = JSON.parse(JSON.stringify(parseJwt(credentialResponse.credential)));
              console.log(info.email);
              setGoogle_log(info.email);
              onGoogleBtnContainerClick();
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </GoogleOAuthProvider>
      </div>
      <div className={styles.microsoftLogo} onClick={() => NoImplementedYet('"Microsoft login"')}>
        <img
          className={styles.LogoButton}
          alt=""
          src="/assets/microsoftLogo.png"
        />
      </div>
      <div className={styles.appleLogo} onClick={() => NoImplementedYet('"Apple login"')}>
        <img
          className={styles.LogoButton}
          alt=""
          src="/assets/appleLogo.png"
        />
      </div>
      <div className={styles.facebookLogo} onClick={() => NoImplementedYet('"Facebook login"')}>
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

export default Login;
