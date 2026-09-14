import { ImageResponse } from "next/og";
import { MascotIcon } from "@/lib/app-icon";

export const runtime = "edge";
export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<MascotIcon size={48} />, { ...size });
}
