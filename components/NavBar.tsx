"use client";

import { LibraryIcon, LogOutIcon, MenuIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import { TypographyH3, TypographyH5, TypographySmall } from "./ui/typography";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import useUserAuthStore from "@/hooks/zustand/useUserAuthStore";
import { getSearchSuggestions, getUser, login, logout } from "@/lib/apiClient";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import ThreeDotLoading from "./Loader/ThreeDotLoading";
import { ButtonLink } from "./ui/buttonlink";
import UserAvtar from "./UserAvtar";

type CommandItemType = {
    id: string;
    label: string;
    label2?: string;
    icon: React.ReactNode;
    isDisabled?: boolean;
};

type CommandGroupType = {
    heading?: string;
    items: CommandItemType[];
};

export default function NavBar({
    onMenuBtnClick,
}: {
    onMenuBtnClick: () => void;
}) {
    const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loadingSuggestions, setLoadingSuggestions] =
        useState<boolean>(false);
    const [searchSuggestionsList, setSearchSuggestionsList] = useState<
        CommandGroupType[]
    >([]);

    const onSearchSuggestionClick = (item: CommandItemType) => {
        window.location.href = `/book/byId/${item.id}`;
        console.log(item);
    };

    useEffect(() => {
        const focusSearchInput = (ev: KeyboardEvent) => {
            if (ev.ctrlKey && ev.key === "k") {
                ev.preventDefault();
                setIsSearchInputFocused(true);
            } else if (ev.key === "Escape") {
                setIsSearchInputFocused(false);
            } else if (
                ev.key === "Enter" &&
                isSearchInputFocused &&
                searchQuery.length > 0
            ) {
                ev.preventDefault();
                window.location.href = `/book/search?q=${searchQuery}`;
            }
        };

        addEventListener("keydown", focusSearchInput);

        return () => {
            removeEventListener("keydown", focusSearchInput);
        };
    }, [searchQuery]);

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
                                id: item.id,
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
        <header className="sticky top-0 mx-auto z-50 bg-gradient-to-b from-background from-[75%] to-background/0 w-full">
            <nav className="flex justify-between gap-4 items-center py-4">
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

                <div className="flex items-center justify-end md:justify-between gap-4 w-full">
                    <div className="hidden md:block w-1/2">
                        <CommandInputWithList
                            onItemClick={onSearchSuggestionClick}
                            isSearchInputFocused={isSearchInputFocused}
                            setIsSearchInputFocused={setIsSearchInputFocused}
                            placeholder="Search (ctrl+k)..."
                            value={searchQuery}
                            onValueChange={(v) => setSearchQuery(v)}
                            loadingList={loadingSuggestions}
                            list={searchSuggestionsList}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <UserButton />
                        <ToggleThemeButton />
                    </div>
                </div>
            </nav>
            <div className="block md:hidden pb-2 w-full">
                <CommandInputWithList
                    onItemClick={onSearchSuggestionClick}
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
        <Command className="rounded-lg border shadow-md md:max-w-[450px]">
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
                                    onSelect={() => {
                                        if (onItemClick) {
                                            onItemClick(item);
                                        }
                                        console.log(item);
                                    }}
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

const UserButton = () => {
    const { user, setUser, resetUser } = useUserAuthStore();
    const userActions = [
        {
            label: "My Library",
            type: "link",
            href: "/myLibrary",
            icon: (
                <>
                    <LibraryIcon size={20} />
                </>
            ),
        },
        {
            label: "Logout",
            type: "button",
            onClickHandler: (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                logout()
                    .then((data) => {
                        resetUser();
                        window.location.href = data.authUrl;
                    })
                    .catch((err) => console.log(err))
                    .finally(() => console.log("done"));
            },
            icon: (
                <>
                    <LogOutIcon size={20} />
                </>
            ),
        },
    ];

    const signUpButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        login()
            .then((data) => (window.location.href = data.authUrl))
            .catch((err) => console.log(err))
            .finally(() => console.log("done"));
    };

    useEffect(() => {
        getUser()
            .then((data) => setUser(data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <>
            {!user ? (
                <Button onClick={signUpButtonHandler} variant={"default"}>
                    <TypographyH5>Sign in</TypographyH5>
                </Button>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full size-10"
                            title={`${user.given_name} ${user.family_name}`}
                        >
                            <UserAvtar size={40} user={user} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="rounded-lg px-3 py-1.5 w-full min-w-[300px] max-w-[400px]"
                    >
                        <div className="">
                            <div className="flex items-center gap-3 mt-1.5 mb-3">
                                <UserAvtar size={75} user={user} />
                                <div className="">
                                    <TypographyH3>{user.name}</TypographyH3>
                                    <TypographySmall>
                                        {user.email || user.nickname}
                                    </TypographySmall>
                                </div>
                            </div>

                            {userActions.map((item, index) => {
                                if (item.type === "button") {
                                    return (
                                        <DropdownMenuItem
                                            className="px-0"
                                            key={index}
                                        >
                                            <Button
                                                className="w-full flex gap-2 justify-start px-2"
                                                variant={"destructive"}
                                                onClick={item.onClickHandler}
                                            >
                                                {item.icon}
                                                <span>{item.label}</span>
                                            </Button>
                                        </DropdownMenuItem>
                                    );
                                } else if (item.type === "link") {
                                    return (
                                        <DropdownMenuItem
                                            className="px-0"
                                            key={index}
                                        >
                                            <ButtonLink
                                                className="w-full flex gap-2 justify-start px-2"
                                                href={item.href || "#"}
                                                variant={"secondary"}
                                            >
                                                {item.icon}
                                                <span>{item.label}</span>
                                            </ButtonLink>
                                        </DropdownMenuItem>
                                    );
                                } else {
                                    return (
                                        <TypographySmall>
                                            {item.label}
                                        </TypographySmall>
                                    );
                                }
                            })}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    );
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
                    className="size-10 p-2 rounded-full"
                    title="Toggle theme (ctrl+m)"
                >
                    <Sun className="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
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
