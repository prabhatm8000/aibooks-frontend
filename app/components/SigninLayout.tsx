import Image from "next/image";
import ToggleThemeButton from "./ui/toogleThemeBtn";
import { TypographyH2, TypographySmall } from "./ui/typography";

const SigninLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center justify-center h-screen relative overflow-hidden">
            <div className="m-4 flex justify-center z-20">{children}</div>
            <Image
                src={"/static/images/bg-6.jpg"}
                alt=""
                width={1920}
                height={1080}
                loading="eager"
                className="object-cover h-full w-full lg:w-1/2 absolute top-0 right-0 -z-10 blur-[1000px] animate-pulse"
                style={{
                    animationDuration: "5s",
                }}
            />
            <Image
                src={"/static/images/bg-6.jpg"}
                alt=""
                width={1920}
                height={1080}
                loading="eager"
                className="object-cover h-full w-full lg:w-1/2 absolute top-0 right-0"
            />
            <span className="fixed top-0 left-0 m-8 text-black lg:text-foreground">
                <TypographyH2>AiBooks</TypographyH2>
            </span>
            <span className="fixed top-0 right-0 m-8">
                <ToggleThemeButton />
            </span>
            <div className="w-full lg:w-1/2 px-4 py-2 fixed bottom-0 left-0">
                <div className="space-y-1 sm:col-span-2 w-full flex items-center justify-center">
                    <TypographySmall isMuted>
                        Copyright © 2024 AiBooks. All Rights Reserved
                    </TypographySmall>
                </div>
            </div>
        </div>
    );
};

export default SigninLayout;
