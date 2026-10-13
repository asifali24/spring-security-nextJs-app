"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "../lib/auth";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isSignIn = mode === "signin";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await (isSignIn ? signIn(form) : signUp(form));
      router.replace("/protected");
    } catch (requestError) {
      setError(
        requestError.response?.data?.error?.message ||
          requestError.response?.data?.message ||
          requestError.message ||
          "Request failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="card auth-card">
        <p className="eyebrow">Spring Security demo</p>
        <h1>{isSignIn ? "Sign in" : "Create account"}</h1>
        <p className="muted">
          {isSignIn ? "Use your backend credentials to receive a JWT." : "Create a user in the Spring Security backend."}
        </p>

        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isSignIn ? "Sign in" : "Sign up"}
          </button>
        </form>

        {isSignIn && (
          <a className="google-button" href="http://localhost:8080/oauth2/authorization/google">
            Continue with Google
          </a>
        )}

        <p className="switch-link">
          {isSignIn ? "Need an account?" : "Already have an account?"}{" "}
          <Link href={isSignIn ? "/signup" : "/login"}>{isSignIn ? "Sign up" : "Sign in"}</Link>
        </p>
      </section>
    </main>
  );
}
