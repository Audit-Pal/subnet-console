import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

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
      <body
        className={`${instrumentSans.variable} antialiased bg-black text-white font-sans`}
      >
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
      </body>
    </html>
  );
}
