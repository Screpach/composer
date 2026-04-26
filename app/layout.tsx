import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Romantic Harmony Generator",
  description: "8-bar historically informed romantic harmony studies"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
