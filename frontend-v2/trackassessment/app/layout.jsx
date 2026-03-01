import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "./_components/ui/Sidebar/page";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Track Assessment",
  description: "Track Assessing Site for Determining future tracks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
