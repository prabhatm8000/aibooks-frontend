import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getGradientClass = (
    to: "t" | "b" | "l" | "r" = "b",
    variant:
        | "arcticIce"
        | "forestTwilight"
        | "morningHorizon"
        | "oceanMist"
        | "sunsetGlow"
        | "tropicalVibes",
    textColor: string = "text-white"
) => {
    const bgGradientClass: Map<string, string> = new Map<string, string>([
        ["arcticIce", "from-[#00c6ff] via-[#0072ff] to-[#2a2a72]"],
        ["forestTwilight", "from-[#13547a] via-[#80d0c7] to-[#c3fbd8]"],
        ["morningHorizon", "from-[#ffecd2] via-[#fcb69f] to-[#fe938c]"],
        ["oceanMist", "from-[#3a7bd5] via-[#86a8e7] to-[#ffffff]"],
        ["sunsetGlow", "from-[#ff9a8b] via-[#fccb90] to-[#d1cfe2]"],
        ["tropicalVibes", "from-[#f6d365] via-[#fda085] to-[#ff6f91]"],
    ]);
    const gradientClass = bgGradientClass.get(variant);
    return `bg-gradient-to-${to} ${gradientClass || ""} ${textColor}`;
};
