import { ThemeProvider } from "@/components/ThemeProvider";
import PageLayout from "@/components/PageLayout";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

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
            <body className={`${font.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <PageLayout>{children}</PageLayout>
                </ThemeProvider>
            </body>
        </html>
    );
}
