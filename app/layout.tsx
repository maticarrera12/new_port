import type { Metadata } from "next";
import { Anton, DM_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";
import { ViewTransitions } from "next-view-transitions";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Matias Carrera",
  description: "Full Stack Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className={`${anton.variable} ${dmSans.variable} antialiased`}>
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ViewTransitions>
  );
}
