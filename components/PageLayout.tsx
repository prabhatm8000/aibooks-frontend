"use client";

import { NavBar } from "@/components/NavBar";
import SideBar, { sideBarItems } from "@/components/SideBar";
import {
    TypographyH2,
    TypographyH4,
    TypographySmall,
} from "@/components/ui/typography";
import Link from "next/link";
import { useState } from "react";

const widthStyle = {
    width: "100%",
    maxWidth: "1600px",
};

const heightStyle = {
    minHeight: "100px",
};

const footerItems = [
    {
        label: "Menu",
        items: sideBarItems,
    },
    {
        label: "About",
        items: [
            {
                name: "About",
                href: "/about",
            },
            {
                name: "Github",
                href: "#",
            },
            {
                name: "Gmail",
                href: "mailto:workforprabhat1254@gmail.com",
            },
        ],
    },
];

const FooterSection = ({ children }: { children: React.ReactNode }) => {
    return (
        <footer className="main-margin">
            <div
                className="px-4 py-3 mx-auto bg-foreground/5"
                style={{
                    ...heightStyle,
                }}
            >
                {children}
            </div>
        </footer>
    );
};

export default function PageLayout({
    children,
    disableMenuOptions,
    disableFooter,
}: {
    children: React.ReactNode;
    disableMenuOptions?: boolean;
    disableFooter?: boolean;
}) {
    const [showSideBar, setShowSideBar] = useState<boolean>(false);
    return (
        <>
            {!disableMenuOptions && (
                <SideBar show={showSideBar} setShow={setShowSideBar} />
            )}
            <main className="main-margin">
                <div
                    className="px-2 mx-auto"
                    style={{
                        ...widthStyle,
                    }}
                >
                    {!disableMenuOptions && (
                        <NavBar onMenuBtnClick={() => setShowSideBar(true)} />
                    )}
                    <div className="px-2 h-screen">{children}</div>
                </div>
            </main>
            {!disableFooter && (
                <FooterSection>
                    <TypographyH2 className="my-4 text-center w-full">
                        AiBooks
                    </TypographyH2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
                        {footerItems.map((item, index) => (
                            <div
                                className="flex flex-col items-center"
                                key={index}
                            >
                                <div className="mb-2">
                                    <TypographyH4>{item.label}</TypographyH4>
                                </div>
                                <div className="flex flex-col items-center lg:flex-row lg:divide-x-[1px] divide-foreground/10">
                                    {item.items.map((item, index) => (
                                        <div key={index} className="lg:px-3 text-muted-foreground">
                                            <Link
                                                href={item.href}
                                                className="font-light text-sm"
                                            >
                                                {item.name}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="space-y-1 sm:col-span-2 w-full flex items-center justify-center">
                            <TypographySmall isMuted>
                                Copyright © 2024 AiBooksy. All Rights Reserved
                            </TypographySmall>
                        </div>
                    </div>
                </FooterSection>
            )}
        </>
    );
}
