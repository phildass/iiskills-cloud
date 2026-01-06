import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Learnapt - Learn Your Aptitude",
  description: "Discover your learning preferences, problem-solving styles, and motivation drivers with Learnapt's comprehensive aptitude tests.",
  keywords: ["aptitude test", "learning preferences", "problem solving", "motivation", "learnapt"],
  authors: [{ name: "Learnapt" }],
  openGraph: {
    title: "Learnapt - Learn Your Aptitude",
    description: "Discover your learning preferences, problem-solving styles, and motivation drivers.",
    type: "website",
    siteName: "Learnapt",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
