import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "./_components/ui/Sidebar/page";
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Sidebar></Sidebar>
        {children}
      </body>
    </html>
  );
}
