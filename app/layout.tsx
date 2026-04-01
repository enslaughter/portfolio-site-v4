import type { Metadata } from "next";
import { Montserrat } from 'next/font/google'
import StyledComponentsRegistry from "../lib/registry";
import GlobalStyles from "../lib/GlobalStyles";

export const metadata: Metadata = {
  title: "Elijah Slaughter - Software Engineer",
  description: "The portfolio site for Elijah Slaughter, a software engineer",
};

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],   // Montserrat isn't a variable font, so list the weights you need
  variable: '--font-montserrat',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
          <StyledComponentsRegistry>
            <GlobalStyles />
            {children}
          </StyledComponentsRegistry>
        </body>
    </html>
  );
}
