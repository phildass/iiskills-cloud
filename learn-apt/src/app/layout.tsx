import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthenticationChecker from "@/lib/AuthenticationChecker";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Learn Aptitude - iiskills.cloud",
  description: "Discover your learning preferences, problem-solving styles, and motivation drivers with comprehensive aptitude tests. Part of the Indian Institute of Professional Skills Development.",
  keywords: ["aptitude test", "learning preferences", "problem solving", "motivation", "iiskills", "professional skills development"],
  authors: [{ name: "iiskills.cloud - Indian Institute of Professional Skills Development" }],
  manifest: "/manifest.json",
  themeColor: "#0056D2",
  openGraph: {
    title: "Learn Aptitude - iiskills.cloud",
    description: "Discover your learning preferences, problem-solving styles, and motivation drivers. Part of the Indian Institute of Professional Skills Development.",
    type: "website",
    siteName: "iiskills.cloud",
    images: [
      {
        url: "/images/iiskills-logo.png",
        width: 512,
        height: 512,
        alt: "iiskills.cloud Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Learn Aptitude" />
        <link rel="apple-touch-icon" href="/images/iiskills-logo.png" />
        <link rel="icon" href="/images/iiskills-logo.png" type="image/png" />
      </head>
      <body className="antialiased font-sans">
        <AuthProvider>
          <AuthenticationChecker />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
