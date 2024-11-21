"use client";

import ThreeDotLoading from "@/components/Loader/ThreeDotLoading";
import { TypographySmall } from "@/components/ui/typography";
import { getCategories } from "@/lib/apiClient";
import { useEffect, useState } from "react";

const CategoriesSection = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(false);

    useEffect(() => {
        setLoadingCategories(true);
        getCategories()
            .then((res) => {
                setCategories((_) => {
                    res.data.sort();
                    return res.data;
                });
            })
            .finally(() => {
                setLoadingCategories(false);
            });
    }, []);
    return (
        <>
            <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1">
                {categories.map((category) => (
                    <div key={category} className="capitalize">
                        <TypographySmall>{category}</TypographySmall>
                    </div>
                ))}
            </div>
            {loadingCategories && (
                <div className="flex justify-center">
                    <ThreeDotLoading />
                </div>
            )}
        </>
    );
};

export default CategoriesSection;
