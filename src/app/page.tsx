"use client";
import KeycloakSignIn from "@/components/atoms/buttons/keycloak-signin";
import styles from "./page.module.css";
import GoogleSignInButton from "@/components/atoms/buttons/GoogleSignInButton";
import CredentialsSignInForm from "@/components/molecules/forms/credentials-form";
import { CredentialsFormModel } from "@/components/molecules/forms/credentials-form.model";
import { useCallback, useState } from "react";

const credentialsFormModel = CredentialsFormModel.create({
  email: "",
  password: "",
});

export default function Login() {
  const [forbiddenLogin, setForbiddenLogin] = useState(false);
  const handleForbiddenLogin = useCallback(() => {
    setForbiddenLogin(true);
  }, []);

  const handleSuccessLogin = useCallback(() => {
    setForbiddenLogin(false);
  }, []);

  return (
    <div className={styles["login-form__container"]}>
      <h1>CS458 - Project</h1>
      <CredentialsSignInForm
        formModel={credentialsFormModel}
        onError={handleForbiddenLogin}
        onSuccess={handleSuccessLogin}
      />
      <div className={styles["login-form__divider"]} />
      <GoogleSignInButton />
      <KeycloakSignIn />
      {forbiddenLogin && <UnAuthLogin />}
      <footer>© Copyright 2025: Muhammad Rowaha (All Rights Reserved)</footer>
    </div>
  );
}

// helpers /////////////
function UnAuthLogin() {
  return (
    <div
      id="login__unauthorized"
      style={{ display: "flex", backgroundColor: "#F87171", borderRadius: 10 }}
    >
      <div
        style={{
          flex: 1,
          color: "#92400E",
          padding: "0.15rem",
          backgroundColor: "#FEF2F2",
        }}
      >
        <p
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            position: "relative",
            fontSize: "0.75em",
          }}
        >
          <span className="dx-icon-clear" style={{ color: "#F87171" }} />
          Unauthorized Login
        </p>
      </div>
    </div>
  );
}
