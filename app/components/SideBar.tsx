import { EarthIcon, HomeIcon, SettingsIcon, LibraryIcon } from "lucide-react";
import Link from "next/link";
import { TypographyH2, TypographyH5 } from "./ui/typography";

export const sideBarItems = [
    {
        id: 1,
        name: "Home",
        href: "/",
        icon: (
            <>
                <HomeIcon size={20} />
            </>
        ),
    },
    {
        id: 2,
        name: "Popular",
        href: "/popular",
        icon: (
            <>
                <EarthIcon size={20} />
            </>
        ),
    },
    {
        id: 3,
        name: "Categories",
        href: "/categories",
        icon: (
            <>
                <SettingsIcon size={20} />
            </>
        ),
    },
    {
        id: 4,
        name: "My Library",
        href: "/myLibrary",
        icon: (
            <>
                <LibraryIcon size={20} />
            </>
        ),
    },
];

const SideBar = ({
    show,
    setShow,
}: {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <div
            className={`fixed top-0 z-[51] ${
                show ? "left-0" : "-left-full"
            } md:left-0 w-screen md:w-sidebar bg-gradient-to-r from-background via-90% via-background/20 to-background/0 transition-all duration-300 ease-in-out`}
            onClick={() => setShow(false)}
        >
            <div
                className={`z-[52] bg-background border-r border-secondary w-sidebar h-screen ${
                    show ? "left-0" : "-left-full"
                } md:visible flex flex-col py-6 px-6 transition-all duration-300 ease-in-out`}
            >
                <div className="flex flex-col gap-3">
                    <div className="mb-2">
                        <TypographyH2>AiBooks</TypographyH2>
                    </div>
                    {sideBarItems.map((item) => (
                        <Link
                            href={item.href}
                            key={item.id}
                            className="flex gap-3 items-center w-full h-full p-2 hover:bg-secondary rounded-lg"
                        >
                            <span>{item.icon}</span>
                            <TypographyH5>{item.name}</TypographyH5>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SideBar;
