import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const AppFont = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "AI Video Course Generator",
  description: "This is an AI-powered educational video course generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={AppFont.className}
      >
        {children}
      </body>
    </html>
  );
}
