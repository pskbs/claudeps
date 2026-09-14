import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "인생여행",
    short_name: "인생여행",
    description: "따뜻한 하루 기록, 인생여행",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8EC",
    theme_color: "#FFDCC4",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/512", sizes: "512x512", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
