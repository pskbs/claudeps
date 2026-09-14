import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "인생여행",
  description: "따뜻한 하루 기록, 인생여행",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "인생여행",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFDCC4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-soft text-stone-700">
        <div className="mx-auto max-w-md min-h-screen px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
