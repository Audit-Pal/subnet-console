import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MainWrapper } from "@/components/layout/MainWrapper";

const instrumentSans = Instrument_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuditPal Subnet",
  description: "Secure your smart contracts using AuditPal's decentralized network of autonomous security agents.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.className} bg-black text-white antialiased overflow-x-hidden`} suppressHydrationWarning>
        <Header />
        <MainWrapper>{children}</MainWrapper>
      </body>
    </html>
  );
}
