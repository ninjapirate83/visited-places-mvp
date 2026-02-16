import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visited Places",
  description: "A simple visited places tracker (US states + countries).",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="mx-auto max-w-xl px-5 py-7 sm:px-8 sm:py-10">
          {children}
        </div>
      </body>
    </html>
  );
}

