"use client";

import useLatestBooksStore from "@/hooks/zustand/useLatestBooksStore";
import { getLatestReleases } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import ErrorPage from "./ErrorPage";
import HeadingWithUnderline from "./HeadingWithUnderline";
import LoaderPage from "./Loader/LoaderPage";

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
            .catch(console.error)
            .finally(() => setLoadingLatestBooks(false));

        return () => controller.abort();
    }, []);
    return (
        <div className="space-y-4">
            <HeadingWithUnderline text="Latest Release" />
            {loadingLatestBooks && <LoaderPage />}
            {latestBooks?.length === 0 && !loadingLatestBooks && (
                <ErrorPage code={500} message="Something went wrong." />
            )}
            {latestBooks?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {latestBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default LatestRelease;
