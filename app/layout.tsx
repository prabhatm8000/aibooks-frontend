import { ThemeProvider } from "@/app/components/ThemeProvider";
import { Toaster } from "@/app/components/ui/toaster";
import type { Metadata } from "next";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { Nunito } from "next/font/google";
import "./globals.css";
import { getAuth } from "@/hooks/auth";

export const metadata: Metadata = {
    title: "AiBooks",
    description: "Ai Generated Books",
};

const font = Nunito({
    weight: ["400", "500", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // suppressHydrationWarning for next-themes
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${font.className} antialiased transition-colors duration-150`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <RouterContext.Provider value={null}>
                        {children}
                    </RouterContext.Provider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
