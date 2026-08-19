import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import CommandPalette from "@/components/ui/CommandPalette";
import { TOOLS } from "@/lib/tools";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://toolhelix.com"),
  title: {
    default: "ToolHelix — Free Online Tools for Developers & Everyone",
    template: "%s | ToolHelix",
  },
  description:
    `ToolHelix offers ${TOOLS.length}+ free, instant online tools: image converters, password generators, JSON formatters, calculators, and more. No signup. No clutter.`,
  keywords: ["free online tools", "developer tools", "image converter", "json formatter", "password generator", "unit converter"],
  authors: [{ name: "ToolHelix" }],
  openGraph: {
    type: "website",
    siteName: "ToolHelix",
    url: "https://toolhelix.com",
    title: "ToolHelix — Free Online Tools for Developers & Everyone",
    description: "Fast, free, well-designed tools. No signup required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolHelix — Free Online Tools",
    description: "Fast, free, well-designed tools. No signup required.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <NavBar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
        <CommandPalette />
      </body>
    </html>
  );
}
