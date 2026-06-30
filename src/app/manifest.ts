import type { MetadataRoute } from "next";
import { METADATA } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: METADATA.title,
    short_name: "Music Bugle",
    description: METADATA.description,
    start_url: "/",
    display: "standalone",
    background_color: "#1B1B1B",
    theme_color: "#B94445",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
