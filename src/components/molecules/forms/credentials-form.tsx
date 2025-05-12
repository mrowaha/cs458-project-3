"use client";
import { signInIcon } from "@/assets/icons";
import { Button, TextBox } from "devextreme-react";
import { observer } from "mobx-react";
import { useState } from "react";
import { ICredentialsFormModel } from "./credentials-form.model";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
const CredentialsSignInForm = ({
  formModel,
  onError,
  onSuccess,
}: {
  formModel: ICredentialsFormModel;
  onError(): unknown;
  onSuccess(): unknown;
}) => {
  const [submit, setSubmit] = useState(false);
  const [submittedTrys, setSubmittedTrys] = useState(0);
  const router = useRouter();
  const handleSubmit = async () => {
    setSubmit(true);
    if (Boolean(formModel.errors.email) || Boolean(formModel.errors.password))
      return;

    const _currentTry = submittedTrys + 1
    setSubmittedTrys(prev => prev+1)
    if (_currentTry >= 5) {
      return
    }

    const signInResponse = await signIn("credentials", {
      ...formModel.toJson,
      redirect: false,
    });

    if (signInResponse.ok) {
      onSuccess();
      router.push("/dashboard");
    } else {
      onError();
    }
  };
  console.log(submittedTrys)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div>
        <TextBox
          id="credentials__email-input"
          value={formModel.email}
          onValueChanged={({ value }) => formModel.setEmail(value)}
          label="Email"
          placeholder="Enter Email"
          labelMode="static"
        />
        {Boolean(formModel.errors.email) && submit && (
          <ErrorToast
            id="credentials__email-error"
            error={formModel.errors.email}
          />
        )}
      </div>

      <div>
        <TextBox
          id="credentials__password-input"
          value={formModel.password}
          onValueChanged={({ value }) => formModel.setPassword(value)}
          label="Password"
          placeholder="Enter Password"
          labelMode="static"
        />
        {Boolean(formModel.errors.password) && submit && (
          <ErrorToast
            id="credentials__password-error"
            error={formModel.errors.password}
          />
        )}
      </div>
      <Button
        id="credentials__sign-in-button"
        text="Sign In"
        icon={signInIcon}
        onClick={handleSubmit}
      />
      {
      submittedTrys >= 5 &&  <ErrorToast 
        id="credentials__max-attempts"
        error="Max Attempts (5) have been reached. Please try later"
      />
      }
    </div>
  );
};

export default observer(CredentialsSignInForm);

// helpers //////////
function ErrorToast({ error, id }: { error: string; id: string }) {
  return (
    <div
      id={id}
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
          {error}
        </p>
      </div>
    </div>
  );
}
