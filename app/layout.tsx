import type { Metadata } from "next";
import StyledComponentsRegistry from "../lib/registry";

export const metadata: Metadata = {
  title: "Elijah Slaughter - Software Engineer",
  description: "The portfolio site for Elijah Slaughter, a software engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><StyledComponentsRegistry>{children}</StyledComponentsRegistry></body>
    </html>
  );
}
