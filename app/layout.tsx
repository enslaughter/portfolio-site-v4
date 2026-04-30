import type { Metadata } from "next";
import { Montserrat } from 'next/font/google'
import StyledComponentsRegistry from "../lib/registry";
import GlobalStyles from "../lib/GlobalStyles";
import { UserProvider } from "../lib/UserContext";
import { StoreProvider } from "../lib/store/StoreProvider";
import { UserSyncer } from "../lib/UserSyncer";
import { getUser } from "../lib/getUser";

export const metadata: Metadata = {
  title: "Elijah Slaughter - Software Engineer",
  description: "The portfolio site for Elijah Slaughter, a software engineer",
};

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <StoreProvider>
          <StyledComponentsRegistry>
            <GlobalStyles />
            <UserProvider user={user}>
              <UserSyncer />
              {children}
            </UserProvider>
          </StyledComponentsRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
