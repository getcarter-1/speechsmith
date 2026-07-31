import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Archivo,
  IBM_Plex_Mono,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Legacy fonts — still referenced by not-yet-migrated screens.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// SpeechSmith design system — Archivo (UI), IBM Plex Mono (labels), Source Serif 4 (speech).
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif" });

export const metadata: Metadata = {
  title: "SpeechSmith",
  description: "Guided speech writer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        // legacy
        geistSans.variable,
        geistMono.variable,
        inter.variable,
        "font-sans",
        // design system
        archivo.variable,
        plexMono.variable,
        sourceSerif.variable
      )}
    >
      <body
        className="min-h-full flex flex-col"
        data-occasion="wedding"
        data-sensitivity="playful"
      >
        {children}
      </body>
    </html>
  );
}
