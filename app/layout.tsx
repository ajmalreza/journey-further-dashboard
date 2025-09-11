import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/sidebar";
import Header from "./components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campaign Dashboard",
  description: "Manage and analyze your marketing campaigns and client data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-white">
          <Header />
          <div className="flex pt-16">
            <Sidebar />
            <main className="flex-1 lg:ml-64 min-w-0">
              <div className="container mx-auto py-8 px-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
