import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Finora — Controle financeiro",
    short_name: "Finora",
    description:
      "Controle toda a sua vida financeira em um só lugar: contas, cartões, orçamentos, metas, dívidas e relatórios.",
    start_url: "/painel",
    display: "standalone",
    background_color: "#0e0e14",
    theme_color: "#6366f1",
    icons: [
      { src: "/finora-icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/finora-icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["finance", "productivity"],
    lang: "pt-BR",
  };
}
