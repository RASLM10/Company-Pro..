FROM node:20-alpine AS frontend
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.js ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /workspace/backend
COPY backend/pom.xml ./pom.xml
RUN mvn -B -q dependency:go-offline
COPY backend/src ./src
COPY --from=frontend /workspace/dist ./src/main/resources/static
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-build /workspace/backend/target/companypro-api-secured.jar ./app.jar
EXPOSE 10000
ENTRYPOINT ["sh", "-c", "if [ -n \"${DATABASE_URL:-}\" ]; then case \"$DATABASE_URL\" in postgres://*|postgresql://*) export SPRING_DATASOURCE_URL=jdbc:$DATABASE_URL ;; esac; fi; exec java -jar /app/app.jar"]
