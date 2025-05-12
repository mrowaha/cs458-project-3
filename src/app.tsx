import { AuthProvider } from "./context/auth.context";
import { SvqRoutes } from "./routes";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <SvqRoutes />
      <Toaster
        position="bottom-right"
        theme={"dark"}
        closeButton
        richColors
        expand={false}
      />
    </AuthProvider>
  );
}

export default App;
