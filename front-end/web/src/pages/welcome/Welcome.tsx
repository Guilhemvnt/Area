import { FunctionComponent, useCallback, useState} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Welcome.module.css";

const Welcome: FunctionComponent = () => {
  const navigate = useNavigate();

  const onSignInBtnContainerClick = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const onCreateAnAccountBtnContainerClick = useCallback(() => {
    navigate("/register");
  }, [navigate]);

  return (
    <div className={styles.welcomePage}>
      <div className={styles.introImage}>
        <img
          src="/assets/intro.png"
          alt="Intro"
          className={styles.image}
        />
      </div>

      <h1 className={styles.title}>
        Welcome Back!
      </h1>

      <p className={styles.txt}>
        You've arrived at the AREA app, you might want to sign in to start managing your workflows or create an account if you don't have one yet!
      </p>

      <div className={styles.buttonSignIn} onClick={onSignInBtnContainerClick}>
        <div className={styles.button}>
          Sign in
        </div>
      </div>

      <div className={styles.buttonCreateAnAccount}  onClick={onCreateAnAccountBtnContainerClick}>
        <div className={styles.button}>
          Create an account
        </div>
      </div>
      <img className={styles.vectorsIconL} alt="" src="/assets/vectors_left.png" />
      <img className={styles.vectorsIconR} alt="" src="/assets/vectors_right.png" />
    </div>
  );
};

export default Welcome;
