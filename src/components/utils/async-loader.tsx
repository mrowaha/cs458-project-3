import { useEffect } from "react";

import { useAsync } from "@react-hookz/web";

interface Props<T> {
  trigger?: boolean;
  loadingComponent?: React.ReactNode;
  children: (result: T) => React.ReactNode;
  asyncFn: (...args: unknown[]) => Promise<T>;
  cleanupFn?: () => void;
}

export const AsyncLoader = <T,>({
  loadingComponent,
  children,
  asyncFn,
  cleanupFn,
  trigger = false,
}: Props<T>) => {
  const [{ result, status }, getResult] = useAsync(asyncFn);

  useEffect(() => {
    void getResult.execute();
    return () => {
      cleanupFn?.();
    };
  }, [cleanupFn, getResult, trigger]);

  if (status === "loading" || status === "not-executed") {
    return <>{loadingComponent}</>;
  }

  if (status === "success" && result !== undefined) {
    return <>{children(result)}</>;
  }

  return null;
};
