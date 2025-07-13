"use client"
import Providers from "./providers";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav
          className="h-20 sticky top-0 bg-[#25222d] z-99 cursor-pointer"
          onClick={() => router.refresh()}
        >
          <Image
            src={"jackpotLogo.svg"}
            alt="Logo"
            width={141}
            height={26}
            className="absolute left-32 top-1/2 -translate-y-1/2"
          />
        </nav>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
