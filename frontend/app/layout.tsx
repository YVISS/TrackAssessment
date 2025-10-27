import "./globals.css"
import { poppins } from "./fonts/fonts";
export default function mainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main className="px-20 py-2 bg-linear-to-b from-sky-100 from-20% via-sky-200 to-sky-700 h-screen">{children}</main>
      </body>
    </html>
  );
}