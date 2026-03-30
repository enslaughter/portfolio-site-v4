import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
