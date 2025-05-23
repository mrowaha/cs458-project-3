// dashboard.page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthContext, useWhoAmI } from "@/context/auth.context";
import { useContext } from "react";
import { useNavigate } from "react-router";

export const DashboardPage = () => {
  const { logout } = useContext(AuthContext);
  const me = useWhoAmI();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="space-y-1 items-center">
          <CardTitle
            data-testid="dashboard-title" // <<< Added data-testid here
            className="text-2xl font-bold text-center text-white"
          >
            Dashboard
            <br />
            <span>{me?.email}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            className="w-full bg-accent-base hover:bg-accent-dark"
            id="dashboard__action:to-ai-survey" // This ID is also usable if preferred
            onClick={() => navigate("/ai-survey")}
          >
            <p>AI Survey</p>
          </Button>

          <Button
            className="w-full bg-accent-base hover:bg-accent-dark"
            // Note: Duplicate ID here, IDs should be unique.
            // id="dashboard__action:to-ai-survey"
            id="dashboard__action:to-create-survey" // <<< Suggestion: Unique ID
            onClick={() => navigate("/create-survey")}
          >
            <p>Create Your Own Survey</p>
          </Button>

          <Button
            className="w-full bg-accent-base hover:bg-accent-dark"
            id="dashboard__action:logout"
            onClick={logout}
          >
            <p>Logout</p>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};