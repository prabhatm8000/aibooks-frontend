import { ThemeProvider } from "@/components/ThemeProvider";
import PageLayout from "@/components/PageLayout";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { Toaster } from "@/components/ui/toaster";

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
                        <PageLayout>{children}</PageLayout>
                    </RouterContext.Provider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
