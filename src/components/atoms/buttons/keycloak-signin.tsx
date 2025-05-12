import { Button } from "devextreme-react/button";
import { signIn } from "next-auth/react";
const KeycloakSignIn = () => {
  return (
    <Button
      id="oauth__keycloak-button"
      text="Sign In with Keycloak"
      stylingMode="contained"
      onClick={() => signIn("keycloak", { callbackUrl: "/dashboard" })}
    />
  );
};

export default KeycloakSignIn;
