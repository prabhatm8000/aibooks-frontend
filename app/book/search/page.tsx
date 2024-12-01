"use client";

import BookCard from "@/components/BookCard";
import ErrorPage from "@/components/ErrorPage";
import HeadingWithUnderline from "@/components/HeadingWithUnderline";
import ThreeDotLoading from "@/components/Loader/ThreeDotLoading";
import { TypographyH3, TypographyH4 } from "@/components/ui/typography";
import { toast } from "@/hooks/use-toast";
import { searchBooks } from "@/lib/apiClient";
import type { BookResponse } from "@/lib/apiResponseTypes";
import { CancelAbortMsg } from "@/lib/defaults";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const SEARCHLIMIT = 10;

const page = () => {
    const query = useSearchParams();
    const searchQuery = query.get("q");

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<BookResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [gotError, setGotError] = useState<boolean>(false);

    const reset = () => {
        setSearchResults([]);
        setPage(1);
        setHasMore(true);
        setLoading(false);
        setGotError(false);
    };

    // #region [search term]
    useEffect(() => {
        if (searchQuery) {
            setSearchTerm(searchQuery.trim());
            reset();
        }
    }, [searchQuery]);
    // #endregion

    // #region [infinite scroll]
    const observer = useRef<IntersectionObserver | null>();
    const resultObserverRef = useCallback(
        (element: HTMLDivElement) => {
            if (loading) {
                return;
            }

            if (observer.current) {
                observer.current.disconnect();
            }

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((p) => p + 1);
                }
            });

            if (element) {
                observer.current?.observe(element);
            }
        },
        [loading, hasMore]
    );
    // #endregion

    useEffect(() => {
        setGotError(false);
        if (!searchTerm || !hasMore) {
            return;
        }

        if (page === 1) {
            setSearchResults([]);
        }

        const controller = new AbortController();
        const signal = controller.signal;

        setLoading(true);
        searchBooks(searchTerm, signal, page, SEARCHLIMIT)
            .then((res) => {
                if (res.length < SEARCHLIMIT) {
                    setHasMore(false);
                }
                setSearchResults((p) => [...p, ...res]);
            })
            .catch((err) => {
                if (err !== CancelAbortMsg) {
                    toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive",
                    });
                    setGotError(true);
                }
            })
            .finally(() => {
                setLoading(false);
            });

        return () => controller.abort(CancelAbortMsg);
    }, [searchTerm, page]);

    return (
        <div className="flex flex-col gap-4">
            {!searchQuery ? (
                <ErrorPage code={400} message="Search query not found." />
            ) : (
                <HeadingWithUnderline>
                    <span>Search results for: </span>
                    <span className="italic">{searchQuery}</span>
                </HeadingWithUnderline>
            )}

            {!loading && gotError && (
                <ErrorPage code={500} message={"Something went wrong."} />
            )}

            {!loading && searchResults.length === 0 && (
                <div className="w-full h-80 flex items-center justify-center">
                    <TypographyH4 isMuted>No results found.</TypographyH4>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {searchResults.map((book, index) =>
                    index === searchResults.length - 1 ? (
                        <BookCard
                            key={book.id}
                            ref={resultObserverRef}
                            book={book}
                        />
                    ) : (
                        <BookCard key={book.id} book={book} />
                    )
                )}
            </div>

            {loading && (
                <div className="w-full h-80 flex items-center justify-center">
                    <ThreeDotLoading />
                </div>
            )}
        </div>
    );
};

export default page;
