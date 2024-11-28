import { TypographySmall } from "@/components/ui/typography";

const CategoriesSection = ({ categories }: { categories: string[] }) => {
    return (
        <>
            <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1">
                {categories.map((category) => (
                    <div key={category} className="capitalize">
                        <TypographySmall>{category}</TypographySmall>
                    </div>
                ))}
            </div>
        </>
    );
};

export default CategoriesSection;
