import type { Metadata } from "next";
import { Sen } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

const sen = Sen({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zimna AI",
  description: "Personalized Productivity",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sen.className} antialiased`}>
        <NextAuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
