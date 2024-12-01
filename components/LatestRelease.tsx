"use client";

import useLatestBooksStore from "@/hooks/zustand/useLatestBooksStore";
import { getLatestReleases } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import ErrorPage from "./ErrorPage";
import HeadingWithUnderline from "./HeadingWithUnderline";
import LoaderPage from "./Loader/LoaderPage";
import { CancelAbortMsg } from "@/lib/defaults";
import { toast } from "@/hooks/use-toast";

const LatestRelease = () => {
    const [loadingLatestBooks, setLoadingLatestBooks] = useState(true);
    const { latestBooks, setLatestBooks } = useLatestBooksStore();
    useEffect(() => {
        if (latestBooks.length > 0) {
            setLoadingLatestBooks(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        setLoadingLatestBooks(true);
        getLatestReleases(signal)
            .then((res) => setLatestBooks(res))
            .catch((err) => {
                if (err !== CancelAbortMsg) {
                    toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive",
                    });
                }
            })
            .finally(() => setLoadingLatestBooks(false));

        return () => controller.abort(CancelAbortMsg);
    }, []);
    return (
        <div className="space-y-4">
            <HeadingWithUnderline text="Latest Release" />
            {loadingLatestBooks && <LoaderPage />}
            {latestBooks?.length === 0 && !loadingLatestBooks && (
                <ErrorPage code={500} message="Something went wrong." />
            )}
            <div style={{
                scrollBehavior: "smooth",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                overflowX: "scroll",
            }}>
                {latestBooks?.length > 0 && (
                    <div className="flex items-center w-full gap-4">
                        {latestBooks.map((book) => (
                            <div key={book.id} className="min-w-[250px] max-w-[250px]">
                                <BookCard book={book} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LatestRelease;
