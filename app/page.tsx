import { AutoCarousel } from "@/components/AutoCarousel";
import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import { BookIcon, DownloadIcon, GemIcon, SearchIcon } from "lucide-react";
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
    {
        text: "Create your own book with AI",
        href: "#",
        icon: (
            <>
                <GemIcon size={iconSize} />
            </>
        ),
    },
];

const heroCards = heroCardContent.map((item) => (
    <div className="bg-background/20 w-full h-full flex items-center justify-center rounded-lg p-4">
        <Link
            href={item.href}
            className="flex flex-col items-center justify-center gap-2"
        >
            <TypographyH3>{item.text}</TypographyH3>
            {item.icon}
        </Link>
    </div>
));

const HeroSection = () => {
    return (
        <div className="relative w-full h-[40rem] lg:h-96">
            <Image
                src={"/static/images/bg-home-hero.jpg"}
                alt=""
                width={1920}
                height={1080}
                loading="eager"
                className="object-cover rounded-xl h-[40rem] lg:h-96"
            />
            <div
                className={`absolute top-0 h-full bg-background/10 p-2 grid grid-cols-1 lg:grid-cols-[10fr_6fr] xl:grid-cols-[10fr_1fr] gap-5 items-center justify-center text-white`}
            >
                <div className="text-center">
                    <TypographyH1>
                        Explore AI-Generated Books: Creativity Beyond
                        Imagination!
                    </TypographyH1>
                </div>
                <div className="text-center h-full w-full rounded-lg bg-background/20 text-foreground">
                    <AutoCarousel cardContents={heroCards} />
                </div>
            </div>
        </div>
    );
};

const LatestRelease = () => {
    return (
        <div className="space-y-4">
            <div className="my-2 w-fit">
                <TypographyH3>Latest Release</TypographyH3>
                <div className="h-1 w-10/12 bg-yellow-400"></div>
            </div>
        </div>
    );
};

const MainSection = () => {
    return (
        <div className="flex flex-col gap-8">
            <HeroSection />
            <LatestRelease />
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
