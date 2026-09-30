# ---------- Stage 1: Build ----------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests


# ---------- Stage 2: Run ----------
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Limit heap memory to 384MB to prevent Render 512MB RAM container OOM crash
CMD ["java", "-Xmx384m", "-Xss512k", "-XX:+UseContainerSupport", "-jar", "app.jar"]