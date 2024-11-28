import { TypographyH3 } from "./ui/typography";

const HeadingWithUnderline = ({ text }: { text: string }) => {
    return (
        <div className="my-2 w-fit">
            <TypographyH3>{text}</TypographyH3>
            <div className="h-[1px] w-10/12 bg-foreground/20"></div>
        </div>
    );
};

export default HeadingWithUnderline;
