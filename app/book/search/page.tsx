"use client";

import ErrorPage from "@/components/ErrorPage";
import { TypographyH3 } from "@/components/ui/typography";
import { useSearchParams } from "next/navigation";

const page = () => {
    const query = useSearchParams();
    const searchQuery = query.get("q");

    return (
        <div className="flex flex-col gap-4">
            {!searchQuery ? (
                <ErrorPage code={400} message="Search query not found." />
            ) : (
                <div className="my-2 w-fit">
                    <TypographyH3>
                        Search results for:{" "}
                        <span className="italic">{searchQuery}</span>
                    </TypographyH3>
                    <div className="h-1 w-10/12 bg-muted"></div>
                </div>
            )}
        </div>
    );
};

export default page;
