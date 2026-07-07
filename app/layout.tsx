import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "就活管理",
  description: "応募中・検討中の企業を管理します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
