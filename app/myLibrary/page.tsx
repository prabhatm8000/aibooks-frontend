"use client";

import BookCard from "@/components/BookCard";
import ErrorPage from "@/components/ErrorPage";
import HeadingWithUnderline from "@/components/HeadingWithUnderline";
import ThreeDotLoading from "@/components/Loader/ThreeDotLoading";
import { TypographyH4, TypographyH5 } from "@/components/ui/typography";
import { toast } from "@/hooks/use-toast";
import { getLibrary, removeBookFromLibrary } from "@/lib/apiClient";
import type { UserLibraryResponse } from "@/lib/apiResponseTypes";
import { CancelAbortMsg } from "@/lib/defaults";
import { TrashIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const LIMIT = 10;

const RemoveBtn = ({ onClick }: { onClick: () => void }) => {
    const [isClicked, setIsClicked] = useState(false);
    return (
        <button
            disabled={isClicked}
            title="Remove from library"
            className="bg-red-500 disabled:bg-red-400 hover:bg-red-400 dark:bg-red-800 dark:disabled:bg-red-950 dark:hover:bg-red-950 rounded-full p-4 absolute top-0 right-0 m-8 focus:outline-none"
            onClick={() => {
                setIsClicked(true);
                onClick();
            }}
        >
            <TrashIcon size={16} />
        </button>
    );
};

const page = () => {
    const [library, setLibrary] = useState<UserLibraryResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [gotError, setGotError] = useState<boolean>(false);

    // #region [remove]
    const handleRemoveBtn = (bookId: string) => {
        removeBookFromLibrary(bookId)
            .then((res) => {
                toast({
                    title: "Success",
                    description: res.message,
                });
                setLibrary((prev) =>
                    prev
                        ? {
                              ...prev,
                              count: prev.totalBooks - 1,
                              books: prev.books.filter((b) => b.id !== bookId),
                          }
                        : null
                );
            })
            .catch((err) => {
                if (err !== CancelAbortMsg) {
                    toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive",
                    });
                }
            });
    };

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
        if (!hasMore) return;
        if (page === 1) {
            setLibrary(null);
            setHasMore(true);
        }

        const controller = new AbortController();
        const signal = controller.signal;
        setLoading(true);
        getLibrary(page, LIMIT, signal)
            .then((res) => {
                if (res.books.length < LIMIT) {
                    setHasMore(false);
                }
                setLibrary((prev) =>
                    prev
                        ? { ...prev, books: [...prev.books, ...res.books] }
                        : res
                );
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
            .finally(() => setLoading(false));

        return () => controller.abort(CancelAbortMsg);
    }, [page]);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <HeadingWithUnderline text="My Library" />
                <TypographyH5>{`${
                    library?.totalBooks || 0
                } books`}</TypographyH5>
            </div>
            {!loading && gotError && (
                <ErrorPage code={500} message={"Something went wrong."} />
            )}
            {!loading && library?.books.length === 0 && (
                <div className="w-full h-80 flex items-center justify-center">
                    <TypographyH4 isMuted>No books found</TypographyH4>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {library?.books.map((book, index) =>
                    index === library.books.length - 1 ? (
                        <BookCard
                            key={book.id}
                            ref={resultObserverRef}
                            book={book}
                        >
                            <RemoveBtn
                                onClick={() => handleRemoveBtn(book.id)}
                            />
                        </BookCard>
                    ) : (
                        <BookCard key={book.id} book={book}>
                            <RemoveBtn
                                onClick={() => handleRemoveBtn(book.id)}
                            />
                        </BookCard>
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
