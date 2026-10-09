import type { MetadataRoute } from "next";

/** PWA manifest — lets users add Civio to the home screen. See README. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Civio — educação política",
    short_name: "Civio",
    description:
      "Entenda política em 5 minutos por dia. Lições curtas de educação política brasileira.",
    start_url: "/aprender",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7c3aed",
    lang: "pt-BR",
    orientation: "portrait",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
