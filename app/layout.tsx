import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatFinity",
  description: "Your intelligent chat workspace",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
