import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Junta+ — Organize seu dinheiro e alcance seus objetivos",
    template: "%s · Junta+",
  },
  description:
    "Organize seus gastos, descubra onde está desperdiçando e transforme pequenas economias em dinheiro para os seus objetivos.",
};

export const viewport: Viewport = {
  themeColor: "#12935d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
