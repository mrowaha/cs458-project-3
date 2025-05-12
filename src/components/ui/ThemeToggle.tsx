import { useContext } from "react";
import { ThemeContext } from "@/app";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
            aria-label="Toggle theme"
        >
            {isDarkMode ? (
                <Sun className="h-5 w-5 text-zinc-400 hover:text-white" />
            ) : (
                <Moon className="h-5 w-5 text-zinc-400 hover:text-zinc-600" />
            )}
        </Button>
    );
};