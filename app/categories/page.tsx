import { TypographyH3 } from "@/components/ui/typography";
import CategoriesSection from "./CategoriesSection";

const page = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="my-2 w-fit">
                <TypographyH3>Categories</TypographyH3>
                <div className="h-1 w-10/12 bg-yellow-400"></div>
            </div>
            <CategoriesSection />
        </div>
    );
};

export default page;
