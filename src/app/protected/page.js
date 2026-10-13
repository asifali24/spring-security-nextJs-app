"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api, { responseData } from "../../lib/api";
import { signOut } from "../../lib/auth";

export default function ProtectedPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/users")
      .then((response) => setResult(responseData(response)))
      .catch((requestError) => {
        if (requestError.response?.status === 401) {
          signOut();
          router.replace("/404");
          return;
        }
        setError(requestError.response?.data?.error?.message || requestError.message || "Unable to load protected data");
      });
  }, [router]);

  function handleSignOut() {
    signOut().finally(() => router.push("/"));
  }

  return (
    <main className="page-shell">
      <section className="card content-card">
        <div className="top-row">
          <div>
            <p className="eyebrow">Protected route</p>
            <h1>/users</h1>
          </div>
          <button className="secondary-button" onClick={handleSignOut}>Sign out</button>
        </div>
        {error && <p className="error">{error}</p>}
        {!result && !error && <p className="muted">Checking your token...</p>}
        {result && <pre className="result">{JSON.stringify(result, null, 2)}</pre>}
        <Link href="/">Back to public page</Link>
      </section>
    </main>
  );
}
