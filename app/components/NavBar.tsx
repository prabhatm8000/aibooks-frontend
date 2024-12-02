"use client";

import {
    CloudAlertIcon,
    LibraryIcon,
    LogOutIcon,
    MenuIcon,
    Moon,
    Search,
    Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/app/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import {
    TypographyH3,
    TypographyH5,
    TypographyP,
    TypographySmall,
} from "./ui/typography";

import useUserAuthStore from "@/hooks/zustand/useUserAuthStore";
import { getSearchSuggestions, getUser, login, logout } from "@/lib/apiClient";
import Image from "next/image";
import LoadingSpinner from "./Loader/LoadingSpinner";
import { ButtonLink } from "./ui/buttonlink";
import UserAvtar from "./UserAvtar";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SuggestionsType = {
    id: string;
    label: string;
    label2?: string;
    icon: {
        publicId: string;
        url: string;
        width: {
            small: number;
            medium: number;
            large: number;
        };
        height: {
            small: number;
            medium: number;
            large: number;
        };
    };
    isDisabled?: boolean;
    href?: string;
};

export default function NavBar({
    onMenuBtnClick,
}: {
    onMenuBtnClick: () => void;
}) {
    const router = useRouter();
    const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loadingSuggestions, setLoadingSuggestions] =
        useState<boolean>(false);
    const [searchSuggestionsList, setSearchSuggestionsList] = useState<
        SuggestionsType[]
    >([]);

    // #region [handling focus & key bindings]
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
                setIsSearchInputFocused(false);
                router.push(`/book/search?q=${searchQuery}`);
            }
        };

        addEventListener("keydown", focusSearchInput);

        return () => {
            removeEventListener("keydown", focusSearchInput);
        };
    }, [searchQuery]);
    // #endregion

    // #region [handling suggestions]
    useEffect(() => {
        const populate = () => {
            if (searchQuery.length === 0) {
                setLoadingSuggestions(false);
                return;
            }
            setLoadingSuggestions(true);
            getSearchSuggestions(searchQuery, 5)
                .then((res) => {
                    const list: SuggestionsType[] = res.map((item) => ({
                        id: item.id,
                        label: item.title,
                        label2: item.genre.join(", "),
                        icon: item.coverImage,
                        isDisabled: false,
                        href: `/book/byId/${item.id}`,
                    }));
                    setSearchSuggestionsList(list);
                })
                .finally(() => setLoadingSuggestions(false));
        };

        const timeout = setTimeout(populate, 500);

        return () => {
            clearTimeout(timeout);
        };
    }, [searchQuery]);
    // #endregion

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

                <div className="flex items-center justify-end md:justify-between gap-4 w-full pb-2">
                    <div className="hidden md:block w-1/2">
                        <SearchWithSuggestions
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
            <div className="block md:hidden pb-8 w-full">
                <SearchWithSuggestions
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

function SearchWithSuggestions({
    isSearchInputFocused,
    setIsSearchInputFocused,
    placeholder,
    list,
    loadingList,
    value,
    onValueChange,
}: {
    isSearchInputFocused: boolean;
    setIsSearchInputFocused: (v: boolean) => void;
    placeholder?: string;
    list?: SuggestionsType[];
    loadingList?: boolean;
    value?: string;
    onValueChange?: (v: string) => void;
}) {
    const [hideList, setHideList] = useState(!isSearchInputFocused);
    const ref = useRef<HTMLInputElement>(null);

    const [imageErrors, setImageErrors] = useState<boolean[]>(
        Array(list?.length).fill(false)
    );

    useEffect(() => {
        const ele = ref.current;
        if (isSearchInputFocused) {
            setHideList(false);
            ele?.focus();
        } else {
            ele?.blur();
            setHideList(true);
        }
    }, [isSearchInputFocused]);

    return (
        <div className="relative">
            <div className="flex items-center gap-2 py-2 px-3 border border-muted rounded-lg">
                <Search size={20} />
                <input
                    ref={ref}
                    className="bg-transparent focus:outline-none placeholder:text-muted-foreground w-full"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onValueChange?.(e.target.value)}
                    onFocus={() => setIsSearchInputFocused(true)}
                />
                <div
                    className={`${
                        loadingList ? "visible" : "invisible"
                    } p-0 flex justify-center`}
                >
                    <LoadingSpinner />
                </div>
            </div>
            {!hideList && (
                <>
                    <div
                        className="fixed z-50 w-screen h-screen left-0 top-0"
                        onClick={() => setIsSearchInputFocused(false)}
                    />
                    <div className="z-[55] absolute bg-background w-full my-2 border border-muted rounded-lg">
                        {list && list.length > 0 && (
                            <div className="p-2">
                                {list?.map((item, index) => (
                                    <Link
                                        href={item?.href || "#"}
                                        onClick={() =>
                                            setIsSearchInputFocused(false)
                                        }
                                        key={index}
                                        className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted"
                                    >
                                        {
                                            <div className="relative aspect-[13/19] w-12">
                                                {imageErrors[index] ? (
                                                    <CloudAlertIcon className="absolute inset-0 m-auto" />
                                                ) : (
                                                    <Image
                                                        src={item.icon.url}
                                                        alt={item.label}
                                                        width={
                                                            item.icon.width
                                                                .small / 2
                                                        }
                                                        height={
                                                            item.icon.height
                                                                .small / 2
                                                        }
                                                        loading="eager"
                                                        className={`object-cover rounded-md aspect-[13/19] size-full ${
                                                            imageErrors[index]
                                                                ? "hidden"
                                                                : ""
                                                        }`}
                                                        onError={() =>
                                                            setImageErrors(
                                                                (prev) => {
                                                                    prev[
                                                                        index
                                                                    ] = true;
                                                                    return prev;
                                                                }
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                        }
                                        <div className="flex flex-col gap-1">
                                            <TypographyP>
                                                {item.label}
                                            </TypographyP>
                                            <TypographySmall isMuted>
                                                {item.label2}
                                            </TypographySmall>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
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
                            className="rounded-full size-10 border-0"
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
                                        <TypographySmall key={index}>
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
