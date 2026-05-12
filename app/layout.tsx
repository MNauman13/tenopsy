import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import Provider from "./provider";
import { Toaster } from "sonner";

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
    <ClerkProvider>
      <html lang="en">
        <body className={`${AppFont.className} antialiased`}>
          <Provider>
            {children}
            <Toaster position="top-center" richColors/>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}