import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Civio — Entenda política em 5 minutos por dia",
    template: "%s · Civio",
  },
  description:
    "Aprenda como o Brasil funciona, avalie informações e forme suas próprias conclusões. Lições curtas de educação política, em português, feitas para o celular.",
  applicationName: "Civio",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Civio", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
