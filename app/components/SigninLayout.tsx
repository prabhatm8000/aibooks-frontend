import Image from "next/image";
import Link from "next/link";
import ToggleThemeButton from "./ui/toogleThemeBtn";
import { TypographyH2, TypographySmall } from "./ui/typography";

const SigninLayout = ({ children }: { children: React.ReactNode }) => {
    const bgImage = "/static/images/bg-sign-in.jpg";
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-[1fr_2fr] gap-0 items-center justify-center h-screen relative overflow-hidden">
            <div className="p-4 flex justify-center items-center h-full z-10 backdrop-blur-lg bg-background/30">
                {children}
            </div>

            <Image
                src={bgImage}
                alt=""
                width={1920}
                height={1080}
                loading="eager"
                className="object-cover h-full w-full fixed top-0 right-0"
            />

            <Link
                href={"/"}
                className="fixed top-0 left-0 m-8 z-30"
            >
                <TypographyH2>AiBooks</TypographyH2>
            </Link>

            <span className="fixed top-0 right-0 m-8 z-30">
                <ToggleThemeButton />
            </span>

            <div className="w-full lg:w-1/2 2xl:w-1/3 px-4 py-2 fixed bottom-0 left-0 z-30">
                <div className="space-y-1 sm:col-span-2 w-full text-center">
                    <TypographySmall>
                        Copyright © 2024 AiBooks. All Rights Reserved
                    </TypographySmall>
                </div>
            </div>
        </div>
    );
};

export default SigninLayout;
