"use client";

import ErrorPage from "@/components/ErrorPage";
import HeadingWithUnderline from "@/components/HeadingWithUnderline";
import LoaderPage from "@/components/Loader/LoaderPage";
import { TypographySmall } from "@/components/ui/typography";
import { toast } from "@/hooks/use-toast";
import useCategoriesStore from "@/hooks/zustand/useCategoriesStore";
import { getCategories } from "@/lib/apiClient";
import { CancelAbortMsg } from "@/lib/defaults";
import Link from "next/link";
import { useEffect, useState } from "react";

const CategoriesSection = ({ categories }: { categories: string[] }) => {
    return (
        <>
            <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1">
                {categories.map((category) => (
                    <div key={category} className="capitalize">
                        <Link href={`/book/search?q=${category}`}>
                            <TypographySmall>{category}</TypographySmall>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
};

const page = () => {
    const { categories, setCategories } = useCategoriesStore();
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

    useEffect(() => {
        if (categories) {
            setLoadingCategories(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        setLoadingCategories(true);
        getCategories(signal)
            .then((res) => {
                setCategories(res);
            })
            .catch((err) => {
                if (err !== CancelAbortMsg) {
                    toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive",
                    });
                }
            })
            .finally(() => {
                setLoadingCategories(false);
            });

        return () => controller.abort(CancelAbortMsg);
    }, []);
    return (
        <>
            {Array.isArray(categories?.data) &&
                categories?.data?.length > 0 && (
                    <div className="flex flex-col gap-4 h-full">
                        <HeadingWithUnderline text="Categories" />
                        <CategoriesSection categories={categories?.data} />
                    </div>
                )}
            {loadingCategories && <LoaderPage />}
            {categories?.data?.length === 0 && !loadingCategories && (
                <ErrorPage code={500} message="Something went wrong." />
            )}
        </>
    );
};

export default page;
