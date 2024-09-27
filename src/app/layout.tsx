import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "sonner";
import Navbar from "~/components/navbar";

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "Simple URL Shortener with analytics",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider >
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <Navbar />
          {children}
        </body>
        <Toaster position="top-left" richColors />
      </html>
    </ClerkProvider>
  );
}
