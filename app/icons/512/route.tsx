import { ImageResponse } from "next/og";
import { MascotIcon } from "@/lib/app-icon";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(<MascotIcon size={512} />, { width: 512, height: 512 });
}
