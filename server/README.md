# Authentication Server

Node.js + Express backend that handles email/password auth as well as Google, Kakao, Naver, and Supabase OAuth logins for the React Native client.

## Prerequisites

- Node.js 18+ (project developed and tested with Node 22)
- npm

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   - Copy `.env.example` to `.env`
   - Fill in secrets for JWT signing and each OAuth provider
   - `DATABASE_URL` defaults to an on-disk SQLite database (`./prisma/dev.db`)

3. **Generate database + Prisma Client**
   ```bash
   npx prisma migrate reset --force
   ```
   This command recreates the SQLite database using the bundled migrations and generates Prisma Client.

4. **Run in development**
   ```bash
   npm run dev
   ```
   The API boots on the port specified in `.env` (`4000` by default).

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## OAuth Configuration Tips

- **Google**: Create OAuth credentials in Google Cloud Console. Add the iOS/Android bundle identifiers and your backend redirect URI. Copy client ID/secret into the `.env`.
- **Kakao**: In Kakao Developers console, register the Android/iOS bundle IDs and the backend redirect URI. Use the REST API key as `KAKAO_REST_API_KEY`.
- **Naver**: Create an application in Naver Developers, enable `Login`, and add redirect URIs for mobile and backend. Provide client ID/secret via environment variables.
- **Supabase**: In Supabase dashboard, create a project and enable Email/OAuth providers as needed. Copy the project URL and the service role key (used server-side) into the `.env`. The client sends the Supabase access token (and optional refresh token) to `/auth/oauth` with `provider: "supabase"`.

## API Overview

Base URL: `http://localhost:<PORT>`

| Method | Path           | Description                          |
| ------ | -------------- | ------------------------------------ |
| POST   | `/auth/register` | Email user registration             |
| POST   | `/auth/login`    | Email/password login                |
| POST   | `/auth/oauth`    | Social login (Google/Kakao/Naver/Supabase) |
| POST   | `/auth/refresh`  | Issue new tokens using refresh token|
| POST   | `/auth/logout`   | Revoke a specific refresh token     |
| POST   | `/auth/logout-all` | Revoke all sessions (requires access token) |
| GET    | `/auth/me`       | Get current user profile (requires access token) |
| GET    | `/health`        | Health probe                        |

### Request Payloads

- **Email register/login**
  ```json
  {
    "email": "user@example.com",
    "password": "P@ssw0rd!",
    "displayName": "Optional name" // only for register
  }
  ```

- **OAuth login**
  ```json
  {
    "provider": "google",
    "idToken": "optional-id-token",
    "accessToken": "oauth-access-token",
    "refreshToken": "optional-refresh-token",
    "expiresIn": 3600,
    "refreshTokenExpiresIn": 2592000
  }
  ```
  - `provider` accepts `google`, `kakao`, `naver`, or `supabase`.
  - Supply the fields returned by the respective SDK. The backend will validate the token with the provider, upsert the user, and return API tokens.

- **Refresh token**
  ```json
  {
    "refreshToken": "<token-from-login-response>"
  }
  ```

## Token Handling

- Access tokens are JWTs signed with `JWT_ACCESS_SECRET` and expire based on `JWT_ACCESS_EXPIRES_IN`.
- Refresh tokens are random secrets stored as SHA-256 hashes in the database. A new refresh token is minted on each login/refresh, and the previous one is removed.

## Project Structure

```
server/
├── prisma/               # Prisma schema and migrations
├── src/
│   ├── config/           # Environment + Prisma client config
│   ├── controllers/      # Express controllers
│   ├── middleware/       # Error and auth middleware
│   ├── repositories/     # Database access layer
│   ├── routes/           # Express routes
│   ├── services/         # Auth + OAuth business logic
│   └── utils/            # Helpers (tokens, errors, passwords)
└── README.md
```

## Next Steps

- Plug in the React Native app: call the endpoints above and store tokens in secure storage.
- Extend the domain model (e.g., add profile fields, roles) by editing `prisma/schema.prisma` and running `npm run prisma:migrate`.
- Add automated tests (e.g., Jest) covering auth flows before production deployment.
