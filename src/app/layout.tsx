import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// env.siteUrl is already normalized to a valid absolute origin, so this
// cannot throw even if NEXT_PUBLIC_SITE_URL is misconfigured.
export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
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
  themeColor: "#052e20",
  width: "device-width",
  initialScale: 1,
  // No zoom of any kind: fixes the iOS auto-zoom on focus and disables
  // pinch-zoom where the browser honors it. The layout is fully fluid, so no
  // zoom is ever needed.
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lock the light theme so reading/exercise screens stay light; marketing
  // pages layer their own dark green gradient on top.
  return (
    <html lang="pt-BR" data-theme="light" className={inter.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
