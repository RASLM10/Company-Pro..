# CompanyPro

CompanyPro is an employee and department management starter based on the supplied Company-Pro repository. The original HTML screens and their CSS are preserved under `public/legacy/`. The React front end and Spring Boot API add a local full-stack path with SQL-backed employee and department records.

## Run on Windows

Install Node.js 20+ and a Java 17+ JDK. The included Maven Wrapper downloads Maven the first time you start the backend, so Maven does not need a separate installation. If `JAVA_HOME` is unset, `run-local.bat` looks for an Eclipse Temurin 17 installation; for another JDK, set `JAVA_HOME` to its install folder first.

1. In a terminal, open this folder and run `npm install` then `npm run dev`.
2. In another terminal, run `cd backend` then `.\mvnw.cmd spring-boot:run`.
3. Open the Vite URL shown in the first terminal. The API runs on `http://localhost:8080`.

The backend uses an embedded H2 SQL database locally and stores it in `backend/data/companypro`. The H2 browser console is disabled. Tables are created automatically. To use PostgreSQL, set `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD` before starting Spring Boot; `DATABASE_URL` must be a JDBC URL such as `jdbc:postgresql://localhost:5432/companypro`.

The React employee directory at `/employees` uses SQL-backed create, edit, delete, and search. The supplied screens remain available under `/legacy/` (for example `/legacy/login.html`). Authentication is handled by Spring Security with an HttpOnly session cookie; employee and department API routes require a valid session. The login username and password are supplied through `COMPANYPRO_ADMIN_USERNAME` and `COMPANYPRO_ADMIN_PASSWORD` environment variables. The password must be at least 12 characters. `run-local.bat` prompts for a local password. API examples are in `postman/CompanyPro.postman_collection.json`. In Postman, set the `adminUsername` and `adminPassword` collection variables, call Authentication → Get CSRF token, then Login; Postman retains the session cookie and automatically fetches CSRF tokens for write requests.

## Deploy to Render\n\nThe root `Dockerfile` builds the React site and packages it into Spring Boot, so the site and API share one origin. `render.yaml` defines a Render web service and PostgreSQL database in Singapore. From Render, create a Blueprint from this repository and provide `COMPANYPRO_ADMIN_USERNAME` and a strong `COMPANYPRO_ADMIN_PASSWORD` when prompted. The configured web service uses the free plan and may sleep when idle; the database uses Render's smallest persistent paid plan, so review current pricing before creating it. Render's free Postgres expires after 30 days and is unsuitable for lasting employee data.\n\nThe public `/api/public/summary` endpoint returns only employee and department totals for the landing page; individual records remain protected. Do not expose H2 console or commit production credentials.

## API

- `GET /api/health` and public aggregate `GET /api/public/summary`
- `GET /api/auth/csrf`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `GET /api/employees` and `GET /api/employees?q=search`
- `GET /api/employees/{id}`, `POST /api/employees`, `PUT /api/employees/{id}`, `DELETE /api/employees/{id}`
- `GET /api/departments`, `POST /api/departments`, `DELETE /api/departments/{id}`

Employee JSON uses `name`, `email`, `phone`, `department`, `position`, `salary`, `joiningDate` (`YYYY-MM-DD`), `status`, and `address`.
