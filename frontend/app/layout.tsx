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
        <main className="">{children}</main>
      </body>
    </html>
  );
}