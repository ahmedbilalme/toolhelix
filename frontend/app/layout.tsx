import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import CommandPalette from "@/components/ui/CommandPalette";

export const metadata: Metadata = {
  metadataBase: new URL("https://toolhelix.com"),
  title: {
    default: "ToolHelix — Free Online Tools for Developers & Everyone",
    template: "%s | ToolHelix",
  },
  description:
    "ToolHelix offers 20+ free, instant online tools: image converters, password generators, JSON formatters, calculators, and more. No signup. No clutter.",
  keywords: ["free online tools", "developer tools", "image converter", "json formatter", "password generator", "unit converter"],
  authors: [{ name: "ToolHelix" }],
  openGraph: {
    type: "website",
    siteName: "ToolHelix",
    url: "https://toolhelix.com",
    title: "ToolHelix — Free Online Tools for Developers & Everyone",
    description: "Fast, free, well-designed tools. No signup required.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolHelix — Free Online Tools",
    description: "Fast, free, well-designed tools. No signup required.",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
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
