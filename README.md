# FinTab API

A complete backend platform with authentication, authorization, automated testing, and transactional email — built with Node.js, PostgreSQL, and Docker. Running in production.

🌐 **[codebyjoaovitor.com.br](https://codebyjoaovitor.com.br)**

---

## Architecture

```text
Client → Next.js API Routes → PostgreSQL (Neon)
                           → Nodemailer (transactional email)
```

### Stack

`Node.js` `Next.js` `PostgreSQL` `Docker` `Jest` `Nodemailer` `node-pg-migrate` `bcryptjs` `Vercel` `Neon` `GitHub Actions`

---

## Endpoints

| Method   | Path                          | Description                |
| -------- | ----------------------------- | -------------------------- |
| `GET`    | `/api/v1/status`              | API health & database info |
| `POST`   | `/api/v1/users`               | Create account             |
| `GET`    | `/api/v1/users/[username]`    | Get user profile           |
| `PATCH`  | `/api/v1/user`                | Update authenticated user  |
| `POST`   | `/api/v1/sessions`            | Login                      |
| `DELETE` | `/api/v1/sessions`            | Logout                     |
| `POST`   | `/api/v1/activations`         | Request activation email   |
| `GET`    | `/api/v1/activations/[token]` | Confirm account via token  |
| `POST`   | `/api/v1/migrations`          | Run pending migrations     |

---

## Features

### Feature-based authorization

Each user carries a granular set of features that control access to every resource in the system. Authorization is handled through a dedicated model that validates permissions before any operation is executed.

Available features include `create:user`, `read:user`, `read:user:self`, `update:user`, `create:session`, `read:session`, `read:activation_token`, `create:migration`, `read:status`, and more.

### Transactional email

Account activation emails are sent via Nodemailer using a custom domain (`contato@codebyjoaovitor.com.br`). The activation flow generates a unique token, sends the confirmation email, and validates the token on click — fully functional in production.

### Automated tests

59 automated tests with Jest covering the full application surface — authentication flows, session management, user operations, and activation. Tests run end-to-end against a real database.

```text
14 test suites
59 tests passing
100% E2E
```

### Session management

Sessions are created with a configurable expiration time, stored in the database, and invalidated on logout. Cookies are set as `httpOnly` and `sameSite: Lax` for security.

### Error handling

Structured error responses with consistent shape across all endpoints:

```json
{
  "name": "UnauthorizedError",
  "message": "Dados de autenticação não conferem.",
  "action": "Verifique se os dados enviados estão corretos.",
  "status_code": 401
}
```

---

## Running locally

### Prerequisites

- Node.js 24
- Docker

### Setup

```bash
# Clone the repository
git clone https://github.com/joaoVitorDS12/progresso-curso.dev.git
cd progresso-curso.dev

# Install dependencies
npm install

# Start the database
npm run services:up

# Wait for the database to be ready
npm run services:wait:database

# Run migrations
npm run migrations:up

# Start the development server
npm run dev
```

### Environment variables

Create a `.env.development` file at the root:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=local_db
POSTGRES_USER=local_user
POSTGRES_PASSWORD=local_password
EMAIL_SMTP_HOST=your_smtp_host
EMAIL_SMTP_PORT=your_smtp_port
EMAIL_SMTP_USER=your_email
EMAIL_SMTP_PASSWORD=your_password
```

---

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

Tests run against a local PostgreSQL instance via Docker. The orchestrator clears and re-migrates the database before each test suite.

---

## CI/CD

Two GitHub Actions workflows run on every pull request:

**Linting** — Prettier formatting check, ESLint, and commitlint validation.

**Automated Tests** — Full Jest test suite runs against a live database on every PR.

Commits follow the [Conventional Commits](https://www.conventionalcommits.org/) standard, enforced by commitlint and Husky.

---

## Project structure

```text
.
├── pages/
│   ├── api/
│   │   └── v1/
│   │       ├── activations/    # Activation token endpoints
│   │       ├── migrations/     # Migration runner endpoint
│   │       ├── sessions/       # Login / logout
│   │       ├── status/         # Health check
│   │       ├── user/           # Authenticated user
│   │       └── users/          # User registration & profile
│   └── index.js                # API documentation homepage
├── models/                     # Business logic
│   ├── authentication.js
│   ├── authorization.js
│   ├── activation.js
│   ├── session.js
│   ├── user.js
│   └── password.js
├── infra/                      # Infrastructure
│   ├── compose.yaml            # Docker Compose (local PostgreSQL)
│   ├── migrations/             # Database migrations
│   └── scripts/
├── tests/                      # Jest test suites
└── .github/
    └── workflows/
        ├── linting.yaml
        └── tests.yaml
```
