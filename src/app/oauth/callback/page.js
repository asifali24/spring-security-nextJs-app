"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setAccessToken } from "../../../lib/api";

export default function OAuthCallbackPage() {
  const router = useRouter();
  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get("access_token");

    if (!token) {
      router.replace("/login?error=oauth");
      return;
    }

    setAccessToken(token);
    window.history.replaceState(null, "", "/oauth/callback");
    router.replace("/protected");
  }, [router]);

  return (
    <main className="page-shell">
      <section className="card content-card">
        <p className="muted">Completing Google login...</p>
      </section>
    </main>
  );
}
