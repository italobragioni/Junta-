import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Finora — Seu dinheiro sob controle. Seu futuro em movimento.",
    template: "%s · Finora",
  },
  description:
    "Controle toda a sua vida financeira em um só lugar: contas, cartões, orçamentos, metas, dívidas e relatórios. Inteligente, bonito e feito para o celular.",
  applicationName: "Finora",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Finora", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e14" },
  ],
  width: "device-width",
  initialScale: 1,
  // Impede o zoom automático do iOS ao focar campos e o pinch-zoom acidental.
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// Define o tema antes da pintura para evitar "flash" de cor errada.
const themeScript = `(function(){try{var t=localStorage.getItem('finora-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
