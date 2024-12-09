"use client";

import {
    CloudAlertIcon,
    LibraryIcon,
    LogOutIcon,
    MenuIcon,
    Search,
} from "lucide-react";

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
import { getSearchSuggestions } from "@/lib/apiClient";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./Loader/LoadingSpinner";
import { widthStyle } from "./PageLayout";
import { ButtonLink } from "./ui/buttonlink";
import ToggleThemeButton from "./ui/toogleThemeBtn";
import UserAvtar from "./UserAvtar";

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
    const { user, getAuth, logoutAndResetUser } = useUserAuthStore();
    const router = useRouter();
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
                logoutAndResetUser();
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
        localStorage.setItem("prevPath", window.location.pathname);
        router.push("/sign-in");
    };

    useEffect(() => {
        getAuth();
    }, []);

    return (
        <>
            {!user ? (
                <Button variant={"default"} onClick={signUpButtonHandler}>
                    <TypographyH5>Sign in</TypographyH5>
                </Button>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full size-10 border-0"
                            title={`${user.first_name} ${user.last_name}`}
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
                                    <TypographyH3>
                                        {user.first_name} {user.last_name}
                                    </TypographyH3>
                                    <TypographySmall>
                                        {user.email}
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

export default function NavBar({
    onMenuBtnClick,
}: {
    onMenuBtnClick?: () => void;
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
        <div className="main-margin sticky top-0 z-50 bg-gradient-to-b from-background from-[75%] to-background/0">
            <div className="mx-auto" style={{ ...widthStyle }}>
                <header className="w-full px-4">
                    <nav className="flex justify-between gap-4 items-center py-4">
                        <div className="flex items-center gap-2 md:hidden">
                            {onMenuBtnClick && (
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    onClick={onMenuBtnClick}
                                >
                                    <MenuIcon />
                                </Button>
                            )}
                            <TypographyH3>AiBooks</TypographyH3>
                        </div>

                        <div className="flex items-center justify-end md:justify-between gap-4 w-full pb-2">
                            <div className="hidden md:block w-1/2">
                                <SearchWithSuggestions
                                    isSearchInputFocused={isSearchInputFocused}
                                    setIsSearchInputFocused={
                                        setIsSearchInputFocused
                                    }
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
            </div>
        </div>
    );
}
