import { ImageResponse } from "next/og";
import { MascotIcon } from "@/lib/app-icon";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(<MascotIcon size={192} />, { width: 192, height: 192 });
}
