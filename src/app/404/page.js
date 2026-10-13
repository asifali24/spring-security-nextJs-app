import Link from "next/link";

export default function CustomNotFoundPage() {
  return (
    <main className="page-shell">
      <section className="card content-card">
        <p className="eyebrow">404 — Page not found</p>
        <h1>Invalid URL or unavailable page</h1>
        <p className="muted">
          This page does not exist, or you need to sign in before opening it.
        </p>
        <div className="button-row">
          <Link className="button-link" href="/">Go home</Link>
          <Link className="button-link secondary-button" href="/login">Sign in</Link>
        </div>
      </section>
    </main>
  );
}
