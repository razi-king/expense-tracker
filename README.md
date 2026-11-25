<h1 align="center">💰 Expense Tracker</h1>

<p align="center">
  Full-stack personal expense tracker with stateless JWT authentication and role-based access.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?style=flat-square&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring%20Security-JWT-6DB33F?style=flat-square&logo=springsecurity&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Astro-5-BC52EE?style=flat-square&logo=astro&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-18-20232A?style=flat-square&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/>
</p>

<!-- Add a screenshot or GIF here: it is the first thing reviewers look at -->
<!-- <p align="center"><img src="docs/screenshot.png" width="800"/></p> -->

## Features

- **Dashboard per month:** total spent, number of expenses, daily average and top category
- **Charts:** spending by category (donut) and the last 6 months (bar), with Recharts
- **Expenses:** add, edit and delete, with a category, date and optional note; filter by category
- **Secure by design:** stateless JWT auth (custom Spring Security filter), BCrypt passwords, and every query scoped to the logged-in user, so nobody can read or change someone else's data
- **Consistent API errors** (`{status, error, message, fields}`), shown next to the matching form field
- **Free-hosting aware:** the UI says "waking up the server" instead of looking broken while Render starts
- **Tested:** MockMvc integration tests run against Postgres in CI (auth, validation, CRUD, summary, user isolation)

## API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create an account → `{token, user}` |
| `POST` | `/api/auth/login` | Public | Log in → `{token, user}` |
| `GET` | `/api/auth/me` | JWT | Current user |
| `GET` | `/api/expenses?month=2026-11&category=FOOD` | JWT | Your expenses for a month |
| `GET` | `/api/expenses/summary?month=2026-11` | JWT | Totals, by category, 6-month trend |
| `POST` | `/api/expenses` | JWT | Add an expense |
| `PUT` | `/api/expenses/{id}` | JWT | Update one of your expenses |
| `DELETE` | `/api/expenses/{id}` | JWT | Delete one of your expenses |
| `GET` | `/swagger-ui.html` | Public | Interactive API docs |

## Run locally

**Requirements:** Java 21, Maven, MySQL 8, Node 18+

```bash
# 1. Database
mysql -u root -p -e "CREATE DATABASE expensetracker;"

# 2. Backend (secrets come from environment variables)
cd expense-tracker-backend
export DB_PASSWORD=your_mysql_password
export JWT_SECRET=$(openssl rand -base64 48)
./mvnw spring-boot:run          # http://localhost:8080

# 3. Frontend
cd ../expense-tracker
npm install
npm run dev                     # http://localhost:4321
```

`application.properties` should read secrets from the environment:

```properties
spring.datasource.url=${DATABASE_URL:jdbc:mysql://localhost:3306/expensetracker}
spring.datasource.password=${DB_PASSWORD:}
secretKey=${JWT_SECRET}
```

## Deploy (free)

| Piece | Where |
|---|---|
| Frontend | GitHub Pages, via `.github/workflows/pages.yml` |
| API | Render (Docker), via `render.yaml` |
| Database | Postgres on Neon. The API also runs on MySQL locally, because the driver is picked from the URL |

1. Settings → Pages → Source: **GitHub Actions**
2. Create a Neon Postgres project. Render → New → Blueprint → this repo. Fill in `DATABASE_URL` (`jdbc:postgresql://…?sslmode=require`), `DB_USERNAME` and `DB_PASSWORD`
3. Settings → Secrets and variables → Actions → Variables: `API_URL` = your Render URL. Re-run the Pages workflow

## Roadmap

- [ ] Monthly budgets with alerts
- [ ] CSV export
- [ ] Docker Compose for one-command setup

## Author

**Razi Ahmed** · [GitHub](https://github.com/razi-king) · [LinkedIn](https://www.linkedin.com/in/razi-ahmed-8s/)
