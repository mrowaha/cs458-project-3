import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { AsyncLoader } from "../components/utils/async-loader";
import { useLocation, useNavigate } from "react-router";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { unprotected_routes } from "@/routes.meta";
import { showToast } from "@/components/utils/toast";

type User = {
  email: string;
};

export interface IAuthContext {
  me: User | null;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  me: null,
  logout: () => void 0,
});

export const AuthProvider = (props: PropsWithChildren) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [me, setMe] = useState<User | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem("proj3-user");
    window.location.replace("/auth/login");
  }, []);

  return (
    <AuthContext.Provider value={{ me, logout }}>
      <AsyncLoader<boolean>
        asyncFn={async () => {
          showToast("Validating user", "info");
          const basic = localStorage.getItem("proj3-user");
          if (basic) {
            const email = basic.split(":")[0],
              password = basic.split(":")[1];
            void email;
            void password;
            setMe({
              email,
            });
            return true;
          }
          setMe(null);
          showToast("Redirecting to Login", "info");
          return false;
        }}
        loadingComponent={<LoadingSpinner message="Loading user data" />}
      >
        {(result) => {
          if (!result) {
            // @ts-expect-error
            if (!unprotected_routes.includes(location.pathname))
              navigate("/auth/login");
          }
          return props.children;
        }}
      </AsyncLoader>
    </AuthContext.Provider>
  );
};

export const useWhoAmI = () => {
  const ctx = useContext(AuthContext);
  if (ctx) return ctx.me;
  throw Error(
    "Programming Error: useWhoAmI hook cannot be outside Auth Context"
  );
};
