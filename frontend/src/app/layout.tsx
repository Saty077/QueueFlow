import type { Metadata } from "next";
import Providers from "@/providers/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "QueueFlow",
  description: "Task automation and job processing platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
