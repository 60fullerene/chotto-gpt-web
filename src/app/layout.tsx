import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Chotto GPT Web",
    description:
        "A modern multi-provider AI chat application supporting OpenAI, Google Gemini, and Anthropic.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <body className="antialiased">{children}</body>
        </html>
    );
}
