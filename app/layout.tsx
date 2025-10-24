import "./globals.css"
export default function mainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="w-full" suppressHydrationWarning>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main className="container">{children}</main>
      </body>
    </html>
  );
}