import { useState, useEffect, useRef } from "react";
import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return s + "s";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m " + (s % 60) + "s";
  const h = Math.floor(m / 60);
  return h + "h " + (m % 60) + "m";
}

export default function Home() {
  const startTime = useRef(null);
  const [uptimeMs, setUptimeMs] = useState(0);

  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 5000,
  });

  const isOnline = !isLoading && data;

  useEffect(() => {
    if (isOnline && !startTime.current) {
      startTime.current = Date.now();
    }
  }, [isOnline]);

  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      setUptimeMs(Date.now() - startTime.current);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/status",
      desc: "API health & database info",
    },
    { method: "POST", path: "/api/v1/users", desc: "Create account" },
    {
      method: "GET",
      path: "/api/v1/users/[username]",
      desc: "Get user profile",
    },
    {
      method: "PATCH",
      path: "/api/v1/user",
      desc: "Update authenticated user",
    },
    { method: "POST", path: "/api/v1/sessions", desc: "Login" },
    { method: "DELETE", path: "/api/v1/sessions", desc: "Logout" },
    {
      method: "POST",
      path: "/api/v1/activations",
      desc: "Request activation email",
    },
    {
      method: "GET",
      path: "/api/v1/activations/[token]",
      desc: "Confirm account via token",
    },
    {
      method: "POST",
      path: "/api/v1/migrations",
      desc: "Run pending migrations",
    },
  ];

  const methodStyles = {
    GET: { bg: "var(--blue-bg)", color: "var(--blue-text)" },
    POST: { bg: "var(--post-bg)", color: "var(--post-text)" },
    PATCH: { bg: "var(--patch-bg)", color: "var(--patch-text)" },
    DELETE: { bg: "var(--delete-bg)", color: "var(--delete-text)" },
  };

  const features = [
    {
      title: "Feature-based authorization",
      desc: "Granular permission system — each user carries a set of features controlling access to every resource.",
    },
    {
      title: "Transactional email",
      desc: "Account activation emails sent via Nodemailer with custom domain — fully functional in production.",
    },
    {
      title: "59 automated tests",
      desc: "Full E2E test suite with Jest covering authentication, sessions, users, and activation flows.",
    },
    {
      title: "Production-ready infra",
      desc: "PostgreSQL on Neon, deployed on Vercel with custom domain and CI/CD via GitHub Actions.",
    },
  ];

  const stack = [
    "Node.js",
    "Next.js",
    "PostgreSQL",
    "Docker",
    "Jest",
    "Nodemailer",
    "node-pg-migrate",
    "bcryptjs",
    "Vercel",
    "Neon",
    "GitHub Actions",
  ];

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Hero */}
      <section
        style={{
          paddingBottom: "2rem",
          borderBottom: `1px solid var(--border)`,
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "var(--green-text)",
            background: "var(--green-bg)",
            border: `1px solid var(--green-border)`,
            borderRadius: 20,
            padding: "4px 12px",
            marginBottom: "1.5rem",
            fontFamily: "monospace",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--green-text)",
              display: "inline-block",
            }}
          />
          production · codebyjoaovitor.com.br
        </div>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 600,
            margin: "0 0 0.75rem",
            letterSpacing: "-0.03em",
            color: "var(--text)",
          }}
        >
          FinTab{" "}
          <span style={{ fontWeight: 300, color: "var(--text-muted)" }}>
            API
          </span>
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 0 1.5rem",
            fontSize: "1rem",
          }}
        >
          A complete backend platform with authentication, authorization,
          automated testing, and transactional email — built with Node.js,
          PostgreSQL, and Docker. Running in production.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href="https://github.com/joaoVitorDS12/progresso-curso.dev"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid var(--border-strong)`,
              background: "var(--bg)",
              color: "var(--text)",
              textDecoration: "none",
            }}
          >
            GitHub →
          </a>
          <a
            href="/api/v1/status"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid var(--border-strong)`,
              background: "var(--bg)",
              color: "var(--text)",
              textDecoration: "none",
            }}
          >
            Live status →
          </a>
        </div>
      </section>

      {/* Status */}
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: "var(--text-subtle)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "1rem",
        }}
      >
        Live API Status
      </p>
      <div
        style={{
          border: `1px solid var(--border)`,
          borderRadius: 12,
          padding: "1.25rem",
          marginBottom: "2rem",
          background: "var(--bg)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            GET /api/v1/status
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 20,
              background: isOnline ? "var(--green-bg)" : "var(--delete-bg)",
              color: isOnline ? "var(--green-text)" : "var(--delete-text)",
              border: `1px solid ${isOnline ? "var(--green-border)" : "var(--delete-text)"}`,
            }}
          >
            {isLoading ? "fetching..." : isOnline ? "online" : "offline"}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginTop: "1rem",
          }}
        >
          {[
            {
              label: "last updated",
              value: isOnline
                ? new Date(data.updated_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "—",
              sub: null,
            },
            {
              label: "open connections",
              value: isOnline
                ? data.dependencies.database.opened_connections
                : "—",
              sub: isOnline
                ? `of ${data.dependencies.database.max_connections} max`
                : "",
            },
            {
              label: "uptime check",
              value: isOnline ? formatUptime(uptimeMs) : "—",
              sub: "refreshes every 5s",
            },
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              style={{
                background: "var(--bg-secondary)",
                borderRadius: 8,
                padding: "1rem",
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "var(--text-subtle)",
                  marginBottom: 6,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: "var(--text)",
                }}
              >
                {value}
              </div>
              {sub && (
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    color: "var(--text-subtle)",
                    marginTop: 2,
                  }}
                >
                  {sub}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Endpoints */}
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: "var(--text-subtle)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "1rem",
        }}
      >
        Endpoints
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: "2rem",
        }}
      >
        {endpoints.map(({ method, path, desc }) => {
          const c = methodStyles[method];
          return (
            <div
              key={method + path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0.875rem 1rem",
                border: `1px solid var(--border)`,
                borderRadius: 8,
                fontFamily: "monospace",
                fontSize: 13,
                background: "var(--bg)",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "3px 8px",
                  borderRadius: 4,
                  minWidth: 48,
                  textAlign: "center",
                  background: c.bg,
                  color: c.color,
                }}
              >
                {method}
              </span>
              <span style={{ flex: 1, color: "var(--text)" }}>{path}</span>
              <span style={{ color: "var(--text-subtle)", fontSize: 11 }}>
                {desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: "var(--text-subtle)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "1rem",
        }}
      >
        Features
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 10,
          marginBottom: "2rem",
        }}
      >
        {features.map(({ title, desc }) => (
          <div
            key={title}
            style={{
              padding: "1rem 1.25rem",
              border: `1px solid var(--border)`,
              borderRadius: 8,
              background: "var(--bg)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 4,
                color: "var(--text)",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              {desc}
            </div>
          </div>
        ))}
      </div>

      {/* Stack */}
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: "var(--text-subtle)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "1rem",
        }}
      >
        Stack
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          paddingBottom: "2rem",
        }}
      >
        {stack.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "var(--text-muted)",
              background: "var(--bg-tertiary)",
              border: `1px solid var(--border)`,
              borderRadius: 20,
              padding: "4px 12px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </main>
  );
}
