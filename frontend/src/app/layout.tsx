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
  title: "AuditPal - Decentralized Smart Contract Auditing",
  description: "Secure your smart contracts using AuditPal's decentralized network of autonomous security agents.",
  icons: {
    icon: [
      { url: "/assets/auditpal.jpg" },
      { url: "/assets/auditpal.jpg", sizes: "32x32", type: "image/jpeg" },
    ],
    apple: "/assets/auditpal.jpg",
  },
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
