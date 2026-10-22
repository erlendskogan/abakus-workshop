import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Only for a single warm word in a heading, never for UI text.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["italic"],
  axes: ["SOFT"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FjøsFinn – markedsplassen for fjøsnisser",
  description: "Bytt bort det som hoper seg opp på låven, og finn det du mangler. Bare for fjøsnisser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body
        className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} min-h-screen font-sans text-[16px] leading-relaxed antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
