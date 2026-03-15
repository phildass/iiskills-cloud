import type { ReactNode } from "react";

export const metadata = {
  title: "Student Dashboard – IISkills",
  description: "IISkills student learning dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#f5f7fa" }}>
        {/* TODO: Universal navigation bar */}
        {children}
      </body>
    </html>
  );
}
