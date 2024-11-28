"use client";

import ErrorPage from "@/components/ErrorPage";
import HeadingWithUnderline from "@/components/HeadingWithUnderline";
import LoaderPage from "@/components/Loader/LoaderPage";
import useCategoriesStore from "@/hooks/zustand/useCategoriesStore";
import { getCategories } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import CategoriesSection from "./CategoriesSection";

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
            .finally(() => {
                setLoadingCategories(false);
            });

        return () => controller.abort();
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
