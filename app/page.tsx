import { AutoCarousel } from "@/components/AutoCarousel";
import LoaderPage from "@/components/Loader/LoaderPage";
import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import { BookIcon, DownloadIcon, SearchIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const iconSize = 40;

const heroCardContent = [
    {
        text: "Search your favorite books",
        href: "#",
        icon: (
            <>
                <SearchIcon size={iconSize} />
            </>
        ),
    },
    {
        text: "New books every week",
        href: "#",
        icon: (
            <>
                <BookIcon size={iconSize} />
            </>
        ),
    },
    {
        text: "Download books for free",
        href: "#",
        icon: (
            <>
                <DownloadIcon size={iconSize} />
            </>
        ),
    },
];

const heroCards = heroCardContent.map((item, index) => (
    <div
        key={index}
        className="bg-background/20 w-full h-full flex items-center justify-center rounded-lg p-4"
    >
        <Link
            href={item.href}
            className="flex flex-col items-center justify-center gap-2"
        >
            <TypographyH3>{item.text}</TypographyH3>
            {item.icon}
        </Link>
    </div>
));

const heroLines = [
    "Explore the Boundless Imagination of AI: Unique Stories Crafted by Artificial Intelligence!",
    "Step Into a Library Like No Other: AI-Generated Stories, Endless Creativity.",
    "Where AI Meets Storytelling: Discover Worlds Only Machines Can Imagine.",
];

const heroLineCards = heroLines.map((line, index) => (
    <div key={index} className="h-full">
        <TypographyH1 className="text-center text-5xl">{line}</TypographyH1>
    </div>
));

const HeroSection = () => {
    return (
        <div className="relative w-full h-[35rem] lg:h-[30rem]">
            <Image
                src={"/static/images/bg-home-hero.jpg"}
                alt=""
                width={1920}
                height={1080}
                loading="eager"
                className="object-cover rounded-xl h-[35rem] lg:h-[30rem]"
            />
            <div
                className={`absolute top-0 w-full h-full align-middle bg-background/10 p-2 text-white`}
            >
                <AutoCarousel cardContents={heroLineCards} />
            </div>
        </div>
    );
};

const DynamicLatestRelease = dynamic(
    () => import("../components/LatestRelease"),
    {
        loading: () => <LoaderPage />,
    }
);

const MainSection = () => {
    return (
        <div className="flex flex-col gap-8">
            <HeroSection />
            <DynamicLatestRelease />
            <div className="text-center h-full w-full rounded-lg bg-background/20 text-foreground">
                <AutoCarousel cardContents={heroCards} />
            </div>
        </div>
    );
};

export default function Home() {
    return (
        <>
            <MainSection />
        </>
    );
}
