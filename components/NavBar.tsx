"use client";

import { MenuIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import { TypographyH3, TypographyH5 } from "./ui/typography";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { getSearchSuggestions } from "@/lib/apiClient";
import Image from "next/image";
import ThreeDotLoading from "./Loader/ThreeDotLoading";

type CommandItemType = {
    label: string;
    label2?: string;
    icon: React.ReactNode;
    isDisabled?: boolean;
};

type CommandGroupType = {
    heading?: string;
    items: CommandItemType[];
};

function ToggleThemeButton() {
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
                    className="size-fit p-2 rounded-full"
                    title="Toggle theme (ctrl+m)"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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

function CommandInputWithList({
    isSearchInputFocused,
    setIsSearchInputFocused,
    placeholder,
    list,
    loadingList,
    onItemClick,
    value,
    onValueChange,
}: {
    isSearchInputFocused: boolean;
    setIsSearchInputFocused: (v: boolean) => void;
    placeholder?: string;
    list?: CommandGroupType[];
    loadingList?: boolean;
    onItemClick?: (item: CommandItemType) => void;
    value?: string;
    onValueChange?: (v: string) => void;
}) {
    const [hideList, setHideList] = useState(true);
    const [inputValue, setInputValue] = useState<string>(value ?? "");
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (onValueChange) {
            onValueChange(inputValue);
        }
    }, [inputValue]);

    useEffect(() => {
        if (isSearchInputFocused) {
            ref.current?.focus();
        } else {
            ref.current?.blur();
        }
    }, [isSearchInputFocused]);

    return (
        <Command className=" rounded-lg border shadow-md md:max-w-[450px]">
            <CommandInput
                ref={ref}
                placeholder={placeholder}
                value={inputValue}
                onValueChange={(v) => {
                    setInputValue(v);
                }}
                onFocus={() => setHideList(false)}
                onBlur={() => setHideList(true)}
            />
            <CommandList
                hidden={hideList || inputValue.length === 0}
                className="absolute top-full w-full md:max-w-[450px] z-[51] bg-background"
            >
                {loadingList ? (
                    <div className="flex justify-center my-2">
                        <ThreeDotLoading />
                    </div>
                ) : (
                    <CommandEmpty>No results found.</CommandEmpty>
                )}
                {list?.map((group, index) => (
                    <div key={group.heading || "" + index}>
                        <CommandGroup heading={group.heading}>
                            {group.items.map((item) => (
                                <CommandItem
                                    key={item.label}
                                    disabled={item.isDisabled}
                                    onSelect={() => onItemClick?.(item)}
                                    value={item.label}
                                >
                                    {item.icon}
                                    <div className="capitalize">
                                        <TypographyH5>
                                            {item.label}
                                        </TypographyH5>
                                        <TypographyH5 isMuted>
                                            {item.label2}
                                        </TypographyH5>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {index != list.length - 1 && (
                            <CommandSeparator key={"sep-" + index} />
                        )}
                    </div>
                ))}
            </CommandList>
        </Command>
    );
}

export function NavBar({ onMenuBtnClick }: { onMenuBtnClick: () => void }) {
    const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loadingSuggestions, setLoadingSuggestions] =
        useState<boolean>(false);
    const [searchSuggestionsList, setSearchSuggestionsList] = useState<
        CommandGroupType[]
    >([]);

    useEffect(() => {
        const focusSearchInput = (ev: KeyboardEvent) => {
            if (ev.ctrlKey && ev.key === "k") {
                ev.preventDefault();
                setIsSearchInputFocused(true);
            } else if (ev.key === "Escape") {
                setIsSearchInputFocused(false);
            }
        };

        addEventListener("keydown", focusSearchInput);

        return () => {
            removeEventListener("keydown", focusSearchInput);
        };
    }, []);

    useEffect(() => {
        const populate = () => {
            setLoadingSuggestions(true);
            if (searchQuery.length === 0) {
                return;
            }
            getSearchSuggestions(searchQuery, 5)
                .then((res) => {
                    const list: CommandGroupType[] = [
                        {
                            heading: "Suggestions",
                            items: res.map((item) => ({
                                label: item.title,
                                label2: item.genre.join(", "),
                                icon: (
                                    <>
                                        <Image
                                            src={item.coverImage.url}
                                            alt={item.title}
                                            width={
                                                item.coverImage.width.small /
                                                1.5
                                            }
                                            height={
                                                item.coverImage.height.small /
                                                1.5
                                            }
                                            className="object-cover bg-primary"
                                            // onErrorCapture={}
                                        />
                                    </>
                                ),
                                isDisabled: false,
                                onClick: () => {},
                            })),
                        },
                    ];
                    setSearchSuggestionsList(list);
                })
                .finally(() => setLoadingSuggestions(false));
        };

        const timeout = setTimeout(populate, 500);

        return () => {
            clearTimeout(timeout);
        };
    }, [searchQuery]);

    return (
        <header className="sticky top-0 mx-auto z-50 bg-gradient-to-b from-background from-[75%] to-background/0">
            <nav className="flex justify-between items-center py-4">
                <div className="flex items-center gap-2 md:hidden">
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={onMenuBtnClick}
                    >
                        <MenuIcon />
                    </Button>
                    <TypographyH3>AiBooks</TypographyH3>
                </div>

                <div className="flex items-center justify-end md:justify-center gap-4 w-full">
                    <div className="invisible md:visible w-full">
                        <CommandInputWithList
                            isSearchInputFocused={isSearchInputFocused}
                            setIsSearchInputFocused={setIsSearchInputFocused}
                            placeholder="Search (ctrl+k)..."
                            value={searchQuery}
                            onValueChange={(v) => setSearchQuery(v)}
                            loadingList={loadingSuggestions}
                            list={searchSuggestionsList}
                        />
                    </div>
                    <Button variant={"default"}>
                        <TypographyH5>Sign in</TypographyH5>
                    </Button>
                    <ToggleThemeButton />
                </div>
            </nav>
            <div className="block md:hidden pb-2 w-full">
                <CommandInputWithList
                    isSearchInputFocused={isSearchInputFocused}
                    setIsSearchInputFocused={setIsSearchInputFocused}
                    placeholder="Search (ctrl+k)..."
                    value={searchQuery}
                    onValueChange={(v) => setSearchQuery(v)}
                    loadingList={loadingSuggestions}
                    list={searchSuggestionsList}
                />
            </div>
        </header>
    );
}
