"use client"
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

export default function ToggleThemeButton() {
    const { setTheme, theme } = useTheme();

    useEffect(() => {
        const changeTheme = (ev: KeyboardEvent) => {
            if (ev.ctrlKey && ev.key === "m") {
                setTheme(theme === "dark" ? "light" : "dark");
            }
        };

        addEventListener("keydown", changeTheme);

        return () => {
            removeEventListener("keydown", changeTheme);
        };
    }, [theme]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="size-10 p-2 rounded-full"
                    title="Toggle theme (ctrl+m)"
                >
                    <Sun className="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" >
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
