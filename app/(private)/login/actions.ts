"use server";

import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  setSessionCookie,
  signSession,
  verifyAdminPassword,
} from "@/lib/auth";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  try {
    if (!verifyAdminPassword(password)) {
      redirect("/login?error=invalid");
    }
  } catch (err) {
    console.error("[login] config error:", err);
    redirect("/login?error=config");
  }

  const token = await signSession("admin");
  await setSessionCookie(token);
  redirect("/admin");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}
