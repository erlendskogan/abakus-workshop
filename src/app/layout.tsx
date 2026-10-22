import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
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
      <body className={`${geistSans.variable} ${fraunces.variable} min-h-screen font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
