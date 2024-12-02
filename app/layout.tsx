import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Julie ♡",
  description: "Created by @debsouryadatta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">{children}
        <Toaster
          toastOptions={{
            style: {
              background: '#4f46e5',
              color: 'white',
              border: '1px solid #4338ca',
            },
          }}
        />
      </body>
    </html>
  );
}
