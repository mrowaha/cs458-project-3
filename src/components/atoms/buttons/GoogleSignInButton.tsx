import { googleIcon } from "@/assets/icons";
import { Button } from "devextreme-react/button";
import { signIn } from "next-auth/react";
const GoogleSignInButton = () => {
  return (
    <Button
      id="oauth__google-button"
      text="Sign In with Google"
      stylingMode="contained"
      icon={googleIcon}
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    />
  );
};

export default GoogleSignInButton;
