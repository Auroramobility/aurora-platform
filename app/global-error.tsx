"use client";

// This only fires for errors thrown inside the root layout itself
// (app/layout.tsx) — everything else is caught by app/error.tsx.
// Next.js requires this file to render its own <html>/<body> since it
// fully replaces the root layout when active, so it's deliberately
// plain (no fonts, no design system) to avoid depending on anything
// that might itself be the thing that failed.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Aurora Mobility is temporarily unavailable
        </h1>
        <p style={{ marginTop: "0.5rem", color: "#666" }}>
          Something went wrong loading the application. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem 1.25rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            background: "white",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
