import { TypographyH3 } from "./ui/typography";

const HeadingWithUnderline = ({
    text,
    children,
    className,
}: {
    text?: string;
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={"my-2 w-fit " + className}>
            <TypographyH3>{children || text || ""}</TypographyH3>
            <div className="h-[1px] w-10/12 bg-foreground/20"></div>
        </div>
    );
};

export default HeadingWithUnderline;
