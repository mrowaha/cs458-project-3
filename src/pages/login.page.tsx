import { useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import users from "@/data.json";

interface ILoginForm {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const location = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ILoginForm>({
    defaultValues: {
      email: location.state?.email ?? "",
      password: location.state?.password ?? "",
    },
  });

  const onSubmit = useCallback(async (data: ILoginForm) => {
    const user = users.find((_user) => _user.email === data.email);
    setLoginError(null);
    if (user) {
      if (data.password !== user.password) {
        setLoginError("Incorrect password. Please try again.");
      } else {
        localStorage.setItem("proj3-user", `${data.email}:${data.password}`);
        window.location.replace("/dashboard");
      }
    } else {
      setLoginError("No such user found with that email.");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="space-y-1 items-center">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loginError && (
            <div
              className="mb-4 rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500"
              id="login-form__error:unauthorized"
            >
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-400"
              >
                Email
              </label>
              <div>
                <Input
                  id="login-form__field:email"
                  type="text"
                  placeholder="name@example.com"
                  className={`bg-zinc-800 text-accent-contrast border-zinc-700 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p
                    id="login-form__error:email"
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-400"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="login-form__field:password"
                  type={"password"}
                  className={`bg-zinc-800 text-accent-contrast border-zinc-700 pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p
                    id="login-form__error:password"
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-base hover:bg-accent-dark"
              id="login-form__action:submit"
            >
              <p>Login</p>
            </Button>
            <Button
              className="w-full bg-accent-base hover:bg-accent-dark"
              id="login-form__action:reset"
              onClick={() => reset()}
            >
              <p>Reset</p>
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t border-zinc-800 pt-4">
          <div className="text-xs text-center text-zinc-500 mt-4">
            © Copyright 2025: ABC Team (All Rights Reserved)
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
