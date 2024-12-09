import { AutoCarousel } from "@/app/components/AutoCarousel";
import LoaderPage from "@/app/components/Loader/LoaderPage";
import { TypographyH1, TypographyH3 } from "@/app/components/ui/typography";
import { BookIcon, DownloadIcon, SearchIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import PageLayout from "./components/PageLayout";

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
    {
        line: "Explore the Boundless Imagination of AI: Unique Stories Crafted by Artificial Intelligence!",
        bgImg: "/static/images/bg-hero-1.jpg",
    },
    {
        line: "Step Into a Library Like No Other: AI-Generated Stories, Endless Creativity.",
        bgImg: "/static/images/bg-hero-2.jpg",
    },
    {
        line: "Where AI Meets Storytelling: Discover Worlds Only Machines Can Imagine.",
        bgImg: "/static/images/bg-hero-3.jpg",
    },
];

const heroLineCards = heroLines.map((line, index) => (
    <div key={index} className="relative w-full h-[35rem] lg:h-[30rem] rounded-xl">
        <Image
            src={line.bgImg}
            alt=""
            width={1920}
            height={1080}
            loading="eager"
            className="object-cover rounded-xl h-[35rem] lg:h-[30rem]"
        />
        <div
            className={`absolute top-0 w-full h-full flex justify-center items-center bg-theme-black/30 p-2 rounded-xl`}
        >
            <TypographyH1 className="text-center text-5xl text-theme-white">
                {line.line}
            </TypographyH1>
        </div>
    </div>
));

const HeroSection = () => {
    return <AutoCarousel cardContents={heroLineCards} />;
};

const DynamicLatestRelease = dynamic(
    () => import("./components/LatestRelease"),
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
        <PageLayout>
            <MainSection />
        </PageLayout>
    );
}
