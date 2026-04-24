"use client";
import { usePathname } from "next/navigation";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/') {
    return <main className="min-h-screen">{children}</main>;
  }
  return <main className="min-h-screen pt-16">{children}</main>;
}
