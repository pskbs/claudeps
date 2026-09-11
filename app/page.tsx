import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default function RootPage() {
  const user = getCurrentUser();
  redirect(user ? "/home" : "/login");
}
